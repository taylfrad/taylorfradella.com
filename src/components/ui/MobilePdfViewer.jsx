import { useState, useRef, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

/**
 * Renders PDF pages to canvas for mobile devices where iframe PDF
 * viewing is unreliable (iOS Safari renders at native 612pt width).
 */
export default function MobilePdfViewer({ src }) {
  const [numPages, setNumPages] = useState(null);
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setContainerWidth(entry.contentRect.width);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="h-full w-full overflow-auto">
      <Document
        file={src}
        onLoadSuccess={({ numPages: n }) => setNumPages(n)}
        loading={
          <div className="flex h-full items-center justify-center">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-[var(--text-tertiary)] border-t-[var(--text-primary)]" />
          </div>
        }
        error={
          <div className="flex h-full items-center justify-center px-6 text-center text-sm text-[var(--text-secondary)]">
            Unable to load PDF. Try opening it directly.
          </div>
        }
      >
        {numPages &&
          containerWidth > 0 &&
          Array.from({ length: numPages }, (_, i) => (
            <Page
              key={i + 1}
              pageNumber={i + 1}
              width={containerWidth}
              renderTextLayer={false}
              renderAnnotationLayer={false}
            />
          ))}
      </Document>
    </div>
  );
}
