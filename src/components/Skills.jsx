import { useEffect, useRef, useState } from "react";
import useReducedMotion from "@/hooks/useReducedMotion";
import ScrollCue from "@/components/ui/ScrollCue";

// ─── Capability data ────────────────────────────────────────────────────────────
const capabilities = [
  {
    key: "ui",
    accent: "#0071e3",
    title: "UI Engineering",
    headline: "Interfaces that\nfeel alive.",
    description:
      "Polished, responsive interfaces with motion, accessibility, and real-world performance discipline.",
    skills: ["React", "JavaScript", "TypeScript", "Animation & Motion"],
    tools: ["Tailwind CSS", "Framer Motion", "Three.js", "React Three Fiber", "OGL"],
  },
  {
    key: "fullstack",
    accent: "#16a34a",
    title: "Full-Stack Delivery",
    headline: "From database\nto deploy.",
    description: "APIs, data modeling, and production-ready features end-to-end.",
    skills: ["Node.js / Express", "SQL & Databases", "REST APIs"],
    tools: ["PostgreSQL", "Firebase", "React Native", "Flutter", "Dart"],
  },
  {
    key: "quality",
    accent: "#d97706",
    title: "Quality & Craft",
    headline: "Code that holds\nup over time.",
    description:
      "Clean code, consistent standards, and UX polish that holds up over time.",
    skills: ["Git & Version Control", "Linting & Formatting", "CI / CD Pipelines"],
    tools: ["ESLint", "GitHub Actions", "Git"],
  },
  {
    key: "tooling",
    accent: "#7c3aed",
    title: "Tooling & Cloud",
    headline: "Ship fast.\nShip often.",
    description: "Clean dev workflows, build automation, and practical cloud deployment.",
    skills: ["Vite / Build Tools", "Azure Cloud", "Firebase Services"],
    tools: ["Python", "Vite", "Raspberry Pi"],
  },
];

// ─── Math utilities ─────────────────────────────────────────────────────────────
const clamp = (v, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, v));
const lerp = (a, b, t) => a + (b - a) * t;
const easeOut = (t) => 1 - Math.pow(1 - t, 4);
const easeIn = (t) => Math.pow(t, 4);

