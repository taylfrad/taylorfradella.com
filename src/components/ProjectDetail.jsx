import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useMotionValue } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  FileText,
  Github,
  X,
  Youtube,
} from "lucide-react";
import { projectsData } from "../data/projectsData";
import GlassSurface from "@/components/surfaces/GlassSurface";
import OptimizedImage from "./OptimizedImage";
import Particles from "@/components/ui/particles";
import ThreeDImageCarousel from "@/components/lightswind/3d-image-carousel";
import { useTheme } from "@/components/theme-provider";
import { Button } from "./ui/button";
import { Box, Typography, Dialog, IconButton } from "@/components/ui/sx-primitives";
import { cn } from "@/lib/utils";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const slideVariants = {
  enter: (direction) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0,
    scale: 0.96,
    filter: "blur(4px)",
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
  },
  exit: (direction) => ({
    zIndex: 0,
    x: direction < 0 ? "100%" : "-100%",
    opacity: 0,
    scale: 0.96,
    filter: "blur(4px)",
  }),
};

function getAccentGradient(accentColor) {
  const normalized = /^#?[0-9a-fA-F]{6}$/.test(accentColor ?? "")
    ? accentColor.replace("#", "")
    : "0071e3";
  const r = Number.parseInt(normalized.slice(0, 2), 16);
  const g = Number.parseInt(normalized.slice(2, 4), 16);
  const b = Number.parseInt(normalized.slice(4, 6), 16);
  return `linear-gradient(180deg, rgba(${r},${g},${b},0.15) 0%, rgba(${r},${g},${b},0.06) 40%, transparent 100%)`;
}

