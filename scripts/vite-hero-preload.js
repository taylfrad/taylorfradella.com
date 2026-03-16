/**
 * Vite plugin: inject modulepreload links for hero chunks into index.html.
 * Makes Balatro, Lanyard, and three.js load in parallel with the main script.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

export default function heroPreloadPlugin() {
  let outDir = "dist";
  let base = "/";

  return {
    name: "hero-preload",
    apply: "build",
    configResolved(config) {
      outDir = config.build.outDir;
      base = config.base || "/";
    },
    writeBundle(options, bundle) {
      const chunks = Object.values(bundle)
        .filter(
          (chunk) =>
            chunk.type === "chunk" && chunk.fileName.endsWith(".js")
        )
        .filter(
          (chunk) =>
            chunk.fileName.includes("Lanyard") ||
            chunk.fileName.includes("three") ||
            chunk.fileName.includes("Home")
        )
        .map((chunk) => chunk.fileName);

      if (chunks.length === 0) return;

      const htmlPath = join(outDir, "index.html");
      let html = readFileSync(htmlPath, "utf-8");
      const links = chunks
        .map(
          (f) =>
            `<link rel="modulepreload" href="${base}${f}" fetchpriority="high">`
        )
        .join("\n    ");
      html = html.replace("</head>", `    ${links}\n  </head>`);
      writeFileSync(htmlPath, html);
    },
  };
}
