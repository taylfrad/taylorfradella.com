import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

const AVATAR_SRC = "/images/taylor-avatar.jpg";

export default function About() {
  const reducedMotion = useReducedMotion();
  const ref = useRef(null);
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

  return (
    <section
      aria-label="About Taylor Fradella"
      className="relative w-full px-4 pb-20 pt-0 sm:px-6 md:px-8 md:pb-28"
      style={{ background: "var(--bg-secondary)" }}
    >
      <motion.div
        ref={ref}
        className="mx-auto flex w-full max-w-3xl flex-col items-center text-center"
        style={{ opacity, y }}
      >
        <img
          src={AVATAR_SRC}
          alt="Taylor Fradella"
          width={120}
          height={120}
          loading="lazy"
          decoding="async"
          className="mb-8 h-[120px] w-[120px] rounded-full object-cover shadow-lg"
          style={{ border: "3px solid var(--border-color)" }}
        />

        <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.32em] text-[var(--text-tertiary)]">
          About Me
        </p>
        <h2 className="mb-6 text-3xl font-bold tracking-tight text-[var(--text-primary)] sm:text-4xl">
          Taylor Fradella
        </h2>

        <p className="max-w-[52ch] text-[16px] leading-relaxed text-[var(--text-secondary)] sm:text-[17px]">
          I&apos;m a Computer Science student at Southeastern Louisiana University
          with a passion for designing and building great digital experiences.
          Frontend development is where I feel most at home, but I enjoy working
          across the full stack just as much — whether that&apos;s websites, iOS apps,
          or anything in between. A lot of my inspiration comes from Apple — I
          believe great software should not only look beautiful but perform
          flawlessly, and it should be usable by everyone, not just the tech-savvy.
          At the end of the day, I want to build things that people genuinely
          enjoy using.
        </p>
      </motion.div>
    </section>
  );
}
