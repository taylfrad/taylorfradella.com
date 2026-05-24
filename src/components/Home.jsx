import { Suspense, lazy, useCallback, useEffect, useLayoutEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Hero from "./Hero";
import BackToTop from "@/components/ui/BackToTop";
import { SCROLL_TO_PROJECTS_FLAG } from "@/constants";
import { scrollToSection } from "@/lib/navigation";

const Projects = lazy(() => import("./Projects"));
const Footer = lazy(() => import("./Footer"));

function HomeSections() {
  return (
    <div className="relative flex min-h-[100svh] flex-1 flex-col">
      <div className="post-hero-content relative flex flex-col">
        {/* Projects is the only in-page section on home now. Skills / Work /
            About each live on their own routes and slide up from below. */}
        <div id="projects" className="h-0 w-0" aria-hidden />
        <Suspense fallback={<div className="h-40" />}>
          <Projects />
        </Suspense>
        <div id="footer" className="h-0 w-0" aria-hidden />
        <Suspense fallback={<div className="h-40" />}>
          <Footer />
        </Suspense>
      </div>
    </div>
  );
}

export default function Home() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const shouldScrollToProjects = Boolean(state?.scrollToProjects);

  // Nav handler — Skills / Work / About are routes (vertical slide); Projects
  // is the only in-page section that scrolls (it lives under the hero).
  const handleNav = useCallback(
    (target) => {
      if (target === "work" || target === "skills" || target === "about") {
        navigate(`/${target}`);
        return;
      }
      scrollToSection(target);
    },
    [navigate],
  );

  // If we're returning from a project detail view and immediately scrolling
  // back down to Projects, consider the hero "ready" up front.
  const initialHeroReady = Boolean(
    state?.from === "projects" ||
      state?.restore ||
      shouldScrollToProjects,
  );

  const heroReadySetRef = useRef(initialHeroReady);

  const handleHeroReady = useCallback(() => {
    if (heroReadySetRef.current) return;
    heroReadySetRef.current = true;
  }, []);

  const clearPendingProjectsScroll = useCallback(() => {
    try {
      sessionStorage.removeItem(SCROLL_TO_PROJECTS_FLAG);
    } catch {
      // ignore
    }
    const s = window.history.state;
    if (s?.scrollToProjects) {
      window.history.replaceState(
        { ...s, scrollToProjects: false },
        "",
        window.location.href,
      );
    }
  }, []);

  // Synchronously jump scroll before the first paint so the incoming slide
  // animation starts at the correct position. If scrollY was saved when the
  // user clicked "View Project", restore to that exact position so the
  // specific project card is in view. Otherwise fall back to #projects anchor.
  const layoutScrollHandledRef = useRef(false);
  useLayoutEffect(() => {
    const hasSessionFlag = sessionStorage.getItem(SCROLL_TO_PROJECTS_FLAG) === "1";
    if (shouldScrollToProjects || hasSessionFlag) {
      const savedY = state?.scrollY;
      if (savedY != null) {
        window.scrollTo({ top: savedY, left: 0, behavior: "instant" });
      } else {
        const el = document.getElementById("projects");
        if (el) el.scrollIntoView({ behavior: "instant", block: "start" });
      }
      layoutScrollHandledRef.current = true;
      clearPendingProjectsScroll();
      if (!heroReadySetRef.current) {
        heroReadySetRef.current = true;
      }
    }
  // Intentionally empty — must run exactly once before first paint so the
  // incoming slide animation starts at the correct scroll position.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fallback: fires when useLayoutEffect couldn't find #projects (e.g. the
  // anchor hadn't committed yet). Uses a MutationObserver instead of the old
  // RAF polling loop (up to 360 frames) — event-driven, no busy-waiting.
  useEffect(() => {
    if (layoutScrollHandledRef.current) return;

    const hasSessionFlag = sessionStorage.getItem(SCROLL_TO_PROJECTS_FLAG) === "1";

    if (!heroReadySetRef.current && (shouldScrollToProjects || hasSessionFlag)) {
      heroReadySetRef.current = true;
    }

    if (!(shouldScrollToProjects || hasSessionFlag)) return;

    const savedY = state?.scrollY;
    if (savedY != null) {
      window.scrollTo({ top: savedY, left: 0, behavior: "instant" });
      clearPendingProjectsScroll();
      return;
    }

    // The #projects anchor is outside Suspense, so it's almost always in the
    // DOM by the time this effect runs. Try synchronously first.
    const el = document.getElementById("projects");
    if (el) {
      el.scrollIntoView({ behavior: "instant", block: "start" });
      clearPendingProjectsScroll();
      return;
    }

    // Unlikely fallback: watch for the element to appear.
    const observer = new MutationObserver(() => {
      const target = document.getElementById("projects");
      if (target) {
        observer.disconnect();
        target.scrollIntoView({ behavior: "instant", block: "start" });
        clearPendingProjectsScroll();
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, [shouldScrollToProjects, clearPendingProjectsScroll, state]);


  return (
    <div className="flex min-h-[100svh] flex-col text-ink-1">
      <a href="#main-content" className="skip-nav">
        Skip to main content
      </a>
      <main id="main-content" className="relative z-10 flex flex-1 flex-col">
        <Hero
          onNav={handleNav}
          onHeroReady={handleHeroReady}
          initialHeroReady={initialHeroReady}
        />

        <HomeSections />
      </main>

      <BackToTop />
    </div>
  );
}
