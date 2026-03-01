import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const REDUCE_EFFECTS_KEY = "reduce-effects";

const ThemeProviderContext = createContext(null);

function getStoredReduceEffects() {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(REDUCE_EFFECTS_KEY) === "true";
}

export function ThemeProvider({ children }) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() =>
    typeof window === "undefined"
      ? false
      : window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false
  );
  const [reduceEffects, setReduceEffectsState] = useState(() =>
    getStoredReduceEffects()
  );

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const motionMedia = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onMotionChange = (event) => setPrefersReducedMotion(event.matches);
    motionMedia.addEventListener("change", onMotionChange);
    return () => motionMedia.removeEventListener("change", onMotionChange);
  }, []);

  const shouldReduceEffects = prefersReducedMotion || reduceEffects;

  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    root.classList.add("dark");
    root.classList.toggle("reduce-effects", shouldReduceEffects);
    root.style.colorScheme = "dark";
  }, [shouldReduceEffects]);

  useEffect(() => {
    try {
      window.localStorage.setItem(REDUCE_EFFECTS_KEY, String(reduceEffects));
    } catch {
      // ignore storage failures
    }
  }, [reduceEffects]);

  const setReduceEffects = useCallback((nextValue) => {
    setReduceEffectsState(Boolean(nextValue));
  }, []);

  const value = useMemo(
    () => ({
      theme: "dark",
      resolvedTheme: "dark",
      prefersReducedMotion,
      reduceEffects,
      shouldReduceEffects,
      setReduceEffects,
    }),
    [prefersReducedMotion, reduceEffects, setReduceEffects, shouldReduceEffects]
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
