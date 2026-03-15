import { useEffect, useRef, useState } from "react";

const THROTTLE_MS = 180;

export default function useIntersectionObserver(options = {}) {
  const initialVisible = options.initialVisible ?? false;
  const triggerOnce = options.triggerOnce ?? false;
  const [isVisible, setIsVisible] = useState(initialVisible);
  const elementRef = useRef(null);
  const threshold = options.threshold ?? 0.1;
  const rootMargin = options.rootMargin ?? "0px";
  const lastUpdateRef = useRef(0);
  const lastValueRef = useRef(initialVisible);
  const firedRef = useRef(false);

  useEffect(() => {
    const node = elementRef.current;
    if (!node) return;
    if (typeof window === "undefined") return;
    if (triggerOnce && firedRef.current) return;

    if (typeof window.IntersectionObserver !== "function") {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        const next = entry.isIntersecting;
        const now = typeof performance !== "undefined" ? performance.now() : 0;
        const elapsed = now - lastUpdateRef.current;
        // Entering view should be immediate (restores animations/titles quickly),
        // while leaving view can be throttled to avoid rapid toggles.
        const canUpdate =
          next !== lastValueRef.current &&
          (next || elapsed >= THROTTLE_MS || lastUpdateRef.current === 0);
        if (canUpdate) {
          lastValueRef.current = next;
          lastUpdateRef.current = now;
          setIsVisible(next);
          if (triggerOnce && next) {
            firedRef.current = true;
            observer.disconnect();
          }
        }
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
  }, [threshold, rootMargin, triggerOnce]);

  return [elementRef, isVisible];
}
