import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./styles/globals.css";
import { ThemeProvider as AppThemeProvider } from "./components/theme-provider.jsx";
import { SCROLL_TO_PROJECTS_FLAG } from "./constants.js";

// Theme is already applied by the inline script in index.html to avoid FOUC.
// Do not duplicate theme detection here.

// Disable browser scroll restoration - MUST be first thing
if (typeof window !== "undefined") {
  if ("scrollRestoration" in window.history) {
    window.history.scrollRestoration = "manual";
  }

  // On full page load, clear "scroll to projects" so we stay on hero.
  try {
    sessionStorage.removeItem(SCROLL_TO_PROJECTS_FLAG);
  } catch {
    // Ignore
  }

  const clearScrollToProjectsState = () => {
    if (
      window.location.pathname !== "/" &&
      window.location.pathname !== ""
    ) return;
    const s = window.history.state || {};
    const next = { ...s, scrollToProjects: false };
    if (s.usr && typeof s.usr === "object") {
      next.usr = { ...s.usr, scrollToProjects: false };
    }
    window.history.replaceState(next, "", window.location.href);
  }

  clearScrollToProjectsState();

  // Immediately set scroll to top before React loads
  window.scrollTo(0, 0);
  if (document.documentElement) {
    document.documentElement.scrollTop = 0;
  }
  if (document.body) {
    document.body.scrollTop = 0;
  }

  // Reveal the scrollbar only while the user is actively scrolling.
  // Uses rAF gating so the class toggle is batched with paint frames.
  const root = document.documentElement;
  const activeClass = "is-scrolling";
  let hideScrollbarTimer = null;
  let scrollTicking = false;

  const revealScrollbar = () => {
    if (scrollTicking) return;
    scrollTicking = true;
    requestAnimationFrame(() => {
      root.classList.add(activeClass);
      if (hideScrollbarTimer) window.clearTimeout(hideScrollbarTimer);
      hideScrollbarTimer = window.setTimeout(() => {
        root.classList.remove(activeClass);
      }, 700);
      scrollTicking = false;
    });
  };

  window.addEventListener("scroll", revealScrollbar, { passive: true });
  window.addEventListener("wheel", revealScrollbar, { passive: true });
  window.addEventListener("touchmove", revealScrollbar, { passive: true });

  // Clean up listeners on HMR dispose to prevent duplicates
  if (import.meta.hot) {
    import.meta.hot.dispose(() => {
      window.removeEventListener("scroll", revealScrollbar);
      window.removeEventListener("wheel", revealScrollbar);
      window.removeEventListener("touchmove", revealScrollbar);
      if (hideScrollbarTimer) window.clearTimeout(hideScrollbarTimer);
    });
  }

  // Mount React after clearing scroll state. Uses queueMicrotask instead of
  // setTimeout(0) — microtasks run before the next task/paint, saving 1-4ms
  // that setTimeout introduces due to browser minimum delay clamping.
  const rootEl = document.getElementById("root");
  const mount = () => {
    clearScrollToProjectsState();
    ReactDOM.createRoot(rootEl).render(
      React.createElement(React.StrictMode, null,
        React.createElement(BrowserRouter, { future: { v7_relativeSplatPath: true, v7_startTransition: true } },
          React.createElement(AppThemeProvider, null,
            React.createElement(App, null)
          )
        )
      )
    );
  };
  if (
    window.location.pathname === "/" ||
    window.location.pathname === ""
  ) {
    queueMicrotask(mount);
  } else {
    mount();
  }
}
