"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useState, useEffect, useRef, useCallback } from "react";
import GlassSurface from "@/components/surfaces/GlassSurface";

// Inject carousel CSS once at module level instead of via dangerouslySetInnerHTML
// on every mount. Prevents duplicate <style> tags and avoids CSSOM churn.
let _cssInjected = false;
function ensureCarouselCSS() {
  if (_cssInjected || typeof document === "undefined") return;
  _cssInjected = true;
  const style = document.createElement("style");
  style.setAttribute("data-cascade-slider", "");
  style.textContent = EMBEDDED_CSS;
  document.head.appendChild(style);
}

// --- MINIMIZED CSS Styles (Only core 3D positioning and responsiveness remain) ---
const EMBEDDED_CSS = `
/* --- Cascade Slider Styles --- */

.cascade-slider_container {
    position: relative;
    width: 100%;
    height: 100%;
    max-width: 100%;
    margin: 0 auto;
    z-index: 20; 
    user-select: none;
    -webkit-user-select: none; 
    touch-action: pan-y;
    overflow: hidden;
}

.cascade-slider_slides {
    position: relative;
    height: 100%; 
}

.cascade-slider_item {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateY(-50%) translateX(-50%) scale(0.3); 
    transition: transform 1s ease, opacity 0.5s ease;
    opacity: 0;
    z-index: 1; 
    cursor: grab; 
}
.cascade-slider_item.now {
    cursor: default;
}
.cascade-slider_item:active {
    cursor: grabbing;
}

/* Slide Positioning Classes (Core 3D Logic - MUST REMAIN IN CSS) */
.cascade-slider_item.next {
    left: 50%;
    transform: translateY(-50%) translateX(-120%) scale(0.6);
    opacity: 1;
    z-index: 4; 
}
.cascade-slider_item.prev {
    left: 50%;
    transform: translateY(-50%) translateX(20%) scale(0.6);
    opacity: 1;
    z-index: 4; 
}
.cascade-slider_item.now {
    top: 50%;
    left: 50%;
    transform: translateY(-50%) translateX(-50%) scale(1);
    opacity: 1;
    z-index: 5; 
}

/* Arrows - Structural CSS remains for positioning/size */
.cascade-slider_arrow {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 50%;
    cursor: pointer;
    z-index: 6; 
    transform: translate(0, -50%);
    width: clamp(44px, 5vw, 56px); 
    height: clamp(44px, 5vw, 56px); 
    transition: all 0.3s ease;
}

/* Keep arrows perfectly still on press: GlassSurface adds an :active transform
   that would otherwise override our centering transform and cause a "jump". */
.cascade-slider_arrow.glass-surface--interactive:active {
    transform: translate(0, -50%);
}

/* Arrow Positioning Fix (Responsive CSS) */
@media screen and (max-width: 575px) {
    .cascade-slider_arrow-left { 
        left: 8px; 
    }
    .cascade-slider_arrow-right { 
        right: 8px; 
    }
}
@media screen and (min-width: 576px) {
    .cascade-slider_arrow-left { left: 10px; }
    .cascade-slider_arrow-right { right: 10px; }
}

/* Images */
.cascade-slider_slides img {
    width: auto;
    max-width: clamp(160px, 42vw, 340px);
    height: auto;
    border-radius: 16px;
    display: block;
    transition: filter 1s ease, box-shadow 0.4s ease;
    box-shadow: 0 6px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06);
}
.cascade-slider_item.now img {
    box-shadow: 0 10px 48px rgba(0,0,0,0.18), 0 2px 12px rgba(0,0,0,0.08);
}
.cascade-slider_item:not(.now) img {
    filter: grayscale(0.95);
}

/* --- Media Queries (Minimized to only include structural layout changes) --- */
@media screen and (min-width: 414px) {
    .cascade-slider_slides img { max-width: 220px; }
}
@media screen and (min-width: 576px) {
    .cascade-slider_slides img { max-width: 270px; }
}
@media screen and (min-width: 768px) {
    .cascade-slider_item.next { transform: translateY(-50%) translateX(-125%) scale(0.6); }
    .cascade-slider_item.prev { transform: translateY(-50%) translateX(25%) scale(0.6); }
    .cascade-slider_slides img { max-width: 250px; }
}
@media screen and (min-width: 991px) {
    .cascade-slider_item.next { transform: translateY(-50%) translateX(-115%) scale(0.55); z-index: 4; }
    .cascade-slider_item.prev { transform: translateY(-50%) translateX(15%) scale(0.55); z-index: 4; }
    .cascade-slider_item.next2 { transform: translateY(-50%) translateX(-150%) scale(0.37); z-index: 1; }
    .cascade-slider_item.prev2 { transform: translateY(-50%) translateX(50%) scale(0.37); z-index: 2; }
    .cascade-slider_slides img { max-width: 300px; }
}
@media screen and (min-width: 1100px) {
    .cascade-slider_item.next { transform: translateY(-50%) translateX(-130%) scale(0.55); }
    .cascade-slider_item.prev { transform: translateY(-50%) translateX(30%) scale(0.55); }
    .cascade-slider_item.next2 { transform: translateY(-50%) translateX(-180%) scale(0.37); }
    .cascade-slider_item.prev2 { transform: translateY(-50%) translateX(80%) scale(0.37); }
    .cascade-slider_slides img { max-width: 350px; }
}
`;

