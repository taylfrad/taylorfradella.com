import { useEffect, useRef, useState } from "react";

export default function useIntersectionObserver(options = {}) {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef(null);
  const threshold = options.threshold ?? 0.1;
  const rootMargin = options.rootMargin ?? "0px";

  useEffect(() => {
    const node = elementRef.current;
    if (!node) return;
    if (typeof window === "undefined") return;

    if (typeof window.IntersectionObserver !== "function") {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin]);

  return [elementRef, isVisible];
}
