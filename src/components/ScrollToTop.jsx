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

    // Returning to home — Home.jsx always mounts at scrollTop=0 since it
    // re-creates from scratch. Skip the scrollTo to avoid a layout reflow
    // that competes with the page transition animation.
    if (pathname === "/") {
      const shouldScrollToProjects = Boolean(state?.scrollToProjects);
      const hasSessionFlag =
        typeof window !== "undefined" &&
        sessionStorage.getItem(SCROLL_TO_PROJECTS_FLAG) === "1";
      if (shouldScrollToProjects || hasSessionFlag) return;
      // Home remounts fresh — no scrollTo needed (avoids reflow during animation)
      return;
    }

    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname, state]);

  return null;
}
