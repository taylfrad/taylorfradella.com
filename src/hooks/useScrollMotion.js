import { useRef } from "react";
import { useScroll, useTransform } from "framer-motion";
import useReducedMotion from "./useReducedMotion";

/**
 * Scroll-linked motion helper.
 *
 * Drives opacity / translateY (and optionally scale) from scroll progress so that:
 * - Motion only updates while the user is scrolling
 * - Reverses naturally when scrolling back up
 * - Respects prefers-reduced-motion (returns static values)
 *
 * Uses direct useTransform (no useSpring) — scroll-linked values are already
 * smooth because they follow the user's finger/wheel. Springs add per-frame
 * simulation cost and cause values to "drift" after scroll stops, which hurts
 * frame budget without visible benefit.
 *
 * Usage:
 *   const sectionRef = useRef(null);
 *   const motionStyle = useScrollMotion(sectionRef, {
 *     y: [24, 0],
 *     opacity: [0, 1],
 *     offset: ["start 0.9", "end 0.2"],
 *   });
 *
 *   return (
 *     <motion.div ref={sectionRef} style={motionStyle}>...</motion.div>
 *   );
 */
export default function useScrollMotion(targetRef, config = {}) {
  const localRef = useRef(null);
  const ref = targetRef || localRef;
  const reducedMotion = useReducedMotion();

  const {
    offset = ["start 0.9", "end 0.2"],
    y: yRange = [24, 0],
    opacity: opacityRange = [0.0, 1],
    scale: scaleRange = null,
    disabled = false,
  } = config;

  const isDisabled = reducedMotion || disabled;

  const { scrollYProgress } = useScroll({ target: ref, offset });

  // All hooks must be called unconditionally — pass identity ranges when disabled.
  const opacity = useTransform(scrollYProgress, [0, 1], isDisabled ? [1, 1] : opacityRange);
  const y = useTransform(scrollYProgress, [0, 1], isDisabled ? [0, 0] : yRange);
  const scale = useTransform(scrollYProgress, [0, 1], isDisabled || !scaleRange ? [1, 1] : scaleRange);

  return {
    ref,
    opacity,
    y,
    ...(scaleRange ? { scale } : {}),
  };
}
