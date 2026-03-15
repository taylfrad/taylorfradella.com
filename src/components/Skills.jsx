import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

// ─── Capability data ────────────────────────────────────────────────────────────
const capabilities = [
  {
    key: "ui",
    accent: "#0071e3",
    title: "UI Engineering",
    description:
      "Polished, responsive interfaces with motion, accessibility, and real-world performance discipline.",
    skills: ["React", "JavaScript", "TypeScript", "Animation & Motion"],
    tools: ["Tailwind CSS", "Framer Motion", "Three.js", "React Three Fiber", "OGL"],
  },
  {
    key: "fullstack",
    accent: "#16a34a",
    title: "Full-Stack Delivery",
    description:
      "APIs, data modeling, and production-ready features end-to-end.",
    skills: ["Node.js / Express", "SQL & Databases", "REST APIs"],
    tools: ["PostgreSQL", "Firebase", "React Native", "Flutter", "Dart"],
  },
  {
    key: "quality",
    accent: "#d97706",
    title: "Quality & Craft",
    description:
      "Clean code, consistent standards, and UX polish that holds up over time.",
    skills: ["Git & Version Control", "Linting & Formatting", "CI / CD Pipelines"],
    tools: ["ESLint", "GitHub Actions", "Git"],
  },
  {
    key: "tooling",
    accent: "#7c3aed",
    title: "Tooling & Cloud",
    description:
      "Clean dev workflows, build automation, and practical cloud deployment.",
    skills: ["Vite / Build Tools", "Azure Cloud", "Firebase Services"],
    tools: ["Python", "Vite", "Raspberry Pi"],
  },
];

// ─── Scroll-driven fade — matches the ProjectRow pattern that works reliably ──
function useScrollFade(ref, reducedMotion) {
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
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

// ─── Single capability block ────────────────────────────────────────────────
function CapabilityBlock({ cap, reducedMotion }) {
  const ref = useRef(null);
  const { opacity, y } = useScrollFade(ref, reducedMotion);

  return (
    <motion.div ref={ref} className="relative" style={{ opacity, y }}>
      <div className="inline-flex flex-col">
        <h3
          className="text-[28px] font-semibold leading-[1.12] tracking-[-0.025em] text-[var(--text-primary)] sm:text-[34px]"
        >
          {cap.title}
        </h3>

        {/* Accent bar — spans title width */}
        <div
          className="mt-3 h-[3px] w-full rounded-full"
          style={{ background: cap.accent }}
        />
      </div>

      {/* Skills as a confident inline declaration */}
      <p
        className="mt-5 text-[16px] font-medium leading-[1.5] tracking-[-0.01em] text-[var(--text-primary)]"
      >
        {cap.skills.join("  ·  ")}
      </p>

      <p
        className="mt-4 max-w-[34ch] text-[15px] leading-[1.65] text-[var(--text-secondary)]"
      >
        {cap.description}
      </p>

      <p
        className="mt-6 text-[13px] text-[var(--text-tertiary)]"
      >
        {cap.tools.join("  ·  ")}
      </p>
    </motion.div>
  );
}

// ─── Section ────────────────────────────────────────────────────────────────
export default function Skills() {
  const reducedMotion = useReducedMotion();
  const headerRef = useRef(null);
  const headerFade = useScrollFade(headerRef, reducedMotion);

  return (
    <section
      id="skills"
      aria-label="Skills and capabilities"
      className="relative w-full overflow-hidden px-4 pb-20 pt-20 sm:px-6 sm:pt-24 md:px-8 md:pb-28 md:pt-28"
      style={{ background: "var(--bg-secondary)" }}
    >
      <div className="mx-auto w-full max-w-5xl">
        {/* ── Editorial header ────────────────────────────────────────── */}
        <motion.div
          ref={headerRef}
          className="relative mb-12 flex items-end justify-between md:mb-16"
          style={{ opacity: headerFade.opacity, y: headerFade.y }}
        >
          <div>
            <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.32em] text-[var(--text-tertiary)]">
              Capabilities
            </p>
            <h2 className="text-4xl font-bold tracking-tight text-[var(--text-primary)] sm:text-5xl">
              Skills
            </h2>
            <div
              className="mt-3 h-[2px] w-full rounded-full bg-[var(--text-tertiary)]"
              aria-hidden
            />
          </div>
          <div className="hidden select-none text-right md:block" aria-hidden>
            <p className="text-[72px] font-bold leading-none tracking-tighter text-[var(--card-border)]">
              {String(capabilities.length).padStart(2, "0")}
            </p>
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[var(--border-color)]">
              Capabilities
            </p>
          </div>
        </motion.div>

        {/* ── Capability grid ───────────────────────────────────────────── */}
        <div
          className="grid grid-cols-1 gap-10 sm:grid-cols-2 sm:gap-x-20 sm:gap-y-12"
        >
          {capabilities.map((cap) => (
            <CapabilityBlock
              key={cap.key}
              cap={cap}
              reducedMotion={reducedMotion}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
