import { lazy, Suspense, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useInView, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { projectsData } from "../data/projectsData";
import {
  ACCENT_DEFAULT,
  ACCENT_WORKLY,
  BACKGROUND_DARK,
  SCROLL_TO_PROJECTS_FLAG,
} from "@/constants";
import GlassSurface from "@/components/surfaces/GlassSurface";
import OptimizedImage from "./OptimizedImage";
import ThreeDImageCarousel from "@/components/lightswind/3d-image-carousel";
import { useTheme } from "@/components/theme-provider";
import { Box, Typography, Dialog, IconButton } from "@/components/ui/sx-primitives";
import {
  slideSpringPrimary,
  slideSpringSecondary,
} from "@/shared/animation/presets";
import { GithubIcon } from "@/components/ui/github";
import { YoutubeIcon } from "@/components/ui/youtube";
import { FileTextIcon } from "@/components/ui/file-text";
import { ExternalLinkIcon } from "@/components/ui/external-link";
import { ChevronUpIcon } from "@/components/ui/chevron-up";
import PdfModal from "@/components/ui/PdfModal";

const Footer = lazy(() => import("./Footer"));

/** Scroll-driven fade — same useScroll/useTransform pattern as Skills & Projects.
 *  Offset uses "start 0.85" so sections stay invisible until their top reaches
 *  85% of the viewport, matching the visual feel of Home page sections that
 *  start below the full-height hero. */
function useScrollFade(ref, reducedMotion) {
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end start"],
  });
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.2, 0.8, 1],
    reducedMotion ? [1, 1, 1, 1] : [0, 1, 1, 1],
  );
  const y = useTransform(
    scrollYProgress,
    [0, 0.2, 0.8, 1],
    reducedMotion ? [0, 0, 0, 0] : [24, 0, 0, 0],
  );
  return { opacity, y };
}

function RevealSection({ children, className = "" }) {
  const ref = useRef(null);
  const reducedMotion = useReducedMotion();
  const { opacity, y } = useScrollFade(ref, reducedMotion);

  return (
    <motion.div
      ref={ref}
      className={`relative ${className}`}
      style={{ opacity, y }}
    >
      {children}
    </motion.div>
  );
}

const slideVariants = {
  enter: (direction) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0,
    scale: 0.96,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction) => ({
    zIndex: 0,
    x: direction < 0 ? "100%" : "-100%",
    opacity: 0,
    scale: 0.96,
  }),
};

function useBodyScrollLock(isLocked) {
  useEffect(() => {
    if (!isLocked) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isLocked]);
}

