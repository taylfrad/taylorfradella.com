// Updated Footer.jsx
import {
  Box,
  Container,
  Typography,
  Grid,
  Link,
  Divider,
  useTheme,
} from "@mui/material";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";
import EmailIcon from "@mui/icons-material/Email";
import FavoriteIcon from "@mui/icons-material/Favorite";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import SchoolIcon from "@mui/icons-material/School";
import EmojiPeopleIcon from "@mui/icons-material/EmojiPeople";

const Footer = () => {
  const theme = useTheme();

  const myValues = [
    {
      icon: <FavoriteIcon sx={{ color: "#FFD700" }} />,
      title: "Passion is everything.",
      description:
        "I pour my heart into creating software that is both functional and enjoyable to use. I've found that when I'm passionate about what I build, the results are always better.",
    },
    {
      icon: <SchoolIcon sx={{ color: "#FFD700" }} />,
      title: "Never stop learning.",
      description:
        "I'm always seeking new technologies to learn and challenges to overcome. I believe that continuous growth is essential in the ever-evolving field of software development.",
    },
    {
      icon: <AutoAwesomeIcon sx={{ color: "#FFD700" }} />,
      title: "Embrace the journey.",
      description:
        "I welcome both successes and failures as learning opportunities. I believe in staying curious, maintaining optimism, and enjoying the process of building and creating.",
    },
    {
      icon: <EmojiPeopleIcon sx={{ color: "#FFD700" }} />,
      title: "Be human.",
      description:
        "I value clear communication and empathy in everything I do. Great software is built with users in mind, and understanding different perspectives leads to better solutions.",
    },
  ];

  return (
    <Box component="footer" sx={{ pt: 10, pb: 4 }}>
      {/* Values Section */}
      <Container maxWidth="lg" sx={{ mb: 10 }}>
        <Typography
          variant="h3"
          component="h2"
          align="center"
          sx={{
            mb: 5,
            fontWeight: 600,
            color: "#0f172a",
            position: "relative",
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
          My Values
        </Typography>

        <Grid container spacing={4}>
          {myValues.map((value, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Box
                sx={{
                  display: "flex",
                  mb: 2,
                  alignItems: "flex-start",
                  p: 3,
                  borderRadius: "8px",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
                  },
                }}
              >
                <Box sx={{ mr: 2, mt: 0.5 }}>{value.icon}</Box>
                <Box>
                  <Typography
                    variant="h6"
                    component="h3"
                    sx={{ fontWeight: 600, mb: 1, color: "#0f172a" }}
                  >
                    {value.title}
                  </Typography>
                  <Typography variant="body1" sx={{ color: "#334155" }}>
                    {value.description}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Chat Invitation */}
      <Box
        sx={{
          textAlign: "center",
          py: 6,
          borderTop: "1px solid rgba(0, 0, 0, 0.08)",
          borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
          mb: 4,
          backgroundColor: "rgba(56, 189, 248, 0.05)",
        }}
      >
        <Typography
          variant="h5"
          component="p"
          sx={{ fontWeight: 500, color: "#334155" }}
        >
          Thanks for stopping by, let's chat! 👋
        </Typography>
      </Box>

      {/* Connect Section */}
      <Container maxWidth="lg">
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} md={4} sx={{ textAlign: "center" }}>
            <Typography
              variant="h6"
              component="h3"
              sx={{
                color: "#0f172a",
                mb: 2,
                textTransform: "uppercase",
                letterSpacing: 1,
              }}
            >
              Contact Me 📧
            </Typography>
            <Typography sx={{ color: "#334155" }}>
              <Link
                href="mailto:taylor.fradella@selu.edu"
                sx={{ color: "inherit", textDecoration: "none" }}
              >
                taylor.fradella@selu.edu
              </Link>
            </Typography>
          </Grid>

          <Grid item xs={12} md={4} sx={{ textAlign: "center" }}>
            <Typography
              variant="h6"
              component="h3"
              sx={{
                color: "#0f172a",
                mb: 2,
                textTransform: "uppercase",
                letterSpacing: 1,
              }}
            >
              Let's Connect 💛
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
              <Link
                href="https://www.linkedin.com/in/taylorfradella/"
                target="_blank"
                sx={{ color: "#334155", textDecoration: "none" }}
              >
                LinkedIn
              </Link>
              <Typography sx={{ color: "#334155" }}>|</Typography>
              <Link
                href="/resume.pdf"
                target="_blank"
                sx={{ color: "#334155", textDecoration: "none" }}
              >
                Resume
              </Link>
            </Box>
          </Grid>

          <Grid item xs={12} md={4} sx={{ textAlign: "center" }}>
            <Typography
              variant="h6"
              component="h3"
              sx={{
                color: "#0f172a",
                mb: 2,
                textTransform: "uppercase",
                letterSpacing: 1,
              }}
            >
              ©{new Date().getFullYear()} Taylor Fradella
            </Typography>
            <Typography variant="body2" sx={{ color: "#334155" }}>
              Made with 💛 & 💻
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Footer;
