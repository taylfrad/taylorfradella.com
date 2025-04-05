import { Box, Typography, Container, Link, Button } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

export default function Hero({ onScrollToSkills }) {
  // Navigation click handler
  const handleNavClick = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        width: "100%",
      }}
    >
      {/* Name positioned at far left */}
      <Typography
        variant="h4"
        sx={{
          color: "white",
          fontWeight: 700,
          fontSize: "2rem",
          position: "absolute",
          top: 20,
          left: 150,
          zIndex: 10,
        }}
      >
        TAYLOR FRADELLA
      </Typography>

      {/* Navigation buttons positioned at far right */}
      <Box
        sx={{
          position: "absolute",
          top: 20,
          right: 150,
          display: "flex",
          gap: 2,
          zIndex: 10,
        }}
      >
        <Button
          sx={{
            color: "white",
            textTransform: "none",
            fontSize: "1rem",
          }}
          onClick={() => handleNavClick("skills")}
        >
          Skills
        </Button>
        <Button
          sx={{
            color: "white",
            textTransform: "none",
            fontSize: "1rem",
          }}
          onClick={() => handleNavClick("projects")}
        >
          Projects
        </Button>
        <Button
          sx={{
            color: "white",
            textTransform: "none",
            fontSize: "1rem",
          }}
          onClick={() => handleNavClick("about")}
        >
          About
        </Button>
      </Box>

      <Container
        maxWidth="lg"
        sx={{
          display: "flex",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            maxWidth: "800px",
            pt: { xs: 10, md: 0 },
          }}
        >
          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontWeight: 700,
              fontSize: { xs: "3.5rem", sm: "4.5rem", md: "5rem" },
              lineHeight: 1.2,
              mb: 2,
              background: "linear-gradient(90deg, #f8fafc 0%, #7dd3fc 100%)",
              backgroundClip: "text",
              textFillColor: "transparent",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              width: "100%",
              textAlign: "center",
            }}
          >
            Taylor Fradella
          </Typography>
          <Typography
            variant="h4"
            component="h2"
            sx={{
              mb: 2,
              color: "rgba(255, 255, 255, 0.9)",
              fontWeight: 400,
              fontSize: { xs: "1.2rem", sm: "1.5rem", md: "1.8rem" },
              letterSpacing: "0.01em",
              textAlign: "center",
              width: "100%",
            }}
          >
            Computer Science Student
          </Typography>

          <Typography
            variant="h5"
            component="h3"
            sx={{
              mb: 4,
              color: "rgba(255, 255, 255, 0.85)",
              fontWeight: 400,
            }}
          >
            <Link
              href="https://www.southeastern.edu/"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                color: "inherit",
                textDecoration: "none",
                transition: "color 0.3s ease",
                "&:hover": {
                  color: "primary.main",
                },
              }}
            >
              Southeastern Louisiana University
            </Link>
          </Typography>

          <Typography
            variant="body1"
            sx={{
              mb: 6,
              color: "rgba(255, 255, 255, 0.8)",
              fontWeight: 400,
              fontSize: "1.2rem",
              lineHeight: 1.7,
              maxWidth: "650px",
              textAlign: "center",
              mx: "auto",
            }}
          >
            Aspiring software engineer and current student with a passion for
            understanding how things work and making them better. I love
            exploring the intersection of creativity and technology, and I’m
            always looking to learn, grow, and build meaningful digital
            experiences through clean, thoughtful code.
          </Typography>
        </Box>
      </Container>

      {/* Scroll indicator */}
      <Box
        sx={{
          position: "absolute",
          bottom: "5%",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          opacity: 0.6,
          cursor: "pointer",
          transition: "all 0.3s ease",
          "&:hover": {
            opacity: 1,
            transform: "translateX(-50%) translateY(5px)",
          },
        }}
        onClick={() => handleNavClick("skills")}
      >
        <KeyboardArrowDownIcon
          sx={{
            color: "primary.light",
            fontSize: "2.5rem",
            animation: "bounce 2s infinite",
            "@keyframes bounce": {
              "0%, 20%, 50%, 80%, 100%": {
                transform: "translateY(0)",
              },
              "40%": {
                transform: "translateY(-10px)",
              },
              "60%": {
                transform: "translateY(-5px)",
              },
            },
          }}
        />
      </Box>
    </Box>
  );
}
