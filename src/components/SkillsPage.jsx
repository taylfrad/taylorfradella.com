import { Suspense, lazy, useCallback, useEffect, useRef, useState } from "react";
import PageHeader from "./PageHeader";
import Footer from "./Footer";
import { ChevronUpIcon } from "@/components/ui/chevron-up";
import { smoothScrollToTop } from "@/lib/navigation";

// Skills retains its existing scrollytelling internals — we just put it on
// its own route with the shared subpage shell (top nav + footer at the end).
const Skills = lazy(() => import("./Skills"));

export default function SkillsPage() {
  const sentinelRef = useRef(null);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Same pattern as Home/About — sentinel at 90vh, IntersectionObserver flips
  // state once when it scrolls out of viewport.
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
      <PageHeader active="skills" theme="light" />
      <div
        ref={sentinelRef}
        className="pointer-events-none absolute left-0 top-[90vh] h-px w-px"
        aria-hidden
      />
      <Suspense fallback={<div style={{ height: "100svh" }} />}>
        <Skills />
      </Suspense>
      {/* Footer is absolutely positioned at the bottom of the SkillsPage
          container. The container's height is driven entirely by the Skills
          section (which uses internal sticky scrolling), so max scroll lands
          exactly when the footer's bottom edge meets viewport bottom — there
          is no "dead scroll" past the parked footer. During the last sliver
          of scroll, the footer rises into view from below while the sticky-
          pinned slide 4 stays static above it (the parallax effect). */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
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
