import {
  Suspense,
  lazy,
  useEffect,
  useRef,
  useState,
  useCallback,
  memo,
} from "react";
import { Menu, X } from "lucide-react";
import { ChevronDownIcon } from "@/components/ui/chevron-down";

import { ModeToggle } from "@/components/mode-toggle";
import GlassSurface from "@/components/surfaces/GlassSurface";
import { useTheme } from "@/components/theme-provider";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { NAME_FONT_FAMILY } from "@/constants";
import { StaticHeroBackground } from "./backgrounds/StaticHeroBackground";

const HeroBackground = lazy(() => import("./backgrounds/HeroBackground"));
const Lanyard = lazy(() => import("./Lanyard"));
// Match nav button text color to the primary nameplate (TAYLOR FRADELLA).
const navButtonClass =
  "floating-nav-btn inline-flex items-center justify-center px-1 py-1 text-ink-1 transition-colors duration-200 ease-out hover:text-ink-1 hover:underline hover:underline-offset-4 [text-decoration-thickness:1.5px] motion-reduce:transition-none";

const HERO_READY_TIMEOUT_MS = 6000;

function LanyardPlaceholder() {
  return (
    <div className="absolute inset-0 z-10">
      <StaticHeroBackground />
    </div>
  );
}

const MobileHeroMenu = memo(function MobileHeroMenu({
  isMenuOpen,
  onToggle,
  onMenuNavClick,
  menuButtonRef,
  menuPanelRef,
}) {
  return (
    <div className="relative ml-auto pointer-events-auto">
      <button
        ref={menuButtonRef}
        type="button"
        aria-label="Toggle navigation menu"
        aria-expanded={isMenuOpen}
        aria-controls="hero-mobile-menu"
        onClick={onToggle}
        className="floating-nav-btn inline-flex h-9 w-9 items-center justify-center text-ink-2 transition-colors duration-200 ease-out hover:text-ink-1"
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
          className="hero-mobile-dropdown absolute right-0 top-full mt-2 min-w-[160px] overflow-hidden rounded-2xl"
        >
          {["Skills", "Projects", "About", "Contact"].map((label, i, arr) => (
            <button
              key={label}
              type="button"
              role="menuitem"
              onClick={() => onMenuNavClick(label.toLowerCase())}
              className={`hero-mobile-dropdown__item w-full px-5 py-3 text-[14px] font-medium tracking-wide transition-colors duration-150${i < arr.length - 1 ? " border-b border-white/[0.08]" : ""}`}
            >
              {label}
            </button>
          ))}
          <div className="flex items-center justify-center border-t border-white/[0.08] px-5 py-2">
            <ModeToggle />
          </div>
        </div>
      ) : null}
    </div>
  );
});

const DesktopHeroNav = memo(function DesktopHeroNav({ onNavClick }) {
  const handleClick = (e, sectionId) => {
    e.preventDefault();
    onNavClick(sectionId);
  };
  return (
    <nav className="ml-auto flex w-full flex-wrap items-center justify-end gap-1.5 text-xs font-medium tracking-tight text-ink-2 sm:w-auto sm:flex-nowrap sm:gap-3 sm:text-sm md:gap-6 md:text-base">
      <a
        href="#skills"
        onClick={(e) => handleClick(e, "skills")}
        className={navButtonClass}
      >
        Skills
      </a>
      <a
        href="#projects"
        onClick={(e) => handleClick(e, "projects")}
        className={navButtonClass}
      >
        Projects
      </a>
      <a
        href="#about"
        onClick={(e) => handleClick(e, "about")}
        className={navButtonClass}
      >
        About
      </a>
      <a
        href="#footer"
        onClick={(e) => handleClick(e, "contact")}
        className={navButtonClass}
      >
        Contact
      </a>
      <ModeToggle />
    </nav>
  );
});

