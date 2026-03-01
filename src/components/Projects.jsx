import {
  Banknote,
  BriefcaseBusiness,
  Clock3,
  Github,
  Heart,
  MapPin,
  X,
} from "lucide-react";
import { Suspense, lazy, useRef, useCallback, useMemo, memo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { projectsSummary } from "../data/projectsSummary";
import OptimizedImage from "./OptimizedImage";
import GlassSurface from "@/components/surfaces/GlassSurface";
import HeroBackground from "./backgrounds/HeroBackground";
import FloatingLines from "./FloatingLines";
import { Button } from "@/components/ui/button";
import { Box, Typography } from "@/components/ui/sx-primitives";

const Lanyard = lazy(() => import("./Lanyard"));

// Animation variants
const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

const imageVariants = (isImageLeft) => ({
  hidden: { opacity: 0, x: isImageLeft ? -60 : 60 },
  visible: { opacity: 1, x: 0 },
});

const textVariants = (isImageLeft) => ({
  hidden: { opacity: 0, x: isImageLeft ? 60 : -60 },
  visible: { opacity: 1, x: 0 },
});

const roleBadgeVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: { opacity: 1, y: 0 },
};

const tagsContainerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const tagVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 },
};

const statusBadgeVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 },
};
const FLOATING_LINE_WAVES = ["top", "middle", "bottom"];
const HERO_PREVIEW_FONT_FAMILY = "font_shi8d64tg, sans-serif";

const projectFloatingLineThemes = {
  lions: {
    linesGradient: ["#fecdd3", "#fda4af", "#fca5a5", "#fdba74"],
    lineCount: 4,
    lineDistance: 7,
    animationSpeed: 0.62,
    topWavePosition: { x: 9.2, y: 0.44, rotate: -0.38 },
    middleWavePosition: { x: 4.6, y: 0.03, rotate: 0.16 },
    bottomWavePosition: { x: 2.2, y: -0.67, rotate: 0.34 },
    veil: "linear-gradient(180deg, rgba(2,6,23,0.18) 0%, rgba(2,6,23,0.07) 52%, rgba(2,6,23,0.22) 100%)",
  },
  sweetspot: {
    linesGradient: ["#bbf7d0", "#86efac", "#6ee7b7", "#34d399"],
    lineCount: 4,
    lineDistance: 6.5,
    animationSpeed: 0.58,
    topWavePosition: { x: 8.8, y: 0.48, rotate: -0.34 },
    middleWavePosition: { x: 4.2, y: 0.05, rotate: 0.14 },
    bottomWavePosition: { x: 2.0, y: -0.64, rotate: 0.32 },
    veil: "linear-gradient(180deg, rgba(3,10,26,0.17) 0%, rgba(5,16,34,0.07) 54%, rgba(3,10,26,0.22) 100%)",
  },
  workly: {
    linesGradient: ["#fbcfe8", "#fda4af", "#fb7185", "#f9a8d4"],
    lineCount: 4,
    lineDistance: 6.8,
    animationSpeed: 0.6,
    topWavePosition: { x: 9.4, y: 0.42, rotate: -0.36 },
    middleWavePosition: { x: 4.8, y: 0.04, rotate: 0.17 },
    bottomWavePosition: { x: 2.15, y: -0.66, rotate: 0.33 },
    veil: "linear-gradient(180deg, rgba(7,10,31,0.18) 0%, rgba(9,13,36,0.08) 52%, rgba(7,10,31,0.22) 100%)",
  },
};

function ProjectFloatingLines({ theme, reducedMotion = false }) {
  return (
    <>
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          opacity: 0.42,
        }}
      >
        <FloatingLines
          linesGradient={theme.linesGradient}
          enabledWaves={FLOATING_LINE_WAVES}
          lineCount={theme.lineCount}
          lineDistance={theme.lineDistance}
          topWavePosition={theme.topWavePosition}
          middleWavePosition={theme.middleWavePosition}
          bottomWavePosition={theme.bottomWavePosition}
          animationSpeed={reducedMotion ? 0.28 : theme.animationSpeed}
          interactive={false}
          parallax={false}
          bendRadius={5}
          bendStrength={-0.5}
          mixBlendMode="screen"
        />
      </Box>
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          background: theme.veil,
        }}
      />
    </>
  );
}

