import { lazy, Suspense, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useInView, useScroll, useTransform } from "framer-motion";
import useReducedMotion from "@/hooks/useReducedMotion";
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
  SCROLL_TO_PROJECTS_FLAG,
} from "@/constants";
import GlassSurface from "@/components/surfaces/GlassSurface";
import OptimizedImage from "./OptimizedImage";
import { useTheme } from "@/components/theme-provider";
import { Box, Dialog, IconButton } from "@/components/ui/sx-primitives";
import { slideSpringSecondary } from "@/shared/animation/presets";
import { GithubIcon } from "@/components/ui/github";
import { YoutubeIcon } from "@/components/ui/youtube";
import { FileTextIcon } from "@/components/ui/file-text";
import { ExternalLinkIcon } from "@/components/ui/external-link";
import { ChevronUpIcon } from "@/components/ui/chevron-up";
const PdfModal = lazy(() => import("@/components/ui/PdfModal"));
const Footer = lazy(() => import("./Footer"));

// ─── Helpers ──────────────────────────────────────────────────────────────────

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

function getPrevProject(id) {
  const idx = projectsData.findIndex((p) => p.id === id);
  return projectsData[(idx - 1 + projectsData.length) % projectsData.length];
}

function getNextProject(id) {
  const idx = projectsData.findIndex((p) => p.id === id);
  return projectsData[(idx + 1) % projectsData.length];
}

// ─── Scroll-driven reveal ─────────────────────────────────────────────────────

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

// ─── Shared UI pieces ─────────────────────────────────────────────────────────

function SectionLabel({ color, children }) {
  return (
    <p
      className="mb-3 text-center text-[11px] font-semibold uppercase tracking-[0.32em]"
      style={{ color }}
    >
      {children}
    </p>
  );
}

function SectionTitle({ children }) {
  return (
    <h2 className="mb-8 text-center text-2xl font-bold tracking-tight text-[var(--text-primary)] sm:mb-10 sm:text-3xl md:text-[2.25rem]">
      {children}
    </h2>
  );
}

function StatusBadge({ status, accent }) {
  const isLive = status === "Live";
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-[4px] px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em]"
      style={{
        background: isLive ? "rgba(52,211,153,0.12)" : getAccentRgba(accent, 0.12),
        color: isLive ? "#34d399" : accent,
        border: `1px solid ${isLive ? "rgba(52,211,153,0.3)" : getAccentRgba(accent, 0.3)}`,
      }}
    >
      {isLive && (
        <span
          className="inline-block h-[5px] w-[5px] rounded-full bg-emerald-400"
          aria-hidden
        />
      )}
      {status}
    </span>
  );
}

function LinkPill({ href, onClick, children, accent }) {
  const Tag = href ? "a" : "button";
  const linkProps = href
    ? { href, target: "_blank", rel: "noopener noreferrer" }
    : { type: "button", onClick };

  return (
    <Tag
      {...linkProps}
      className="inline-flex items-center gap-1.5 rounded-[4px] border px-4 py-1.5 text-[11px] font-semibold tracking-[0.1em] no-underline transition-all duration-200 hover:-translate-y-0.5"
      style={{
        color: accent,
        borderColor: getAccentRgba(accent, 0.3),
        backgroundColor: getAccentRgba(accent, 0.08),
      }}
    >
      {children}
    </Tag>
  );
}

// ─── Body scroll lock ─────────────────────────────────────────────────────────

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

// ─── Lightbox ─────────────────────────────────────────────────────────────────

const slideVariants = {
  enter: (direction) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0,
    scale: 0.96,
  }),
  center: { zIndex: 1, x: 0, opacity: 1, scale: 1 },
  exit: (direction) => ({
    zIndex: 0,
    x: direction < 0 ? "100%" : "-100%",
    opacity: 0,
    scale: 0.96,
  }),
};

