import { lazy, memo, Suspense, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useMotionTemplate, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ChevronLeft, ChevronRight, X } from "lucide-react";
import { projectsData } from "../data/projectsData";
import { ACCENT_DEFAULT, SCROLL_TO_PROJECTS_FLAG } from "@/constants";
import { smoothScrollToTop } from "@/lib/navigation";
import GlassSurface from "@/components/surfaces/GlassSurface";
import OptimizedImage from "./OptimizedImage";
import { useTheme } from "@/components/theme-provider";
import { Box, Dialog, IconButton } from "@/components/ui/sx-primitives";
import { slideSpringSecondary } from "@/shared/animation/presets";
import { GithubIcon } from "@/components/ui/github";
import { YoutubeIcon } from "@/components/ui/youtube";
import { ExternalLinkIcon } from "@/components/ui/external-link";
import { ChevronUpIcon } from "@/components/ui/chevron-up";
import ScrollCue from "@/components/ui/ScrollCue";
import { easeIO, useScrollyInView } from "@/hooks/useScrollyProgress";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import useReducedMotion from "@/hooks/useReducedMotion";

const PdfModal = lazy(() => import("@/components/ui/PdfModal"));
const Footer = lazy(() => import("./Footer"));

// MOBILE-SWARM: scrollytelling — reduced-motion source progress.
// Every scroll-linked reveal in this file derives from a 0→1 progress value
// fed into useTransform(...). Under prefers-reduced-motion we swap that source
// for a constant motion value pinned at 1, so every derived reveal resolves to
// its END (fully-revealed) state with no scrubbing — a coherent static path
// that mirrors how Skills' SkillsStatic snaps everything to its final layout.
// The useScroll hooks still run unconditionally (rules of hooks); we only
// choose which value to consume. Non-reduced (desktop default) is byte-
// identical to before. `clamp:true` (Framer default) means input 1 yields the
// end of each range regardless of where the range sits.
function useRevealProgress(liveProgress, staticValue = 1) {
  const reduce = useReducedMotion();
  const staticMv = useMotionValue(staticValue);
  return reduce ? staticMv : liveProgress;
}

// Sticky scroll progress as a MotionValue: 0 when the tall outer container
// begins pinning its sticky child, 1 when it finishes scrolling past. This is
// the motion-value equivalent of the old useStickyProgress() — same 0→1 range
// (-rect.top / (height - vh)), but Framer writes derived transform/opacity
// straight to the DOM, so scrolling never re-renders the consuming section.
function useStickyMotion(ref) {
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  return scrollYProgress;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

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

function getNextProject(id) {
  const idx = projectsData.findIndex((p) => p.id === id);
  return projectsData[(idx + 1) % projectsData.length];
}

// ─── Body scroll lock ────────────────────────────────────────────────────────

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
      if (e.key === "ArrowRight") onRight();
      if (e.key === "ArrowLeft") onLeft();
      if (e.key === "Escape" && onEscape) onEscape();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [enabled, onLeft, onRight, onEscape]);
}

// ─── Lightbox ────────────────────────────────────────────────────────────────

const slideVariants = {
  enter: (direction) => ({ x: direction > 0 ? "100%" : "-100%", opacity: 0, scale: 0.96 }),
  center: { zIndex: 1, x: 0, opacity: 1, scale: 1 },
  exit: (direction) => ({ zIndex: 0, x: direction < 0 ? "100%" : "-100%", opacity: 0, scale: 0.96 }),
};

