import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useRef, lazy, Suspense, Component, useCallback, useMemo, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ScrollToTop from "./components/ScrollToTop";
import HeroShell from "./components/HeroShell";
import { SCROLL_TO_PROJECTS_FLAG } from "@/constants";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="grid min-h-[100svh] place-items-center" style={{ background: "var(--bg-primary)" }}>
          <div className="text-center">
            <p className="mb-4 text-lg font-semibold" style={{ color: "var(--text-primary)" }}>Something went wrong</p>
            <button
              onClick={() => window.location.reload()}
              className="rounded-lg px-4 py-2 text-sm font-medium"
              style={{ background: "var(--text-tertiary)", color: "var(--bg-primary)" }}
            >
              Reload page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const Home = lazy(() => import("./components/Home"));
const ProjectDetail = lazy(() => import("./components/ProjectDetail"));
const Work = lazy(() => import("./components/Work"));
const SkillsPage = lazy(() => import("./components/SkillsPage"));
const AboutPage = lazy(() => import("./components/AboutPage"));

// Page transitions — direction encoded as { axis, dir }.
//
// Horizontal axis ("x") — between `/` and `/project/:id`:
//   Forward (dir=1):  slide from right, simultaneous (mode="sync")
//   Backward (dir=-1): slide from left, sequential (mode="wait")
//
// Vertical axis ("y") — between `/` and `/work`:
//   Forward (dir=1):  Work slides up from bottom; hero exits up off the top.
//   Backward (dir=-1): Work slides down off the bottom; hero enters from top.
//
// Uses tweens with smooth ease curves (not springs). Springs start at peak
// velocity which reads as a "snap." Tweens give cinematic accel → decel.
const EASE = [0.25, 0.1, 0.25, 1];    // smooth, unhurried cubic
const EASE_ACCEL = [0.4, 0, 0.8, 1];  // gentle accelerating out

// Vertical animation tuning — deliberate and cinematic.
const Y_DURATION = 1.2;

const pageVariants = {
  initial: ({ axis, dir, kind }) => {
    if (axis === "none") {
      return { x: "0%", y: "0%", opacity: 1 };
    }
    if (axis === "y") {
      return { y: dir > 0 ? "100vh" : "-100vh", x: "0%", opacity: 1 };
    }
    if (kind === "sibling") {
      return { x: dir > 0 ? "100%" : "-100%", y: "0%" };
    }
    return {
      x: dir > 0 ? "100%" : "-30%",
      y: "0%",
      ...(dir < 0 && { opacity: 0 }),
    };
  },
  animate: ({ axis, dir, kind }) => {
    if (axis === "none") {
      return { x: "0%", y: "0%", opacity: 1, transition: { duration: 0 } };
    }
    if (axis === "y") {
      return {
        x: "0%",
        y: 0,
        opacity: 1,
        transition: { y: { duration: Y_DURATION, ease: EASE } },
      };
    }
    if (kind === "sibling") {
      return {
        x: "0%",
        y: "0%",
        opacity: 1,
        transition: { x: { duration: Y_DURATION, ease: EASE } },
      };
    }
    return {
      x: "0%",
      y: "0%",
      opacity: 1,
      transition: {
        x: { duration: Y_DURATION, ease: EASE },
        opacity: dir < 0 ? { duration: 0.6, ease: EASE } : { duration: 0 },
      },
    };
  },
  exit: ({ axis, dir, kind }) => {
    if (axis === "none") {
      return { x: "0%", y: "0%", opacity: 0, transition: { duration: 0.15 } };
    }
    if (axis === "y") {
      return {
        y: dir > 0 ? "-100vh" : "100vh",
        x: "0%",
        opacity: 1,
        transition: { y: { duration: Y_DURATION, ease: EASE } },
      };
    }
    if (kind === "sibling") {
      return {
        x: dir > 0 ? "-100%" : "100%",
        y: "0%",
        opacity: 1,
        transition: { x: { duration: Y_DURATION, ease: EASE } },
      };
    }
    return dir > 0
      ? {
          opacity: 0,
          transition: { opacity: { duration: 0.6, ease: EASE } },
        }
      : {
          x: "20%",
          opacity: 0,
          transition: {
            x: { duration: Y_DURATION, ease: EASE },
            opacity: { duration: 0.6, ease: EASE },
          },
        };
  },
};

