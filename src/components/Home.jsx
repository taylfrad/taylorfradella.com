import { Suspense, lazy, useCallback, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Hero from "./Hero";
import { useTheme } from "@/components/theme-provider";

const Skills = lazy(() => import("./Skills"));
const Projects = lazy(() => import("./Projects"));
const Footer = lazy(() => import("./Footer"));
const ParticlesBackground = lazy(() => import("./ui/particles"));

export default function Home() {
  const { state } = useLocation();
  const { shouldReduceEffects } = useTheme();
  const shouldScrollToProjects = Boolean(state?.scrollToProjects);
  const SCROLL_TO_PROJECTS_FLAG = "scrollToProjectsPending";

  // Basic scroll-to-section helper
  const scrollToSection = useCallback((sectionId) => {
    if (sectionId === "hero" || sectionId === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (sectionId === "contact" || sectionId === "footer") {
      const footer = document.getElementById("footer");
      if (footer) {
        footer.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      return;
    }

    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  // Handle one-time "back to projects" scroll intent.
  useEffect(() => {
    let rafId;
    const hasSessionFlag =
      typeof window !== "undefined" &&
      window.sessionStorage.getItem(SCROLL_TO_PROJECTS_FLAG) === "1";
    const shouldScrollNow = shouldScrollToProjects || hasSessionFlag;

    const clearPendingProjectsScroll = () => {
      if (typeof window !== "undefined") {
        try {
          window.sessionStorage.removeItem(SCROLL_TO_PROJECTS_FLAG);
        } catch {
          // Ignore storage clear failures.
        }

        const currentHistoryState = window.history.state;
        const currentUsrState = currentHistoryState?.usr;
        if (currentUsrState?.scrollToProjects) {
          const nextUsrState = { ...currentUsrState };
          delete nextUsrState.scrollToProjects;
          window.history.replaceState(
            { ...currentHistoryState, usr: nextUsrState },
            "",
            window.location.href,
          );
        }
      }
    };

    if (shouldScrollNow) {
      let attempts = 0;
      const maxAttempts = 360;

      const tryScrollToProjects = () => {
        const el = document.getElementById("projects");
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
          // Clear pending state/flag only after we actually scrolled.
          clearPendingProjectsScroll();
          return;
        }

        attempts += 1;
        if (attempts < maxAttempts) {
          rafId = requestAnimationFrame(tryScrollToProjects);
          return;
        }

        // Fallback: clear state if section could not be found in time.
        clearPendingProjectsScroll();
      };

      rafId = requestAnimationFrame(tryScrollToProjects);
    }

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [SCROLL_TO_PROJECTS_FLAG, shouldScrollToProjects]);

  return (
    <div className="flex min-h-[100svh] flex-col bg-background text-foreground">
      <main className="flex-1 flex flex-col">
        <Hero onNav={scrollToSection} />

        {/* Post-Hero: Particles background (everywhere except Hero). */}
        <div className="relative flex flex-col flex-1 min-h-[100svh]">
          <div className="absolute inset-0 z-0">
            <Suspense
              fallback={
                <div className="absolute inset-0 bg-gradient-to-b from-[#36454f] via-[#070b47] to-black" />
              }
            >
              {shouldReduceEffects ? (
                <div className="absolute inset-0 bg-gradient-to-b from-[#36454f] via-[#070b47] to-black" />
              ) : (
                <ParticlesBackground
                  className="absolute inset-0"
                  quantity={130}
                  staticity={42}
                  ease={52}
                  size={0.8}
                  color="#dbe8ff"
                  maxDpr={1.3}
                  targetFps={40}
                />
              )}
            </Suspense>
            <div className="absolute inset-0 bg-gradient-to-b from-[#36454f]/16 via-[#070b47]/22 to-black/30" />
          </div>
          <div className="relative z-10 flex flex-col">
            <Suspense fallback={<div className="h-40" />}>
              <Skills />
            </Suspense>
            <Suspense fallback={<div className="h-40" />}>
              <Projects />
            </Suspense>
            <Suspense fallback={<div className="h-40" />}>
              <Footer />
            </Suspense>
          </div>
        </div>
      </main>
    </div>
  );
}
