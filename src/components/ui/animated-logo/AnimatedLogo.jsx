import { cn } from "@/lib/utils";

import MARK_DATA from "./_polygon-data.json";

/* ─── Timing ─────────────────────────────────────── */
const SWEEP_S = 3.2;
const PULSE_S = 2.8;
const MAX_DIST = 91.1;

/* ─── Animated Mark (diamond icon only) ──────────── */
export function AnimatedLogoMark({ size = 40, className, animate = true }) {
  const gradientId = `anim-dg-mark-${size}`;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 160 160"
      width={size}
      height={size}
      aria-hidden="true"
      className={cn("pointer-events-none", className)}
      style={{ overflow: "visible" }}
      shapeRendering="geometricPrecision"
    >
      <defs>
        <linearGradient id={gradientId} x1="0.1" y1="0" x2="0.85" y2="1">
          <stop offset="0%" className="ff-stop-0" />
          <stop offset="35%" className="ff-stop-1" />
          <stop offset="65%" className="ff-stop-2" />
          <stop offset="100%" className="ff-stop-3" />
        </linearGradient>
      </defs>

      <style>{`
        /* Stops read from --ff-stop-* CSS vars set by the consuming surface.
         * In this portfolio they're set inline on the FieldFlow Work entry
         * (coral → purple four-stop gradient). */
        .ff-stop-0 { stop-color: var(--ff-stop-0); }
        .ff-stop-1 { stop-color: var(--ff-stop-1); }
        .ff-stop-2 { stop-color: var(--ff-stop-2); }
        .ff-stop-3 { stop-color: var(--ff-stop-3); }

        /* Theme-aware stroke & contrast: stronger in light mode for definition */
        .ff-poly-group { stroke: rgba(0, 0, 0, 0.35); filter: saturate(1.3) contrast(1.15); }
        :root.dark .ff-poly-group { stroke: rgba(0, 0, 0, 0.22); filter: none; }

        ${animate ? `
        /* ── Parent-level shimmer: 1 filter paint instead of 159 ── */
        @keyframes ffShimmer {
          0%, 100% { filter: brightness(1) saturate(1); }
          35%      { filter: brightness(1.8) saturate(1.4); }
          50%      { filter: brightness(1.4) saturate(1.15); }
        }
        /* ── Per-polygon 3D flip (no filter — GPU-friendly) ── */
        @keyframes ffFlip {
          0%       { transform: perspective(300px) rotateY(0deg)   rotateX(0deg)  scale(1); }
          15%      { transform: perspective(300px) rotateY(55deg)  rotateX(15deg) scale(1.08); }
          35%      { transform: perspective(300px) rotateY(-25deg) rotateX(-8deg) scale(0.95); }
          50%      { transform: perspective(300px) rotateY(12deg)  rotateX(4deg)  scale(1.02); }
          65%, 100%{ transform: perspective(300px) rotateY(0deg)   rotateX(0deg)  scale(1); }
        }
        /* ── Per-polygon opacity pulse ── */
        @keyframes ffPulse {
          0%, 100% { opacity: 1; }
          50%      { opacity: 0.45; }
        }
        .ff-animations-paused .ff-anim-group,
        .ff-animations-paused polygon {
          animation-play-state: paused !important;
        }` : ""}
      `}</style>

      <g
        className={cn(animate ? "ff-anim-group" : undefined, "ff-poly-group")}
        fill={`url(#${gradientId})`}
        strokeWidth={animate ? 0.4 : 0.3}
        vectorEffect="non-scaling-stroke"
        style={animate ? {
          transformOrigin: "80px 80px",
          animation: `ffShimmer ${SWEEP_S}s ease-in-out infinite`,
        } : undefined}
      >
        {MARK_DATA.map((p, i) => {
          if (!animate) {
            return (
              <polygon
                key={i}
                points={p.points}
                opacity={p.opacity}
                {...(p.transform ? { transform: p.transform } : {})}
              />
            );
          }

          const sweepDelay = -p.angle * SWEEP_S;
          const pulseDelay = -(p.dist / MAX_DIST) * PULSE_S;

          const poly = (
            <polygon
              key={i}
              points={p.points}
              opacity={p.opacity}
              style={{
                transformOrigin: "center",
                transformBox: "fill-box",
                animation: `ffFlip ${SWEEP_S}s ease-in-out ${sweepDelay.toFixed(2)}s infinite, ffPulse ${PULSE_S}s ease-in-out ${pulseDelay.toFixed(2)}s infinite`,
              }}
            />
          );

          if (p.transform) {
            return (
              <g key={i} transform={p.transform}>
                {poly}
              </g>
            );
          }
          return poly;
        })}
      </g>
    </svg>
  );
}

/* ─── Wordmark only — "Field" + "Flow" (Flow uses the brand gradient) ─
 * "Flow" is painted with the same four-stop linear-gradient as the polygon
 * mark, clipped to the glyph shapes via background-clip:text. That keeps the
 * wordmark visually tied to the mark instead of locking it to a single stop.
 * Falls back to coral if the consuming surface hasn't set the --ff-stop-*
 * variables, so the wordmark is never invisible on a stop-less background.
 */
export function AnimatedLogoWordmark({ fontSize = 26, className }) {
  return (
    <span
      className={cn("font-bold tracking-tight leading-none", className)}
      style={{ fontSize, letterSpacing: "-0.03em", display: "inline-block" }}
    >
      <span style={{ color: "rgba(255,255,255,0.95)" }}>Field</span>
      <span
        style={{
          backgroundImage:
            "linear-gradient(90deg, var(--ff-stop-0, #FDBA74) 0%, var(--ff-stop-1, #F97066) 35%, var(--ff-stop-2, #D946EF) 65%, var(--ff-stop-3, #A855F7) 100%)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
        }}
      >
        Flow
      </span>
    </span>
  );
}

/* ─── Animated Full Logo (diamond + gradient wordmark) ── */
export function AnimatedLogoFull({ height = 36, className, animate = true }) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <AnimatedLogoMark size={height} animate={animate} />
      <AnimatedLogoWordmark fontSize={height * 0.72} />
    </span>
  );
}
