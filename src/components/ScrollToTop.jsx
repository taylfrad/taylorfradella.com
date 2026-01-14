import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname, state } = useLocation();

  useLayoutEffect(() => {
    // If we're on home page and there's no explicit scrollToProjects state, force scroll to top
    const isHomePage = pathname === "/";
    const shouldForceTop = isHomePage && !state?.scrollToProjects;
    
    // CRITICAL: If scrollToProjects is true, DO NOTHING - let Home component handle scrolling
    if (state?.scrollToProjects) {
      return;
    }
    
    // Only force scroll to top if NOT scrolling to projects
    if (shouldForceTop || pathname !== "/") {
      const scrollToTop = () => {
        // Scroll window
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
        document.documentElement.scrollTop = 0;
        document.documentElement.scrollLeft = 0;
        document.body.scrollTop = 0;
        document.body.scrollLeft = 0;
        
        // Scroll main container (most important for Home page)
        const mainContent = document.querySelector("main");
        if (mainContent) {
          // Temporarily disable scroll snap
          const originalScrollSnap = mainContent.style.scrollSnapType;
          mainContent.style.scrollSnapType = 'none';
          
          mainContent.scrollTop = 0;
          mainContent.scrollLeft = 0;
          mainContent.scrollTo({ top: 0, left: 0, behavior: "instant" });
          
          // Re-enable scroll snap after scroll
          setTimeout(() => {
            mainContent.style.scrollSnapType = originalScrollSnap || '';
          }, 100);
        }
        
        // Scroll any other scrollable elements
        const scrollableElements = document.querySelectorAll('[style*="overflow"], [style*="scroll"]');
        scrollableElements.forEach((el) => {
          if (el.scrollTop !== undefined) {
            el.scrollTop = 0;
            el.scrollLeft = 0;
          }
        });
      };
      
      // Immediate scroll
      scrollToTop();
      
      // Multiple attempts to ensure scroll happens
      requestAnimationFrame(() => {
        scrollToTop();
        requestAnimationFrame(() => {
          scrollToTop();
          setTimeout(scrollToTop, 0);
          setTimeout(scrollToTop, 10);
          setTimeout(scrollToTop, 50);
        });
      });
      
      // Final check after delays
      setTimeout(scrollToTop, 100);
      setTimeout(scrollToTop, 200);
    }
    // If scrollToProjects is true, DON'T scroll to top - let Home component handle it
  }, [pathname, state]);

  return null;
}
