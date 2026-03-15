import { useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

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

/**
 * Full-screen PDF modal portalled to document.body.
 *
 * The iframe stays mounted once `src` is provided so the PDF is already
 * rendered when the modal opens — no re-fetch / re-parse lag on each click.
 * Show/hide is handled via CSS opacity + visibility + transform for
 * compositor-only animation (no layout thrash).
 */
export default function PdfModal({ open, onClose, src, title = "Document", preload = false }) {
  const overlayRef = useRef(null);
  const dialogRef = useRef(null);
  const closeButtonRef = useRef(null);
  const hasEverOpened = useRef(false);
  const previousFocusRef = useRef(null);

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
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{
        backgroundColor: "rgba(0,0,0,0.55)",
        opacity: open ? 1 : 0,
        visibility: open ? "visible" : "hidden",
        transition: "opacity 0.2s ease, visibility 0.2s ease",
        willChange: "opacity",
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="relative flex h-[90vh] w-[90vw] max-w-4xl flex-col overflow-hidden rounded-2xl bg-[var(--bg-primary)] shadow-2xl"
        style={{
          transform: open ? "scale(1) translateY(0)" : "scale(0.97) translateY(12px)",
          opacity: open ? 1 : 0,
          transition: "transform 0.25s cubic-bezier(0.16,1,0.3,1), opacity 0.2s ease",
          willChange: "transform, opacity",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--card-border)] px-5 py-3">
          <span className="text-sm font-medium text-[var(--text-primary)]">
            {title}
          </span>
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

        {/* PDF iframe — stays mounted so the PDF doesn't re-render */}
        <div className="flex-1 overflow-hidden">
          <iframe
            src={src}
            title={title}
            className="h-full w-full border-0"
          />
        </div>
      </div>
    </div>,
    document.body,
  );
}
