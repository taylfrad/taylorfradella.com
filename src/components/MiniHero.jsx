import { Box, Typography } from "@mui/material";
import { motion } from "framer-motion";
import LiquidMetalBackground from "./LiquidMetalBackground";
import OptimizedImage from "./OptimizedImage";

export default function MiniHero({ onNav }) {
  // Navigation click handler - same as Hero component
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
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        justifyContent: "flex-start",
        position: "relative",
        overflow: "hidden",
        borderRadius: 0,
        boxShadow: "none",
        bgcolor: "#f5f5f7",
      }}
    >
      {/* Dynamic Liquid Metal Background */}
      <LiquidMetalBackground />
      {/* Mini Navbar */}
      <Box
        sx={{
          position: "relative",
          zIndex: 10,
          width: "100%",
          height: 32,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          pl: 0,
          pr: 2,
          py: 0,
          background: "transparent",
        }}
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <Typography
            component="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleNavClick("skills");
            }}
            sx={{
              color: "#1d1d1f",
              fontWeight: 400,
              fontSize: "0.75rem",
              letterSpacing: "-0.01em",
              lineHeight: 1,
              border: "none",
              background: "transparent",
              cursor: "pointer",
              fontFamily: "inherit",
              transition: "opacity 0.2s",
              "&:hover": {
                opacity: 0.6,
              },
            }}
          >
            About
          </Typography>
        </motion.div>
        <Box sx={{ display: "flex", gap: 1.5 }}>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Typography
              component="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleNavClick("projects");
              }}
              sx={{
                color: "#1d1d1f",
                fontWeight: 400,
                fontSize: "0.75rem",
                letterSpacing: "-0.01em",
                cursor: "pointer",
                lineHeight: 1,
                border: "none",
                background: "transparent",
                fontFamily: "inherit",
                transition: "opacity 0.2s",
                "&:hover": {
                  opacity: 0.6,
                },
              }}
            >
              Projects
            </Typography>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Typography
              component="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                const footer = document.querySelector("footer");
                if (footer) {
                  footer.scrollIntoView({ behavior: "smooth" });
                } else {
                  handleNavClick("footer");
                }
              }}
              sx={{
                color: "#1d1d1f",
                fontWeight: 400,
                fontSize: "0.75rem",
                letterSpacing: "-0.01em",
                cursor: "pointer",
                lineHeight: 1,
                border: "none",
                background: "transparent",
                fontFamily: "inherit",
                transition: "opacity 0.2s",
                "&:hover": {
                  opacity: 0.6,
                },
              }}
            >
              Contact
            </Typography>
          </motion.div>
        </Box>
      </Box>
      {/* Content - Two Column Layout like Hero */}
      <Box
        sx={{
          position: "relative",
          zIndex: 2,
          width: "100%",
          flex: 1,
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: "center",
          justifyContent: { xs: "center", sm: "space-between" },
          gap: { xs: 1, sm: 2 },
          px: 2,
          py: 1,
          minHeight: { xs: "200px", sm: "180px" },
        }}
      >
        {/* Left Side - Text Content */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: { xs: "center", sm: "flex-start" },
            justifyContent: "center",
            textAlign: { xs: "center", sm: "left" },
            maxWidth: { xs: "100%", sm: "50%" },
            width: "100%",
          }}
        >
          {/* Name */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Typography
              variant="h2"
              sx={{
                fontWeight: 600,
                fontSize: "1rem",
                lineHeight: 1.05,
                mb: 0.5,
                color: "#1d1d1f",
                letterSpacing: "-0.02em",
              }}
            >
              Hi, I'm Taylor Fradella.
            </Typography>
          </motion.div>
          {/* Subtitle */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Typography
              variant="body2"
              sx={{
                color: "#1d1d1f",
                fontWeight: 500,
                fontSize: "0.7rem",
                mb: 1,
                lineHeight: 1.4,
                letterSpacing: "-0.01em",
                textShadow: "0 2px 8px rgba(255, 255, 255, 0.8), 0 1px 3px rgba(0, 0, 0, 0.1)",
                position: "relative",
                zIndex: 2,
              }}
            >
              Designing and engineering thoughtful digital experiences.
            </Typography>
          </motion.div>
          {/* Button */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Box
              component="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                // Scroll directly to footer
                setTimeout(() => {
                  const footerElement = document.getElementById("footer");
                  if (footerElement) {
                    footerElement.scrollIntoView({ behavior: "smooth", block: "start" });
                  }
                }, 100);
              }}
              sx={{
                bgcolor: "#e0e0e0",
                color: "#222",
                px: 1.5,
                py: 0.5,
                borderRadius: "8px",
                fontSize: "0.65rem",
                fontWeight: 500,
                mt: 0.5,
                border: "none",
                cursor: "pointer",
                fontFamily: "inherit",
                boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                border: "1px solid #d0d0d0",
                "&:hover": {
                  bgcolor: "#d0d0d0",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
                },
              }}
            >
              Get in Touch
            </Box>
          </motion.div>
        </Box>

        {/* Right Side - MacBook Mockup */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            maxWidth: { xs: "100%", sm: "50%" },
            width: "100%",
            mt: { xs: 1, sm: 0 },
            minHeight: { xs: "120px", sm: "150px" },
            position: "relative",
            zIndex: 2,
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            style={{ 
              width: "100%", 
              maxWidth: "200px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <OptimizedImage
              src="/macbook-frame.png"
              alt="MacBook Pro"
              sx={{
                width: "100%",
                height: "auto",
                maxHeight: { xs: "120px", sm: "150px" },
                maxWidth: "200px",
                display: "block",
                objectFit: "contain",
                filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.06))",
                zIndex: 2,
                position: "relative",
                willChange: "auto",
              }}
            />
          </motion.div>
        </Box>
      </Box>
    </Box>
  );
}
