import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect, lazy, Suspense } from "react";
import ScrollToTop from "./components/ScrollToTop";

const Home = lazy(() => import("./components/Home"));
const ProjectDetail = lazy(() => import("./components/ProjectDetail"));

function AppContent() {
  const location = useLocation();
  
  // Hide project route in URL by replacing with "/" after React Router has processed it
  useEffect(() => {
    if (location.pathname.startsWith("/project/")) {
      const rafId = requestAnimationFrame(() => {
        window.history.replaceState(
          { ...window.history.state, pathname: location.pathname },
          "",
          "/"
        );
      });

      return () => cancelAnimationFrame(rafId);
    }

    return undefined;
  }, [location.pathname]);

  return (
    <>
      <ScrollToTop />
      <Suspense
        fallback={
          <div className="min-h-[100svh] w-full bg-background text-foreground grid place-items-center">
            <div className="text-sm text-muted-foreground">Loading…</div>
          </div>
        }
      >
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/project/:id" element={<ProjectDetail />} />
        </Routes>
      </Suspense>
    </>
  );
}

function App() {
  return <AppContent />;
}

export default App;
