import { Box } from "@mui/material";
import "../styles/liquidMetal.css";

export default function LiquidMetalBackground() {
  return (
    <Box
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        overflow: "hidden",
        zIndex: 0,
        pointerEvents: "none",
        willChange: "contents",
        transform: "translate3d(0, 0, 0)",
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
        contain: "strict",
        isolation: "isolate",
        // Maximum FPS optimizations
        transformStyle: "preserve-3d",
        WebkitTransformStyle: "preserve-3d",
        // Force hardware acceleration and GPU layer
        perspective: "1000px",
        WebkitPerspective: "1000px",
        // Optimize compositing
        WebkitFontSmoothing: "antialiased",
        MozOsxFontSmoothing: "grayscale",
        // Force GPU layer creation
        WebkitTransform: "translate3d(0, 0, 0)",
      }}
    >
      {/* Lava lamp blobs - maximum FPS optimized */}
      <div className="liquid-blob blob-1" />
      <div className="liquid-blob blob-2" />
      <div className="liquid-blob blob-3" />
      <div className="liquid-blob blob-4" />
      <div className="liquid-blob blob-5" />
      <div className="liquid-blob blob-6" />
    </Box>
  );
}
