// Scroll-driven animation primitives for scrollytelling project detail pages.
// Vanilla scroll listener with polling fallback — no Framer Motion dependency,
// so this stays compositor-friendly and avoids React re-render overhead.
//
// Scroll-linked progress is now driven by Framer's useScroll() motion values
// in ProjectDetail (see useStickyMotion there), which write transform/opacity
// straight to the DOM. easeIO is reused there as the useTransform() easing so
// the motion curve matches the original elerp()-based reveals.

import { useEffect, useState } from "react";
import { easeInOutCubic } from "@/lib/easing";

/** Cubic ease-in-out (0→1). Re-exported as the easing curve for scroll-linked
 *  useTransform() ranges in ProjectDetail. */
export const easeIO = easeInOutCubic;

// ─── InView (scroll + polling fallback, fires once) ────────────────────────

export function useScrollyInView(ref) {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let active = true;

    const check = () => {
      if (!active) return;
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight - 50) {
        setInView(true);
        active = false;
        clearInterval(interval);
        window.removeEventListener("scroll", onScroll);
      }
    };

    const onScroll = () => check();
    window.addEventListener("scroll", onScroll, { passive: true });
    const interval = setInterval(check, 500);
    check();

    return () => {
      active = false;
      clearInterval(interval);
      window.removeEventListener("scroll", onScroll);
    };
  }, [ref]);

  return inView;
}