function Lightbox({ screenshots, projectTitle, open, onClose, initialIndex = 0 }) {
  const [index, setIndex] = useState(initialIndex);
  const [direction, setDirection] = useState(0);
  const dragX = useMotionValue(0);
  const total = screenshots.length;

  useEffect(() => {
    if (open) setIndex(initialIndex);
  }, [open, initialIndex]);

  const next = useCallback(() => { setDirection(1); setIndex((p) => (p + 1) % total); }, [total]);
  const prev = useCallback(() => { setDirection(-1); setIndex((p) => (p - 1 + total) % total); }, [total]);

  useLightboxArrowKeys({ enabled: open, onLeft: prev, onRight: next, onEscape: onClose });
  useBodyScrollLock(open);

  const handleDragEnd = useCallback(
    (_, info) => {
      if (Math.abs(info.offset.x) > 50) {
        info.offset.x > 0 ? prev() : next();
      }
      dragX.set(0);
    },
    [prev, next, dragX],
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      sx={{
        "& .MuiDialog-paper": {
          bgcolor: "rgba(0,0,0,0.95)", m: 0,
          width: "100dvw", height: "100dvh",
          maxWidth: "100dvw", maxHeight: "100dvh",
          borderRadius: 0, overflow: "hidden",
        },
      }}
    >
      <Box sx={{ position: "relative", width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", p: { xs: 1.5, sm: 2.5, md: 4 } }}>
        {/* MOBILE-SWARM: touch — lucide default icon is 24px and .glass-btn adds no
            padding, leaving these lightbox controls ~26px (< 44 min touch target).
            Absolutely positioned, so a 44×44 min size only grows the hit area —
            no layout shift, desktop visuals unchanged. */}
        <IconButton onClick={onClose} className="glass-btn glass-btn--secondary text-white" sx={{ position: "absolute", top: { xs: 14, sm: 20, md: 24 }, right: { xs: 14, sm: 20, md: 24 }, zIndex: 10, minWidth: 44, minHeight: 44, p: 1 }}>
          <X />
        </IconButton>

        <Box component={motion.div} layout={false} drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={0.2} onDragEnd={handleDragEnd} style={{ x: dragX }} sx={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "grab", "&:active": { cursor: "grabbing" } }}>
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <Box component={motion.div} layout={false} key={index} custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={slideSpringSecondary} sx={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <OptimizedImage src={screenshots[index]} alt={`${projectTitle} screenshot ${index + 1}`} priority className="[&_img]:!object-contain" sx={{ maxWidth: "95%", maxHeight: "95%", width: "auto", height: "auto", borderRadius: "8px", userSelect: "none", pointerEvents: "none" }} draggable={false} />
            </Box>
          </AnimatePresence>
        </Box>

        {total > 1 && (
          <>
            {/* MOBILE-SWARM: touch — 44×44 min hit area (see close-button note above). */}
            <IconButton onClick={prev} component={motion.button} layout={false} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="glass-btn glass-btn--secondary text-white" sx={{ position: "absolute", left: { xs: 8, sm: 18, md: 24 }, top: "50%", transform: "translateY(-50%)", zIndex: 10, minWidth: 44, minHeight: 44, p: 1 }}>
              <ChevronLeft />
            </IconButton>
            <IconButton onClick={next} component={motion.button} layout={false} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="glass-btn glass-btn--secondary text-white" sx={{ position: "absolute", right: { xs: 8, sm: 18, md: 24 }, top: "50%", transform: "translateY(-50%)", zIndex: 10, minWidth: 44, minHeight: 44, p: 1 }}>
              <ChevronRight />
            </IconButton>
            <GlassSurface as={Box} variant="clear" className="rounded-[20px] px-2 py-1 text-white" sx={{ position: "absolute", bottom: { xs: 14, sm: 20, md: 24 }, left: "50%", transform: "translateX(-50%)", zIndex: 10 }}>
              <span className="text-sm">{index + 1} / {total}</span>
            </GlassSurface>
          </>
        )}
      </Box>
    </Dialog>
  );
}

// ─── Scroll Image Reveal — each image reveals via clipPath + scale on scroll ─

function ScrollRevealImage({ src, alt, index, onClickImage }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });
  // MOBILE-SWARM: scrollytelling — reduced-motion users get the fully-open
  // image (clip 0%, scale 1) instead of a scroll-scrubbed clip/scale reveal.
  const p = useRevealProgress(scrollYProgress);

  // Fully closed at 0, fully open by 1 (when center hits mid-screen)
  const clip = useTransform(p, [0, 1], [50, 0]);
  const scale = useTransform(p, [0, 1], [1.2, 1]);
  const borderRadius = useTransform(p, [0, 1], [20, 12]);

  const clipPath = useMotionTemplate`inset(${clip}% round ${borderRadius}px)`;

  return (
    <motion.div
      ref={ref}
      className="cursor-pointer"
      style={{ clipPath }}
      onClick={() => onClickImage(index)}
    >
      <motion.div style={{ scale }}>
        <OptimizedImage
          src={src}
          alt={alt}
          priority={index === 0}
          className="[&_img]:w-full [&_img]:object-cover"
          draggable={false}
        />
      </motion.div>
    </motion.div>
  );
}

function ScreenshotShowcase({ project }) {
  const { screenshots, title } = project;
  const images = screenshots && screenshots.length > 0 ? screenshots : [];
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  if (images.length === 0) return null;

  const openLightbox = (i) => { setLightboxIndex(i); setLightboxOpen(true); };

  return (
    <section className="px-6 py-16 sm:px-8 sm:py-20 md:py-24">
      <div className="mx-auto max-w-[900px]">
        <div className="flex flex-col gap-8 sm:gap-12">
          {images.map((src, i) => (
            <ScrollRevealImage
              key={src}
              src={src}
              alt={`${title} screenshot ${i + 1}`}
              index={i}
              onClickImage={openLightbox}
            />
          ))}
        </div>
      </div>
      <Lightbox screenshots={images} projectTitle={title} open={lightboxOpen} onClose={() => setLightboxOpen(false)} initialIndex={lightboxIndex} />
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SCROLLYTELLING SECTIONS
// ═══════════════════════════════════════════════════════════════════════════════

// ─── Progress Bar ────────────────────────────────────────────────────────────

function ProgressBarFill({ accent }) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 50, restDelta: 0.001 });
  return (
    <motion.div style={{ scaleX, height: "100%", background: accent, transformOrigin: "left" }} />
  );
}

// ─── Hero Section (sticky scroll-driven reveal) ──────────────────────────────