// Classify a pathname into a route group so transitions can compare source
// + destination without string-checking everywhere. All subpages (work,
// skills, about) sit spatially below the hero — vertical slide axis.
const SUBPAGES = new Set(["/work", "/skills", "/about"]);
// Nav order for subpage-to-subpage direction. Pages "to the right" in this
// list slide in from the right; pages "to the left" slide in from the left.
// (Projects is on home — not a subpage — so it isn't in this list.)
const SUBPAGE_NAV_ORDER = { "/skills": 0, "/work": 1, "/about": 2 };
function classifyPath(pathname) {
  if (pathname.startsWith("/project/")) return "project";
  if (SUBPAGES.has(pathname)) return "subpage";
  return "home";
}

// Memoized fallback components — prevents recreation on parent re-render
const ProjectFallback = memo(function ProjectFallback() {
  return (
    <div className="min-h-[100svh] w-full grid place-items-center" style={{ background: "var(--bg-primary)" }}>
      <div className="text-sm" style={{ color: "var(--text-secondary)" }}>Loading…</div>
    </div>
  );
});

// Prefetch hero chunks as soon as app mounts (home route) for faster hero load
function useHeroPrefetch() {
  const location = useLocation();
  useEffect(() => {
    if (location.pathname === "/" || location.pathname === "") {
      import("./components/backgrounds/HeroBackground");
      import("./components/Lanyard");
    }
  }, [location.pathname]);
}

