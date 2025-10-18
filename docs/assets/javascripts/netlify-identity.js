const loginPath = "/login/";
const homePath = "/";

let identityBound = false;

const isLoginPage = () => window.location.pathname.startsWith(loginPath);

const redirectIfNeeded = (targetPath) => {
  if (window.location.pathname !== targetPath) {
    window.location.replace(targetPath);
  }
};

const handleInit = (identity) => (user) => {
  const current = user || identity.currentUser?.() || null;

  if (!current && !isLoginPage()) {
    redirectIfNeeded(loginPath);
    return;
  }

  if (current && isLoginPage()) {
    redirectIfNeeded(homePath);
  }
};

const bindIdentity = (identity) => {
  if (identityBound) {
    return identity;
  }

  identityBound = true;
  identity.on("init", handleInit(identity));
  identity.on("login", () => redirectIfNeeded(homePath));
  identity.on("logout", () => redirectIfNeeded(loginPath));
  identity.init();
  return identity;
};

const ensureIdentity = () => {
  const identity = window.netlifyIdentity;
  if (!identity) {
    return null;
  }

  return bindIdentity(identity);
};

const enhanceLoginPage = () => {
  const identity = ensureIdentity();
  if (!identity || !isLoginPage()) {
    return;
  }

  const trigger = document.getElementById("netlify-login-trigger");
  if (trigger && !trigger.dataset.bound) {
    trigger.dataset.bound = "true";
    trigger.addEventListener("click", (event) => {
      event.preventDefault();
      identity.open("login");
    });
  }
};

const init = () => {
  ensureIdentity();
  enhanceLoginPage();
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}

if (window.document$) {
  document$.subscribe(init);
}
