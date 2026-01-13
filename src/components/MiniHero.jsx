import { Box, Typography } from "@mui/material";
import React, { useRef, useEffect } from "react";
import "vanta/dist/vanta.waves.min.js";

export default function MiniHero() {
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
        background: "#ffffff",
      }}
    >
      {/* Mini Navbar */}
      <Box
        sx={{
          position: "relative",
          zIndex: 2,
          width: "100%",
          height: 32,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 2,
          py: 0,
          background: "transparent",
        }}
      >
        <Typography
          component="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setTimeout(() => {
              const section = document.getElementById("skills");
              if (section) {
                section.scrollIntoView({ behavior: "smooth", block: "start" });
              }
            }, 100);
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
        <Box sx={{ display: "flex", gap: 1.5 }}>
          {["Projects", "Contact"].map((item) => {
            const sectionId = item === "Contact" ? "footer" : item.toLowerCase();
            return (
              <Typography
                key={item}
                component="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setTimeout(() => {
                    const section = document.getElementById(sectionId);
                    if (section) {
                      section.scrollIntoView({ behavior: "smooth", block: "start" });
                    }
                  }, 100);
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
                {item}
              </Typography>
            );
          })}
        </Box>
      </Box>
      {/* Content */}
      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          px: 2,
          py: 1,
        }}
      >
        {/* Name */}
        <Typography
          variant="h2"
          sx={{
            fontWeight: 600,
            fontSize: "1rem",
            lineHeight: 1.05,
            mb: 0.5,
            color: "#1d1d1f",
            textAlign: "center",
            letterSpacing: "-0.02em",
          }}
        >
          Hi, I'm Taylor Fradella.
        </Typography>
        {/* Subtitle */}
        <Typography
          variant="body2"
          sx={{
            color: "#86868b",
            fontWeight: 400,
            fontSize: "0.7rem",
            textAlign: "center",
            mb: 1,
            lineHeight: 1.4,
            letterSpacing: "-0.01em",
          }}
        >
          A computer science student passionate about building elegant & efficient software.
        </Typography>
        {/* Button */}
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
            "&:hover": {
              bgcolor: "#d0d0d0",
            },
            "&:active": {
              bgcolor: "#c0c0c0",
            },
          }}
        >
          Get in Touch
        </Box>
      </Box>
    </Box>
  );
}