function useLightboxArrowKeys({ enabled, onLeft, onRight, onEscape }) {
  useEffect(() => {
    if (!enabled) return undefined;
    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight") {
        onRight();
      }
      if (e.key === "ArrowLeft") {
        onLeft();
      }
      if (e.key === "Escape" && onEscape) {
        onEscape();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [enabled, onLeft, onRight, onEscape]);
}

function parseAccentRgb(accentColor) {
  const normalized = /^#?[0-9a-fA-F]{6}$/.test(accentColor ?? "")
    ? accentColor.replace("#", "")
    : "0071e3";
  return {
    r: Number.parseInt(normalized.slice(0, 2), 16),
    g: Number.parseInt(normalized.slice(2, 4), 16),
    b: Number.parseInt(normalized.slice(4, 6), 16),
  };
}

function getAccentRgba(accentColor, alpha = 1) {
  const { r, g, b } = parseAccentRgb(accentColor);
  return `rgba(${r},${g},${b},${alpha})`;
}

function TimelineItem({ milestone, index, total, accentColor, lineGradient }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px 0px" });
  const reducedMotion = useReducedMotion();
  const isLast = index === total - 1;

  /* Apple-like deceleration curve */
  const ease = [0.33, 0, 0.2, 1];
  const anim = !reducedMotion;

  return (
    <div ref={ref} className="relative" style={{ paddingBottom: isLast ? 0 : "2.25rem" }}>
      {/* Connecting line — draws downward from dot */}
      {!isLast && (
        <motion.div
          initial={anim ? { scaleY: 0 } : false}
          animate={isInView || !anim ? { scaleY: 1 } : {}}
          transition={anim ? { duration: 0.55, delay: 0.3, ease } : { duration: 0 }}
          className="absolute left-[7px] top-6 bottom-0 w-[2px] origin-top"
          style={{ background: lineGradient }}
          aria-hidden
        />
      )}

      <div className="flex items-start gap-4 sm:gap-5">
        {/* Dot node */}
        <div className="relative flex-shrink-0" style={{ width: 16, height: 16 }}>
          {/* Ambient glow — brief bloom behind dot (decorative, skip reduced motion) */}
          {anim && (
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={isInView ? { scale: [0.5, 2.5, 2.5], opacity: [0, 0.25, 0] } : {}}
              transition={{ duration: 0.8, delay: 0.05, ease }}
              className="absolute inset-[-4px] rounded-full"
              style={{ background: `radial-gradient(circle, ${getAccentRgba(accentColor, 0.35)} 0%, transparent 70%)` }}
              aria-hidden
            />
          )}
          {/* Ring pulse — subtle ripple (decorative, skip reduced motion) */}
          {anim && (
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={isInView ? { scale: [0.6, 1.6], opacity: [0.3, 0] } : {}}
              transition={{ duration: 0.6, delay: 0.12, ease }}
              className="absolute inset-0 rounded-full"
              style={{ border: `1.5px solid ${accentColor}` }}
              aria-hidden
            />
          )}
          {/* Solid dot — springs in with controlled damping */}
          <motion.div
            initial={anim ? { scale: 0 } : false}
            animate={isInView || !anim ? { scale: 1 } : {}}
            transition={anim ? { type: "spring", stiffness: 260, damping: 24, delay: 0.06 } : { duration: 0 }}
            className="absolute inset-0 rounded-full"
            style={{ border: `3px solid ${accentColor}`, backgroundColor: "var(--bg-secondary)" }}
          />
        </div>

        {/* Content — slides in from the timeline rail direction */}
        <div className="min-w-0 flex-1 -mt-0.5">
          <motion.p
            initial={anim ? { opacity: 0, x: -14 } : false}
            animate={isInView || !anim ? { opacity: 1, x: 0 } : {}}
            transition={anim ? { duration: 0.45, delay: 0.1, ease } : { duration: 0 }}
            className="text-[15px] font-semibold text-foreground sm:text-base"
          >
            {milestone.phase}
          </motion.p>
          <motion.p
            initial={anim ? { opacity: 0, x: -10 } : false}
            animate={isInView || !anim ? { opacity: 1, x: 0 } : {}}
            transition={anim ? { duration: 0.4, delay: 0.18, ease } : { duration: 0 }}
            className="mt-0.5 text-[11px] font-medium uppercase tracking-[0.15em] sm:text-xs"
            style={{ color: accentColor }}
          >
            {milestone.date}
          </motion.p>
          <motion.p
            initial={anim ? { opacity: 0, x: -8 } : false}
            animate={isInView || !anim ? { opacity: 1, x: 0 } : {}}
            transition={anim ? { duration: 0.4, delay: 0.26, ease } : { duration: 0 }}
            className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground sm:text-sm"
          >
            {milestone.description}
          </motion.p>
        </div>
      </div>
    </div>
  );
}

function ScrollTimeline({ items, accentColor = "#0071e3" }) {
  const lineGradient = useMemo(
    () => `linear-gradient(180deg, ${accentColor} 0%, ${getAccentRgba(accentColor, 0.2)} 100%)`,
    [accentColor],
  );
  return (
    <div className="relative">
      {items.map((milestone, index) => (
        <TimelineItem
          key={`${milestone.phase}-${index}`}
          lineGradient={lineGradient}
          milestone={milestone}
          index={index}
          total={items.length}
          accentColor={accentColor}
        />
      ))}
    </div>
  );
}

// Depth-peek showcase carousel — center slide at full scale, adjacent slides
// visible at edges with reduced scale/opacity for spatial depth. Spring-animated.
function ShowcaseCarousel({ screenshots, projectTitle, accentColor = ACCENT_DEFAULT }) {
  const [active, setActive] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [lightboxDirection, setLightboxDirection] = useState(0);
  const lightboxDragX = useMotionValue(0);

  const total = screenshots.length;

  const go = useCallback((i) => setActive(((i % total) + total) % total), [total]);
  const next = useCallback(() => go(active + 1), [go, active]);
  const prev = useCallback(() => go(active - 1), [go, active]);

  // Keyboard navigation (disabled while lightbox is open)
  useEffect(() => {
    if (lightboxOpen) return undefined;
    const onKey = (e) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxOpen, next, prev]);

  // Lightbox navigation
  const nextLB = useCallback(() => {
    setLightboxDirection(1);
    setLightboxIndex((p) => (p + 1) % total);
  }, [total]);
  const prevLB = useCallback(() => {
    setLightboxDirection(-1);
    setLightboxIndex((p) => (p - 1 + total) % total);
  }, [total]);
  useLightboxArrowKeys({
    enabled: lightboxOpen,
    onLeft: prevLB,
    onRight: nextLB,
    onEscape: () => setLightboxOpen(false),
  });
  useBodyScrollLock(lightboxOpen);

  const handleLBDragEnd = useCallback(
    (_, info) => {
      if (Math.abs(info.offset.x) > 50) {
        info.offset.x > 0 ? prevLB() : nextLB();
      }
      lightboxDragX.set(0);
    },
    [prevLB, nextLB, lightboxDragX],
  );

  // Relative position: -1 = left peek, 0 = center, 1 = right peek, null = hidden
  const getPosition = useCallback(
    (i) => {
      if (total <= 1) return i === active ? 0 : null;
      const diff = ((i - active) % total + total) % total;
      if (diff === 0) return 0;
      if (diff === 1) return 1;
      if (diff === total - 1) return -1;
      return null;
    },
    [active, total],
  );

  const springConfig = { type: "spring", stiffness: 280, damping: 30, mass: 0.8 };

  return (
    <>
      {/* ── Carousel ──────────────────────────────────────────────────── */}
      <div
        className="relative select-none"
        style={{ overflowX: "clip", overflowY: "visible" }}
      >
        {/* Inner sizing region — padding keeps shadows inside the clip boundary */}
        <div className="relative" style={{ aspectRatio: "1.6 / 1", minHeight: 280, maxHeight: 620 }}>
        {screenshots.map((src, i) => {
          const pos = getPosition(i);
          if (pos === null) return null;
          const isCenter = pos === 0;

          return (
            <motion.div
              key={i}
              className="absolute flex items-center justify-center"
              style={{ inset: 24, cursor: "pointer" }}
              animate={{
                x: isCenter ? "0%" : pos === -1 ? "-58%" : "58%",
                scale: isCenter ? 1 : 0.78,
                opacity: isCenter ? 1 : 0.4,
                zIndex: isCenter ? 10 : 5,
              }}
              transition={springConfig}
              onClick={() => {
                if (isCenter) {
                  setLightboxIndex(i);
                  setLightboxDirection(0);
                  setLightboxOpen(true);
                } else if (pos === -1) {
                  prev();
                } else {
                  next();
                }
              }}
            >
              <div
                className="flex h-full items-center justify-center"
                style={{ width: isCenter ? "82%" : "75%" }}
              >
                <OptimizedImage
                  src={src}
                  alt={`${projectTitle} screenshot ${i + 1}`}
                  priority
                  className={[
                    "[&_img]:!object-contain",
                    "[&_img]:rounded-xl sm:[&_img]:rounded-2xl",
                    isCenter
                      ? "[&_img]:shadow-[0_8px_40px_rgba(0,0,0,0.15),0_2px_12px_rgba(0,0,0,0.08)] [&_img]:ring-1 [&_img]:ring-black/[0.06] dark:[&_img]:ring-white/[0.08]"
                      : "[&_img]:shadow-[0_4px_20px_rgba(0,0,0,0.06)]",
                  ].join(" ")}
                  draggable={false}
                />
              </div>
            </motion.div>
          );
        })}

        {/* Arrow buttons */}
        {total > 1 && (
          <>
            <motion.button
              type="button"
              onClick={(e) => { e.stopPropagation(); prev(); }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              className="absolute left-2 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-[var(--bg-secondary)] text-[var(--text-secondary)] shadow-md ring-1 ring-[var(--card-border)] transition-colors hover:text-[var(--text-primary)] sm:left-4 sm:h-10 sm:w-10"
              aria-label="Previous screenshot"
            >
              <ChevronLeft size={18} />
            </motion.button>
            <motion.button
              type="button"
              onClick={(e) => { e.stopPropagation(); next(); }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              className="absolute right-2 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-[var(--bg-secondary)] text-[var(--text-secondary)] shadow-md ring-1 ring-[var(--card-border)] transition-colors hover:text-[var(--text-primary)] sm:right-4 sm:h-10 sm:w-10"
              aria-label="Next screenshot"
            >
              <ChevronRight size={18} />
            </motion.button>
          </>
        )}
        </div>
      </div>

      {/* Dot indicators */}
      {total > 1 && (
        <div className="mt-5 flex justify-center gap-1.5">
          {screenshots.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              className="h-1.5 rounded-full transition-all duration-300"
              style={{
                width: active === i ? 20 : 6,
                backgroundColor: active === i ? accentColor : "var(--text-tertiary)",
                opacity: active === i ? 1 : 0.3,
              }}
              aria-label={`Go to screenshot ${i + 1}`}
            />
          ))}
        </div>
      )}

      {/* ── Lightbox ──────────────────────────────────────────────────── */}
      <Dialog
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        maxWidth={false}
        sx={{
          "& .MuiDialog-paper": {
            bgcolor: "rgba(0,0,0,0.95)",
            m: 0,
            width: "100vw",
            height: "100vh",
            maxWidth: "100vw",
            maxHeight: "100vh",
            borderRadius: 0,
            overflow: "hidden",
          },
        }}
      >
        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: { xs: 1.5, sm: 2.5, md: 4 },
          }}
        >
          <IconButton
            onClick={() => setLightboxOpen(false)}
            className="glass-btn glass-btn--secondary text-white"
            sx={{ position: "absolute", top: { xs: 14, sm: 20, md: 24 }, right: { xs: 14, sm: 20, md: 24 }, zIndex: 10 }}
          >
            <X />
          </IconButton>
          <Box
            component={motion.div}
            layout={false}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleLBDragEnd}
            style={{ x: lightboxDragX }}
            sx={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "grab",
              "&:active": { cursor: "grabbing" },
            }}
          >
            <AnimatePresence initial={false} custom={lightboxDirection} mode="wait">
              <Box
                component={motion.div}
                layout={false}
                key={lightboxIndex}
                custom={lightboxDirection}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={slideSpringSecondary}
                sx={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <OptimizedImage
                  src={screenshots[lightboxIndex]}
                  alt={`${projectTitle} screenshot ${lightboxIndex + 1}`}
                  priority
                  className="[&_img]:!object-contain"
                  sx={{
                    maxWidth: "95%",
                    maxHeight: "95%",
                    width: "auto",
                    height: "auto",
                    borderRadius: "8px",
                    userSelect: "none",
                    pointerEvents: "none",
                  }}
                  draggable={false}
                />
              </Box>
            </AnimatePresence>
          </Box>
          {total > 1 && (
            <>
              <IconButton
                onClick={prevLB}
                component={motion.button}
                layout={false}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="glass-btn glass-btn--secondary text-white"
                sx={{ position: "absolute", left: { xs: 8, sm: 18, md: 24 }, top: "50%", transform: "translateY(-50%)", zIndex: 10 }}
              >
                <ChevronLeft />
              </IconButton>
              <IconButton
                onClick={nextLB}
                component={motion.button}
                layout={false}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="glass-btn glass-btn--secondary text-white"
                sx={{ position: "absolute", right: { xs: 8, sm: 18, md: 24 }, top: "50%", transform: "translateY(-50%)", zIndex: 10 }}
              >
                <ChevronRight />
              </IconButton>
              <GlassSurface
                as={Box}
                variant="clear"
                className="rounded-[20px] px-2 py-1 text-white"
                sx={{ position: "absolute", bottom: { xs: 14, sm: 20, md: 24 }, left: "50%", transform: "translateX(-50%)", zIndex: 10 }}
              >
                <Typography variant="body2">
                  {lightboxIndex + 1} / {total}
                </Typography>
              </GlassSurface>
            </>
          )}
        </Box>
      </Dialog>
    </>
  );
}