function HeroSection({ project, accent }) {
  const containerRef = useRef(null);
  const isMobile = useMediaQuery("(max-width: 767px)");
  const stickyP = useStickyMotion(containerRef);
  // MOBILE-SWARM: scrollytelling — reduced-motion users get the fully-revealed
  // end state (source pinned at 1); everyone else scrubs exactly as before.
  const p = useRevealProgress(stickyP);

  // Scroll-driven values as motion values (same breakpoints + easeIO curve as
  // the old elerp() calls). Framer writes these straight to the DOM, so the
  // section never re-renders while scrolling.
  const titleScale = useTransform(p, [0.08, 0.42], [1, 0.72], { ease: easeIO });
  const titleYn = useTransform(p, [0.08, 0.42], [6, -6], { ease: easeIO });
  const titleY = useMotionTemplate`${titleYn}vh`;
  const roleOp = useTransform(p, [0.18, 0.38], [0, 1], { ease: easeIO });
  const roleY = useTransform(p, [0.18, 0.38], [14, 0], { ease: easeIO });
  const lineScaleX = useTransform(p, [0.12, 0.38], [0, 1], { ease: easeIO });
  const descOp = useTransform(p, [0.38, 0.56], [0, 1], { ease: easeIO });
  const descY = useTransform(p, [0.38, 0.56], [20, 0], { ease: easeIO });
  const tagsOp = useTransform(p, [0.52, 0.66], [0, 1], { ease: easeIO });
  const linksOp = useTransform(p, [0.62, 0.76], [0, 1], { ease: easeIO });
  const glowOpRaw = useTransform(p, [0, 0.5], [0.1, 0.35], { ease: easeIO });
  const glowOp = useMotionTemplate`calc(${glowOpRaw} * var(--st-glow-mult))`;
  const scrollInd = useTransform(p, [0, 0.1], [0.5, 0], { ease: easeIO });
  const wmOp = useTransform(p, [0, 0.4], [0.18, 0.06], { ease: easeIO });
  const wmScale = useTransform(p, [0, 0.5], [1, 0.9], { ease: easeIO });

  const isLive = project.status === "Live";

  return (
    <div ref={containerRef} style={{ height: isMobile ? "170vh" : "220vh", position: "relative" }}>
      {/* MOBILE-SWARM: scrollytelling — pinned scene uses svh (smallest viewport)
          so it never clips when the mobile address bar is visible; outer scrub
          container stays in vh so useStickyMotion progress 0→1 is unchanged. */}
      <div className="sticky top-0 isolate flex h-screen-svh flex-col items-center justify-center overflow-hidden">
        {/* Accent glow — hidden on mobile for GPU performance */}
        {!isMobile && (
          <motion.div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 h-[30vh] w-[46vw] -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ background: accent, opacity: glowOp, filter: "blur(90px)" }} />
        )}

        {/* Ghost watermark — large outlined title behind content */}
        <motion.div aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center select-none" style={{ opacity: wmOp, scale: wmScale }}>
          <span className="whitespace-nowrap text-center font-bold uppercase" style={{
            fontSize: "clamp(80px, 18vw, 240px)",
            letterSpacing: "-0.03em",
            color: "transparent",
            WebkitTextStroke: `2.5px ${accent}`,
            lineHeight: 0.9,
          }}>{project.title.split(" ")[0]}</span>
        </motion.div>

        {/* Soft accent glow behind content — a blurred SOLID (not a gradient) so
            the blur produces a clean Gaussian falloff. */}
        <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 h-[26vh] w-[40vw] -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ background: accent, opacity: 0.14, filter: "blur(90px)" }} />

        {/* Dither overlay — removes 8-bit banding rings from the glows above */}
        <div aria-hidden className="glow-dither pointer-events-none absolute inset-0" />

        {/* Content */}
        <motion.div className="relative z-[2] mx-auto max-w-[860px] px-7 text-center" style={{ y: titleY }}>
          {/* Role overline */}
          <motion.p className="mb-[18px] text-[11px] font-semibold uppercase tracking-[0.3em]" style={{ color: accent, opacity: roleOp, y: roleY }}>
            {project.role}
          </motion.p>

          {/* Title */}
          <motion.h1 className="font-bold leading-[1.06] tracking-tight text-[var(--text-primary)]" style={{ fontSize: "clamp(34px, 8.5vw, 76px)", scale: titleScale, transformOrigin: "center center" }}>
            {project.title}
          </motion.h1>

          {/* Accent line — scaleX (compositor-only) instead of animating width */}
          <motion.div aria-hidden className="mx-auto my-[22px] h-[2px] w-full" style={{ scaleX: lineScaleX, background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }} />

          {/* Description */}
          <motion.p className="mx-auto max-w-[520px] text-[17px] leading-[1.65] text-[var(--text-secondary)]" style={{ opacity: descOp, y: descY, textWrap: "pretty" }}>
            {project.description}
          </motion.p>

          {/* Tags */}
          <motion.div className="mt-5 flex flex-wrap justify-center gap-2" style={{ opacity: tagsOp }}>
            {project.tags.map((t) => (
              <span key={t} className="whitespace-nowrap rounded-[4px] border px-3 py-[5px] text-[10px] font-semibold uppercase tracking-[0.08em]" style={{ color: "var(--st-tag-text)", background: "var(--st-tag-bg)", borderColor: "var(--st-tag-border)" }}>
                {t}
              </span>
            ))}
          </motion.div>

          {/* Status + Links */}
          <motion.div className="mt-6 flex flex-wrap justify-center gap-2.5" style={{ opacity: linksOp }}>
            <span className="inline-flex items-center gap-1.5 rounded-[4px] border px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.1em]" style={{ background: isLive ? "rgba(52,211,153,0.12)" : getAccentRgba(accent, 0.12), color: isLive ? "#34d399" : accent, borderColor: isLive ? "rgba(52,211,153,0.28)" : getAccentRgba(accent, 0.28) }}>
              {isLive && <span className="inline-block h-[5px] w-[5px] rounded-full bg-emerald-400" />}
              {project.status}
            </span>
            {project.github && (
              <a href={project.github} target="_blank" rel="noopener noreferrer" className="rounded-[4px] border px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] no-underline transition-all duration-200" style={{ color: accent, borderColor: `${accent}44`, background: `${accent}14` }}>
                GitHub
              </a>
            )}
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="rounded-[4px] border px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] no-underline transition-all duration-200" style={{ color: accent, borderColor: `${accent}44`, background: `${accent}14` }}>
                Live Site
              </a>
            )}
            {project.youtube && (
              <a href={project.youtube} target="_blank" rel="noopener noreferrer" className="rounded-[4px] border px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] no-underline transition-all duration-200" style={{ color: accent, borderColor: `${accent}44`, background: `${accent}14` }}>
                YouTube
              </a>
            )}
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div className="absolute bottom-8 flex flex-col items-center" style={{ opacity: scrollInd, color: "var(--st-scroll-ind)" }}>
          <ScrollCue />
        </motion.div>
      </div>
    </div>
  );
}

