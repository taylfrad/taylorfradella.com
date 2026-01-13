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
          fontWeight: 600,
          color: "#1d1d1f",
          fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
          textAlign: "center",
          letterSpacing: "-0.02em",
          lineHeight: 1.05,
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
          height: 2,
          background: accentColor,
          borderRadius: 1,
          mt: 1.5,
          mb: 0,
          transition: "width 0.2s",
          opacity: 0.3,
        }}
      />
    </Box>
  );
}
