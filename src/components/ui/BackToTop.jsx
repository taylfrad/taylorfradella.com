import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { smoothScrollToTop } from "@/lib/navigation";
import { ChevronUpIcon } from "@/components/ui/chevron-up";

export default function BackToTop({ threshold = 300, size = 36 }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    let prev = false;
    const onScroll = () => {
      const next = window.scrollY > threshold;
      if (next !== prev) { prev = next; setShow(next); }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  const scrollToTop = useCallback(() => smoothScrollToTop(), []);

  return createPortal(
    <button
      type="button"
      onClick={scrollToTop}
      className={`fixed bottom-4 right-4 z-[9999] inline-flex min-h-[44px] min-w-[44px] items-center justify-center p-2 text-[var(--text-tertiary)] transition-all duration-500 ease-out hover:text-[var(--text-primary)] sm:bottom-6 sm:right-6 md:bottom-8 md:right-8 ${
        show
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0"
      }`}
      // MOBILE-SWARM: layout — keep the fixed back-to-top chevron clear of the
      // home indicator / curved corner on notched phones. Insets resolve to 0
      // on desktop and until the touch lane adds viewport-fit=cover, so this is
      // a no-op everywhere it shouldn't apply. (QA: re-check on a notched profile.)
      style={{
        marginBottom: "env(safe-area-inset-bottom, 0px)",
        marginRight: "env(safe-area-inset-right, 0px)",
      }}
      aria-label="Back to top"
      title="Back to top"
    >
      <ChevronUpIcon size={size} />
    </button>,
    document.body,
  );
}
