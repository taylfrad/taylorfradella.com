/**
 * Static hero shell for instant first paint. Used as route Suspense fallback
 * so the hero appears immediately while Home chunk loads. No lazy deps.
 */
import { StaticHeroBackground } from "./backgrounds/StaticHeroBackground";
import { NAME_FONT_FAMILY } from "@/constants";

export default function HeroShell() {
  return (
    <section
      id="hero"
      className="hero-content relative flex min-h-[100svh] w-full flex-col overflow-hidden text-foreground animate-pulse"
      aria-busy="true"
    >
      <div className="pointer-events-none absolute inset-0 z-0">
        <StaticHeroBackground />
      </div>

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
            <nav className="ml-auto flex w-full flex-wrap items-center justify-end gap-1.5 text-xs font-medium tracking-tight text-ink-2 sm:w-auto sm:flex-nowrap sm:gap-3 sm:text-sm md:gap-6 md:text-base">
              <span className="cursor-default">Skills</span>
              <span className="cursor-default">Projects</span>
              <span className="cursor-default">Contact</span>
            </nav>
          </div>
        </div>
      </header>

      <div className="pointer-events-none absolute inset-0 z-20">
        <div className="mx-auto grid h-full w-full max-w-7xl grid-cols-1 content-start items-start px-4 pt-[54svh] sm:px-8 sm:pt-[50svh] md:grid-cols-2 md:content-center md:items-center md:gap-8 md:pt-0">
          <div className="pointer-events-auto w-full max-w-xl self-center justify-self-center md:col-start-2 md:justify-self-center">
            <div className="flex w-full flex-col items-center gap-5 text-center">
              <h1
                className="text-balance text-4xl font-semibold leading-tight tracking-tight text-ink-1 sm:text-5xl md:text-6xl lg:text-7xl flex w-full flex-col items-center text-center"
                style={{ fontFamily: NAME_FONT_FAMILY }}
              >
                <span className="block w-full text-center">Thoughtful UX.</span>
                <span className="block w-full text-center">Clean code.</span>
                <span className="block w-full text-center">Fast apps.</span>
              </h1>
              <p className="w-full max-w-xl text-center text-base text-ink-2 sm:text-lg">
                Designing and engineering profound digital experiences.
              </p>
              <div
                className="mt-1 inline-flex min-h-[2.5rem] items-center justify-center rounded-full px-5 py-2.5 text-sm font-medium text-foreground sm:min-h-[3rem] sm:px-6 sm:py-3 sm:text-base"
                aria-hidden
              >
                Get in Touch
              </div>
            </div>
          </div>
          <div className="hidden md:block" aria-hidden />
        </div>
      </div>

      <div
        className="pointer-events-none absolute inset-x-0 bottom-4 z-20 flex justify-center sm:bottom-6"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div
          className="hero-chevron pointer-events-none inline-flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground sm:h-9 sm:w-9"
          aria-hidden
        >
          <svg className="h-4 w-4 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </section>
  );
}
