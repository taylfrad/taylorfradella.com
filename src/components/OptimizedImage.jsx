import { useState, useEffect, useRef } from "react";
import { Box } from "@mui/material";

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
  const imgRef = useRef(null);

  // Convert PNG path to WebP path
  const getWebPSrc = (pngSrc) => {
    if (!pngSrc) return null;
    // Replace .png with .webp
    return pngSrc.replace(/\.png$/i, '.webp');
  };

  const webpSrc = getWebPSrc(src);
  const fallbackSrc = src;

  // Preload image if priority
  useEffect(() => {
    if (priority) {
      // Preload WebP first, then PNG as fallback
      if (webpSrc) {
        const webpLink = document.createElement('link');
        webpLink.rel = 'preload';
        webpLink.as = 'image';
        webpLink.href = webpSrc;
        webpLink.type = 'image/webp';
        document.head.appendChild(webpLink);
      }
      // Also preload PNG fallback for older browsers
      const pngLink = document.createElement('link');
      pngLink.rel = 'preload';
      pngLink.as = 'image';
      pngLink.href = fallbackSrc;
      document.head.appendChild(pngLink);
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
    <Box
      sx={{
        display: 'block',
        position: 'relative',
        width: '100%',
        height: '100%',
        ...sx,
      }}
      className={className}
    >
      {/* Blur placeholder while loading */}
      {!isLoaded && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: '#f5f5f7',
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23d0d0d0' fill-opacity='0.4'%3E%3Cpath d='M20 20.5V18H0v-2h20v-2H0v-2h20v-2H0V8h20V6H0v-2h20V2H0V0h22v20h-2zm-2 2v20H0v-2h18V22z'/%3E%3C/g%3E%3C/svg%3E")`,
            filter: 'blur(10px)',
            opacity: 0.5,
            zIndex: 0,
          }}
        />
      )}
      <Box
        component="picture"
        sx={{
          display: 'block',
          width: '100%',
          height: '100%',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* WebP source with fallback */}
        {webpSrc && !error && (
          <source srcSet={webpSrc} type="image/webp" />
        )}
        <Box
          component="img"
          ref={imgRef}
          src={error ? fallbackSrc : (webpSrc || fallbackSrc)}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          fetchPriority={priority ? "high" : "auto"}
          sx={{
            width: '100%',
            height: '100%',
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 0.2s ease-in-out',
            display: 'block',
          }}
          {...props}
        />
      </Box>
    </Box>
  );
}
