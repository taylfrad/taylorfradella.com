import { useState, useEffect, useLayoutEffect, useRef, useCallback } from "react";
import { Box, IconButton } from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import Hero from "./Hero";
import Skills from "./Skills";
import Projects from "./Projects";
import StatementSection from "./StatementSection";
import Footer from "./Footer";

export default function Home() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const location = useLocation();

  const heroRef = useRef(null);
  const skillsRef = useRef(null);
  const projectsRef = useRef(null);
  const mainScrollRef = useRef(null);
  const rafIdRef = useRef(null);

  // Force scroll to top on initial mount (page refresh) - VERY AGGRESSIVE
  // BUT skip if we're navigating back with scrollToProjects
  useLayoutEffect(() => {
    // CRITICAL: Don't scroll to top if we're navigating back to projects
    // This must run AFTER the scroll-to-projects logic, so check state first
    if (location.state?.scrollToProjects === true) {
      return; // Exit immediately, don't scroll to top
    }
    
    // Immediately prevent any scroll restoration
    if (typeof window !== 'undefined') {
      if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'manual';
      }
      
      // Remove any hash from URL that might cause scrolling
      if (window.location.hash) {
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
      }
      
      // Clear any stored scroll position
      sessionStorage.removeItem('scrollPosition');
      localStorage.removeItem('scrollPosition');
    }
    
    const scrollToHero = () => {
      // Get main scroll container
      const mainContent = mainScrollRef.current || document.querySelector("main");
      
      // Force scroll main container to top FIRST (most important)
      if (mainContent) {
        // Disable scroll snap temporarily to prevent snapping
        const originalScrollSnap = mainContent.style.scrollSnapType;
        mainContent.style.scrollSnapType = 'none';
        
        // Force scroll multiple ways - be very aggressive
        mainContent.scrollTop = 0;
        mainContent.scrollLeft = 0;
        mainContent.scrollTo({ top: 0, left: 0, behavior: "instant" });
        
        // Also scroll hero into view if available
        if (heroRef.current) {
          try {
            heroRef.current.scrollIntoView({ behavior: "instant", block: "start" });
          } catch (e) {
            // Ignore errors
          }
        }
        
        // Double-check scroll position after a brief moment
        setTimeout(() => {
          if (mainContent.scrollTop > 50) {
            mainContent.scrollTop = 0;
            mainContent.scrollTo({ top: 0, left: 0, behavior: "instant" });
          }
        }, 10);
        
        // Re-enable scroll snap after a longer moment (prevent snap on refresh)
        setTimeout(() => {
          // Double-check we're still at top before re-enabling
          if (mainContent.scrollTop < 50) {
            mainContent.style.scrollSnapType = originalScrollSnap || '';
          } else {
            // If we're not at top, force scroll again and keep snap disabled longer
            mainContent.scrollTop = 0;
            mainContent.scrollTo({ top: 0, left: 0, behavior: "instant" });
            setTimeout(() => {
              mainContent.style.scrollSnapType = originalScrollSnap || '';
            }, 500);
          }
        }, 500);
      }
      
      // Force scroll window to top
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      document.documentElement.scrollTop = 0;
      document.documentElement.scrollLeft = 0;
      document.body.scrollTop = 0;
      document.body.scrollLeft = 0;
    };
    
    // Immediate scroll - run multiple times to ensure it sticks
    scrollToHero();
    
    // Multiple attempts to ensure it sticks (especially important on refresh)
    // Use requestAnimationFrame to ensure DOM is ready
    requestAnimationFrame(() => {
      scrollToHero();
      requestAnimationFrame(() => {
        scrollToHero();
        setTimeout(() => {
          scrollToHero();
          setTimeout(scrollToHero, 10);
          setTimeout(scrollToHero, 50);
          setTimeout(scrollToHero, 100);
          setTimeout(scrollToHero, 200);
          setTimeout(scrollToHero, 300);
        }, 0);
      });
    });
    
    // Final check after delays - very aggressive for page refresh
    setTimeout(() => {
      scrollToHero();
      setTimeout(scrollToHero, 100);
      setTimeout(scrollToHero, 200);
      setTimeout(scrollToHero, 400);
      setTimeout(scrollToHero, 600);
    }, 100);
    
    // Prevent any scroll events from changing position for a longer time
    // BUT only if NOT scrolling to projects
    if (!location.state?.scrollToProjects) {
      const preventScroll = (e) => {
        const mainContent = mainScrollRef.current || document.querySelector("main");
        if (mainContent && mainContent.scrollTop > 50) {
          mainContent.scrollTop = 0;
          mainContent.scrollTo({ top: 0, left: 0, behavior: "instant" });
        }
      };
      
      const mainContent = mainScrollRef.current || document.querySelector("main");
      if (mainContent) {
        mainContent.addEventListener('scroll', preventScroll, { passive: false });
        // Keep preventing scroll for longer on page refresh
        setTimeout(() => {
          mainContent.removeEventListener('scroll', preventScroll);
        }, 1000);
      }
    }
  }, [location.pathname, location.state]); // Run on pathname change (page refresh) and state change

  // Throttled scroll handler using requestAnimationFrame
  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        rafIdRef.current = requestAnimationFrame(() => {
          const scrollContainer = mainScrollRef.current || document.querySelector("main");
          let currentScrollPosition = 0;
          
          if (scrollContainer) {
            currentScrollPosition = scrollContainer.scrollTop;
          } else {
            currentScrollPosition = window.scrollY || window.pageYOffset;
          }
          
          setShowScrollTop(currentScrollPosition > 200);
          ticking = false;
        });
        ticking = true;
      }
    };

    const scrollContainer = mainScrollRef.current || document.querySelector("main");
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll, { passive: true });
    }

    setTimeout(handleScroll, 100);

    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
      window.removeEventListener("scroll", handleScroll);
      if (scrollContainer) {
        scrollContainer.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  // Handle scrolling to projects section when navigating back from project detail
  // Use useLayoutEffect with higher priority to run BEFORE scroll-to-top
  // This must be defined AFTER the scroll-to-top useLayoutEffect to run first
  useLayoutEffect(() => {
    const shouldScrollToProjects = location.state?.scrollToProjects === true;
    
    // Early return if not scrolling to projects
    if (!shouldScrollToProjects) {
      return;
    }
    
    // Scroll to projects - use a reliable method
    const scrollToProjects = () => {
      const mainContent = mainScrollRef.current || document.querySelector("main");
      if (mainContent && projectsRef.current) {
        // Temporarily disable scroll snap for smoother animation
        const originalScrollSnap = mainContent.style.scrollSnapType;
        mainContent.style.scrollSnapType = 'none';
        
        // Get the projects element
        const projectsElement = projectsRef.current;
        
        // Use scrollIntoView for reliable positioning
        projectsElement.scrollIntoView({ 
          behavior: "smooth", 
          block: "start",
          inline: "nearest"
        });
        
        // Re-enable scroll snap after animation completes
        setTimeout(() => {
          mainContent.style.scrollSnapType = originalScrollSnap || '';
        }, 1000);
        
        return true;
      }
      return false;
    };
    
    // Try immediately, then with delays if refs aren't ready
    if (!scrollToProjects()) {
      requestAnimationFrame(() => {
        if (!scrollToProjects()) {
          requestAnimationFrame(() => {
            if (!scrollToProjects()) {
              setTimeout(() => scrollToProjects(), 200);
            }
          });
        }
      });
    }
  }, [location.state]);

  const scrollToSection = useCallback((sectionId) => {
    let element = null;
    
    if (sectionId === "hero" || sectionId === "/") {
      element = heroRef.current;
    } else if (sectionId === "skills") {
      element = skillsRef.current;
    } else if (sectionId === "projects") {
      element = projectsRef.current;
    } else if (sectionId === "contact" || sectionId === "footer") {
      const footerElement = document.getElementById("footer");
      if (footerElement) {
        footerElement.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
    }

    if (element) {
      element.scrollIntoView({ 
        behavior: "smooth", 
        block: "start",
        inline: "nearest"
      });
    }
  }, []);

  const scrollToTop = useCallback(() => {
    const mainContent = document.querySelector("main");

    if (mainContent) {
      mainContent.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, []);

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
            contain: "layout style paint",
            willChange: "scroll-position",
            transform: "translateZ(0)",
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

      <AnimatePresence>
        {showScrollTop && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 25,
            }}
            style={{
              position: "fixed",
              bottom: 40,
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 3000,
            }}
            className="scroll-to-top-button"
          >
            <motion.div
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <IconButton
                onClick={scrollToTop}
                sx={{
                  bgcolor: "#ffffff",
                  color: "#1d1d1f",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                  borderRadius: "50%",
                  width: { xs: 44, sm: 46, md: 48 },
                  height: { xs: 44, sm: 46, md: 48 },
                  "&:hover": {
                    bgcolor: "#f5f5f7",
                    color: "#0071e3",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
                  },
                }}
                aria-label="Scroll to top"
              >
                <KeyboardArrowUpIcon fontSize="large" />
              </IconButton>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
}