// Parallax Project Item Component - Memoized for performance
const ParallaxProjectItem = memo(
  function ParallaxProjectItem({ project, index, isImageLeft }) {
    const navigate = useNavigate();
    const reducedMotion = useReducedMotion();
    const itemRef = useRef();

    const handleCardClick = useCallback(
      (e) => {
        if (e.target.closest("a[href]") || e.target.closest("button")) {
          return;
        }
        navigate(`/project/${project.id}`);
      },
      [navigate, project.id],
    );

    const revealMotionProps = useMemo(
      () =>
        reducedMotion
          ? { initial: false, animate: "visible" }
          : {
              initial: "hidden",
              whileInView: "visible",
              viewport: { once: true, margin: "-50px" },
            },
      [reducedMotion],
    );

    const imageMotionVariants = useMemo(
      () => imageVariants(isImageLeft),
      [isImageLeft],
    );
    const textMotionVariants = useMemo(
      () => textVariants(isImageLeft),
      [isImageLeft],
    );

    return (
      <motion.div
        ref={itemRef}
        key={`project-wrapper-${project.id}`}
        {...revealMotionProps}
        variants={cardVariants}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`relative w-full ${index < 3 ? "mb-4 sm:mb-5 md:mb-6" : ""}`}
      >
        {/* Individual project card */}
        <motion.div
          onClick={handleCardClick}
          whileHover={
            reducedMotion
              ? undefined
              : {
                  y: -2,
                  transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] },
                }
          }
          className="relative z-[1] w-full cursor-pointer will-change-transform"
          style={{ pointerEvents: "auto", transform: "translateZ(0)" }}
        >
          <GlassSurface
            variant="card"
            className="flex w-full flex-col items-start justify-start gap-5 border-white/10 bg-background/20 p-5 backdrop-blur-2xl transition-colors duration-200 ease-out hover:bg-background/28 md:flex-row md:items-center md:gap-8 md:p-7"
          >
            {/* Parallax Project Image */}
            <motion.div
              key={`project-image-${project.id}`}
              {...revealMotionProps}
              variants={imageMotionVariants}
              transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
              style={{
                willChange: "transform, opacity",
                transform: "translateZ(0)",
              }}
              className="mb-6 flex max-w-full w-full shrink-0 items-center justify-center overflow-hidden rounded-lg transition-shadow duration-300 sm:h-[280px] sm:min-h-[260px] sm:w-[90%] md:mb-0 md:h-[360px] md:min-h-[360px] md:w-[460px] md:rounded-xl"
            >
              <motion.div
                whileHover={
                  reducedMotion
                    ? undefined
                    : {
                        scale: 1.015,
                        transition: {
                          duration: 0.24,
                          ease: [0.22, 1, 0.36, 1],
                        },
                      }
                }
                className="flex h-full min-h-[210px] w-full items-center justify-center sm:min-h-[260px]"
                style={{
                  willChange: "transform",
                }}
              >
                {project.animation}
              </motion.div>
            </motion.div>

            {/* Parallax Project Details */}
            <motion.div
              key={`project-details-${project.id}`}
              {...revealMotionProps}
              variants={textMotionVariants}
              transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
              className="flex min-w-0 flex-1 flex-col items-start justify-center text-left will-change-transform"
              style={{ transform: "translateZ(0)" }}
            >
              {project.role && (
                <motion.div
                  variants={roleBadgeVariants}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="pointer-events-none mb-2 text-[11px] font-semibold uppercase tracking-wider text-white/60 sm:text-xs md:mb-3"
                >
                  {project.role}
                </motion.div>
              )}

              <div>
                <h3 className="mb-3 cursor-pointer text-lg font-semibold leading-tight text-white sm:text-xl md:mb-4 md:text-2xl">
                  {project.title}
                </h3>
              </div>

              {project.tags && project.tags.length > 0 && (
                <motion.div
                  variants={tagsContainerVariants}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="pointer-events-none mb-4 flex flex-wrap gap-2"
                >
                  {project.tags.map((tag, tagIdx) => (
                    <motion.span
                      key={tagIdx}
                      variants={tagVariants}
                      transition={{ duration: 0.3, delay: 0.4 + tagIdx * 0.1 }}
                      className="inline-block rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-medium text-white/80 sm:text-xs"
                    >
                      {tag}
                    </motion.span>
                  ))}
                </motion.div>
              )}

              <p className="pointer-events-none mb-4 text-sm leading-relaxed text-white/75 sm:text-base md:mb-5 md:text-[0.9375rem]">
                {project.description}
              </p>

              <div className="mt-2 flex w-full flex-wrap items-center gap-2 md:mt-0 md:justify-end">
                <div className="flex flex-wrap items-center gap-2">
                  {project.status && (
                    <motion.span
                      variants={statusBadgeVariants}
                      transition={{ duration: 0.4, delay: 0.5 }}
                      className={`inline-block rounded-full border border-white/10 px-2.5 py-1 text-[11px] font-semibold sm:text-xs ${
                        project.status === "Live"
                          ? "bg-green-500/10 text-green-400"
                          : project.status === "Completed"
                            ? "bg-blue-500/10 text-blue-400"
                            : "bg-white/5 text-white/60"
                      }`}
                    >
                      {project.status}
                    </motion.span>
                  )}

                  {project.github && (
                    <motion.button
                      type="button"
                      variants={statusBadgeVariants}
                      transition={{ duration: 0.4, delay: 0.55 }}
                      whileHover={
                        reducedMotion
                          ? undefined
                          : {
                              scale: 1.02,
                              transition: { duration: 0.16, ease: "easeOut" },
                            }
                      }
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        window.open(
                          project.github,
                          "_blank",
                          "noopener,noreferrer",
                        );
                      }}
                      className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-semibold text-white/80 transition-colors duration-200 hover:border-white/15 sm:text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                    >
                      GitHub
                    </motion.button>
                  )}

                  {project.youtube && (
                    <motion.button
                      type="button"
                      variants={statusBadgeVariants}
                      transition={{ duration: 0.4, delay: 0.55 }}
                      whileHover={
                        reducedMotion
                          ? undefined
                          : {
                              scale: 1.02,
                              transition: { duration: 0.16, ease: "easeOut" },
                            }
                      }
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        window.open(
                          project.youtube,
                          "_blank",
                          "noopener,noreferrer",
                        );
                      }}
                      className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-semibold text-red-400 transition-colors duration-200 hover:border-white/15 sm:text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                    >
                      YouTube
                    </motion.button>
                  )}
                </div>

                <motion.div
                  whileTap={
                    reducedMotion
                      ? undefined
                      : { scale: 0.98, transition: { duration: 0.1 } }
                  }
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    navigate(`/project/${project.id}`);
                  }}
                  data-no-navigate
                  className="relative z-10"
                  style={{ pointerEvents: "auto" }}
                >
                  <Button
                    variant="outline"
                    size="lg"
                    className="min-h-10 rounded-lg border border-white/10 bg-white/5 px-6 py-2 text-sm font-medium text-white/80 shadow-sm transition-all duration-200 ease-out hover:border-white/15 hover:text-white sm:min-h-11 sm:px-8 sm:py-2.5 md:min-h-12 md:text-base focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
                  >
                    View Project
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </GlassSurface>
        </motion.div>
      </motion.div>
    );
  },
  (prevProps, nextProps) => {
    // Custom comparison to prevent unnecessary re-renders
    return (
      prevProps.project.id === nextProps.project.id &&
      prevProps.index === nextProps.index &&
      prevProps.isImageLeft === nextProps.isImageLeft
    );
  },
);

const moviePosters = {
  Interstellar:
    "https://www.themoviedb.org/t/p/w600_and_h900_bestv2/bzONet3OeCTz5q9WOkGjVpOHMSR.jpg",
  "The Godfather":
    "https://www.themoviedb.org/t/p/w600_and_h900_bestv2/3Tf8vXykYhzHdT0BtsYTp570JGQ.jpg",
  "The Lion King":
    "https://www.themoviedb.org/t/p/w600_and_h900_bestv2/sKCr78MXSLixwmZ8DyJLrpMsd15.jpg",
  "Star Wars":
    "https://www.themoviedb.org/t/p/w600_and_h900_bestv2/fai0rspsNeJCS69wHNjOdWxcI7P.jpg",
  "A Minecraft Movie":
    "https://www.themoviedb.org/t/p/w600_and_h900_bestv2/tldIoZNsAkEkppQwXGuw3aWVWyL.jpg",
  "The Dark Knight":
    "https://www.themoviedb.org/t/p/w600_and_h900_bestv2/xQPgyZOBhaz1GdCQIPf5A5VeFzO.jpg",
  "Forrest Gump":
    "https://www.themoviedb.org/t/p/w600_and_h900_bestv2/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg",
  "Jurassic Park":
    "https://www.themoviedb.org/t/p/w600_and_h900_bestv2/b1xCNnyrPebIc7EWNZIa6jhb1Ww.jpg",
  Titanic:
    "https://www.themoviedb.org/t/p/w600_and_h900_bestv2/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg",
  "Dumbo (1941)":
    "https://www.themoviedb.org/t/p/w600_and_h900_bestv2/hKDdllslMtsU9JixAv5HR9biXlp.jpg",
  "Hurry Up Tomorrow":
    "https://posters.movieposterdb.com/25_03/2025/26927452/l_hurry-up-tomorrow-movie-poster_3351643e.jpg",
  "The Idol":
    "https://www.themoviedb.org/t/p/w600_and_h900_bestv2/gO9k7t9jSdkkWVG0deMZDpELZGw.jpg",
};

const movieShowtimes = [
  { title: "Interstellar", time: "7:00 PM | 9:30 PM" },
  { title: "The Godfather", time: "6:45 PM | 9:15 PM" },
  { title: "The Lion King", time: "7:30 PM | 10:00 PM" },
  { title: "Star Wars", time: "8:00 PM | 10:30 PM" },
  { title: "A Minecraft Movie", time: "9:00 PM | 11:30 PM" },
  { title: "The Dark Knight", time: "6:00 PM | 8:45 PM" },
  { title: "Forrest Gump", time: "7:15 PM | 9:45 PM" },
  { title: "Jurassic Park", time: "5:30 PM | 8:00 PM" },
  { title: "Titanic", time: "6:30 PM | 9:44 PM" },
  { title: "Dumbo (1941)", time: "4:00 PM | 6:00 PM" },
  { title: "Hurry Up Tomorrow", time: "10:00 PM | 12:00 AM" },
  { title: "The Idol", time: "11:00 PM | 1:00 AM" },
];

const movieGenres = [
  { title: "Interstellar", genre: "Sci-Fi • 2h 49m" },
  { title: "The Godfather", genre: "Crime • 2h 55m" },
  { title: "The Lion King", genre: "Animation • 1h 28m" },
  { title: "Star Wars", genre: "Sci-Fi • 2h 1m" },
  { title: "A Minecraft Movie", genre: "Adventure • 1h 40m" },
  { title: "The Dark Knight", genre: "Action • 2h 32m" },
  { title: "Forrest Gump", genre: "Drama • 2h 22m" },
  { title: "Jurassic Park", genre: "Adventure • 2h 7m" },
  { title: "Titanic", genre: "Romance • 3h 14m" },
  { title: "Dumbo (1941)", genre: "Animation • 1h 4m" },
  { title: "Hurry Up Tomorrow", genre: "Music • 1h 30m" },
  { title: "The Idol", genre: "Drama • 1h 50m" },
];

