import { Box, Typography, Button, Container, Link, Paper } from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import useIntersectionObserver from "../hooks/useIntersectionObserver";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useInView } from "react-intersection-observer";

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
  const [containerRef] = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: "-100px",
  });

  const scrollToSection = (sectionId) => {
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
        inline: "nearest"
      });
    }
  };

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
        minHeight: { xs: "200px", sm: "230px", md: "250px" },
      }}
    >
      {/* Hero Section Content - Direct, no browser frame */}
      <Box
        sx={{
          position: "relative",
          width: { xs: "95%", sm: "90%", md: "85%" },
          height: "100%",
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: "center",
          justifyContent: "space-between",
          overflow: "hidden",
          background: "#ffffff",
          p: { xs: 1, sm: 1.5, md: 2 },
          maxWidth: "100%",
        }}
      >
        {/* Navigation - Absolute positioned at top */}
        <Box
          sx={{
            position: "absolute",
            top: { xs: "8px", sm: "10px", md: "12px" },
            left: { xs: "2px", sm: "2px", md: "4px" },
            display: "flex",
            gap: { xs: 1, sm: 1.25, md: 1.5 },
            zIndex: 10,
          }}
        >
          <Typography
            component="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              scrollToSection("skills");
            }}
            sx={{
              color: "#1d1d1f",
              fontSize: { xs: "8px", sm: "9px" },
              fontWeight: 400,
              letterSpacing: "-0.01em",
              border: "none",
              background: "transparent",
              cursor: "pointer",
              fontFamily: "inherit",
              padding: { xs: "2px 4px", sm: 0 },
              minHeight: { xs: "24px", sm: "auto" },
              transition: "opacity 0.2s",
              "&:hover": {
                opacity: 0.6,
              },
            }}
          >
            About
          </Typography>
          <Typography
            component="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              scrollToSection("projects");
            }}
            sx={{
              color: "#1d1d1f",
              fontSize: { xs: "8px", sm: "9px" },
              fontWeight: 400,
              letterSpacing: "-0.01em",
              border: "none",
              background: "transparent",
              cursor: "pointer",
              fontFamily: "inherit",
              padding: { xs: "2px 4px", sm: 0 },
              minHeight: { xs: "24px", sm: "auto" },
              transition: "opacity 0.2s",
              "&:hover": {
                opacity: 0.6,
              },
            }}
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
            sx={{
              color: "#1d1d1f",
              fontSize: { xs: "8px", sm: "9px" },
              fontWeight: 400,
              letterSpacing: "-0.01em",
              border: "none",
              background: "transparent",
              cursor: "pointer",
              fontFamily: "inherit",
              padding: { xs: "2px 4px", sm: 0 },
              minHeight: { xs: "24px", sm: "auto" },
              transition: "opacity 0.2s",
              "&:hover": {
                opacity: 0.6,
              },
            }}
          >
            Contact
          </Typography>
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
              fontSize: { xs: "12px", sm: "14px", md: "16px", lg: "18px" },
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              mb: { xs: 0.75, sm: 1 },
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
              fontSize: { xs: "8px", sm: "9px", md: "10px" },
              mb: { xs: 1.5, sm: 2 },
              lineHeight: 1.4,
              letterSpacing: "-0.01em",
            }}
          >
            Designing and engineering thoughtful digital experiences.
          </Typography>

          {/* Button */}
          <Box
            component="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              scrollToSection("contact");
            }}
            sx={{
              bgcolor: "#e0e0e0",
              color: "#222",
              px: { xs: 1, sm: 1.25, md: 1.5 },
              py: { xs: 0.375, sm: 0.5 },
              borderRadius: "8px",
              fontSize: { xs: "8px", sm: "9px" },
              fontWeight: 500,
              border: "none",
              cursor: "pointer",
              fontFamily: "inherit",
              minHeight: { xs: "28px", sm: "32px" },
              transition: "background-color 0.2s",
              "&:hover": {
                bgcolor: "#d0d0d0",
              },
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
              maxWidth: { xs: "150px", sm: "175px", md: "200px" },
              height: "auto",
              objectFit: "contain",
            }}
          />
        </Box>
      </Box>
    </Box>
  );

  const lionsTheaterAnimation = (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        minHeight: { xs: 200, sm: 230, md: 250 },
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
          width: { xs: "90%", sm: "75%", md: "420px" },
          maxWidth: { xs: "100%", sm: "500px", md: "600px" },
          minWidth: { xs: "260px", sm: "300px", md: "320px" },
          height: { xs: "auto", sm: "280px", md: "340px" },
          maxHeight: { xs: "380px", sm: "380px", md: "420px" },
          minHeight: { xs: "180px", sm: "220px", md: "240px" },
          aspectRatio: { xs: "16/10", sm: "auto" },
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
            height: { xs: "24px", sm: "26px", md: "28px" },
            background: "#1a0000",
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
              sx={{
                fontSize: { xs: "7px", sm: "7.5px", md: "8px" },
                color: "rgba(255,255,255,0.6)",
              }}
            >
              lionsdencinemas.com
            </Typography>
          </Box>
        </Box>

        {/* Website Content with animated scroll */}
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
              padding: {
                xs: "3px 0 6px 0",
                sm: "3.5px 0 7px 0",
                md: "4px 0 8px 0",
              },
              borderBottom: "1px solid rgba(255,0,0,0.15)",
            }}
          >
            {["Home", "Movies", "Showtimes", "About"].map((item, i) => (
              <Typography
                key={i}
                sx={{
                  fontSize: { xs: "7.5px", sm: "8.5px", md: "9px" },
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
              height: { xs: "32%", sm: "35%", md: "38%" },
              background: "linear-gradient(45deg, #1a0000, #330000)",
              borderRadius: { xs: "3px", sm: "4px", md: "5px" },
              padding: { xs: "4px 6px", sm: "6px 8px", md: "8px 10px" },
              display: "flex",
              gap: { xs: "6px", sm: "8px", md: "10px" },
              alignItems: "center",
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
                boxShadow: "0 2px 8px rgba(0,0,0,0.18)",
                background: "rgba(255,0,0,0.1)",
                mr: { xs: 1.5, sm: 1.75, md: 2 },
                flexShrink: 0,
              }}
            />
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                sx={{
                  fontSize: { xs: "8px", sm: "9.5px", md: "11px" },
                  color: "#fff",
                  fontWeight: "bold",
                  marginBottom: "2px",
                  lineHeight: 1.2,
                }}
                noWrap
              >
                Dumbo (1941)
              </Typography>
              <Typography
                sx={{
                  fontSize: { xs: "6.5px", sm: "7px", md: "8px" },
                  color: "rgba(255,255,255,0.7)",
                  lineHeight: 1.2,
                }}
                noWrap
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
                gap: { xs: "4px", sm: "5.5px", md: "7px" },
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
                        fontSize: { xs: "7px", sm: "7.5px", md: "8px" },
                        color: "#fff",
                        fontWeight: "bold",
                      }}
                    >
                      {movie.title}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: { xs: "6px", sm: "6.5px", md: "7px" },
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
                        fontSize: { xs: "7px", sm: "7.5px", md: "8px" },
                        color: "#fff",
                        fontWeight: "bold",
                      }}
                    >
                      {movie.title}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: { xs: "6px", sm: "6.5px", md: "7px" },
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
          width: { xs: "140px", sm: "150px", md: "160px" },
          maxWidth: { xs: "180px", sm: "200px", md: "220px" },
          minWidth: { xs: "100px", sm: "110px" },
          height: { xs: "280px", sm: "300px", md: "340px" },
          maxHeight: { xs: "400px", sm: "380px", md: "420px" },
          minHeight: { xs: "200px", sm: "240px", md: "240px" },
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
              fontSize: { xs: "9px", sm: "10px", md: "11px" },
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
                    width: { xs: 22, sm: 24, md: 26 },
                    height: { xs: 30, sm: 33, md: 36 },
                    objectFit: "cover",
                    borderRadius: "2.5px",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.13)",
                    background: "rgba(255,0,0,0.1)",
                  }}
                />
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    sx={{
                      fontSize: { xs: "7px", sm: "7.75px", md: "8.5px" },
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
                      fontSize: { xs: "5.5px", sm: "6px", md: "6.5px" },
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
            bottom: { xs: "6px", sm: "7px", md: "8px" },
            left: "50%",
            transform: "translateX(-50%)",
            width: { xs: "18%", sm: "17%", md: "16%" },
            height: { xs: "1.5px", sm: "1.75px", md: "2px" },
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
              width: { xs: "24px", sm: "27px", md: "30px" },
              height: { xs: "24px", sm: "27px", md: "30px" },
              background: "rgba(0,0,0,0.8)",
              borderRadius: { xs: "5px", sm: "5.5px", md: "6px" },
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
                fontSize: "clamp(16px, 4vw, 20px)",
                color: tech.color,
              }}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );

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
        minHeight: { xs: "200px", sm: "230px", md: "250px" },
      }}
    >
      {/* Main Device Display */}
      <Box
        sx={{
          position: "relative",
          width: { xs: "85%", sm: "70%", md: "60%" },
          height: { xs: "auto", sm: "70%", md: "75%" },
          maxHeight: { xs: "300px", sm: "350px", md: "450px" },
          minHeight: { xs: "200px", sm: "250px", md: "350px" },
          background: "#1e293b",
          borderRadius: { xs: "12px", sm: "13px", md: "15px" },
          display: "flex",
          flexDirection: "column",
          padding: { xs: "10px", sm: "12px", md: "15px" },
          boxShadow: "0 8px 32px rgba(0,0,0,0.4), 0 2px 8px rgba(0,0,0,0.2)",
          border: "1px solid rgba(255, 255, 255, 0.05)",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: { xs: "6px", sm: "8px", md: "10px" },
          }}
        >
          <Typography
            sx={{
              fontSize: { xs: "11px", sm: "12px", md: "14px" },
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
                width: { xs: "6px", sm: "7px", md: "8px" },
                height: { xs: "6px", sm: "7px", md: "8px" },
                borderRadius: "50%",
                background: "#4caf50",
                animation: "pulse 2s infinite",
                "@keyframes pulse": {
                  "0%": { opacity: 0.5, transform: "scale(0.9)" },
                  "50%": { opacity: 1, transform: "scale(1.1)" },
                  "100%": { opacity: 0.5, transform: "scale(0.9)" },
                },
                boxShadow: "0 0 4px rgba(76, 175, 80, 0.6)",
              }}
            />
            <Typography
              sx={{
                fontSize: { xs: "8px", sm: "9px", md: "10px" },
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
              fontSize: { xs: "24px", sm: "28px", md: "32px" },
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
              fontSize: { xs: "11px", sm: "12px", md: "14px" },
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
              gap: { xs: "3px", sm: "4px", md: "5px" },
            }}
          >
            <Box
              sx={{
                width: { xs: "5px", sm: "6px", md: "7px" },
                height: { xs: "5px", sm: "6px", md: "7px" },
                borderRadius: "50%",
                background: "#2196f3",
                animation: "aiPulse 1.5s infinite",
                "@keyframes aiPulse": {
                  "0%": { transform: "scale(0.8)", opacity: 0.5 },
                  "50%": { transform: "scale(1.2)", opacity: 1 },
                  "100%": { transform: "scale(0.8)", opacity: 0.5 },
                },
                boxShadow: "0 0 4px rgba(33, 150, 243, 0.6)",
              }}
            />
            <Typography
              sx={{
                fontSize: { xs: "7px", sm: "8px", md: "9px" },
                color: "#2196f3",
                fontWeight: "600",
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
            background: "rgba(255, 255, 255, 0.08)",
            borderRadius: { xs: "8px", sm: "9px", md: "10px" },
            padding: { xs: "6px", sm: "8px", md: "10px" },
            position: "relative",
            overflow: "hidden",
            border: "1px solid rgba(255, 255, 255, 0.1)",
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
              padding: { xs: "6px", sm: "8px", md: "10px" },
            }}
          >
            {[...Array(5)].map((_, i) => (
              <Box
                key={i}
                sx={{
                  width: "100%",
                  height: { xs: "0.5px", sm: "0.75px", md: "1px" },
                  background: "rgba(255, 255, 255, 0.08)",
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
              padding: { xs: "6px 0", sm: "8px 0", md: "10px 0" },
            }}
          >
            {[400, 300, 200, 100, 0].map((value) => (
              <Typography
                key={value}
                sx={{
                  fontSize: { xs: "7px", sm: "8px", md: "9px" },
                  color: "rgba(255, 255, 255, 0.6)",
                  transform: {
                    xs: "translateX(-15px)",
                    sm: "translateX(-18px)",
                    md: "translateX(-20px)",
                  },
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
              strokeWidth="2"
              strokeDasharray="200"
              strokeDashoffset="200"
              style={{
                animation: "drawLine 3s linear forwards",
                filter: "drop-shadow(0 0 2px #2196f3)",
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
                  r="2"
                  fill="#2196f3"
                  opacity="0"
                  style={{
                    animation: `fadeIn 0.3s ease forwards ${1 + i * 0.3}s`,
                    filter: "drop-shadow(0 0 2px #2196f3)",
                  }}
                />
              );
            })}

            {/* Moving Point */}
            <circle
              cx="0%"
              cy="50%"
              r="2.5"
              fill="#2196f3"
              style={{
                filter: "drop-shadow(0 0 4px #2196f3)",
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

        {/* AI Insights Panel */}
        <Box
          sx={{
            marginTop: { xs: "8px", sm: "10px", md: "12px" },
            background: "rgba(255, 255, 255, 0.08)",
            borderRadius: { xs: "6px", sm: "7px", md: "8px" },
            padding: { xs: "6px", sm: "8px", md: "10px" },
            position: "relative",
            overflow: "hidden",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <Typography
            component="div"
            sx={{
              fontSize: { xs: "7px", sm: "8px", md: "10px" },
              color: "white",
              fontWeight: "bold",
              marginBottom: { xs: "6px", sm: "8px", md: "10px" },
              display: "flex",
              alignItems: "center",
              gap: { xs: "3px", sm: "4px", md: "5px" },
            }}
          >
            <Box
              sx={{
                width: { xs: "5px", sm: "6px", md: "8px" },
                height: { xs: "5px", sm: "6px", md: "8px" },
                borderRadius: "50%",
                background: "#2196f3",
                animation: "aiPulse 1.5s infinite",
                "@keyframes aiPulse": {
                  "0%": { transform: "scale(0.8)", opacity: 0.5 },
                  "50%": { transform: "scale(1.2)", opacity: 1 },
                  "100%": { transform: "scale(0.8)", opacity: 0.5 },
                },
                boxShadow: "0 0 6px rgba(33, 150, 243, 0.6)",
              }}
            />
            Grok AI Analysis
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: { xs: "4px", sm: "5px", md: "6px" },
            }}
          >
            <Typography
              sx={{
                fontSize: { xs: "7px", sm: "8px", md: "9px" },
                color: "rgba(255, 255, 255, 0.9)",
                fontFamily: "monospace",
                lineHeight: 1.4,
              }}
            >
              {">"} Glucose trending stable
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: "7px", sm: "8px", md: "9px" },
                color: "rgba(255, 255, 255, 0.9)",
                fontFamily: "monospace",
                lineHeight: 1.4,
              }}
            >
              {">"} Consider light exercise
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: "7px", sm: "8px", md: "9px" },
                color: "rgba(255, 255, 255, 0.9)",
                fontFamily: "monospace",
                lineHeight: 1.4,
                animation: "fadeInOut 3s infinite",
                "@keyframes fadeInOut": {
                  "0%, 100%": { opacity: 0.7 },
                  "50%": { opacity: 1 },
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
          top: { xs: "8%", sm: "12%", md: "15%" },
          right: { xs: "8%", sm: "15%", md: "20%" },
          animation: "float 3s infinite ease-in-out",
          "@keyframes float": {
            "0%, 100%": { transform: "translateY(0)" },
            "50%": { transform: "translateY(-8px)" },
          },
          zIndex: 1,
        }}
      >
        <Box
          sx={{
            width: { xs: "28px", sm: "32px", md: "40px" },
            height: { xs: "28px", sm: "32px", md: "40px" },
            background: "rgba(17, 17, 17, 0.9)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.4)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
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
              maxWidth: "100%",
            }}
          />
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
        background: "linear-gradient(135deg, #e0e7ff 0%, #f3e8ff 100%)",
        overflow: "hidden",
        position: "relative",
        minHeight: { xs: "200px", sm: "230px", md: "250px" },
      }}
    >
      {/* Mobile Phone Frame */}
      <Box
        sx={{
          position: "relative",
          width: { xs: "110px", sm: "135px", md: "170px" },
          height: { xs: "220px", sm: "270px", md: "340px" },
          bgcolor: "#1a1a1a",
          borderRadius: { xs: "24px", sm: "26px", md: "28px" },
          padding: { xs: "6px", sm: "7px", md: "8px" },
          boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
          border: { xs: "1.5px solid #2a2a2a", sm: "2px solid #2a2a2a" },
        }}
      >
        {/* Screen - Gradient background with color */}
        <Box
          sx={{
            width: "100%",
            height: "100%",
            borderRadius: { xs: "18px", sm: "20px", md: "22px" },
            borderTopLeftRadius: { xs: "18px", sm: "20px", md: "22px" },
            borderTopRightRadius: { xs: "18px", sm: "20px", md: "22px" },
            borderBottomLeftRadius: { xs: "18px", sm: "20px", md: "22px" },
            borderBottomRightRadius: { xs: "18px", sm: "20px", md: "22px" },
            overflow: "hidden",
            position: "relative",
            display: "flex",
            flexDirection: "column",
            background:
              "linear-gradient(135deg, #8b5cf6 0%, #6366f1 50%, #a855f7 100%)",
          }}
        >
          {/* Status Bar - Different color to avoid double purple */}
          <Box
            sx={{
              height: { xs: "18px", sm: "19px", md: "20px" },
              bgcolor: "rgba(255,255,255,0.1)",
              backdropFilter: "blur(10px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              px: { xs: 1, sm: 1.25, md: 1.5 },
              pt: { xs: 0.25, sm: 0.375, md: 0.5 },
              borderTopLeftRadius: "22px",
              borderTopRightRadius: "22px",
            }}
          >
            <Typography
              sx={{
                fontSize: { xs: "7px", sm: "8px", md: "9px" },
                color: "#ffffff",
                fontWeight: 600,
                letterSpacing: "0.02em",
              }}
            >
              9:41
            </Typography>
            <Box
              sx={{
                display: "flex",
                gap: { xs: 0.25, sm: 0.375, md: 0.5 },
                alignItems: "center",
              }}
            >
              <Box
                sx={{
                  width: { xs: "14px", sm: "15px", md: "16px" },
                  height: { xs: "8px", sm: "8.5px", md: "9px" },
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
              pt: { xs: 1, sm: 1.25, md: 1.5 },
              pb: { xs: 1.5, sm: 1.75, md: 2 },
              px: { xs: 1.5, sm: 1.75, md: 2 },
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
                  borderRadius: { xs: "12px", sm: "14px", md: "16px" },
                  boxShadow: "0 12px 32px rgba(0,0,0,0.15)",
                  p: { xs: 1, sm: 1.25, md: 1.5 },
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
                    mb: { xs: 0.5, sm: 0.625, md: 0.75 },
                    flexShrink: 0,
                  }}
                >
                  <Box
                    sx={{
                      fontSize: { xs: "18px", sm: "21px", md: "24px" },
                      filter: "hue-rotate(25deg) saturate(1.2)",
                    }}
                  >
                    💼
                  </Box>
                </Box>

                {/* Job Title */}
                <Typography
                  sx={{
                    fontSize: { xs: "10px", sm: "11.5px", md: "13px" },
                    fontWeight: 700,
                    color: "#1d1d1f",
                    mb: { xs: 0.125, sm: 0.2, md: 0.25 },
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
                    fontSize: { xs: "8px", sm: "9px", md: "10px" },
                    color: "#86868b",
                    mb: { xs: 0.75, sm: 0.875, md: 1 },
                    textAlign: "center",
                    fontWeight: 400,
                    flexShrink: 0,
                    lineHeight: 1.2,
                  }}
                >
                  Tech Company Inc.
                </Typography>

                {/* Job Details with colored icons */}
                <Box
                  sx={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    gap: { xs: 0.375, sm: 0.5 },
                    mb: { xs: 0.75, sm: 0.875, md: 1 },
                    minHeight: 0,
                    justifyContent: "center",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: { xs: 0.375, sm: 0.5 },
                      justifyContent: "center",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: { xs: "8px", sm: "9px", md: "10px" },
                        filter: "hue-rotate(320deg) saturate(1.3)",
                      }}
                    >
                      📍
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: { xs: "8px", sm: "8.5px", md: "9px" },
                        color: "#4a5568",
                        fontWeight: 500,
                        lineHeight: 1.2,
                      }}
                    >
                      Remote
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                      justifyContent: "center",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: { xs: "9px", sm: "9.5px", md: "10px" },
                        filter: "hue-rotate(25deg) saturate(1.2)",
                      }}
                    >
                      💰
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: { xs: "8px", sm: "8.5px", md: "9px" },
                        color: "#4a5568",
                        fontWeight: 500,
                        lineHeight: 1.2,
                      }}
                    >
                      $80k-$120k
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                      justifyContent: "center",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: { xs: "9px", sm: "9.5px", md: "10px" },
                        filter: "hue-rotate(0deg) saturate(1.4)",
                      }}
                    >
                      ⏰
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: { xs: "8px", sm: "8.5px", md: "9px" },
                        color: "#4a5568",
                        fontWeight: 500,
                        lineHeight: 1.2,
                      }}
                    >
                      Full-time
                    </Typography>
                  </Box>
                </Box>

                {/* Skills Tags - Different colors for each */}
                <Box
                  sx={{
                    display: "flex",
                    gap: { xs: 0.3, sm: 0.35, md: 0.4 },
                    flexWrap: "wrap",
                    justifyContent: "center",
                    mt: "auto",
                    flexShrink: 0,
                    pt: { xs: 0.3, sm: 0.4, md: 0.5 },
                  }}
                >
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
                        px: { xs: 0.4, sm: 0.5, md: 0.75 },
                        py: { xs: 0.15, sm: 0.2, md: 0.3 },
                        borderRadius: { xs: "4px", sm: "5px", md: "6px" },
                        fontSize: { xs: "5.5px", sm: "6px", md: "8px" },
                        fontWeight: 600,
                        letterSpacing: "0.01em",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                        lineHeight: 1.2,
                        minWidth: { xs: "20px", sm: "auto" },
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
                bottom: { xs: "8px", sm: "12px", md: "16px" },
                display: "flex",
                gap: { xs: 2, sm: 2.5, md: 3 },
                alignItems: "center",
                justifyContent: "center",
                zIndex: 10,
                width: "100%",
              }}
            >
              {/* Dislike Button - Red X */}
              <Box
                sx={{
                  width: { xs: "36px", sm: "40px", md: "44px" },
                  height: { xs: "36px", sm: "40px", md: "44px" },
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
                <Typography
                  sx={{
                    fontSize: { xs: "16px", sm: "18px", md: "22px" },
                    color: "#fff",
                    fontWeight: 700,
                    lineHeight: 1,
                  }}
                >
                  ✕
                </Typography>
              </Box>

              {/* Like Button - Green Heart */}
              <Box
                sx={{
                  width: { xs: "36px", sm: "40px", md: "44px" },
                  height: { xs: "36px", sm: "40px", md: "44px" },
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
                <Typography
                  sx={{
                    fontSize: { xs: "16px", sm: "18px", md: "22px" },
                    color: "#fff",
                    fontWeight: 700,
                    lineHeight: 1,
                  }}
                >
                  ♥
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );

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
      github:
        "https://www.youtube.com/watch?v=64Pnq-MybS8&list=PLk22IJ-X9itqH1UIuWYtNs3cfTwHqOIvM&index=14",
      animation: bloodSugarMonitorAnimation,
    },
    {
      id: 4,
      image: "/images/workly.png",
      role: "TEAM PROJECT",
      title: "Workly",
      tags: ["Flutter", "Dart", "Firebase", "Mobile"],
      description:
        "A mobile application that revolutionizes job searching with a Tinder-like swipe interface. Built with Flutter, Workly allows job seekers to quickly browse opportunities by swiping right on interesting positions or left to pass. The app features real-time job matching, user profiles, and seamless navigation across iOS, Android, and web platforms.",
      status: "GITHUB ONLY",
      github: "https://github.com/maheessh/workly",
      animation: worklyAnimation,
    },
  ];

  const sectionRef = useRef();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end end"],
  });

  const buttonOpacity = useTransform(scrollYProgress, [0.7, 0.9], [1, 0]);
  const buttonY = useTransform(scrollYProgress, [0.7, 0.9], [0, 50]);
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
              fontSize: {
                xs: "1.75rem",
                sm: "2.25rem",
                md: "2.5rem",
                lg: "2.75rem",
              },
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
                      alignItems: { xs: "flex-start", md: "center" },
                      justifyContent: "flex-start",
                      gap: { xs: 3, sm: 4, md: 5 },
                      mb: { xs: 4, sm: 5, md: 6 },
                      width: "100%",
                    }}
                  >
                    {/* Animated Project Image */}
                    <Box
                      component={motion.div}
                      variants={imageVariants(isImageLeft)}
                      sx={{
                        maxWidth: "100%",
                        width: { xs: "100%", sm: "90%", md: 460 },
                        height: { xs: "auto", sm: "280px", md: 360 },
                        minHeight: { xs: "200px", sm: "280px", md: 360 },
                        flexShrink: 0,
                        mb: { xs: 3, sm: 3, md: 0 },
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
                          mb: { xs: 1.5, md: 1 },
                          color: "#222",
                          fontSize: {
                            xs: "1.125rem",
                            sm: "1.25rem",
                            md: "1.5rem",
                          },
                          lineHeight: 1.3,
                        }}
                      >
                        {project.title}
                      </Typography>
                      <Typography
                        component="div"
                        sx={{
                          color: "#666",
                          mb: { xs: 2.5, md: 2 },
                          fontSize: {
                            xs: "0.8125rem",
                            sm: "0.875rem",
                            md: "0.9375rem",
                          },
                          lineHeight: 1.6,
                        }}
                      >
                        {project.description}
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: { xs: "flex-start", md: "flex-end" },
                          width: "100%",
                          mt: { xs: 1, md: 0 },
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
                            fontSize: {
                              xs: "0.875rem",
                              sm: "0.9rem",
                              md: "1rem",
                            },
                            fontWeight: 500,
                            px: { xs: 2, sm: 2.5, md: 3.5 },
                            py: { xs: 1, sm: 1.25, md: 1.75 },
                            minHeight: { xs: "40px", sm: "44px", md: "48px" },
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
            sx={{
              textAlign: "center",
              mt: { xs: 4, sm: 5, md: 6 },
              mb: { xs: 2, md: 2 },
            }}
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
                px: { xs: 3, sm: 3.5, md: 4 },
                py: { xs: 1.25, sm: 1.5 },
                borderWidth: "2px",
                textTransform: "none",
                fontSize: { xs: "0.875rem", sm: "0.9375rem", md: "1rem" },
                minHeight: { xs: "44px", sm: "48px", md: "52px" },
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
