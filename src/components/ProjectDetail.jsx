import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { Box, Typography, Button, Container, Paper, Chip, Divider, Dialog, IconButton } from "@mui/material";
import { motion, AnimatePresence, useMotionValue } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import GitHubIcon from "@mui/icons-material/GitHub";
import YouTubeIcon from "@mui/icons-material/YouTube";
import LaunchIcon from "@mui/icons-material/Launch";
import DescriptionIcon from "@mui/icons-material/Description";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { projectsData } from "../data/projectsData";
import OptimizedImage from "./OptimizedImage";

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

// Looping Carousel Component
function LightboxCarousel({ screenshots, projectTitle, accentColor = "#0071e3" }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const carouselRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragX = useMotionValue(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [lightboxDirection, setLightboxDirection] = useState(0);
  const lightboxDragX = useMotionValue(0);

  const next = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % screenshots.length);
  };

  const previous = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + screenshots.length) % screenshots.length);
  };

  // Handle keyboard navigation
  useEffect(() => {
    if (!lightboxOpen) {
      const handleKeyDown = (e) => {
        if (e.key === "ArrowRight") {
          setDirection(1);
          setCurrentIndex((prev) => (prev + 1) % screenshots.length);
        }
        if (e.key === "ArrowLeft") {
          setDirection(-1);
          setCurrentIndex((prev) => (prev - 1 + screenshots.length) % screenshots.length);
        }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [lightboxOpen, screenshots.length]);

  // Handle keyboard navigation for lightbox
  useEffect(() => {
    if (lightboxOpen) {
      const handleKeyDown = (e) => {
        if (e.key === "ArrowRight") {
          setLightboxDirection(1);
          setLightboxIndex((prev) => (prev + 1) % screenshots.length);
        }
        if (e.key === "ArrowLeft") {
          setLightboxDirection(-1);
          setLightboxIndex((prev) => (prev - 1 + screenshots.length) % screenshots.length);
        }
        if (e.key === "Escape") setLightboxOpen(false);
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [lightboxOpen, lightboxIndex, screenshots.length]);

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    if (lightboxOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [lightboxOpen]);

  const nextLightbox = () => {
    setLightboxDirection(1);
    setLightboxIndex((prev) => (prev + 1) % screenshots.length);
  };

  const previousLightbox = () => {
    setLightboxDirection(-1);
    setLightboxIndex((prev) => (prev - 1 + screenshots.length) % screenshots.length);
  };

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
      <Divider sx={{ my: 5, borderColor: "rgba(0,0,0,0.08)" }} />
      <motion.div variants={itemVariants}>
        <Box sx={{ position: "relative", zIndex: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 5 }}>
            <Box
              sx={{
                width: "4px",
                height: "28px",
                borderRadius: "2px",
                background: `linear-gradient(135deg, ${accentColor} 0%, ${accentColor}dd 100%)`,
              }}
            />
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                color: "#1d1d1f",
                fontSize: { xs: "1.25rem", sm: "1.5rem", md: "1.75rem" },
                letterSpacing: "-0.02em",
              }}
            >
              Screenshots
            </Typography>
          </Box>

          {/* Carousel Container */}
          <Box
            ref={carouselRef}
            sx={{
              position: "relative",
              width: "100%",
              height: { xs: "550px", sm: "650px", md: "750px" },
              mb: 4,
              overflow: "hidden",
              borderRadius: "32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(135deg, #f5f7fa 0%, #fafbfc 100%)",
              border: "1px solid rgba(0,0,0,0.04)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.04)",
            }}
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
              sx={{
                position: "relative",
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: { xs: 4, sm: 5, md: 6 },
                cursor: isDragging ? "grabbing" : "grab",
              }}
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
                    width: { xs: "calc(100% - 40px)", sm: "calc(100% - 60px)", md: "calc(100% - 80px)" },
                    height: { xs: "calc(100% - 40px)", sm: "calc(100% - 60px)", md: "calc(100% - 80px)" },
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: { xs: "12px", sm: "20px", md: "40px" },
                  }}
                >
                  <OptimizedImage
                    src={screenshots[currentIndex]}
                    alt={`${projectTitle} screenshot ${currentIndex + 1}`}
                    onClick={() => openLightbox(currentIndex)}
                    priority={currentIndex === 0}
                    sx={{
                      width: "100%",
                      height: "100%",
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

            {/* Subtle Navigation Controls */}
            <Box
              component={motion.div}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              sx={{
                position: "absolute",
                bottom: { xs: 16, sm: 20, md: 32 },
                right: { xs: "50%", sm: "20%", md: "25%" },
                transform: { xs: "translateX(50%)", sm: "none" },
                display: "flex",
                gap: { xs: 2, sm: 2.5, md: 3.5 },
                alignItems: "center",
                zIndex: 10,
                bgcolor: "rgba(255,255,255,0.95)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                px: { xs: 2, sm: 2.5, md: 3.5 },
                py: { xs: 1, sm: 1.25, md: 1.75 },
                borderRadius: { xs: "24px", sm: "28px", md: "32px" },
                border: "1px solid rgba(0,0,0,0.06)",
                boxShadow: "0 8px 24px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.08)",
              }}
            >
              <IconButton
                onClick={previous}
                component={motion.button}
                whileHover={{ scale: 1.2, x: -3, backgroundColor: "rgba(0,0,0,0.04)" }}
                whileTap={{ scale: 0.95 }}
                sx={{
                  color: "rgba(0,0,0,0.75)",
                  p: { xs: 0.625, sm: 0.75, md: 0.875 },
                  minWidth: "auto",
                  width: "auto",
                  height: "auto",
                  transition: "all 0.2s ease",
                  borderRadius: "12px",
                  "&:hover": {
                    color: "rgba(0,0,0,1)",
                    bgcolor: "rgba(0,0,0,0.04)",
                  },
                }}
              >
                <ArrowBackIosNewIcon sx={{ fontSize: { xs: "1.125rem", sm: "1.25rem", md: "1.375rem" } }} />
              </IconButton>

              <IconButton
                onClick={next}
                component={motion.button}
                whileHover={{ scale: 1.2, x: 3, backgroundColor: "rgba(0,0,0,0.04)" }}
                whileTap={{ scale: 0.95 }}
                sx={{
                  color: "rgba(0,0,0,0.75)",
                  p: { xs: 0.625, sm: 0.75, md: 0.875 },
                  minWidth: "auto",
                  width: "auto",
                  height: "auto",
                  transition: "all 0.2s ease",
                  borderRadius: "12px",
                  "&:hover": {
                    color: "rgba(0,0,0,1)",
                    bgcolor: "rgba(0,0,0,0.04)",
                  },
                }}
              >
                <ArrowForwardIosIcon sx={{ fontSize: { xs: "1.125rem", sm: "1.25rem", md: "1.375rem" } }} />
              </IconButton>
            </Box>

            {/* Dot Indicators */}
            {screenshots.length > 1 && (
              <Box
                sx={{
                  position: "absolute",
                  bottom: { xs: 24, sm: 28, md: 32 },
                  left: "50%",
                  transform: "translateX(-50%)",
                  display: "flex",
                  gap: 1,
                  alignItems: "center",
                  zIndex: 10,
                }}
              >
                {screenshots.map((_, index) => (
                  <Box
                    key={index}
                    component={motion.div}
                    animate={{
                      width: currentIndex === index ? 24 : 8,
                      opacity: currentIndex === index ? 1 : 0.4,
                    }}
                    transition={{ duration: 0.3 }}
                    onClick={() => {
                      setDirection(index > currentIndex ? 1 : -1);
                      setCurrentIndex(index);
                    }}
                    sx={{
                      height: 8,
                      borderRadius: "4px",
                      bgcolor: currentIndex === index ? accentColor : "rgba(0,0,0,0.3)",
                      cursor: "pointer",
                      transition: "background-color 0.3s ease",
                      "&:hover": {
                        bgcolor: currentIndex === index ? accentColor : "rgba(0,0,0,0.5)",
                      },
                    }}
                  />
                ))}
              </Box>
            )}
          </Box>
        </Box>
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
            <CloseIcon />
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
                <ArrowBackIosNewIcon />
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
                <ArrowForwardIosIcon />
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

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const project = projectsData.find((p) => p.id === parseInt(id));
  const [selectedImage, setSelectedImage] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);


  if (!project) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "#f5f5f7",
        }}
      >
        <Typography variant="h4">Project not found</Typography>
      </Box>
    );
  }

  // Force scroll to top on mount - this is a completely separate page
  useLayoutEffect(() => {
    const mainContent = document.querySelector("main");
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
    
    requestAnimationFrame(() => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    });
    
    return () => {
      if (mainContent) {
        mainContent.style.display = "";
        mainContent.style.visibility = "";
      }
    };
  }, []);

  return (
            <Box
      data-project-detail
      sx={{
        minHeight: "100vh",
        bgcolor: "#f5f5f7",
        pt: { xs: 1, sm: 2, md: 4 },
        pb: { xs: 3, sm: 4, md: 6 },
        px: { xs: 1, sm: 2, md: 0 },
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: "100%",
        overflowY: "auto",
        overflowX: "hidden",
        zIndex: 1000,
        contain: "layout style paint",
        willChange: "scroll-position",
        transform: "translateZ(0)",
        opacity: 1,
        transition: "opacity 0.3s ease-out",
      }}
    >
      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Back Button */}
          <motion.div variants={itemVariants}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => {
                // Add smooth fade-out before navigation
                const container = document.querySelector('[data-project-detail]');
                if (container) {
                  container.style.transition = 'opacity 0.3s ease-out';
                  container.style.opacity = '0';
                }
                // Navigate after brief fade
                setTimeout(() => {
                  navigate("/", { state: { scrollToProjects: true } });
                }, 200);
              }}
              sx={{
                mb: { xs: 2, sm: 2.5, md: 3 },
                color: "#1d1d1f",
                textTransform: "none",
                fontSize: { xs: "0.875rem", sm: "0.9375rem", md: "1rem" },
                px: { xs: 1.5, sm: 2, md: 2.5 },
                py: { xs: 0.75, sm: 1, md: 1.25 },
                minHeight: { xs: "40px", sm: "44px", md: "48px" },
                transition: "all 0.2s ease",
                "&:hover": {
                  bgcolor: "rgba(0,0,0,0.05)",
                  transform: "translateX(-2px)",
                },
              }}
            >
              Back to Projects
            </Button>
          </motion.div>

          {/* Main Content Card */}
          <Paper
            elevation={0}
            sx={{
              bgcolor: "#ffffff",
              borderRadius: { xs: "16px", sm: "20px", md: "24px" },
              p: { xs: 2, sm: 3, md: 6 },
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              border: "1px solid rgba(0,0,0,0.05)",
              overflow: "hidden",
              position: "relative",
            }}
          >
            {/* Decorative gradient background - fades from accent color to white, stopping at accent line */}
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "240px",
                background: (() => {
                  const accentColor = project.accentColor || "#0071e3";
                  // Convert hex to rgb
                  const hex = accentColor.replace("#", "");
                  const r = parseInt(hex.substring(0, 2), 16);
                  const g = parseInt(hex.substring(2, 4), 16);
                  const b = parseInt(hex.substring(4, 6), 16);
                  return `linear-gradient(180deg, rgba(${r},${g},${b},0.2) 0%, rgba(${r},${g},${b},0.12) 30%, rgba(${r},${g},${b},0.06) 60%, rgba(${r},${g},${b},0.02) 85%, rgba(255,255,255,0) 100%)`;
                })(),
                zIndex: 0,
                pointerEvents: "none",
              }}
            />
            {/* Header Section */}
            <motion.div variants={itemVariants}>
              <Box sx={{ mb: 5, position: "relative", zIndex: 1 }}>
                <Typography
                  sx={{
                    fontSize: { xs: "0.75rem", sm: "0.8125rem", md: "0.875rem" },
                    fontWeight: 600,
                    color: "#86868b",
                    textTransform: "uppercase",
                    letterSpacing: "0.15em",
                    mb: 2,
                  }}
                >
                  {project.role}
                </Typography>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 700,
                    fontSize: { xs: "1.75rem", sm: "2.5rem", md: "3.5rem" },
                    mb: { xs: 2, sm: 2.5, md: 3 },
                    color: "#1d1d1f",
                    letterSpacing: "-0.03em",
                    lineHeight: 1.1,
                    background: "linear-gradient(135deg, #1d1d1f 0%, #4a4a4a 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {project.title}
                </Typography>
                {/* Accent line divider */}
                <Box
                  sx={{
                    width: "100%",
                    height: "3px",
                    background: project.accentColor || "#0071e3",
                    borderRadius: "2px",
                    mb: 3,
                    position: "relative",
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: `linear-gradient(90deg, transparent 0%, ${project.accentColor || "#0071e3"} 20%, ${project.accentColor || "#0071e3"} 80%, transparent 100%)`,
                      borderRadius: "2px",
                    },
                  }}
                />
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 1.5,
                    mb: 3,
                    alignItems: "center",
                  }}
                >
                  <Chip
                    label={project.status}
                    sx={{
                      fontSize: { xs: "0.75rem", sm: "0.8125rem" },
                      fontWeight: 600,
                      color:
                        project.status === "Live"
                          ? "#22c55e"
                          : project.status === "Completed"
                          ? "#3b82f6"
                          : "#86868b",
                      backgroundColor:
                        project.status === "Live"
                          ? "rgba(34, 197, 94, 0.15)"
                          : project.status === "Completed"
                          ? "rgba(59, 130, 246, 0.15)"
                          : "rgba(134, 134, 139, 0.15)",
                      height: "32px",
                      px: 1.5,
                      border: `1px solid ${
                        project.status === "Live"
                          ? "rgba(34, 197, 94, 0.3)"
                          : project.status === "Completed"
                          ? "rgba(59, 130, 246, 0.3)"
                          : "rgba(134, 134, 139, 0.3)"
                      }`,
                    }}
                  />
                  {/* GitHub Tag */}
                  {project.github && (
                    <Chip
                      label="GitHub"
                      onClick={() => window.open(project.github, "_blank", "noopener,noreferrer")}
                      sx={{
                        fontSize: { xs: "0.75rem", sm: "0.8125rem" },
                        fontWeight: 600,
                        color: "#1d1d1f",
                        backgroundColor: "#f0f0f0",
                        height: "32px",
                        px: 1.5,
                        border: "1px solid rgba(0,0,0,0.1)",
                        cursor: "pointer",
                        "&:hover": {
                          backgroundColor: "#e0e0e0",
                        },
                      }}
                    />
                  )}
                  {/* YouTube Tag */}
                  {project.youtube && (
                    <Chip
                      label="YouTube"
                      onClick={() => window.open(project.youtube, "_blank", "noopener,noreferrer")}
                      sx={{
                        fontSize: { xs: "0.75rem", sm: "0.8125rem" },
                        fontWeight: 600,
                        color: "#dc2626",
                        backgroundColor: "rgba(220, 38, 38, 0.1)",
                        height: "32px",
                        px: 1.5,
                        border: "1px solid rgba(220, 38, 38, 0.3)",
                        cursor: "pointer",
                        "&:hover": {
                          backgroundColor: "rgba(220, 38, 38, 0.15)",
                        },
                      }}
                    />
                  )}
                </Box>
              </Box>
            </motion.div>

            {/* Project Animation/Image */}
            {project.animation && (
              <motion.div variants={itemVariants}>
                <Box
                  sx={{
                    width: "100%",
                      height: { xs: "auto", sm: "400px", md: "500px" },
                      minHeight: { xs: "200px", sm: "350px", md: "500px" },
                      mb: { xs: 3, sm: 3.5, md: 4 },
                    borderRadius: "12px",
                    overflow: "hidden",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                  }}
                >
                  {project.animation}
                </Box>
              </motion.div>
            )}

            {/* Description */}
            <motion.div variants={itemVariants}>
              <Box id="overview" sx={{ position: "relative", zIndex: 1, scrollMarginTop: "80px" }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: { xs: 1, sm: 1.25, md: 1.5 },
                    mb: { xs: 2, sm: 2.5, md: 3 },
                  }}
                >
                  <Box
                    sx={{
                      width: "4px",
                      height: { xs: "20px", sm: "22px", md: "24px" },
                      borderRadius: "2px",
                      bgcolor: project.accentColor || "#0071e3",
                    }}
                  />
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 700,
                      color: "#1d1d1f",
                      fontSize: { xs: "1.125rem", sm: "1.375rem", md: "1.75rem" },
                      letterSpacing: "-0.02em",
                    }}
                  >
                    Overview
                  </Typography>
                </Box>
                <Typography
                  sx={{
                    color: "#4a4a4a",
                    mb: { xs: 2.5, sm: 2.75, md: 3 },
                    fontSize: { xs: "0.9375rem", sm: "1.0625rem", md: "1.25rem" },
                    lineHeight: { xs: 1.7, sm: 1.75, md: 1.8 },
                    fontWeight: 400,
                  }}
                >
                  {project.description}
                </Typography>
              </Box>
            </motion.div>

            {/* Extended Description if available */}
            {project.extendedDescription && (
              <motion.div variants={itemVariants}>
                <Typography
                  sx={{
                    color: "#666",
                    mb: 4,
                    fontSize: { xs: "0.9375rem", sm: "1rem", md: "1.0625rem" },
                    lineHeight: 1.7,
                  }}
                >
                  {project.extendedDescription}
                </Typography>
              </motion.div>
            )}

            {/* Screenshots Lightbox Carousel */}
            {project.screenshots && project.screenshots.length > 0 && (
              <LightboxCarousel
                screenshots={project.screenshots}
                projectTitle={project.title}
                accentColor={project.accentColor || "#0071e3"}
              />
            )}

            <Divider sx={{ my: { xs: 3, sm: 3.5, md: 4 } }} />

            {/* Tools & Technologies */}
            <motion.div variants={itemVariants}>
              <Box sx={{ position: "relative", zIndex: 1 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: { xs: 1, sm: 1.25, md: 1.5 },
                    mb: { xs: 2, sm: 2.5, md: 3 },
                  }}
                >
                  <Box
                    sx={{
                      width: "4px",
                      height: { xs: "20px", sm: "22px", md: "24px" },
                      borderRadius: "2px",
                      bgcolor: project.accentColor || "#0071e3",
                    }}
                  />
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 700,
                      color: "#1d1d1f",
                      fontSize: { xs: "1.125rem", sm: "1.375rem", md: "1.75rem" },
                      letterSpacing: "-0.02em",
                    }}
                  >
                    Tools & Technologies
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 1.5,
                    mb: 4,
                  }}
                >
                  {project.tools?.map((tool, index) => (
                    <Chip
                      key={index}
                      label={tool}
                      sx={{
                        fontSize: { xs: "0.8125rem", sm: "0.875rem", md: "0.9375rem" },
                        fontWeight: 600,
                        color: "#1d1d1f",
                        backgroundColor: "#f5f5f7",
                        height: { xs: "36px", sm: "38px", md: "40px" },
                        px: { xs: 1.5, sm: 1.75, md: 2 },
                        border: "1px solid rgba(0,0,0,0.08)",
                        transition: "all 0.2s ease",
                        "&:hover": {
                          backgroundColor: "#e8e8ed",
                          transform: "translateY(-2px)",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                        },
                      }}
                    />
                  ))}
                </Box>
              </Box>
            </motion.div>

            {/* Timeline */}
            {project.timeline && project.timeline.length > 0 && project.id !== 1 && (
              <>
                <Divider sx={{ my: 5, borderColor: "rgba(0,0,0,0.08)" }} />
                <motion.div variants={itemVariants}>
                  <Box sx={{ position: "relative", zIndex: 1 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                        mb: 4,
                      }}
                    >
                      <Box
                        sx={{
                          width: "4px",
                          height: "24px",
                          borderRadius: "2px",
                          bgcolor: project.accentColor || "#0071e3",
                        }}
                      />
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 700,
                          color: "#1d1d1f",
                          fontSize: { xs: "1.25rem", sm: "1.5rem", md: "1.75rem" },
                          letterSpacing: "-0.02em",
                        }}
                      >
                        Timeline
                      </Typography>
                    </Box>
                  <Box sx={{ position: "relative", pl: 3 }}>
                    {/* Timeline Line */}
                    <Box
                      sx={{
                        position: "absolute",
                        left: "8px",
                        top: 0,
                        bottom: 0,
                        width: "2px",
                        bgcolor: "#e0e0e0",
                      }}
                    />
                    {project.timeline.map((milestone, index) => (
                      <Box
                        key={index}
                        sx={{
                          position: "relative",
                          mb: 4,
                          "&:last-child": { mb: 0 },
                        }}
                      >
                        {/* Timeline Dot */}
                        <Box
                          sx={{
                            position: "absolute",
                            left: "-19px",
                            top: "6px",
                            width: "14px",
                            height: "14px",
                            borderRadius: "50%",
                            bgcolor: project.accentColor || "#0071e3",
                            border: "3px solid #ffffff",
                            boxShadow: "0 0 0 2px #e0e0e0",
                          }}
                        />
                        <Typography
                          sx={{
                            fontWeight: 600,
                            color: "#1d1d1f",
                            mb: 0.5,
                            fontSize: { xs: "1rem", sm: "1.0625rem", md: "1.125rem" },
                          }}
                        >
                          {milestone.phase}
                        </Typography>
                        <Typography
                          sx={{
                            color: "#86868b",
                            fontSize: { xs: "0.8125rem", sm: "0.875rem" },
                            mb: 1,
                          }}
                        >
                          {milestone.date}
                        </Typography>
                        <Typography
                          sx={{
                            color: "#666",
                            fontSize: { xs: "0.9375rem", sm: "1rem" },
                            lineHeight: 1.6,
                          }}
                        >
                          {milestone.description}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                  </Box>
                </motion.div>
              </>
            )}

            {/* Key Features */}
            {project.keyFeatures && project.keyFeatures.length > 0 && (
              <>
                <Divider sx={{ my: 5, borderColor: "rgba(0,0,0,0.08)" }} />
                <motion.div variants={itemVariants}>
                  <Box sx={{ position: "relative", zIndex: 1 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                        mb: 4,
                      }}
                    >
                      <Box
                        sx={{
                          width: "4px",
                          height: "24px",
                          borderRadius: "2px",
                          bgcolor: project.accentColor || "#0071e3",
                        }}
                      />
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 700,
                          color: "#1d1d1f",
                          fontSize: { xs: "1.25rem", sm: "1.5rem", md: "1.75rem" },
                          letterSpacing: "-0.02em",
                        }}
                      >
                        Key Features
                      </Typography>
                    </Box>
                    <Box
                      component="ul"
                      sx={{
                        listStyle: "none",
                        pl: 0,
                        mb: 4,
                      }}
                    >
                      {project.keyFeatures.map((feature, index) => (
                        <Box
                          key={index}
                          component="li"
                          sx={{
                            mb: 2,
                            display: "flex",
                            alignItems: "flex-start",
                            "&:last-child": { mb: 0 },
                          }}
                        >
                          <Box
                            sx={{
                              width: "6px",
                              height: "6px",
                              borderRadius: "50%",
                              bgcolor: project.accentColor || "#0071e3",
                              mt: 1,
                              mr: 2,
                              flexShrink: 0,
                            }}
                          />
                          <Typography
                            sx={{
                              color: "#666",
                              fontSize: { xs: "0.9375rem", sm: "1rem" },
                              lineHeight: 1.7,
                            }}
                          >
                            {feature}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                </motion.div>
              </>
            )}

            {/* Action Buttons */}
            <motion.div variants={itemVariants}>
              <Divider sx={{ my: 5, borderColor: "rgba(0,0,0,0.08)" }} />
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  flexWrap: "wrap",
                  position: "relative",
                  zIndex: 1,
                }}
              >
                {/* Determine if it's YouTube or GitHub link */}
                {project.youtube ? (
                  <Button
                    component="a"
                    href={project.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="contained"
                    startIcon={<YouTubeIcon />}
                    sx={{
                      bgcolor: "#FF0000",
                      color: "#ffffff",
                      textTransform: "none",
                      fontSize: { xs: "0.875rem", sm: "0.9375rem", md: "1rem" },
                      fontWeight: 500,
                      px: { xs: 3, sm: 3.5, md: 4 },
                      py: { xs: 1.25, sm: 1.5 },
                      borderRadius: "8px",
                      "&:hover": {
                        bgcolor: "#CC0000",
                      },
                    }}
                  >
                    See on YouTube
                  </Button>
                ) : project.github ? (
                  <Button
                    component="a"
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="contained"
                    startIcon={<GitHubIcon />}
                    sx={{
                      bgcolor: "#1d1d1f",
                      color: "#ffffff",
                      textTransform: "none",
                      fontSize: { xs: "0.875rem", sm: "0.9375rem", md: "1rem" },
                      fontWeight: 500,
                      px: { xs: 3, sm: 3.5, md: 4 },
                      py: { xs: 1.25, sm: 1.5 },
                      borderRadius: "8px",
                      "&:hover": {
                        bgcolor: "#000000",
                      },
                    }}
                  >
                    See on GitHub
                  </Button>
                ) : null}
                {project.userManual && (
                  <Button
                    component="a"
                    href={project.userManual}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="outlined"
                    startIcon={<DescriptionIcon />}
                    sx={{
                      borderColor: "#1d1d1f",
                      color: "#1d1d1f",
                      textTransform: "none",
                      fontSize: { xs: "0.875rem", sm: "0.9375rem", md: "1rem" },
                      fontWeight: 500,
                      px: { xs: 3, sm: 3.5, md: 4 },
                      py: { xs: 1.25, sm: 1.5 },
                      borderRadius: "8px",
                      "&:hover": {
                        borderColor: "#000000",
                        bgcolor: "rgba(0,0,0,0.05)",
                      },
                    }}
                  >
                    User Manual
                  </Button>
                )}
                {project.liveUrl && (
                  <Button
                    component="a"
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="outlined"
                    startIcon={<LaunchIcon />}
                    sx={{
                      borderColor: "#1d1d1f",
                      color: "#1d1d1f",
                      textTransform: "none",
                      fontSize: { xs: "0.875rem", sm: "0.9375rem", md: "1rem" },
                      fontWeight: 500,
                      px: { xs: 3, sm: 3.5, md: 4 },
                      py: { xs: 1.25, sm: 1.5 },
                      borderRadius: "8px",
                      "&:hover": {
                        borderColor: "#000000",
                        bgcolor: "rgba(0,0,0,0.05)",
                      },
                    }}
                  >
                    View Live Site
                  </Button>
                )}
              </Box>
            </motion.div>
          </Paper>
        </motion.div>
      </Container>

      {/* Image Dialog for Full-Screen View */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: "rgba(0,0,0,0.9)",
            borderRadius: "12px",
            overflow: "hidden",
          },
        }}
      >
        <IconButton
          onClick={() => setOpenDialog(false)}
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            color: "#ffffff",
            bgcolor: "rgba(255,255,255,0.1)",
            zIndex: 1,
            "&:hover": {
              bgcolor: "rgba(255,255,255,0.2)",
            },
          }}
        >
          <CloseIcon />
        </IconButton>
        {selectedImage && (
          <OptimizedImage
            src={selectedImage}
            alt="Full screen screenshot"
            priority={true}
            sx={{
              width: "100%",
              height: "auto",
              maxHeight: "90vh",
              objectFit: "contain",
              willChange: "auto",
            }}
          />
        )}
      </Dialog>
    </Box>
  );
}
