"use client";
import { motion, useAnimation } from "framer-motion";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

import { cn } from "@/lib/utils";

const RECT_VARIANTS = {
  normal: {
    opacity: 1,
    pathLength: 1,
    scale: 1,
    transition: {
      duration: 0.3,
    },
  },
  animate: {
    opacity: [0, 1],
    pathLength: [0, 1],
    scale: [0.9, 1],
    transition: {
      duration: 0.4,
    },
  },
};

const PLAY_VARIANTS = {
  normal: {
    pathLength: 1,
    scale: 1,
    transition: {
      duration: 0.3,
    },
  },
  animate: {
    pathLength: [0, 1],
    scale: [0.6, 1.15, 1],
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const YoutubeIcon = forwardRef(({ onMouseEnter, onMouseLeave, className, size = 28, ...props }, ref) => {
  const rectControls = useAnimation();
  const playControls = useAnimation();
  const isControlledRef = useRef(false);

  useImperativeHandle(ref, () => {
    isControlledRef.current = true;

    return {
      startAnimation: async () => {
        rectControls.start("animate");
        playControls.start("animate");
      },
      stopAnimation: () => {
        rectControls.start("normal");
        playControls.start("normal");
      },
    };
  });

  const handleMouseEnter = useCallback(async (e) => {
    if (isControlledRef.current) {
      onMouseEnter?.(e);
    } else {
      rectControls.start("animate");
      playControls.start("animate");
    }
  }, [rectControls, playControls, onMouseEnter]);

  const handleMouseLeave = useCallback((e) => {
    if (isControlledRef.current) {
      onMouseLeave?.(e);
    } else {
      rectControls.start("normal");
      playControls.start("normal");
    }
  }, [rectControls, playControls, onMouseLeave]);

  return (
    <div
      className={cn(className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}>
      <svg
        fill="none"
        height={size}
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
        width={size}
        xmlns="http://www.w3.org/2000/svg">
        <motion.path
          animate={rectControls}
          d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"
          initial="normal"
          variants={RECT_VARIANTS} />
        <motion.path
          animate={playControls}
          d="m10 15 5-3-5-3z"
          initial="normal"
          style={{ transformOrigin: "12px 12px" }}
          variants={PLAY_VARIANTS} />
      </svg>
    </div>
  );
});

YoutubeIcon.displayName = "YoutubeIcon";

export { YoutubeIcon };
