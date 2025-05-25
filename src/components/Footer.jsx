// Updated Footer.jsx
import { Box, Typography, Link, useTheme, IconButton } from "@mui/material";
import { keyframes } from "@mui/system";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

// Define bounce keyframes
const bounceAnimation = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
`;

const waveAnimation = keyframes`
  0% { transform: rotate(0deg); }
  10% { transform: rotate(14deg); }
  20% { transform: rotate(-8deg); }
  30% { transform: rotate(14deg); }
  40% { transform: rotate(-4deg); }
  50% { transform: rotate(10deg); }
  60% { transform: rotate(0deg); }
  100% { transform: rotate(0deg); }
`;

const Footer = () => {
  const theme = useTheme();

  const scrollToTop = () => {
    console.log("Attempting to find scrollable parent and scroll to hero...");

    const heroSection = document.getElementById("hero");
    const fixedHeaderHeight = 80; // Approximate height of your fixed header/navbar

    if (!heroSection) {
      console.log("Hero section not found.");
      // Fallback to window scroll if hero section is not found
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // Function to find the nearest scrollable parent
    const findScrollableParent = (element) => {
      let parent = element.parentElement;
      while (parent) {
        // Check for overflow style
        const overflowY = window.getComputedStyle(parent).overflowY;
        const isScrollable = overflowY !== "visible" && overflowY !== "hidden";

        // Check if element has actual scrollable content
        if (isScrollable && parent.scrollHeight > parent.clientHeight) {
          return parent;
        }
        parent = parent.parentElement;
      }
      return null; // Return null if no scrollable parent found up to the document root
    };

    const scrollableParent = findScrollableParent(heroSection);

    if (scrollableParent) {
      console.log("Found scrollable parent:", scrollableParent);
      // Calculate the position of the hero section relative to the scrollable parent
      const targetScrollTop = heroSection.offsetTop - fixedHeaderHeight; // offsetTop is relative to offsetParent

      // Ensure we don't scroll to a negative position
      const scrollToPosition = Math.max(0, targetScrollTop);

      scrollableParent.scrollTo({ top: scrollToPosition, behavior: "smooth" });
      console.log(
        "Scrolled scrollable parent to hero section position:",
        scrollToPosition
      );
    } else {
      console.log(
        "No scrollable parent found, attempting window scroll fallback."
      );
      // Fallback to window scroll if no specific scrollable parent is found
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <>
      <Box
        component="footer"
        sx={{
          bgcolor: "#f8fafc",
          width: "100vw",
          px: 0,
          py: { xs: 2, md: 3 },
          m: 0,
          border: 0,
          boxShadow: "none",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          pb: { xs: 7, md: 3 },
        }}
      >
        {/* Scroll to top button positioned in footer's bottom-right */}
        <IconButton
          onClick={scrollToTop}
          disableRipple
          sx={{
            position: "absolute",
            bottom: { xs: 1, md: 24 },
            left: "unset",
            right: { xs: 0, md: 80 },
            transform: "none",
            color: "#6b7280",
            backgroundColor: "transparent",
            zIndex: 10,
            padding: 0,
            cursor: "pointer",
            boxShadow: "none",
            transition: "transform 0.2s ease-in-out",
            "&:hover": {
              color: "#444",
              backgroundColor: "transparent",
              boxShadow: "none",
              animation: `${bounceAnimation} 0.6s ease-in-out`,
            },
            "&:active": {
              backgroundColor: "transparent",
              boxShadow: "none",
              animation: `${bounceAnimation} 0.6s ease-in-out`,
            },
          }}
          aria-label="Scroll to top"
        >
          <KeyboardArrowUpIcon sx={{ fontSize: "3.5rem" }} />
        </IconButton>
        <Typography
          variant="h5"
          align="center"
          sx={{
            color: "#444",
            fontWeight: 700,
            fontSize: { xs: "1.35rem", sm: "1.5rem" },
            mb: { xs: 3, md: 4 },
            letterSpacing: 0,
          }}
        >
          Thanks for stopping by, let's chat!{" "}
          <span className="wave-hand" role="img" aria-label="waving hand">
            👋
          </span>
        </Typography>
        <Box
          sx={{
            width: "100%",
            maxWidth: 1200,
            mx: "auto",
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: { xs: "center", md: "space-between" },
            alignItems: { xs: "center", md: "flex-start" },
            gap: { xs: 4, md: 0 },
            px: { xs: 2, md: 6 },
            mb: { xs: 1, md: 1 },
          }}
        >
          {/* Contact Me */}
          <Box
            sx={{
              flex: 1,
              minWidth: 220,
              flexBasis: 0,
              mb: { xs: 0, md: 0 },
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{
                color: "#6b7280",
                textTransform: "uppercase",
                letterSpacing: 2,
                fontSize: "0.95rem",
                mb: 1.2,
                fontWeight: 700,
                textAlign: "center",
              }}
            >
              Contact Me
            </Typography>
            <Typography
              sx={{ color: "#222", fontWeight: 600, fontSize: "1rem", mb: 0.5 }}
            >
              taylor.fradella@selu.edu
            </Typography>
          </Box>
          {/* Let's Connect */}
          <Box
            sx={{
              flex: 1,
              minWidth: 220,
              flexBasis: 0,
              mb: { xs: 0, md: 0 },
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{
                color: "#6b7280",
                textTransform: "uppercase",
                letterSpacing: 2,
                fontSize: "0.95rem",
                mb: 1.2,
                fontWeight: 700,
                textAlign: "center",
              }}
            >
              Let's Connect
            </Typography>
            <Box
              sx={{
                display: "flex",
                gap: 1.5,
                alignItems: "center",
                flexWrap: "wrap",
                justifyContent: "center",
                mt: 0.5,
              }}
            >
              <Link
                href="https://www.linkedin.com/in/taylorfradella/"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: "#444",
                  fontWeight: 600,
                  fontSize: "1rem",
                  textDecoration: "none",
                }}
              >
                LinkedIn
              </Link>
              <Typography sx={{ color: "#6b7280", fontWeight: 400 }}>
                |
              </Typography>
              <Link
                href="https://docs.google.com/document/d/1m9vus2XiZgg8Ket0AMkIP9sJzNuEmZF-qncZdzFydjA/edit?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: "#444",
                  fontWeight: 600,
                  fontSize: "1rem",
                  textDecoration: "none",
                }}
              >
                Resume
              </Link>
              <Typography sx={{ color: "#6b7280", fontWeight: 400 }}>
                |
              </Typography>
              <Link
                href="https://github.com/taylfrad"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: "#444",
                  fontWeight: 600,
                  fontSize: "1rem",
                  textDecoration: "none",
                }}
              >
                GitHub
              </Link>
            </Box>
          </Box>
          {/* Copyright */}
          <Box
            sx={{
              flex: 1,
              minWidth: 220,
              flexBasis: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{
                color: "#6b7280",
                textTransform: "uppercase",
                letterSpacing: 2,
                fontSize: "0.95rem",
                mb: 1.2,
                fontWeight: 700,
                textAlign: "center",
              }}
            >
              ©{new Date().getFullYear()} Taylor Fradella
            </Typography>
            <Typography
              sx={{ color: "#444", fontWeight: 600, fontSize: "1rem" }}
            >
              Made with an{" "}
              <span role="img" aria-label="lightbulb">
                💡
              </span>{" "}
              &{" "}
              <span role="img" aria-label="laptop">
                💻
              </span>
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box sx={{ height: { xs: 32, sm: 32 } }} />
    </>
  );
};

export default Footer;