function Projects() {
  const reducedMotion = useReducedMotion();

  const scrollToSection = useCallback((sectionId) => {
    let element = null;

    if (sectionId === "hero" || sectionId === "/") {
      element = document.getElementById("hero");
    } else if (sectionId === "skills") {
      element = document.getElementById("skills");
    } else if (sectionId === "projects") {
      element = document.getElementById("projects");
    } else if (sectionId === "contact" || sectionId === "footer") {
      element = document.getElementById("footer");
    }

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      });
    }
  }, []);

  const heroPreviewNavButtonSx = {
    borderRadius: "6px",
    border: "1px solid transparent",
    background: "transparent",
    color: "rgba(241,245,255,0.95)",
    textShadow: "0 1px 2px rgba(0,0,0,0.6)",
    fontSize: { xs: "7px", sm: "7.5px", md: "8px" },
    fontWeight: 500,
    letterSpacing: "-0.01em",
    px: { xs: 0.35, sm: 0.45, md: 0.55 },
    py: { xs: 0.15, sm: 0.18, md: 0.2 },
    cursor: "pointer",
    fontFamily: "inherit",
    transition:
      "transform 0.2s ease, background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease",
    "&:hover": {
      transform: "translateY(-1px)",
      color: "#ffffff",
      borderColor: "rgba(255,255,255,0.2)",
      backgroundColor: "rgba(255,255,255,0.1)",
    },
  };

  const portfolioAnimation = (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        minHeight: { xs: "290px", sm: "230px", md: "250px" },
        position: "relative",
        overflow: "hidden",
        background:
          "linear-gradient(140deg, #010613 0%, #050c3a 46%, #040a2b 100%)",
      }}
    >
      <Box sx={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none" }}>
        <HeroBackground animated={!reducedMotion} />
      </Box>

      <Box sx={{ position: "absolute", inset: 0, zIndex: 10 }}>
        <Suspense fallback={null}>
          <Lanyard
            position={[0, 0, 11]}
            gravity={reducedMotion ? [0, -18, 0] : [0, -40, 0]}
            fov={24}
            groupOffsetX={-1.1}
            groupOffsetY={4.25}
            scale={0.88}
            bandColor="#000000"
            bandWidth={0.36}
            introSwing={!reducedMotion}
          />
        </Suspense>
      </Box>

      <Box
        sx={{
          position: "absolute",
          top: { xs: 8, sm: 10, md: 12 },
          left: 0,
          right: 0,
          zIndex: 30,
          px: { xs: 1.2, sm: 1.4, md: 1.8 },
          pointerEvents: "none",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: { xs: 0.7, sm: 0.9, md: 1.2 },
            pointerEvents: "auto",
          }}
        >
          <Typography
            sx={{
              color: "#ffffff",
              fontFamily: HERO_PREVIEW_FONT_FAMILY,
              fontSize: { xs: "9px", sm: "8px", md: "9px" },
              fontWeight: 700,
              letterSpacing: "0.01em",
              textShadow: "0 1px 2px rgba(0,0,0,0.6)",
              whiteSpace: "nowrap",
            }}
          >
            TAYLOR FRADELLA
          </Typography>
          <Box
            sx={{
              ml: "auto",
              display: "flex",
              alignItems: "center",
              gap: { xs: 0.2, sm: 0.3, md: 0.45 },
            }}
          >
            <Typography
              component="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                scrollToSection("skills");
              }}
              sx={heroPreviewNavButtonSx}
            >
              Skills
            </Typography>
            <Typography
              component="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                scrollToSection("projects");
              }}
              sx={heroPreviewNavButtonSx}
            >
              Projects
            </Typography>
            <Typography
              component="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                scrollToSection("contact");
              }}
              sx={heroPreviewNavButtonSx}
            >
              Contact
            </Typography>
            <Typography
              sx={{
                color: "rgba(241,245,255,0.9)",
                textShadow: "0 1px 2px rgba(0,0,0,0.6)",
                fontSize: { xs: "6.8px", sm: "7px", md: "7.5px" },
                fontWeight: 500,
                letterSpacing: "-0.01em",
                px: { xs: 0.2, sm: 0.3, md: 0.35 },
                whiteSpace: "nowrap",
              }}
            >
              Reduce Animations
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box sx={{ position: "absolute", inset: 0, zIndex: 20, pointerEvents: "none" }}>
        <Box
          sx={{
            height: "100%",
            width: "100%",
            display: "grid",
            gridTemplateColumns: { xs: "0.95fr 1.05fr", sm: "0.9fr 1.1fr" },
            alignContent: "center",
            alignItems: "center",
            gap: { xs: 0.55, sm: 1.2, md: 1.6 },
            px: { xs: 1.2, sm: 1.6, md: 2.1 },
            pt: 0,
          }}
        >
          <Box sx={{ display: "block" }} />
          <Box
            sx={{
              pointerEvents: "auto",
              width: "100%",
              maxWidth: { xs: "140px", sm: "220px", md: "255px" },
              justifySelf: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              gap: { xs: 0.7, sm: 0.9, md: 1.2 },
            }}
          >
            <Typography
              component="h3"
              sx={{
                fontFamily: HERO_PREVIEW_FONT_FAMILY,
                fontWeight: 600,
                fontSize: { xs: "11px", sm: "16px", md: "24px" },
                lineHeight: { xs: 1.08, sm: 1.08, md: 1.06 },
                letterSpacing: "-0.02em",
                color: "#f8fbff",
                textShadow: "0 2px 8px rgba(0,0,0,0.45)",
                textAlign: "center",
              }}
            >
              Thoughtful UX.
              <br />
              Clean code.
              <br />
              Fast apps.
            </Typography>

            <Typography
              sx={{
                width: "100%",
                maxWidth: { xs: "130px", sm: "180px", md: "230px" },
                color: "rgba(241,245,255,0.85)",
                textShadow: "0 1px 4px rgba(0,0,0,0.55)",
                fontWeight: 400,
                fontSize: { xs: "6px", sm: "7.5px", md: "9px" },
                lineHeight: 1.35,
                textAlign: "center",
              }}
            >
              Designing and engineering profound digital experiences.
            </Typography>

            <Box
              component="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                scrollToSection("contact");
              }}
              sx={{
                mt: { xs: 0.2, sm: 0.25, md: 0.3 },
                alignSelf: "center",
                borderRadius: "999px",
                border: "1px solid rgba(255,255,255,0.25)",
                background: "rgba(255,255,255,0.1)",
                color: "#f6f8ff",
                px: { xs: 1.2, sm: 1.3, md: 1.6 },
                py: { xs: 0.32, sm: 0.34, md: 0.42 },
                minHeight: { xs: "22px", sm: "24px", md: "28px" },
                fontSize: { xs: "7px", sm: "7.5px", md: "9px" },
                fontWeight: 600,
                boxShadow: "0 8px 20px rgba(2,6,23,0.28)",
                backdropFilter: "blur(10px)",
                cursor: "pointer",
                transition:
                  "transform 0.2s ease, border-color 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease",
                "&:hover": {
                  transform: "translateY(-1px)",
                  borderColor: "rgba(255,255,255,0.35)",
                  background: "rgba(255,255,255,0.18)",
                  boxShadow: "0 12px 26px rgba(2,6,23,0.34)",
                },
              }}
            >
              Get in Touch
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );

  const lionsTheaterAnimation = (
    <Box
      sx={{
        width: "100%",
        height: { xs: "290px", sm: "100%" },
        minHeight: { xs: "290px", sm: "230px", md: "250px" },
        maxHeight: { xs: "290px", sm: "100%" },
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(140deg, #060b1a 0%, #0b1328 48%, #090f1f 100%)",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <ProjectFloatingLines
        theme={projectFloatingLineThemes.lions}
        reducedMotion={reducedMotion}
      />
      {/* Website Preview */}
      <Box
        sx={{
          position: "relative",
          width: { xs: "100%", sm: "92%", md: "88%" },
          maxWidth: { xs: "100%", sm: "92%", md: "88%" },
          minWidth: 0,
          height: { xs: "100%", sm: "92%", md: "90%" },
          maxHeight: { xs: "100%", sm: "92%", md: "90%" },
          minHeight: 0,
          aspectRatio: "auto",
          borderRadius: { xs: 0, sm: "10px", md: "12px" },
          overflow: "hidden",
          border: "1px solid rgba(255,255,255,0.12)",
          background: "rgba(7,10,18,0.8)",
          backdropFilter: "blur(8px)",
          display: "flex",
          flexDirection: "column",
          zIndex: 1,
          mx: "auto",
        }}
      >
        {/* Browser Header */}
        <Box
          sx={{
            height: { xs: "24px", sm: "26px", md: "28px" },
            background: "rgba(255,255,255,0.04)",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            display: "flex",
            alignItems: "center",
            padding: { xs: "0 8px", sm: "0 9px", md: "0 10px" },
            gap: { xs: "4px", sm: "5px", md: "6px" },
          }}
        >
          {["#ff5f57", "#febc2e", "#28c840"].map((color, i) => (
            <Box
              key={i}
              sx={{
                width: { xs: "6px", sm: "7px", md: "8px" },
                height: { xs: "6px", sm: "7px", md: "8px" },
                borderRadius: "50%",
                background: color,
                opacity: 0.9,
              }}
            />
          ))}
          <Box
            sx={{
              flex: 1,
              height: "13px",
              margin: "0 10px",
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: "999px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography
              variant="caption"
              sx={{
                fontSize: { xs: "7px", sm: "7.5px", md: "8px" },
                color: "rgba(241,245,249,0.75)",
                fontWeight: 500,
              }}
            >
              lionsdencinemas.com
            </Typography>
          </Box>
        </Box>

        {/* Website Content */}
        <Box
          sx={{
            height: {
              xs: "calc(100% - 24px)",
              sm: "calc(100% - 26px)",
              md: "calc(100% - 28px)",
            },
            padding: {
              xs: "8px 6px 6px 6px",
              sm: "10px 8px 8px 8px",
              md: "12px 10px 10px 10px",
            },
            background:
              "linear-gradient(180deg, rgba(2,6,23,0.76) 0%, rgba(2,6,23,0.94) 100%)",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            overflowY: "auto",
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": { display: "none" },
          }}
        >
          <Box
            sx={{
              display: "flex",
              gap: "10px",
              padding: {
                xs: "3px 0 6px 0",
                sm: "3.5px 0 7px 0",
                md: "4px 0 8px 0",
              },
              borderBottom: "1px solid rgba(255,255,255,0.12)",
            }}
          >
            {["Home", "Movies", "Showtimes", "About"].map((item, i) => (
              <Typography
                key={i}
                sx={{
                  fontSize: { xs: "7.5px", sm: "8.5px", md: "9px" },
                  color: i === 0 ? "#fda4af" : "rgba(241,245,249,0.78)",
                  fontWeight: i === 0 ? 700 : 500,
                  letterSpacing: 0.2,
                }}
              >
                {item}
              </Typography>
            ))}
          </Box>

          <Box
            sx={{
              height: { xs: "32%", sm: "35%", md: "38%" },
              background:
                "linear-gradient(130deg, rgba(248,113,113,0.2) 0%, rgba(15,23,42,0.28) 100%)",
              border: "1px solid rgba(255,255,255,0.14)",
              borderRadius: { xs: "4px", sm: "5px", md: "6px" },
              padding: { xs: "4px 6px", sm: "6px 8px", md: "8px 10px" },
              display: "flex",
              gap: { xs: "6px", sm: "8px", md: "10px" },
              alignItems: "center",
              animation: "lionsNowShowingBreath 3.8s ease-in-out infinite",
              "@keyframes lionsNowShowingBreath": {
                "0%, 100%": {
                  transform: "translateY(0px)",
                  borderColor: "rgba(255,255,255,0.14)",
                },
                "50%": {
                  transform: "translateY(-1px)",
                  borderColor: "rgba(248,113,113,0.35)",
                },
              },
            }}
          >
            <Box
              component="img"
              src={moviePosters["Dumbo (1941)"]}
              alt="Dumbo (1941) poster"
              sx={{
                width: { xs: 36, sm: 40, md: 44 },
                height: { xs: 50, sm: 56, md: 62 },
                objectFit: "cover",
                borderRadius: "4px",
                background: "rgba(15,23,42,0.6)",
                mr: { xs: 1.5, sm: 1.75, md: 2 },
                flexShrink: 0,
              }}
            />
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                sx={{
                  fontSize: { xs: "8px", sm: "9.5px", md: "11px" },
                  color: "#f8fafc",
                  fontWeight: 700,
                  marginBottom: "2px",
                  lineHeight: 1.2,
                }}
                noWrap
              >
                Dumbo (1941)
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <Box
                  sx={{
                    width: { xs: "4px", sm: "4px", md: "5px" },
                    height: { xs: "4px", sm: "4px", md: "5px" },
                    borderRadius: "50%",
                    background: "#34d399",
                    animation: "lionsNowShowingPulse 1.6s ease-in-out infinite",
                    "@keyframes lionsNowShowingPulse": {
                      "0%, 100%": { opacity: 0.45, transform: "scale(0.85)" },
                      "50%": { opacity: 1, transform: "scale(1.1)" },
                    },
                  }}
                />
                <Typography
                  sx={{
                    fontSize: { xs: "6.5px", sm: "7px", md: "8px" },
                    color: "rgba(241,245,249,0.72)",
                    lineHeight: 1.2,
                  }}
                  noWrap
                >
                  Now Showing - Disney Classic
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box
            sx={{
              flex: 1,
              overflow: "hidden",
              position: "relative",
              mt: 1,
              overflowY: "auto",
              scrollbarWidth: "none",
              "&::-webkit-scrollbar": { display: "none" },
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: { xs: "4px", sm: "5.5px", md: "7px" },
                position: "relative",
                width: "100%",
              }}
            >
              {movieShowtimes.map((movie, i) => (
                <Box
                  key={i}
                  sx={{
                    minHeight: "28px",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "4px",
                    padding: "4px 8px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <Box
                    component="img"
                    src={
                      moviePosters[movie.title] ||
                      "https://placehold.co/32x44/222/fff?text=No+Image"
                    }
                    alt={movie.title + " poster"}
                    sx={{
                      width: 28,
                      height: 38,
                      objectFit: "cover",
                      borderRadius: "2.5px",
                      background: "rgba(15,23,42,0.6)",
                      mr: 1,
                    }}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      sx={{
                        fontSize: { xs: "7px", sm: "7.5px", md: "8px" },
                        color: "#f8fafc",
                        fontWeight: 700,
                      }}
                    >
                      {movie.title}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: { xs: "6px", sm: "6.5px", md: "7px" },
                        color: "rgba(241,245,249,0.72)",
                      }}
                    >
                      {movie.time}
                    </Typography>
                  </Box>
                </Box>
              ))}
              {movieShowtimes.map((movie, i) => (
                <Box
                  key={"repeat-" + i}
                  sx={{
                    minHeight: "28px",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "4px",
                    padding: "4px 8px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <Box
                    component="img"
                    src={
                      moviePosters[movie.title] ||
                      "https://placehold.co/32x44/222/fff?text=No+Image"
                    }
                    alt={movie.title + " poster"}
                    sx={{
                      width: 28,
                      height: 38,
                      objectFit: "cover",
                      borderRadius: "2.5px",
                      background: "rgba(15,23,42,0.6)",
                      mr: 1,
                    }}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      sx={{
                        fontSize: { xs: "7px", sm: "7.5px", md: "8px" },
                        color: "#f8fafc",
                        fontWeight: 700,
                      }}
                    >
                      {movie.title}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: { xs: "6px", sm: "6.5px", md: "7px" },
                        color: "rgba(241,245,249,0.72)",
                      }}
                    >
                      {movie.time}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Mobile App Preview */}
      <Box
        sx={{
          position: "absolute",
          right: { xs: "3vw", sm: "8%", md: "10%" },
          top: { xs: "50%", md: "50%" },
          transform: "translateY(-50%)",
          width: { xs: "124px", sm: "150px", md: "160px" },
          maxWidth: { xs: "180px", sm: "200px", md: "220px" },
          minWidth: { xs: "100px", sm: "110px" },
          height: { xs: "280px", sm: "300px", md: "340px" },
          maxHeight: { xs: "400px", sm: "380px", md: "420px" },
          minHeight: { xs: "200px", sm: "240px", md: "240px" },
          zIndex: 2,
          perspective: "1000px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: "100%",
            borderRadius: { xs: "34px", sm: "36px", md: "40px" },
            p: { xs: "4px", sm: "4.5px", md: "5px" },
            background:
              "linear-gradient(150deg, #161c2b 0%, #0a0f1d 62%, #1c2231 100%)",
            border: "1px solid rgba(255,255,255,0.24)",
            transform: "rotate(-0.65deg)",
            animation: "lionsPhoneFloat 4.6s ease-in-out infinite",
            "@keyframes lionsPhoneFloat": {
              "0%, 100%": { transform: "rotate(-0.65deg) translateY(0px)" },
              "50%": { transform: "rotate(0.15deg) translateY(-3px)" },
            },
          }}
        >
          {/* Side hardware buttons */}
          <Box
            sx={{
              position: "absolute",
              left: { xs: "-3px", sm: "-3.5px", md: "-4px" },
              top: { xs: "22%", sm: "22%", md: "22%" },
              width: { xs: "2px", sm: "2.5px", md: "3px" },
              height: { xs: "9%", sm: "9%", md: "9%" },
              borderRadius: "4px",
              background: "linear-gradient(180deg, #4b5563 0%, #111827 100%)",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              left: { xs: "-3px", sm: "-3.5px", md: "-4px" },
              top: { xs: "33%", sm: "33%", md: "33%" },
              width: { xs: "2px", sm: "2.5px", md: "3px" },
              height: { xs: "14%", sm: "14%", md: "14%" },
              borderRadius: "4px",
              background: "linear-gradient(180deg, #4b5563 0%, #111827 100%)",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              right: { xs: "-3px", sm: "-3.5px", md: "-4px" },
              top: { xs: "37%", sm: "37%", md: "37%" },
              width: { xs: "2px", sm: "2.5px", md: "3px" },
              height: { xs: "20%", sm: "20%", md: "20%" },
              borderRadius: "4px",
              background: "linear-gradient(180deg, #4b5563 0%, #111827 100%)",
            }}
          />

          <Box
            sx={{
              position: "relative",
              width: "100%",
              height: "100%",
              borderRadius: { xs: "30px", sm: "32px", md: "36px" },
              overflow: "hidden",
              background:
                "linear-gradient(180deg, rgba(6,11,24,0.94) 0%, rgba(2,6,23,0.98) 100%)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            {/* Dynamic island */}
            <Box
              sx={{
                position: "absolute",
                top: { xs: "7px", sm: "8px", md: "9px" },
                left: "50%",
                transform: "translateX(-50%)",
                width: { xs: "34px", sm: "38px", md: "42px" },
                height: { xs: "9px", sm: "10px", md: "11px" },
                borderRadius: "999px",
                background: "rgba(0,0,0,0.92)",
                zIndex: 15,
              }}
            />

            {/* Status row */}
            <Box
              sx={{
                height: { xs: "22px", sm: "24px", md: "26px" },
                px: { xs: 1.2, sm: 1.5, md: 1.8 },
                pt: { xs: "5px", sm: "6px", md: "7px" },
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                color: "rgba(241,245,249,0.9)",
                fontSize: { xs: "7px", sm: "7.5px", md: "8px" },
                fontWeight: 700,
                letterSpacing: 0.2,
              }}
            >
              <Typography sx={{ fontSize: "inherit", fontWeight: "inherit" }}>
                9:41
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: "3px" }}>
                <Box
                  sx={{
                    width: "9px",
                    height: "5px",
                    border: "1px solid rgba(241,245,249,0.8)",
                    borderRadius: "2px",
                    position: "relative",
                  }}
                >
                  <Box
                    sx={{
                      position: "absolute",
                      top: "1px",
                      left: "1px",
                      width: "5px",
                      height: "2px",
                      background: "rgba(241,245,249,0.9)",
                      borderRadius: "1px",
                    }}
                  />
                </Box>
                <Box
                  sx={{
                    width: "2px",
                    height: "3px",
                    background: "rgba(241,245,249,0.8)",
                    borderRadius: "1px",
                    transform: "translateX(-2px)",
                  }}
                />
              </Box>
            </Box>

            <Box
              sx={{
                height: "calc(100% - 22px)",
                px: "7px",
                pb: "9px",
                background:
                  "linear-gradient(180deg, rgba(2,6,23,0.82) 0%, rgba(2,6,23,0.98) 100%)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  height: "26px",
                  mb: "6px",
                  background:
                    "linear-gradient(90deg, rgba(248,113,113,0.24), rgba(30,41,59,0.4))",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography
                  sx={{
                    fontSize: { xs: "8px", sm: "8.5px", md: "9px" },
                    color: "#f8fafc",
                    fontWeight: 700,
                    letterSpacing: 1,
                    lineHeight: 1.1,
                  }}
                  noWrap
                >
                  LIONS DEN CINEMAS
                </Typography>
              </Box>

              <Box
                className="auto-scroll-movie-list"
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "7px",
                  position: "absolute",
                  left: "7px",
                  right: "7px",
                  width: "auto",
                  animation: "autoScrollIphone 6s linear infinite",
                  "@keyframes autoScrollIphone": {
                    "0%": { top: "38px" },
                    "50%": { top: "-22%" },
                    "100%": { top: "38px" },
                  },
                }}
              >
                {movieGenres.map((movie, i) => (
                  <Box
                    key={i}
                    sx={{
                      minHeight: "38px",
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "7px",
                      padding: "6px 7px 5px 7px",
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "flex-start",
                      gap: "7px",
                    }}
                  >
                    <Box
                      component="img"
                      src={
                        moviePosters[movie.title] ||
                        "https://placehold.co/32x44/222/fff?text=No+Image"
                      }
                      alt={movie.title + " poster"}
                      sx={{
                        width: { xs: 22, sm: 24, md: 26 },
                        height: { xs: 30, sm: 33, md: 36 },
                        objectFit: "cover",
                        borderRadius: "2.5px",
                        background: "rgba(15,23,42,0.6)",
                      }}
                    />
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography
                        sx={{
                          fontSize: { xs: "7px", sm: "7.75px", md: "8.5px" },
                          color: "#f8fafc",
                          fontWeight: 700,
                          lineHeight: 1.1,
                        }}
                        noWrap
                      >
                        {movie.title}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: { xs: "5.5px", sm: "6px", md: "6.5px" },
                          color: "rgba(241,245,249,0.72)",
                          lineHeight: 1.1,
                        }}
                        noWrap
                      >
                        {movie.genre}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>

            {/* Home indicator */}
            <Box
              sx={{
                position: "absolute",
                bottom: { xs: "6px", sm: "7px", md: "8px" },
                left: "50%",
                transform: "translateX(-50%)",
                width: { xs: "18%", sm: "17%", md: "16%" },
                height: { xs: "1.5px", sm: "1.75px", md: "2px" },
                background: "rgba(241,245,249,0.55)",
                borderRadius: "3px",
                zIndex: 10,
              }}
            />

            {/* Glass sheen */}
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                pointerEvents: "none",
                background:
                  "linear-gradient(165deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.06) 16%, rgba(255,255,255,0) 35%)",
              }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
  const bloodSugarMonitorAnimation = (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        minHeight: { xs: "290px", sm: "230px", md: "250px" },
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(145deg, #040b1f 0%, #07123a 52%, #061031 100%)",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <ProjectFloatingLines
        theme={projectFloatingLineThemes.sweetspot}
        reducedMotion={reducedMotion}
      />
      <Box
        component={motion.div}
        animate={{ y: [0, -3, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
        sx={{
          position: "relative",
          zIndex: 1,
          width: { xs: "88%", sm: "78%", md: "64%" },
          minWidth: { xs: "238px", sm: "280px", md: "330px" },
          maxWidth: { xs: "360px", sm: "430px", md: "500px" },
          minHeight: { xs: "250px", sm: "228px", md: "240px" },
          maxHeight: "100%",
          px: { xs: 1.35, sm: 1.55, md: 1.9 },
          py: { xs: 1.25, sm: 1.5, md: 1.8 },
          borderRadius: { xs: "13px", sm: "15px", md: "17px" },
          border: "1px solid rgba(116,154,255,0.24)",
          background: "linear-gradient(180deg, #07102a 0%, #050b1f 100%)",
          boxShadow:
            "0 22px 56px rgba(2,6,23,0.62), inset 0 1px 0 rgba(255,255,255,0.08)",
          display: "flex",
          flexDirection: "column",
          gap: { xs: 1, sm: 1.15, md: 1.4 },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography
            sx={{
              color: "#e2e8f0",
              fontSize: { xs: "10px", sm: "11px", md: "13px" },
              fontWeight: 700,
              letterSpacing: "-0.01em",
            }}
          >
            SweetSpot
          </Typography>
          <Box
            sx={{
              borderRadius: "999px",
              border: "1px solid rgba(148,163,184,0.28)",
              background: "rgba(15,23,42,0.55)",
              px: { xs: 0.7, sm: 0.9, md: 1.05 },
              py: { xs: 0.26, sm: 0.32, md: 0.4 },
              display: "flex",
              alignItems: "center",
              gap: { xs: 0.45, sm: 0.55, md: 0.65 },
            }}
          >
            <Box
              component={motion.div}
              animate={{ opacity: [0.45, 1, 0.45], scale: [0.9, 1.15, 0.9] }}
              transition={{
                duration: 1.6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              sx={{
                width: { xs: "5px", sm: "5.5px", md: "6px" },
                height: { xs: "5px", sm: "5.5px", md: "6px" },
                borderRadius: "50%",
                background: "#34d399",
                boxShadow: "0 0 10px rgba(52,211,153,0.75)",
              }}
            />
            <Typography
              sx={{
                color: "rgba(226,232,240,0.9)",
                fontSize: { xs: "7px", sm: "8px", md: "9px" },
                fontWeight: 600,
              }}
            >
              Connected
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.5 }}>
            <Typography
              component={motion.span}
              animate={{ opacity: [0.86, 1, 0.86] }}
              transition={{
                duration: 2.4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              sx={{
                color: "#f8fafc",
                fontSize: { xs: "38px", sm: "44px", md: "48px" },
                lineHeight: 0.9,
                fontWeight: 700,
                letterSpacing: "-0.03em",
              }}
            >
              124
            </Typography>
            <Typography
              sx={{
                color: "rgba(226,232,240,0.9)",
                fontSize: { xs: "18px", sm: "20px", md: "22px" },
                fontWeight: 600,
              }}
            >
              mg/dL
            </Typography>
          </Box>
          <Box
            sx={{
              position: "relative",
              overflow: "hidden",
              borderRadius: "999px",
              border: "1px solid rgba(16,185,129,0.45)",
              background: "rgba(6,95,70,0.2)",
              px: { xs: 0.75, sm: 0.95, md: 1.1 },
              py: { xs: 0.32, sm: 0.4, md: 0.48 },
              display: "flex",
              alignItems: "center",
              gap: { xs: 0.45, sm: 0.55, md: 0.7 },
              "&::after": {
                content: '""',
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(110deg, transparent 35%, rgba(110,231,183,0.24) 50%, transparent 70%)",
                transform: "translateX(-120%)",
                animation: "sweetSpotAiSweep 2.2s linear infinite",
              },
              "@keyframes sweetSpotAiSweep": {
                "0%": { transform: "translateX(-120%)" },
                "100%": { transform: "translateX(120%)" },
              },
            }}
          >
            <Box
              component={motion.div}
              animate={{ opacity: [0.5, 1, 0.5], scale: [0.82, 1.08, 0.82] }}
              transition={{
                duration: 1.45,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              sx={{
                width: { xs: "5px", sm: "5.5px", md: "6px" },
                height: { xs: "5px", sm: "5.5px", md: "6px" },
                borderRadius: "50%",
                background: "#34d399",
              }}
            />
            <Typography
              sx={{
                color: "#6ee7b7",
                fontSize: { xs: "7px", sm: "8px", md: "9px" },
                fontWeight: 700,
              }}
            >
              AI Processing
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            position: "relative",
            borderRadius: { xs: "8px", sm: "9px", md: "10px" },
            border: "1px solid rgba(148,163,184,0.24)",
            background:
              "linear-gradient(180deg, rgba(13,23,49,0.78) 0%, rgba(8,15,35,0.88) 100%)",
            overflow: "hidden",
            minHeight: { xs: "76px", sm: "86px", md: "102px" },
            px: { xs: 1.05, sm: 1.2, md: 1.4 },
            py: { xs: 0.9, sm: 1.05, md: 1.2 },
          }}
        >
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              opacity: 0.42,
              background:
                "linear-gradient(transparent 24%, rgba(148,163,184,0.2) 25%, transparent 26%, transparent 49%, rgba(148,163,184,0.2) 50%, transparent 51%, transparent 74%, rgba(148,163,184,0.2) 75%, transparent 76%)",
            }}
          />
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 100 45"
            preserveAspectRatio="none"
            style={{ position: "absolute", inset: 0 }}
          >
            <defs>
              <linearGradient
                id="sweetspotLineGradientV2"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="#2dd4bf" />
                <stop offset="50%" stopColor="#34d399" />
                <stop offset="100%" stopColor="#5eead4" />
              </linearGradient>
              <linearGradient
                id="sweetspotAreaGradientV2"
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
              >
                <stop offset="0%" stopColor="rgba(52,211,153,0.25)" />
                <stop offset="100%" stopColor="rgba(52,211,153,0.02)" />
              </linearGradient>
              <filter id="sweetspotGlowV2">
                <feGaussianBlur stdDeviation="1.15" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <motion.path
              d="M0,34 C11,33 20,34 30,30 C40,26 49,28 58,24 C67,21 76,23 86,22 C92,22 97,21 100,21 L100,45 L0,45 Z"
              fill="url(#sweetspotAreaGradientV2)"
              initial={{ opacity: 0.45 }}
              animate={{ opacity: [0.45, 0.7, 0.45] }}
              transition={{
                duration: 3.8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            <motion.path
              d="M0,34 C11,33 20,34 30,30 C40,26 49,28 58,24 C67,21 76,23 86,22 C92,22 97,21 100,21"
              fill="none"
              stroke="url(#sweetspotLineGradientV2)"
              strokeWidth="2.1"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#sweetspotGlowV2)"
              initial={{ pathLength: 0.2, opacity: 0.82 }}
              animate={{ pathLength: [0.2, 1, 1], opacity: [0.82, 1, 0.9] }}
              transition={{
                duration: 3.8,
                repeat: Infinity,
                ease: [0.22, 1, 0.36, 1],
                times: [0, 0.52, 1],
              }}
            />

            {[
              { x: 8, y: 34 },
              { x: 22, y: 33 },
              { x: 44, y: 27 },
              { x: 66, y: 22 },
              { x: 84, y: 22 },
              { x: 95, y: 21 },
            ].map((point, index) => (
              <motion.circle
                key={`${point.x}-${point.y}`}
                cx={point.x}
                cy={point.y}
                r={index === 4 ? 2.7 : 1.6}
                fill="#34d399"
                initial={{ opacity: 0.45 }}
                animate={{ opacity: [0.45, 1, 0.45] }}
                transition={{
                  duration: 2.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: index * 0.16,
                }}
              />
            ))}
          </svg>
        </Box>

        <Box
          sx={{
            borderRadius: { xs: "8px", sm: "9px", md: "10px" },
            border: "1px solid rgba(148,163,184,0.24)",
            background:
              "linear-gradient(180deg, rgba(6,16,39,0.75) 0%, rgba(5,11,28,0.9) 100%)",
            px: { xs: 1.05, sm: 1.2, md: 1.4 },
            py: { xs: 0.85, sm: 1, md: 1.1 },
          }}
        >
          <Typography
            component="div"
            sx={{
              color: "#e2e8f0",
              fontSize: { xs: "8px", sm: "9px", md: "10px" },
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: 0.55,
              mb: { xs: 0.45, sm: 0.6, md: 0.75 },
            }}
          >
            <Box
              component={motion.div}
              animate={{ opacity: [0.4, 1, 0.4], scale: [0.88, 1.14, 0.88] }}
              transition={{
                duration: 1.6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              sx={{
                width: { xs: "5px", sm: "5.5px", md: "6px" },
                height: { xs: "5px", sm: "5.5px", md: "6px" },
                borderRadius: "50%",
                background: "#34d399",
              }}
            />
            AI Analysis
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.4 }}>
            <Typography
              sx={{
                color: "rgba(226,232,240,0.86)",
                fontSize: { xs: "7px", sm: "8px", md: "9px" },
                fontWeight: 600,
                fontFamily: "monospace",
              }}
            >
              {">"} Dexcom API stream stable
            </Typography>
            <Typography
              sx={{
                color: "rgba(226,232,240,0.86)",
                fontSize: { xs: "7px", sm: "8px", md: "9px" },
                fontWeight: 600,
                fontFamily: "monospace",
              }}
            >
              {">"} Grok AI: consider light exercise
            </Typography>
            <Typography
              sx={{
                color: "rgba(226,232,240,0.9)",
                fontSize: { xs: "7px", sm: "8px", md: "9px" },
                fontWeight: 700,
                fontFamily: "monospace",
              }}
            >
              {">"} Next reading predicted: 118 mg/dL
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
  const worklyAnimation = (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(140deg, #070d1f 0%, #101a33 50%, #0b1226 100%)",
        overflow: "hidden",
        position: "relative",
        minHeight: { xs: "290px", sm: "230px", md: "250px" },
      }}
    >
      <ProjectFloatingLines
        theme={projectFloatingLineThemes.workly}
        reducedMotion={reducedMotion}
      />
      <Box
        sx={{
          position: "relative",
          width: { xs: "118px", sm: "128px", md: "152px" },
          height: { xs: "238px", sm: "258px", md: "308px" },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1,
        }}
      >
        {/* Side hardware buttons */}
        <Box
          sx={{
            position: "absolute",
            left: { xs: "-3px", sm: "-3.5px", md: "-4px" },
            top: { xs: "22%", sm: "22%", md: "22%" },
            width: { xs: "2px", sm: "2.5px", md: "3px" },
            height: { xs: "9%", sm: "9%", md: "9%" },
            borderRadius: "4px",
            background: "linear-gradient(180deg, #4b5563 0%, #111827 100%)",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            left: { xs: "-3px", sm: "-3.5px", md: "-4px" },
            top: { xs: "33%", sm: "33%", md: "33%" },
            width: { xs: "2px", sm: "2.5px", md: "3px" },
            height: { xs: "14%", sm: "14%", md: "14%" },
            borderRadius: "4px",
            background: "linear-gradient(180deg, #4b5563 0%, #111827 100%)",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            right: { xs: "-3px", sm: "-3.5px", md: "-4px" },
            top: { xs: "37%", sm: "37%", md: "37%" },
            width: { xs: "2px", sm: "2.5px", md: "3px" },
            height: { xs: "20%", sm: "20%", md: "20%" },
            borderRadius: "4px",
            background: "linear-gradient(180deg, #4b5563 0%, #111827 100%)",
          }}
        />

        {/* iPhone body */}
        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: "100%",
            borderRadius: { xs: "34px", sm: "36px", md: "42px" },
            p: { xs: "4px", sm: "4.5px", md: "5px" },
            background:
              "linear-gradient(150deg, #151922 0%, #090b10 60%, #1b1f2a 100%)",
            border: "1px solid rgba(255,255,255,0.18)",
          }}
        >
          <Box
            sx={{
              position: "relative",
              width: "100%",
              height: "100%",
              borderRadius: { xs: "30px", sm: "32px", md: "38px" },
              overflow: "hidden",
              background:
                "radial-gradient(circle at 24% 10%, #cc4b59 0%, #b33845 35%, #8f2431 62%, #7a1f2b 100%)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            {/* Screen gloss */}
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                pointerEvents: "none",
                background:
                  "linear-gradient(165deg, rgba(255,255,255,0.26) 0%, rgba(255,255,255,0.08) 16%, rgba(255,255,255,0) 35%)",
                zIndex: 25,
              }}
            />

            {/* Dynamic island */}
            <Box
              sx={{
                position: "absolute",
                top: { xs: "7px", sm: "8px", md: "9px" },
                left: "50%",
                transform: "translateX(-50%)",
                width: { xs: "52px", sm: "56px", md: "66px" },
                height: { xs: "15px", sm: "16px", md: "18px" },
                borderRadius: "999px",
                background: "#020204",
                zIndex: 30,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                px: { xs: 0.75, sm: 0.85, md: 1 },
              }}
            >
              <Box
                sx={{
                  width: { xs: "6px", sm: "6px", md: "7px" },
                  height: { xs: "6px", sm: "6px", md: "7px" },
                  borderRadius: "50%",
                  background: "#0f172a",
                  border: "1px solid rgba(255,255,255,0.12)",
                }}
              />
              <Box
                sx={{
                  width: { xs: "18px", sm: "19px", md: "22px" },
                  height: { xs: "4px", sm: "4px", md: "5px" },
                  borderRadius: "999px",
                  background: "rgba(255,255,255,0.12)",
                }}
              />
            </Box>

            {/* Status bar */}
            <Box
              sx={{
                position: "absolute",
                top: { xs: "10px", sm: "11px", md: "12px" },
                left: { xs: "10px", sm: "11px", md: "12px" },
                right: { xs: "10px", sm: "11px", md: "12px" },
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                zIndex: 20,
              }}
            >
              <Typography
                sx={{
                  fontSize: { xs: "7px", sm: "8px", md: "9px" },
                  color: "#ffffff",
                  fontWeight: 700,
                  letterSpacing: "0.01em",
                }}
              >
                9:41
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: { xs: 0.5, sm: 0.6, md: 0.7 },
                }}
              >
                <Box
                  sx={{ display: "flex", alignItems: "flex-end", gap: "1px" }}
                >
                  {[40, 60, 80].map((height, i) => (
                    <Box
                      key={i}
                      sx={{
                        width: "2px",
                        height: `${height / 20}px`,
                        borderRadius: "1px",
                        background: "#fff",
                        opacity: 0.95,
                      }}
                    />
                  ))}
                </Box>
                <Box
                  sx={{
                    width: { xs: "12px", sm: "13px", md: "14px" },
                    height: { xs: "7px", sm: "7px", md: "8px" },
                    borderRadius: "2px",
                    border: "1.2px solid rgba(255,255,255,0.9)",
                    position: "relative",
                  }}
                >
                  <Box
                    sx={{
                      position: "absolute",
                      right: "-2.8px",
                      top: "1.7px",
                      width: "1.8px",
                      height: "3px",
                      borderRadius: "1px",
                      background: "rgba(255,255,255,0.9)",
                    }}
                  />
                  <Box
                    sx={{
                      position: "absolute",
                      left: "1.2px",
                      top: "1.2px",
                      width: "65%",
                      height: "calc(100% - 2.4px)",
                      borderRadius: "1px",
                      background: "#ffffff",
                    }}
                  />
                </Box>
              </Box>
            </Box>

            {/* App content */}
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                pt: { xs: "28px", sm: "30px", md: "36px" },
                pb: { xs: "14px", sm: "16px", md: "18px" },
                px: { xs: 1.5, sm: 1.75, md: 2 },
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <motion.div
                animate={{
                  x: [0, 10, -10, 0],
                  rotate: [0, 2.4, -2.4, 0],
                }}
                transition={{
                  duration: 3.4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{
                  position: "absolute",
                  width: "88%",
                  height: "68%",
                  top: "13%",
                  left: "6%",
                  transformOrigin: "50% 100%",
                }}
              >
                <Box
                  sx={{
                    width: "100%",
                    height: "100%",
                    background:
                      "linear-gradient(180deg, #ffffff 0%, #f7f8fa 100%)",
                    borderRadius: { xs: "14px", sm: "15px", md: "18px" },
                    p: { xs: 1, sm: 1.2, md: 1.45 },
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      mb: { xs: 0.5, sm: 0.6, md: 0.8 },
                    }}
                  >
                    <Box
                      sx={{
                        width: { xs: "20px", sm: "22px", md: "26px" },
                        height: { xs: "20px", sm: "22px", md: "26px" },
                        borderRadius: "7px",
                        background:
                          "linear-gradient(145deg, #f6e7cb 0%, #f2d6a6 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <BriefcaseBusiness
                        size={12}
                        color="#8b5e34"
                        strokeWidth={2.3}
                      />
                    </Box>
                  </Box>

                  <Typography
                    sx={{
                      fontSize: { xs: "10px", sm: "11px", md: "13px" },
                      fontWeight: 700,
                      color: "#0f172a",
                      mb: { xs: 0.125, sm: 0.2, md: 0.3 },
                      textAlign: "center",
                      letterSpacing: "-0.01em",
                      lineHeight: 1.2,
                    }}
                  >
                    Software
                    <br />
                    Engineer
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: { xs: "7.5px", sm: "8.5px", md: "10px" },
                      color: "#6b7280",
                      mb: { xs: 0.75, sm: 0.9, md: 1 },
                      textAlign: "center",
                      fontWeight: 500,
                      lineHeight: 1.2,
                    }}
                  >
                    Tech Company Inc.
                  </Typography>

                  <Box
                    sx={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      gap: { xs: 0.45, sm: 0.55, md: 0.65 },
                      justifyContent: "center",
                    }}
                  >
                    {[
                      {
                        icon: <MapPin size={10} color="#d946ef" />,
                        label: "Remote",
                      },
                      {
                        icon: <Banknote size={10} color="#ca8a04" />,
                        label: "$80k-$120k",
                      },
                      {
                        icon: <Clock3 size={10} color="#f43f5e" />,
                        label: "Full-time",
                      },
                    ].map((item) => (
                      <Box
                        key={item.label}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: { xs: 0.45, sm: 0.55, md: 0.7 },
                        }}
                      >
                        <Box
                          sx={{
                            width: { xs: "13px", sm: "14px", md: "16px" },
                            height: { xs: "13px", sm: "14px", md: "16px" },
                            borderRadius: "999px",
                            background: "rgba(15,23,42,0.06)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {item.icon}
                        </Box>
                        <Typography
                          sx={{
                            fontSize: { xs: "7.5px", sm: "8px", md: "9px" },
                            color: "#334155",
                            fontWeight: 600,
                            lineHeight: 1.2,
                          }}
                        >
                          {item.label}
                        </Typography>
                      </Box>
                    ))}
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      gap: { xs: 0.3, sm: 0.35, md: 0.45 },
                      flexWrap: "wrap",
                      justifyContent: "center",
                      mt: "auto",
                      pt: { xs: 0.4, sm: 0.5, md: 0.65 },
                    }}
                  >
                    {[
                      { name: "React", color: "#0b1220", bg: "#67e8f9" },
                      { name: "Node.js", color: "#ffffff", bg: "#16a34a" },
                      { name: "TypeScript", color: "#ffffff", bg: "#2563eb" },
                    ].map((tag) => (
                      <Box
                        key={tag.name}
                        sx={{
                          bgcolor: tag.bg,
                          color: tag.color,
                          px: { xs: 0.5, sm: 0.6, md: 0.8 },
                          py: { xs: 0.15, sm: 0.22, md: 0.3 },
                          borderRadius: { xs: "4px", sm: "5px", md: "6px" },
                          fontSize: { xs: "5.8px", sm: "6.4px", md: "8px" },
                          fontWeight: 700,
                          lineHeight: 1.2,
                        }}
                      >
                        {tag.name}
                      </Box>
                    ))}
                  </Box>
                </Box>
              </motion.div>

              <Box
                sx={{
                  position: "absolute",
                  bottom: { xs: "12px", sm: "14px", md: "16px" },
                  left: "50%",
                  transform: "translateX(-50%)",
                  display: "flex",
                  gap: { xs: 2, sm: 2.4, md: 2.8 },
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 20,
                }}
              >
                <Box
                  sx={{
                    width: { xs: "34px", sm: "38px", md: "42px" },
                    height: { xs: "34px", sm: "38px", md: "42px" },
                    borderRadius: "50%",
                    bgcolor: "#ef4444",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <X size={16} color="#ffffff" strokeWidth={2.6} />
                </Box>

                <Box
                  sx={{
                    width: { xs: "34px", sm: "38px", md: "42px" },
                    height: { xs: "34px", sm: "38px", md: "42px" },
                    borderRadius: "50%",
                    bgcolor: "#22c55e",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Heart
                    size={16}
                    color="#ffffff"
                    fill="#ffffff"
                    strokeWidth={2}
                  />
                </Box>
              </Box>
            </Box>

            {/* Home indicator */}
            <Box
              sx={{
                position: "absolute",
                bottom: { xs: "6px", sm: "7px", md: "8px" },
                left: "50%",
                transform: "translateX(-50%)",
                width: { xs: "34px", sm: "36px", md: "42px" },
                height: { xs: "3px", sm: "3px", md: "4px" },
                borderRadius: "999px",
                background: "rgba(255,255,255,0.8)",
                zIndex: 40,
              }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
  const animationMap = {
    1: portfolioAnimation,
    2: lionsTheaterAnimation,
    3: bloodSugarMonitorAnimation,
    4: worklyAnimation,
  };

  const projects = projectsSummary.map((project) => ({
    ...project,
    animation: animationMap[project.id] || portfolioAnimation,
  }));

  return (
    <section
      id="projects"
      className="relative flex min-h-auto w-full flex-col items-center justify-center pb-16 pt-6 md:pb-20 md:pt-8 lg:pb-24 lg:pt-10"
      style={{ contain: "layout style paint", willChange: "scroll-position" }}
    >
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 md:px-8">
        <div className="w-full py-2 sm:py-3 md:py-4">
          <motion.div
            initial={reducedMotion ? false : { opacity: 0, y: 20 }}
            whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
            animate={reducedMotion ? { opacity: 1, y: 0 } : undefined}
            viewport={
              reducedMotion ? undefined : { once: true, margin: "-100px" }
            }
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="mb-8 w-fit md:mb-10">
              <h2 className="text-left text-2xl font-semibold tracking-tight text-white sm:text-3xl md:text-[2rem] lg:text-[2.25rem]">
                Projects
              </h2>
              <div
                className="mt-2 h-0.5 w-full bg-white/40 rounded-full"
                aria-hidden
              />
            </div>
          </motion.div>
          <div className="relative w-full">
            {projects.map((project, idx) => (
              <ParallaxProjectItem
                key={project.id}
                project={project}
                index={idx}
                isImageLeft={idx % 2 === 0}
              />
            ))}
          </div>

          <motion.div
            initial={reducedMotion ? false : { opacity: 0, y: 12 }}
            whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
            animate={reducedMotion ? { opacity: 1, y: 0 } : undefined}
            viewport={
              reducedMotion ? undefined : { once: true, margin: "-80px" }
            }
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="mb-6 mt-10 flex justify-center sm:mt-12 md:mt-14"
          >
            <a
              href="https://github.com/taylfrad"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-white/80 shadow-sm transition-all duration-200 ease-out hover:border-white/15 hover:bg-white/10 hover:text-white motion-reduce:transition-none sm:min-h-12 sm:px-8 md:min-h-[52px] md:text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
            >
              <Github className="h-5 w-5" />
              View More Projects on GitHub
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// Memoize Projects component to prevent unnecessary re-renders
export default memo(Projects);
