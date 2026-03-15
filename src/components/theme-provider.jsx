import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

const ThemeProviderContext = createContext(null);

function getSystemTheme() {
  if (typeof window === "undefined") return "dark";
  return window.matchMedia?.("(prefers-color-scheme: dark)")?.matches ? "dark" : "light";
}

export function ThemeProvider({ children }) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() =>
    typeof window === "undefined"
      ? false
      : window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false
  );

  // Always start from the OS preference on each visit
  const [theme, setThemeState] = useState(getSystemTheme);

  // Track whether the user has manually toggled during this session.
  // While false, real-time OS preference changes are followed automatically.
  const manualOverrideRef = useRef(false);

  // Listen for OS reduced motion changes
  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const motionMedia = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onMotionChange = (event) => setPrefersReducedMotion(event.matches);
    motionMedia.addEventListener("change", onMotionChange);
    return () => motionMedia.removeEventListener("change", onMotionChange);
  }, []);

  // Follow real-time OS color-scheme changes unless the user manually toggled
  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const colorMedia = window.matchMedia("(prefers-color-scheme: dark)");
    const onColorChange = (event) => {
      if (!manualOverrideRef.current) {
        setThemeState(event.matches ? "dark" : "light");
      }
    };
    colorMedia.addEventListener("change", onColorChange);
    return () => colorMedia.removeEventListener("change", onColorChange);
  }, []);

  const shouldReduceEffects = prefersReducedMotion;

  // Apply theme class and color-scheme to <html>
  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;

    if (theme === "dark") {
      root.classList.add("dark");
      root.style.colorScheme = "dark";
    } else {
      root.classList.remove("dark");
      root.style.colorScheme = "light";
    }

    root.classList.toggle("reduce-effects", shouldReduceEffects);
  }, [theme, shouldReduceEffects]);

  const transitionTimerRef = useRef(null);

  const setTheme = useCallback((nextTheme) => {
    // User explicitly toggled — stop following OS changes for this session
    manualOverrideRef.current = true;

    // Persist so the index.html first-paint script can read it
    try { sessionStorage.setItem("theme", nextTheme); } catch { /* ignore */ }

    if (typeof document !== "undefined") {
      const root = document.documentElement;
      root.classList.add("theme-transition");

      // Clear any pending timer from a rapid previous toggle
      if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
      transitionTimerRef.current = setTimeout(() => {
        root.classList.remove("theme-transition");
        transitionTimerRef.current = null;
      }, 250);
    }

    setThemeState(nextTheme);
  }, []);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
    };
  }, []);

  const value = useMemo(
    () => ({
      theme,
      resolvedTheme: theme,
      prefersReducedMotion,
      shouldReduceEffects,
      setTheme,
    }),
    [prefersReducedMotion, shouldReduceEffects, theme, setTheme]
  );

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeProviderContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
