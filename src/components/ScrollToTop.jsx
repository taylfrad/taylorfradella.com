import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { SCROLL_TO_PROJECTS_FLAG } from "@/constants";

export default function ScrollToTop() {
  const { pathname, state } = useLocation();
  const prevPathRef = useRef(pathname);

  useEffect(() => {
    // Only act on actual route changes, not state-only updates.
    if (pathname === prevPathRef.current) return;
    prevPathRef.current = pathname;

    // Project-page scroll is deferred to AnimatePresence.onExitComplete.
    if (pathname.startsWith("/project/")) return;

    // Returning to home with scrollToProjects — Home.jsx handles positioning.
    if (pathname === "/") {
      const shouldScrollToProjects = Boolean(state?.scrollToProjects);
      const hasSessionFlag =
        typeof window !== "undefined" &&
        sessionStorage.getItem(SCROLL_TO_PROJECTS_FLAG) === "1";
      if (shouldScrollToProjects || hasSessionFlag) return;
    }

    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname, state]);

  return null;
}