// ─── Statement Section ───────────────────────────────────────────────────────

// ─── Statement + Spotlights — Combined section ──────────────────────────────
// Statement on the left, three spotlight columns on the right (desktop).
// Stacks vertically on mobile.

// One spotlight column — own component so its scroll-driven transforms are
// valid hooks (one per item) rather than hooks called inside a .map callback.
function SpotlightItem({ spotlight, index, progress, accent, isMobile }) {
  const start = 0.22 + index * 0.12;
  const op = useTransform(progress, [start, start + 0.1], [0, 1], { ease: easeIO });
  const y = useTransform(progress, [start, start + 0.1], [24, 0], { ease: easeIO });
  return (
    <motion.div style={{ opacity: op, y }}>
      <h3 className="mb-2 font-bold tracking-tight text-[var(--text-primary)]" style={{
        fontSize: isMobile ? 20 : 22,
        lineHeight: 1.2,
      }}>{spotlight.title}</h3>
      <div aria-hidden className="mb-3 h-[2px] rounded-full" style={{ width: 36, background: accent, opacity: 0.3 }} />
      <p className="text-[14px] leading-[1.65] text-[var(--text-secondary)]" style={{ textWrap: "pretty" }}>
        {spotlight.text}
      </p>
    </motion.div>
  );
}

