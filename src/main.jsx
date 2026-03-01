import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./styles/globals.css";
import { ThemeProvider as AppThemeProvider } from "./components/theme-provider.jsx";

// Apply fixed dark theme class ASAP to avoid a flash
if (typeof document !== "undefined") {
  document.documentElement.classList.add("dark");
  document.documentElement.style.colorScheme = "dark";
}

// Disable browser scroll restoration - MUST be first thing
if (typeof window !== "undefined") {
  if ("scrollRestoration" in window.history) {
    window.history.scrollRestoration = "manual";
  }

  // Immediately set scroll to top before React loads
  window.scrollTo(0, 0);
  if (document.documentElement) {
    document.documentElement.scrollTop = 0;
  }
  if (document.body) {
    document.body.scrollTop = 0;
  }

  // Reveal the scrollbar only while the user is actively scrolling.
  const root = document.documentElement;
  const activeClass = "is-scrolling";
  let hideScrollbarTimer = null;

  const revealScrollbar = () => {
    root.classList.add(activeClass);
    if (hideScrollbarTimer) window.clearTimeout(hideScrollbarTimer);
    hideScrollbarTimer = window.setTimeout(() => {
      root.classList.remove(activeClass);
    }, 700);
  };

  window.addEventListener("scroll", revealScrollbar, { passive: true });
  window.addEventListener("wheel", revealScrollbar, { passive: true });
  window.addEventListener("touchmove", revealScrollbar, { passive: true });
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
      <AppThemeProvider>
        <App />
      </AppThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
