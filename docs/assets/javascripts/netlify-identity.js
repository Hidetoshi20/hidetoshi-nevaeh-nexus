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
  try {
    sessionStorage.setItem(
      toastStorageKey,
      JSON.stringify({ message, type })
    );
    log("queued toast", message, `(${type})`);
  } catch (error) {
    log("failed to queue toast", error);
  }
};

const flushToastQueue = () => {
  try {
    const payload = sessionStorage.getItem(toastStorageKey);
    if (!payload) {
      return;
    }

    sessionStorage.removeItem(toastStorageKey);
    const { message, type } = JSON.parse(payload);
    if (message) {
      log("displaying queued toast", message, `(${type || "info"})`);
      showToast(message, type);
    }
  } catch (error) {
    log("failed to flush toast", error);
  }
};

const isLoginPage = () => window.location.pathname.startsWith(loginPath);

const redirectHome = () => {
  if (window.location.pathname !== homePath) {
    window.location.replace(homePath);
  }
};

const redirectToLogin = () => {
  if (isLoginPage()) {
    return;
  }

  try {
    sessionStorage.setItem(loginRedirectMarkerKey, "1");
  } catch (error) {
    log("failed to persist login redirect marker", error);
  }

  queueToast("需要登录后才能访问内容", "info");
  window.location.replace(loginPath);
};

const ensureIdentity = () => {
  const identity = window.netlifyIdentity;
  if (!identity) {
    log("identity widget not found on window; waiting for script load");
    return null;
  }

  if (!identityBound) {
    log("wiring Netlify Identity event handlers");
    identityBound = true;

    identity.on("init", (user) => {
      log("init event", user ? "authenticated" : "unauthenticated", user);
      if (user && isLoginPage()) {
        try {
          sessionStorage.removeItem(loginRedirectMarkerKey);
        } catch (error) {
          log("failed to clear login redirect marker", error);
        }
        queueToast("登录成功，正在跳转到首页…", "success");
        redirectHome();
        return;
      }

      if (!user) {
        const wasRedirectedRecently = (() => {
          try {
            return sessionStorage.getItem(loginRedirectMarkerKey) === "1";
          } catch (error) {
            log("failed to read login redirect marker", error);
            return false;
          }
        })();

        if (isLoginPage()) {
          if (wasRedirectedRecently) {
            try {
              sessionStorage.removeItem(loginRedirectMarkerKey);
            } catch (error) {
              log("failed to clear login redirect marker", error);
            }
          }
          showToast("请登录以继续访问", "info");
          return;
        }

        if (!wasRedirectedRecently) {
          redirectToLogin();
        }
      }
    });

    identity.on("login", () => {
      log("login event received");

      let wasRedirected = false;
      try {
        wasRedirected = sessionStorage.getItem(loginRedirectMarkerKey) === "1";
        sessionStorage.removeItem(loginRedirectMarkerKey);
      } catch (error) {
        log("failed to handle login redirect marker", error);
      }

      if (isLoginPage() || wasRedirected) {
        log("login event originated from login page; navigating home");
        queueToast("登录成功，正在跳转到首页…", "success");
        redirectHome();
        return;
      }

      log("login event detected outside login page; skipping redirect");
    });

    identity.on("logout", () => {
      log("logout event: redirecting to login page");
      try {
        sessionStorage.setItem(loginRedirectMarkerKey, "1");
      } catch (error) {
        log("failed to persist login redirect marker", error);
      }
      queueToast("您已退出登录", "info");
      window.location.replace(loginPath);
    });

    log("initialising identity widget");
    identity.init();
  }

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