function StatementSpotlightsSection({ project, accent }) {
  const fallbackRef = useRef(null);
  const fallbackInView = useScrollyInView(fallbackRef);
  const isMobile = useMediaQuery("(max-width: 767px)");
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 0.85", "end 0.5"],
  });
  // MOBILE-SWARM: scrollytelling — reduced-motion end-state source.
  const revealP = useRevealProgress(scrollYProgress);

  // Sticky pinned: content builds 0→60%, reading pause 60→100%. Motion values
  // (driven straight to the DOM) so scrolling doesn't re-render the section.
  const titleOp = useTransform(revealP, [0, 0.12], [0, 1], { ease: easeIO });
  const titleY = useTransform(revealP, [0, 0.12], [40, 0], { ease: easeIO });
  const stmtOp = useTransform(revealP, [0.15, 0.28], [0, 1], { ease: easeIO });
  const stmtY = useTransform(revealP, [0.15, 0.28], [28, 0], { ease: easeIO });

  const statement = project.statement;
  const spotlights = project.spotlights;

  // Fallback: no statement and no spotlights — show extendedDescription centered
  if (!statement && !spotlights?.length) {
    if (!project.extendedDescription) return null;
    return (
      <section ref={fallbackRef} className="mx-auto max-w-[820px] text-center" style={{ padding: "clamp(80px, 12vh, 140px) clamp(28px, 6vw, 80px)" }}>
        <p className="text-pretty text-[clamp(18px,2.8vw,28px)] font-medium leading-[1.5] text-[var(--text-secondary)]" style={{ opacity: fallbackInView ? 1 : 0, transform: fallbackInView ? "translateY(0)" : "translateY(28px)", transition: "all 1s cubic-bezier(0.25,0.1,0.25,1)" }}>
          {project.extendedDescription}
        </p>
      </section>
    );
  }

  // Build the statement text node
  const statementNode = statement ? (
    <p className="font-semibold leading-[1.35] text-[var(--text-primary)]" style={{
      fontSize: isMobile ? "clamp(22px, 5.5vw, 32px)" : "clamp(24px, 2.4vw, 34px)",
      letterSpacing: "-0.02em",
      textWrap: "balance",
    }}>
      {statement.before}{" "}
      {statement.highlights.map((h, i) => (
        <span key={h}>
          <span style={{ color: accent }}>{h}</span>
          {i < statement.highlights.length - 1 ? ", " : "."}
          {i === statement.highlights.length - 2 ? "and " : ""}
        </span>
      ))}
    </p>
  ) : project.extendedDescription ? (
    <p className="text-pretty text-[clamp(18px,2.4vw,26px)] font-medium leading-[1.5] text-[var(--text-secondary)]">
      {project.extendedDescription}
    </p>
  ) : null;

  return (
    <div ref={sectionRef} style={{ height: isMobile ? "200vh" : "220vh", position: "relative" }}>
      {/* MOBILE-SWARM: scrollytelling — svh pinned child (see HeroSection note). */}
      <div className="sticky top-0 flex min-h-screen-svh items-center" style={{ background: "var(--st-bg-alt)" }}>
        <section className="mx-auto w-full max-w-[1100px]" style={{ padding: "clamp(48px, 6vh, 80px) clamp(28px, 6vw, 80px)" }}>
          <div className={isMobile ? "flex flex-col gap-8" : "grid gap-14"} style={!isMobile ? { gridTemplateColumns: "1fr 1fr", alignItems: "start" } : undefined}>

            {/* Left: Title + statement */}
            <div>
              <motion.div style={{ opacity: titleOp, y: titleY }}>
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.3em]" style={{ color: accent, opacity: 0.6 }}>Overview</p>
                <h2 className="text-[clamp(32px,5vw,48px)] font-bold tracking-tight text-[var(--text-primary)]" style={{ lineHeight: 1.1 }}>
                  At a Glance<span style={{ color: accent }}>.</span>
                </h2>
                <div aria-hidden className="mt-3 h-[2px] rounded-full" style={{ width: 40, background: accent, opacity: 0.3 }} />
              </motion.div>

              {statementNode && (
                <motion.div className="mt-8" style={{ opacity: stmtOp, y: stmtY }}>
                  {statementNode}
                </motion.div>
              )}
            </div>

            {/* Right: Spotlights */}
            {spotlights?.length > 0 && (
              <div className="flex flex-col gap-8">
                {spotlights.map((s, i) => (
                  <SpotlightItem
                    key={i}
                    spotlight={s}
                    index={i}
                    progress={revealP}
                    accent={accent}
                    isMobile={isMobile}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

// ─── Tech Section — Scroll Text Lines ────────────────────────────────────────
// Multiple rows of tool names that slide horizontally at different speeds/directions
// as the user scrolls vertically. Editorial, kinetic, Apple-keynote feel.

function ScrollTextRow({ items, accent, scrollYProgress, speed, direction, opacity: rowOpacity, highlight, ghostPattern }) {
  const x = useTransform(
    scrollYProgress,
    [0, 1],
    [direction * speed * -1, direction * speed],
  );

  return (
    <motion.div
      className="flex shrink-0 items-center gap-[clamp(16px,3vw,32px)] whitespace-nowrap"
      style={{ x }}
    >
      {items.map((item, i) => {
        const isHighlight = highlight === item;
        const isGhost = !isHighlight && ghostPattern.indices.has(i % ghostPattern.mod);
        return (
          <span key={`${item}-${i}`}>
            <span
              className="font-bold uppercase"
              style={{
                fontSize: "clamp(28px, 5vw, 56px)",
                letterSpacing: "-0.02em",
                color: isHighlight ? accent : isGhost ? "transparent" : "var(--text-primary)",
                opacity: isHighlight ? 0.85 : rowOpacity,
                WebkitTextStroke: isGhost ? "1.5px var(--text-primary)" : "none",
                WebkitTextStrokeColor: isGhost ? `color-mix(in srgb, var(--text-primary) ${Math.round(rowOpacity * 100)}%, transparent)` : undefined,
              }}
            >
              {item}
            </span>
            <span
              className="mx-[clamp(8px,1.5vw,16px)] inline-block text-[clamp(16px,3vw,32px)]"
              style={{ color: accent, opacity: 0.25 }}
              aria-hidden
            >
              ·
            </span>
          </span>
        );
      })}
    </motion.div>
  );
}

// Ghost pattern: which word indices (cycling per toolCount) render as outlined text
function ghostPattern(indices, mod) {
  return { indices: new Set(indices), mod };
}

function TechSection({ project, accent }) {
  const outerRef = useRef(null);
  const isMobile = useMediaQuery("(max-width: 767px)");
  const stickyP = useStickyMotion(outerRef);
  // MOBILE-SWARM: scrollytelling — reduced-motion end-state for the reveals.
  const revealP = useRevealProgress(stickyP);

  // Horizontal text movement still driven by page-level scroll.
  const { scrollYProgress } = useScroll({
    target: outerRef,
    offset: ["start end", "end start"],
  });
  // MOBILE-SWARM: scrollytelling — under reduced motion freeze the kinetic
  // rows at mid-travel (0.5) so they sit centered/readable instead of being
  // slammed to one edge (which a static 1 or 0 would do).
  const kineticP = useRevealProgress(scrollYProgress, 0.5);

  // Sticky pinned: title 0→12%, rows 18→30%, reading pause 55→100%. Motion
  // values keep the whole row stack (many stroked spans) off the re-render path.
  const titleOp = useTransform(revealP, [0, 0.12], [0, 1], { ease: easeIO });
  const titleY = useTransform(revealP, [0, 0.12], [40, 0], { ease: easeIO });
  const rowsOp = useTransform(revealP, [0.18, 0.3], [0, 1], { ease: easeIO });
  const rowsY = useTransform(revealP, [0.18, 0.3], [24, 0], { ease: easeIO });

  const primaryName = project.primaryTool?.name || null;

  const { toolNames, rows } = useMemo(() => {
    const t = project.toolsDetailed
      ? project.toolsDetailed.map((d) => d.name)
      : (project.tools || []);
    if (!t.length) return { toolNames: t, rows: [] };
    const tc = t.length;
    const repeat = (arr, times) => { const out = []; for (let i = 0; i < times; i++) out.push(...arr); return out; };
    const shift = (arr, n) => [...arr.slice(n % arr.length), ...arr.slice(0, n % arr.length)];
    // Each row is a wide, GPU-composited layer of large stroked text. On mobile
    // we render 4 rows instead of 6 and repeat the tool list 3× instead of 4× —
    // ~half the painted span count. reps=3 still keeps every row wider than
    // viewport + max scroll-travel (even for 5-tool lists), so edges never show.
    const reps = isMobile ? 3 : 4;
    const configs = [
      { shift: 0, speed: 220, direction: 1,  opacity: 0.15, ghost: ghostPattern([1, 4, 7, 10], tc) },
      { shift: 3, speed: 160, direction: -1, opacity: 0.4,  ghost: ghostPattern([0, 3, 8], tc) },
      { shift: 7, speed: 280, direction: 1,  opacity: 0.6,  ghost: ghostPattern([2, 5, 9], tc) },
      { shift: 1, speed: 190, direction: -1, opacity: 0.3,  ghost: ghostPattern([1, 6, 10], tc) },
      { shift: 5, speed: 240, direction: 1,  opacity: 0.2,  ghost: ghostPattern([0, 4, 7], tc) },
      { shift: 9, speed: 140, direction: -1, opacity: 0.12, ghost: ghostPattern([2, 3, 8, 10], tc) },
    ];
    const used = isMobile ? configs.slice(0, 4) : configs;
    return {
      toolNames: t,
      rows: used.map((c) => ({
        items: repeat(shift(t, c.shift), reps),
        speed: c.speed,
        direction: c.direction,
        opacity: c.opacity,
        ghost: c.ghost,
      })),
    };
  }, [project.toolsDetailed, project.tools, isMobile]);

  if (!toolNames.length) return null;

  return (
    <div ref={outerRef} style={{ height: "200vh", position: "relative" }}>
      {/* MOBILE-SWARM: scrollytelling — svh pinned child (see HeroSection note). */}
      <div className="sticky top-0 flex min-h-screen-svh items-center" style={{ background: "var(--st-bg)" }}>
        <section className="relative w-full overflow-hidden py-12">
          {/* Phase 1: Title slides up first */}
          <motion.div className="mx-auto max-w-[860px] px-7 mb-10" style={{ opacity: titleOp, y: titleY }}>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.3em]" style={{ color: accent, opacity: 0.6 }}>Technologies</p>
            <h2 className="text-[clamp(32px,5vw,48px)] font-bold tracking-tight text-[var(--text-primary)]" style={{ lineHeight: 1.1 }}>
              <span className="underline decoration-2 underline-offset-[6px]" style={{ textDecorationColor: accent }}>Built With</span><span style={{ color: accent }}>.</span>
            </h2>
          </motion.div>

          {/* Phase 2: Rows build in after title locks */}
          <motion.div className="flex flex-col gap-[clamp(6px,1.2vw,14px)]" style={{ opacity: rowsOp, y: rowsY }}>
            {rows.map((row, i) => (
              <div key={i} className="flex overflow-visible">
                <ScrollTextRow
                  items={row.items}
                  accent={accent}
                  scrollYProgress={kineticP}
                  speed={row.speed}
                  direction={row.direction}
                  opacity={row.opacity}
                  highlight={primaryName}
                  ghostPattern={row.ghost}
                />
              </div>
            ))}
          </motion.div>

          {/* Top/bottom fade masks */}
          <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-20" style={{ background: "linear-gradient(to bottom, var(--st-bg), transparent)" }} />
          <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-20" style={{ background: "linear-gradient(to top, var(--st-bg), transparent)" }} />
        </section>
      </div>
    </div>
  );
}

// ─── Features Section — Left title, right scroll-reveal breakdown ────────────

// One feature bullet — own component so its scroll transform is a valid
// top-level hook rather than a hook called inside a .map callback.
function FeatureBullet({ text, index, total, progress, accent }) {
  const start = 0.14 + (index / total) * 0.35;
  const op = useTransform(progress, [start, start + 0.06], [0, 1], { ease: easeIO });
  const x = useTransform(progress, [start, start + 0.06], [14, 0], { ease: easeIO });
  return (
    <motion.div className="flex items-start gap-3 py-2.5" style={{ opacity: op, x }}>
      <div aria-hidden className="mt-[8px] h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: accent, opacity: 0.45 }} />
      <p className="text-[14px] leading-[1.6] text-[var(--text-secondary)]">{text}</p>
    </motion.div>
  );
}

function FeaturesSection({ project, accent }) {
  const outerRef = useRef(null);
  const isMobile = useMediaQuery("(max-width: 767px)");
  const stickyP = useStickyMotion(outerRef);
  // MOBILE-SWARM: scrollytelling — reduced-motion users get the fully-revealed
  // end state; the bullets and summary reveal below also consume this source.
  const revealP = useRevealProgress(stickyP);

  // Sticky pinned: title 0→10%, features 15→50%, links 50→56%, summary fade-in
  // ~10%, reading pause 55→100%. All motion values → no per-frame re-render.
  const titleOp = useTransform(revealP, [0, 0.1], [0, 1], { ease: easeIO });
  const titleY = useTransform(revealP, [0, 0.1], [40, 0], { ease: easeIO });
  const linksOp = useTransform(revealP, [0.5, 0.56], [0, 1], { ease: easeIO });
  const linksY = useTransform(revealP, [0.5, 0.56], [12, 0], { ease: easeIO });
  // Right column fade-in (replaces the old boolean opacity + CSS transition).
  const summaryOp = useTransform(revealP, [0.08, 0.18], [0, 1], { ease: easeIO });

  if (!project.keyFeatures || project.keyFeatures.length === 0) return null;

  const hasDescription = !!project.extendedDescription;
  const total = project.keyFeatures.length;

  return (
    <div ref={outerRef} style={{ height: isMobile ? "220vh" : "260vh", position: "relative" }}>
      {/* MOBILE-SWARM: scrollytelling — svh pinned child (see HeroSection note). */}
      <div className="sticky top-0 flex min-h-screen-svh items-center" style={{ background: "var(--st-bg-alt)" }}>
        <section className="mx-auto w-full max-w-[1100px]" style={{ padding: "clamp(48px, 6vh, 80px) clamp(28px, 6vw, 80px)" }}>
          <div className={isMobile ? "flex flex-col gap-8" : "grid gap-14"} style={!isMobile ? { gridTemplateColumns: "1fr 1fr", alignItems: "start" } : undefined}>

            {/* Left: Title + feature bullets */}
            <div>
              <motion.div style={{ opacity: titleOp, y: titleY }}>
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.3em]" style={{ color: accent, opacity: 0.6 }}>Highlights</p>
                <h2 className="text-[clamp(32px,5vw,48px)] font-bold tracking-tight text-[var(--text-primary)]" style={{ lineHeight: 1.1 }}>
                  Key Features<span style={{ color: accent }}>.</span>
                </h2>
                <div aria-hidden className="mt-3 mb-8 h-[2px] rounded-full" style={{ width: 40, background: accent, opacity: 0.3 }} />
              </motion.div>

              {/* Feature bullets — stagger in after title */}
              <div>
                {project.keyFeatures.map((f, i) => (
                  <FeatureBullet key={i} text={f} index={i} total={total} progress={revealP} accent={accent} />
                ))}
              </div>

              {/* Action links — appear after features */}
              {(project.github || project.liveUrl || project.youtube) && (
                <motion.div className="mt-6 flex flex-wrap gap-3" style={{ opacity: linksOp, y: linksY }}>
                  {project.github && (
                    <a href={project.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-[6px] border px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.08em] no-underline transition-all duration-200 hover:-translate-y-0.5" style={{ color: accent, borderColor: `${accent}44`, background: `${accent}0a` }}>
                      <GithubIcon size={14} />
                      View on GitHub
                    </a>
                  )}
                  {project.liveUrl && (
                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-[6px] border px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.08em] no-underline transition-all duration-200 hover:-translate-y-0.5" style={{ color: accent, borderColor: `${accent}44`, background: `${accent}0a` }}>
                      <ExternalLinkIcon size={14} />
                      View Live Site
                    </a>
                  )}
                  {project.youtube && (
                    <a href={project.youtube} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-[6px] border px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.08em] no-underline transition-all duration-200 hover:-translate-y-0.5" style={{ color: accent, borderColor: `${accent}44`, background: `${accent}0a` }}>
                      <YoutubeIcon size={14} />
                      Watch on YouTube
                    </a>
                  )}
                </motion.div>
              )}
            </div>

            {/* Right: Summary with sentence-by-sentence reveal */}
            {hasDescription && (
              <motion.div className={isMobile ? "" : "pt-2"} style={{ opacity: summaryOp }}>
                <DescriptionReveal text={project.extendedDescription} progress={revealP} accent={accent} />
              </motion.div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

// One summary sentence — own component so its scroll transform is a valid
// top-level hook rather than a hook called inside a .map callback.
function RevealSentence({ sentence, index, count, progress }) {
  const start = 0.18 + (index / count) * 0.32;
  const op = useTransform(progress, [start, start + 0.08], [0, 1], { ease: easeIO });
  const y = useTransform(progress, [start, start + 0.08], [12, 0], { ease: easeIO });
  return (
    <motion.p className="text-[15px] leading-[1.75] text-[var(--text-secondary)]" style={{ opacity: op, y, textWrap: "pretty" }}>
      {sentence.trim()}
    </motion.p>
  );
}

const DescriptionReveal = memo(function DescriptionReveal({ text, progress, accent }) {
  const sentences = useMemo(() => text.match(/[^.!?]+[.!?]+/g) || [text], [text]);

  // Title reveals first
  const titleOp = useTransform(progress, [0.1, 0.18], [0, 1], { ease: easeIO });
  const titleY = useTransform(progress, [0.1, 0.18], [16, 0], { ease: easeIO });

  return (
    <div>
      {/* Summary heading */}
      <motion.div style={{ opacity: titleOp, y: titleY }}>
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.3em]" style={{ color: accent, opacity: 0.6 }}>Summary</p>
        <div aria-hidden className="mb-6 h-[2px] rounded-full" style={{ width: 32, background: accent, opacity: 0.3 }} />
      </motion.div>

      {/* Sentences reveal one by one */}
      <div className="flex flex-col gap-4">
        {sentences.map((sentence, i) => (
          <RevealSentence key={i} sentence={sentence} index={i} count={sentences.length} progress={progress} />
        ))}
      </div>
    </div>
  );
});

// ─── Next Project CTA ────────────────────────────────────────────────────────

function NextProjectSection({ nextProject, onNavigate }) {
  const ref = useRef(null);
  const inView = useScrollyInView(ref);
  const [hovered, setHovered] = useState(false);
  // MOBILE-SWARM: touch — gate the hover STATE behind a hover-capable pointer.
  // Synthetic mouseenter fires on a tap, so on touch this glow + title-scale
  // would engage and stay STUCK after navigating back. Only arm the handlers
  // on hover+fine-pointer devices; touch gets the always-visible CTA + a CSS
  // :active press (see .next-project-cta in globals.css). Desktop unchanged.
  const canHover = useMediaQuery("(hover: hover) and (pointer: fine)");
  const accent = nextProject.accentColor;

  return (
    <section
      ref={ref}
      onMouseEnter={canHover ? () => setHovered(true) : undefined}
      onMouseLeave={canHover ? () => setHovered(false) : undefined}
      onClick={() => onNavigate(nextProject.id)}
      className="next-project-cta relative isolate flex min-h-[60vh] cursor-pointer flex-col items-center justify-center overflow-hidden px-7 py-20"
      role="link"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onNavigate(nextProject.id); }}
      aria-label={`View next project: ${nextProject.title}`}
    >
      {/* Accent glow — blurred solid, softened to blend out */}
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 h-[30vh] w-[44vw] -translate-x-1/2 -translate-y-1/2 rounded-full transition-opacity duration-500" style={{ background: accent, opacity: `calc(${hovered ? 0.26 : 0.13} * var(--st-glow-mult))`, filter: "blur(90px)" }} />

      {/* Dither overlay — removes 8-bit banding rings from the glow above */}
      <div aria-hidden className="glow-dither pointer-events-none absolute inset-0" />

      <div className="relative z-[2] text-center" style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(28px)", transition: "all 0.9s cubic-bezier(0.25, 0.1, 0.25, 1)" }}>
        <span className="mb-5 block text-[11px] font-semibold uppercase tracking-[0.3em]" style={{ color: accent, opacity: 0.5 }}>Next Project</span>
        <h2 className="mb-3.5 font-bold leading-[1.1] text-[var(--text-primary)] transition-transform duration-[400ms]" style={{ fontSize: "clamp(26px, 5.5vw, 52px)", letterSpacing: "-0.02em", transform: hovered ? "scale(1.02)" : "none" }}>
          {nextProject.title}
        </h2>
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-[var(--text-tertiary)]">{nextProject.role}</p>
        <p className="text-[13px] tracking-[0.02em] text-[var(--text-tertiary)] opacity-70">{nextProject.tags.join(" · ")}</p>
        <div className="mt-7 inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.12em] transition-opacity duration-300" style={{ color: accent, opacity: hovered ? 0.9 : 0.5 }}>
          View Project
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 3L9 7L5 11" /></svg>
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export default function ProjectDetail() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  useTheme();
  const projectId = Number(id);
  const project = useMemo(
    () => Number.isFinite(projectId) ? projectsData.find((p) => p.id === projectId) : undefined,
    [projectId],
  );
  const navigationTimeoutRef = useRef();

  // Force scroll to top on mount
  useLayoutEffect(() => {
    const mainContent = document.querySelector("main");
    const previousDisplay = mainContent?.style.display ?? "";
    const previousVisibility = mainContent?.style.visibility ?? "";
    if (mainContent) {
      mainContent.scrollTop = 0;
      mainContent.scrollTo(0, 0);
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
    return () => { if (ref.current) clearTimeout(ref.current); };
  }, []);

  const [manualOpen, setManualOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    let prev = false;
    const onScroll = () => {
      const next = window.scrollY > 300;
      if (next !== prev) { prev = next; setShowBackToTop(next); }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = useCallback(() => {
    // Distance-adaptive cinematic scroll — matches the shared BackToTop used
    // across the rest of the site, instead of the browser's fast native smooth.
    smoothScrollToTop();
  }, []);

  const accentColor = project?.accentColor || ACCENT_DEFAULT;

  const handleBackToProjects = useCallback(() => {
    if (navigationTimeoutRef.current) clearTimeout(navigationTimeoutRef.current);
    const state = location.state || {};
    try { sessionStorage.setItem(SCROLL_TO_PROJECTS_FLAG, "1"); } catch { /* Ignore */ }
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

  const handleNavigateToProject = useCallback((nextId) => {
    navigate(`/project/${nextId}`, { state: { from: "project" } });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [navigate]);

  if (!project) {
    return (
      <div className="flex min-h-[100svh] items-center justify-center">
        <p className="text-xl font-semibold text-foreground">Project not found</p>
      </div>
    );
  }

  const nextProject = getNextProject(project.id);

  return (
    <>
    {/* Fixed UI — portaled to body so overflow:clip ancestors can't trap it */}
    {createPortal(
      <div className="pointer-events-none fixed inset-0 z-[9999]" data-project-detail-hud>
        {/* Back to projects */}
        <div className="pointer-events-auto absolute left-4 top-4 sm:left-7 sm:top-6">
          <button type="button" onClick={handleBackToProjects} className="inline-flex min-h-[44px] min-w-[44px] items-center gap-1.5 px-2 py-2 text-[11px] font-medium uppercase tracking-[0.12em] transition-colors duration-200 sm:px-0 sm:py-0" style={{ color: "var(--st-back-text)" }} onMouseEnter={(e) => { e.currentTarget.style.color = "var(--st-back-hover)"; }} onMouseLeave={(e) => { e.currentTarget.style.color = "var(--st-back-text)"; }}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M8 2L4 6L8 10" /></svg>
            <span className="hidden sm:inline">Back to Projects</span>
            <span className="sm:hidden">Back</span>
          </button>
        </div>

        {/* Progress bar */}
        <div className="absolute left-0 right-0 top-0" style={{ height: 3, background: "var(--st-border-sub)" }}>
          <ProgressBarFill accent={accentColor} />
        </div>

        {/* Back to top chevron */}
        <button
          type="button"
          onClick={scrollToTop}
          className={`pointer-events-auto absolute bottom-4 right-4 inline-flex min-h-[44px] min-w-[44px] items-center justify-center p-2 text-[var(--text-tertiary)] transition-all duration-500 ease-out hover:text-[var(--text-primary)] sm:bottom-6 sm:right-6 md:bottom-8 md:right-8 ${showBackToTop ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"}`}
          aria-label="Back to top"
          title="Back to top"
        >
          <ChevronUpIcon size={28} className="sm:h-9 sm:w-9" />
        </button>
      </div>,
      document.body,
    )}

    <div data-project-detail className="relative min-h-[100svh] w-full" style={{ background: "var(--st-bg)", overflowX: "clip" }}>

      <div className="relative z-[1]">
        <HeroSection project={project} accent={accentColor} />

        <div style={{ background: "var(--st-bg-alt)" }}>
          <StatementSpotlightsSection project={project} accent={accentColor} />
        </div>

        <TechSection project={project} accent={accentColor} />

        {/* Screenshots (only for projects that have them) */}
        <div style={{ background: "var(--st-bg-alt)" }}>
          <ScreenshotShowcase project={project} />
        </div>

        <FeaturesSection project={project} accent={accentColor} />

        <div style={{ background: "var(--st-bg-alt)" }}>
          <NextProjectSection nextProject={nextProject} onNavigate={handleNavigateToProject} />
        </div>

        {/* Footer */}
        <Suspense fallback={<div className="h-40" />}>
          <Footer />
        </Suspense>
      </div>

      {/* PDF Manual Modal */}
      {manualOpen && (
        <Suspense fallback={null}>
          <PdfModal open={manualOpen} onClose={() => setManualOpen(false)} src={project.userManual} title="User Manual" />
        </Suspense>
      )}

    </div>
    </>
  );
}
