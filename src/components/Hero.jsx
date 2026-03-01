import { Suspense, lazy, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, Menu, X } from "lucide-react";

import { ModeToggle } from "@/components/mode-toggle";
import { useTheme } from "@/components/theme-provider";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import HeroBackground from "./backgrounds/HeroBackground";

const Lanyard = lazy(() => import("./Lanyard"));

const nameFontFamily = "font_shi8d64tg, sans-serif";
const navButtonClass =
  "rounded-md border border-transparent px-2 py-1 text-foreground/95 drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)] transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/10 hover:text-foreground hover:shadow-[0_8px_18px_rgba(2,6,23,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/35 motion-reduce:transform-none";
const mobileMenuItemClass =
  "w-full rounded-md px-3 py-2 text-left text-sm font-medium text-foreground/95 transition-colors duration-200 hover:bg-white/10 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/35";

export default function Hero({ onNav }) {
  const { shouldReduceEffects } = useTheme();
  const isCompactHero = useMediaQuery("(max-width: 767px)");
  const [showHeroEffects, setShowHeroEffects] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuButtonRef = useRef(null);
  const menuPanelRef = useRef(null);

  const handleNavClick = (sectionId) => {
    if (onNav) onNav(sectionId);
  };
  const handleMenuNavClick = (sectionId) => {
    setIsMenuOpen(false);
    handleNavClick(sectionId);
  };

  useEffect(() => {
    if (shouldReduceEffects) {
      setShowHeroEffects(false);
      return undefined;
    }

    let cancelled = false;
    const enableEffects = () => {
      if (!cancelled) setShowHeroEffects(true);
    };

    if (
      typeof window !== "undefined" &&
      typeof window.requestIdleCallback === "function"
    ) {
      const idleId = window.requestIdleCallback(enableEffects, {
        timeout: 1200,
      });
      return () => {
        cancelled = true;
        window.cancelIdleCallback(idleId);
      };
    }

    const timeoutId = window.setTimeout(enableEffects, 350);
    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [shouldReduceEffects]);

  useEffect(() => {
    if (!isCompactHero) setIsMenuOpen(false);
  }, [isCompactHero]);

  useEffect(() => {
    if (!isMenuOpen) return undefined;

    const handlePointerDown = (event) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (menuPanelRef.current?.contains(target)) return;
      if (menuButtonRef.current?.contains(target)) return;
      setIsMenuOpen(false);
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") setIsMenuOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMenuOpen]);

  return (
    <section
      id="hero"
      className="relative flex min-h-[100svh] w-full flex-col overflow-hidden text-foreground"
    >
      <HeroBackground animated={showHeroEffects} />

      <header
        className="pointer-events-none absolute inset-x-0 top-4 z-30 px-4 sm:top-6 sm:px-6 md:px-10"
        style={{ paddingTop: "env(safe-area-inset-top)" }}
      >
        <div className="mx-auto w-full max-w-7xl">
          <div className="pointer-events-auto flex w-full flex-wrap items-center gap-2 sm:flex-nowrap sm:gap-4">
            <span
              className="text-xs font-semibold tracking-tight text-foreground drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)] sm:text-sm md:text-base"
              style={{ fontFamily: nameFontFamily }}
            >
              TAYLOR FRADELLA
            </span>
            {isCompactHero ? (
              <div className="relative ml-auto pointer-events-auto">
                <button
                  ref={menuButtonRef}
                  type="button"
                  aria-label="Toggle navigation menu"
                  aria-expanded={isMenuOpen}
                  aria-controls="hero-mobile-menu"
                  onClick={() => setIsMenuOpen((open) => !open)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-transparent text-foreground/95 drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)] transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/10 hover:text-foreground hover:shadow-[0_8px_18px_rgba(2,6,23,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/35 motion-reduce:transform-none"
                >
                  {isMenuOpen ? (
                    <X className="h-4 w-4" aria-hidden />
                  ) : (
                    <Menu className="h-4 w-4" aria-hidden />
                  )}
                </button>
                {isMenuOpen ? (
                  <div
                    id="hero-mobile-menu"
                    ref={menuPanelRef}
                    role="menu"
                    className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-white/15 bg-black/55 p-2 shadow-[0_16px_32px_rgba(2,6,23,0.45)] backdrop-blur-xl"
                  >
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => handleMenuNavClick("skills")}
                      className={mobileMenuItemClass}
                    >
                      Skills
                    </button>
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => handleMenuNavClick("projects")}
                      className={mobileMenuItemClass}
                    >
                      Projects
                    </button>
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => handleMenuNavClick("contact")}
                      className={mobileMenuItemClass}
                    >
                      Contact
                    </button>
                    <div className="mt-1 border-t border-white/10 pt-1.5">
                      <p className="px-2 pb-1 text-[11px] font-medium uppercase tracking-wide text-foreground/60">
                        Effects
                      </p>
                      <ModeToggle />
                    </div>
                  </div>
                ) : null}
              </div>
            ) : (
              <nav className="ml-auto flex w-full flex-wrap items-center justify-end gap-1.5 text-xs font-medium tracking-tight text-foreground/95 sm:w-auto sm:flex-nowrap sm:gap-3 sm:text-sm md:gap-6 md:text-base">
                <button
                  type="button"
                  onClick={() => handleNavClick("skills")}
                  className={navButtonClass}
                >
                  Skills
                </button>
                <button
                  type="button"
                  onClick={() => handleNavClick("projects")}
                  className={navButtonClass}
                >
                  Projects
                </button>
                <button
                  type="button"
                  onClick={() => handleNavClick("contact")}
                  className={navButtonClass}
                >
                  Contact
                </button>
                <ModeToggle />
              </nav>
            )}
          </div>
        </div>
      </header>

      <div className="absolute inset-0 z-10">
        {showHeroEffects || shouldReduceEffects ? (
          <Suspense fallback={null}>
            <Lanyard
              position={[0, 0, 11]}
              gravity={shouldReduceEffects ? [0, -18, 0] : [0, -40, 0]}
              fov={24}
              groupOffsetX={isCompactHero ? 0 : -1.1}
              groupOffsetY={isCompactHero ? 5 : 4.25}
              scale={isCompactHero ? 0.72 : 0.88}
              bandColor="#000000"
              bandWidth={0.36}
              introSwing={!shouldReduceEffects}
            />
          </Suspense>
        ) : null}
      </div>

      <div className="pointer-events-none absolute inset-0 z-20">
        <div className="mx-auto grid h-full w-full max-w-7xl grid-cols-1 content-start items-start px-4 pt-[54svh] sm:px-8 sm:pt-[50svh] md:grid-cols-2 md:content-center md:items-center md:gap-8 md:pt-0">
          <div className="pointer-events-auto w-full max-w-xl self-center justify-self-center md:col-start-2 md:justify-self-center">
            <div className="flex w-full flex-col items-center gap-5 text-center">
              <h1
                className="text-balance text-4xl font-semibold leading-tight tracking-tight text-foreground drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)] sm:text-5xl md:text-6xl lg:text-7xl flex w-full flex-col items-center text-center"
                style={{ fontFamily: nameFontFamily }}
              >
                <>
                  <span className="block w-full text-center">
                    Thoughtful UX.
                  </span>
                  <span className="block w-full text-center">Clean code.</span>
                  <span className="block w-full text-center">Fast apps.</span>
                </>
              </h1>
              <p className="w-full max-w-xl text-center text-base text-foreground/85 drop-shadow-[0_1px_4px_rgba(0,0,0,0.55)] sm:text-lg">
                Designing and engineering profound digital experiences.
              </p>
              <button
                type="button"
                onClick={() => handleNavClick("contact")}
                className={`mt-1 inline-flex items-center justify-center rounded-full border border-white/25 bg-white/10 px-5 py-2.5 text-sm font-medium text-foreground backdrop-blur-md shadow-[0_8px_20px_rgba(2,6,23,0.28)] transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-white/35 hover:bg-white/18 hover:shadow-[0_12px_26px_rgba(2,6,23,0.34)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/35 motion-reduce:transform-none sm:px-6 sm:py-3 sm:text-base ${
                  isCompactHero ? "self-center" : ""
                }`}
              >
                Get in Touch
              </button>
            </div>
          </div>
          <div className="hidden md:block" aria-hidden />
        </div>
      </div>

      <div
        className="pointer-events-none absolute inset-x-0 bottom-4 z-20 flex justify-center sm:bottom-6"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <motion.button
          type="button"
          onClick={() => handleNavClick("skills")}
          className="pointer-events-auto inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/70 bg-background/80 text-muted-foreground shadow-sm backdrop-blur-md transition hover:text-foreground"
          animate={shouldReduceEffects ? undefined : { y: [0, 8, 0] }}
          transition={
            shouldReduceEffects
              ? undefined
              : { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
          }
          aria-label="Scroll down to skills"
        >
          <ChevronDown className="h-4 w-4" />
        </motion.button>
      </div>
    </section>
  );
}
