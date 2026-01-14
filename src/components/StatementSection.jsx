import { Box, Typography, Container } from "@mui/material";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useEffect, useState } from "react";
import OptimizedImage from "./OptimizedImage";

export default function StatementSection() {
  const [hasBeenVisible, setHasBeenVisible] = useState(false);
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: false,
  });

  useEffect(() => {
    if (inView) {
      setHasBeenVisible(true);
    }
  }, [inView]);

  return (
    <Box
      ref={ref}
      sx={{
        width: "100%",
        bgcolor: "#f5f5f7",
        py: { xs: 4, md: 6 },
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView || hasBeenVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
        >
          <Typography
            variant="h2"
            sx={{
              fontWeight: 600,
              fontSize: { xs: "1.875rem", sm: "2.5rem", md: "3rem", lg: "3.5rem" },
              textAlign: "center",
              mb: 1,
              color: "#1d1d1f",
              letterSpacing: "-0.02em",
              lineHeight: 1.05,
            }}
          >
            Let's Work Together.
          </Typography>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView || hasBeenVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Typography
            variant="body1"
            sx={{
              color: "#86868b",
              fontSize: { xs: "1rem", sm: "1.125rem", md: "1.375rem" },
              textAlign: "center",
              mb: { xs: 3, md: 4 },
              lineHeight: 1.47059,
              letterSpacing: "-0.016em",
              fontWeight: 400,
            }}
          >
            Have a project in mind? Let's create something amazing.
          </Typography>
        </motion.div>

        {/* Device Mockups - Single Image */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView || hasBeenVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: { xs: 2, md: 3 },
            }}
          >
            <OptimizedImage
              src="/devices.png"
              alt="Devices"
              sx={{
                width: "100%",
                maxWidth: { xs: "90%", sm: "600px", md: "800px" },
                height: "auto",
                objectFit: "contain",
                filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.06))",
              }}
            />
          </Box>
        </motion.div>

        {/* Thanks for stopping by */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView || hasBeenVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Typography
            variant="h5"
            align="center"
            sx={{
              color: "#1d1d1f",
              fontWeight: 600,
              fontSize: { xs: "1.25rem", sm: "1.375rem", md: "1.5rem" },
              letterSpacing: "-0.01em",
              lineHeight: 1.47059,
            }}
          >
            Thanks for stopping by, let's chat!{" "}
            <span className="wave-hand" role="img" aria-label="waving hand">
              👋
            </span>
          </Typography>
        </motion.div>
      </Container>
    </Box>
  );
}
