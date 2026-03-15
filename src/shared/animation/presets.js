// Apple-standard spring: firm, minimal overshoot, fast settle
export const slideSpringPrimary = {
  x: {
    type: "spring",
    stiffness: 400,
    damping: 35,
    mass: 0.8,
  },
  opacity: { duration: 0.35, ease: [0.25, 0.1, 0.25, 1] },
  scale: { duration: 0.35, ease: [0.25, 0.1, 0.25, 1] },
};

export const slideSpringSecondary = {
  x: { type: "spring", stiffness: 350, damping: 32 },
  opacity: { duration: 0.2, ease: [0.25, 0.1, 0.25, 1] },
};
