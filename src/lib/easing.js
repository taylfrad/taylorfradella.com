/**
 * Shared easing functions for scroll/animation timing.
 */

/** Cubic ease-in-out (0→1). Soft start, soft stop. */
export const easeInOutCubic = (t) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
