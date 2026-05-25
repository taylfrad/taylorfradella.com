import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { canUseThemeWave, runThemeWave } from "@/lib/themeTransition";

const ThemeProviderContext = createContext(null);

function getSystemTheme() {
  if (typeof window === "undefined") return "dark";
  return window.matchMedia?.("(prefers-color-scheme: dark)")?.matches ? "dark" : "light";
}

// Single source of truth for flipping the theme on <html>. Used by both the
// declarative effect and the imperative swap inside the wave transition.
function applyThemeClass(root, theme) {
  if (theme === "dark") {
    root.classList.add("dark");
    root.style.colorScheme = "dark";
  } else {
    root.classList.remove("dark");
    root.style.colorScheme = "light";
  }
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
    applyThemeClass(root, theme);
    root.classList.toggle("reduce-effects", shouldReduceEffects);
  }, [theme, shouldReduceEffects]);

  const transitionTimerRef = useRef(null);

  const setTheme = useCallback((nextTheme) => {
    // User explicitly toggled — stop following OS changes for this session
    manualOverrideRef.current = true;

    // Persist so the index.html first-paint script can read it
    try { sessionStorage.setItem("theme", nextTheme); } catch { /* ignore */ }

    const root = typeof document !== "undefined" ? document.documentElement : null;

    // Flip <html> synchronously (so the View Transition's "new" snapshot is
    // correctly themed) and update React state for the toggle icon/aria.
    const apply = () => {
      if (root) applyThemeClass(root, nextTheme);
      setThemeState(nextTheme);
    };

    // Preferred path: reveal the new theme behind a sine-wave wipe.
    if (root && canUseThemeWave(shouldReduceEffects)) {
      runThemeWave(root, apply);
      return;
    }

    // Fallback: temporary crossfade class (also yields an instant swap under
    // prefers-reduced-motion, where the global media query zeroes transitions).
    if (root) {
      root.classList.add("theme-transition");

      // Clear any pending timer from a rapid previous toggle
      if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
      transitionTimerRef.current = setTimeout(() => {
        root.classList.remove("theme-transition");
        transitionTimerRef.current = null;
      }, 250);
    }

    apply();
  }, [shouldReduceEffects]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
    };
  }, []);

  const value = useMemo(
    () => ({
      theme,
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
