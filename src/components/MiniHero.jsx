import { Box, Typography } from "@mui/material";
import React, { useRef, useEffect } from "react";
import "vanta/dist/vanta.waves.min.js";

export default function MiniHero() {
  const vantaRef = useRef(null);
  const vantaEffect = useRef(null);

  useEffect(() => {
    let vantaEffectInstance;
    // Check if VANTA and WAVES are available globally
    if (vantaRef.current && window.VANTA && window.VANTA.WAVES) {
      vantaEffectInstance = window.VANTA.WAVES({
        el: vantaRef.current,
        mouseControls: false,
        touchControls: false,
        gyroControls: false,
        minHeight: 200.0,
        minWidth: 200.0,
        scale: 1.0,
        scaleMobile: 1.0,
        color: 0x223366,
        shininess: 80.0,
        waveHeight: 25.0,
        waveSpeed: 0.6,
        backgroundColor: 0x101522,
      });
    }
    return () => {
      if (vantaEffectInstance) {
        vantaEffectInstance.destroy();
      }
    };
  }, []);

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
      }}
    >
      {/* Vanta.js Waves Background */}
      <Box
        ref={vantaRef}
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 0,
          minHeight: 200,
          minWidth: 200,
        }}
      />
      {/* Overlay for readability */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          width: "100%",
          height: "100%",
          background: "rgba(20,24,38,0.7)",
          zIndex: 1,
          pointerEvents: "none",
        }}
      />
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
          sx={{
            color: "#fff",
            fontWeight: 900,
            fontSize: "0.95rem",
            letterSpacing: 1.2,
            textTransform: "uppercase",
            lineHeight: 1,
          }}
        >
          Taylor Fradella
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          {["Skills", "Projects", "About"].map((item) => (
            <Typography
              key={item}
              sx={{
                color: "#fff",
                fontWeight: 400,
                fontSize: "0.85rem",
                letterSpacing: 0.7,
                textTransform: "capitalize",
                cursor: "default",
                px: 0.2,
                lineHeight: 1,
                transition: "background 0.2s, border-radius 0.2s",
                "&:hover": {
                  background: "rgba(56,189,248,0.13)",
                  borderRadius: 2,
                  cursor: "pointer",
                },
              }}
            >
              {item}
            </Typography>
          ))}
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
          pt: 0.5,
          pb: 1,
        }}
      >
        {/* Name */}
        <Typography
          variant="h2"
          sx={{
            fontWeight: 900,
            fontSize: "1.25rem",
            lineHeight: 1.1,
            mb: 0.7,
            background: "linear-gradient(90deg, #f8fafc 0%, #7dd3fc 100%)",
            backgroundClip: "text",
            textFillColor: "transparent",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textAlign: "center",
            borderBottom: "none",
            paddingBottom: 0,
            letterSpacing: 0.7,
          }}
        >
          Taylor Fradella
        </Typography>
        {/* Subtitle */}
        <Typography
          variant="h6"
          sx={{
            color: "#fff",
            fontWeight: 400,
            fontSize: "0.85rem",
            textAlign: "center",
            mb: 0.2,
          }}
        >
          Computer Science Student
        </Typography>
        {/* University */}
        <Typography
          variant="h6"
          sx={{
            color: "#fff",
            fontWeight: 700,
            fontSize: "0.85rem",
            textAlign: "center",
            mb: 0.7,
          }}
        >
          Southeastern Louisiana University
        </Typography>
        {/* Long Description */}
        <Typography
          variant="caption"
          sx={{
            color: "#fff",
            fontWeight: 400,
            fontSize: "0.6rem",
            lineHeight: 0.95,
            maxWidth: 300,
            textAlign: "center",
            mx: "auto",
            mb: 0,
          }}
        >
          Aspiring software engineer and curious builder. I've created some
          awesome projects in school, but now I'm ready to take what I've
          learned and put it to the test in the real world. I'm passionate about
          understanding how things work and finding ways to make them better —
          through clean code, thoughtful design, and real problem-solving. I
          love where creativity meets technology, and I'm always looking to grow
          and create something meaningful.
        </Typography>
      </Box>
    </Box>
  );
}
