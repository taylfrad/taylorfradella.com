import { memo, useEffect, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { ArrowRight } from "lucide-react";
import { GithubIcon } from "@/components/ui/github";
import { YoutubeIcon } from "@/components/ui/youtube";
import { Link, useNavigate } from "react-router-dom";
import { projectsData } from "../data/projectsData";
import useIntersectionObserver from "@/hooks/useIntersectionObserver";
import { NAME_FONT_FAMILY } from "@/constants";
import { useMediaQuery } from "@/hooks/useMediaQuery";

// Prefetch ProjectDetail chunk on hover so it's cached before the user clicks.
// The dynamic import is idempotent — the browser/bundler deduplicates it with
// the lazy() call in App.jsx since both resolve to the same chunk URL.
const prefetchProjectDetail = () => import("./ProjectDetail");

// ─── Per-project gradient accent bars (matches each project's brand color) ─────
const ACCENT_GRADIENTS = {
  1: "linear-gradient(180deg, #0071e3 0%, #60b3ff 100%)",
  2: "linear-gradient(180deg, #0a0000 0%, #c20000 40%, #c20000 60%, #0a0000 100%)",
  3: "linear-gradient(180deg, #0a0000 0%, #22c55e 40%, #22c55e 60%, #0a0000 100%)",
  4: "linear-gradient(180deg, #b3363d 0%, #f4a0a5 100%)",
};

// ─── 1. Portfolio visual — hero screenshot for the personal portfolio project.
function PortfolioVisual() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <img
        src="/images/portfolio-hero.png"
        alt=""
        loading="lazy"
        decoding="async"
        className="h-full w-full object-cover"
        style={{ objectPosition: "38% 20%" }}
      />
    </div>
  );
}

// ─── Viewport-aware video — plays only when visible, pauses when off-screen ──
// Guards against the play/pause race condition: calling pause() while a play()
// promise is pending causes an AbortError, which can leave the video in a
// stalled state where subsequent play() calls silently fail.
function VideoVisual({ webm, mp4, poster }) {
  const videoRef = useRef(null);
  const isInViewRef = useRef(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let playPromise = null;
    let hasLoaded = false;

    function safePlay() {
      // Kick off loading if this is the first time the video is visible
      if (!hasLoaded) {
        hasLoaded = true;
        video.load();
        // Start from a random position so looping videos don't all sync
        video.addEventListener("loadedmetadata", () => {
          if (video.duration) video.currentTime = Math.random() * video.duration;
        }, { once: true });
      }
      playPromise = video.play();
      if (playPromise) {
        playPromise
          .catch((err) => {
            // AbortError is expected when pause() races with play() — ignore it.
            // NotAllowedError can happen if autoplay policy blocks us — ignore too.
            // For actual failures (network/decode), reload the source so the next
            // play attempt starts fresh instead of staying permanently stuck.
            if (err.name !== "AbortError" && err.name !== "NotAllowedError") {
              video.load();
            }
          })
          .finally(() => {
            playPromise = null;
          });
      }
    }

    function safePause() {
      // If a play() promise is in flight, wait for it to settle before pausing.
      // Calling pause() while play() is pending triggers an AbortError that can
      // leave the video in an unrecoverable stalled state.
      if (playPromise) {
        playPromise.then(() => video.pause()).catch(() => video.pause());
      } else {
        video.pause();
      }
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        isInViewRef.current = entry.isIntersecting;
        if (entry.isIntersecting && !document.hidden) {
          safePlay();
        } else {
          safePause();
        }
      },
      // Small threshold so play starts as soon as the card peeks in;
      // rootMargin gives a 200px head-start so the first frame is
      // already decoded by the time the user sees it.
      { threshold: 0.05, rootMargin: "200px 0px" },
    );

    // Pause when the tab is backgrounded to save battery
    const onVisibility = () => {
      if (document.hidden) {
        safePause();
      } else if (isInViewRef.current) {
        safePlay();
      }
    };

    observer.observe(video);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      <video
        ref={videoRef}
        loop
        muted
        playsInline
        preload="none"
        poster={poster}
        aria-label="Project demo video"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
        }}
      >
        <source src={webm} type="video/webm" />
        <source src={mp4} type="video/mp4" />
      </video>
    </div>
  );
}

// ─── Video sources keyed by project id ────────────────────────────────────────
const VIDEO_SOURCES = {
  2: { webm: "/images/lionsden/lionsden-demo.webm", mp4: "/images/lionsden/lionsden-demo.mp4", poster: "/images/lionsden/lionsden-poster.jpg" },
  3: { webm: "/images/sweetspot/sweetspot-demo.webm", mp4: "/images/sweetspot/sweetspot-demo.mp4", poster: "/images/sweetspot/sweetspot-poster.jpg" },
  4: { webm: "/images/workly/workly-demo.webm", mp4: "/images/workly/workly-demo.mp4", poster: "/images/workly/workly-poster.jpg" },
};

