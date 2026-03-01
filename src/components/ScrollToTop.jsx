import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname, state } = useLocation();
  const shouldScrollToProjects = Boolean(state?.scrollToProjects);
  const SCROLL_TO_PROJECTS_FLAG = "scrollToProjectsPending";

  useEffect(() => {
    const hasSessionFlag =
      typeof window !== "undefined" &&
      window.sessionStorage.getItem(SCROLL_TO_PROJECTS_FLAG) === "1";

    // If we're returning to "/" with scrollToProjects, Home handles the scroll.
    if (pathname === "/" && (shouldScrollToProjects || hasSessionFlag)) {
      return;
    }

    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [SCROLL_TO_PROJECTS_FLAG, pathname, shouldScrollToProjects]);

  return null;
}
