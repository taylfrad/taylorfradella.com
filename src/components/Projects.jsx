// src/components/Projects.jsx
import { useTheme } from "@mui/material/styles";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Chip,
  Container,
  CardMedia,
  CardActions,
  Link,
  Paper,
} from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import useIntersectionObserver from "../hooks/useIntersectionObserver";
import { useRef, useEffect, useState } from "react";
import { motion, useAnimation, useScroll, useTransform } from "framer-motion";
import { useInView } from "react-intersection-observer";
import SectionHeader from "./SectionHeader";
import Hero from "./Hero";
import MiniHero from "./MiniHero";

// Move this to the very top of the file, before any imports or usage
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

export default function Projects() {
  const theme = useTheme();
  const [containerRef, isVisible] = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: "-100px",
  });
  const controls = useAnimation();

  useEffect(() => {
    if (isVisible) {
      controls.start("visible");
    } else {
      controls.start("hidden");
    }
  }, [isVisible, controls]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        when: "beforeChildren",
      },
    },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.23, 1, 0.32, 1],
      },
    },
  };

  // Function to get URLs for technology links
  const getTechUrl = (techName) => {
    const techUrls = {
      React: "https://reactjs.org/",
      "Material UI": "https://mui.com/",
      CSS: "https://developer.mozilla.org/en-US/docs/Web/CSS",
      "Responsive Design":
        "https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design",
      SQL: "https://azure.microsoft.com/en-us/products/azure-sql/database",
      "React Native": "https://reactnative.dev/",
      Expo: "https://expo.dev/",
      "Node.js": "https://nodejs.org/",
      Python: "https://www.python.org/",
      "Raspberry Pi": "https://www.raspberrypi.org/",
      "Dexcom API": "https://developer.dexcom.com/",
      "AI Integration": "https://openai.com/blog/chatgpt",
      Grok: "https://grok.x.ai/",
    };

    return techUrls[techName] || "#";
  };

  // Get the devicon class for each technology
  const getTechIconClass = (techName) => {
    const techIcons = {
      React: "devicon-react-plain colored",
      "Material UI": "devicon-materialui-plain colored",
      CSS: "devicon-css3-plain colored",
      "Responsive Design": "devicon-html5-plain colored",
      SQL: "devicon-microsoftsqlserver-plain colored",
      "React Native": "devicon-react-plain colored",
      Expo: "devicon-react-plain colored", // No specific Expo icon in Devicon
      "Node.js": "devicon-nodejs-plain colored",
      Python: "devicon-python-plain colored",
      "Raspberry Pi": "devicon-raspberrypi-plain colored",
      "Dexcom API": "devicon-javascript-plain colored", // Using JS icon as placeholder
      "AI Integration": "devicon-python-plain colored", // Using Python as placeholder
      Grok: "devicon-tensorflow-original colored", // Using TensorFlow as placeholder
    };

    return techIcons[techName] || "devicon-github-plain colored"; // Default to github icon if not found
  };

  // Custom component for Devicon in tech chips
  const DeviconWrapper = ({ iconClass }) => (
    <i
      className={iconClass}
      style={{
        fontSize: "18px",
        marginRight: "6px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    />
  );

  // Portfolio Website Animation
  const portfolioAnimation = (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#ffffff",
        overflow: "hidden",
        position: "relative",
        minHeight: "250px",
      }}
    >
      {/* Hero Section Content - Direct, no browser frame */}
      <Box
        sx={{
          position: "relative",
          width: { xs: "90%", md: "85%" },
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          overflow: "hidden",
          background: "#ffffff",
          p: 2,
        }}
      >
          {/* Navigation - Absolute positioned at top */}
          <Box
            sx={{
              position: "absolute",
              top: "12px",
              left: "16px",
              display: "flex",
              gap: 1.5,
              zIndex: 10,
            }}
          >
            {["About", "Projects", "Contact"].map((item) => (
              <Typography
                key={item}
                sx={{
                  color: "#1d1d1f",
                  fontSize: "9px",
                  fontWeight: 400,
                  letterSpacing: "-0.01em",
                }}
              >
                {item}
              </Typography>
            ))}
          </Box>

          {/* Left Side - Text Content */}
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              justifyContent: "center",
              pr: 1.5,
              mt: 3,
            }}
          >
            {/* Heading */}
            <Typography
              sx={{
                fontWeight: 600,
                fontSize: "18px",
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
                mb: 1,
                color: "#1d1d1f",
              }}
            >
              Hi, I'm Taylor Fradella.
            </Typography>

            {/* Subtitle */}
            <Typography
              sx={{
                color: "#86868b",
                fontWeight: 400,
                fontSize: "10px",
                mb: 2,
                lineHeight: 1.4,
                letterSpacing: "-0.01em",
              }}
            >
              A computer science student passionate about building elegant & efficient software.
            </Typography>

            {/* Button */}
            <Box
              sx={{
                bgcolor: "#e0e0e0",
                color: "#222",
                px: 1.5,
                py: 0.5,
                borderRadius: "8px",
                fontSize: "9px",
                fontWeight: 500,
              }}
            >
              Get in Touch
            </Box>
          </Box>

          {/* Right Side - MacBook */}
          <Box
            sx={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Box
              component="img"
              src="/macbook-frame.png"
              alt="MacBook"
              sx={{
                width: "100%",
                maxWidth: "200px",
                height: "auto",
                objectFit: "contain",
              }}
            />
          </Box>
        </Box>
    </Box>
  );

  // Lions Den Cinemas Animation
  const lionsTheaterAnimation = (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        minHeight: 250,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #1a0000 0%, #330000 100%)",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Website Preview (relative for overlap) */}
      <Box
        sx={{
          position: "relative",
          width: { xs: "60vw", md: "420px" },
          maxWidth: "600px",
          minWidth: "320px",
          height: { xs: "60vw", md: "340px" },
          maxHeight: "420px",
          minHeight: "240px",
          background: "#000",
          borderRadius: "16px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
          overflow: "hidden",
          border: "1.5px solid rgba(255,0,0,0.25)",
          display: "flex",
          flexDirection: "column",
          zIndex: 1,
        }}
      >
        {/* Browser Header */}
        <Box
          sx={{
            height: "28px",
            background: "#1a0000",
            display: "flex",
            alignItems: "center",
            padding: "0 10px",
            gap: "6px",
          }}
        >
          {["#ff5f57", "#febc2e", "#28c840"].map((color, i) => (
            <Box
              key={i}
              sx={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: color,
              }}
            />
          ))}
          <Box
            sx={{
              flex: 1,
              height: "13px",
              margin: "0 10px",
              background: "rgba(255,0,0,0.1)",
              borderRadius: "3px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography
              variant="caption"
              sx={{ fontSize: "8px", color: "rgba(255,255,255,0.6)" }}
            >
              lionsdencinemas.com
            </Typography>
          </Box>
        </Box>

        {/* Website Content with animated scroll */}
        <Box
          sx={{
            height: "calc(100% - 28px)",
            padding: "12px 10px 10px 10px",
            background: "#000",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            overflowY: "auto",
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": { display: "none" },
          }}
        >
          {/* Navigation */}
          <Box
            sx={{
              display: "flex",
              gap: "12px",
              padding: "4px 0 8px 0",
              borderBottom: "1px solid rgba(255,0,0,0.15)",
            }}
          >
            {["Home", "Movies", "Showtimes", "About"].map((item, i) => (
              <Typography
                key={i}
                sx={{
                  fontSize: "9px",
                  color: i === 0 ? "#ff0000" : "rgba(255,255,255,0.7)",
                  fontWeight: i === 0 ? "bold" : "normal",
                  letterSpacing: 0.5,
                }}
              >
                {item}
              </Typography>
            ))}
          </Box>

          {/* Featured Movie */}
          <Box
            sx={{
              height: "38%",
              background: "linear-gradient(45deg, #1a0000, #330000)",
              borderRadius: "5px",
              padding: "8px 10px",
              display: "flex",
              gap: "10px",
              alignItems: "center",
            }}
          >
            <Box
              component="img"
              src={moviePosters["Dumbo (1941)"]}
              alt="Dumbo (1941) poster"
              sx={{
                width: 44,
                height: 62,
                objectFit: "cover",
                borderRadius: "4px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.18)",
                background: "rgba(255,0,0,0.1)",
                mr: 2,
              }}
            />
            <Box sx={{ flex: 1 }}>
              <Typography
                sx={{
                  fontSize: "11px",
                  color: "#fff",
                  fontWeight: "bold",
                  marginBottom: "2px",
                }}
              >
                Dumbo (1941)
              </Typography>
              <Typography
                sx={{
                  fontSize: "8px",
                  color: "rgba(255,255,255,0.7)",
                }}
              >
                Now Showing - Disney Classic
              </Typography>
            </Box>
          </Box>

          {/* Animated Scrollable Movie List */}
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
                gap: "7px",
                position: "relative",
                width: "100%",
              }}
            >
              {/* Duplicate the movie list for seamless looping */}
              {[
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
              ].map((movie, i) => (
                <Box
                  key={i}
                  sx={{
                    minHeight: "28px",
                    background: "rgba(255,0,0,0.05)",
                    borderRadius: "3px",
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
                      boxShadow: "0 1px 4px rgba(0,0,0,0.13)",
                      background: "rgba(255,0,0,0.1)",
                      mr: 1,
                    }}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      sx={{
                        fontSize: "8px",
                        color: "#fff",
                        fontWeight: "bold",
                      }}
                    >
                      {movie.title}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "7px",
                        color: "rgba(255,255,255,0.7)",
                      }}
                    >
                      {movie.time}
                    </Typography>
                  </Box>
                </Box>
              ))}
              {/* Repeat for seamless scroll */}
              {[
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
              ].map((movie, i) => (
                <Box
                  key={"repeat-" + i}
                  sx={{
                    minHeight: "28px",
                    background: "rgba(255,0,0,0.05)",
                    borderRadius: "3px",
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
                      boxShadow: "0 1px 4px rgba(0,0,0,0.13)",
                      background: "rgba(255,0,0,0.1)",
                      mr: 1,
                    }}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      sx={{
                        fontSize: "8px",
                        color: "#fff",
                        fontWeight: "bold",
                      }}
                    >
                      {movie.title}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "7px",
                        color: "rgba(255,255,255,0.7)",
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

      {/* Mobile App Preview (overlapping right side) */}
      <Box
        sx={{
          position: "absolute",
          right: { xs: "8vw", md: "calc(18% - 30px)" },
          top: { xs: "50%", md: "50%" },
          transform: "translateY(-50%)",
          width: { xs: "28vw", md: "160px" },
          maxWidth: "220px",
          minWidth: "110px",
          height: { xs: "60vw", md: "340px" },
          maxHeight: "420px",
          minHeight: "240px",
          background: "#111",
          borderRadius: "38px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.45)",
          overflow: "hidden",
          border: "3.5px solid #222",
          display: "flex",
          flexDirection: "column",
          zIndex: 2,
          pb: "6px",
        }}
      >
        {/* App Header */}
        <Box
          sx={{
            height: "38px",
            background: "linear-gradient(90deg, #1a0000, #330000)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pt: "6px",
          }}
        >
          <Typography
            sx={{
              fontSize: "11px",
              color: "#fff",
              fontWeight: "bold",
              letterSpacing: 1,
              lineHeight: 1.1,
            }}
            noWrap
          >
            LIONS DEN CINEMAS
          </Typography>
        </Box>
        {/* App Content - scrollable if needed */}
        <Box
          sx={{
            height: "calc(100% - 38px - 6px)", // header, home indicator
            pt: "6px",
            px: "7px",
            background: "#000",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Auto-scrolling Movie List for iPhone */}
          <Box
            className="auto-scroll-movie-list"
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "7px",
              position: "absolute",
              width: "100%",
              animation: "autoScrollIphone 6s linear infinite",
              "@keyframes autoScrollIphone": {
                "0%": { top: "0%" },
                "50%": { top: "-50%" },
                "100%": { top: "0%" },
              },
            }}
          >
            {[
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
            ].map((movie, i) => (
              <Box
                key={i}
                sx={{
                  minHeight: "38px",
                  background: "rgba(255,0,0,0.07)",
                  borderRadius: "7px",
                  padding: "6px 7px 5px 7px",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  boxShadow:
                    i === 0 ? "0 1px 4px rgba(255,0,0,0.04)" : undefined,
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
                    width: 26,
                    height: 36,
                    objectFit: "cover",
                    borderRadius: "2.5px",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.13)",
                    background: "rgba(255,0,0,0.1)",
                  }}
                />
                <Box sx={{ flex: 1 }}>
                  <Typography
                    sx={{
                      fontSize: "8.5px",
                      color: "#fff",
                      fontWeight: "bold",
                      lineHeight: 1.1,
                    }}
                    noWrap
                  >
                    {movie.title}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "6.5px",
                      color: "rgba(255,255,255,0.7)",
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
        {/* iPhone Home Indicator */}
        <Box
          sx={{
            position: "absolute",
            bottom: "8px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "16%",
            height: "2px",
            background: "#222",
            borderRadius: "3px",
            opacity: 0.7,
            zIndex: 10,
          }}
        />
      </Box>

      {/* Tech Stack Icons */}
      <Box
        sx={{
          position: "absolute",
          bottom: "8%",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: "15px",
        }}
      >
        {[
          { icon: "devicon-react-plain", color: "#61DAFB" },
          { icon: "devicon-nodejs-plain", color: "#339933" },
          { icon: "devicon-microsoftsqlserver-plain", color: "#CC2927" },
        ].map((tech, i) => (
          <Box
            key={i}
            sx={{
              width: "30px",
              height: "30px",
              background: "rgba(0,0,0,0.8)",
              borderRadius: "6px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
              animation: `float 3s infinite ease-in-out ${i * 0.2}s`,
              "@keyframes float": {
                "0%, 100%": { transform: "translateY(0)" },
                "50%": { transform: "translateY(-5px)" },
              },
            }}
          >
            <i
              className={tech.icon}
              style={{
                fontSize: "20px",
                color: tech.color,
              }}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );

  // Blood Sugar Monitor Animation
  const bloodSugarMonitorAnimation = (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)",
        overflow: "hidden",
        position: "relative",
        minHeight: "250px",
      }}
    >
      {/* Main Device Display */}
      <Box
        sx={{
          position: "relative",
          width: { xs: "90%", md: "70%" },
          height: { xs: "auto", md: "80%" },
          background: "#2c3e50",
          borderRadius: "15px",
          display: "flex",
          flexDirection: "column",
          padding: "15px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "10px",
          }}
        >
          <Typography
            sx={{
              fontSize: "14px",
              color: "white",
              fontWeight: "bold",
            }}
          >
            Dexcom G6 + Grok AI
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <Box
              sx={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: "#4caf50",
                animation: "pulse 2s infinite",
                "@keyframes pulse": {
                  "0%": { opacity: 0.5 },
                  "50%": { opacity: 1 },
                  "100%": { opacity: 0.5 },
                },
              }}
            />
            <Typography
              sx={{
                fontSize: "10px",
                color: "white",
              }}
            >
              Connected
            </Typography>
          </Box>
        </Box>

        {/* Current Reading with AI Processing */}
        <Box
          sx={{
            display: "flex",
            alignItems: "baseline",
            marginBottom: "10px",
            position: "relative",
          }}
        >
          <Typography
            sx={{
              fontSize: "32px",
              color: "white",
              fontWeight: "bold",
              animation: "fadeInOut 3s infinite",
              "@keyframes fadeInOut": {
                "0%, 100%": { opacity: 0.7 },
                "50%": { opacity: 1 },
              },
            }}
          >
            124
          </Typography>
          <Typography
            sx={{
              fontSize: "14px",
              color: "white",
              marginLeft: "5px",
            }}
          >
            mg/dL
          </Typography>

          {/* AI Processing Indicator */}
          <Box
            sx={{
              position: "absolute",
              right: 0,
              top: "50%",
              transform: "translateY(-50%)",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <Box
              sx={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: "#2196f3",
                animation: "aiPulse 1.5s infinite",
                "@keyframes aiPulse": {
                  "0%": { transform: "scale(0.8)", opacity: 0.5 },
                  "50%": { transform: "scale(1.2)", opacity: 1 },
                  "100%": { transform: "scale(0.8)", opacity: 0.5 },
                },
              }}
            />
            <Typography
              sx={{
                fontSize: "10px",
                color: "#2196f3",
                fontWeight: "bold",
              }}
            >
              AI Processing
            </Typography>
          </Box>
        </Box>

        {/* Graph Container */}
        <Box
          sx={{
            flex: 1,
            background: "rgba(255, 255, 255, 0.1)",
            borderRadius: "10px",
            padding: "10px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Graph Background Grid */}
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              padding: "10px",
            }}
          >
            {[...Array(5)].map((_, i) => (
              <Box
                key={i}
                sx={{
                  width: "100%",
                  height: "1px",
                  background: "rgba(255, 255, 255, 0.1)",
                }}
              />
            ))}
          </Box>

          {/* Y-axis Labels */}
          <Box
            sx={{
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              padding: "10px 0",
            }}
          >
            {[400, 300, 200, 100, 0].map((value) => (
              <Typography
                key={value}
                sx={{
                  fontSize: "8px",
                  color: "rgba(255, 255, 255, 0.5)",
                  transform: "translateX(-20px)",
                }}
              >
                {value}
              </Typography>
            ))}
          </Box>

          {/* Animated Glucose Line */}
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
            }}
          >
            {/* Target Range Area */}
            <path
              d="M0,40 L100,40 L100,60 L0,60 Z"
              fill="rgba(76, 175, 80, 0.1)"
              stroke="rgba(76, 175, 80, 0.3)"
              strokeWidth="0.5"
            />

            {/* Glucose Line */}
            <path
              d="M0,50 C10,45 20,55 30,40 C40,35 50,45 60,30 C70,35 80,25 90,40 C95,45 100,40 100,40"
              fill="none"
              stroke="#2196f3"
              strokeWidth="1.5"
              strokeDasharray="200"
              strokeDashoffset="200"
              style={{
                animation: "drawLine 3s linear forwards",
              }}
            />

            {/* Data Points */}
            {[0, 20, 40, 60, 80, 100].map((x, i) => {
              const yPoints = [50, 45, 40, 30, 35, 40];
              return (
                <circle
                  key={i}
                  cx={`${x}%`}
                  cy={`${yPoints[i]}%`}
                  r="1.5"
                  fill="#2196f3"
                  opacity="0"
                  style={{
                    animation: `fadeIn 0.3s ease forwards ${1 + i * 0.3}s`,
                  }}
                />
              );
            })}

            {/* Moving Point */}
            <circle
              cx="0%"
              cy="50%"
              r="2"
              fill="#2196f3"
              style={{
                filter: "drop-shadow(0 0 3px #2196f3)",
                animation: "moveDot 3s linear forwards",
              }}
            />

            <style>
              {`
                @keyframes drawLine {
                  to {
                    stroke-dashoffset: 0;
                  }
                }
                @keyframes fadeIn {
                  to {
                    opacity: 1;
                  }
                }
                @keyframes moveDot {
                  0% { cx: 0%; cy: 50%; }
                  20% { cx: 20%; cy: 45%; }
                  40% { cx: 40%; cy: 40%; }
                  60% { cx: 60%; cy: 30%; }
                  80% { cx: 80%; cy: 35%; }
                  100% { cx: 100%; cy: 40%; }
                }
              `}
            </style>
          </svg>
        </Box>

        {/* AI Insights Panel with Code-like Elements */}
        <Box
          sx={{
            marginTop: "10px",
            background: "rgba(255, 255, 255, 0.1)",
            borderRadius: "8px",
            padding: "8px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Typography
            component="div"
            sx={{
              fontSize: "10px",
              color: "white",
              fontWeight: "bold",
              marginBottom: "4px",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <Box
              sx={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: "#2196f3",
                animation: "aiPulse 1.5s infinite",
              }}
            />
            Grok AI Analysis
          </Typography>

          {/* Code-like Elements */}
          <Box
            sx={{
              position: "absolute",
              top: 0,
              right: 0,
              opacity: 0.1,
              fontSize: "8px",
              fontFamily: "monospace",
              color: "white",
              padding: "4px",
              animation: "scrollCode 10s linear infinite",
              "@keyframes scrollCode": {
                "0%": { transform: "translateY(0)" },
                "100%": { transform: "translateY(-100%)" },
              },
            }}
          >
            {[
              "def analyze_glucose(data):",
              "    trend = detect_trend(data)",
              "    if trend == 'stable':",
              "        return 'Glucose stable'",
              "    elif trend == 'rising':",
              "        return 'Consider insulin'",
              "    return 'Monitor closely'",
              "",
              "def predict_next_reading():",
              "    model = load_grok_model()",
              "    prediction = model.predict()",
              "    return prediction",
            ].map((line, i) => (
              <Box key={i} sx={{ whiteSpace: "pre" }}>
                {line}
              </Box>
            ))}
          </Box>

          <Box
            sx={{
              animation: "fadeInOut 3s infinite",
              position: "relative",
              zIndex: 1,
            }}
          >
            <Typography
              sx={{
                fontSize: "8px",
                color: "rgba(255, 255, 255, 0.8)",
                fontFamily: "monospace",
              }}
            >
              {">"} Glucose trending stable
            </Typography>
            <Typography
              sx={{
                fontSize: "8px",
                color: "rgba(255, 255, 255, 0.8)",
                fontFamily: "monospace",
              }}
            >
              {">"} Consider light exercise
            </Typography>
            <Typography
              sx={{
                fontSize: "8px",
                color: "rgba(255, 255, 255, 0.8)",
                fontFamily: "monospace",
                animation: "typewriter 2s steps(40) infinite",
                "@keyframes typewriter": {
                  "0%": { opacity: 0 },
                  "50%": { opacity: 1 },
                  "100%": { opacity: 0 },
                },
              }}
            >
              {">"} Next reading predicted: 118 mg/dL
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Floating Grok Icon */}
      <Box
        sx={{
          position: "absolute",
          top: "10%",
          right: "10%",
          animation: "float 3s infinite ease-in-out",
          "@keyframes float": {
            "0%, 100%": { transform: "translateY(0)" },
            "50%": { transform: "translateY(-10px)" },
          },
        }}
      >
        <Box
          sx={{
            width: "40px",
            height: "40px",
            background: "#111",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.5)",
          }}
        >
          <Box
            component="img"
            src="https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/dark/grok.png"
            alt="Grok AI Logo"
            sx={{
              width: "70%",
              height: "70%",
              objectFit: "contain",
            }}
          />
        </Box>
      </Box>
    </Box>
  );

  // Workly Animation - Job Tinder App
  const worklyAnimation = (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #e0e7ff 0%, #f3e8ff 100%)",
        overflow: "hidden",
        position: "relative",
        minHeight: "250px",
      }}
    >
      {/* Mobile Phone Frame */}
      <Box
        sx={{
          position: "relative",
          width: { xs: "135px", md: "170px" },
          height: { xs: "270px", md: "340px" },
          bgcolor: "#1a1a1a",
          borderRadius: "28px",
          padding: "8px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
          border: "2px solid #2a2a2a",
        }}
      >
        {/* Screen - Gradient background with color */}
        <Box
          sx={{
            width: "100%",
            height: "100%",
            borderRadius: "22px",
            borderTopLeftRadius: "22px",
            borderTopRightRadius: "22px",
            borderBottomLeftRadius: "22px",
            borderBottomRightRadius: "22px",
            overflow: "hidden",
            position: "relative",
            display: "flex",
            flexDirection: "column",
            background: "linear-gradient(135deg, #8b5cf6 0%, #6366f1 50%, #a855f7 100%)",
          }}
        >
          {/* Status Bar - Different color to avoid double purple */}
          <Box
            sx={{
              height: "20px",
              bgcolor: "rgba(255,255,255,0.1)",
              backdropFilter: "blur(10px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              px: 1.5,
              pt: 0.5,
              borderTopLeftRadius: "22px",
              borderTopRightRadius: "22px",
            }}
          >
            <Typography sx={{ fontSize: "9px", color: "#ffffff", fontWeight: 600, letterSpacing: "0.02em" }}>
              9:41
            </Typography>
            <Box sx={{ display: "flex", gap: 0.5, alignItems: "center" }}>
              <Box
                sx={{
                  width: "16px",
                  height: "9px",
                  border: "1.5px solid #ffffff",
                  borderRadius: "3px",
                  position: "relative",
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    left: "1.5px",
                    top: "1.5px",
                    width: "65%",
                    height: "calc(100% - 3px)",
                    bgcolor: "#ffffff",
                    borderRadius: "2px",
                  }}
                />
              </Box>
            </Box>
          </Box>

          {/* App Content */}
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "flex-start",
              pt: 1.5,
              pb: 2,
              px: 2,
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Swipeable Job Card */}
            <motion.div
              animate={{
                x: [0, 12, -12, 0],
                rotate: [0, 3, -3, 0],
              }}
              transition={{
                duration: 3.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{
                position: "absolute",
                width: "88%",
                height: "70%",
                top: "8%",
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  height: "100%",
                  bgcolor: "#ffffff",
                  borderRadius: "16px",
                  boxShadow: "0 12px 32px rgba(0,0,0,0.15)",
                  p: 1.5,
                  display: "flex",
                  flexDirection: "column",
                  overflow: "hidden",
                }}
              >
                {/* Brown Briefcase Icon - Centered at top */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    mb: 0.75,
                    flexShrink: 0,
                  }}
                >
                  <Box
                    sx={{
                      fontSize: "24px",
                      filter: "hue-rotate(25deg) saturate(1.2)",
                    }}
                  >
                    💼
                  </Box>
                </Box>

                {/* Job Title */}
                <Typography
                  sx={{
                    fontSize: "13px",
                    fontWeight: 700,
                    color: "#1d1d1f",
                    mb: 0.25,
                    textAlign: "center",
                    letterSpacing: "-0.01em",
                    flexShrink: 0,
                    lineHeight: 1.2,
                  }}
                >
                  Software Engineer
                </Typography>

                {/* Company Name */}
                <Typography
                  sx={{
                    fontSize: "10px",
                    color: "#86868b",
                    mb: 1,
                    textAlign: "center",
                    fontWeight: 400,
                    flexShrink: 0,
                    lineHeight: 1.2,
                  }}
                >
                  Tech Company Inc.
                </Typography>

                {/* Job Details with colored icons */}
                <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 0.5, mb: 1, minHeight: 0, justifyContent: "center" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, justifyContent: "center" }}>
                    <Typography sx={{ fontSize: "10px", filter: "hue-rotate(320deg) saturate(1.3)" }}>📍</Typography>
                    <Typography sx={{ fontSize: "9px", color: "#4a5568", fontWeight: 500, lineHeight: 1.2 }}>
                      Remote
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, justifyContent: "center" }}>
                    <Typography sx={{ fontSize: "10px", filter: "hue-rotate(25deg) saturate(1.2)" }}>💰</Typography>
                    <Typography sx={{ fontSize: "9px", color: "#4a5568", fontWeight: 500, lineHeight: 1.2 }}>
                      $80k-$120k
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, justifyContent: "center" }}>
                    <Typography sx={{ fontSize: "10px", filter: "hue-rotate(0deg) saturate(1.4)" }}>⏰</Typography>
                    <Typography sx={{ fontSize: "9px", color: "#4a5568", fontWeight: 500, lineHeight: 1.2 }}>
                      Full-time
                    </Typography>
                  </Box>
                </Box>

                {/* Skills Tags - Different colors for each */}
                <Box sx={{ display: "flex", gap: 0.4, flexWrap: "wrap", justifyContent: "center", mt: "auto", flexShrink: 0, pt: 0.5 }}>
                  {[
                    { name: "React", color: "#000000", bg: "#61dafb" },
                    { name: "Node.js", color: "#ffffff", bg: "#339933" },
                    { name: "TypeScript", color: "#ffffff", bg: "#3178c6" },
                  ].map((tag, i) => (
                    <Box
                      key={i}
                      sx={{
                        bgcolor: tag.bg,
                        color: tag.color,
                        px: 0.75,
                        py: 0.3,
                        borderRadius: "6px",
                        fontSize: "8px",
                        fontWeight: 600,
                        letterSpacing: "0.01em",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                        lineHeight: 1.2,
                      }}
                    >
                      {tag.name}
                    </Box>
                  ))}
                </Box>
              </Box>
            </motion.div>

            {/* Action Buttons - Both Dislike and Like */}
            <Box
              sx={{
                position: "absolute",
                bottom: "16px",
                display: "flex",
                gap: 3,
                alignItems: "center",
                justifyContent: "center",
                zIndex: 10,
                width: "100%",
              }}
            >
              {/* Dislike Button - Red X */}
              <Box
                sx={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "50%",
                  bgcolor: "#ef4444",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 6px 16px rgba(239,68,68,0.4)",
                  transition: "transform 0.2s ease",
                  "&:hover": {
                    transform: "scale(1.05)",
                  },
                }}
              >
                <Typography sx={{ fontSize: "22px", color: "#fff", fontWeight: 700, lineHeight: 1 }}>✕</Typography>
              </Box>

              {/* Like Button - Green Heart */}
              <Box
                sx={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "50%",
                  bgcolor: "#22c55e",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 6px 16px rgba(34,197,94,0.4)",
                  transition: "transform 0.2s ease",
                  "&:hover": {
                    transform: "scale(1.05)",
                  },
                }}
              >
                <Typography sx={{ fontSize: "22px", color: "#fff", fontWeight: 700, lineHeight: 1 }}>♥</Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );

  // Projects array with animations
  const projects = [
    {
      id: 1,
      image: "/images/portfolio.png",
      role: "PERSONAL PROJECT",
      title: "Personal Portfolio Website",
      tags: ["React", "Material UI", "Framer Motion"],
      description:
        "A minimalist portfolio website designed with Apple's design philosophy in mind. Crafted with React and Material-UI, it features fluid animations, fully responsive layouts, and an emphasis on clean typography and whitespace. Every interaction is thoughtfully designed to create a seamless, professional experience across all devices.",
      status: "LIVE",
      github: "https://github.com/taylfrad/taylorfradella.com",
      animation: portfolioAnimation,
    },
    {
      id: 2,
      image: "/images/lionsden.png",
      role: "TEAM PROJECT",
      title: "Lions Den Cinemas Website and Mobile App",
      tags: ["React Native", "Node.js", "SQL"],
      description:
        "My team and I brought Lions Den Cinemas to life online by creating both a website and a mobile app where anyone can browse showtimes, buy tickets and snacks—either as a guest or by signing up. We also built an easy-to-use admin panel so cinema staff can quickly update movie listings, manage ticket availability, and tweak concession options on the fly. This project highlights our ability to design and deliver a seamless, end-to-end experience for both customers and administrators.",
      status: "COMPLETED",
      github:
        "https://github.com/Southeastern-Louisiana-University/cmps383-2025-sp-p03-g06",
      animation: lionsTheaterAnimation,
    },
    {
      id: 3,
      image: "/images/bloodsugar.png",
      role: "HARDWARE + AI",
      title: "Blood Sugar Monitor with AI",
      tags: ["Python", "Raspberry Pi", "Dexcom API", "AI"],
      description:
        "A Raspberry Pi-powered system that tracks glucose levels, visualizes data, and provides AI-driven suggestions using the Dexcom API alongside Grok AI.",
      status: "GITHUB ONLY",
      github: "https://www.youtube.com/watch?v=64Pnq-MybS8&list=PLk22IJ-X9itqH1UIuWYtNs3cfTwHqOIvM&index=14",
      animation: bloodSugarMonitorAnimation,
    },
    {
      id: 4,
      image: "/images/workly.png",
      role: "TEAM PROJECT",
      title: "Workly - Job Tinder App",
      tags: ["Flutter", "Dart", "Firebase", "Mobile"],
      description:
        "A mobile application that revolutionizes job searching with a Tinder-like swipe interface. Built with Flutter, Workly allows job seekers to quickly browse opportunities by swiping right on interesting positions or left to pass. The app features real-time job matching, user profiles, and seamless navigation across iOS, Android, and web platforms.",
      status: "GITHUB ONLY",
      github: "https://github.com/maheessh/workly",
      animation: worklyAnimation,
    },
  ];

  const sectionRef = useRef();
  const stickyRef = useRef();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end end"],
  });

  // Animation for the "View More Projects on GitHub" button
  const buttonOpacity = useTransform(scrollYProgress, [0.7, 0.9], [1, 0]); // Fade out from 70% to 90% scrolled
  const buttonY = useTransform(scrollYProgress, [0.7, 0.9], [0, 50]); // Slide down from 70% to 90% scrolled

  // Animation variants for image and text
  const imageVariants = (isImageLeft) => ({
    hidden: { opacity: 0, x: isImageLeft ? -80 : 80 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: [0.23, 1, 0.32, 1],
      },
    },
  });

  const textVariants = (isImageLeft) => ({
    hidden: { opacity: 0, x: isImageLeft ? 80 : -80 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: [0.23, 1, 0.32, 1],
        delay: 0.18,
      },
    },
  });

  return (
    <Box
      id="projects"
      ref={sectionRef}
      sx={{
        minHeight: "auto",
        position: "relative",
        bgcolor: "#ffffff",
        width: "100%",
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
            p: { xs: 3.5, md: 5 },
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
              fontSize: { xs: "2rem", md: "2.75rem" },
              mb: { xs: 3.5, md: 4.5 },
              color: "#1d1d1f",
              textAlign: "left",
              letterSpacing: "-0.02em",
              lineHeight: 1.05,
            }}
          >
            Recent Projects
          </Typography>
          <motion.div
            ref={containerRef}
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.18,
                },
              },
              hidden: {},
            }}
            initial="hidden"
            animate="visible"
            style={{ width: "100%" }}
          >
            <Box sx={{ width: "100%", mx: "auto" }}>
          {projects.map((project, idx) => {
            const isImageLeft = idx % 2 === 0;
            const [ref, inView] = useInView({
              threshold: 0.35,
              triggerOnce: false,
            });

            return (
              <Box
                key={project.id}
                ref={ref}
                component={motion.div}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
                sx={{
                  display: "flex",
                  flexDirection: {
                    xs: "column",
                    md: "row",
                  },
                  alignItems: "center",
                  justifyContent: "flex-start",
                  gap: { xs: 3, md: 5 },
                  mb: { xs: 5, md: 6 },
                  width: "100%",
                }}
              >
                {/* Animated Project Image */}
                <Box
                  component={motion.div}
                  variants={imageVariants(isImageLeft)}
                  sx={{
                    maxWidth: "100%",
                    width: { md: 460 },
                    height: { xs: "auto", md: 360 },
                    flexShrink: 0,
                    mb: { xs: 2, md: 0 },
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  borderRadius: 8,
                  overflow: "hidden",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                  background: "none",
                }}
              >
                {project.animation}
              </Box>
              {/* Animated Project Details */}
              <Box
                component={motion.div}
                variants={textVariants(isImageLeft)}
                sx={{
                  flex: 1,
                  minWidth: 0,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  justifyContent: "center",
                  textAlign: "left",
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 600,
                    mb: 1,
                    color: "#222",
                    fontSize: { xs: "1.25rem", md: "1.5rem" },
                  }}
                >
                  {project.title}
                </Typography>
                <Typography
                  component="div"
                  sx={{
                    color: "#666",
                    mb: 2,
                    fontSize: { xs: "0.875rem", md: "0.9375rem" },
                    lineHeight: 1.6,
                  }}
                >
                  {project.description}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    width: "100%",
                  }}
                >
                  <Button
                    component="a"
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="contained"
                    sx={{
                      bgcolor: "#e0e0e0",
                      color: "#222",
                      textTransform: "none",
                      fontSize: { xs: "0.9rem", md: "1rem" },
                      fontWeight: 500,
                      px: { xs: 2.5, md: 3.5 },
                      py: { xs: 1.25, md: 1.75 },
                      borderRadius: "8px",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                      border: "1px solid #d0d0d0",
                      "&:hover": {
                        bgcolor: "#d0d0d0",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
                      },
                    }}
                  >
                    View Project
                  </Button>
                </Box>
              </Box>
              </Box>
            );
          })}
            </Box>
          </motion.div>

          {/* GitHub projects link button */}
          <Box
            component={motion.div}
            style={{ opacity: buttonOpacity, y: buttonY }}
            sx={{ textAlign: "center", mt: 6, mb: { xs: 2, md: 2 } }}
          >
        <Button
          component={Link}
          href="https://github.com/taylfrad"
          target="_blank"
          rel="noopener noreferrer"
          variant="outlined"
          color="primary"
          size="large"
          startIcon={<GitHubIcon />}
          sx={{
            borderRadius: "10px",
            px: 4,
            py: 1.5,
            borderWidth: "2px",
            textTransform: "none",
            fontSize: "1rem",
            boxShadow: "0 0 10px rgba(56, 189, 248, 0.1)",
            "&:hover": {
              borderWidth: "2px",
              boxShadow: "0 0 20px rgba(56, 189, 248, 0.2)",
              transform: "translateY(-3px)",
            },
          }}
        >
          View More Projects on GitHub
        </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