// ─── Visual selector ───────────────────────────────────────────────────────────
function ProjectVisual({ project }) {
  if (project.id === 1) return <PortfolioVisual />;
  const sources = VIDEO_SOURCES[project.id];
  if (sources) return <VideoVisual webm={sources.webm} mp4={sources.mp4} poster={sources.poster} />;
}

// ─── Single project row ────────────────────────────────────────────────────────
const ProjectRow = memo(function ProjectRow({ project, index, isTablet }) {
  const ref = useRef(null);
  const navigate = useNavigate();
  const githubIconRef = useRef(null);
  const youtubeIconRef = useRef(null);
  const [nearRef] = useIntersectionObserver({
    threshold: 0,
    rootMargin: "200px 0px",
    initialVisible: true,
  });
  const reducedMotion = useReducedMotion();
  const isEven = index % 2 === 0;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const slideDistance = isTablet ? 60 : 120;
  const visualX = useTransform(
    scrollYProgress,
    [0, 0.25, 0.75, 1],
    isEven ? [-slideDistance, 0, 0, 0] : [slideDistance, 0, 0, 0],
  );
  const textX = useTransform(
    scrollYProgress,
    [0, 0.25, 0.75, 1],
    isEven ? [slideDistance, 0, 0, 0] : [-slideDistance, 0, 0, 0],
  );
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.35, 0.65, 1],
    [0, 1, 1, 1],
  );
  const barScaleY = useTransform(
    scrollYProgress,
    [0, 0.25, 0.75, 1],
    [0, 1, 1, 1],
  );
  return (
    <div
      ref={(el) => {
        ref.current = el;
        nearRef.current = el;
      }}
      className="relative flex items-center py-10 md:py-14"
    >
      {/* Mobile thin accent bar — row-relative on mobile only */}
      <motion.div
        aria-hidden
        className="md:hidden"
        style={{
          position: "absolute",
          left: 0,
          top: "12%",
          height: "76%",
          width: "3px",
          borderRadius: "2px",
          background: ACCENT_GRADIENTS[project.id] ?? project.accentColor,
          scaleY: reducedMotion ? 1 : barScaleY,
          originY: 0,
          opacity: reducedMotion ? opacity : undefined,
        }}
      />

      <div className="grid w-full grid-cols-1 items-center gap-10 pl-5 md:grid-cols-2 md:gap-16 md:pl-8">
        {/* Visual panel — bar lives here so it matches card height exactly */}
        <motion.div
          style={
            reducedMotion
              ? { opacity }
              : { x: visualX, opacity }
          }
          className={`relative ${!isEven ? "md:order-2" : ""}`}
        >
          {/* Desktop accent bar — anchored to card, same height */}
          <motion.div
            aria-hidden
            className="hidden md:block"
            style={{
              position: "absolute",
              [isEven ? "left" : "right"]: isTablet ? "-16px" : "-60px",
              top: 0,
              height: "100%",
              width: isTablet ? "12px" : "48px",
              borderRadius: "4px",
              background: ACCENT_GRADIENTS[project.id] ?? project.accentColor,
              scaleY: reducedMotion ? 1 : barScaleY,
              originY: 0.5,
              opacity: reducedMotion ? opacity : undefined,
            }}
          />
          <div
            className="relative w-full overflow-hidden rounded-xl border border-[var(--card-border)] shadow-[0_4px_24px_rgba(0,0,0,0.06)]"
            style={{ aspectRatio: "4/3", background: "var(--bg-secondary)" }}
          >
            <ProjectVisual project={project} />
          </div>
        </motion.div>

        {/* Text block */}
        <motion.div
          style={
            reducedMotion
              ? { opacity }
              : { x: textX, opacity }
          }
          className={`flex flex-col${!isEven ? " md:order-1" : ""}`}
        >
          <p className="mb-3 text-[12px] font-medium uppercase tracking-[0.25em] text-[var(--text-tertiary)] sm:text-[13px]">
            {project.role}
          </p>

          <h3 className="mb-5 text-[1.75rem] font-bold leading-[1.2] tracking-tight text-[var(--text-primary)] sm:text-[2rem] md:text-[2.25rem]">
            {project.title}
          </h3>

          <div className="mb-5 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-[3px] border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] sm:text-[12px]"
                style={{
                  color: project.accentColor,
                  borderColor: `${project.accentColor}55`,
                  backgroundColor: `${project.accentColor}12`,
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          <p className="mb-6 max-w-[42ch] text-[15px] leading-relaxed text-[var(--text-secondary)] sm:text-base">
            {project.description}
          </p>

          <div className="mb-7 flex items-center gap-2">
            <span
              className={`inline-block h-1.5 w-1.5 rounded-full ${project.status === "Live" ? "bg-emerald-500" : "bg-[var(--border-color)]"}`}
            />
            <span
              className={`text-[11px] tracking-[0.18em] uppercase font-medium ${project.status === "Live" ? "text-emerald-600" : "text-[var(--text-tertiary)]"}`}
            >
              {project.status}
            </span>
          </div>

          <div className="flex items-center gap-6">
            <Link
              to={`/project/${project.id}`}
              onClick={(e) => {
                e.preventDefault();
                navigate(`/project/${project.id}`, { state: { scrollY: window.scrollY } });
              }}
              onPointerEnter={prefetchProjectDetail}
              className="group/btn inline-flex flex-col text-[13px] font-bold tracking-[0.18em] uppercase text-[var(--text-primary)] no-underline transition-colors duration-200 hover:text-[var(--text-primary)] hover:no-underline sm:text-[14px]"
            >
              <span className="flex items-center gap-2">
                <span>View Project</span>
                <ArrowRight
                  size={14}
                  className="transition-transform duration-300 group-hover/btn:translate-x-1"
                />
              </span>
              <span className="mt-1 block h-[2px] w-full max-w-0 rounded-full bg-[var(--text-primary)] transition-all duration-300 ease-out group-hover/btn:max-w-full" />
            </Link>
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`GitHub repository for ${project.title}`}
                className="text-[var(--text-tertiary)] transition-colors duration-200 hover:text-[var(--text-primary)]"
                onMouseEnter={() => !reducedMotion && githubIconRef.current?.startAnimation?.()}
                onMouseLeave={() => !reducedMotion && githubIconRef.current?.stopAnimation?.()}
              >
                <GithubIcon ref={githubIconRef} size={16} />
              </a>
            )}
            {project.youtube && (
              <a
                href={project.youtube}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`YouTube demo for ${project.title}`}
                className="text-[var(--text-tertiary)] transition-colors duration-200 hover:text-[var(--text-primary)]"
                onMouseEnter={() => !reducedMotion && youtubeIconRef.current?.startAnimation?.()}
                onMouseLeave={() => !reducedMotion && youtubeIconRef.current?.stopAnimation?.()}
              >
                <YoutubeIcon ref={youtubeIconRef} size={16} />
              </a>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
});

