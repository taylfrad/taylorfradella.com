// Scroll-driven animation primitives for scrollytelling project detail pages.
// Vanilla scroll listeners with rAF throttling — no Framer Motion dependency
// so these stay compositor-friendly and avoid React re-render overhead.

import { useEffect, useState } from "react";

// ─── Math utilities ────────────────────────────────────────────────────────

export function clamp(v, lo, hi) {
  return Math.max(lo, Math.min(hi, v));
}

/** Linear interpolation: maps p from [a,b] → [c,d], clamped. */
export function lerp(p, a, b, c, d) {
  return c + clamp((p - a) / (b - a), 0, 1) * (d - c);
}

/** Cubic ease-in-out (0→1). */
export function easeIO(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/** Eased linear interpolation: maps p from [a,b] → [c,d] with cubic ease. */
export function elerp(p, a, b, c, d) {
  return c + easeIO(clamp((p - a) / (b - a), 0, 1)) * (d - c);
}

// ─── Sticky Progress ───────────────────────────────────────────────────────
// Tracks scroll through a tall container (e.g. 220vh) with a sticky child.
// Returns 0 at start → 1 when container fully scrolled past.

export function useStickyProgress(ref) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let ticking = false;

    const update = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const dist = rect.height - vh;
      setProgress(dist > 0 ? clamp(-rect.top / dist, 0, 1) : 0);
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update);
    update();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", update);
    };
  }, [ref]);

  return progress;
}

// ─── View Progress ─────────────────────────────────────────────────────────
// 0 when element top enters viewport bottom → 1 when bottom exits viewport top.

export function useViewProgress(ref) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let ticking = false;

    const update = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      setProgress(clamp((vh - rect.top) / (vh + rect.height), 0, 1));
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update);
    update();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", update);
    };
  }, [ref]);

  return progress;
}

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

// ─── Page Progress (0→1 over entire document) ──────────────────────────────

export function usePageProgress() {
  const [p, setP] = useState(0);

  useEffect(() => {
    let ticking = false;

    const update = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setP(total > 0 ? window.scrollY / total : 0);
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return p;
}

