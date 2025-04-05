// src/hooks/useIntersectionObserver.js
import { useEffect, useRef, useState } from "react";

// Custom hook for detecting when an element enters the viewport
export default function useIntersectionObserver(options = {}) {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    if (!elementRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Update state when intersection status changes
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold: options.threshold || 0.1,
        rootMargin: options.rootMargin || "0px",
      }
    );

    observer.observe(elementRef.current);

    // Cleanup observer
    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [options.threshold, options.rootMargin]);

  return [elementRef, isVisible];
}
