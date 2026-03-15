"use client";
import { motion, useAnimation } from "framer-motion";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

import { cn } from "@/lib/utils";

const BOX_VARIANTS = {
  normal: {
    opacity: 1,
    pathLength: 1,
    transition: {
      duration: 0.3,
    },
  },
  animate: {
    opacity: [0, 1],
    pathLength: [0, 1],
    transition: {
      duration: 0.4,
    },
  },
};

const ARROW_VARIANTS = {
  normal: {
    x: 0,
    y: 0,
    transition: {
      duration: 0.3,
    },
  },
  animate: {
    x: [0, 2, 0],
    y: [0, -2, 0],
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const ExternalLinkIcon = forwardRef(({ onMouseEnter, onMouseLeave, className, size = 28, ...props }, ref) => {
  const boxControls = useAnimation();
  const arrowControls = useAnimation();
  const isControlledRef = useRef(false);

  useImperativeHandle(ref, () => {
    isControlledRef.current = true;

    return {
      startAnimation: () => {
        boxControls.start("animate");
        arrowControls.start("animate");
      },
      stopAnimation: () => {
        boxControls.start("normal");
        arrowControls.start("normal");
      },
    };
  });

  const handleMouseEnter = useCallback((e) => {
    if (isControlledRef.current) {
      onMouseEnter?.(e);
    } else {
      boxControls.start("animate");
      arrowControls.start("animate");
    }
  }, [boxControls, arrowControls, onMouseEnter]);

  const handleMouseLeave = useCallback((e) => {
    if (isControlledRef.current) {
      onMouseLeave?.(e);
    } else {
      boxControls.start("normal");
      arrowControls.start("normal");
    }
  }, [boxControls, arrowControls, onMouseLeave]);

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
          animate={boxControls}
          d="M15 3h6v6"
          initial="normal"
          variants={BOX_VARIANTS} />
        <motion.path
          animate={arrowControls}
          d="M10 14 21 3"
          initial="normal"
          variants={ARROW_VARIANTS} />
        <motion.path
          animate={boxControls}
          d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"
          initial="normal"
          variants={BOX_VARIANTS} />
      </svg>
    </div>
  );
});

ExternalLinkIcon.displayName = "ExternalLinkIcon";

export { ExternalLinkIcon };
