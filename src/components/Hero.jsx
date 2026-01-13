import { Box, Typography, Container, Button, IconButton } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { motion } from "framer-motion";

export default function Hero({ onNav }) {
  // Navigation click handler
  const handleNavClick = (sectionId) => {
    if (onNav) {
      onNav(sectionId);
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        minHeight: "100vh",
        position: "relative",
        bgcolor: "#f5f5f7",
        display: "flex",
        flexDirection: "column",
        px: 0,
        py: 0,
        overflow: "visible",
      }}
    >
      {/* Main Content - Two Column Layout */}
      <Container
        maxWidth="lg"
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "center",
          justifyContent: { xs: "center", md: "space-between" },
          gap: { xs: 3, sm: 4, md: 6 },
          width: "100%",
          px: { xs: 2, sm: 3, md: 4 },
          py: { xs: 0, sm: 0, md: 0 },
          pt: { xs: 16, sm: 14, md: 0 },
          pb: { xs: 8, sm: 6, md: 0 },
        }}
      >
        {/* Left Side - Text Content */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: { xs: "center", md: "flex-start" },
            justifyContent: { xs: "center", md: "flex-start" },
            textAlign: { xs: "center", md: "left" },
            maxWidth: { xs: "100%", md: "50%" },
            width: "100%",
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
                fontSize: { xs: "2.25rem", sm: "3rem", md: "4rem", lg: "5rem" },
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
                fontSize: { xs: "1rem", sm: "1.25rem", md: "1.5rem", lg: "1.625rem" },
                mb: 4,
                lineHeight: 1.47059,
                letterSpacing: "-0.016em",
              }}
            >
              Designing and engineering thoughtful digital experiences.
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
                if (onNav) {
                  onNav("contact");
                }
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
            mt: { xs: 2, sm: 3, md: 0 },
            width: "100%",
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            style={{ width: "100%", maxWidth: "1000px" }}
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
                sx={{
                  width: "100%",
                  height: "auto",
                  maxHeight: { xs: "350px", sm: "500px", md: "750px" },
                  maxWidth: { xs: "100%", sm: "95%", md: "100%" },
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

      {/* Navigation - Top Left - Only visible on hero page */}
      <Box
        component="nav"
        sx={{
          position: "absolute",
          top: { xs: "16px", sm: "20px", md: "24px" },
          left: { xs: "16px", sm: "32px", md: "48px" },
          display: "flex",
          gap: { xs: 2, sm: 3, md: 4 },
          zIndex: 1000,
          margin: 0,
          padding: 0,
        }}
      >
        <Button
          onClick={(e) => {
            e.preventDefault();
            handleNavClick("skills");
          }}
            sx={{
              color: "#1d1d1f",
              textTransform: "none",
              fontSize: { xs: "1rem", sm: "1.125rem", md: "1.25rem" },
              fontWeight: 500,
              letterSpacing: "-0.01em",
              px: { xs: 1.5, sm: 2, md: 2.5 },
              py: { xs: 0.75, sm: 1, md: 1.25 },
              minHeight: { xs: "44px", sm: "48px", md: "52px" },
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
          onClick={(e) => {
            e.preventDefault();
            handleNavClick("projects");
          }}
            sx={{
              color: "#1d1d1f",
              textTransform: "none",
              fontSize: { xs: "1rem", sm: "1.125rem", md: "1.25rem" },
              fontWeight: 500,
              letterSpacing: "-0.01em",
              px: { xs: 1.5, sm: 2, md: 2.5 },
              py: { xs: 0.75, sm: 1, md: 1.25 },
              minHeight: { xs: "44px", sm: "48px", md: "52px" },
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
          onClick={(e) => {
            e.preventDefault();
            handleNavClick("contact");
          }}
            sx={{
              color: "#1d1d1f",
              textTransform: "none",
              fontSize: { xs: "1rem", sm: "1.125rem", md: "1.25rem" },
              fontWeight: 500,
              letterSpacing: "-0.01em",
              px: { xs: 1.5, sm: 2, md: 2.5 },
              py: { xs: 0.75, sm: 1, md: 1.25 },
              minHeight: { xs: "44px", sm: "48px", md: "52px" },
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

      {/* Bouncing Down Arrow - Only visible on hero page */}
      <Box
        sx={{
          position: "absolute",
          bottom: { xs: 3, sm: 4, md: 5 },
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 1000,
          margin: 0,
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
              if (onNav) {
                onNav("skills");
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
