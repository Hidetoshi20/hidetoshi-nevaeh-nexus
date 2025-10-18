(() => {
  // Netlify Identity scripts run on every MkDocs page load. This wrapper keeps
  // the logic isolated and prevents leaking variables into the global scope.
  const loginPath = "/login/";
  const homePath = "/";
  // Guard so we only register Netlify Identity event handlers once even if
  // MkDocs re-initialises the page via instant navigation.
  let identityBound = false;

  // Helper: detect whether the current location is the dedicated login page.
  const isLoginPage = () => window.location.pathname.startsWith(loginPath);

  // Helper: send unauthenticated visitors to the login screen. We only redirect
  // if they are not already on the login page to avoid loops.
  const redirectToLogin = () => {
    if (!isLoginPage()) {
      window.location.replace(loginPath);
    }
  };

  // Helper: send authenticated visitors to the homepage immediately after
  // login or when they revisit the login screen while already signed in.
  const redirectHome = () => {
    if (window.location.pathname !== homePath) {
      window.location.replace(homePath);
    }
  };

  // Ensure the Netlify Identity library is loaded and event handlers are
  // attached exactly once. Returns the identity object when available.
  const ensureIdentity = () => {
    const identity = window.netlifyIdentity;
    if (!identity) {
      return null;
    }

    if (!identityBound) {
      identityBound = true;

      // When Netlify Identity finishes initialising, we know whether the
      // visitor is authenticated. Redirect unauthenticated users to the login
      // screen, or send authenticated users away from the login page.

      identity.on("init", (user) => {
        if (user) {
          if (isLoginPage()) {
            redirectHome();
          }
        } else {
          redirectToLogin();
        }
      });

      // Once login succeeds we send the visitor to the homepage.
      identity.on("login", redirectHome);

      identity.on("logout", () => {
        window.location.replace(loginPath);
      });

      identity.init();
    }

    return identity;
  };

  const enhanceLoginPage = () => {
    const identity = ensureIdentity();
    if (!identity || !isLoginPage()) {
      return;
    }

    // Bind the login button so users can manually open the Netlify modal.
    const trigger = document.getElementById("netlify-login-trigger");
    if (trigger && !trigger.dataset.bound) {
      trigger.dataset.bound = "true";
      trigger.addEventListener("click", (event) => {
        event.preventDefault();
        identity.open("login");
      });
    }
  };

  // Kick everything off: make sure Identity is set up and apply page-specific
  // enhancements (binding the login button).
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
})();
