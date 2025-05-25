import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist", // Explicitly set output directory
    rollupOptions: {
      // Removed external: ["vanta/dist/vanta.waves.min"],
    },
  },
  base: "/", // Ensure proper base path for GitHub Page
});
