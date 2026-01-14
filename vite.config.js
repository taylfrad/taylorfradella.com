import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
    sourcemap: false,
    minify: "esbuild",
    cssMinify: true,
    rollupOptions: {
      external: ["vanta/dist/vanta.waves.min"],
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom"],
          mui: ["@mui/material", "@mui/icons-material", "@emotion/react", "@emotion/styled"],
          motion: ["framer-motion"],
        },
        // Optimize chunk names for better caching
        chunkFileNames: "assets/[name]-[hash].js",
        entryFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash].[ext]",
      },
    },
    chunkSizeWarningLimit: 600,
    // Enable compression
    reportCompressedSize: true,
    // Target modern browsers for smaller bundles
    target: "esnext",
  },
  base: "/",
  // Optimize dependencies
  optimizeDeps: {
    include: ["react", "react-dom", "react-router-dom"],
    exclude: ["@lobehub/icons-static-png"],
  },
  // Server optimizations for dev
  server: {
    headers: {
      'Cache-Control': 'public, max-age=31536000',
    },
  },
});
