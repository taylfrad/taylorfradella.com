import { Suspense, lazy, useCallback, useEffect, useRef, useState } from "react";
import PageHeader from "./PageHeader";
import Footer from "./Footer";
import { ChevronUpIcon } from "@/components/ui/chevron-up";
import { smoothScrollToTop } from "@/lib/navigation";

const About = lazy(() => import("./About"));

// Site-wide footer (with the global --site-footer-bg tint applied by Footer
// itself, so it reads as a distinct surface from the page body).
export default function AboutPage() {
  const sentinelRef = useRef(null);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Same pattern as Home — when the sentinel scrolls out of viewport
  // (~90vh from top), reveal the back-to-top button.
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => setShowBackToTop(!entry.isIntersecting),
      { threshold: 0 },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  const scrollToTop = useCallback(() => smoothScrollToTop(), []);

  return (
    <div
      className="relative w-full"
      style={{
        minHeight: "100svh",
        background: "var(--bg-secondary)",
        color: "var(--text-primary)",
      }}
    >
      <PageHeader active="about" theme="light" />

      {/* Viewport-edge blur masks — content dissolves into a soft blur +
          color fade as it scrolls past the top and bottom of the screen. */}
      <div className="about-edge-fade about-edge-fade--top" aria-hidden />
      <div className="about-edge-fade about-edge-fade--bottom" aria-hidden />

      {/* Sentinel for back-to-top IntersectionObserver — sits at 50vh so the
          button appears once the user has scrolled halfway past the landing
          position. (Home/Projects use 90vh because their hero fills the
          viewport; About has no hero, so its landing position is the top.) */}
      <div
        ref={sentinelRef}
        className="pointer-events-none absolute left-0 top-[50vh] h-px w-px"
        aria-hidden
      />
      {/* Top padding so About content doesn't slip under the fixed header */}
      <div style={{ paddingTop: "120px" }}>
        <Suspense fallback={<div style={{ height: "60vh" }} />}>
          <About />
        </Suspense>
      </div>
      {/* Lift the footer above the bottom edge-fade strip (z-30) so its
          `backdrop-filter: blur` has no footer content behind it to smudge.
          The strip still feathers the About body text as intended. */}
      <div className="relative z-40">
        <Footer />
      </div>

      <button
        type="button"
        onClick={scrollToTop}
        className={`fixed bottom-6 right-6 z-50 inline-flex items-center justify-center p-2 text-[var(--text-tertiary)] transition-all duration-300 ease-out hover:text-[var(--text-primary)] md:bottom-8 md:right-8 ${
          showBackToTop
            ? "translate-x-0 opacity-100"
            : "translate-x-16 opacity-0 pointer-events-none"
        }`}
        aria-label="Back to top"
        title="Back to top"
      >
        <ChevronUpIcon size={36} />
      </button>
    </div>
  );
}
