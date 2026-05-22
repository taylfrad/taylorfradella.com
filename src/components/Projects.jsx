import { lazy, memo, Suspense, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { projectsData } from "../data/projectsData";
import useReducedMotion from "@/hooks/useReducedMotion";

const TaylCraftVideo = lazy(() => import("@/components/ui/taylcraft-video"));
const WorklyVideo = lazy(() => import("@/components/ui/workly-video"));
const TaylorVideo = lazy(() => import("@/components/ui/taylor-video"));
const LionsDenVideo = lazy(() => import("@/components/ui/lionsden-video"));
const SweetSpotVideo = lazy(() => import("@/components/ui/sweetspot-video"));
const FradellaDevVideo = lazy(() => import("@/components/ui/fradelladev-video"));
const FieldFlowVideo = lazy(() => import("@/components/ui/fieldflow-video"));

// Prefetch ProjectDetail chunk on hover so it's cached before the user clicks.
const prefetchProjectDetail = () => import("./ProjectDetail");

// ─── Scroll-reveal hook — IntersectionObserver, fires once ─────────────────────
function useReveal(threshold = 0.1) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold, rootMargin: "0px 0px -60px 0px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

// ─── Grid placement maps — explicit cells, zero auto-flow ──────────────────────
// 3-column layout (desktop). Cells keyed by project.id.
//   ┌──────────────┬──────────────┬──────────────┐
//   │              │              │  FieldFlow   │ 300px
//   │  Portfolio   │  Portfolio   ├──────────────┤
//   │   (hero)     │   (hero)     │ fradella.dev │ 220px
//   ├──────────────┼──────────────┴──────────────┤
//   │              │                             │ 260px
//   │   Workly     │    Lions Den (wide)         │
//   │              ├──────────────┬──────────────┤
//   │              │  SweetSpot   │  TaylCraft   │ 220px
//   └──────────────┴──────────────┴──────────────┘
const GRID_3COL = {
  cols: "repeat(3, 1fr)",
  rows: "300px 220px 260px 220px",
  cells: {
    1: { gridColumn: "1 / 3", gridRow: "1 / 3", featured: true },
    7: { gridColumn: "3 / 4", gridRow: "1 / 2" },
    6: { gridColumn: "3 / 4", gridRow: "2 / 3" },
    4: { gridColumn: "1 / 2", gridRow: "3 / 5" },
    2: { gridColumn: "2 / 4", gridRow: "3 / 4", featured: true },
    3: { gridColumn: "2 / 3", gridRow: "4 / 5" },
    5: { gridColumn: "3 / 4", gridRow: "4 / 5" },
  },
};

// 2-column layout (tablet/narrow).
const GRID_2COL = {
  cols: "repeat(2, 1fr)",
  rows: "460px 280px 260px 300px 200px",
  cells: {
    1: { gridColumn: "1 / 3", gridRow: "1 / 2", featured: true },
    7: { gridColumn: "1 / 2", gridRow: "2 / 3" },
    2: { gridColumn: "2 / 3", gridRow: "2 / 4", featured: true },
    6: { gridColumn: "1 / 2", gridRow: "3 / 4" },
    4: { gridColumn: "1 / 2", gridRow: "4 / 5" },
    3: { gridColumn: "2 / 3", gridRow: "4 / 6" },
    5: { gridColumn: "1 / 2", gridRow: "5 / 6" },
  },
};

// 1-column layout (phone). Featured cards get taller rows.
const GRID_1COL = {
  cols: "1fr",
  rows: "340px 340px 220px 220px 220px 220px 220px",
  cells: {
    1: { gridColumn: "1 / 2", gridRow: "1 / 2", featured: true },
    2: { gridColumn: "1 / 2", gridRow: "2 / 3", featured: true },
    4: { gridColumn: "1 / 2", gridRow: "3 / 4" },
    7: { gridColumn: "1 / 2", gridRow: "4 / 5" },
    6: { gridColumn: "1 / 2", gridRow: "5 / 6" },
    3: { gridColumn: "1 / 2", gridRow: "6 / 7" },
    5: { gridColumn: "1 / 2", gridRow: "7 / 8" },
  },
};

// Reveal stagger order — closer to natural reading order so the eye follows.
const REVEAL_ORDER_3 = [1, 7, 6, 4, 2, 3, 5];
const REVEAL_ORDER_2 = [1, 7, 2, 6, 4, 3, 5];
const REVEAL_ORDER_1 = [1, 2, 4, 7, 6, 3, 5];

// Parse "3 / 5" → row span 2. Used to detect cards that occupy multiple grid
// rows (i.e. taller than the 220px–300px default cell) so they can adopt a
// larger title size without using up empty vertical space.
function getRowSpan(gridRow) {
  if (!gridRow) return 1;
  const parts = gridRow.split("/").map((s) => parseInt(s.trim(), 10));
  if (parts.length !== 2 || parts.some(Number.isNaN)) return 1;
  return Math.max(1, parts[1] - parts[0]);
}

// ─── Bento card ────────────────────────────────────────────────────────────────
const BentoCard = memo(function BentoCard({ project, featured, tall, delay, isMobile }) {
  const [hovered, setHovered] = useState(false);
  const [inView, setInView] = useState(false);
  const cardRef = useRef(null);
  const [revealRef, visible] = useReveal(0.08);
  const reducedMotion = useReducedMotion();
  const navigate = useNavigate();

  // On mobile, auto-play videos when the card is in the viewport
  // (no hover on touch devices). Desktop uses hover as before.
  useEffect(() => {
    if (!isMobile || !cardRef.current) return undefined;
    const obs = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.5 },
    );
    obs.observe(cardRef.current);
    return () => obs.disconnect();
  }, [isMobile]);

  const videoPlaying = isMobile ? inView : hovered;

  const transform = (() => {
    if (!visible) return "translateY(28px)";
    if (reducedMotion) return "none";
    return hovered ? "translateY(-4px)" : "translateY(0)";
  })();

  const onCardClick = () => {
    navigate(`/project/${project.id}`, { state: { scrollY: window.scrollY } });
  };

  // Per-project gradient: stop[0] sits at the bottom (under the title for
  // contrast), stop[1] fills the upper half. Falls back to a single-color
  // background if a project hasn't been given a gradientColors pair.
  const [c1, c2] = (() => {
    const stops = project.gradientColors || [project.accentColor];
    return [stops[0], stops[1] || stops[0]];
  })();
  // Two-layer background. The first (top in CSS order = painted on top) is a
  // universal dark vignette so white text in the content block lands on at
  // least ~5.5:1 contrast regardless of how light the project's accent is
  // (coral, bright green, etc. would otherwise be marginal). The second
  // (underneath) is the project's two-stop color gradient.
  const cardBackground = `linear-gradient(to top, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0.35) 30%, rgba(0,0,0,0.12) 55%, transparent 70%), linear-gradient(to top, ${c1} 30%, ${c2} 100%)`;

  return (
    <div
      ref={(el) => {
        revealRef.current = el;
        cardRef.current = el;
      }}
      role="link"
      tabIndex={0}
      aria-label={`View ${project.title} project details`}
      onClick={onCardClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onCardClick();
        }
      }}
      onMouseEnter={() => {
        setHovered(true);
        prefetchProjectDetail();
      }}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      style={{
        position: "relative",
        height: "100%",
        width: "100%",
        borderRadius: 22,
        overflow: "hidden",
        cursor: "pointer",
        opacity: visible ? 1 : 0,
        transform,
        transition: `opacity 0.7s cubic-bezier(0.25,0.1,0.25,1) ${delay}ms, transform 0.5s cubic-bezier(0.25,0.1,0.25,1) ${delay}ms, box-shadow 0.45s cubic-bezier(0.25,0.1,0.25,1)`,
        boxShadow: hovered
          ? `0 24px 64px ${project.accentColor}22, 0 0 0 1px ${project.accentColor}30`
          : "0 1px 4px rgba(0,0,0,0.06), 0 0 0 1px var(--card-border)",
        background: cardBackground,
      }}
    >

      {/* Project videos — hover on desktop, auto-play on mobile when in view */}
      {project.id === 1 && (
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 3,
            opacity: videoPlaying ? 1 : 0,
            transition: "opacity 0.55s cubic-bezier(0.4, 0, 0.2, 1)",
            pointerEvents: "none",
          }}
        >
          <Suspense fallback={null}>
            <TaylorVideo playing={videoPlaying} />
          </Suspense>
        </div>
      )}
      {project.id === 2 && (
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 3,
            opacity: videoPlaying ? 1 : 0,
            transition: "opacity 0.55s cubic-bezier(0.4, 0, 0.2, 1)",
            pointerEvents: "none",
          }}
        >
          <Suspense fallback={null}>
            <LionsDenVideo playing={videoPlaying} />
          </Suspense>
        </div>
      )}
      {project.id === 3 && (
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 3,
            opacity: videoPlaying ? 1 : 0,
            transition: "opacity 0.55s cubic-bezier(0.4, 0, 0.2, 1)",
            pointerEvents: "none",
          }}
        >
          <Suspense fallback={null}>
            <SweetSpotVideo playing={videoPlaying} />
          </Suspense>
        </div>
      )}
      {project.id === 4 && (
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 3,
            opacity: videoPlaying ? 1 : 0,
            transition: "opacity 0.55s cubic-bezier(0.4, 0, 0.2, 1)",
            pointerEvents: "none",
          }}
        >
          <Suspense fallback={null}>
            <WorklyVideo playing={videoPlaying} />
          </Suspense>
        </div>
      )}
      {project.id === 5 && (
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 3,
            opacity: videoPlaying ? 1 : 0,
            transition: "opacity 0.55s cubic-bezier(0.4, 0, 0.2, 1)",
            pointerEvents: "none",
          }}
        >
          <Suspense fallback={null}>
            <TaylCraftVideo playing={videoPlaying} />
          </Suspense>
        </div>
      )}
      {project.id === 6 && (
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 3,
            opacity: videoPlaying ? 1 : 0,
            transition: "opacity 0.55s cubic-bezier(0.4, 0, 0.2, 1)",
            pointerEvents: "none",
          }}
        >
          <Suspense fallback={null}>
            <FradellaDevVideo playing={videoPlaying} />
          </Suspense>
        </div>
      )}
      {project.id === 7 && (
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 3,
            opacity: videoPlaying ? 1 : 0,
            transition: "opacity 0.55s cubic-bezier(0.4, 0, 0.2, 1)",
            pointerEvents: "none",
          }}
        >
          <Suspense fallback={null}>
            <FieldFlowVideo playing={videoPlaying} />
          </Suspense>
        </div>
      )}

      {/* Accent glow at the base on hover — adds depth without glass-on-glass */}
      {project.id > 7 && (
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(ellipse at 50% 90%, ${project.accentColor}38 0%, transparent 65%)`,
            opacity: hovered ? 1 : 0,
            transition: "opacity 0.5s ease",
            pointerEvents: "none",
          }}
        />
      )}

      {/* Content */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: featured ? "36px 36px" : "24px 24px",
          zIndex: 2,
          // Fade out content when video is playing (hover or in-view on mobile)
          ...(project.id <= 7
            ? {
                opacity: videoPlaying ? 0 : 1,
                transition: "opacity 0.45s cubic-bezier(0.4, 0, 0.2, 1)",
              }
            : {}),
        }}
      >
        <p
          style={{
            // Slightly smaller font on narrow cards so long roles like
            // "FRONTEND DEVELOPER · SENIOR CAPSTONE" stay on a single line.
            fontSize: featured ? 10 : 9,
            fontWeight: 500,
            // Tighter letter-spacing on non-featured to recover horizontal
            // room — 0.3em was inflating roles past available width.
            letterSpacing: featured ? "0.3em" : "0.22em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.6)",
            marginBottom: 8,
            // Truncation applies only to non-featured cards (where roles
            // really can't fit). Featured cards have the room — let them
            // wrap to two lines on the unusual chance a role overflows,
            // rather than chopping mid-word.
            ...(featured
              ? {}
              : {
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }),
          }}
        >
          {project.role}
        </p>
        <h3
          style={{
            // Three-tier sizing: featured (36) > tall non-featured (32) >
            // standard non-featured (24). Tall cards span multiple grid
            // rows, so they have the vertical room for larger type.
            fontSize: featured ? 36 : tall ? 32 : 24,
            fontWeight: 700,
            letterSpacing: "-0.02em",
            lineHeight: 1.12,
            color: "#fff",
            marginBottom: featured ? 10 : 6,
            // Cap titles at 2 lines so an unusually long title can't push
            // the bottom row of the card out of the layout. Anything past
            // 2 lines truncates with an ellipsis.
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {project.title}
        </h3>
        {featured && (
          <p
            style={{
              fontSize: 14,
              lineHeight: 1.55,
              color: "rgba(255,255,255,0.72)",
              maxWidth: 520,
              marginBottom: 16,
              // Cap descriptions at 3 lines so longer copy doesn't crowd
              // the tag row or push past the card bottom.
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {project.description}
          </p>
        )}
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          {project.tags.slice(0, featured ? 4 : 2).map((tag) => (
            <span
              key={tag}
              style={{
                // Smaller font + tighter padding on non-featured cards so the
                // bottom row stays on a single line even at the narrowest
                // grid width.
                fontSize: featured ? 10 : 9,
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                padding: featured ? "4px 10px" : "3px 8px",
                borderRadius: 4,
                color: "rgba(255,255,255,0.9)",
                background: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.1)",
                whiteSpace: "nowrap",
              }}
            >
              {tag}
            </span>
          ))}
          <div style={{ flex: 1 }} />
          <div
            aria-hidden
            style={{
              width: 34,
              height: 34,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.14)",
              border: "1px solid rgba(255,255,255,0.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              transform: hovered ? "translateX(4px)" : "none",
              transition: "transform 0.3s cubic-bezier(0.25,0.1,0.25,1)",
            }}
          >
            <ArrowRight size={14} strokeWidth={2.5} />
          </div>
        </div>
      </div>
    </div>
  );
});


// ─── Section header — reused, matches Skills section ───────────────────────────
function SectionHeader({ count }) {
  const [ref, visible] = useReveal(0.2);
  return (
    <div
      ref={ref}
      className="relative mb-14 flex items-end justify-between"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: "opacity 0.7s cubic-bezier(0.25,0.1,0.25,1), transform 0.7s cubic-bezier(0.25,0.1,0.25,1)",
      }}
    >
      <div>
        <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.32em] text-[var(--text-tertiary)]">
          Selected Work
        </p>
        <h2 className="text-4xl font-bold tracking-tight text-[var(--text-primary)] sm:text-5xl">
          Projects
        </h2>
        <div className="mt-3 h-[2px] w-full rounded-full bg-[var(--text-tertiary)]" aria-hidden />
      </div>
      <div className="hidden select-none text-right md:block" aria-hidden>
        <p className="text-[72px] font-bold leading-none tracking-tighter text-[var(--card-border)]">
          {String(count).padStart(2, "0")}
        </p>
        <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[var(--border-color)]">
          Projects
        </p>
      </div>
    </div>
  );
}

// ─── Main section ──────────────────────────────────────────────────────────────
export default function Projects() {
  // Pick layout based on viewport width. Resize-aware so rotating tablets is fine.
  const [cols, setCols] = useState(() => {
    if (typeof window === "undefined") return 3;
    const w = window.innerWidth;
    if (w <= 600) return 1;
    if (w <= 900) return 2;
    return 3;
  });
  useEffect(() => {
    const mqSmall = window.matchMedia("(max-width: 600px)");
    const mqMedium = window.matchMedia("(max-width: 900px)");
    const update = () => {
      if (mqSmall.matches) setCols(1);
      else if (mqMedium.matches) setCols(2);
      else setCols(3);
    };
    mqSmall.addEventListener("change", update);
    mqMedium.addEventListener("change", update);
    return () => {
      mqSmall.removeEventListener("change", update);
      mqMedium.removeEventListener("change", update);
    };
  }, []);

  const layout = cols === 1 ? GRID_1COL : cols === 2 ? GRID_2COL : GRID_3COL;
  const revealOrder = cols === 1 ? REVEAL_ORDER_1 : cols === 2 ? REVEAL_ORDER_2 : REVEAL_ORDER_3;

  const projectMap = {};
  projectsData.forEach((p) => {
    projectMap[p.id] = p;
  });

  return (
    <section
      aria-label="Selected projects"
      className="relative w-full px-4 pb-20 pt-20 sm:px-6 sm:pt-24 md:px-8 md:pb-28 md:pt-28"
      style={{ background: "var(--bg-secondary)", overflow: "clip" }}
    >
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 md:px-8">
        <SectionHeader count={projectsData.length} />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: layout.cols,
            gridTemplateRows: layout.rows,
            gap: 12,
          }}
        >
          {revealOrder.map((id, idx) => {
            const project = projectMap[id];
            if (!project) return null;
            const cell = layout.cells[id];
            if (!cell) return null;
            return (
              <div
                key={id}
                style={{
                  gridColumn: cell.gridColumn,
                  gridRow: cell.gridRow,
                  minHeight: 0,
                }}
              >
                {/* Link wrapper kept for crawlers and middle-click; click is
                    handled on the card via navigate() so we preserve scrollY. */}
                <Link
                  to={`/project/${project.id}`}
                  onClick={(e) => e.preventDefault()}
                  className="block h-full w-full no-underline"
                  tabIndex={-1}
                  aria-hidden
                >
                  <BentoCard
                    project={project}
                    featured={!!cell.featured}
                    // Cards that span more than one grid row get the
                    // larger title size (see fontSize tier in BentoCard).
                    tall={getRowSpan(cell.gridRow) > 1}
                    delay={idx * 70}
                    isMobile={cols === 1}
                  />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
