import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import heroPreload from "./scripts/vite-hero-preload.js";

export default defineConfig({
  plugins: [react(), heroPreload()],
  define: {
    "import.meta.env.VITE_PERF_DEBUG": JSON.stringify(
      process.env.VITE_PERF_DEBUG ?? "",
    ),
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
    dedupe: ["react", "react-dom", "three", "framer-motion"],
  },
  build: {
    outDir: "dist",
    sourcemap: false,
    minify: "esbuild",
    cssMinify: true,
    // Down-level modern JS so older mobile Safari can parse every chunk.
    // "esnext" shipped ES2022 syntax (e.g. class static blocks + logical-
    // assignment in the lazy react-pdf chunk) raw, which threw a SyntaxError on
    // iOS Safari < 16.4 — crashing the route into the ErrorBoundary. es2020
    // (~Safari 13.1+) covers all currently-active iPhones.
    target: "es2020",
    reportCompressedSize: true,
    chunkSizeWarningLimit: 3200,
    rollupOptions: {
      onwarn(warning, warn) {
        if (
          warning.code === "MISSING_EXPORT" &&
          warning.message?.includes('"BatchedMesh" is not exported by') &&
          warning.message?.includes("three-mesh-bvh/src/utils/ExtensionUtilities.js")
        ) {
          return;
        }
        warn(warning);
      },
      output: {
        chunkFileNames: "assets/[name]-[hash].js",
        entryFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash].[ext]",
        manualChunks: (id) => {
          if (id.includes("node_modules/@react-three/rapier")) return "rapier";
          if (id.includes("node_modules/@react-three")) return "r3f";
          if (id.includes("node_modules/three") || id.includes("node_modules/meshline")) return "three";
          if (id.includes("node_modules/framer-motion")) return "motion";
          if (id.includes("node_modules/ogl")) return "ogl";
        },
      },
    },
  },
  assetsInclude: ["**/*.glb"],
  base: "/",
  optimizeDeps: {
    // Let Vite discover deps naturally; forced includes can over-segment dev prebundles.
    include: [],
  },
});
