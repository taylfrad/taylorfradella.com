import { useRef } from "react";
import { useScroll, useTransform, useSpring } from "framer-motion";
import useReducedMotion from "./useReducedMotion";
import useDeviceCapability from "./useDeviceCapability";

/**
 * Scroll-linked motion helper.
 *
 * Drives opacity / translateY (and optionally scale) from scroll progress so that:
 * - Motion only updates while the user is scrolling
 * - Reverses naturally when scrolling back up
 * - Respects prefers-reduced-motion (returns static values)
 * - Uses instant springs on low-tier devices to reduce computation
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
  const tier = useDeviceCapability();

  const {
    offset = ["start 0.9", "end 0.2"],
    y: yRange = [24, 0],
    opacity: opacityRange = [0.0, 1],
    scale: scaleRange = null,
    spring = {},
    disabled = false,
  } = config;

  const isDisabled = reducedMotion || disabled;

  // On low-tier devices, use very stiff springs that settle instantly —
  // same visual result but nearly zero per-frame simulation cost.
  const isLowTier = tier === "low";
  const baseSpring = isLowTier
    ? { stiffness: 1000, damping: 100, mass: 0.01, ...spring }
    : { stiffness: 250, damping: 40, mass: 0.6, ...spring };

  const { scrollYProgress } = useScroll({ target: ref, offset });

  // All hooks must be called unconditionally — pass identity ranges when disabled.
  const rawOpacity = useTransform(scrollYProgress, [0, 1], isDisabled ? [1, 1] : opacityRange);
  const opacity = useSpring(rawOpacity, baseSpring);
  const rawY = useTransform(scrollYProgress, [0, 1], isDisabled ? [0, 0] : yRange);
  const y = useSpring(rawY, baseSpring);
  const rawScale = useTransform(scrollYProgress, [0, 1], isDisabled || !scaleRange ? [1, 1] : scaleRange);
  const scale = useSpring(rawScale, baseSpring);

  return {
    ref,
    opacity,
    y,
    ...(scaleRange ? { scale } : {}),
  };
}
