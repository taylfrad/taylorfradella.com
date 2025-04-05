// Modified AboutContact.jsx
import { useRef } from "react";
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
import DownloadIcon from "@mui/icons-material/Download";
import useIntersectionObserver from "../hooks/useIntersectionObserver";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";

export default function AboutContact() {
  const theme = useTheme();
  const [containerRef, isVisible] = useIntersectionObserver({
    threshold: 0.1,
  });

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
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        py: 6,
        position: "relative",
        bgcolor: "#ffffff",
        width: "100%",
      }}
    >
      <Container maxWidth="lg" sx={{ textAlign: "center", mb: 4 }}>
        <Box
          ref={containerRef}
          sx={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(40px)",
            transition: "opacity 0.8s ease, transform 0.8s ease",
            width: "100%",
          }}
        >
          <Box sx={{ mb: 5 }}>
            <Typography
              variant="h2"
              component="h2"
              sx={{
                fontWeight: 700,
                position: "relative",
                display: "inline-block",
                mb: 2,
                color: "#0f172a",
                "&::after": {
                  content: '""',
                  position: "absolute",
                  width: "60px",
                  height: "4px",
                  backgroundColor: theme.palette.primary.main,
                  bottom: "-12px",
                  left: "calc(50% - 30px)",
                  borderRadius: "2px",
                },
              }}
            >
              About Me
            </Typography>
          </Box>

          <Paper
            elevation={2}
            sx={{
              bgcolor: "#ffffff",
              borderRadius: "16px",
              border: "1px solid rgba(0, 0, 0, 0.08)",
              p: 4,
              mb: 4,
              position: "relative",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
              textAlign: "left",
            }}
          >
            <Typography
              variant="body1"
              paragraph
              sx={{
                color: "#334155",
                lineHeight: 1.8,
                fontSize: "1.05rem",
              }}
            >
              Hi, I'm Taylor Fradella — a Computer Science student at
              Southeastern Louisiana University 🎓 with a passion for building
              clean, functional, and intuitive software 💡. I believe great
              design should be simple, and function should always come first.
            </Typography>

            <Typography
              variant="body1"
              paragraph
              sx={{
                color: "#334155",
                lineHeight: 1.8,
                fontSize: "1.05rem",
              }}
            >
              I'm relatively new to the field, but I'm endlessly curious 🔍 and
              always eager to grow, get hands-on experience, and explore new
              technologies. I love figuring out how things work and finding ways
              to make them even better 🔧.
            </Typography>

            <Typography
              variant="body1"
              paragraph
              sx={{
                color: "#334155",
                lineHeight: 1.8,
                fontSize: "1.05rem",
              }}
            >
              Whether I'm working on full-stack web apps, mobile experiences 📱,
              or backend systems 🖥️, I aim to build tools that are not just
              useful — but enjoyable to use. I've led and contributed to
              projects using C#, React, SQL, and .NET, always striving to write
              clean code and deliver smooth user experiences ✨.
            </Typography>

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
                Connect With Me 👇
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  gap: 3,
                  mb: 3,
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
                      width: "60px",
                      height: "60px",
                      bgcolor: `rgba(56, 189, 248, 0.1)`,
                      color: theme.palette.primary.main,
                      transition: "all 0.3s ease",
                      "&:hover": {
                        bgcolor: `rgba(56, 189, 248, 0.2)`,
                        transform: "translateY(-5px)",
                        boxShadow: `0 0 20px rgba(56, 189, 248, 0.3)`,
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
      </Container>

      <Box
        sx={{
          width: "100%",
          py: 5,
          bgcolor: "#f8fafc",
          borderTop: "1px solid rgba(0, 0, 0, 0.08)",
        }}
      >
        <Container maxWidth="lg">
          {/* Thanks for stopping by section */}
          <Typography
            variant="h5"
            component="p"
            align="center"
            sx={{
              color: "#4b5563",
              fontWeight: 500,
              mb: 5,
            }}
          >
            Thanks for stopping by, let's chat! 👋
          </Typography>

          {/* Contact sections */}
          <Grid container spacing={2} justifyContent="center">
            <Grid item xs={12} sm={4} sx={{ textAlign: "center" }}>
              <Typography
                variant="subtitle1"
                component="h3"
                sx={{
                  color: "#6b7280",
                  textTransform: "uppercase",
                  letterSpacing: 1,
                  fontSize: "0.85rem",
                  mb: 1,
                }}
              >
                CONTACT ME 📧
              </Typography>
              <Typography sx={{ color: "#4b5563" }}>
                taylor.fradella@selu.edu
              </Typography>
            </Grid>

            <Grid item xs={12} sm={4} sx={{ textAlign: "center" }}>
              <Typography
                variant="subtitle1"
                component="h3"
                sx={{
                  color: "#6b7280",
                  textTransform: "uppercase",
                  letterSpacing: 1,
                  fontSize: "0.85rem",
                  mb: 1,
                }}
              >
                LET'S CONNECT 🤝
              </Typography>
              <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
                <Link
                  href="https://www.linkedin.com/in/taylorfradella/"
                  target="_blank"
                  sx={{
                    color: "#4b5563",
                    textDecoration: "none",
                    "&:hover": {
                      color: theme.palette.primary.main,
                    },
                  }}
                >
                  LinkedIn
                </Link>
                <Typography sx={{ color: "#4b5563" }}>|</Typography>
                <Link
                  href="https://docs.google.com/document/d/1m9vus2XiZgg8Ket0AMkIP9sJzNuEmZF-qncZdzFydjA/edit?usp=sharing"
                  target="_blank"
                  sx={{
                    color: "#4b5563",
                    textDecoration: "none",
                    "&:hover": {
                      color: theme.palette.primary.main,
                    },
                  }}
                >
                  Resume
                </Link>
                <Typography sx={{ color: "#4b5563" }}>|</Typography>
                <Link
                  href="https://github.com/taylfrad"
                  target="_blank"
                  sx={{
                    color: "#4b5563",
                    textDecoration: "none",
                    "&:hover": {
                      color: theme.palette.primary.main,
                    },
                  }}
                >
                  GitHub
                </Link>
              </Box>
            </Grid>

            <Grid item xs={12} sm={4} sx={{ textAlign: "center" }}>
              <Typography
                variant="subtitle1"
                component="h3"
                sx={{
                  color: "#6b7280",
                  textTransform: "uppercase",
                  letterSpacing: 1,
                  fontSize: "0.85rem",
                  mb: 1,
                }}
              >
                ©{new Date().getFullYear()} TAYLOR FRADELLA
              </Typography>
              <Typography variant="body2" sx={{ color: "#4b5563" }}>
                Made with ❤️ & 💻
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}
