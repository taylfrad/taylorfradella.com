// Shared scroll-down hint: a "Scroll" label above an animated mouse with a
// bouncing wheel-dot and a chevron. Used by the hero, skills, and project-detail
// pages so the scroll prompt is identical site-wide.
//
// Decorative (aria-hidden) — wrap in a button if it must be interactive. Uses
// currentColor for every stroke/fill/text, so the parent controls color, hover,
// and opacity (e.g. a fading motion value or a theme token).
export default function ScrollCue({ label = "Scroll", className = "", style }) {
  return (
    <span
      className={`flex flex-col items-center gap-1.5 ${className}`}
      style={style}
      aria-hidden
    >
      <span className="text-[11px] font-medium uppercase tracking-[0.15em]">{label}</span>
      <svg width="16" height="24" viewBox="0 0 16 24" fill="none" style={{ opacity: 0.5 }}>
        <rect x="3.5" y="0.5" width="9" height="15" rx="4.5" stroke="currentColor" strokeWidth="1" />
        <circle cx="8" cy="5.5" r="1.5" fill="currentColor">
          <animate attributeName="cy" values="5;10;5" dur="2s" repeatCount="indefinite" />
        </circle>
        <path d="M4 19l4 4 4-4" stroke="currentColor" strokeWidth="1" fill="none" />
      </svg>
    </span>
  );
}
