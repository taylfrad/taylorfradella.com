import {
  Container,
  Typography,
  Grid,
  Box,
  Paper,
} from "@mui/material";
import useIntersectionObserver from "../hooks/useIntersectionObserver";
import { motion } from "framer-motion";
import { useState, useEffect, useMemo, memo } from "react";

export default function Skills() {
  const [containerRef, isVisible] = useIntersectionObserver({
    threshold: 0.2,
  });
  const [hasBeenVisible, setHasBeenVisible] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setHasBeenVisible(true);
    }
  }, [isVisible]);

  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: "easeOut" },
    },
  };

  // Main skill categories matching the mock design - Memoized
  const skillCategories = useMemo(() => [
    {
      title: "Web Development",
      icon: "devicon-react-plain colored",
      description: "React, Node.js, TypeScript, JavaScript",
    },
    {
      title: "Full-Stack Solutions",
      icon: "devicon-nodejs-plain colored",
      description: "React, Node.js, SQL, REST APIs",
    },
    {
      title: "Cloud & Tools",
      icon: "devicon-github-plain colored",
      description: "Azure, Git, VS Code, CI/CD",
    },
  ], []);

  return (
    <Box
      ref={containerRef}
      sx={{
        width: "100%",
        position: "relative",
        bgcolor: "#ffffff",
        color: "text.primary",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        pt: 0,
        pb: 0,
        px: 0,
      }}
    >
      <Container 
        maxWidth="lg" 
        sx={{ 
          width: "100%", 
          px: { xs: 2, sm: 3, md: 4 },
          "& .MuiContainer-root": {
            maxWidth: "100% !important",
          },
        }}
      >
        <Paper
          elevation={0}
          sx={{
            bgcolor: "#f5f5f7",
            borderRadius: "18px",
            p: { xs: 2.5, sm: 3.5, md: 4, lg: 5 },
            boxShadow: "none",
            border: "none",
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          <Typography
            variant="h2"
            sx={{
              fontWeight: 600,
              fontSize: { xs: "1.75rem", sm: "2.25rem", md: "2.5rem", lg: "2.75rem" },
              mb: { xs: 3.5, md: 4.5 },
              color: "#1d1d1f",
              textAlign: "left",
              letterSpacing: "-0.02em",
              lineHeight: 1.05,
            }}
          >
            My Skills
          </Typography>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isVisible || hasBeenVisible ? "visible" : "hidden"}
          >
            <Grid 
              container 
              spacing={4}
              sx={{ 
                margin: 0, 
                width: "100%",
              }}
            >
              {skillCategories.map((category, index) => (
                <Grid size={{ xs: 12, md: 4 }} key={index}>
                  <motion.div variants={itemVariants}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: { xs: 3, md: 4 },
                        borderRadius: "16px",
                        bgcolor: "#ffffff",
                        border: "none",
                        height: "100%",
                        minHeight: { xs: "260px", sm: "280px", md: "320px" },
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        textAlign: "center",
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        boxShadow: "none",
                        "&:hover": {
                          transform: "translateY(-2px)",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                        },
                      }}
                    >
                      <Box
                        sx={{
                          mb: 1.5,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <i
                          className={category.icon}
                          style={{
                            fontSize: "clamp(36px, 8vw, 48px)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        />
                      </Box>
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 600,
                          mb: 1,
                          color: "#1d1d1f",
                          fontSize: { xs: "1.1875rem", md: "1.375rem" },
                          letterSpacing: "-0.01em",
                          lineHeight: 1.3,
                        }}
                      >
                        {category.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#86868b",
                          fontSize: { xs: "0.9375rem", md: "1rem" },
                          lineHeight: 1.47059,
                          letterSpacing: "-0.01em",
                        }}
                      >
                        {category.description}
                      </Typography>
                    </Paper>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        </Paper>
      </Container>
    </Box>
  );
}