// --- Helper Function: Get Slide Classes ---
const getSlideClasses = (index, activeIndex, total, visibleCount) => {
  const diff = index - activeIndex;
  if (diff === 0) return "now";
  if (diff === 1 || diff === -total + 1) return "next";
  if (visibleCount === 5 && (diff === 2 || diff === -total + 2)) return "next2";
  if (diff === -1 || diff === total - 1) return "prev";
  if (visibleCount === 5 && (diff === -2 || diff === total - 2)) return "prev2";
  return "";
};

export default function ThreeDImageCarousel({
  slides,
  itemCount = 5,
  autoplay = false,
  delay = 3,
  pauseOnHover = true,
  className = "",
  onSlideClick,
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const autoplayIntervalRef = useRef(null);
  const total = slides.length;

  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const swipeThreshold = 50;

  const navigate = useCallback(
    (direction) => {
      setActiveIndex((current) => {
        if (total <= 1) return current;
        if (direction === "next") return (current + 1) % total;
        return (current - 1 + total) % total;
      });
    },
    [total],
  );

  const startAutoplay = useCallback(() => {
    if (autoplay && total > 1) {
      if (autoplayIntervalRef.current) {
        clearInterval(autoplayIntervalRef.current);
      }
      autoplayIntervalRef.current = window.setInterval(() => {
        navigate("next");
      }, delay * 1000);
    }
  }, [autoplay, delay, navigate, total]);

  const stopAutoplay = useCallback(() => {
    if (autoplayIntervalRef.current) {
      clearInterval(autoplayIntervalRef.current);
      autoplayIntervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    startAutoplay();
    return () => {
      stopAutoplay();
    };
  }, [startAutoplay, stopAutoplay]);

  const handleMouseEnter = () => {
    if (autoplay && pauseOnHover) stopAutoplay();
  };

  const handleEnd = (clientX) => {
    if (!isDragging) return;
    const distance = clientX - startX;
    if (Math.abs(distance) > swipeThreshold) {
      if (distance < 0) navigate("next");
      else navigate("prev");
    }
    setIsDragging(false);
    setStartX(0);
  };

  const handleExit = (e) => {
    if (autoplay && pauseOnHover) startAutoplay();
    if (isDragging) handleEnd(e.clientX);
  };

  const handleStart = (clientX) => {
    setIsDragging(true);
    setStartX(clientX);
    stopAutoplay();
  };

  const onMouseDown = (e) => handleStart(e.clientX);
  const onMouseUp = (e) => {
    handleEnd(e.clientX);
    startAutoplay();
  };

  const onTouchStart = (e) => handleStart(e.touches[0].clientX);
  const onTouchEnd = (e) => {
    handleEnd(e.changedTouches[0].clientX);
    startAutoplay();
  };

  useEffect(() => { ensureCarouselCSS(); }, []);

  return (
    <>
      <div
        className={`cascade-slider_container ${className} bg-transparent`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleExit}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div className="cascade-slider_slides">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`cascade-slider_item ${getSlideClasses(
                index,
                activeIndex,
                total,
                itemCount,
              )}`}
              data-slide-number={index}
            >
              <a
                href={slide.href ?? "#"}
                onClick={(e) => {
                  if (onSlideClick) {
                    e.preventDefault();
                    onSlideClick(index);
                    return;
                  }
                  if (!slide.href) e.preventDefault();
                }}
              >
                <img
                  src={slide.src}
                  alt={slide.alt ?? `Slide ${index + 1}`}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = `https://placehold.co/350x200/4F46E5/ffffff?text=Slide%20${index + 1}`;
                  }}
                />
              </a>
            </div>
          ))}
        </div>

        {total > 1 && (
          <>
            <GlassSurface
              as="span"
              variant="clear"
              className="cascade-slider_arrow cascade-slider_arrow-left rounded-full text-white/95 shadow-lg shadow-black/40 transition-colors duration-200 [&>.glass-surface__fill]:opacity-0 [&>.glass-surface__highlight]:opacity-0 [&>.glass-surface__noise]:opacity-0 [&>.glass-surface__border]:opacity-0"
              onClick={(e) => {
                e.stopPropagation();
                navigate("prev");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  navigate("prev");
                }
              }}
              tabIndex={0}
              data-action="prev"
              role="button"
              aria-label="Previous screenshot"
              style={{
                backgroundColor: "rgba(0,0,0,0.82)",
                borderColor: "rgba(255,255,255,0.18)",
              }}
            >
              <ChevronLeft size={34} strokeWidth={2.8} />
            </GlassSurface>
            <GlassSurface
              as="span"
              variant="clear"
              className="cascade-slider_arrow cascade-slider_arrow-right rounded-full text-white/95 shadow-lg shadow-black/40 transition-colors duration-200 [&>.glass-surface__fill]:opacity-0 [&>.glass-surface__highlight]:opacity-0 [&>.glass-surface__noise]:opacity-0 [&>.glass-surface__border]:opacity-0"
              onClick={(e) => {
                e.stopPropagation();
                navigate("next");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  navigate("next");
                }
              }}
              tabIndex={0}
              data-action="next"
              role="button"
              aria-label="Next screenshot"
              style={{
                backgroundColor: "rgba(0,0,0,0.82)",
                borderColor: "rgba(255,255,255,0.18)",
              }}
            >
              <ChevronRight size={34} strokeWidth={2.8} />
            </GlassSurface>
          </>
        )}
      </div>
    </>
  );
}

