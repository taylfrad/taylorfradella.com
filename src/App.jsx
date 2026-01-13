import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, IconButton } from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Hero from "./components/Hero";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import StatementSection from "./components/StatementSection";
import Footer from "./components/Footer";
import "./App.css";

function App() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const heroRef = useRef(null);
  const skillsRef = useRef(null);
  const projectsRef = useRef(null);
  const mainScrollRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollContainer = mainScrollRef.current || document.querySelector("main");
      let currentScrollPosition = 0;
      
      if (scrollContainer) {
        currentScrollPosition = scrollContainer.scrollTop;
      } else {
        currentScrollPosition = window.scrollY || window.pageYOffset;
      }
      
      setShowScrollTop(currentScrollPosition > 200);
    };

    const scrollContainer = mainScrollRef.current || document.querySelector("main");
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll, { passive: true });
    }

    setTimeout(handleScroll, 100);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollContainer) {
        scrollContainer.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  useEffect(() => {
    const path = location.pathname;
    const scrollContainer = mainScrollRef.current || document.querySelector("main");
    let element = null;

    if (path === "/" || path === "/hero") {
      element = heroRef.current;
    } else if (path === "/skills") {
      element = skillsRef.current;
    } else if (path === "/projects") {
      element = projectsRef.current;
    } else if (path === "/contact" || path === "/footer") {
      const footerElement = document.getElementById("footer");
      if (footerElement) {
        setTimeout(() => {
          // Footer is outside main container, scroll window to it
          footerElement.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 200);
        return;
      }
    }

    if (element) {
      // Wait for DOM to be ready, then scroll window to element
      requestAnimationFrame(() => {
        setTimeout(() => {
          if (element) {
            // Use scrollIntoView which works with window scrolling
            element.scrollIntoView({ 
              behavior: "smooth", 
              block: "start",
              inline: "nearest"
            });
          }
        }, 100);
      });
    }
  }, [location]);

  const scrollToSection = (sectionId) => {
    if (sectionId === "hero" || sectionId === "/") {
      navigate("/");
    } else if (sectionId === "skills") {
      navigate("/skills");
    } else if (sectionId === "projects") {
      navigate("/projects");
    } else if (sectionId === "contact" || sectionId === "footer") {
      navigate("/contact");
    }
  };

  const scrollToTop = () => {
    const mainContent = document.querySelector("main");

    if (mainContent) {
      mainContent.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <Box
          component="main"
          ref={mainScrollRef}
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            position: "relative",
            zIndex: 1,
            overflowX: "hidden",
            bgcolor: "#ffffff",
            scrollSnapType: "y mandatory",
            overflowY: "auto",
            height: "100vh",
            width: "100%",
          }}
        >
        <Box
          ref={heroRef}
          id="hero"
          sx={{
            minHeight: "100vh",
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            zIndex: 1,
            px: 0,
            bgcolor: "#f5f5f7",
            scrollSnapAlign: "start",
            scrollSnapStop: "always",
          }}
        >
          <Hero onNav={scrollToSection} />
        </Box>

        <Box
          ref={skillsRef}
          id="skills"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "#ffffff",
            pt: { xs: 2, sm: 3, md: 4 },
            pb: { xs: 1, sm: 1.5, md: 2 },
            px: 0,
            scrollSnapAlign: "start",
            scrollSnapStop: "always",
          }}
        >
          <Skills />
        </Box>

        <Box
          ref={projectsRef}
          id="projects"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "#ffffff",
            pt: { xs: 1, sm: 1.5, md: 2 },
            pb: { xs: 2, sm: 3, md: 4 },
            px: 0,
            scrollSnapAlign: "start",
            scrollSnapStop: "always",
          }}
        >
          <Projects />
        </Box>

        <StatementSection />
      </Box>

      <Footer />

      {showScrollTop && (
        <IconButton
          onClick={scrollToTop}
          sx={{
            position: "fixed",
            bottom: { xs: 24, sm: 32, md: 40 },
            left: "50%",
            transform: "translateX(-50%)",
            bgcolor: "#ffffff",
            color: "#1d1d1f",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            borderRadius: "50%",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            width: { xs: 44, sm: 46, md: 48 },
            height: { xs: 44, sm: 46, md: 48 },
            zIndex: 3000,
            "&:hover": {
              bgcolor: "#f5f5f7",
              color: "#0071e3",
              boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
              transform: "translateX(-50%) translateY(-2px)",
            },
          }}
          aria-label="Scroll to top"
        >
          <KeyboardArrowUpIcon fontSize="large" />
        </IconButton>
      )}
    </Box>
  );
}

export default App;
