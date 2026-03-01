import { useEffect, useMemo, useState } from "react";

const preloadedImageHrefs = new Set();

function toWebpSrc(source) {
  if (!source) return null;
  return source.replace(/\.png$/i, ".webp");
}

function ensureImagePreload(href, type) {
  if (!href || typeof document === "undefined") return;
  if (preloadedImageHrefs.has(href)) return;

  const existing = document.head.querySelector(
    `link[rel="preload"][as="image"][href="${href}"]`
  );

  if (existing) {
    preloadedImageHrefs.add(href);
    return;
  }

  const link = document.createElement("link");
  link.rel = "preload";
  link.as = "image";
  link.href = href;
  if (type) link.type = type;
  document.head.appendChild(link);
  preloadedImageHrefs.add(href);
}

/**
 * OptimizedImage component with WebP support, lazy loading, and blur-up placeholder
 * @param {string} src - Image source path (PNG)
 * @param {string} alt - Alt text
 * @param {object} sx - MUI sx props
 * @param {boolean} priority - If true, preloads the image
 * @param {string} className - Additional CSS class
 */
export default function OptimizedImage({ 
  src, 
  alt, 
  sx = {}, 
  priority = false,
  className = "",
  ...props 
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  const webpSrc = useMemo(() => toWebpSrc(src), [src]);
  const fallbackSrc = src;

  // Reset local loading state when source changes.
  useEffect(() => {
    setIsLoaded(false);
    setError(false);
  }, [src]);

  // Preload image if priority.
  useEffect(() => {
    if (!priority) return;
    if (webpSrc) ensureImagePreload(webpSrc, "image/webp");
    if (fallbackSrc && fallbackSrc !== webpSrc) {
      ensureImagePreload(fallbackSrc);
    }
  }, [priority, webpSrc, fallbackSrc]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setError(true);
    setIsLoaded(true); // Show fallback even on error
  };

  return (
    <div
      className={`relative block h-full w-full ${className}`}
      style={sx}
    >
      {!isLoaded && (
        <div
          className="absolute inset-0 z-0 opacity-50"
          style={{
            backgroundColor: "#f5f5f7",
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23d0d0d0' fill-opacity='0.4'%3E%3Cpath d='M20 20.5V18H0v-2h20v-2H0v-2h20v-2H0V8h20V6H0v-2h20V2H0V0h22v20h-2zm-2 2v20H0v-2h18V22z'/%3E%3C/g%3E%3C/svg%3E")`,
            filter: "blur(10px)",
          }}
        />
      )}
      <picture className="relative z-10 block h-full w-full">
        {webpSrc && !error && (
          <source srcSet={webpSrc} type="image/webp" />
        )}
        <img
          src={error ? fallbackSrc : webpSrc || fallbackSrc}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          {...(priority ? { fetchpriority: "high" } : {})}
          className="block h-full w-full transition-opacity duration-200 ease-in-out"
          style={{ opacity: isLoaded ? 1 : 0 }}
          {...props}
        />
      </picture>
    </div>
  );
}
