import React, { useRef, useLayoutEffect, useState } from "react";
import { Typography, Box } from "@mui/material";

export default function SectionHeader({
  title,
  sectionRef,
  accentColor = "#1976d2",
  sx = {},
}) {
  const titleRef = useRef();
  const [lineWidth, setLineWidth] = useState(120);

  useLayoutEffect(() => {
    if (titleRef.current) {
      const width = titleRef.current.offsetWidth;
      setLineWidth(Math.max(80, Math.min(width * 0.7, 320)));
    }
  }, [title]);

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        py: 0,
        background: "#fff",
        borderBottom: "none",
        boxShadow: "none",
        ...sx,
      }}
    >
      <Typography
        ref={titleRef}
        variant="h2"
        component="h2"
        sx={{
          fontWeight: 800,
          color: "#0f172a",
          fontSize: { xs: "2.6rem", sm: "3.2rem", md: "3.8rem" },
          textAlign: "center",
          letterSpacing: "-0.02em",
          lineHeight: 1.1,
          textShadow: "0 2px 16px rgba(31,38,135,0.08)",
          borderRadius: "16px",
          px: 2,
          borderBottom: "none",
          background: "#fff",
          boxShadow: "none",
        }}
      >
        {title}
      </Typography>
      <Box
        sx={{
          width: lineWidth,
          height: 5,
          background: accentColor,
          borderRadius: 2,
          mt: 1.5,
          mb: 0,
          transition: "width 0.2s",
        }}
      />
    </Box>
  );
}
