import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { SCROLL_TO_PROJECTS_FLAG } from "@/constants";

export default function ScrollToTop() {
  const { pathname, state } = useLocation();
  const shouldScrollToProjects = Boolean(state?.scrollToProjects);

  useEffect(() => {
    // Project-page scroll is deferred to AnimatePresence.onExitComplete so the
    // home page doesn't snap to the hero mid-exit-animation.
    if (pathname.startsWith("/project/")) return;

    const hasSessionFlag =
      typeof window !== "undefined" &&
      sessionStorage.getItem(SCROLL_TO_PROJECTS_FLAG) === "1";
    if (pathname === "/" && (shouldScrollToProjects || hasSessionFlag)) {
      return;
    }
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname, shouldScrollToProjects]);

  return null;
}
