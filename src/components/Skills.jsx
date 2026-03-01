import { motion, useReducedMotion } from "framer-motion";
import { Cloud, Code2, Gauge, Layers3 } from "lucide-react";
import { useEffect, useState } from "react";

import GlassSurface from "@/components/surfaces/GlassSurface";
import useIntersectionObserver from "@/hooks/useIntersectionObserver";

const capabilityCards = [
  {
    key: "ui_perf",
    icon: Code2,
    title: "UI Engineering",
    subtitle:
      "Polished, responsive interfaces with motion, accessibility, and real-world performance discipline.",
    pills: ["React", "TypeScript", "JavaScript", "Accessibility"],
  },
  {
    key: "fullstack",
    icon: Layers3,
    title: "Full-Stack Delivery",
    subtitle: "APIs, data modeling, and production-ready features end-to-end.",
    pills: ["Node.js", "SQL", "REST APIs"],
  },
  {
    key: "quality",
    icon: Gauge,
    title: "Quality & Maintainability",
    subtitle:
      "Clean code, consistent standards, and UX polish that holds up over time.",
    pills: ["ESLint", "Prettier", "Testing", "Git Actions"],
  },
  {
    key: "tooling",
    icon: Cloud,
    title: "Tooling & Cloud",
    subtitle: "Clean workflows, automation, and practical cloud usage.",
    pills: ["CI/CD", "Git", "Azure"],
  },
];

const cardsContainerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const cardRevealVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

export default function Skills() {
  const [containerRef, isVisible] = useIntersectionObserver({ threshold: 0.2 });
  const [hasBeenVisible, setHasBeenVisible] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (isVisible) setHasBeenVisible(true);
  }, [isVisible]);

  return (
    <section
      id="skills"
      ref={containerRef}
      className="relative flex w-full flex-col items-center justify-center px-0 pb-6 pt-4 md:pb-8 md:pt-6 lg:pb-10 lg:pt-8"
    >
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 md:px-8">
        <div className="w-fit">
          <h2 className="text-left text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Skills
          </h2>
          <div className="mt-2 h-0.5 w-full bg-white/40 rounded-full" aria-hidden />
        </div>

        <motion.div
          variants={cardsContainerVariants}
          initial="hidden"
          animate={isVisible || hasBeenVisible ? "visible" : "hidden"}
          className="mt-8 grid auto-rows-fr grid-cols-1 items-stretch gap-4 md:grid-cols-2 lg:grid-cols-4"
        >
          {capabilityCards.map((card) => (
            <motion.div
              key={card.key}
              variants={cardRevealVariants}
              whileHover={
                reducedMotion
                  ? undefined
                  : { y: -2, transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] } }
              }
              className="h-full"
            >
              <GlassSurface
                variant="card"
                className="h-full min-h-[250px] border-white/10 bg-background/20 p-4 backdrop-blur-2xl transition-colors duration-200 ease-out hover:bg-background/28 sm:p-5"
              >
                <CapabilityCardInner card={card} />
              </GlassSurface>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function CapabilityCardInner({ card }) {
  const Icon = card.icon;

  return (
    <div className="flex h-full flex-col">
      <div>
        <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border/70 bg-background/30">
          <Icon className="h-5 w-5 text-foreground/80" />
        </div>

        <h3 className="text-sm font-semibold tracking-tight text-foreground md:text-base">
          {card.title}
        </h3>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
          {card.subtitle}
        </p>
      </div>

      <div className="mt-auto flex flex-wrap justify-center gap-2 pt-4">
        {card.pills.map((pill) => (
          <span
            key={pill}
            className="rounded-full border border-border/70 bg-background/35 px-3 py-1.5 text-[12.5px] text-foreground/80 transition-colors duration-200 hover:border-border hover:text-foreground"
          >
            {pill}
          </span>
        ))}
      </div>
    </div>
  );
}