function getAccentRgba(accentColor, alpha = 1) {
  const normalized = /^#?[0-9a-fA-F]{6}$/.test(accentColor ?? "")
    ? accentColor.replace("#", "")
    : "0071e3";
  const r = Number.parseInt(normalized.slice(0, 2), 16);
  const g = Number.parseInt(normalized.slice(2, 4), 16);
  const b = Number.parseInt(normalized.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

function ScrollTimeline({ items, accentColor = "#0071e3", reduceMotion = false }) {
  const accentStart = getAccentRgba(accentColor, 0.95);
  const accentMid = getAccentRgba(accentColor, 0.45);

  return (
    <div className="relative pl-5 sm:pl-6">
      <div className="absolute bottom-0 left-2 top-0 w-px bg-white/20" aria-hidden />
      <motion.div
        aria-hidden
        className="absolute bottom-0 left-2 top-0 w-px origin-top"
        style={{ background: `linear-gradient(180deg, ${accentStart} 0%, ${accentMid} 70%, transparent 100%)` }}
        initial={reduceMotion ? false : { scaleY: 0, opacity: 0 }}
        whileInView={reduceMotion ? undefined : { scaleY: 1, opacity: 1 }}
        viewport={reduceMotion ? undefined : { once: true, amount: 0.35 }}
        transition={reduceMotion ? undefined : { duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      />
      <div className="space-y-5 sm:space-y-6">
        {items.map((milestone, index) => (
          <div key={`${milestone.phase}-${index}`} className="relative">
            <div
              className="absolute -left-[20px] top-1.5 h-3 w-3 rounded-full border-2 border-white/10"
              style={{ backgroundColor: accentColor }}
            />
            <p className="mb-0.5 text-sm font-semibold text-foreground sm:text-base">{milestone.phase}</p>
            <p className="mb-1 text-xs text-muted-foreground sm:text-sm">{milestone.date}</p>
            <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">{milestone.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// Looping Carousel Component
function LightboxCarousel({ screenshots, projectTitle, accentColor = "#0071e3" }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragX = useMotionValue(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [lightboxDirection, setLightboxDirection] = useState(0);
  const lightboxDragX = useMotionValue(0);

  const next = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % screenshots.length);
  }, [screenshots.length]);

  const previous = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + screenshots.length) % screenshots.length);
  }, [screenshots.length]);

  const nextLightbox = useCallback(() => {
    setLightboxDirection(1);
    setLightboxIndex((prev) => (prev + 1) % screenshots.length);
  }, [screenshots.length]);

  const previousLightbox = useCallback(() => {
    setLightboxDirection(-1);
    setLightboxIndex((prev) => (prev - 1 + screenshots.length) % screenshots.length);
  }, [screenshots.length]);

  // Handle keyboard navigation
  useEffect(() => {
    if (!lightboxOpen) {
      const handleKeyDown = (e) => {
        if (e.key === "ArrowRight") {
          next();
        }
        if (e.key === "ArrowLeft") {
          previous();
        }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
    return undefined;
  }, [lightboxOpen, next, previous]);

  // Handle keyboard navigation for lightbox
  useEffect(() => {
    if (lightboxOpen) {
      const handleKeyDown = (e) => {
        if (e.key === "ArrowRight") {
          nextLightbox();
        }
        if (e.key === "ArrowLeft") {
          previousLightbox();
        }
        if (e.key === "Escape") setLightboxOpen(false);
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
    return undefined;
  }, [lightboxOpen, nextLightbox, previousLightbox]);

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    if (!lightboxOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [lightboxOpen]);

  const handleLightboxDragEnd = (event, info) => {
    const threshold = 50;
    if (Math.abs(info.offset.x) > threshold) {
      if (info.offset.x > 0) {
        previousLightbox();
      } else {
        nextLightbox();
      }
    }
    lightboxDragX.set(0);
  };

  const openLightbox = (index) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const handleDragEnd = (event, info) => {
    const threshold = 50;
    if (Math.abs(info.offset.x) > threshold) {
      if (info.offset.x > 0) {
        previous();
      } else {
        next();
      }
    }
    setIsDragging(false);
    dragX.set(0);
  };

  return (
    <>
      <div className="my-8 border-t border-white/10" />
      <motion.div variants={itemVariants}>
        <div className="relative z-10">
          <div className="mb-4 flex items-center gap-2 sm:mb-5">
            <div className="h-7 w-1 rounded-full" style={{ background: `linear-gradient(135deg, ${accentColor} 0%, ${accentColor}dd 100%)` }} />
            <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl md:text-3xl">Screenshots</h2>
          </div>

          {/* Carousel Container — liquid glass */}
          <div
            className="relative mb-5 flex h-[250px] w-full items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-xl backdrop-blur-xl sm:h-[360px] md:h-[500px] lg:h-[560px] md:rounded-3xl"
          >
            {/* Main Image Container */}
            <Box
              component={motion.div}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragStart={() => setIsDragging(true)}
              onDragEnd={handleDragEnd}
              style={{ x: dragX }}
              className={`relative flex h-full w-full items-center justify-center p-2 sm:p-3 md:p-4 ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
            >
              <AnimatePresence initial={false} custom={direction} mode="wait">
                <Box
                  component={motion.div}
                  key={currentIndex}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { 
                      type: "spring", 
                      stiffness: 350, 
                      damping: 40, 
                      mass: 0.7 
                    },
                    opacity: { duration: 0.4 },
                    scale: { duration: 0.4, ease: [0.23, 1, 0.32, 1] },
                    filter: { duration: 0.4 },
                  }}
                  sx={{
                    position: "absolute",
                    width: { xs: "calc(100% - 24px)", sm: "calc(100% - 36px)", md: "calc(100% - 48px)" },
                    height: { xs: "calc(100% - 24px)", sm: "calc(100% - 36px)", md: "calc(100% - 48px)" },
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: { xs: "8px", sm: "12px", md: "16px" },
                  }}
                >
                  <OptimizedImage
                    src={screenshots[currentIndex]}
                    alt={`${projectTitle} screenshot ${currentIndex + 1}`}
                    onClick={() => openLightbox(currentIndex)}
                    priority={currentIndex === 0}
                    sx={{
                      maxWidth: "100%",
                      maxHeight: "100%",
                      width: "auto",
                      height: "auto",
                      objectFit: "contain",
                      borderRadius: { xs: "12px", sm: "16px", md: "20px" },
                      boxShadow: "0 20px 60px rgba(0,0,0,0.15), 0 8px 24px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.04)",
                      userSelect: "none",
                      pointerEvents: "auto",
                      cursor: "pointer",
                      transition: "transform 0.3s ease",
                      willChange: "transform",
                      transform: "translateZ(0)",
                      "&:hover": {
                        transform: "scale(1.02) translateZ(0)",
                      },
                    }}
                    draggable={false}
                  />
                </Box>
              </AnimatePresence>
            </Box>

            {/* Subtle Navigation Controls — liquid glass */}
            <Box
              component={motion.div}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="absolute bottom-3 right-1/2 z-10 flex translate-x-1/2 items-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-3 py-1.5 backdrop-blur-xl sm:bottom-4 sm:right-6 sm:translate-x-0 md:gap-3 md:px-5 md:py-2"
            >
              <IconButton
                onClick={previous}
                component={motion.button}
                whileHover={{ scale: 1.2, x: -3 }}
                whileTap={{ scale: 0.95 }}
                className="min-w-0 rounded-xl p-2 text-muted-foreground transition hover:bg-white/10 hover:text-foreground"
              >
                <ChevronLeft className="text-lg sm:text-xl md:text-2xl" />
              </IconButton>

              <IconButton
                onClick={next}
                component={motion.button}
                whileHover={{ scale: 1.2, x: 3 }}
                whileTap={{ scale: 0.95 }}
                className="min-w-0 rounded-xl p-2 text-muted-foreground transition hover:bg-white/10 hover:text-foreground"
              >
                <ChevronRight className="text-lg sm:text-xl md:text-2xl" />
              </IconButton>
            </Box>

            {/* Dot Indicators */}
            {screenshots.length > 1 && (
              <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1 sm:bottom-4">
                {screenshots.map((_, index) => (
                  <motion.div
                    key={index}
                    animate={{
                      width: currentIndex === index ? 24 : 8,
                      opacity: currentIndex === index ? 1 : 0.4,
                    }}
                    transition={{ duration: 0.3 }}
                    onClick={() => {
                      setDirection(index > currentIndex ? 1 : -1);
                      setCurrentIndex(index);
                    }}
                    className="h-2 cursor-pointer rounded transition-colors hover:opacity-80"
                    style={{
                      backgroundColor: currentIndex === index ? accentColor : "rgba(255,255,255,0.3)",
                    }}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        setDirection(index > currentIndex ? 1 : -1);
                        setCurrentIndex(index);
                      }
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Lightbox Modal */}
      <Dialog
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        maxWidth={false}
        sx={{
          "& .MuiDialog-paper": {
            bgcolor: "rgba(0,0,0,0.95)",
            m: 0,
            width: "100vw",
            height: "100vh",
            maxWidth: "100vw",
            maxHeight: "100vh",
            borderRadius: 0,
            overflow: "hidden",
          },
        }}
      >
        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: 4,
          }}
        >
          {/* Close Button */}
          <IconButton
            onClick={() => setLightboxOpen(false)}
            sx={{
              position: "absolute",
              top: 24,
              right: 24,
              zIndex: 10,
              color: "white",
              bgcolor: "rgba(255,255,255,0.1)",
              "&:hover": {
                bgcolor: "rgba(255,255,255,0.2)",
              },
            }}
          >
            <X />
          </IconButton>

          {/* Image Container with Swipe */}
          <Box
            component={motion.div}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleLightboxDragEnd}
            style={{ x: lightboxDragX }}
            sx={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "grab",
              "&:active": {
                cursor: "grabbing",
              },
            }}
          >
            <AnimatePresence initial={false} custom={lightboxDirection} mode="wait">
              <Box
                component={motion.div}
                key={lightboxIndex}
                custom={lightboxDirection}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                }}
                sx={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <OptimizedImage
                  src={screenshots[lightboxIndex]}
                  alt={`${projectTitle} screenshot ${lightboxIndex + 1}`}
                  priority={true}
                  sx={{
                    maxWidth: "95%",
                    maxHeight: "95%",
                    width: "auto",
                    height: "auto",
                    objectFit: "contain",
                    borderRadius: "8px",
                    userSelect: "none",
                    pointerEvents: "none",
                  }}
                  draggable={false}
                />
              </Box>
            </AnimatePresence>
          </Box>

          {/* Navigation Arrows */}
          {screenshots.length > 1 && (
            <>
              <IconButton
                onClick={previousLightbox}
                component={motion.button}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                sx={{
                  position: "absolute",
                  left: 24,
                  top: "50%",
                  transform: "translateY(-50%)",
                  zIndex: 10,
                  color: "white",
                  bgcolor: "rgba(255,255,255,0.1)",
                  "&:hover": {
                    bgcolor: "rgba(255,255,255,0.2)",
                  },
                }}
              >
                <ChevronLeft />
              </IconButton>
              <IconButton
                onClick={nextLightbox}
                component={motion.button}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                sx={{
                  position: "absolute",
                  right: 24,
                  top: "50%",
                  transform: "translateY(-50%)",
                  zIndex: 10,
                  color: "white",
                  bgcolor: "rgba(255,255,255,0.1)",
                  "&:hover": {
                    bgcolor: "rgba(255,255,255,0.2)",
                  },
                }}
              >
                <ChevronRight />
              </IconButton>

              {/* Counter */}
              <Box
                sx={{
                  position: "absolute",
                  bottom: 24,
                  left: "50%",
                  transform: "translateX(-50%)",
                  zIndex: 10,
                  bgcolor: "rgba(0,0,0,0.5)",
                  backdropFilter: "blur(10px)",
                  px: 2,
                  py: 1,
                  borderRadius: "20px",
                  color: "white",
                }}
              >
                <Typography variant="body2">
                  {lightboxIndex + 1} / {screenshots.length}
                </Typography>
              </Box>
            </>
          )}
        </Box>
      </Dialog>
    </>
  );
}

function Workly3DCarousel({
  screenshots,
  projectTitle,
  accentColor = "#b3363d",
  reduceMotion = false,
}) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [lightboxDirection, setLightboxDirection] = useState(0);
  const lightboxDragX = useMotionValue(0);
  const wheelNavTimestampRef = useRef(0);

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
  }, []);

  const openLightbox = useCallback((index) => {
    setLightboxDirection(0);
    setLightboxIndex(index);
    setLightboxOpen(true);
  }, []);

  const nextLightbox = useCallback(() => {
    setLightboxDirection(1);
    setLightboxIndex((prev) => (prev + 1) % screenshots.length);
  }, [screenshots.length]);

  const previousLightbox = useCallback(() => {
    setLightboxDirection(-1);
    setLightboxIndex((prev) => (prev - 1 + screenshots.length) % screenshots.length);
  }, [screenshots.length]);

  useEffect(() => {
    if (!lightboxOpen) return undefined;

    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight") nextLightbox();
      if (e.key === "ArrowLeft") previousLightbox();
      if (e.key === "Escape") closeLightbox();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [closeLightbox, lightboxOpen, nextLightbox, previousLightbox]);

  useEffect(() => {
    if (!lightboxOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [lightboxOpen]);

  const handleLightboxDragEnd = (event, info) => {
    const threshold = 50;
    if (Math.abs(info.offset.x) > threshold) {
      if (info.offset.x > 0) {
        previousLightbox();
      } else {
        nextLightbox();
      }
    }
    lightboxDragX.set(0);
  };

  const handleLightboxWheel = useCallback(
    (event) => {
      if (!lightboxOpen || screenshots.length <= 1) return;

      const now = performance.now();
      if (now - wheelNavTimestampRef.current < 180) return;

      const horizontal = Math.abs(event.deltaX) > Math.abs(event.deltaY);
      const delta = horizontal ? event.deltaX : event.deltaY;
      if (Math.abs(delta) < 14) return;

      wheelNavTimestampRef.current = now;
      if (delta > 0) {
        nextLightbox();
      } else {
        previousLightbox();
      }
    },
    [lightboxOpen, nextLightbox, previousLightbox, screenshots.length],
  );

  const slides = useMemo(
    () =>
      screenshots.map((src, index) => ({
        id: `${projectTitle}-${index}`,
        src,
        href: src,
        alt: `${projectTitle} screenshot ${index + 1}`,
      })),
    [projectTitle, screenshots],
  );

  return (
    <>
      <div className="my-8 border-t border-white/10" />
      <motion.div variants={itemVariants}>
        <div className="relative z-10">
          <div className="mb-4 flex items-center gap-2 sm:mb-5">
            <div className="h-7 w-1 rounded-full" style={{ background: `linear-gradient(135deg, ${accentColor} 0%, ${accentColor}dd 100%)` }} />
            <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl md:text-3xl">Screenshots</h2>
          </div>

          <div className="relative mx-auto mb-5 h-[210px] w-full max-w-[760px] overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-xl backdrop-blur-xl sm:h-[300px] md:h-[340px] lg:h-[380px] md:rounded-3xl">
            <ThreeDImageCarousel
              slides={slides}
              itemCount={5}
              autoplay={!reduceMotion}
              delay={2.8}
              pauseOnHover
              onSlideClick={openLightbox}
              className="h-full w-full"
            />
          </div>
          <p className="text-xs text-muted-foreground/90 sm:text-sm">
            Click any image to open fullscreen. Use mouse wheel or arrow keys to browse.
          </p>
        </div>
      </motion.div>

      <Dialog
        open={lightboxOpen}
        onClose={closeLightbox}
        maxWidth={false}
        sx={{
          "& .MuiDialog-paper": {
            bgcolor: "rgba(0,0,0,0.95)",
            m: 0,
            width: "100vw",
            height: "100vh",
            maxWidth: "100vw",
            maxHeight: "100vh",
            borderRadius: 0,
            overflow: "hidden",
          },
        }}
      >
        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: { xs: 1.5, sm: 2.5, md: 4 },
          }}
          onWheel={handleLightboxWheel}
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              closeLightbox();
            }
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: 16,
              left: 16,
              zIndex: 11,
              px: 1.5,
              py: 0.75,
              borderRadius: "999px",
              bgcolor: "rgba(0,0,0,0.45)",
              backdropFilter: "blur(10px)",
              color: "rgba(255,255,255,0.9)",
              fontSize: "12px",
            }}
          >
            Scroll / Swipe / Arrow keys
          </Box>

          <IconButton
            onClick={closeLightbox}
            aria-label="Close fullscreen gallery"
            sx={{
              position: "absolute",
              top: { xs: 14, sm: 20 },
              right: { xs: 14, sm: 20 },
              zIndex: 12,
              color: "white",
              bgcolor: "rgba(255,255,255,0.15)",
              border: "1px solid rgba(255,255,255,0.25)",
              "&:hover": {
                bgcolor: "rgba(255,255,255,0.28)",
              },
            }}
          >
            <X />
          </IconButton>

          <Box
            component={motion.div}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleLightboxDragEnd}
            style={{ x: lightboxDragX }}
            sx={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "grab",
              "&:active": { cursor: "grabbing" },
            }}
          >
            <AnimatePresence initial={false} custom={lightboxDirection} mode="wait">
              <Box
                component={motion.div}
                key={lightboxIndex}
                custom={lightboxDirection}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                }}
                sx={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <OptimizedImage
                  src={screenshots[lightboxIndex]}
                  alt={`${projectTitle} screenshot ${lightboxIndex + 1}`}
                  priority
                  sx={{
                    maxWidth: "95%",
                    maxHeight: "95%",
                    width: "auto",
                    height: "auto",
                    objectFit: "contain",
                    borderRadius: "10px",
                    userSelect: "none",
                    pointerEvents: "none",
                  }}
                  draggable={false}
                />
              </Box>
            </AnimatePresence>
          </Box>

          {screenshots.length > 1 && (
            <>
              <IconButton
                onClick={previousLightbox}
                component={motion.button}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                sx={{
                  position: "absolute",
                  left: { xs: 8, sm: 18, md: 26 },
                  top: "50%",
                  transform: "translateY(-50%)",
                  zIndex: 10,
                  color: "white",
                  bgcolor: "rgba(255,255,255,0.16)",
                  border: "1px solid rgba(255,255,255,0.25)",
                  "&:hover": {
                    bgcolor: "rgba(255,255,255,0.28)",
                  },
                }}
              >
                <ChevronLeft />
              </IconButton>
              <IconButton
                onClick={nextLightbox}
                component={motion.button}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                sx={{
                  position: "absolute",
                  right: { xs: 8, sm: 18, md: 26 },
                  top: "50%",
                  transform: "translateY(-50%)",
                  zIndex: 10,
                  color: "white",
                  bgcolor: "rgba(255,255,255,0.16)",
                  border: "1px solid rgba(255,255,255,0.25)",
                  "&:hover": {
                    bgcolor: "rgba(255,255,255,0.28)",
                  },
                }}
              >
                <ChevronRight />
              </IconButton>

              <Box
                sx={{
                  position: "absolute",
                  bottom: 20,
                  left: "50%",
                  transform: "translateX(-50%)",
                  zIndex: 10,
                  bgcolor: "rgba(0,0,0,0.5)",
                  backdropFilter: "blur(10px)",
                  px: 2,
                  py: 1,
                  borderRadius: "20px",
                  color: "white",
                }}
              >
                <Typography variant="body2">
                  {lightboxIndex + 1} / {screenshots.length}
                </Typography>
              </Box>
            </>
          )}
        </Box>
      </Dialog>
    </>
  );
}

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { shouldReduceEffects } = useTheme();
  const projectId = Number(id);
  const project = useMemo(
    () =>
      Number.isFinite(projectId)
        ? projectsData.find((p) => p.id === projectId)
        : undefined,
    [projectId],
  );
  const navigationTimeoutRef = useRef();
  const SCROLL_TO_PROJECTS_FLAG = "scrollToProjectsPending";

  // Force scroll to top on mount - this is a completely separate page
  useLayoutEffect(() => {
    const mainContent = document.querySelector("main");
    const previousDisplay = mainContent?.style.display ?? "";
    const previousVisibility = mainContent?.style.visibility ?? "";
    if (mainContent) {
      mainContent.scrollTop = 0;
      mainContent.scrollTo(0, 0);
      // Hide main content when viewing project detail
      mainContent.style.display = "none";
      mainContent.style.visibility = "hidden";
    }

    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    const rafId = requestAnimationFrame(() => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    });

    return () => {
      cancelAnimationFrame(rafId);
      if (mainContent) {
        mainContent.style.display = previousDisplay;
        mainContent.style.visibility = previousVisibility;
      }
    };
  }, []);

  useEffect(() => {
    return () => {
      if (navigationTimeoutRef.current) {
        clearTimeout(navigationTimeoutRef.current);
      }
    };
  }, []);

  const accentColor = project?.accentColor || "#0071e3";
  const accentGradient = useMemo(() => getAccentGradient(accentColor), [accentColor]);
  const handleBackToProjects = useCallback(() => {
    const container = document.querySelector("[data-project-detail]");
    if (container) {
      container.style.transition = "opacity 0.3s ease-out";
      container.style.opacity = "0";
    }
    if (navigationTimeoutRef.current) {
      clearTimeout(navigationTimeoutRef.current);
    }
    if (typeof window !== "undefined") {
      try {
        window.sessionStorage.setItem(SCROLL_TO_PROJECTS_FLAG, "1");
      } catch {
        // Ignore storage write failures and rely on route state fallback.
      }
    }
    navigationTimeoutRef.current = setTimeout(
      () => navigate("/", { state: { scrollToProjects: true } }),
      200,
    );
  }, [navigate, SCROLL_TO_PROJECTS_FLAG]);

  if (!project) {
    return (
      <div className="flex min-h-[100svh] items-center justify-center bg-[#121212] text-foreground">
        <p className="text-xl font-semibold">Project not found</p>
      </div>
    );
  }

  return (
    <div
      data-project-detail
      className="relative z-[1000] min-h-[100svh] w-full overflow-x-hidden bg-transparent text-foreground opacity-100 transition-opacity duration-300 ease-out"
      style={{ contain: "layout style paint", willChange: "scroll-position", transform: "translateZ(0)" }}
    >
      {/* Particles background (same treatment as Home post-hero sections) */}
      <div className="pointer-events-none absolute inset-0 z-0">
        {shouldReduceEffects ? (
          <div className="absolute inset-0 bg-gradient-to-b from-[#36454f] via-[#070b47] to-black" />
        ) : (
          <Particles
            className="absolute inset-0"
            quantity={130}
            staticity={42}
            ease={52}
            size={0.8}
            color="#dbe8ff"
            maxDpr={1.3}
            targetFps={40}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-[#36454f]/16 via-[#070b47]/22 to-black/30" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1440px] px-4 py-3 sm:px-5 sm:py-4 lg:px-6 lg:py-5 pb-10 sm:pb-12 lg:pb-16">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Back Button — shadcn + Tailwind */}
          <motion.div variants={itemVariants}>
            <Button
              variant="ghost"
              size="sm"
              className="mb-4 text-muted-foreground hover:translate-x-[-2px] hover:text-foreground sm:mb-5"
              onClick={handleBackToProjects}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Projects
            </Button>
          </motion.div>

          {/* Main Content Card — liquid glass, responsive padding */}
          <motion.div
            variants={itemVariants}
            className="relative overflow-hidden mb-8 sm:mb-10"
          >
            <GlassSurface variant="card" className="relative overflow-hidden p-4 sm:p-5 md:p-6 lg:rounded-3xl xl:p-7">
            {/* Decorative gradient — accent tint */}
            <div
              className="pointer-events-none absolute left-0 right-0 top-0 z-0 h-56 opacity-90"
              style={{
                background: accentGradient,
              }}
            />
            {/* Header Section — compact on small, tags inline */}
            <motion.div variants={itemVariants}>
              <div className="relative z-10 mb-5 sm:mb-6">
                <p className="mb-1.5 text-xs font-semibold uppercase tracking-widest text-muted-foreground sm:text-sm">
                  {project.role}
                </p>
                <h1 className="mb-3 text-2xl font-bold leading-tight tracking-tight text-foreground sm:mb-4 sm:text-3xl md:text-4xl xl:text-5xl">
                  {project.title}
                </h1>
                <div
                  className="mb-4 h-0.5 w-full rounded-full sm:mb-5"
                  style={{ background: `linear-gradient(90deg, transparent 0%, ${accentColor} 20%, ${accentColor} 80%, transparent 100%)` }}
                />
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <span
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-xs font-semibold sm:text-sm",
                      project.status === "Live" && "border-emerald-500/30 bg-emerald-500/15 text-emerald-400",
                      project.status === "Completed" && "border-blue-500/30 bg-blue-500/15 text-blue-400",
                      project.status !== "Live" && project.status !== "Completed" && "border-white/20 bg-white/10 text-muted-foreground"
                    )}
                  >
                    {project.status}
                  </span>
                  {project.github && (
                    <button
                      type="button"
                      onClick={() => window.open(project.github, "_blank", "noopener,noreferrer")}
                      className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-foreground transition hover:bg-white/15 sm:text-sm"
                    >
                      GitHub
                    </button>
                  )}
                  {project.youtube && (
                    <button
                      type="button"
                      onClick={() => window.open(project.youtube, "_blank", "noopener,noreferrer")}
                      className="rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-400 transition hover:bg-red-500/15 sm:text-sm"
                    >
                      YouTube
                    </button>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Project Animation/Image — full width */}
            {project.animation && (
              <motion.div variants={itemVariants}>
                <div className="mb-4 min-h-[160px] w-full overflow-hidden rounded-xl sm:mb-5 sm:min-h-[250px] md:min-h-[320px] lg:min-h-[360px]">
                  {project.animation}
                </div>
              </motion.div>
            )}

            {/* Two-column on lg: main (Overview, Screenshots, Timeline) | sidebar (Tools, Key Features) */}
            <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(250px,320px)] lg:gap-8 xl:gap-10">
              {/* Main column */}
              <div className="min-w-0">
                {/* Description */}
                <motion.div variants={itemVariants}>
                  <div id="overview" className="relative z-10 scroll-mt-20">
                    <div className="mb-3 flex items-center gap-2 sm:mb-4">
                      <div className="h-5 w-1 rounded-full sm:h-6" style={{ backgroundColor: accentColor }} />
                      <h2 className="text-base font-bold tracking-tight text-foreground sm:text-lg md:text-xl">Overview</h2>
                    </div>
                    <p className="mb-4 text-sm leading-relaxed text-muted-foreground sm:mb-5 sm:text-base md:text-lg">
                      {project.description}
                    </p>
                  </div>
                </motion.div>

                {/* Extended Description if available */}
                {project.extendedDescription && (
                  <motion.div variants={itemVariants}>
                    <p className="mb-4 text-sm leading-relaxed text-muted-foreground sm:mb-5 sm:text-base">
                      {project.extendedDescription}
                    </p>
                  </motion.div>
                )}

                {/* Screenshots Lightbox Carousel */}
                {project.screenshots && project.screenshots.length > 0 && (
                  project.id === 4 ? (
                    <Workly3DCarousel
                      screenshots={project.screenshots}
                      projectTitle={project.title}
                      accentColor={project.accentColor || "#b3363d"}
                      reduceMotion={shouldReduceEffects}
                    />
                  ) : (
                    <LightboxCarousel
                      screenshots={project.screenshots}
                      projectTitle={project.title}
                      accentColor={project.accentColor || "#0071e3"}
                    />
                  )
                )}

                {/* Timeline — main column only */}
                {project.timeline && project.timeline.length > 0 && project.id !== 1 && (
                  <>
                    <div className="my-5 border-t border-white/10 xl:my-6" />
                    <motion.div variants={itemVariants}>
                      <div className="relative z-10">
                        <div className="mb-4 flex items-center gap-2 sm:mb-5">
                          <div className="h-5 w-1 rounded-full sm:h-6" style={{ backgroundColor: accentColor }} />
                          <h2 className="text-base font-bold tracking-tight text-foreground sm:text-lg md:text-xl">Timeline</h2>
                        </div>
                        <ScrollTimeline
                          items={project.timeline}
                          accentColor={accentColor}
                          reduceMotion={shouldReduceEffects}
                        />
                      </div>
                    </motion.div>
                  </>
                )}
              </div>

              {/* Sidebar column — Tools & Key Features on lg+ */}
              <div className="lg:space-y-6">
                <div className="my-5 border-t border-white/10 lg:my-0 lg:border-0 lg:pt-0" />

                {/* Tools & Technologies */}
                <motion.div variants={itemVariants}>
                  <div className="relative z-10">
                    <div className="mb-3 flex items-center gap-2 sm:mb-4">
                      <div className="h-5 w-1 rounded-full sm:h-6" style={{ backgroundColor: accentColor }} />
                      <h2 className="text-base font-bold tracking-tight text-foreground sm:text-lg md:text-xl">Tools & Technologies</h2>
                    </div>
                    <div className="mb-5 flex flex-wrap gap-2 sm:mb-6 sm:gap-3">
                      {project.tools?.map((tool, index) => (
                        <span
                          key={index}
                          className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-foreground transition hover:-translate-y-0.5 hover:bg-white/10 sm:px-4 sm:py-2 sm:text-sm"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>

                {/* Key Features */}
                {project.keyFeatures && project.keyFeatures.length > 0 && (
                  <>
                    <div className="my-5 border-t border-white/10 lg:my-0" />
                    <motion.div variants={itemVariants}>
                      <div className="relative z-10">
                        <div className="mb-3 flex items-center gap-2 sm:mb-4">
                          <div className="h-5 w-1 rounded-full sm:h-6" style={{ backgroundColor: accentColor }} />
                          <h2 className="text-base font-bold tracking-tight text-foreground sm:text-lg md:text-xl">Key Features</h2>
                        </div>
                        <ul className="mb-0 list-none pl-0">
                          {project.keyFeatures.map((feature, index) => (
                            <li key={index} className="mb-3 flex items-start last:mb-0">
                              <span className="mr-2.5 mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: accentColor }} />
                              <span className="text-xs leading-relaxed text-muted-foreground sm:text-sm">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  </>
                )}
              </div>
            </div>

            {/* Action Buttons — full width below content */}
            <motion.div variants={itemVariants}>
              <div className="relative z-10 mt-5 border-t border-white/10 pt-5 lg:mt-6 lg:pt-6">
                <div className="flex flex-wrap gap-3 sm:gap-4">
                {project.youtube ? (
                  <Button
                    asChild
                    className="w-full justify-center border-white/20 bg-red-600 text-white hover:bg-red-700 sm:w-auto"
                  >
                    <a href={project.youtube} target="_blank" rel="noopener noreferrer">
                      <Youtube className="mr-2 h-4 w-4" />
                      See on YouTube
                    </a>
                  </Button>
                ) : project.github ? (
                  <Button
                    asChild
                    className="w-full justify-center bg-foreground text-background hover:bg-foreground/90 sm:w-auto"
                  >
                    <a href={project.github} target="_blank" rel="noopener noreferrer">
                      <Github className="mr-2 h-4 w-4" />
                      See on GitHub
                    </a>
                  </Button>
                ) : null}
                {project.userManual && (
                  <Button asChild variant="outline" className="w-full justify-center border-white/20 bg-white/5 text-foreground hover:bg-white/10 sm:w-auto">
                    <a href={project.userManual} target="_blank" rel="noopener noreferrer">
                      <FileText className="mr-2 h-4 w-4" />
                      User Manual
                    </a>
                  </Button>
                )}
                {project.liveUrl && (
                  <Button asChild variant="outline" className="w-full justify-center border-white/20 bg-white/5 text-foreground hover:bg-white/10 sm:w-auto">
                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      View Live Site
                    </a>
                  </Button>
                )}
                </div>
              </div>
            </motion.div>
            </GlassSurface>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
