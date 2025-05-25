import { Box, Typography, Container, Link, Button } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import MenuIcon from "@mui/icons-material/Menu";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import React, { useRef, useEffect, useState } from "react";
import {
  motion,
  useAnimation,
  useInView,
  useScroll,
  useTransform,
} from "framer-motion";
import "vanta/dist/vanta.waves.min.js";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";

export default function Hero({ onNav }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [anchorEl, setAnchorEl] = React.useState(null);
  const vantaRef = useRef(null);
  const vantaEffect = useRef(null);
  const heroTextRef = useRef(null);
  const isInView = useInView(heroTextRef, { once: true, margin: "-100px" });
  const controls = useAnimation();
  const { scrollY } = useScroll();
  const scale = useTransform(scrollY, [0, 300], [1, 1.05]);
  const y = useTransform(scrollY, [0, 300], [0, 40]);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Typing animation state for the name
  const fullName = "Taylor Fradella";
  const [typedName, setTypedName] = useState("");
  const [typingDone, setTypingDone] = useState(false);

  useEffect(() => {
    let timeout;
    if (!typingDone && typedName.length < fullName.length) {
      timeout = setTimeout(() => {
        setTypedName(fullName.slice(0, typedName.length + 1));
      }, 90);
    } else if (typedName.length === fullName.length) {
      setTypingDone(true);
    }
    return () => clearTimeout(timeout);
  }, [typedName, typingDone, fullName]);

  // Navigation click handler
  const handleNavClick = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (onNav) onNav(sectionId);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const handleMenuNavClick = (sectionId) => {
    handleMenuClose();
    setTimeout(() => {
      handleNavClick(sectionId);
    }, 100); // Delay to allow menu to close before scrolling
  };

  // Vanta.js Waves effect (using global THREE from CDN)
  useEffect(() => {
    function initVanta() {
      if (vantaEffect.current) {
        vantaEffect.current.destroy();
        vantaEffect.current = null;
      }
      if (vantaRef.current) {
        vantaEffect.current = WAVES({
          el: vantaRef.current,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.0,
          minWidth: 200.0,
          scale: 1.0,
          scaleMobile: 1.0,
          color: 0x223366, // Darker blue
          shininess: 80.0, // More metallic
          waveHeight: 25.0, // Taller waves
          waveSpeed: 0.6, // Slightly faster
          backgroundColor: 0x101522, // Even deeper navy background
        });
      }
    }
    initVanta();
    window.addEventListener("resize", initVanta);
    return () => {
      window.removeEventListener("resize", initVanta);
      if (vantaEffect.current) {
        vantaEffect.current.destroy();
        vantaEffect.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 200);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.18,
      },
    },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.9, ease: "easeOut" },
    },
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100vw",
        position: "relative",
        overflow: "hidden",
        marginLeft: "calc(50% - 50vw)",
        marginRight: "calc(50% - 50vw)",
      }}
    >
      {/* Vanta.js background (minimal container) */}
      <div
        id="vanta-waves-bg"
        ref={vantaRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          width: "100%",
          height: "100vh",
          minHeight: 400,
          minWidth: 400,
          zIndex: 0,
          display: "block",
        }}
      >
        <div style={{ display: "none" }} /> {/* Dummy child for Vanta Net */}
      </div>
      {/* Overlay for readability */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          width: "100%",
          height: "100vh",
          background: "rgba(20,24,38,0.7)",
          zIndex: 1,
          pointerEvents: "none",
        }}
      />

      {/* Foreground content */}
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          zIndex: 2,
          width: "100vw",
        }}
      >
        {/* Name positioned at far left (hide on mobile) */}
        {!isMobile && (
          <Typography
            variant="h4"
            sx={{
              color: "white",
              fontWeight: 700,
              fontSize: "2rem",
              position: "absolute",
              top: 20,
              left: 150,
              zIndex: 10,
            }}
          >
            TAYLOR FRADELLA
          </Typography>
        )}

        {/* Navigation for desktop */}
        {!isMobile && (
          <Box
            sx={{
              position: "absolute",
              top: 20,
              right: 150,
              display: "flex",
              gap: 2,
              zIndex: 10,
            }}
          >
            <Button
              component="a"
              href="#skills"
              sx={{ color: "white", textTransform: "none", fontSize: "1rem" }}
            >
              Skills
            </Button>
            <Button
              component="a"
              href="#projects"
              sx={{ color: "white", textTransform: "none", fontSize: "1rem" }}
            >
              Projects
            </Button>
            <Button
              component="a"
              href="#about"
              sx={{ color: "white", textTransform: "none", fontSize: "1rem" }}
            >
              About
            </Button>
          </Box>
        )}

        {/* Hamburger menu for mobile */}
        {isMobile && (
          <Box
            sx={{
              position: "absolute",
              top: 20,
              right: 20,
              zIndex: 20,
            }}
          >
            <IconButton
              edge="end"
              color="inherit"
              aria-label="menu"
              onClick={handleMenuOpen}
              sx={{ color: "white" }}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
              <MenuItem component="a" href="#skills" onClick={handleMenuClose}>
                Skills
              </MenuItem>
              <MenuItem
                component="a"
                href="#projects"
                onClick={handleMenuClose}
              >
                Projects
              </MenuItem>
              <MenuItem component="a" href="#about" onClick={handleMenuClose}>
                About
              </MenuItem>
            </Menu>
          </Box>
        )}

        <Container
          maxWidth="lg"
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "100vw",
            textAlign: "center",
          }}
        >
          <Box
            ref={heroTextRef}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              width: "100%",
              maxWidth: 800,
              pt: { xs: 10, md: 0 },
              position: "relative",
            }}
          >
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate={controls}
              style={{ scale, y }}
            >
              <motion.div variants={itemVariants}>
                <Typography
                  variant="h2"
                  component="h1"
                  sx={{
                    fontWeight: 700,
                    fontSize: { xs: "3.5rem", sm: "4.5rem", md: "5rem" },
                    lineHeight: 1.2,
                    mb: 2,
                    background:
                      "linear-gradient(90deg, #f8fafc 0%, #7dd3fc 100%)",
                    backgroundClip: "text",
                    textFillColor: "transparent",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    width: "100%",
                    textAlign: "center",
                    borderBottom: "none",
                    paddingBottom: 0,
                  }}
                >
                  {typedName}
                  {!typingDone && typedName.length < fullName.length && (
                    <motion.span
                      initial={{ opacity: 1 }}
                      animate={{ opacity: [1, 0, 1] }}
                      transition={{ repeat: Infinity, duration: 0.8 }}
                      style={{
                        display: "inline-block",
                        width: "1ch",
                        color: "#7dd3fc",
                      }}
                    >
                      |
                    </motion.span>
                  )}
                </Typography>
              </motion.div>
              <motion.div variants={itemVariants}>
                <Typography
                  variant="h4"
                  component="h2"
                  sx={{
                    color: "rgba(255, 255, 255, 0.9)",
                    fontWeight: 400,
                    fontSize: { xs: "1.2rem", sm: "1.5rem", md: "1.8rem" },
                    letterSpacing: "0.01em",
                    textAlign: "center",
                    width: "100%",
                  }}
                >
                  Computer Science Student
                </Typography>
              </motion.div>
              <motion.div variants={itemVariants}>
                <Typography
                  variant="h5"
                  component="h3"
                  sx={{
                    mb: 3.5,
                    color: "rgba(255, 255, 255, 0.85)",
                    fontWeight: 400,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Box
                    component="span"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mt: 0.5,
                      mb: 0.5,
                    }}
                  >
                    <Link
                      href="https://www.southeastern.edu/"
                      target="_blank"
                      rel="noopener noreferrer"
                      underline="none"
                      sx={{
                        color: "white",
                        fontWeight: 600,
                        fontSize: "1.15em",
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                        transition: "color 0.3s ease",
                        "&:hover": {
                          color: "primary.light",
                        },
                      }}
                    >
                      Southeastern Louisiana University
                    </Link>
                  </Box>
                </Typography>
              </motion.div>
              <motion.div variants={itemVariants}>
                <Typography
                  variant="body1"
                  component="div"
                  sx={{
                    mb: 4,
                    color: "rgba(255,255,255,0.85)",
                    fontWeight: 400,
                    fontSize: { xs: "1.1rem", sm: "1.2rem" },
                    lineHeight: 1.7,
                    maxWidth: "650px",
                    textAlign: "center",
                    mx: "auto",
                  }}
                >
                  Aspiring software engineer and curious builder. I've created
                  some awesome projects in school, but now I'm ready to take
                  what I've learned and put it to the test in the real world.
                  I'm passionate about understanding how things work and finding
                  ways to make them better — through clean code, thoughtful
                  design, and real problem-solving. I love where creativity
                  meets technology, and I'm always looking to grow and create
                  something meaningful.
                </Typography>
              </motion.div>
            </motion.div>
          </Box>
        </Container>
        {/* Down arrow with framer motion bounce (moved outside inner Box/Container) */}
        <a
          href="#skills"
          style={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            bottom: 40,
            zIndex: 1000,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <motion.div
            initial={{ y: 0 }}
            animate={{ y: [0, -18, 0] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <KeyboardArrowDownIcon
              sx={{
                color: "primary.light",
                fontSize: "3.5rem",
              }}
            />
          </motion.div>
        </a>
      </Box>
      {showScrollTop && (
        <IconButton
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          sx={{
            position: "fixed",
            bottom: 32,
            right: 32,
            bgcolor: "#fff",
            color: "#222",
            boxShadow: "0 2px 12px rgba(0,0,0,0.12)",
            borderRadius: "50%",
            zIndex: 2000,
            transition: "all 0.2s",
            "&:hover": {
              bgcolor: "#f1f5f9",
              color: "#1976d2",
              boxShadow: "0 4px 20px rgba(0,0,0,0.18)",
            },
          }}
          aria-label="Scroll to top"
        >
          <KeyboardArrowUpIcon fontSize="Large" />
        </IconButton>
      )}
    </Box>
  );
}
