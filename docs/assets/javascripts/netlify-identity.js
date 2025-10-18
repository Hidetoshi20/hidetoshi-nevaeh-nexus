// 登录逻辑说明：
// 1. 任何访问受保护页面的未登录用户都会被引导至 /login/，同时提示“需要登录后才能访问内容”。
// 2. 当用户在登录页完成 Netlify Identity 登录后，页面跳转回首页并显示“登录成功”提示。
// 3. 若用户在登录页已拥有有效会话，则直接跳转到首页，避免停留在登录页。
// 4. 注销后会回到登录页，并提示用户已退出。
// 5. 整体逻辑利用 sessionStorage 记录跳转状态，防止重复重定向，并通过 Toastify 提示关键状态。

// Netlify Identity helpers implemented as an ES module so we can leverage
// top-level `import()` and keep state scoped to this file only.
const loginPath = "/login/";
const homePath = "/";

// Guard so we only register Identity event handlers once, even if Material's
// instant navigation re-executes this module.
let identityBound = false;

const log = (...args) => console.log("[Netlify Identity]", ...args);
const toastStorageKey = "netlify-identity-toast";
const toastModuleUrl =
  "https://cdn.jsdelivr.net/npm/toastify-js@1.12.0/src/toastify-es.js";
const toastStyleUrl =
  "https://cdn.jsdelivr.net/npm/toastify-js@1.12.0/src/toastify.min.css";
let toastLoader = null;
let toastInstance = null;
const loginRedirectMarkerKey = "netlify-identity-login-redirected";

const safeSession = {
  get(key) {
    try {
      return sessionStorage.getItem(key);
    } catch (error) {
      log(`failed to read sessionStorage key ${key}`, error);
      return null;
    }
  },
  set(key, value) {
    try {
      sessionStorage.setItem(key, value);
      return true;
    } catch (error) {
      log(`failed to write sessionStorage key ${key}`, error);
      return false;
    }
  },
  remove(key) {
    try {
      sessionStorage.removeItem(key);
      return true;
    } catch (error) {
      log(`failed to remove sessionStorage key ${key}`, error);
      return false;
    }
  },
};

const ensureToastCss = () => {
  if (document.querySelector('link[data-netlify-toastify="style"]')) {
    return;
  }

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = toastStyleUrl;
  link.setAttribute("data-netlify-toastify", "style");
  document.head.appendChild(link);
};

const loadToastify = () => {
  if (toastInstance) {
    ensureToastCss();
    return Promise.resolve(toastInstance);
  }

  if (!toastLoader) {
    toastLoader = import(/* @vite-ignore */ toastModuleUrl)
      .then((module) => {
        ensureToastCss();
        const Toastify = module?.default || module?.Toastify || module;
        if (!Toastify) {
          throw new Error("Toastify ES module did not export a default");
        }
        toastInstance = Toastify;
        return Toastify;
      })
      .catch((error) => {
        toastLoader = null;
        log("failed to import Toastify ES module", error);
        throw error;
      });
  }

  return toastLoader;
};

const toastStyles = {
  success: { background: "#107a48" },
  info: { background: "#0b7285" },
  warning: { background: "#c17d1c" },
  error: { background: "#c92a2a" },
};

const wasRedirectedFromProtectedPage = () =>
  safeSession.get(loginRedirectMarkerKey) === "1";

const markRedirectToLogin = () => safeSession.set(loginRedirectMarkerKey, "1");

const clearRedirectMarker = () => safeSession.remove(loginRedirectMarkerKey);

const showToast = (message, type = "info") => {
  loadToastify()
    .then((Toastify) => {
      const style = toastStyles[type] || {};
      Toastify({
        text: message,
        duration: 3600,
        close: true,
        gravity: "top",
        position: "center",
        stopOnFocus: true,
        style,
      }).showToast();
    })
    .catch((error) => {
      log("toast display failed", error, message);
    });
};

const queueToast = (message, type = "info") => {
  if (!message) {
    return;
  }

  const payload = JSON.stringify({ message, type });
  if (safeSession.set(toastStorageKey, payload)) {
    log("queued toast", message, `(${type})`);
  }
};

