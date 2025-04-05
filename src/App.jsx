import { useState, useEffect, useRef } from "react";
import { Box, CssBaseline, ThemeProvider } from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import theme from "./styles/Theme";
import Hero from "./components/Hero";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import AboutContact from "./components/AboutContact";
import "./styles/floatingBackground.css";
import "./App.css"; // Make sure to import your App.css file

function App() {
  const [activeSection, setActiveSection] = useState("hero");
  const [scrollPosition, setScrollPosition] = useState(0);

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
      const yOffset = -80; // Navbar height offset
      const y =
        element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  // Scroll to top handler
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

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
        sx={{ flexGrow: 1, position: "relative", zIndex: 1 }}
      >
        <Box
          ref={heroRef}
          id="hero"
          sx={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            zIndex: 1,
          }}
        >
          <Hero onScrollToSkills={() => scrollToSection("skills")} />
        </Box>

        <Box
          ref={skillsRef}
          id="skills"
          sx={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "#ffffff",
          }}
        >
          <Skills />
        </Box>

        <Box
          ref={projectsRef}
          id="projects"
          sx={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "#ffffff",
          }}
        >
          <Projects />
        </Box>

        <Box
          ref={aboutRef}
          id="about"
          sx={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "#ffffff",
          }}
        >
          <AboutContact />
        </Box>
      </Box>

      {/* Scroll to top button */}
      <div
        ref={scrollTopBtnRef}
        className="scroll-top-button"
        onClick={scrollToTop}
      >
        <KeyboardArrowUpIcon />
      </div>
    </ThemeProvider>
  );
}

export default App;