// Looping Carousel Component
function LightboxCarousel({ screenshots, projectTitle, accentColor = ACCENT_DEFAULT, inline = false }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragX = useMotionValue(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [lightboxDirection, setLightboxDirection] = useState(0);
  const lightboxDragX = useMotionValue(0);

  const next = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % screenshots.length);
  }, [screenshots.length]);

  const previous = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + screenshots.length) % screenshots.length);
  }, [screenshots.length]);

  const nextLightbox = useCallback(() => {
    setLightboxDirection(1);
    setLightboxIndex((prev) => (prev + 1) % screenshots.length);
  }, [screenshots.length]);

  const previousLightbox = useCallback(() => {
    setLightboxDirection(-1);
    setLightboxIndex((prev) => (prev - 1 + screenshots.length) % screenshots.length);
  }, [screenshots.length]);

  // Handle keyboard navigation
  useEffect(() => {
    if (!lightboxOpen) {
      const handleKeyDown = (e) => {
        if (e.key === "ArrowRight") {
          next();
        }
        if (e.key === "ArrowLeft") {
          previous();
        }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
    return undefined;
  }, [lightboxOpen, next, previous]);

  // Handle keyboard navigation for lightbox
  useLightboxArrowKeys({
    enabled: lightboxOpen,
    onLeft: previousLightbox,
    onRight: nextLightbox,
    onEscape: () => setLightboxOpen(false),
  });

  // Prevent body scroll when lightbox is open
  useBodyScrollLock(lightboxOpen);

  const handleLightboxDragEnd = (event, info) => {
    const threshold = 50;
    if (Math.abs(info.offset.x) > threshold) {
      if (info.offset.x > 0) {
        previousLightbox();
      } else {
        nextLightbox();
      }
    }
    lightboxDragX.set(0);
  };

  const openLightbox = (index) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const handleDragEnd = (event, info) => {
    const threshold = 50;
    if (Math.abs(info.offset.x) > threshold) {
      if (info.offset.x > 0) {
        previous();
      } else {
        next();
      }
    }
    setIsDragging(false);
    dragX.set(0);
  };

  return (
    <>
      {!inline && <div className="my-8 border-t border-[var(--border-color)]" />}
      <div className="reveal-item reveal-visible">
        <div className="relative z-10">
          {!inline && (
            <div className="mb-4 flex items-center gap-2 sm:mb-5">
              <div className="h-7 w-1 rounded-full" style={{ background: `linear-gradient(135deg, ${accentColor} 0%, ${accentColor}dd 100%)` }} />
              <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl md:text-3xl">Screenshots</h2>
            </div>
          )}

          {/* Carousel Container — liquid glass */}
          <GlassSurface
            variant="clear"
            className="relative mb-5 flex h-[250px] w-full items-center justify-center overflow-hidden rounded-2xl sm:h-[360px] md:h-[500px] lg:h-[560px] md:rounded-3xl"
          >
            {/* Main Image Container */}
            <Box
              component={motion.div}
              layout={false}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragStart={() => setIsDragging(true)}
              onDragEnd={handleDragEnd}
              style={{ x: dragX }}
              className={`relative flex h-full w-full items-center justify-center p-2 sm:p-3 md:p-4 ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
            >
              <AnimatePresence initial={false} custom={direction} mode="wait">
                <Box
                  component={motion.div}
                  layout={false}
                  key={currentIndex}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={slideSpringPrimary}
                  sx={{
                    position: "absolute",
                    width: { xs: "calc(100% - 24px)", sm: "calc(100% - 36px)", md: "calc(100% - 48px)" },
                    height: { xs: "calc(100% - 24px)", sm: "calc(100% - 36px)", md: "calc(100% - 48px)" },
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: { xs: "8px", sm: "12px", md: "16px" },
                  }}
                >
                  <OptimizedImage
                    src={screenshots[currentIndex]}
                    alt={`${projectTitle} screenshot ${currentIndex + 1}`}
                    onClick={() => openLightbox(currentIndex)}
                    priority={currentIndex === 0}
                    className="[&_img]:rounded-xl sm:[&_img]:rounded-2xl md:[&_img]:rounded-[20px] [&_img]:shadow-[0_8px_40px_rgba(0,0,0,0.15),0_2px_12px_rgba(0,0,0,0.08)] [&_img]:ring-1 [&_img]:ring-black/[0.06] dark:[&_img]:ring-white/[0.08]"
                    sx={{
                      maxWidth: "100%",
                      maxHeight: "100%",
                      width: "auto",
                      height: "auto",
                      objectFit: "contain",
                      borderRadius: { xs: "12px", sm: "16px", md: "20px" },
                      userSelect: "none",
                      pointerEvents: "auto",
                      cursor: "pointer",
                      transition: "transform 0.3s ease",
                      "&:hover": {
                        transform: "scale(1.02)",
                      },
                    }}
                    draggable={false}
                  />
                </Box>
              </AnimatePresence>
            </Box>

            {/* Subtle Navigation Controls — liquid glass */}
            <GlassSurface
              as={Box}
              variant="clear"
              component={motion.div}
              layout={false}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="absolute bottom-3 right-3 z-10 flex items-center gap-1.5 rounded-2xl px-2.5 py-1 sm:bottom-4 sm:right-6 sm:gap-2 sm:px-3 sm:py-1.5 md:gap-3 md:px-5 md:py-2"
            >
                <IconButton
                  onClick={previous}
                  component={motion.button}
                  layout={false}
                  whileHover={{ scale: 1.2, x: -3 }}
                  whileTap={{ scale: 0.95 }}
                  className="min-w-0 rounded-xl p-1.5 text-muted-foreground transition hover:text-foreground sm:p-2"
                >
                  <ChevronLeft className="text-lg sm:text-xl md:text-2xl" />
                </IconButton>

                <IconButton
                  onClick={next}
                  component={motion.button}
                  layout={false}
                  whileHover={{ scale: 1.2, x: 3 }}
                  whileTap={{ scale: 0.95 }}
                  className="min-w-0 rounded-xl p-1.5 text-muted-foreground transition hover:text-foreground sm:p-2"
                >
                  <ChevronRight className="text-lg sm:text-xl md:text-2xl" />
                </IconButton>
            </GlassSurface>

            {/* Dot Indicators */}
            {screenshots.length > 1 && (
              <div className="absolute bottom-3 left-3 z-10 flex items-center gap-1 sm:bottom-4 sm:left-1/2 sm:-translate-x-1/2">
                {screenshots.map((_, index) => (
                  <motion.div
                    key={index}
                    layout={false}
                    animate={{
                      width: currentIndex === index ? 24 : 8,
                      opacity: currentIndex === index ? 1 : 0.4,
                    }}
                    transition={{ duration: 0.3 }}
                    onClick={() => {
                      setDirection(index > currentIndex ? 1 : -1);
                      setCurrentIndex(index);
                    }}
                    className="h-2 cursor-pointer rounded transition-colors hover:opacity-80"
                    style={{
                      backgroundColor: currentIndex === index ? accentColor : "rgba(0,0,0,0.15)",
                    }}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        setDirection(index > currentIndex ? 1 : -1);
                        setCurrentIndex(index);
                      }
                    }}
                  />
                ))}
              </div>
            )}
          </GlassSurface>
        </div>
      </div>

      {/* Lightbox Modal */}
      <Dialog
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        maxWidth={false}
        sx={{
          "& .MuiDialog-paper": {
            bgcolor: "rgba(0,0,0,0.95)",
            m: 0,
            width: "100vw",
            height: "100vh",
            maxWidth: "100vw",
            maxHeight: "100vh",
            borderRadius: 0,
            overflow: "hidden",
          },
        }}
      >
        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: { xs: 1.5, sm: 2.5, md: 4 },
          }}
        >
          {/* Close Button */}
          <IconButton
            onClick={() => setLightboxOpen(false)}
            className="glass-btn glass-btn--secondary text-white"
            sx={{
              position: "absolute",
              top: { xs: 14, sm: 20, md: 24 },
              right: { xs: 14, sm: 20, md: 24 },
              zIndex: 10,
            }}
          >
            <X />
          </IconButton>

          {/* Image Container with Swipe */}
          <Box
            component={motion.div}
            layout={false}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleLightboxDragEnd}
            style={{ x: lightboxDragX }}
            sx={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "grab",
              "&:active": {
                cursor: "grabbing",
              },
            }}
          >
            <AnimatePresence initial={false} custom={lightboxDirection} mode="wait">
                <Box
                component={motion.div}
                layout={false}
                key={lightboxIndex}
                custom={lightboxDirection}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                  transition={slideSpringSecondary}
                sx={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <OptimizedImage
                  src={screenshots[lightboxIndex]}
                  alt={`${projectTitle} screenshot ${lightboxIndex + 1}`}
                  priority
                  sx={{
                    maxWidth: "95%",
                    maxHeight: "95%",
                    width: "auto",
                    height: "auto",
                    objectFit: "contain",
                    borderRadius: "8px",
                    userSelect: "none",
                    pointerEvents: "none",
                  }}
                  draggable={false}
                />
              </Box>
            </AnimatePresence>
          </Box>

          {/* Navigation Arrows */}
          {screenshots.length > 1 && (
            <>
              <IconButton
                onClick={previousLightbox}
                component={motion.button}
                layout={false}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="glass-btn glass-btn--secondary text-white"
                sx={{
                  position: "absolute",
                  left: { xs: 8, sm: 18, md: 24 },
                  top: "50%",
                  transform: "translateY(-50%)",
                  zIndex: 10,
                }}
              >
                <ChevronLeft />
              </IconButton>
              <IconButton
                onClick={nextLightbox}
                component={motion.button}
                layout={false}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="glass-btn glass-btn--secondary text-white"
                sx={{
                  position: "absolute",
                  right: { xs: 8, sm: 18, md: 24 },
                  top: "50%",
                  transform: "translateY(-50%)",
                  zIndex: 10,
                }}
              >
                <ChevronRight />
              </IconButton>

              {/* Counter */}
              <GlassSurface
                as={Box}
                variant="clear"
                className="rounded-[20px] px-2 py-1 text-white"
                sx={{
                  position: "absolute",
                  bottom: { xs: 14, sm: 20, md: 24 },
                  left: "50%",
                  transform: "translateX(-50%)",
                  zIndex: 10,
                }}
              >
                <Typography variant="body2">
                  {lightboxIndex + 1} / {screenshots.length}
                </Typography>
              </GlassSurface>
            </>
          )}
        </Box>
      </Dialog>
    </>
  );
}

function Workly3DCarousel({
  screenshots,
  projectTitle,
  accentColor = ACCENT_WORKLY,
  reduceMotion = false,
  inline = false,
}) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [lightboxDirection, setLightboxDirection] = useState(0);
  const lightboxDragX = useMotionValue(0);
  const wheelNavTimestampRef = useRef(0);

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
  }, []);

  const openLightbox = useCallback((index) => {
    setLightboxDirection(0);
    setLightboxIndex(index);
    setLightboxOpen(true);
  }, []);

  const nextLightbox = useCallback(() => {
    setLightboxDirection(1);
    setLightboxIndex((prev) => (prev + 1) % screenshots.length);
  }, [screenshots.length]);

  const previousLightbox = useCallback(() => {
    setLightboxDirection(-1);
    setLightboxIndex((prev) => (prev - 1 + screenshots.length) % screenshots.length);
  }, [screenshots.length]);

  useLightboxArrowKeys({
    enabled: lightboxOpen,
    onLeft: previousLightbox,
    onRight: nextLightbox,
    onEscape: closeLightbox,
  });

  useBodyScrollLock(lightboxOpen);

  const handleLightboxDragEnd = (event, info) => {
    const threshold = 50;
    if (Math.abs(info.offset.x) > threshold) {
      if (info.offset.x > 0) {
        previousLightbox();
      } else {
        nextLightbox();
      }
    }
    lightboxDragX.set(0);
  };

  const handleLightboxWheel = useCallback(
    (event) => {
      if (!lightboxOpen || screenshots.length <= 1) return;

      const now = performance.now();
      if (now - wheelNavTimestampRef.current < 180) return;

      const horizontal = Math.abs(event.deltaX) > Math.abs(event.deltaY);
      const delta = horizontal ? event.deltaX : event.deltaY;
      if (Math.abs(delta) < 14) return;

      wheelNavTimestampRef.current = now;
      if (delta > 0) {
        nextLightbox();
      } else {
        previousLightbox();
      }
    },
    [lightboxOpen, nextLightbox, previousLightbox, screenshots.length],
  );

  const slides = useMemo(
    () =>
      screenshots.map((src, index) => ({
        id: `${projectTitle}-${index}`,
        src,
        href: src,
        alt: `${projectTitle} screenshot ${index + 1}`,
      })),
    [projectTitle, screenshots],
  );

  return (
    <>
      {!inline && <div className="my-8 border-t border-[var(--border-color)]" />}
      <div className="reveal-item reveal-visible">
        <div className="relative z-10">
          {!inline && (
            <div className="mb-4 flex items-center gap-2 sm:mb-5">
              <div className="h-7 w-1 rounded-full" style={{ background: `linear-gradient(135deg, ${accentColor} 0%, ${accentColor}dd 100%)` }} />
              <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl md:text-3xl">Screenshots</h2>
            </div>
          )}

          <GlassSurface
            variant="clear"
            className="relative mx-auto mb-5 h-[210px] w-full max-w-[760px] overflow-hidden rounded-2xl sm:h-[300px] md:h-[340px] lg:h-[380px] md:rounded-3xl"
          >
            <ThreeDImageCarousel
              slides={slides}
              itemCount={5}
              autoplay={!reduceMotion}
              delay={2.8}
              pauseOnHover
              onSlideClick={openLightbox}
              className="h-full w-full"
            />
          </GlassSurface>
          <p className="text-xs text-muted-foreground/90 sm:text-sm">
            Click any image to open fullscreen. Use mouse wheel or arrow keys to browse.
          </p>
        </div>
      </div>

      <Dialog
        open={lightboxOpen}
        onClose={closeLightbox}
        maxWidth={false}
        sx={{
          "& .MuiDialog-paper": {
            bgcolor: "rgba(0,0,0,0.95)",
            m: 0,
            width: "100vw",
            height: "100vh",
            maxWidth: "100vw",
            maxHeight: "100vh",
            borderRadius: 0,
            overflow: "hidden",
          },
        }}
      >
        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: { xs: 1.5, sm: 2.5, md: 4 },
          }}
          onWheel={handleLightboxWheel}
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              closeLightbox();
            }
          }}
        >
          <GlassSurface
            as={Box}
            variant="clear"
            className="rounded-full px-1.5 py-0.5 text-[12px] text-white/90"
            sx={{
              position: "absolute",
              top: 16,
              left: 16,
              zIndex: 11,
            }}
          >
            Scroll / Swipe / Arrow keys
          </GlassSurface>

          <IconButton
            onClick={closeLightbox}
            aria-label="Close fullscreen gallery"
            className="glass-btn glass-btn--secondary text-white"
            sx={{
              position: "absolute",
              top: { xs: 14, sm: 20 },
              right: { xs: 14, sm: 20 },
              zIndex: 12,
            }}
          >
            <X />
          </IconButton>

          <Box
            component={motion.div}
            layout={false}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleLightboxDragEnd}
            style={{ x: lightboxDragX }}
            sx={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "grab",
              "&:active": { cursor: "grabbing" },
            }}
          >
            <AnimatePresence initial={false} custom={lightboxDirection} mode="wait">
              <Box
                component={motion.div}
                layout={false}
                key={lightboxIndex}
                custom={lightboxDirection}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={slideSpringSecondary}
                sx={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <OptimizedImage
                  src={screenshots[lightboxIndex]}
                  alt={`${projectTitle} screenshot ${lightboxIndex + 1}`}
                  priority
                  sx={{
                    maxWidth: "95%",
                    maxHeight: "95%",
                    width: "auto",
                    height: "auto",
                    objectFit: "contain",
                    borderRadius: "10px",
                    userSelect: "none",
                    pointerEvents: "none",
                  }}
                  draggable={false}
                />
              </Box>
            </AnimatePresence>
          </Box>

          {screenshots.length > 1 && (
            <>
              <IconButton
                onClick={previousLightbox}
                component={motion.button}
                layout={false}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                className="glass-btn glass-btn--secondary text-[var(--text-primary)] bg-[var(--bg-secondary)]"
                sx={{
                  position: "absolute",
                  left: { xs: 8, sm: 18, md: 26 },
                  top: "50%",
                  transform: "translateY(-50%)",
                  zIndex: 10,
                }}
              >
                <ChevronLeft />
              </IconButton>
              <IconButton
                onClick={nextLightbox}
                component={motion.button}
                layout={false}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                className="glass-btn glass-btn--secondary text-[var(--text-primary)] bg-[var(--bg-secondary)]"
                sx={{
                  position: "absolute",
                  right: { xs: 8, sm: 18, md: 26 },
                  top: "50%",
                  transform: "translateY(-50%)",
                  zIndex: 10,
                }}
              >
                <ChevronRight />
              </IconButton>

              <GlassSurface
                as={Box}
                variant="clear"
                className="rounded-[20px] px-2 py-1 text-white"
                sx={{
                  position: "absolute",
                  bottom: 20,
                  left: "50%",
                  transform: "translateX(-50%)",
                  zIndex: 10,
                }}
              >
                <Typography variant="body2">
                  {lightboxIndex + 1} / {screenshots.length}
                </Typography>
              </GlassSurface>
            </>
          )}
        </Box>
      </Dialog>
    </>
  );
}

function ActionLinkButton({ href, onClick, label, iconRef, IconComponent, reducedMotion }) {
  const Tag = href ? "a" : "button";
  const linkProps = href
    ? { href, target: "_blank", rel: "noopener noreferrer" }
    : { type: "button", onClick };

  return (
    <Tag
      {...linkProps}
      className="glass-btn glass-btn--ghost group/btn inline-flex items-center gap-1.5 px-3.5 py-2 text-[11px] font-bold tracking-[0.14em] uppercase shadow-none sm:gap-2 sm:px-5 sm:py-2.5 sm:text-[13px] sm:tracking-[0.18em] md:text-[14px]"
      style={{ color: "var(--text-primary)", textDecoration: "none", borderRadius: "var(--glass-radius-control)" }}
      onMouseEnter={() => !reducedMotion && iconRef.current?.startAnimation?.()}
      onMouseLeave={() => !reducedMotion && iconRef.current?.stopAnimation?.()}
    >
      <IconComponent ref={iconRef} size={14} />
      <span>{label}</span>
    </Tag>
  );
}

function ActionButtons({ project, onManualOpen }) {
  const reducedMotion = useReducedMotion();
  const githubRef = useRef(null);
  const youtubeRef = useRef(null);
  const fileTextRef = useRef(null);
  const externalLinkRef = useRef(null);

  if (!project.youtube && !project.github && !project.userManual && !project.liveUrl) {
    return null;
  }

  return (
    <>
      <div className="mx-auto max-w-5xl px-6 sm:px-8 md:px-10">
        <hr className="border-[var(--card-border)]" />
      </div>
      <RevealSection
        className="mx-auto max-w-4xl px-6 pb-4 pt-16 text-center sm:px-8 sm:pb-6 sm:pt-20 md:pb-8 md:pt-24"
      >
        <div className="flex flex-wrap items-start justify-center gap-3 sm:gap-6 md:gap-8">
          {project.github && (
            <ActionLinkButton
              href={project.github}
              label="View on Github"
              iconRef={githubRef}
              IconComponent={GithubIcon}
              reducedMotion={reducedMotion}
            />
          )}
          {project.youtube && (
            <ActionLinkButton
              href={project.youtube}
              label="Watch on Youtube"
              iconRef={youtubeRef}
              IconComponent={YoutubeIcon}
              reducedMotion={reducedMotion}
            />
          )}
          {project.liveUrl && (
            <ActionLinkButton
              href={project.liveUrl}
              label="View Live Site"
              iconRef={externalLinkRef}
              IconComponent={ExternalLinkIcon}
              reducedMotion={reducedMotion}
            />
          )}
          {project.userManual && (
            <ActionLinkButton
              onClick={onManualOpen}
              label="User Manual"
              iconRef={fileTextRef}
              IconComponent={FileTextIcon}
              reducedMotion={reducedMotion}
            />
          )}
        </div>
      </RevealSection>
    </>
  );
}

export default function ProjectDetail() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  useTheme();
  const projectId = Number(id);
  const project = useMemo(
    () =>
      Number.isFinite(projectId)
        ? projectsData.find((p) => p.id === projectId)
        : undefined,
    [projectId],
  );
  const navigationTimeoutRef = useRef();

  // Force scroll to top on mount - this is a completely separate page
  useLayoutEffect(() => {
    const mainContent = document.querySelector("main");
    const previousDisplay = mainContent?.style.display ?? "";
    const previousVisibility = mainContent?.style.visibility ?? "";
    if (mainContent) {
      mainContent.scrollTop = 0;
      mainContent.scrollTo(0, 0);
      // Hide main content when viewing project detail
      mainContent.style.display = "none";
      mainContent.style.visibility = "hidden";
    }

    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    const rafId = requestAnimationFrame(() => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    });

    return () => {
      cancelAnimationFrame(rafId);
      if (mainContent) {
        mainContent.style.display = previousDisplay;
        mainContent.style.visibility = previousVisibility;
      }
    };
  }, []);

  useEffect(() => {
    const ref = navigationTimeoutRef;
    return () => {
      if (ref.current) {
        clearTimeout(ref.current);
      }
    };
  }, []);

  const [manualOpen, setManualOpen] = useState(false);
  const reducedMotion = useReducedMotion();
  const headerGithubRef = useRef(null);
  const headerYoutubeRef = useRef(null);
  const headerLiveSiteRef = useRef(null);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const backToTopSentinelRef = useRef(null);

  // IntersectionObserver on a sentinel at ~40vh — fires only on threshold cross,
  // replacing a per-frame scroll listener that called setState on every tick.
  useEffect(() => {
    const sentinel = backToTopSentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => setShowBackToTop(!entry.isIntersecting),
      { threshold: 0 },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const accentColor = project?.accentColor || ACCENT_DEFAULT;
  // accentGradient available if needed: useMemo(() => getAccentGradient(accentColor), [accentColor])
  const handleBackToProjects = useCallback(() => {
    if (navigationTimeoutRef.current) {
      clearTimeout(navigationTimeoutRef.current);
    }

    const state = location.state || {};

    // Set session flag so Home/ScrollToTop know to scroll to projects (survives if state is lost).
    try {
      sessionStorage.setItem(SCROLL_TO_PROJECTS_FLAG, "1");
    } catch {
      // Ignore
    }

    // Navigate immediately — AnimatePresence in App.jsx handles the exit transition
    navigate("/", {
      state: {
        scrollToProjects: true,
        restore: true,
        from: "projects",
        projectId: id ? Number(id) : null,
        scrollY: state.scrollY ?? null,
      },
    });
  }, [id, location.state, navigate]);

  if (!project) {
    return (
      <div className="flex min-h-[100svh] items-center justify-center">
        <p className="text-xl font-semibold text-foreground">Project not found</p>
      </div>
    );
  }

  return (
    <div
      data-project-detail
      className="relative min-h-[100svh] w-full bg-[var(--bg-secondary)]"
      style={{ overflowX: "clip" }}
    >
      {/* Sentinel for back-to-top IntersectionObserver — when this scrolls
          out of view (~40vh from top), the back-to-top button appears. */}
      <div ref={backToTopSentinelRef} className="pointer-events-none absolute left-0 top-[40vh] h-px w-px" aria-hidden />
      {/* ── Back navigation ─────────────────────────────────────────── */}
      <div className="mx-auto max-w-5xl px-6 pt-6 sm:px-8 sm:pt-8 md:px-10 md:pt-12">
        <button
          type="button"
          onClick={handleBackToProjects}
          className="group/back inline-flex items-center gap-1.5 text-[11px] font-medium tracking-[0.15em] uppercase text-[var(--text-tertiary)] transition-colors duration-200 hover:text-[var(--text-primary)]"
        >
          <ArrowLeft size={10} className="transition-transform duration-300 group-hover/back:-translate-x-1" />
          <span className="relative">
            Back to Projects
            <span className="absolute -bottom-px left-0 h-px w-0 bg-[var(--text-primary)]/30 transition-all duration-300 group-hover/back:w-full" />
          </span>
        </button>
      </div>

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <RevealSection
        className="mx-auto max-w-5xl px-6 pt-10 pb-14 sm:px-8 sm:pt-14 sm:pb-20 md:px-10 md:pt-20 md:pb-24"
      >
        <p
          className="mb-3 text-[11px] font-semibold uppercase tracking-[0.3em] sm:mb-4 sm:text-xs"
          style={{ color: accentColor }}
        >
          {project.role}
        </p>
        <h1 className="mb-5 text-[2.5rem] font-bold leading-[1.05] tracking-tight text-[var(--text-primary)] sm:mb-6 sm:text-[3.25rem] md:text-[3.75rem] lg:text-[4.25rem]">
          {project.title}
        </h1>
        <p className="max-w-2xl text-[16px] leading-[1.6] text-[var(--text-secondary)] sm:text-[17px] md:text-lg">
          {project.description}
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-2.5 sm:mt-8">
          <span
            className="inline-flex items-center gap-1.5 rounded-[3px] px-3.5 py-1.5 text-[11px] font-semibold sm:text-xs"
            style={{
              background: project.status === "Live" ? "rgba(52,211,153,0.12)" : `${accentColor}12`,
              color: project.status === "Live" ? "#16a34a" : accentColor,
              border: `1px solid ${project.status === "Live" ? "rgba(52,211,153,0.35)" : `${accentColor}35`}`,
            }}
          >
            {project.status === "Live" && (
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden />
            )}
            {project.status}
          </span>
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-[3px] border px-3 py-1 text-[11px] font-semibold tracking-[0.12em] transition-transform duration-200 hover:-translate-y-0.5 sm:text-[12px]"
              style={{
                color: accentColor,
                borderColor: `${accentColor}55`,
                backgroundColor: `${accentColor}12`,
                textDecoration: "none",
              }}
              onMouseEnter={() => !reducedMotion && headerGithubRef.current?.startAnimation?.()}
              onMouseLeave={() => !reducedMotion && headerGithubRef.current?.stopAnimation?.()}
            >
              <GithubIcon ref={headerGithubRef} size={12} />
              Github
            </a>
          )}
          {project.youtube && (
            <a
              href={project.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-[3px] border px-3 py-1 text-[11px] font-semibold tracking-[0.12em] transition-transform duration-200 hover:-translate-y-0.5 sm:text-[12px]"
              style={{
                color: accentColor,
                borderColor: `${accentColor}55`,
                backgroundColor: `${accentColor}12`,
                textDecoration: "none",
              }}
              onMouseEnter={() => !reducedMotion && headerYoutubeRef.current?.startAnimation?.()}
              onMouseLeave={() => !reducedMotion && headerYoutubeRef.current?.stopAnimation?.()}
            >
              <YoutubeIcon ref={headerYoutubeRef} size={12} />
              Youtube
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-[3px] border px-3 py-1 text-[11px] font-semibold tracking-[0.12em] transition-transform duration-200 hover:-translate-y-0.5 sm:text-[12px]"
              style={{
                color: accentColor,
                borderColor: `${accentColor}55`,
                backgroundColor: `${accentColor}12`,
                textDecoration: "none",
              }}
              onMouseEnter={() => !reducedMotion && headerLiveSiteRef.current?.startAnimation?.()}
              onMouseLeave={() => !reducedMotion && headerLiveSiteRef.current?.stopAnimation?.()}
            >
              <ExternalLinkIcon ref={headerLiveSiteRef} size={12} />
              Live Site
            </a>
          )}
        </div>
      </RevealSection>

      {/* ── About ─────────────────────────────────────────────────────── */}
      {(project.extendedDescription || (project.screenshots && project.screenshots.length > 0)) && (
        <>
          <div className="mx-auto max-w-5xl px-6 sm:px-8 md:px-10">
            <hr className="border-[var(--card-border)]" />
          </div>
          <RevealSection
            className="mx-auto max-w-5xl px-6 py-16 sm:px-8 sm:py-20 md:py-24"
          >
            {/* Text content — narrow column */}
            <div className="mx-auto max-w-3xl">
              <p className="mb-2 text-center text-[11px] font-medium uppercase tracking-[0.32em] text-[var(--text-tertiary)]">
                Overview
              </p>
              <h2 className="mb-6 text-center text-2xl font-bold tracking-tight text-[var(--text-primary)] sm:mb-8 sm:text-3xl md:text-[2.25rem]">
                About This Project
              </h2>
              {project.extendedDescription && (
                <p className="text-center text-[15px] leading-[1.7] text-[var(--text-secondary)] sm:text-base md:text-[17px]">
                  {project.extendedDescription}
                </p>
              )}
            </div>

            {/* Screenshots carousel — full section width */}
            {project.screenshots && project.screenshots.length > 0 && (
              <div className="mt-12 sm:mt-16">
                <ShowcaseCarousel
                  screenshots={project.screenshots}
                  projectTitle={project.title}
                  accentColor={project.accentColor || ACCENT_DEFAULT}
                />
              </div>
            )}
          </RevealSection>
        </>
      )}

      {/* ── Technologies ──────────────────────────────────────────────── */}
      {project.tools && project.tools.length > 0 && (
        <>
          <div className="mx-auto max-w-5xl px-6 sm:px-8 md:px-10">
            <hr className="border-[var(--card-border)]" />
          </div>
          <RevealSection
            className="mx-auto max-w-4xl px-6 py-16 sm:px-8 sm:py-20 md:py-24"
          >
            <p className="mb-2 text-center text-[11px] font-medium uppercase tracking-[0.32em] text-[var(--text-tertiary)]">
              Built With
            </p>
            <h2 className="mb-8 text-center text-2xl font-bold tracking-tight text-[var(--text-primary)] sm:mb-10 sm:text-3xl md:text-[2.25rem]">
              Technologies
            </h2>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-2.5">
              {project.tools.map((tool) => (
                <span
                  key={tool}
                  className="rounded-[3px] border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] transition-transform duration-200 hover:-translate-y-0.5 sm:text-[12px]"
                  style={{
                    color: accentColor,
                    borderColor: `${accentColor}55`,
                    backgroundColor: `${accentColor}12`,
                  }}
                >
                  {tool}
                </span>
              ))}
            </div>
          </RevealSection>
        </>
      )}

      {/* ── Key Features ──────────────────────────────────────────────── */}
      {project.keyFeatures && project.keyFeatures.length > 0 && (
        <>
          <div className="mx-auto max-w-5xl px-6 sm:px-8 md:px-10">
            <hr className="border-[var(--card-border)]" />
          </div>
          <RevealSection
            className="mx-auto max-w-4xl px-6 py-16 sm:px-8 sm:py-20 md:py-24"
          >
            <p className="mb-2 text-center text-[11px] font-medium uppercase tracking-[0.32em] text-[var(--text-tertiary)]">
              Highlights
            </p>
            <h2 className="mb-8 text-center text-2xl font-bold tracking-tight text-[var(--text-primary)] sm:mb-10 sm:text-3xl md:text-[2.25rem]">
              Key Features
            </h2>
            <div className="mx-auto grid max-w-3xl gap-4 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-5">
              {project.keyFeatures.map((feature) => (
                <div key={feature} className="flex items-start gap-3">
                  <span
                    className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ backgroundColor: accentColor }}
                  />
                  <span className="text-[14px] leading-relaxed text-[var(--text-secondary)] sm:text-[15px]">
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </RevealSection>
        </>
      )}

      {/* ── Timeline ──────────────────────────────────────────────────── */}
      {project.timeline && project.timeline.length > 0 && (
        <>
          <div className="mx-auto max-w-5xl px-6 sm:px-8 md:px-10">
            <hr className="border-[var(--card-border)]" />
          </div>
          <RevealSection
            className="mx-auto max-w-3xl px-6 py-16 sm:px-8 sm:py-20 md:py-24"
          >
            <p className="mb-2 text-center text-[11px] font-medium uppercase tracking-[0.32em] text-[var(--text-tertiary)]">
              Process
            </p>
            <h2 className="mb-8 text-center text-2xl font-bold tracking-tight text-[var(--text-primary)] sm:mb-10 sm:text-3xl md:text-[2.25rem]">
              Development Timeline
            </h2>
            <ScrollTimeline
              items={project.timeline}
              accentColor={accentColor}
            />
          </RevealSection>
        </>
      )}

      {/* ── Action buttons ────────────────────────────────────────────── */}
      <ActionButtons project={project} onManualOpen={() => setManualOpen(true)} />

      {/* ── Footer ────────────────────────────────────────────────── */}
      <Suspense fallback={<div className="h-40" />}>
        <Footer />
      </Suspense>

      {/* ── PDF Manual Modal ──────────────────────────────────────── */}
      <PdfModal
        open={manualOpen}
        onClose={() => setManualOpen(false)}
        src={project.userManual}
        title="User Manual"
      />

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