function AppContent() {
  const location = useLocation();
  const prevPathRef = useRef(location.pathname);
  const isInitialLoad = useRef(true);
  useHeroPrefetch();

  // Direction is computed from prev + current pathname so we can tell forward
  // vs. backward AND which axis to use. Stored as { axis, dir, kind }.
  //   kind = "sibling" → full slide both directions (Skills↔Work↔About)
  //   kind = "project" → original /project flow (fade-back on dir=-1)
  const direction = useMemo(() => {
    const from = classifyPath(prevPathRef.current);
    const to = classifyPath(location.pathname);
    // home <-> subpage : vertical slide (Work / Skills / About sit below hero)
    // Exception: when returning home with scrollToProjects, skip the slide
    // so we land directly at the projects section without showing the hero.
    if ((from === "home" && to === "subpage") || (from === "subpage" && to === "home")) {
      const goingHomeToProjects = to === "home" && (
        location.state?.scrollToProjects ||
        sessionStorage.getItem(SCROLL_TO_PROJECTS_FLAG) === "1"
      );
      if (goingHomeToProjects) {
        return { axis: "none", dir: 0, kind: "instant" };
      }
      return { axis: "y", dir: to === "subpage" ? 1 : -1, kind: "subpage" };
    }
    // subpage <-> subpage : direction follows nav-order. Destination to the
    // RIGHT of source = slide in from right (dir=1); to the LEFT = from left.
    if (from === "subpage" && to === "subpage") {
      const fromIdx = SUBPAGE_NAV_ORDER[prevPathRef.current] ?? 0;
      const toIdx = SUBPAGE_NAV_ORDER[location.pathname] ?? 0;
      return { axis: "x", dir: toIdx > fromIdx ? 1 : -1, kind: "sibling" };
    }
    // home <-> project : horizontal (existing behavior)
    return { axis: "x", dir: to === "project" ? 1 : -1, kind: "project" };
  }, [location.pathname, location.state?.scrollToProjects]);

  useEffect(() => {
    isInitialLoad.current = false;
    prevPathRef.current = location.pathname;
  }, [location.pathname]);

  // Lock body scroll during the vertical page transition so:
  //   1. The user can't scroll mid-animation (would desync the pages)
  //   2. The off-screen translated page doesn't add document height
  // Uses overflow:clip instead of hidden to avoid scrollbar width change
  // (hidden causes a reflow/jump as the scrollbar disappears and reappears).
  useEffect(() => {
    if (direction.axis !== "y" || isInitialLoad.current) return undefined;
    document.documentElement.style.overflow = "clip";
    document.body.style.overflow = "clip";
    const t = setTimeout(() => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    }, 1400); // Y_DURATION (1.2s) + 200ms buffer
    return () => {
      clearTimeout(t);
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, [direction.axis, location.pathname]);

  // Hide project route in URL after React Router processes it
  useEffect(() => {
    if (location.pathname.startsWith("/project/")) {
      const rafId = requestAnimationFrame(() => {
        window.history.replaceState(
          { ...window.history.state, pathname: location.pathname },
          "",
          "/",
        );
      });
      return () => cancelAnimationFrame(rafId);
    }
    return undefined;
  }, [location.pathname]);

  // Memoized exit handler — AnimatePresence receives stable reference.
  // Reset scroll on project + subpage entries so they always start at the top.
  // Skip when returning to home with scrollToProjects (already positioned).
  const handleExitComplete = useCallback(() => {
    if (location.pathname === "/" && (location.state?.scrollToProjects || sessionStorage.getItem(SCROLL_TO_PROJECTS_FLAG) === "1")) {
      return;
    }
    if (
      location.pathname.startsWith("/project/") ||
      SUBPAGES.has(location.pathname)
    ) {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }
  }, [location.pathname, location.state]);

  // Memoize fallback to prevent recreation
  const fallback = useMemo(
    () =>
      location.pathname === "/" || location.pathname === "" ? (
        <HeroShell />
      ) : (
        <ProjectFallback />
      ),
    [location.pathname],
  );

  return (
    <>
      <ScrollToTop />
      <div style={{ display: "grid", gridTemplateColumns: "1fr", overflowX: "clip", background: "var(--bg-secondary)" }}>
        <AnimatePresence
          initial={false}
          custom={direction}
          // Vertical transitions stay in "sync" both directions so the two
          // pages move together (one sliding off as the other slides on).
          // Horizontal keeps the existing sync/wait split.
          mode={
            direction.axis === "y"
              ? "sync"
              : direction.kind === "sibling"
                ? "sync"
                : direction.dir > 0
                  ? "sync"
                  : "wait"
          }
          onExitComplete={handleExitComplete}
        >
          <motion.div
            key={location.pathname}
            custom={direction}
            initial={isInitialLoad.current ? false : "initial"}
            animate="animate"
            exit="exit"
            variants={pageVariants}
            style={{
              gridRow: "1 / -1",
              gridColumn: "1 / -1",
              minWidth: 0,
              minHeight: "100svh",
              background: "var(--bg-secondary)",
              willChange: direction.axis !== "none" ? "transform" : "auto",
              // Flash-frame fix: in wait mode (project backward), hide the
              // entering page until Framer applies the initial variant.
              // Sibling navigation uses sync mode and a full off-screen
              // x-translate, so doesn't need this.
              ...(!isInitialLoad.current &&
                direction.axis === "x" &&
                direction.kind === "project" &&
                direction.dir < 0 && { opacity: 0 }),
            }}
          >
            <ErrorBoundary>
              <Suspense fallback={fallback}>
                <Routes location={location}>
                  <Route path="/" element={<Home />} />
                  <Route path="/project/:id" element={<ProjectDetail />} />
                  <Route path="/work" element={<Work />} />
                  <Route path="/skills" element={<SkillsPage />} />
                  <Route path="/about" element={<AboutPage />} />
                </Routes>
              </Suspense>
            </ErrorBoundary>
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
}

function App() {
  return <AppContent />;
}

export default App;
