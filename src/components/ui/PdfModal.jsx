import { useEffect, useRef, useCallback, useState } from "react";
import { createPortal } from "react-dom";
import { X, ExternalLink, Download } from "lucide-react";

/**
 * Trap focus within a container element.
 * Returns a keydown handler that wraps Tab/Shift+Tab.
 */
function createFocusTrap(containerRef) {
  return (e) => {
    if (e.key !== "Tab") return;
    const container = containerRef.current;
    if (!container) return;
    const focusable = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };
}

/** Detect mobile/small-screen where PDF iframes are unusable */
function useIsMobileView() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 640);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const handler = (e) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return isMobile;
}

/**
 * Full-screen PDF modal portalled to document.body.
 *
 * On desktop: iframe viewer stays mounted so the PDF is already rendered.
 * On mobile: shows action buttons to open/download since iframe PDFs are
 * unreliable on small screens.
 *
 * Show/hide is handled via CSS opacity + visibility + transform for
 * compositor-only animation (no layout thrash).
 */
export default function PdfModal({ open, onClose, src, title = "Document", preload = false }) {
  const overlayRef = useRef(null);
  const dialogRef = useRef(null);
  const closeButtonRef = useRef(null);
  const hasEverOpened = useRef(false);
  const previousFocusRef = useRef(null);
  const isMobile = useIsMobileView();

  // Track whether we should keep the iframe alive
  if (open) hasEverOpened.current = true;

  // Focus management: move focus into modal on open, restore on close
  useEffect(() => {
    if (open) {
      previousFocusRef.current = document.activeElement;
      // Delay focus slightly so the transition has started
      requestAnimationFrame(() => {
        closeButtonRef.current?.focus();
      });
    } else if (previousFocusRef.current) {
      previousFocusRef.current.focus();
      previousFocusRef.current = null;
    }
  }, [open]);

  // Escape key + focus trap
  useEffect(() => {
    if (!open) return;
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    const trapFocus = createFocusTrap(dialogRef);
    window.addEventListener("keydown", handleKey);
    window.addEventListener("keydown", trapFocus);
    return () => {
      window.removeEventListener("keydown", handleKey);
      window.removeEventListener("keydown", trapFocus);
    };
  }, [open, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = ""; };
    }
  }, [open]);

  const handleOverlayClick = useCallback(
    (e) => {
      if (e.target === overlayRef.current) onClose();
    },
    [onClose],
  );

  // Don't render until src exists and the modal has been triggered (or preload is set)
  if (!src || (!hasEverOpened.current && !preload)) return null;

  return createPortal(
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4"
      style={{
        backgroundColor: "rgba(0,0,0,0.55)",
        opacity: open ? 1 : 0,
        visibility: open ? "visible" : "hidden",
        transition: "opacity 0.2s ease, visibility 0.2s ease",
        willChange: "opacity",
        paddingTop: "calc(env(safe-area-inset-top, 0px) + 12px)",
        paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 12px)",
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="relative flex h-full w-full max-h-[90vh] max-w-4xl flex-col overflow-hidden rounded-xl sm:rounded-2xl bg-[var(--bg-primary)] shadow-2xl sm:h-[85vh] sm:w-[90vw]"
        style={{
          transform: open ? "scale(1) translateY(0)" : "scale(0.97) translateY(12px)",
          opacity: open ? 1 : 0,
          transition: "transform 0.25s cubic-bezier(0.16,1,0.3,1), opacity 0.2s ease",
          willChange: "transform, opacity",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--card-border)] px-4 py-2.5 sm:px-5 sm:py-3">
          <span className="text-xs font-medium text-[var(--text-primary)] sm:text-sm">
            {title}
          </span>
          <div className="flex items-center gap-1.5">
            {/* Open in new tab — always available as escape hatch */}
            <a
              href={src}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--text-secondary)] transition-colors hover:bg-[var(--card-bg)] hover:text-[var(--text-primary)]"
              aria-label={`Open ${title.toLowerCase()} in new tab`}
            >
              <ExternalLink size={16} />
            </a>
            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--text-secondary)] transition-colors hover:bg-[var(--card-bg)] hover:text-[var(--text-primary)]"
              aria-label={`Close ${title.toLowerCase()}`}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Content — iframe on desktop, action buttons on mobile */}
        {isMobile ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-10">
            <div className="text-center">
              <p className="mb-2 text-base font-semibold text-[var(--text-primary)]">
                {title}
              </p>
              <p className="text-sm text-[var(--text-secondary)]">
                Open or download to view this document.
              </p>
            </div>
            <div className="flex flex-col gap-3 w-full max-w-[240px]">
              <a
                href={src}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--text-primary)] px-5 py-3 text-sm font-medium text-[var(--bg-primary)] transition-opacity hover:opacity-90"
              >
                <ExternalLink size={16} />
                Open in Browser
              </a>
              <a
                href={src}
                download
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--card-border)] px-5 py-3 text-sm font-medium text-[var(--text-primary)] transition-colors hover:bg-[var(--card-bg)]"
              >
                <Download size={16} />
                Download PDF
              </a>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-hidden">
            <iframe
              src={src}
              title={title}
              className="h-full w-full border-0"
            />
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
