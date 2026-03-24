import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useRef, lazy, Suspense, Component, useCallback, useMemo, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ScrollToTop from "./components/ScrollToTop";
import HeroShell from "./components/HeroShell";

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

// Page transitions — direction via custom prop.
//
// Forward (dir=1):  slide from right, simultaneous (mode="sync")
//   Entering page slides in from 100%. Exiting page fades in place.
//
// Backward (dir=-1): slide from left, sequential (mode="wait")
//   Exit plays first, then Home mounts and slides in.
//   Heavy 3D (Lanyard) defers its mount so the enter animation isn't blocked.
//
// Uses tweens with smooth ease curves (not springs). Springs start at
// peak velocity on frame 1 which reads as a "snap." Tweens provide
// controlled acceleration → deceleration that feels cinematic.
const EASE = [0.4, 0, 0.2, 1];        // moderate accel, long smooth decel
const EASE_ACCEL = [0.4, 0, 1, 1];    // accelerating out

const pageVariants = {
  initial: (dir) => ({
    x: dir > 0 ? "100%" : "-30%",
    ...(dir < 0 && { opacity: 0 }),
  }),
  animate: (dir) => ({
    x: "0%",
    opacity: 1,
    transition: {
      x: { duration: dir > 0 ? 0.42 : 0.35, ease: EASE },
      opacity: dir < 0
        ? { duration: 0.3, ease: EASE }
        : { duration: 0 },
    },
  }),
  exit: (dir) => (dir > 0
    ? {
        opacity: 0,
        transition: { opacity: { duration: 0.28, ease: "easeOut" } },
      }
    : {
        x: "20%",
        opacity: 0,
        transition: {
          x: { duration: 0.15, ease: EASE_ACCEL },
          opacity: { duration: 0.13, ease: "easeOut" },
        },
      }
  ),
};

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

  // Memoized direction — compute only when pathname changes
  const direction = useMemo(
    () => (location.pathname.startsWith("/project/") ? 1 : -1),
    [location.pathname],
  );

  useEffect(() => {
    isInitialLoad.current = false;
    prevPathRef.current = location.pathname;
  }, [location.pathname]);

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

  // Memoized exit handler — AnimatePresence receives stable reference
  const handleExitComplete = useCallback(() => {
    if (location.pathname.startsWith("/project/")) {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }
  }, [location.pathname]);

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
          mode={direction > 0 ? "sync" : "wait"}
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
              // Flash-frame fix: in wait mode (backward), hide the entering
              // page until Framer applies the initial variant.
              ...(!isInitialLoad.current && direction < 0 && { opacity: 0 }),
            }}
          >
            <ErrorBoundary>
              <Suspense fallback={fallback}>
                <Routes location={location}>
                  <Route path="/" element={<Home />} />
                  <Route path="/project/:id" element={<ProjectDetail />} />
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