const HeroHeadline = memo(function HeroHeadline({ isCompactHero, onNavClick }) {
  return (
    <div className="pointer-events-auto w-full max-w-xl self-center justify-self-center md:col-start-2 md:justify-self-center">
      <div className="flex w-full flex-col items-center gap-5 text-center">
        <h1
          className="text-balance text-[2rem] font-semibold leading-tight text-ink-1 sm:text-5xl md:text-6xl lg:text-7xl flex w-full flex-col items-center text-center"
          style={{ fontFamily: NAME_FONT_FAMILY }}
        >
          <>
            <span className="block w-full text-center">Thoughtful UX.</span>
            <span className="block w-full text-center">Clean code.</span>
            <span className="block w-full text-center">Fast apps.</span>
          </>
        </h1>
        <p className="w-full max-w-xl text-center text-base text-ink-2 sm:text-lg">
          Designing and engineering profound digital experiences.
        </p>
        <GlassSurface
          as="button"
          variant="clear"
          type="button"
          onClick={() => onNavClick("contact")}
          className={`hero-cta-btn mt-1 inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-medium text-foreground transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 motion-reduce:transform-none sm:px-6 sm:py-3 sm:text-base ${
            isCompactHero ? "self-center" : ""
          }`}
          style={{
            transitionTimingFunction: "cubic-bezier(0.25, 0.1, 0.25, 1)",
          }}
        >
          Get in Touch
        </GlassSurface>
      </div>
    </div>
  );
});

const HeroScrollChevron = memo(function HeroScrollChevron({ onClick }) {
  return (
    <div
      className="pointer-events-none absolute inset-x-0 bottom-4 z-20 flex justify-center sm:bottom-6"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <button
        type="button"
        onClick={onClick}
        className="pointer-events-auto inline-flex items-center justify-center p-2 text-[var(--text-tertiary)] transition-colors duration-200 hover:text-[var(--text-primary)]"
        aria-label="Scroll down to skills"
      >
        <ChevronDownIcon size={36} />
      </button>
    </div>
  );
});