// ─── Section ───────────────────────────────────────────────────────────────────
export default function Projects() {
  const headerRef = useRef(null);
  const reducedMotion = useReducedMotion();
  const isTablet = useMediaQuery("(min-width: 768px) and (max-width: 1023px)");
  const { scrollYProgress: headerScroll } = useScroll({
    target: headerRef,
    offset: ["start end", "end start"],
  });
  const headerOpacity = useTransform(
    headerScroll,
    [0, 0.2, 0.8, 1],
    reducedMotion ? [1, 1, 1, 1] : [0, 1, 1, 1],
  );
  const headerY = useTransform(
    headerScroll,
    [0, 0.2, 0.8, 1],
    reducedMotion ? [0, 0, 0, 0] : [24, 0, 0, 0],
  );
  return (
    <section
      aria-label="Selected projects"
      className="relative w-full px-4 pb-20 pt-20 sm:px-6 sm:pt-24 md:px-8 md:pb-28 md:pt-28"
      style={{ background: "var(--bg-secondary)", overflow: "clip" }}
    >
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 md:px-8">
        {/* ── Editorial header — matches Skills section ─────────────────── */}
        <motion.div
          ref={headerRef}
          className="relative mb-14 flex items-end justify-between"
          style={{ opacity: headerOpacity, y: headerY }}
        >
          <div>
            <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.32em] text-[var(--text-tertiary)]">
              Selected Work
            </p>
            <h2 className="text-4xl font-bold tracking-tight text-[var(--text-primary)] sm:text-5xl">
              Projects
            </h2>
            <div
              className="mt-3 h-[2px] w-full rounded-full bg-[var(--text-tertiary)]"
              aria-hidden
            />
          </div>
          <div className="hidden select-none text-right md:block" aria-hidden>
            <p className="text-[72px] font-bold leading-none tracking-tighter text-[var(--card-border)]">
              {String(projectsData.length).padStart(2, "0")}
            </p>
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[var(--border-color)]">
              Projects
            </p>
          </div>
        </motion.div>

        {projectsData.map((project, idx) => (
          <div key={project.id}>
            <ProjectRow project={project} index={idx} isTablet={isTablet} />
          </div>
        ))}

      </div>
    </section>
  );
}
