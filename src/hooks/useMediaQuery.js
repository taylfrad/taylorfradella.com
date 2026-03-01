import { useState, useEffect } from "react";

/**
 * Match Tailwind breakpoints: sm 640px, md 768px, lg 1024px
 */
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const m = window.matchMedia(query);
    setMatches(m.matches);
    const handler = (e) => setMatches(e.matches);

    if (typeof m.addEventListener === "function") {
      m.addEventListener("change", handler);
      return () => m.removeEventListener("change", handler);
    }

    // Legacy Safari fallback.
    m.addListener(handler);
    return () => m.removeListener(handler);
  }, [query]);

  return matches;
}
