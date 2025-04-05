import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  typography: {
    fontFamily: [
      "-apple-system",
      "SF Pro Display",
      "SF Pro Icons",
      "Helvetica Neue",
      "Helvetica",
      "Arial",
      "sans-serif",
    ].join(","),
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
    h1: {
      fontFamily: "-apple-system, SF Pro Display, sans-serif",
      fontWeight: 700,
      fontSize: "4rem",
      letterSpacing: "-0.02em",
    },
    h2: {
      fontFamily: "-apple-system, SF Pro Display, sans-serif",
      fontWeight: 600,
      fontSize: "2.5rem",
      letterSpacing: "-0.015em",
    },
    h3: {
      fontFamily: "-apple-system, SF Pro Display, sans-serif",
      fontWeight: 500,
      fontSize: "2rem",
      letterSpacing: "-0.01em",
    },
    body1: {
      fontFamily: "-apple-system, SF Pro Text, sans-serif",
      fontSize: "1.1rem",
      fontWeight: 400,
      lineHeight: 1.6,
      letterSpacing: "-0.008em",
    },
    body2: {
      fontFamily: "-apple-system, SF Pro Text, sans-serif",
      fontSize: "0.925rem",
      fontWeight: 400,
      lineHeight: 1.5,
      letterSpacing: "-0.006em",
    },
    button: {
      fontFamily: "-apple-system, SF Pro Display, sans-serif",
      textTransform: "none",
      fontWeight: 500,
      letterSpacing: "-0.01em",
    },
  },
});

export default theme;
