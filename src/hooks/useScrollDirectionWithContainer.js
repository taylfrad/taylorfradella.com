import { useState, useEffect, useRef } from "react";

export default function useScrollDirectionWithContainer(containerRef) {
  const [scrollDirection, setScrollDirection] = useState("down");
  const lastScrollY = useRef(0);
  const rafIdRef = useRef(null);

  useEffect(() => {
    let ticking = false;
    
    const updateScrollDirection = () => {
      if (!ticking) {
        rafIdRef.current = requestAnimationFrame(() => {
          const scrollContainer = containerRef?.current || document.querySelector("main") || window;
          const scrollY = scrollContainer === window 
            ? window.pageYOffset || document.documentElement.scrollTop
            : scrollContainer.scrollTop;
          
          const direction = scrollY > lastScrollY.current ? "down" : "up";
          
          if (
            direction !== scrollDirection &&
            Math.abs(scrollY - lastScrollY.current) > 5
          ) {
            setScrollDirection(direction);
          }
          
          lastScrollY.current = scrollY > 0 ? scrollY : 0;
          ticking = false;
        });
        ticking = true;
      }
    };

    const scrollContainer = containerRef?.current || document.querySelector("main") || window;
    
    scrollContainer.addEventListener("scroll", updateScrollDirection, { passive: true });
    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
      scrollContainer.removeEventListener("scroll", updateScrollDirection);
    };
  }, [scrollDirection, containerRef]);

  return scrollDirection;
}
