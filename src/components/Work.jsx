import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import PageHeader from "./PageHeader";
import useReducedMotion from "@/hooks/useReducedMotion";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import {
  AnimatedLogoFull,
  AnimatedLogoMark,
  AnimatedLogoWordmark,
} from "@/components/ui/animated-logo/AnimatedLogo";

// ─── Work entries ──────────────────────────────────────────────────────────────
// Each entry is a full-viewport section. Add more entries by appending to this
// array — the rest of the component renders them in order.
//
// Visual treatment per entry: each role has its own brand identity, so the
// section background, mini logo, and big-logo rendering are all configurable.
const ENTRIES = [
  {
    id: "laitram",
    accentColor: "#3b82f6",
    role: "AI Strategy & Implementation Intern",
    duration: "May 2026 – Present",
    tools: "ChatGPT, Claude, Grok, AI Agents",
    team: "Laitram Machinery",
    ctaLabel: "View Company",
    ctaUrl: "https://www.laitrammachinery.com",
    background: "linear-gradient(170deg, #174F8B 0%, #0D3768 30%, #091E3A 80%)",
    ambient:
      "radial-gradient(ellipse 50% 50% at 65% 50%, rgba(26,92,158,0.18) 0%, transparent 70%), radial-gradient(ellipse 40% 40% at 20% 80%, rgba(9,30,58,0.4) 0%, transparent 60%)",
    logoSrc: "/images/laitram-machinery.webp",
    logoAlt: "Laitram Machinery",
    // Laitram is monochrome — filter to pure white for the big watermark.
    logoFilter: "brightness(0) invert(1)",
    logoMiniFilter: "brightness(0) invert(1)",
  },
  {
    id: "fieldflow",
    accentColor: "#F97066",
    role: "Lead Frontend Developer & Marketing",
    duration: "January 2026 – Present",
    tools: "Next.js, TypeScript, React, Tailwind",
    team: "FieldFlowTech",
    // No CTA — the animated mark + wordmark below it carry the brand
    // identity on their own. Entries without ctaLabel/ctaUrl skip the
    // bottom button (see conditional render in WorkEntry below).
    // Dark base with subtle coral/purple wash matching FieldFlow's brand.
    background: "linear-gradient(170deg, #2A1018 0%, #1A0E1F 35%, #09090B 80%)",
    ambient:
      "radial-gradient(ellipse 50% 50% at 65% 50%, rgba(249,112,102,0.14) 0%, transparent 70%), radial-gradient(ellipse 40% 40% at 20% 80%, rgba(168,85,247,0.16) 0%, transparent 60%)",
    logoSrc: "/images/fieldflow-og.webp",
    logoAlt: "FieldFlow",
    // FieldFlow is a multi-color brand — render in its native colors,
    // no filter. The OG image has its own dark background which blends
    // naturally with the section's dark gradient.
    logoFilter: "none",
    logoMiniFilter: "none",
    // FieldFlow uses the animated polygon mark instead of the static OG
    // image. The four gradient stops bridge the entry's existing accent
    // (coral #F97066) and ambient purple (rgba(168,85,247)) so the logo
    // reads as part of the same brand system as the surrounding section.
    useAnimatedLogo: true,
    brandGradient: {
      "--ff-stop-0": "#FDBA74",
      "--ff-stop-1": "#F97066",
      "--ff-stop-2": "#D946EF",
      "--ff-stop-3": "#A855F7",
    },
  },
];