function Lightbox({ screenshots, projectTitle, open, onClose, initialIndex = 0 }) {
  const [index, setIndex] = useState(initialIndex);
  const [direction, setDirection] = useState(0);
  const dragX = useMotionValue(0);
  const total = screenshots.length;

  useEffect(() => {
    if (open) setIndex(initialIndex);
  }, [open, initialIndex]);

  const next = useCallback(() => {
    setDirection(1);
    setIndex((p) => (p + 1) % total);
  }, [total]);

  const prev = useCallback(() => {
    setDirection(-1);
    setIndex((p) => (p - 1 + total) % total);
  }, [total]);

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
          bgcolor: "rgba(0,0,0,0.95)",
          m: 0,
          width: "100dvw",
          height: "100dvh",
          maxWidth: "100dvw",
          maxHeight: "100dvh",
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
          onClick={onClose}
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
          onDragEnd={handleDragEnd}
          style={{ x: dragX }}
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
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <Box
              component={motion.div}
              layout={false}
              key={index}
              custom={direction}
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
                src={screenshots[index]}
                alt={`${projectTitle} screenshot ${index + 1}`}
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
              onClick={prev}
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
              onClick={next}
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
              <span className="text-sm">
                {index + 1} / {total}
              </span>
            </GlassSurface>
          </>
        )}
      </Box>
    </Dialog>
  );
}

// ─── Screenshot Showcase ──────────────────────────────────────────────────────

function ScreenshotShowcase({ project }) {
  const { screenshots, title, accentColor: accent } = project;
  const images = screenshots && screenshots.length > 0 ? screenshots : [];
  const [active, setActive] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const reducedMotion = useReducedMotion();

  useEffect(() => { setActive(0); }, [project.id]);

  if (images.length === 0) return null;

  const openLightbox = (i) => {
    setLightboxIndex(i);
    setLightboxOpen(true);
  };

  return (
    <RevealSection className="px-6 py-16 sm:px-8 sm:py-20 md:py-24">
      <div className="mx-auto max-w-[1100px]">
        <SectionLabel color={accent}>Screenshots</SectionLabel>
        <SectionTitle>See it in Action</SectionTitle>

        {/* Main image */}
        <div
          className="flex justify-center rounded-3xl p-5 sm:p-8 md:p-10"
          style={{
            background: `radial-gradient(ellipse at center, ${getAccentRgba(accent, 0.05)} 0%, transparent 70%)`,
          }}
        >
          <motion.div
            key={images[active]}
            initial={!reducedMotion ? { opacity: 0 } : false}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            className="cursor-pointer"
            onClick={() => openLightbox(active)}
          >
            <OptimizedImage
              src={images[active]}
              alt={`${title} screenshot ${active + 1}`}
              priority={active === 0}
              className="[&_img]:max-h-[62vh] [&_img]:rounded-xl [&_img]:object-contain [&_img]:shadow-[0_24px_64px_rgba(0,0,0,0.12),0_0_0_1px_rgba(0,0,0,0.04)] dark:[&_img]:shadow-[0_24px_64px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.06)] sm:[&_img]:rounded-2xl"
              draggable={false}
            />
          </motion.div>
        </div>

        {/* Dot indicators */}
        {images.length > 1 && (
          <div className="mt-7 flex justify-center gap-2">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActive(i)}
                className="h-2 rounded-full transition-all duration-300"
                style={{
                  width: active === i ? 28 : 8,
                  backgroundColor: active === i ? accent : "var(--text-tertiary)",
                  opacity: active === i ? 1 : 0.3,
                }}
                aria-label={`Screenshot ${i + 1}`}
              />
            ))}
          </div>
        )}

        {/* Thumbnail strip */}
        {images.length > 1 && (
          <div
            className="mx-auto mt-6 grid max-w-[600px] gap-3"
            style={{ gridTemplateColumns: `repeat(${Math.min(images.length, 5)}, 1fr)` }}
          >
            {images.map((src, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActive(i)}
                className="overflow-hidden rounded-lg transition-all duration-300"
                style={{
                  border: active === i ? `2px solid ${accent}` : "2px solid transparent",
                  opacity: active === i ? 1 : 0.5,
                  background: "var(--bg-elevated)",
                  padding: 0,
                }}
              >
                <OptimizedImage
                  src={src}
                  alt={`Thumbnail ${i + 1}`}
                  className="[&_img]:aspect-[16/10] [&_img]:w-full [&_img]:rounded-md [&_img]:object-cover"
                  draggable={false}
                />
              </button>
            ))}
          </div>
        )}
      </div>

      <Lightbox
        screenshots={images}
        projectTitle={title}
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        initialIndex={lightboxIndex}
      />
    </RevealSection>
  );
}