const flushToastQueue = () => {
  const payload = safeSession.get(toastStorageKey);
  if (!payload) {
    return;
  }

  safeSession.remove(toastStorageKey);

  try {
    const { message, type } = JSON.parse(payload);
    if (message) {
      log("displaying queued toast", message, `(${type || "info"})`);
      showToast(message, type);
    }
  } catch (error) {
    log("failed to parse queued toast payload", error);
  }
};

const isLoginPage = () => window.location.pathname.startsWith(loginPath);

const hasJwtCookie = () => {
  return document.cookie.split(";").some((part) => part.trim().startsWith("nf_jwt="));
};

const redirectHome = () => {
  if (window.location.pathname !== homePath) {
    window.location.replace(homePath);
  }
};

const redirectToLogin = () => {
  if (isLoginPage()) {
    return;
  }

  markRedirectToLogin();
  queueToast("需要登录后才能访问内容", "info");
  window.location.replace(loginPath);
};

const getCurrentUser = (identity, user) => {
  if (user) {
    return user;
  }

  try {
    return identity.currentUser?.() || null;
  } catch (error) {
    log("failed to read currentUser", error);
    return null;
  }
};

const handleAuthenticatedInit = () => {
  if (!isLoginPage()) {
    return;
  }

  clearRedirectMarker();
  queueToast("登录成功，正在跳转到首页…", "success");
  redirectHome();
};

const handleUnauthenticatedInit = () => {
  const redirected = wasRedirectedFromProtectedPage();
  const cookiePresent = hasJwtCookie();

  if (isLoginPage()) {
    if (redirected) {
      clearRedirectMarker();
    }
    showToast("请登录以继续访问", "info");
    return;
  }

  if (!redirected && !cookiePresent) {
    redirectToLogin();
    return;
  }

  if (!cookiePresent) {
    log("no jwt cookie detected after init; waiting for login flow", {
      redirected,
    });
  } else {
    log("jwt cookie present but no user yet; skipping client redirect");
  }
};

const handleIdentityInit = (identity) => (user) => {
  const effectiveUser = getCurrentUser(identity, user);
  log(
    "init event",
    effectiveUser ? "authenticated" : "unauthenticated",
    effectiveUser
  );

  if (effectiveUser) {
    handleAuthenticatedInit();
  } else {
    handleUnauthenticatedInit();
  }
};

const handleLoginEvent = () => {
  log("login event received");
  const redirected = wasRedirectedFromProtectedPage();
  clearRedirectMarker();

  if (isLoginPage() || redirected) {
    log("login event originated from login page; navigating home");
    queueToast("登录成功，正在跳转到首页…", "success");
    redirectHome();
    return;
  }

  log("login event detected outside login page; skipping redirect");
};

const handleLogoutEvent = () => {
  log("logout event: redirecting to login page");
  markRedirectToLogin();
  queueToast("您已退出登录", "info");
  window.location.replace(loginPath);
};

const bindIdentityEvents = (identity) => {
  if (identityBound) {
    return;
  }

  log("wiring Netlify Identity event handlers");
  identityBound = true;

  identity.on("init", handleIdentityInit(identity));
  identity.on("login", handleLoginEvent);
  identity.on("logout", handleLogoutEvent);

  log("initialising identity widget");
  identity.init();
};

const ensureIdentity = () => {
  const identity = window.netlifyIdentity;
  if (!identity) {
    log("identity widget not found on window; waiting for script load");
    return null;
  }

  bindIdentityEvents(identity);
  return identity;
};

const enhanceLoginPage = () => {
  const identity = ensureIdentity();
  if (!identity || !isLoginPage()) {
    return;
  }

  const trigger = document.getElementById("netlify-login-trigger");
  if (trigger && !trigger.dataset.bound) {
    trigger.dataset.bound = "true";
    log("binding login button trigger");
    trigger.addEventListener("click", (event) => {
      event.preventDefault();
      log("login button clicked; opening Netlify widget");
      identity.open("login");
    });
  }
};

const init = () => {
  log("initialising authentication helpers for", window.location.pathname);
  flushToastQueue();
  ensureIdentity();
  enhanceLoginPage();
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}

if (window.document$) {
  log("subscribing to Material page navigation events");
  document$.subscribe(init);
}
