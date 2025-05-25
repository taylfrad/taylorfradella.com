import { useState, useEffect, useRef } from "react";
import { Box, IconButton } from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Hero from "./components/Hero";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import AboutContact from "./components/AboutContact";
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
      const currentScrollPosition = window.scrollY;
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

      const heroTop = heroRef.current.offsetTop;
      const skillsTop = skillsRef.current.offsetTop;
      const projectsTop = projectsRef.current.offsetTop;
      const aboutTop = aboutRef.current.offsetTop;
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

      const scrollPos = window.scrollY;
      const offset = window.innerHeight * 0.2; // 20% of viewport height

      // Determine which section we're in
      let currentSection = "hero";
      if (scrollPos >= aboutTop - offset) {
        currentSection = "about";
      } else if (scrollPos >= projectsTop - offset) {
        currentSection = "projects";
      } else if (scrollPos >= skillsTop - offset) {
        currentSection = "skills";
      }

      // Update active section
      setActiveSection(currentSection);
    };

    window.addEventListener("scroll", handleScroll);

    // Initial check
    setTimeout(handleScroll, 100);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Direct scroll method
  const scrollToSection = (sectionId) => {
    let element = null;

    if (sectionId === "hero") element = heroRef.current;
    else if (sectionId === "skills") element = skillsRef.current;
    else if (sectionId === "projects") element = projectsRef.current;
    else if (sectionId === "about") element = aboutRef.current;

    if (element) {
      const yOffset = -80; // Adjust this value as needed for your header height
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
      {/* Metaball Liquid Background */}
      <div className="flowing-bg">
        <div className="metaball-container">
          {[1, 2].map((num) => (
            <div key={num} className={`metaball metaball-${num}`}></div>
          ))}
        </div>
        <div className="metaball-overlay"></div>
      </div>

      <Box
        component="main"
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          position: "relative",
          zIndex: 1,
          overflowX: "hidden", // Prevent horizontal scroll
          bgcolor: "#fff",
        }}
      >
        <Box
          ref={heroRef}
          id="hero"
          sx={{
            minHeight: "auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            zIndex: 1,
            px: { xs: 2, sm: 3, md: 4 }, // Responsive padding
          }}
        >
          <Hero onNav={scrollToSection} />
        </Box>

        <Box
          ref={skillsRef}
          id="skills"
          sx={{
            minHeight: "auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "#ffffff",
            py: { xs: 4, sm: 6, md: 8 }, // Responsive vertical padding
            px: { xs: 2, sm: 3, md: 4 }, // Responsive horizontal padding
          }}
        >
          <Skills />
        </Box>

        <Box
          ref={projectsRef}
          id="projects"
          sx={{
            minHeight: "auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "#fff",
            py: { xs: 4, sm: 6, md: 8 },
            px: { xs: 2, sm: 3, md: 4 },
            mb: 8,
          }}
        >
          <Projects />
        </Box>

        <Box
          ref={aboutRef}
          id="about"
          sx={{
            minHeight: "auto",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "flex-start",
            bgcolor: "#ffffff",
            py: 0,
            px: { xs: 2, sm: 3, md: 4 },
          }}
        >
          <AboutContact />
        </Box>
      </Box>

      <Footer />

      {/* Scroll-to-top arrow (fixed, centered, visible when scrolled down) */}
      {showScrollTop && (
        <IconButton
          ref={scrollTopBtnRef}
          onClick={scrollToTop}
          sx={{
            position: "fixed",
            bottom: 32,
            left: "50%",
            transform: "translateX(-50%)",
            bgcolor: "#fff",
            color: "#222",
            boxShadow: "0 2px 12px rgba(0,0,0,0.12)",
            borderRadius: "50%",
            transition: "all 0.2s",
            width: 56,
            height: 56,
            zIndex: 3000,
            "&:hover": {
              bgcolor: "#f1f5f9",
              color: "#1976d2",
              boxShadow: "0 4px 20px rgba(0,0,0,0.18)",
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
