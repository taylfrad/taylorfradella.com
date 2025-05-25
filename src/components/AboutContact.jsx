// Modified AboutContact.jsx
import {
  Box,
  Typography,
  Container,
  Grid,
  Button,
  Paper,
  IconButton,
  Link,
  useTheme,
} from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import EmailIcon from "@mui/icons-material/Email";
import useIntersectionObserver from "../hooks/useIntersectionObserver";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import { motion, useAnimation, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";
import SectionHeader from "./SectionHeader";

export default function AboutContact() {
  const theme = useTheme();
  const [containerRef, isVisible] = useIntersectionObserver({
    threshold: 0.1,
  });
  const controls = useAnimation();
  const sectionRef = useRef();
  const stickyRef = useRef();
  // Use Framer Motion's useScroll to get scroll progress within the section
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  // Interpolate left and translateX from center to left as you scroll
  const left = useTransform(scrollYProgress, [0, 1], ["50%", "24px"]);
  const translateX = useTransform(scrollYProgress, [0, 1], ["-50%", "0%"]);

  useEffect(() => {
    if (isVisible) controls.start("visible");
  }, [isVisible, controls]);

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

  const socials = [
    {
      name: "GitHub",
      icon: <GitHubIcon fontSize="large" />,
      url: "https://github.com/taylfrad",
    },
    {
      name: "LinkedIn",
      icon: <LinkedInIcon fontSize="large" />,
      url: "https://www.linkedin.com/in/taylorfradella/",
    },
    {
      name: "Email",
      icon: <EmailIcon fontSize="large" />,
      url: "mailto:taylor.fradella@selu.edu",
    },
    {
      name: "Resume",
      icon: <InsertDriveFileIcon fontSize="large" />, // Changed from DownloadIcon to InsertDriveFileIcon
      url: "https://docs.google.com/document/d/1m9vus2XiZgg8Ket0AMkIP9sJzNuEmZF-qncZdzFydjA/edit?usp=sharing", // Updated URL
    },
  ];

  return (
    <Box
      id="about"
      ref={sectionRef}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        position: "relative",
        bgcolor: "#ffffff",
        width: "100%",
        pt: { xs: 4, sm: 6, md: 8 },
        pb: { xs: 4, sm: 6, md: 8 },
      }}
    >
      <SectionHeader
        title="About Me"
        sectionRef={sectionRef}
        accentColor={theme.palette.primary.main}
        sx={{ mb: 8 }}
      />
      <Box
        sx={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Paper
          elevation={0}
          sx={{
            background: "linear-gradient(135deg, #fafdff 0%, #e8eef6 100%)",
            borderRadius: "32px",
            p: { xs: 3, sm: 6 },
            mb: 6,
            boxShadow: "0 12px 48px 0 rgba(31, 38, 135, 0.16)",
            maxWidth: 900,
            width: "100%",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
          }}
        >
          <Typography
            variant="body1"
            paragraph
            sx={{
              color: "#6b7280",
              lineHeight: 1.7,
              fontSize: "1.18rem",
              fontWeight: 400,
              letterSpacing: "-0.01em",
              mb: 2,
            }}
          >
            Hi, I'm Taylor Fradella — a Computer Science student at Southeastern
            Louisiana University. I'm passionate about building clean,
            functional software that actually helps people. To me, good design
            should be simple, and everything should just work.
          </Typography>

          <Typography
            variant="body1"
            paragraph
            sx={{
              color: "#6b7280",
              lineHeight: 1.7,
              fontSize: "1.18rem",
              fontWeight: 400,
              letterSpacing: "-0.01em",
              mb: 2,
            }}
          >
            I'm still early in my journey, but I'm always looking to learn more,
            try new tools, and take on real-world challenges. Whether I'm
            working on a mobile app, a web project, or something behind the
            scenes, I enjoy digging into how things work and figuring out how to
            make them better.
          </Typography>

          <Typography
            variant="body1"
            paragraph
            sx={{
              color: "#6b7280",
              lineHeight: 1.7,
              fontSize: "1.18rem",
              fontWeight: 400,
              letterSpacing: "-0.01em",
              mb: 2,
            }}
          >
            Lately, I've been working with C#, React, SQL, and .NET — building
            full-stack apps, collaborating with teams, and focusing on writing
            code that's not just efficient, but also easy to use and maintain.
          </Typography>

          <Box sx={{ height: { xs: 32, md: 48 } }} />

          {/* Connect Section - Centered with pointing down emoji */}
          <Box
            sx={{
              mt: 4,
              textAlign: "center",
            }}
          >
            <Typography
              variant="h5"
              component="h3"
              sx={{
                fontWeight: 600,
                mb: 2,
                color: "#0f172a",
              }}
            >
              Connect With Me{" "}
              <span className="bounce-down" role="img" aria-label="down">
                👇
              </span>
            </Typography>

            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                gap: 4.5,
                mb: 6,
              }}
            >
              {socials.map((social) => (
                <IconButton
                  key={social.name}
                  component={Link}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  sx={{
                    width: "68px",
                    height: "68px",
                    bgcolor: "linear-gradient(90deg, #fafdff 0%, #e8eef6 100%)",
                    color: theme.palette.primary.main,
                    borderRadius: "999px",
                    boxShadow: "0 2px 12px rgba(31,38,135,0.08)",
                    border: "none",
                    transition: "all 0.3s cubic-bezier(.4,0,.2,1)",
                    "&:hover": {
                      bgcolor:
                        "linear-gradient(90deg, #e8eef6 0%, #fafdff 100%)",
                      transform: "translateY(-6px) scale(1.08)",
                      boxShadow: "0 8px 24px rgba(31,38,135,0.13)",
                    },
                  }}
                >
                  {social.icon}
                </IconButton>
              ))}
            </Box>

            <Typography variant="body1" sx={{ color: "#334155" }}>
              Let's build something awesome together 🚀
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}