// ─── Overview Section ─────────────────────────────────────────────────────────

function OverviewSection({ project }) {
  if (!project.extendedDescription) return null;
  return (
    <div className="bg-[var(--bg-elevated)]">
      <RevealSection className="mx-auto max-w-[720px] px-6 py-16 sm:px-8 sm:py-20 md:py-24">
        <SectionLabel color={project.accentColor}>Overview</SectionLabel>
        <SectionTitle>About This Project</SectionTitle>
        <p className="text-pretty text-center text-[15px] leading-[1.8] text-[var(--text-secondary)] sm:text-base md:text-[17px]">
          {project.extendedDescription}
        </p>
      </RevealSection>
    </div>
  );
}

// ─── Tech Stack Section ───────────────────────────────────────────────────────

function TechSection({ project }) {
  const accent = project.accentColor;
  if (!project.tools || project.tools.length === 0) return null;
  return (
    <RevealSection className="mx-auto max-w-[800px] px-6 py-16 sm:px-8 sm:py-20 md:py-24">
      <SectionLabel color={accent}>Built With</SectionLabel>
      <SectionTitle>Technologies</SectionTitle>
      <div className="flex flex-wrap justify-center gap-2.5">
        {project.tools.map((tool) => (
          <span
            key={tool}
            className="rounded-[4px] border px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.08em] transition-transform duration-200 hover:-translate-y-0.5"
            style={{
              color: accent,
              background: getAccentRgba(accent, 0.08),
              borderColor: getAccentRgba(accent, 0.25),
            }}
          >
            {tool}
          </span>
        ))}
      </div>
    </RevealSection>
  );
}

// ─── Key Features Section ─────────────────────────────────────────────────────

function FeaturesSection({ project }) {
  const accent = project.accentColor;
  if (!project.keyFeatures || project.keyFeatures.length === 0) return null;
  return (
    <div className="bg-[var(--bg-elevated)]">
      <RevealSection className="mx-auto max-w-[800px] px-6 py-16 sm:px-8 sm:py-20 md:py-24">
        <SectionLabel color={accent}>Highlights</SectionLabel>
        <SectionTitle>Key Features</SectionTitle>
        <div className="mx-auto grid max-w-3xl gap-4 sm:grid-cols-2 sm:gap-x-12 sm:gap-y-5">
          {project.keyFeatures.map((f) => (
            <div key={f} className="flex items-start gap-3.5">
              <span
                className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full"
                style={{ backgroundColor: accent }}
              />
              <span className="text-[15px] leading-relaxed text-[var(--text-secondary)]">
                {f}
              </span>
            </div>
          ))}
        </div>
      </RevealSection>
    </div>
  );
}

// ─── Timeline Section ─────────────────────────────────────────────────────────