// ─── Work page ────────────────────────────────────────────────────────────────
// Spatial model: Work sits below the hero. Entering from `/` slides up from
// bottom; exiting back to `/` slides back down. Animation is driven by
// AnimatePresence in App.jsx — this component just renders content.
//
// Multiple entries stack vertically (one viewport each). User scrolls within
// /work to navigate between them. Scroll-snap keeps each entry framed cleanly.
export default function Work() {
  const containerRef = useRef(null);
  const entryRefs = useRef([]);
  const [activeIndex, setActiveIndex] = useState(0);

  // Hide the body-level scrollbar while Work is mounted — the page has its
  // own scroll container so the body bar is redundant visual noise.
  useEffect(() => {
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, []);

  // Track which entry is currently in view. IntersectionObserver with the
  // scroll container as root + 0.55 threshold means the "active" entry
  // flips exactly as it crosses the halfway point of the viewport.
  useEffect(() => {
    const root = containerRef.current;
    if (!root) return undefined;
    const observers = entryRefs.current.map((el, idx) => {
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.55) {
            setActiveIndex(idx);
          }
        },
        { root, threshold: [0.55] },
      );
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach((o) => o?.disconnect());
  }, []);

  // Animated scroll between entries. Custom RAF interpolation gives a
  // consistent ~900ms duration with a cinematic ease curve across browsers,
  // matching the fullpage.js feel of premium portfolio sites.
  const animatingRef = useRef(false);
  const scrollToEntry = useCallback((idx) => {
    const container = containerRef.current;
    const target = entryRefs.current[idx];
    if (!container || !target) return;
    const startY = container.scrollTop;
    const endY = target.offsetTop;
    const distance = endY - startY;
    if (Math.abs(distance) < 1) return;

    animatingRef.current = true;
    const duration = 1200;
    const startTime = performance.now();
    // Cubic ease-in-out — soft start, soft stop. Matches Michelle Gore's pacing.
    const ease = (t) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    function step(now) {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / duration, 1);
      container.scrollTop = startY + distance * ease(t);
      if (t < 1) {
        requestAnimationFrame(step);
      } else {
        animatingRef.current = false;
      }
    }
    requestAnimationFrame(step);
  }, []);

  // Fullpage-style input on ALL devices: any meaningful wheel/touch/key input
  // advances one entry. The slightest scroll/swipe triggers the full RAF-tweened
  // transition (with parallax) rather than partially scrolling between sections.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    let touchStartY = 0;
    let gestureConsumed = false;

    const getCurrentIndex = () => {
      const h = container.clientHeight || 1;
      return Math.round(container.scrollTop / h);
    };

    const advance = (direction) => {
      if (animatingRef.current) return false;
      const current = getCurrentIndex();
      const last = ENTRIES.length - 1;
      let next = current + direction;
      // Forward wrap: past last entry → loops back to first. Reverse from
      // entry 0 stays at 0 (no backward wrap — feels more controlled).
      if (next > last) next = 0;
      if (next < 0) next = 0;
      if (next === current) return false;
      scrollToEntry(next);
      return true;
    };

    const onWheel = (e) => {
      // Even tiny scroll input should trigger a full-section transition.
      if (Math.abs(e.deltaY) < 4) return;
      if (animatingRef.current) {
        e.preventDefault();
        return;
      }
      const direction = e.deltaY > 0 ? 1 : -1;
      if (advance(direction)) e.preventDefault();
    };

    const onTouchStart = (e) => {
      touchStartY = e.touches[0].clientY;
      gestureConsumed = false;
    };

    // Block native scroll so even the slightest swipe glides to the next entry
    // (fullpage feel) instead of free-scrolling. One advance per swipe gesture.
    const onTouchMove = (e) => {
      if (e.cancelable) e.preventDefault();
      if (gestureConsumed || animatingRef.current) return;
      const deltaY = touchStartY - e.touches[0].clientY;
      if (Math.abs(deltaY) < 12) return; // the slightest swipe advances
      gestureConsumed = true;
      advance(deltaY > 0 ? 1 : -1);
    };

    const onTouchEnd = () => {
      gestureConsumed = false;
    };

    const onKeyDown = (e) => {
      if (animatingRef.current) return;
      if (e.key === "ArrowDown" || e.key === "PageDown") {
        if (advance(1)) e.preventDefault();
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        if (advance(-1)) e.preventDefault();
      }
    };

    container.addEventListener("wheel", onWheel, { passive: false });
    container.addEventListener("touchstart", onTouchStart, { passive: true });
    container.addEventListener("touchmove", onTouchMove, { passive: false });
    container.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("keydown", onKeyDown);

    return () => {
      container.removeEventListener("wheel", onWheel);
      container.removeEventListener("touchstart", onTouchStart);
      container.removeEventListener("touchmove", onTouchMove);
      container.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [scrollToEntry]);

  return (
    <div
      ref={containerRef}
      className="work-page relative w-full"
      style={{
        minHeight: "100svh",
        height: "100svh",
        background: ENTRIES[0].background.split(",")[0] || "#09090B",
        color: "#fff",
        fontFamily: "var(--font-body, system-ui, sans-serif)",
        // Scroll is JS-driven (RAF interpolation) for consistent cinematic
        // pacing — no native scroll-snap or scroll-behavior, which would
        // fight the custom animation curve.
        overflowY: "auto",
      }}
    >
      <PageHeader active="work" theme="dark" />

      {/* ── Entries — one full-viewport section per role ─────────────────── */}
      {ENTRIES.map((entry, idx) => (
        <WorkEntry
          key={entry.id}
          entry={entry}
          index={idx}
          containerRef={containerRef}
          sectionRef={(el) => {
            entryRefs.current[idx] = el;
          }}
        />
      ))}

      {/* ── Right-rail progress dots ─────────────────────────────────────── */}
      <ProgressDots
        entries={ENTRIES}
        activeIndex={activeIndex}
        onSelect={scrollToEntry}
      />
    </div>
  );
}

