// Updated Footer.jsx
import { Box, Typography, Link, useTheme, IconButton } from "@mui/material";
import { keyframes } from "@mui/system";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

// Define bounce keyframes
const bounceAnimation = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
`;

const Footer = () => {
  const theme = useTheme();

  const scrollToTop = () => {
    const heroSection = document.getElementById("hero");
    const fixedHeaderHeight = 80;

    if (!heroSection) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const findScrollableParent = (element) => {
      let parent = element.parentElement;
      while (parent) {
        const overflowY = window.getComputedStyle(parent).overflowY;
        const isScrollable = overflowY !== "visible" && overflowY !== "hidden";

        if (isScrollable && parent.scrollHeight > parent.clientHeight) {
          return parent;
        }
        parent = parent.parentElement;
      }
      return null;
    };

    const scrollableParent = findScrollableParent(heroSection);

    if (scrollableParent) {
      const targetScrollTop = heroSection.offsetTop - fixedHeaderHeight;
      const scrollToPosition = Math.max(0, targetScrollTop);
      scrollableParent.scrollTo({ top: scrollToPosition, behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <>
      <Box
        id="footer"
        component="footer"
        sx={{
          bgcolor: "#f5f5f7",
          width: "100vw",
          px: 0,
          py: { xs: 3, md: 4 },
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
            animation: `${bounceAnimation} 1.5s infinite ease-in-out`,
            "&:hover": {
              color: "#444",
              backgroundColor: "transparent",
              boxShadow: "none",
            },
            "&:active": {
              backgroundColor: "transparent",
              boxShadow: "none",
            },
          }}
          aria-label="Scroll to top"
        >
          <KeyboardArrowUpIcon sx={{ fontSize: "3.5rem" }} />
        </IconButton>

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
    </>
  );
};

export default Footer;