function TimelineItem({ milestone, index, total, accentColor }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px 0px" });
  const reducedMotion = useReducedMotion();
  const isLast = index === total - 1;
  const ease = [0.33, 0, 0.2, 1];
  const anim = !reducedMotion;

  const lineGradient = `linear-gradient(180deg, ${accentColor} 0%, ${getAccentRgba(accentColor, 0.12)} 100%)`;

  return (
    <div ref={ref} className="relative" style={{ paddingBottom: isLast ? 0 : 36 }}>
      {!isLast && (
        <motion.div
          initial={anim ? { scaleY: 0 } : false}
          animate={isInView || !anim ? { scaleY: 1 } : {}}
          transition={anim ? { duration: 0.55, delay: 0.3, ease } : { duration: 0 }}
          className="absolute bottom-0 left-[7px] top-5 w-[2px] origin-top"
          style={{ background: lineGradient }}
          aria-hidden
        />
      )}
      <div className="flex items-start gap-4 sm:gap-5">
        <div className="relative flex-shrink-0" style={{ width: 16, height: 16 }}>
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
          <motion.div
            initial={anim ? { scale: 0 } : false}
            animate={isInView || !anim ? { scale: 1 } : {}}
            transition={anim ? { type: "spring", stiffness: 260, damping: 24, delay: 0.06 } : { duration: 0 }}
            className="absolute inset-0 rounded-full"
            style={{ border: `3px solid ${accentColor}`, backgroundColor: "var(--bg-secondary)" }}
          />
        </div>
        <div className="-mt-0.5 min-w-0 flex-1">
          <motion.p
            initial={anim ? { opacity: 0, x: -14 } : false}
            animate={isInView || !anim ? { opacity: 1, x: 0 } : {}}
            transition={anim ? { duration: 0.45, delay: 0.1, ease } : { duration: 0 }}
            className="text-[15px] font-semibold text-[var(--text-primary)] sm:text-base"
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
            className="mt-1.5 text-[13px] leading-relaxed text-[var(--text-secondary)] sm:text-sm"
          >
            {milestone.description}
          </motion.p>
        </div>
      </div>
    </div>
  );
}

function TimelineSection({ project }) {
  const accent = project.accentColor;
  if (!project.timeline || project.timeline.length === 0) return null;
  return (
    <RevealSection className="mx-auto max-w-[560px] px-6 py-16 sm:px-8 sm:py-20 md:py-24">
      <SectionLabel color={accent}>Process</SectionLabel>
      <SectionTitle>Timeline</SectionTitle>
      <div className="relative">
        {project.timeline.map((milestone, i) => (
          <TimelineItem
            key={`${milestone.phase}-${i}`}
            milestone={milestone}
            index={i}
            total={project.timeline.length}
            accentColor={accent}
          />
        ))}
      </div>
    </RevealSection>
  );
}

// ─── Action Buttons ───────────────────────────────────────────────────────────

function ActionLinkButton({ href, onClick, label, iconRef, IconComponent, reducedMotion }) {
  const Tag = href ? "a" : "button";
  const linkProps = href
    ? { href, target: "_blank", rel: "noopener noreferrer" }
    : { type: "button", onClick };

  return (
    <Tag
      {...linkProps}
      className="glass-btn glass-btn--ghost group/btn inline-flex items-center gap-1.5 px-3.5 py-2 text-[11px] font-bold uppercase tracking-[0.14em] shadow-none sm:gap-2 sm:px-5 sm:py-2.5 sm:text-[13px] sm:tracking-[0.18em] md:text-[14px]"
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
      <RevealSection className="mx-auto max-w-4xl px-6 pb-4 pt-16 text-center sm:px-8 sm:pb-6 sm:pt-20 md:pb-8 md:pt-24">
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

// ─── Next Project CTA ─────────────────────────────────────────────────────────

function ProjectNavCard({ project, direction, onNavigate }) {
  const accent = project.accentColor;
  const [hovered, setHovered] = useState(false);
  const isPrev = direction === "prev";

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onNavigate(project.id)}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onNavigate(project.id); }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="flex-1 cursor-pointer rounded-[20px] border px-7 py-9 transition-all duration-500 sm:px-9 sm:py-11"
      style={{
        background: hovered ? getAccentRgba(accent, 0.06) : "var(--bg-elevated)",
        borderColor: hovered ? getAccentRgba(accent, 0.3) : "var(--card-border)",
        transform: hovered ? "translateY(-4px)" : "none",
        boxShadow: hovered ? `0 16px 48px ${getAccentRgba(accent, 0.12)}` : "none",
        textAlign: isPrev ? "left" : "right",
      }}
    >
      <p
        className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.32em]"
        style={{ color: accent }}
      >
        {project.role}
      </p>
      <h3 className="mb-2.5 text-lg font-bold tracking-tight text-[var(--text-primary)] sm:text-xl md:text-2xl">
        {project.title}
      </h3>
      <p className="text-[13px] text-[var(--text-tertiary)]">
        {project.tags.join(" \u00b7 ")}
      </p>
      <div
        className={`mt-5 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] transition-opacity duration-300 ${isPrev ? "flex-row" : "flex-row"}`}
        style={{ color: accent, opacity: hovered ? 1 : 0.6 }}
      >
        {isPrev && (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M9 3L5 7L9 11" />
          </svg>
        )}
        {isPrev ? "Previous" : "Next"}
        {!isPrev && (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M5 3L9 7L5 11" />
          </svg>
        )}
      </div>
    </div>
  );
}

