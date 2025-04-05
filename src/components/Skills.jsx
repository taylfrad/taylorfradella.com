// src/components/Skills.jsx
import { useRef } from "react";
import {
  Container,
  Typography,
  Grid,
  Box,
  Paper,
  Chip,
  useTheme,
  Link,
} from "@mui/material";
import CodeIcon from "@mui/icons-material/Code";
import StorageIcon from "@mui/icons-material/Storage";
import BuildIcon from "@mui/icons-material/Build";
import useIntersectionObserver from "../hooks/useIntersectionObserver";

export default function Skills() {
  const theme = useTheme();
  const [containerRef, isVisible] = useIntersectionObserver({
    threshold: 0.2,
  });

  // Function to get appropriate URL for each skill
  const getSkillUrl = (skillName) => {
    const skillUrls = {
      // Languages
      Python: "https://www.python.org/",
      Java: "https://www.java.com/",
      C: "https://en.wikipedia.org/wiki/C_(programming_language)",
      "C++": "https://isocpp.org/",
      TypeScript: "https://www.typescriptlang.org/",
      JavaScript: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
      SQL: "https://www.microsoft.com/en-us/sql-server",
      "HTML/CSS": "https://developer.mozilla.org/en-US/docs/Web/HTML",

      // Frameworks & Libraries
      Mantine: "https://mantine.dev/",
      "Material UI": "https://mui.com/",
      "Node.js": "https://nodejs.org/",
      "React.js": "https://reactjs.org/",

      // Tools & Platforms
      "Git & GitHub": "https://github.com/",
      "VS Code": "https://code.visualstudio.com/",
      "Visual Studio": "https://visualstudio.microsoft.com/",
      Azure: "https://azure.microsoft.com/",

      // Currently Learning
      "React Native": "https://reactnative.dev/",
      "Cloud Architecture": "https://aws.amazon.com/architecture/",
      "UI/UX Design": "https://www.interaction-design.org/",
    };

    return skillUrls[skillName] || "#";
  };

  // Define skills with Devicon classes - using colored versions
  const skillCategories = [
    {
      title: "Languages",
      icon: <CodeIcon fontSize="large" />,
      skills: [
        {
          name: "Python",
          iconClass: "devicon-python-plain colored",
        },
        {
          name: "Java",
          iconClass: "devicon-java-plain colored",
        },
        {
          name: "C",
          iconClass: "devicon-c-plain colored",
        },
        {
          name: "C++",
          iconClass: "devicon-cplusplus-plain colored",
        },
        {
          name: "TypeScript",
          iconClass: "devicon-typescript-plain colored",
        },
        {
          name: "JavaScript",
          iconClass: "devicon-javascript-plain colored",
        },
        {
          name: "SQL",
          iconClass: "devicon-microsoftsqlserver-plain colored", // Using MySQL as representative
        },
        {
          name: "HTML/CSS",
          iconClass: "devicon-html5-plain colored",
        },
      ],
    },
    {
      title: "Frameworks & Libraries",
      icon: <StorageIcon fontSize="large" />,
      skills: [
        {
          name: "Mantine",
          // Mantine doesn't have a specific Devicon, we could use a generic icon or keep text only
          iconClass: "devicon-react-plain colored", // Generic alternative
        },
        {
          name: "Material UI",
          iconClass: "devicon-materialui-plain colored",
        },
        {
          name: "Node.js",
          iconClass: "devicon-nodejs-plain colored",
        },
        {
          name: "React.js",
          iconClass: "devicon-react-plain colored",
        },
      ],
    },
    {
      title: "Tools & Platforms",
      icon: <BuildIcon fontSize="large" />,
      skills: [
        {
          name: "Git & GitHub",
          iconClass: "devicon-github-original colored",
        },
        {
          name: "VS Code",
          iconClass: "devicon-vscode-plain colored",
        },
        {
          name: "Visual Studio",
          iconClass: "devicon-visualstudio-plain colored",
        },
        {
          name: "Azure",
          iconClass: "devicon-azure-plain colored",
        },
      ],
    },
  ];

  // Currently learning skills with their Devicon classes
  const learningSkills = [
    {
      name: "React Native",
      iconClass: "devicon-react-plain colored", // Same as React
    },
    {
      name: "Cloud Architecture",
      iconClass: "devicon-amazonwebservices-plain colored", // Using AWS as representative
    },
    {
      name: "UI/UX Design",
      iconClass: "devicon-figma-plain colored", // Using Figma as representative
    },
  ];

  // Custom component for Devicon
  const DeviconWrapper = ({ iconClass }) => (
    <i
      className={iconClass}
      style={{
        fontSize: "22px",
        marginRight: "8px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    />
  );

  return (
    <Box
      id="skills"
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        py: 10,
        position: "relative",
        bgcolor: "#ffffff", // White background for Skills section
        color: "text.primary",
      }}
    >
      <Container maxWidth="lg" sx={{ textAlign: "center" }}>
        <Box
          ref={containerRef}
          sx={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(40px)",
            transition: "opacity 0.7s ease, transform 0.7s ease",
          }}
        >
          <Box sx={{ mb: 8 }}>
            <Typography
              variant="h2"
              component="h2"
              sx={{
                fontWeight: 700,
                position: "relative",
                display: "inline-block",
                mb: 2,
                color: "#0f172a", // Dark text for white background
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
              Skills
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "#334155", // Darker text for white background
                maxWidth: "650px",
                mx: "auto",
                mt: 4,
                fontSize: "1.1rem",
              }}
            >
              My technical toolkit includes a range of programming languages,
              frameworks, and tools that I've used to build various projects.
            </Typography>
          </Box>

          <Grid container spacing={4} justifyContent="center">
            {skillCategories.map((category, index) => (
              <Grid item xs={12} md={4} key={category.title}>
                <Paper
                  elevation={2}
                  sx={{
                    height: "100%",
                    bgcolor: "#ffffff",
                    borderRadius: "16px",
                    p: 4,
                    transition: "all 0.5s ease",
                    position: "relative",
                    overflow: "hidden",
                    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: "0 15px 35px rgba(0, 0, 0, 0.15)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mb: 4,
                      justifyContent: "center",
                    }}
                  >
                    <Box
                      sx={{
                        color: theme.palette.primary.main,
                        mr: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "50px",
                        height: "50px",
                        borderRadius: "12px",
                        bgcolor: "rgba(56, 189, 248, 0.1)",
                        border: "1px solid rgba(56, 189, 248, 0.2)",
                        transition: "all 0.3s ease",
                      }}
                    >
                      {category.icon}
                    </Box>
                    <Typography
                      variant="h5"
                      component="h3"
                      sx={{
                        fontWeight: 600,
                        color: "#0f172a", // Dark text for white background
                      }}
                    >
                      {category.title}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 1,
                      justifyContent: "center",
                    }}
                  >
                    {category.skills.map((skill, skillIndex) => (
                      <Chip
                        key={skillIndex}
                        label={skill.name}
                        icon={<DeviconWrapper iconClass={skill.iconClass} />}
                        component={Link}
                        href={getSkillUrl(skill.name)}
                        target="_blank"
                        rel="noopener noreferrer"
                        clickable
                        sx={{
                          bgcolor: "rgba(56, 189, 248, 0.1)",
                          color: "#334155", // Dark text for white background
                          borderRadius: "8px",
                          mb: 1,
                          height: "36px",
                          "& .MuiChip-label": {
                            paddingLeft: "6px",
                          },
                          "& .MuiChip-icon": {
                            marginLeft: "8px",
                            color: "inherit",
                          },
                          "&:hover": {
                            bgcolor: "rgba(56, 189, 248, 0.2)",
                            transform: "translateY(-2px)",
                            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                          },
                          transition: "all 0.3s ease",
                          animation: "fadeIn 0.5s forwards",
                          animationDelay: `${0.1 * skillIndex + 0.2 * index}s`,
                          opacity: 0,
                          "@keyframes fadeIn": {
                            from: {
                              opacity: 0,
                              transform: "translateY(10px)",
                            },
                            to: {
                              opacity: 1,
                              transform: "translateY(0)",
                            },
                          },
                        }}
                      />
                    ))}
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>

          <Box
            sx={{
              width: "100%",
              textAlign: "center",
              mt: 8,
              borderRadius: "16px",
              bgcolor: "rgba(56, 189, 248, 0.05)",
              p: 4,
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
              border: "1px solid rgba(56, 189, 248, 0.1)",
            }}
          >
            <Typography variant="h6" sx={{ mb: 2, color: "#0f172a" }}>
              Currently Learning
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: 1,
              }}
            >
              {learningSkills.map((skill, index) => (
                <Chip
                  key={index}
                  label={skill.name}
                  icon={<DeviconWrapper iconClass={skill.iconClass} />}
                  component={Link}
                  href={getSkillUrl(skill.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  clickable
                  sx={{
                    bgcolor: "rgba(56, 189, 248, 0.1)",
                    color: "#334155",
                    m: 0.5,
                    height: "36px",
                    "& .MuiChip-label": {
                      paddingLeft: "6px",
                    },
                    "&:hover": {
                      bgcolor: "rgba(56, 189, 248, 0.2)",
                      transform: "translateY(-2px)",
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    },
                    transition: "all 0.3s ease",
                  }}
                />
              ))}
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
