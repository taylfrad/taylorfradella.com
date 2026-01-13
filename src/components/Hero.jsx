import { Box, Typography, Container, Button, IconButton } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import React from "react";
import { motion } from "framer-motion";

export default function Hero({ onNav }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // Navigation click handler
  const handleNavClick = (sectionId) => {
    if (onNav) {
      onNav(sectionId);
    } else {
      // Fallback: scroll to section directly
      const section = document.getElementById(sectionId);
      if (section) {
        const yOffset = -80;
        const y = section.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    }
  };

  return (
    <Box
      sx={{
        minHeight: { xs: "auto", md: "70vh" },
        width: "100%",
        position: "relative",
        bgcolor: "#f5f5f7",
        display: "flex",
        flexDirection: "column",
        px: 0,
        py: { xs: 6, md: 8 },
        overflow: "visible",
      }}
    >
      {/* Navigation - Top Left */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          display: "flex",
          gap: { xs: 3, md: 4 },
          zIndex: 10,
          pt: 2,
          pl: 2,
        }}
      >
        <Button
          component="a"
          href="#skills"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick("skills");
          }}
          sx={{
            color: "#1d1d1f",
            textTransform: "none",
            fontSize: { xs: "0.875rem", md: "0.9375rem" },
            fontWeight: 400,
            letterSpacing: "-0.01em",
            px: 1,
            py: 0.5,
            transition: "opacity 0.2s ease",
            "&:hover": {
              opacity: 0.6,
              bgcolor: "transparent",
            },
          }}
        >
          About
        </Button>
        <Button
          component="a"
          href="#projects"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick("projects");
          }}
          sx={{
            color: "#1d1d1f",
            textTransform: "none",
            fontSize: { xs: "0.875rem", md: "0.9375rem" },
            fontWeight: 400,
            letterSpacing: "-0.01em",
            px: 1,
            py: 0.5,
            transition: "opacity 0.2s ease",
            "&:hover": {
              opacity: 0.6,
              bgcolor: "transparent",
            },
          }}
        >
          Projects
        </Button>
        <Button
          component="a"
          href="#footer"
          onClick={(e) => {
            e.preventDefault();
            const footer = document.querySelector("footer");
            if (footer) {
              footer.scrollIntoView({ behavior: "smooth" });
            }
          }}
          sx={{
            color: "#1d1d1f",
            textTransform: "none",
            fontSize: { xs: "0.875rem", md: "0.9375rem" },
            fontWeight: 400,
            letterSpacing: "-0.01em",
            px: 1,
            py: 0.5,
            transition: "opacity 0.2s ease",
            "&:hover": {
              opacity: 0.6,
              bgcolor: "transparent",
            },
          }}
        >
          Contact
        </Button>
      </Box>

      {/* Main Content - Two Column Layout */}
      <Container
        maxWidth="lg"
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "center",
          justifyContent: "space-between",
          gap: { xs: 4, md: 6 },
          mt: { xs: 10, md: 2 },
          mb: { xs: 4, md: 2 },
          width: "100%",
          px: { xs: 2, sm: 3, md: 4 },
        }}
      >
        {/* Left Side - Text Content */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: { xs: "center", md: "flex-start" },
            textAlign: { xs: "center", md: "left" },
            maxWidth: { xs: "100%", md: "50%" },
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Typography
              variant="h1"
              component="h1"
              sx={{
                fontWeight: 600,
                fontSize: { xs: "2.75rem", sm: "3.75rem", md: "5rem" },
                lineHeight: 1.05,
                letterSpacing: "-0.03em",
                mb: 2,
                color: "#1d1d1f",
              }}
            >
              Hi, I'm Taylor Fradella.
            </Typography>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Typography
              variant="h4"
              component="h2"
              sx={{
                color: "#86868b",
                fontWeight: 400,
                fontSize: { xs: "1.1875rem", sm: "1.375rem", md: "1.625rem" },
                mb: 4,
                lineHeight: 1.47059,
                letterSpacing: "-0.016em",
              }}
            >
              A computer science student passionate about building elegant & efficient software.
            </Typography>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Button
              variant="contained"
              onClick={(e) => {
                e.preventDefault();
                // Scroll directly to footer
                setTimeout(() => {
                  const footerElement = document.getElementById("footer");
                  if (footerElement) {
                    footerElement.scrollIntoView({ behavior: "smooth", block: "start" });
                  } else if (onNav) {
                    onNav("footer");
                  }
                }, 100);
              }}
              sx={{
                bgcolor: "#e0e0e0",
                color: "#222",
                textTransform: "none",
                fontSize: { xs: "0.9rem", md: "1rem" },
                fontWeight: 500,
                px: { xs: 2.5, md: 3.5 },
                py: { xs: 1.25, md: 1.75 },
                borderRadius: "8px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                border: "1px solid #d0d0d0",
                "&:hover": {
                  bgcolor: "#d0d0d0",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
                },
              }}
            >
              Get in Touch
            </Button>
          </motion.div>
        </Box>

        {/* Right Side - MacBook Mockup */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            maxWidth: { xs: "100%", md: "50%" },
            mt: { xs: 4, md: 0 },
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            style={{ width: "100%", maxWidth: "800px" }}
          >
            {/* Device Mockup - Screen Inside Frame */}
            <Box
              sx={{
                position: "relative",
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* Device Frame Image */}
              <Box
                component="img"
                src="/macbook-frame.png"
                alt="MacBook Pro"
                onError={(e) => {
                  console.log("MacBook frame image not found. Please add macbook-frame.png to the public folder.");
                }}
                sx={{
                  width: "100%",
                  height: "auto",
                  maxHeight: { xs: "400px", md: "600px" },
                  display: "block",
                  objectFit: "contain",
                  filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.06))",
                  zIndex: 2,
                  position: "relative",
                }}
              />

            </Box>
          </motion.div>
        </Box>
      </Container>

      {/* Bouncing Down Arrow */}
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 10,
          pb: 3,
        }}
      >
        <motion.div
          animate={{
            y: [0, 8, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <IconButton
            onClick={() => {
              const skillsSection = document.getElementById("skills");
              if (skillsSection) {
                skillsSection.scrollIntoView({ behavior: "smooth", block: "start" });
              }
            }}
            sx={{
              color: "#1d1d1f",
              opacity: 0.6,
              "&:hover": {
                opacity: 1,
                bgcolor: "rgba(0,0,0,0.05)",
              },
            }}
            aria-label="Scroll down"
          >
            <KeyboardArrowDownIcon sx={{ fontSize: { xs: "36px", md: "40px" } }} />
          </IconButton>
        </motion.div>
      </Box>
    </Box>
  );
}
