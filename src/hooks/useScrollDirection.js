import { useState, useEffect, useRef } from "react";

export default function useScrollDirection() {
  const [scrollDirection, setScrollDirection] = useState("down");
  const lastScrollY = useRef(0);
  const rafIdRef = useRef(null);

  useEffect(() => {
    let ticking = false;
    
    const updateScrollDirection = () => {
      if (!ticking) {
        rafIdRef.current = requestAnimationFrame(() => {
          const scrollY = window.pageYOffset || document.documentElement.scrollTop;
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

    window.addEventListener("scroll", updateScrollDirection, { passive: true });
    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
      window.removeEventListener("scroll", updateScrollDirection);
    };
  }, [scrollDirection]);

  return scrollDirection;
}