export default function Hero({
  onNav,
  onHeroReady,
  initialHeroReady = false,
  previewMode = false,
}) {
  const { shouldReduceEffects } = useTheme();
  const isCompactHero = useMediaQuery("(max-width: 767px)");
  const isTablet = useMediaQuery("(min-width: 768px) and (max-width: 1023px)");
  const [showHeroEffects, setShowHeroEffects] = useState(
    () => !shouldReduceEffects,
  );
  const [heroReady, setHeroReady] = useState(initialHeroReady);
  // Defer heavy components on backward nav so the page-transition animation
  // runs without main-thread contention. Video is lighter (150ms deferral),
  // Lanyard is heavy (500ms — after transition animation finishes).
  const [videoDeferred, setVideoDeferred] = useState(!initialHeroReady);
  const [lanyardDeferred, setLanyardDeferred] = useState(!initialHeroReady);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuButtonRef = useRef(null);
  const menuPanelRef = useRef(null);
  const backgroundReadyRef = useRef(false);
  const lanyardReadyRef = useRef(false);
  const onHeroReadyCalledRef = useRef(false);

  const onBackgroundReady = useCallback(() => {
    if (backgroundReadyRef.current) return;
    backgroundReadyRef.current = true;
    setHeroReady((prev) => {
      if (prev) return prev;
      return lanyardReadyRef.current;
    });
  }, []);

  const onLanyardReady = useCallback(() => {
    if (lanyardReadyRef.current) return;
    lanyardReadyRef.current = true;
    setHeroReady((prev) => {
      if (prev) return prev;
      return backgroundReadyRef.current;
    });
  }, []);

  const handleNavClick = useCallback(
    (sectionId) => {
      if (onNav) onNav(sectionId);
    },
    [onNav],
  );
  const handleMenuNavClick = useCallback(
    (sectionId) => {
      setIsMenuOpen(false);
      handleNavClick(sectionId);
    },
    [handleNavClick],
  );

  const toggleMenu = useCallback(() => setIsMenuOpen((open) => !open), []);
  const handleChevronClick = useCallback(
    () => handleNavClick("skills"),
    [handleNavClick],
  );

  useEffect(() => {
    if (shouldReduceEffects) {
      setShowHeroEffects(false);
      return undefined;
    }
    setShowHeroEffects(true);
    return undefined;
  }, [shouldReduceEffects]);

  // Staggered deferral: video first (lighter), then Lanyard (heavy).
  // Spreads the mount cost across multiple frames so no single frame drops.
  useEffect(() => {
    if (!videoDeferred) return;
    const t = setTimeout(() => setVideoDeferred(false), 150);
    return () => clearTimeout(t);
  }, [videoDeferred]);

  useEffect(() => {
    if (!lanyardDeferred) return;
    const t = setTimeout(() => setLanyardDeferred(false), 600);
    return () => clearTimeout(t);
  }, [lanyardDeferred]);

  // Fallback: mark hero ready after timeout if Lanyard hasn't yet.
  // Cleared once we notify parent so we don't cause a second "ready" pulse.
  useEffect(() => {
    const t = setTimeout(() => {
      if (onHeroReadyCalledRef.current) return; // Already notified; avoid redundant set.
      setHeroReady(true);
    }, HERO_READY_TIMEOUT_MS);
    return () => clearTimeout(t);
  }, []);

  // Notify parent once when hero is ready. Guard so we only ever call onHeroReady once.
  useEffect(() => {
    if (
      !heroReady ||
      onHeroReadyCalledRef.current ||
      typeof onHeroReady !== "function"
    )
      return;
    onHeroReadyCalledRef.current = true;
    onHeroReady();
  }, [heroReady, onHeroReady]);

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
      className="hero-content relative flex min-h-[100svh] w-full flex-col overflow-hidden text-foreground"
      data-hero-ready={heroReady}
    >
      {videoDeferred ? (
        <StaticHeroBackground />
      ) : (
        <Suspense fallback={<StaticHeroBackground />}>
          <HeroBackground
            onReady={onBackgroundReady}
            initialVisualReady={initialHeroReady}
          />
        </Suspense>
      )}

      <header
        className="pointer-events-none absolute inset-x-0 top-4 z-30 px-4 sm:top-6 sm:px-6 md:px-10"
        style={{ paddingTop: "env(safe-area-inset-top)" }}
      >
        <div className="mx-auto w-full max-w-7xl">
          <div className="pointer-events-auto flex w-full flex-wrap items-center gap-2 sm:flex-nowrap sm:gap-4">
            <span
              className="text-xs font-semibold tracking-tight text-ink-1 sm:text-sm md:text-base"
              style={{ fontFamily: NAME_FONT_FAMILY }}
            >
              TAYLOR FRADELLA
            </span>
            {isCompactHero ? (
              <MobileHeroMenu
                isMenuOpen={isMenuOpen}
                onToggle={toggleMenu}
                onMenuNavClick={handleMenuNavClick}
                menuButtonRef={menuButtonRef}
                menuPanelRef={menuPanelRef}
              />
            ) : (
              <DesktopHeroNav onNavClick={handleNavClick} />
            )}
          </div>
        </div>
      </header>

      <div className="absolute inset-0 z-10">
        {!lanyardDeferred && (showHeroEffects || shouldReduceEffects) ? (
          <Suspense fallback={<LanyardPlaceholder />}>
            <Lanyard
              position={isCompactHero ? [0, 0, 34] : isTablet ? [0, 0, 26] : [0, 0, 20]}
              gravity={
                previewMode
                  ? [0, -80, 0]
                  : shouldReduceEffects
                    ? [0, -18, 0]
                    : [0, -40, 0]
              }
              fov={20}
              groupOffsetX={isCompactHero ? 0 : isTablet ? -1.4 : -2.2}
              groupOffsetY={isCompactHero ? 7 : isTablet ? 6 : 5.3}
              introSwing={!shouldReduceEffects && !previewMode}
              interactive
              onReady={onLanyardReady}
            />
          </Suspense>
        ) : null}
      </div>

      <div className="pointer-events-none absolute inset-0 z-20">
        <div className="mx-auto grid h-full w-full max-w-7xl grid-cols-1 content-start items-start px-4 pt-[54svh] sm:px-8 sm:pt-[50svh] md:grid-cols-2 md:content-center md:items-center md:gap-8 md:pt-0">
          <HeroHeadline
            isCompactHero={isCompactHero}
            onNavClick={handleNavClick}
          />
          <div className="hidden md:block" aria-hidden />
        </div>
      </div>

      <HeroScrollChevron onClick={handleChevronClick} />
    </section>
  );
}
