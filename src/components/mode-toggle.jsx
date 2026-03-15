import { useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SunIcon } from "@/components/ui/sun-icon";
import { MoonIcon } from "@/components/ui/moon-icon";
import { useTheme } from "@/components/theme-provider";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";
  const sunRef = useRef(null);
  const moonRef = useRef(null);

  const handleClick = () => {
    setTheme(isDark ? "light" : "dark");
    if (isDark) {
      sunRef.current?.startAnimation();
    } else {
      moonRef.current?.startAnimation();
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="floating-nav-btn group relative inline-flex h-9 items-center justify-center px-2 text-ink-1 transition-colors duration-200 ease-out hover:text-ink-1 motion-reduce:transition-none sm:px-2.5"
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.span
            key="sun"
            initial={{ opacity: 0, rotate: -45, scale: 0.8 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 45, scale: 0.8 }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
            className="inline-flex"
          >
            <SunIcon ref={sunRef} size={16} />
          </motion.span>
        ) : (
          <motion.span
            key="moon"
            initial={{ opacity: 0, rotate: 45, scale: 0.8 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: -45, scale: 0.8 }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
            className="inline-flex"
          >
            <MoonIcon ref={moonRef} size={16} />
          </motion.span>
        )}
      </AnimatePresence>
      <span className="sr-only">
        {isDark ? "Switch to light mode" : "Switch to dark mode"}
      </span>

      {/* Liquid Glass Tooltip */}
      <span
        className="glass-tooltip pointer-events-none absolute left-1/2 top-full z-50 mt-2.5 -translate-x-1/2 whitespace-nowrap opacity-0 transition-opacity duration-200 group-hover:opacity-100"
        aria-hidden
      >
        <span className="glass-tooltip__surface">
          <span className="glass-tooltip__highlight" />
          <span className="glass-tooltip__text">
            {isDark ? "Light mode" : "Dark mode"}
          </span>
        </span>
      </span>
    </button>
  );
}
