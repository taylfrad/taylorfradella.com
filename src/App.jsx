import { useState, useEffect, useRef } from "react";
import { Box, IconButton } from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Hero from "./components/Hero";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import StatementSection from "./components/StatementSection";
import Footer from "./components/Footer";
import "./styles/floatingBackground.css";
import "./App.css"; // Make sure to import your App.css file

function App() {
  const [activeSection, setActiveSection] = useState("hero");
  const [scrollPosition, setScrollPosition] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Create refs for each section
  const heroRef = useRef(null);
  const skillsRef = useRef(null);
  const projectsRef = useRef(null);
  const aboutRef = useRef(null);
  const scrollTopBtnRef = useRef(null);

  // Updated scroll handler
  useEffect(() => {
    const handleScroll = () => {
      // Check both window scroll and main element scroll (for scroll-snap)
      const scrollContainer = document.querySelector("main");
      let currentScrollPosition = 0;
      
      if (scrollContainer) {
        currentScrollPosition = scrollContainer.scrollTop;
      } else {
        currentScrollPosition = window.scrollY || window.pageYOffset;
      }
      
      setScrollPosition(currentScrollPosition);
      setShowScrollTop(currentScrollPosition > 200);

      // Use direct DOM manipulation for the scroll button
      const scrollBtn = scrollTopBtnRef.current;
      if (scrollBtn) {
        if (currentScrollPosition > window.innerHeight / 2) {
          scrollBtn.classList.add("visible");
        } else {
          scrollBtn.classList.remove("visible");
        }
      }

      if (
        !heroRef.current ||
        !skillsRef.current ||
        !projectsRef.current ||
        !aboutRef.current
      )
        return;

      // Get bounding rects for more accurate detection with scroll-snap
      const heroRect = heroRef.current.getBoundingClientRect();
      const skillsRect = skillsRef.current.getBoundingClientRect();
      const projectsRect = projectsRef.current.getBoundingClientRect();
      const aboutRect = aboutRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      const metaballs = document.querySelectorAll(".metaball");

      metaballs.forEach((metaball) => {
        // Set random delay
        metaball.style.setProperty("--random-delay", Math.random());

        // Set random translations
        metaball.style.setProperty(
          "--random-x",
          `${(Math.random() - 0.5) * 200}px`
        );
        metaball.style.setProperty(
          "--random-y",
          `${(Math.random() - 0.5) * 200}px`
        );
      });

      // Determine which section is currently in view using getBoundingClientRect
      // Hero section is visible when its top is near the top of viewport
      let currentSection = "hero";
      
      if (heroRect.top >= 0 && heroRect.top < viewportHeight * 0.5) {
        currentSection = "hero";
      } else if (skillsRect.top >= 0 && skillsRect.top < viewportHeight * 0.5) {
        currentSection = "skills";
      } else if (projectsRect.top >= 0 && projectsRect.top < viewportHeight * 0.5) {
        currentSection = "projects";
      } else if (aboutRect.top >= 0 && aboutRect.top < viewportHeight * 0.5) {
        currentSection = "about";
      }

      // Update active section
      setActiveSection(currentSection);
    };

    // Listen to both window and main element scroll
    const scrollContainer = document.querySelector("main");
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll, { passive: true });
    }

    // Initial check
    setTimeout(handleScroll, 100);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollContainer) {
        scrollContainer.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

      // Direct scroll method
      const scrollToSection = (sectionId) => {
        let element = null;

        if (sectionId === "hero") element = heroRef.current;
        else if (sectionId === "skills") element = skillsRef.current;
        else if (sectionId === "projects") element = projectsRef.current;
        else if (sectionId === "about") element = aboutRef.current;
        else if (sectionId === "contact" || sectionId === "footer") {
          // Scroll to footer
          const footerElement = document.getElementById("footer");
          if (footerElement) {
            const yOffset = -80;
            const y = footerElement.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: "smooth" });
            return;
          }
        }

        if (element) {
          const yOffset = -80;
          const y =
            element.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: "smooth" });
        }
      };

  // Scroll to top handler
  const scrollToTop = () => {
    // Target the main content container
    const mainContent = document.querySelector("main");

    if (mainContent) {
      mainContent.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      // Fallback if the main element is not found
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Smooth scroll for all anchor links with hashes
  useEffect(() => {
    const handleSmoothScroll = (e) => {
      // Only handle anchor links with hashes
      const anchor = e.target.closest('a[href^="#"]');
      if (anchor && anchor.hash && document.querySelector(anchor.hash)) {
        const target = document.querySelector(anchor.hash);
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth" });
        // Optionally update the URL hash:
        window.history.pushState(null, "", anchor.hash);
      }
    };

    document.addEventListener("click", handleSmoothScroll);
    return () => {
      document.removeEventListener("click", handleSmoothScroll);
    };
  }, []);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <Box
          component="main"
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

      {/* Scroll-to-top arrow (fixed, centered, visible when scrolled down) */}
      {showScrollTop && (
        <IconButton
          ref={scrollTopBtnRef}
          onClick={scrollToTop}
          sx={{
            position: "fixed",
            bottom: 40,
            left: "50%",
            transform: "translateX(-50%)",
            bgcolor: "#ffffff",
            color: "#1d1d1f",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            borderRadius: "50%",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            width: 48,
            height: 48,
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
