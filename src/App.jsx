import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect, lazy, Suspense } from "react";
import { Box, Typography } from "@mui/material";
import Home from "./components/Home";
import ScrollToTop from "./components/ScrollToTop";
import "./App.css";

// Lazy load ProjectDetail for code splitting
const ProjectDetail = lazy(() => import("./components/ProjectDetail"));

function AppContent() {
  const location = useLocation();
  
  // Hide project route in URL by replacing with "/" after React Router has processed it
  useEffect(() => {
    if (location.pathname.startsWith("/project/")) {
      requestAnimationFrame(() => {
        window.history.replaceState(
          { ...window.history.state, pathname: location.pathname },
          "",
          "/"
        );
      });
    }
  }, [location.pathname]);

  return (
    <>
      <ScrollToTop />
      <Suspense fallback={
        <Box
          sx={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "#f5f5f7",
          }}
        >
          <Typography>Loading...</Typography>
        </Box>
      }>
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