// ─── Right-rail progress dots — mirrors Skills, but right-aligned ──────────────
function ProgressDots({ entries, activeIndex, onSelect }) {
  return (
    <div
      className="fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-5 md:flex"
      role="tablist"
      aria-label="Work entries"
    >
      {entries.map((entry, i) => {
        const isActive = i === activeIndex;
        const isPast = i < activeIndex;
        return (
          <button
            key={entry.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-label={`Go to ${entry.team}`}
            onClick={() => onSelect(i)}
            className="grid place-items-center bg-transparent p-2"
            style={{ border: "none", cursor: "pointer" }}
          >
            <span
              aria-hidden
              className="block rounded-full transition-all duration-700 ease-out"
              style={{
                width: isActive ? 8 : 6,
                height: isActive ? 8 : 6,
                background: isActive
                  ? entry.accentColor
                  : isPast
                    ? "rgba(255,255,255,0.4)"
                    : "rgba(255,255,255,0.18)",
                boxShadow: isActive
                  ? `0 0 8px 2px ${entry.accentColor}33`
                  : "none",
                opacity: isActive ? 1 : 0.85,
              }}
            />
          </button>
        );
      })}
    </div>
  );
}

// ─── Single Work entry section ─────────────────────────────────────────────────
function WorkEntry({ entry, index, sectionRef, containerRef }) {
  // Only the first entry runs its fade-up animations on mount. Later entries
  const isFirst = index === 0;
  const reducedMotion = useReducedMotion();
  const isMobile = useMediaQuery("(max-width: 767px)");
  // Non-first entries use IntersectionObserver to trigger their build-out
  // animation when they scroll into view, so they feel fresh on arrival.
  const [hasEntered, setHasEntered] = useState(isFirst);
  const shouldAnimate = isFirst || hasEntered;

  // Scroll-driven parallax: as this section traverses the viewport, the big
  // background logo translates Y at ~70% of scroll speed (matching the
  // michellegore.com depth effect). useScroll listens to the work-page
  // container's scroll position — including programmatic RAF-driven scrolls,
  // so the parallax animates smoothly during section transitions.
  const localRef = useRef(null);
  const setRefs = useCallback(
    (el) => {
      localRef.current = el;
      if (typeof sectionRef === "function") sectionRef(el);
    },
    [sectionRef],
  );
  const { scrollYProgress } = useScroll({
    container: containerRef,
    target: localRef,
    offset: ["start end", "end start"],
  });
  // Parallax now runs on mobile too: the fullpage snap drives the container
  // scroll programmatically, so the background logo glides during transitions
  // just like desktop. Gentler travel on mobile, where the logo is an 80vw
  // blurred watermark rather than the right-anchored desktop wordmark.
  const logoParallaxY = useTransform(
    scrollYProgress,
    [0, 1],
    isMobile ? ["-6vh", "6vh"] : ["-10vh", "10vh"],
  );
  const ambientParallaxY = useTransform(
    scrollYProgress,
    [0, 1],
    isMobile ? ["-3vh", "3vh"] : ["-5vh", "5vh"],
  );

  // Trigger build-out when a non-first entry becomes visible
  useEffect(() => {
    if (isFirst || hasEntered) return undefined;
    const el = localRef.current;
    if (!el) return undefined;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setHasEntered(true); obs.disconnect(); } },
      { root: containerRef.current, threshold: 0.5 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [isFirst, hasEntered, containerRef]);

  return (
    <section
      ref={setRefs}
      aria-label={entry.team}
      className="relative flex items-center overflow-hidden"
      style={{
        width: "100%",
        height: "100svh",
        background: entry.background,
        // Brand gradient CSS variables for the animated logo (FieldFlow only;
        // other entries set no vars and the spread is a no-op).
        ...(entry.brandGradient || {}),
      }}
    >
      {/* Ambient radial glows — subtle parallax slower than the logo for
          a third depth plane behind the wordmark. */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: entry.ambient, y: ambientParallaxY }}
      />

      {/* Large background logo:
          - Outer DIV: vertical centering (plain CSS transform).
          - Inner motion.div: scroll-driven parallax translateY.
          Split into two layers because framer's `y` and `translateY` are
          aliases — combining them on the same element wouldn't compose.
          Hidden on mobile — the small logo in the content column is enough. */}
      <div
        aria-hidden
        className="work-bg-logo pointer-events-none absolute select-none"
        style={{
          right: "12%",
          top: 0,
          bottom: 0,
          width: "44vw",
          maxWidth: 620,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <motion.div style={{ y: logoParallaxY, marginTop: "22vh" }}>
          {entry.useAnimatedLogo ? (
            // FieldFlow: animated polygon mark + gradient wordmark. Stacked
            // vertically inside the parallax wrapper so they read as one unit
            // floating at the same depth. Reduced-motion users get the static
            // (non-animated) polygon render via animate={false}.
            <div
              className={shouldAnimate ? "work-fade-up work-fade-up--logo" : ""}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 48,
                width: "100%",
              }}
            >
              {/* Animate on mobile too (reanimated FieldFlow bg logo); reduced-motion still static. */}
              <AnimatedLogoMark size={isMobile ? 280 : 500} animate={!reducedMotion} />
              <AnimatedLogoWordmark fontSize={isMobile ? 36 : 64} />
            </div>
          ) : (
            <img
              src={entry.logoSrc}
              alt=""
              aria-hidden
              className={shouldAnimate ? "work-fade-up work-fade-up--logo" : ""}
              style={{
                width: "100%",
                height: "auto",
                display: "block",
                opacity: 1,
                filter: entry.logoFilter,
              }}
            />
          )}
        </motion.div>
      </div>

      {/* Left content: small logo + stacked metadata */}
      <div
        className="work-entry__content relative px-6 sm:px-8 md:pl-0"
        style={{
          zIndex: 2,
          maxWidth: 520,
          marginLeft: "clamp(24px, 24%, 380px)",
        }}
      >
        {entry.useAnimatedLogo ? (
          // FieldFlow: animated mark + wordmark above the "Role" MetaGroup.
          // marginBottom matches the static <img> spacing so the metadata
          // list below stays at the same Y position.
          <div
            className={shouldAnimate ? "work-fade-up work-fade-up--mini" : ""}
            style={{ marginBottom: "clamp(28px, 4vh, 44px)", opacity: 0.95, display: "flex", justifyContent: isMobile ? "center" : "flex-start" }}
          >
            <AnimatedLogoFull height={44} animate={!reducedMotion} />
          </div>
        ) : (
          <img
            src={entry.logoSrc}
            alt={entry.logoAlt}
            className={shouldAnimate ? "work-fade-up work-fade-up--mini" : ""}
            style={{
              width: "clamp(120px, 25vw, 200px)",
              height: "auto",
              filter: entry.logoMiniFilter,
              opacity: 0.9,
              marginBottom: "clamp(28px, 4vh, 44px)",
              ...(isMobile ? { display: "block", marginLeft: "auto", marginRight: "auto" } : {}),
            }}
          />
        )}

        <MetaGroup label="Role" value={entry.role} delay={0.35} animate={shouldAnimate} />
        <MetaGroup label="Duration" value={entry.duration} delay={0.45} animate={shouldAnimate} />
        <MetaGroup label="Tools" value={entry.tools} delay={0.55} animate={shouldAnimate} />
        <MetaGroup label="Team" value={entry.team} delay={0.65} animate={shouldAnimate} />
      </div>

      {/* Location badge */}
      {entry.location && (
        <span
          className="work-entry__location pointer-events-none absolute hidden items-center md:flex"
          style={{
            zIndex: 2,
            bottom: 72,
            left: "10%",
            gap: 8,
            fontSize: 12,
            fontWeight: 500,
            color: "rgba(255,255,255,0.4)",
            letterSpacing: "0.06em",
          }}
        >
          <span
            aria-hidden
            style={{
              width: 5,
              height: 5,
              borderRadius: "50%",
              background: "#34d399",
            }}
          />
          {entry.location}
        </span>
      )}

      {/* Bottom CTA — skipped when an entry has no ctaLabel/ctaUrl (e.g. the
          FieldFlow entry, where the mark + wordmark carry the identity on
          their own). */}
      {entry.ctaUrl && entry.ctaLabel && (
        <div
          className={`${
            shouldAnimate ? "work-fade-up work-fade-up--cta" : ""
          } absolute flex w-full justify-center px-6`}
          style={{ bottom: "clamp(32px, 8vh, 64px)", zIndex: 2 }}
        >
          <a
            href={entry.ctaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="work-cta"
            style={{
              display: "inline-block",
              padding: "16px 40px",
              fontSize: "clamp(11px, 1.2vw, 13px)",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.2em",
              color: "rgba(255,255,255,0.78)",
              border: "1.5px solid rgba(255,255,255,0.25)",
              borderRadius: 4,
              textDecoration: "none",
              background: "transparent",
              transition: "color 0.3s, border-color 0.3s, background 0.3s",
            }}
          >
            {entry.ctaLabel}
          </a>
        </div>
      )}
    </section>
  );
}

// ─── Metadata block ────────────────────────────────────────────────────────────
function MetaGroup({ label, value, delay, animate }) {
  return (
    <div
      className={animate ? "work-fade-up" : ""}
      style={{
        marginBottom: "clamp(20px, 3vh, 28px)",
        ...(animate ? { animationDelay: `${delay}s` } : {}),
      }}
    >
      <p
        style={{
          fontSize: "clamp(13px, 1.5vw, 16px)",
          fontWeight: 700,
          color: "rgba(255,255,255,0.95)",
          marginBottom: 6,
          letterSpacing: "0.01em",
        }}
      >
        {label}
      </p>
      <p
        style={{
          fontSize: "clamp(15px, 1.8vw, 19px)",
          fontWeight: 400,
          color: "rgba(255,255,255,0.6)",
          lineHeight: 1.5,
        }}
      >
        {value}
      </p>
    </div>
  );
}