function ProjectNavigation({ prevProject, nextProject, onNavigate }) {
  return (
    <RevealSection className="px-6 pb-20 pt-16 sm:px-8 sm:pb-24 sm:pt-20">
      <p className="mb-6 text-center text-[11px] font-semibold uppercase tracking-[0.32em] text-[var(--text-tertiary)]">
        More Projects
      </p>
      <div className="mx-auto flex max-w-[900px] flex-col gap-4 sm:flex-row sm:gap-5">
        <ProjectNavCard project={prevProject} direction="prev" onNavigate={onNavigate} />
        <ProjectNavCard project={nextProject} direction="next" onNavigate={onNavigate} />
      </div>
    </RevealSection>
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
    () =>
      Number.isFinite(projectId)
        ? projectsData.find((p) => p.id === projectId)
        : undefined,
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
    return () => {
      if (ref.current) clearTimeout(ref.current);
    };
  }, []);

  const [manualOpen, setManualOpen] = useState(false);
  const headerGithubRef = useRef(null);
  const headerYoutubeRef = useRef(null);
  const headerLiveSiteRef = useRef(null);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const backToTopSentinelRef = useRef(null);

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

  const handleBackToProjects = useCallback(() => {
    if (navigationTimeoutRef.current) clearTimeout(navigationTimeoutRef.current);
    const state = location.state || {};
    try {
      sessionStorage.setItem(SCROLL_TO_PROJECTS_FLAG, "1");
    } catch {
      // Ignore
    }
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
    navigate(`/project/${nextId}`, {
      state: { from: "project" },
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [navigate]);

  if (!project) {
    return (
      <div className="flex min-h-[100svh] items-center justify-center">
        <p className="text-xl font-semibold text-foreground">Project not found</p>
      </div>
    );
  }

  const prevProject = getPrevProject(project.id);
  const nextProject = getNextProject(project.id);

  return (
    <div
      data-project-detail
      className="relative min-h-[100svh] w-full bg-[var(--bg-secondary)]"
      style={{ overflowX: "clip" }}
    >
      {/* Sentinel for back-to-top */}
      <div ref={backToTopSentinelRef} className="pointer-events-none absolute left-0 top-[40vh] h-px w-px" aria-hidden />

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <div className="relative flex min-h-[85vh] flex-col items-center justify-center overflow-hidden px-6 py-32 sm:px-8 md:px-10">
        <div className="relative z-[2] mx-auto max-w-[720px] text-center">
          {/* Back button - positioned above hero content */}
          <div className="mb-10">
            <button
              type="button"
              onClick={handleBackToProjects}
              className="group/back inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.15em] text-[var(--text-tertiary)] transition-colors duration-200 hover:text-[var(--text-primary)]"
            >
              <ArrowLeft size={10} className="transition-transform duration-300 group-hover/back:-translate-x-1" />
              <span className="relative">
                Back to Projects
                <span className="absolute -bottom-px left-0 h-px w-0 bg-[var(--text-primary)]/30 transition-all duration-300 group-hover/back:w-full" />
              </span>
            </button>
          </div>

          <p
            className="mb-5 text-[11px] font-semibold uppercase tracking-[0.34em]"
            style={{ color: accentColor }}
          >
            {project.role}
          </p>
          <h1 className="mb-5 text-[clamp(2.75rem,7vw,4.25rem)] font-bold leading-[1.06] tracking-tight text-[var(--text-primary)]">
            {project.title}
          </h1>
          <p className="mx-auto mb-6 max-w-[560px] text-pretty text-[17px] leading-[1.65] text-[var(--text-secondary)]">
            {project.description}
          </p>

          {/* Tools inline */}
          <p className="mb-6 text-[13px] tracking-[0.02em] text-[var(--text-tertiary)]">
            {project.tools.slice(0, 5).join(" \u00b7 ")}
          </p>

          {/* Status + links */}
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            <StatusBadge status={project.status} accent={accentColor} />
            {project.github && (
              <LinkPill href={project.github} accent={accentColor}>
                <GithubIcon ref={headerGithubRef} size={12} />
                GitHub
              </LinkPill>
            )}
            {project.youtube && (
              <LinkPill href={project.youtube} accent={accentColor}>
                <YoutubeIcon ref={headerYoutubeRef} size={12} />
                YouTube
              </LinkPill>
            )}
            {project.liveUrl && (
              <LinkPill href={project.liveUrl} accent={accentColor}>
                <ExternalLinkIcon ref={headerLiveSiteRef} size={12} />
                Live Site
              </LinkPill>
            )}
          </div>

          {/* Accent divider */}
          <div
            className="mx-auto mt-10 h-[2px] w-12 rounded-full opacity-60"
            style={{ backgroundColor: accentColor }}
          />
        </div>
      </div>

      {/* ── Screenshots ──────────────────────────────────────────────── */}
      <ScreenshotShowcase project={project} />

      {/* ── Overview ─────────────────────────────────────────────────── */}
      <OverviewSection project={project} />

      {/* ── Technologies ──────────────────────────────────────────────── */}
      <TechSection project={project} />

      {/* ── Key Features ──────────────────────────────────────────────── */}
      <FeaturesSection project={project} />

      {/* ── Timeline ─────────────────────────────────────────────────── */}
      <TimelineSection project={project} />

      {/* ── Action Buttons ────────────────────────────────────────────── */}
      <ActionButtons project={project} onManualOpen={() => setManualOpen(true)} />

      {/* ── Next Project ──────────────────────────────────────────────── */}
      <ProjectNavigation prevProject={prevProject} nextProject={nextProject} onNavigate={handleNavigateToProject} />

      {/* ── Footer ────────────────────────────────────────────────────── */}
      <Suspense fallback={<div className="h-40" />}>
        <Footer />
      </Suspense>

      {/* ── PDF Manual Modal ──────────────────────────────────────────── */}
      {manualOpen && (
        <Suspense fallback={null}>
          <PdfModal
            open={manualOpen}
            onClose={() => setManualOpen(false)}
            src={project.userManual}
            title="User Manual"
          />
        </Suspense>
      )}

      {/* ── Back to top ───────────────────────────────────────────────── */}
      <button
        type="button"
        onClick={scrollToTop}
        className={`fixed bottom-6 right-6 z-50 inline-flex items-center justify-center p-2 text-[var(--text-tertiary)] transition-all duration-300 ease-out hover:text-[var(--text-primary)] md:bottom-8 md:right-8 ${
          showBackToTop
            ? "translate-x-0 opacity-100"
            : "pointer-events-none translate-x-16 opacity-0"
        }`}
        aria-label="Back to top"
        title="Back to top"
      >
        <ChevronUpIcon size={36} />
      </button>
    </div>
  );
}
