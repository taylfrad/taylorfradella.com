import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
    dedupe: ["react", "react-dom", "three"],
  },
  build: {
    outDir: "dist",
    sourcemap: false,
    minify: "esbuild",
    cssMinify: true,
    target: "esnext",
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
