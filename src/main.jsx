import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "/src/styles/Theme.js";

// Disable browser scroll restoration - MUST be first thing
if (typeof window !== 'undefined') {
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
  
  // Also scroll main container if it exists
  const scrollMainToTop = () => {
    const mainContent = document.querySelector("main");
    if (mainContent) {
      mainContent.scrollTop = 0;
      mainContent.scrollLeft = 0;
    }
  };
  
  // Try immediately and on DOM ready
  scrollMainToTop();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', scrollMainToTop);
  } else {
    scrollMainToTop();
  }
  
  // Preconnect to external domains for faster loading
  const preconnectDomains = [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
    'https://cdn.jsdelivr.net',
  ];
  
  preconnectDomains.forEach(domain => {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = domain;
    if (domain.includes('fonts.gstatic.com')) {
      link.crossOrigin = 'anonymous';
    }
    document.head.appendChild(link);
  });
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