// ─── One capability slide — fully scroll-driven crossfade ─────────────────────
function CapabilitySlide({ cap, index, progress, isActive, isLast, total, scrollProgress }) {
  // Phase mapping (all derived from local scroll progress 0..1):
  //   0.00–0.18  enter:  title + overline slide in from left
  //   0.12–0.35  reveal: accent line grows, skills list staggers in
  //   0.18–0.38  desc:   description fades in
  //   0.30–0.50  tools:  pill row staggers in from right
  //   0.62–0.85  exit:   slide out to left (skipped for last)
  const enterP = clamp(progress / 0.18);
  const skillsP = clamp((progress - 0.12) / 0.23);
  const toolsP = clamp((progress - 0.30) / 0.20);
  const descP = clamp((progress - 0.18) / 0.20);
  const exitP = isLast ? 0 : clamp((progress - 0.62) / 0.23);

  const fadeIn = easeOut(enterP);
  const fadeOut = 1 - easeIn(exitP);
  const masterOpacity = fadeIn * fadeOut;

  const titleX =
    lerp(-120, 0, easeOut(enterP)) + (isLast ? 0 : lerp(0, -80, easeIn(exitP)));

  const counter = `${String(index + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;

  return (
    <div
      // The centering box shrinks from 100vh to ~68vh (centered above the
      // parked footer) as scrollProgress crosses 0.9 → 1.0. On mobile the
      // footer is taller relative to the viewport, so 32vh clearance keeps
      // the tools/pills row visible above it.
      className="absolute inset-x-0 top-0 flex items-center justify-center"
      style={{
        opacity: masterOpacity,
        pointerEvents: isActive ? "auto" : "none",
        bottom: `${lerp(0, 32, clamp((scrollProgress - 0.9) / 0.1))}vh`,
      }}
    >
      <div
        className="relative z-[1] mx-auto grid w-full max-w-[1080px] grid-cols-1 items-center gap-10 px-6 sm:px-12 md:grid-cols-2 md:gap-16 md:pl-20 md:pr-12"
      >
        {/* Left: typography block — slides in from the left */}
        <div style={{ transform: `translateX(${titleX}px)` }}>
          {/* Overline + counter */}
          <div
            className="mb-5 flex items-center gap-2.5"
            style={{
              opacity: clamp(fadeIn * 1.2) * fadeOut,
              transform: `translateX(${lerp(-40, 0, easeOut(enterP))}px)`,
            }}
          >
            <div
              aria-hidden
              className="h-2 w-2 rounded-full"
              style={{
                background: cap.accent,
                boxShadow: `0 0 12px 4px ${cap.accent}50`,
              }}
            />
            <span className="text-[11px] font-medium uppercase tracking-[0.3em] text-[var(--text-3)]">
              {counter}
            </span>
          </div>

          {/* Big headline */}
          <h3
            className="mb-4 whitespace-pre-line text-[40px] font-bold leading-[1.05] tracking-[-0.03em] text-[var(--text-1)] sm:text-[48px] md:text-[56px]"
          >
            {cap.headline}
          </h3>

          {/* Accent line — grows to full headline width as skills reveal */}
          <div
            aria-hidden
            className="mb-6 h-[3px] rounded-full"
            style={{
              background: cap.accent,
              width: `${easeOut(skillsP) * 100}%`,
            }}
          />

          {/* Description */}
          <p
            className="max-w-[36ch] text-[17px] leading-[1.6] text-[var(--text-2)]"
            style={{
              opacity: easeOut(descP) * fadeOut,
              transform: `translateX(${lerp(-30, 0, easeOut(descP))}px)`,
            }}
          >
            {cap.description}
          </p>
        </div>

        {/* Right: skills stack + tool pills */}
        <div className="flex flex-col gap-10" style={{ opacity: fadeOut }}>
          {/* Core skills */}
          <div>
            <p
              className="mb-4 text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--text-3)]"
              style={{ opacity: easeOut(skillsP) }}
            >
              Core Skills
            </p>
            <div className="flex flex-col">
              {cap.skills.map((skill, i) => {
                const stagger = i * 0.12;
                const sp = clamp((skillsP - stagger) / (1 - stagger));
                return (
                  <div
                    key={skill}
                    className="flex items-center gap-3 border-b border-[var(--card-border)] py-3"
                    style={{
                      opacity: easeOut(sp),
                      transform: `translateX(${lerp(60, 0, easeOut(sp))}px)`,
                    }}
                  >
                    <div
                      aria-hidden
                      className="h-1 w-1 flex-shrink-0 rounded-full opacity-70"
                      style={{ background: cap.accent }}
                    />
                    <span className="text-[17px] font-medium tracking-[-0.01em] text-[var(--text-1)]">
                      {skill}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Tools & frameworks */}
          <div>
            <p
              className="mb-3.5 text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--text-3)]"
              style={{ opacity: easeOut(toolsP) }}
            >
              Tools & Frameworks
            </p>
            <div className="flex flex-wrap gap-2">
              {cap.tools.map((tool, i) => {
                const stagger = i * 0.1;
                const tp = clamp((toolsP - stagger) / (1 - stagger));
                return (
                  <span
                    key={tool}
                    className="whitespace-nowrap rounded-full px-4 py-1.5 text-[13px] font-medium text-[var(--text-2)]"
                    style={{
                      opacity: easeOut(tp),
                      transform: `translateX(${lerp(40, 0, easeOut(tp))}px) scale(${lerp(0.92, 1, easeOut(tp))})`,
                      background: `${cap.accent}10`,
                      border: `1px solid ${cap.accent}25`,
                    }}
                  >
                    {tool}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Left-rail progress dots ────────────────────────────────────────────────────
// Top position is scroll-driven: 50vh (true viewport center) while the user is
// progressing through slides 1–3, easing to 40vh as the footer rises into view
// during the last ~10% of scroll. Keeps the dots balanced with the slide
// content, which makes the same shift.
function ScrollProgressDots({ activeIndex, count, scrollProgress }) {
  const footerOverlap = clamp((scrollProgress - 0.9) / 0.1);
  const topVh = lerp(50, 40, footerOverlap);
  return (
    <div
      className="absolute left-6 z-10 hidden -translate-y-1/2 flex-col gap-5 md:flex"
      style={{ top: `${topVh}vh` }}
    >
      {Array.from({ length: count }).map((_, i) => {
        const isActive = i === activeIndex;
        const isPast = i < activeIndex;
        return (
          <div
            key={i}
            className="rounded-full transition-all duration-300 ease-out"
            style={{
              width: isActive ? 10 : 6,
              height: isActive ? 10 : 6,
              background: isActive
                ? capabilities[i].accent
                : isPast
                  ? "var(--text-3)"
                  : "var(--card-border)",
              boxShadow: isActive ? `0 0 10px 3px ${capabilities[i].accent}40` : "none",
            }}
          />
        );
      })}
    </div>
  );
}

// ─── Reduced-motion fallback: stacked static list (no scroll mapping) ──────────
function SkillsStatic() {
  return (
    <section
      id="skills"
      aria-label="Skills and capabilities"
      className="relative w-full px-4 pb-20 pt-20 sm:px-6 sm:pt-24 md:px-8 md:pb-28 md:pt-28"
      style={{ background: "var(--bg-secondary)" }}
    >
      <div className="mx-auto w-full max-w-5xl">
        <div className="mb-12 md:mb-16">
          <h2 className="text-4xl font-bold tracking-tight text-[var(--text-1)] sm:text-5xl">
            Skills
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 sm:gap-x-20 sm:gap-y-14">
          {capabilities.map((cap) => (
            <div key={cap.key}>
              <h3 className="text-[28px] font-semibold leading-[1.12] tracking-[-0.025em] text-[var(--text-1)] sm:text-[32px]">
                {cap.title}
              </h3>
              <div
                aria-hidden
                className="mt-3 h-[3px] w-full rounded-full"
                style={{ background: cap.accent }}
              />
              <p className="mt-5 text-[16px] font-medium leading-[1.5] tracking-[-0.01em] text-[var(--text-1)]">
                {cap.skills.join("  ·  ")}
              </p>
              <p className="mt-4 max-w-[34ch] text-[15px] leading-[1.65] text-[var(--text-2)]">
                {cap.description}
              </p>
              <p className="mt-6 text-[13px] text-[var(--text-3)]">
                {cap.tools.join("  ·  ")}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Main scrollytelling section ────────────────────────────────────────────────
export default function Skills() {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return <SkillsStatic />;
  }

  return <SkillsScrollytelling />;
}

function SkillsScrollytelling() {
  const containerRef = useRef(null);
  const targetRef = useRef(0);
  const currentRef = useRef(0);
  const rafRef = useRef(null);
  const activeRef = useRef(false);
  // MOBILE-SWARM: scrollytelling — cache the scrollable distance so the
  // per-scroll path never reads window.innerHeight (which fluctuates with the
  // mobile address bar and desynced progress vs. the now-svh pinned frame).
  // Recomputed only on resize/orientationchange.
  const scrollableRef = useRef(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Mount intro: slide 0 builds out visually while the scrollbar stays at the
  // top of the page. We only animate `introProgress` (the per-slide visual
  // value) — no window.scrollTo — so the user lands at scrollY=0 with slide 0
  // gradually revealing itself. Slide 0's `effectiveProgress` takes the max
  // of `localProgress` (scroll-driven) and `introProgress`, so the intro
  // value caps the visual until the user's scroll catches up.
  //
  // Trade-off: because the scrollbar is at the top but slide 0 is already
  // built out, the user's first ~100vh of scroll won't visibly change
  // slide 0 (their localProgress has to climb past introProgress before
  // exit phases trigger). Accepted in exchange for a clean scrollbar
  // position on landing.
  const [introProgress, setIntroProgress] = useState(0);
  useEffect(() => {
    let raf;
    let cancelled = false;
    // 800ms delay so the App.jsx vertical slide-up settles before the
    // build-out begins — avoids two simultaneous motions on landing.
    const startTimer = setTimeout(() => {
      const target = 0.55;
      const startTime = performance.now();
      // 3.5s with quartic ease-out — very smooth, unhurried reveal.
      const duration = 3500;
      const easeOutCubic = (t) => 1 - Math.pow(1 - t, 4);

      function tick(now) {
        if (cancelled) return;
        const t = Math.min((now - startTime) / duration, 1);
        const eased = easeOutCubic(t);
        setIntroProgress(eased * target);
        if (t < 1) {
          raf = requestAnimationFrame(tick);
        }
      }
      raf = requestAnimationFrame(tick);
    }, 800);
    return () => {
      cancelled = true;
      clearTimeout(startTimer);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // Update scroll target. MOBILE-SWARM: scrollytelling — the desync bug was
  // reading window.innerHeight INSIDE the per-scroll handler: on iOS the
  // address-bar show/hide changes innerHeight mid-scroll, so progress jumped
  // even though the pinned (now svh) frame didn't move. Fix: cache the
  // scrollable distance (containerH − viewportH) and recompute it only on a
  // real resize / orientationchange (debounced via rAF). The per-scroll path
  // then reads ONLY getBoundingClientRect().top against that stable cache, so
  // the address bar can't desync it. innerHeight (not the svh child height) is
  // the correct denominator here so progress still reaches a true 1.0 at the
  // bottom of the scrub (matching the desktop baseline).
  useEffect(() => {
    let resizeRaf = null;

    const measure = () => {
      const el = containerRef.current;
      if (!el) return;
      const containerH = el.offsetHeight;
      const viewH = window.innerHeight;
      scrollableRef.current = Math.max(0, containerH - viewH);
    };

    const updateTarget = () => {
      const el = containerRef.current;
      if (!el) return;
      const scrollable = scrollableRef.current;
      if (scrollable <= 0) {
        targetRef.current = 0;
        return;
      }
      targetRef.current = clamp(-el.getBoundingClientRect().top / scrollable);
    };

    const onResize = () => {
      if (resizeRaf != null) cancelAnimationFrame(resizeRaf);
      resizeRaf = requestAnimationFrame(() => {
        measure();
        updateTarget();
      });
    };

    window.addEventListener("scroll", updateTarget, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("orientationchange", onResize);
    measure();
    updateTarget();

    return () => {
      window.removeEventListener("scroll", updateTarget);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
      if (resizeRaf != null) cancelAnimationFrame(resizeRaf);
    };
  }, []);

  // Smooth interpolation loop — lerps `current` toward `target` per frame.
  // Gated by IntersectionObserver so it idles when the section is off-screen.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return undefined;

    const tick = () => {
      const diff = targetRef.current - currentRef.current;
      currentRef.current += diff * 0.08;
      if (Math.abs(diff) < 0.0001) currentRef.current = targetRef.current;
      setScrollProgress(currentRef.current);
      if (activeRef.current) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        rafRef.current = null;
      }
    };

    const start = () => {
      if (rafRef.current != null) return;
      activeRef.current = true;
      rafRef.current = requestAnimationFrame(tick);
    };
    const stop = () => {
      activeRef.current = false;
      if (rafRef.current != null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) start();
        else stop();
      },
      { rootMargin: "200px 0px" },
    );
    io.observe(el);

    return () => {
      io.disconnect();
      stop();
    };
  }, []);

  const capCount = capabilities.length;
  const sliceSize = 1 / capCount;
  const activeIndex = Math.min(capCount - 1, Math.floor(scrollProgress * capCount));

  // Section header fades in at the very start of the scrub — or, on initial
  // mount, with the intro animation so the overline is present alongside
  // the first slide's build-out instead of waiting for scroll.

  return (
    <section
      ref={containerRef}
      id="skills"
      aria-label="Skills and capabilities"
      className="relative w-full"
      style={{
        height: `${capCount * 180 + 80}vh`,
        background: "var(--bg-secondary)",
      }}
    >
      {/* Sticky viewport — pins to top of screen while parent scrolls past.
          MOBILE-SWARM: scrollytelling — svh (smallest viewport) so the pinned
          frame doesn't clip when the mobile address bar is visible; the
          scroll math above caches its denominator so the bar can't desync it. */}
      <div className="sticky top-0 h-screen-svh w-full overflow-hidden">

        <ScrollProgressDots
          activeIndex={activeIndex}
          count={capCount}
          scrollProgress={scrollProgress}
        />

        {/* All capability slides stacked — crossfade via per-slide opacity.
            The first slide also tracks `introProgress` so it builds out on
            mount without requiring the user to scroll. Once scroll exceeds
            the intro value, scroll wins naturally. */}
        {capabilities.map((cap, i) => {
          const localStart = i * sliceSize;
          const localEnd = (i + 1) * sliceSize;
          const localProgress = clamp(
            (scrollProgress - localStart) / (localEnd - localStart),
          );
          const effectiveProgress =
            i === 0 ? Math.max(localProgress, introProgress) : localProgress;
          return (
            <CapabilitySlide
              key={cap.key}
              cap={cap}
              index={i}
              progress={effectiveProgress}
              isActive={i === activeIndex}
              isLast={i === capCount - 1}
              total={capCount}
              scrollProgress={scrollProgress}
            />
          );
        })}

        {/* Bottom scroll hint — fades out as user begins scrolling.
            Sits lower on mobile (just above the safe-area inset) so it clears
            the tools tags; restored to bottom-8 from the sm breakpoint up. */}
        <div
          className="absolute bottom-[calc(env(safe-area-inset-bottom)_+_0.75rem)] left-1/2 z-[5] -translate-x-1/2 text-[var(--text-3)] sm:bottom-8"
          style={{ opacity: clamp(1 - scrollProgress * 5) * 0.4 }}
        >
          <ScrollCue />
        </div>
      </div>
    </section>
  );
}
