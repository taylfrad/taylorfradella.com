// src/components/Skills.jsx
import {
  Container,
  Typography,
  Grid,
  Box,
  Paper,
  Chip,
  useTheme,
  Link,
  Divider,
} from "@mui/material";
import CodeIcon from "@mui/icons-material/Code";
import StorageIcon from "@mui/icons-material/Storage";
import BuildIcon from "@mui/icons-material/Build";
import useIntersectionObserver from "../hooks/useIntersectionObserver";
import { motion, useAnimation, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import SectionHeader from "./SectionHeader";

export default function Skills() {
  const theme = useTheme();
  const [containerRef, isVisible] = useIntersectionObserver({
    threshold: 0.2,
  });
  const controls = useAnimation();
  const sectionRef = useRef();
  const stickyRef = useRef();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const left = useTransform(scrollYProgress, [0, 1], ["50%", "24px"]);
  const translateX = useTransform(scrollYProgress, [0, 1], ["-50%", "0%"]);

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
      React: "https://reactjs.org/",
      "Framer Motion": "https://motion.dev/",

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
          iconClass: "devicon-microsoftsqlserver-plain-wordmark colored",
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
          iconClass: "devicon-react-plain colored",
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
          name: "React",
          iconClass: "devicon-react-plain colored",
        },
        {
          name: "Framer Motion",
          iconClass: "devicon-framermotion-original colored",
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

  const [cardMinHeight, setCardMinHeight] = useState(220);
  const cardRefs = useRef([]);
  const [cardMinWidth, setCardMinWidth] = useState(340);

  useEffect(() => {
    // After mount, measure all card heights and set the max as minHeight
    if (cardRefs.current.length) {
      const heights = cardRefs.current.map((ref) =>
        ref ? ref.offsetHeight : 0
      );
      const maxHeight = Math.max(...heights);
      if (maxHeight && maxHeight !== cardMinHeight) {
        setCardMinHeight(maxHeight);
      }
      const widths = cardRefs.current.map((ref) => (ref ? ref.offsetWidth : 0));
      const maxWidth = Math.max(...widths);
      if (maxWidth && maxWidth !== cardMinWidth) {
        setCardMinWidth(maxWidth);
      }
    }
  }, [cardRefs.current.length]);

  return (
    <Box
      id="skills"
      ref={sectionRef}
      sx={{
        minHeight: "100vh",
        position: "relative",
        bgcolor: "#ffffff",
        color: "text.primary",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        pt: { xs: 2, md: 3 },
        pb: { xs: 4, md: 6 },
      }}
    >
      <SectionHeader
        title="Skills"
        sectionRef={sectionRef}
        accentColor={theme.palette.primary.main}
      />
      <Box
        sx={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
          mb: 1,
        }}
      >
        <Paper
          elevation={0}
          sx={{
            background: "linear-gradient(135deg, #fafdff 0%, #e8eef6 100%)",
            borderRadius: "32px",
            p: { xs: 4, sm: 8, md: 10 },
            boxShadow: "0 12px 48px 0 rgba(31, 38, 135, 0.16)",
            maxWidth: 1000,
            width: "100%",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
            gap: 0,
            mb: 0,
          }}
        >
          {/* LANGUAGES SECTION */}
          <Box sx={{ width: "100%", mb: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <CodeIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
              <Typography
                variant="h5"
                sx={{ fontWeight: 700, color: theme.palette.primary.main }}
              >
                Languages
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 2,
                justifyContent: "center",
              }}
            >
              {skillCategories[0].skills.map((skill, skillIndex) => (
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
                    background:
                      "linear-gradient(90deg, #fafdff 0%, #e8eef6 100%)",
                    color: "#222",
                    borderRadius: "999px",
                    height: "44px",
                    fontWeight: 500,
                    fontSize: "1.08rem",
                    px: 2.5,
                    boxShadow: "0 2px 12px rgba(31,38,135,0.08)",
                    border: "none",
                    "& .MuiChip-label": { paddingLeft: "8px" },
                    "& .MuiChip-icon": { marginLeft: "10px", color: "inherit" },
                    "&:hover": {
                      background:
                        "linear-gradient(90deg, #e8eef6 0%, #fafdff 100%)",
                      transform: "translateY(-4px) scale(1.06)",
                      boxShadow: "0 8px 24px rgba(31,38,135,0.13)",
                    },
                    transition: "all 0.3s cubic-bezier(.4,0,.2,1)",
                  }}
                />
              ))}
            </Box>
          </Box>
          <Divider sx={{ my: 1, width: "90%", mx: "auto" }} />
          {/* FRAMEWORKS & LIBRARIES SECTION */}
          <Box sx={{ width: "100%", mb: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <StorageIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
              <Typography
                variant="h5"
                sx={{ fontWeight: 700, color: theme.palette.primary.main }}
              >
                Frameworks & Libraries
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 2,
                justifyContent: "center",
              }}
            >
              {skillCategories[1].skills.map((skill, skillIndex) => (
                <Chip
                  key={skillIndex}
                  label={skill.name}
                  icon={
                    skill.name === "Framer Motion" ? (
                      <svg
                        viewBox="0 0 128 128"
                        style={{
                          width: 18,
                          height: 18,
                          display: "block",
                          objectFit: "contain",
                          marginTop: 1,
                        }}
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M22.684 0h84.253v42.667H64.81L22.684 0Zm0 42.667H64.81l42.127 42.666H64.81V128L22.684 85.333V42.667Z"
                          fill="#0055FF"
                        />
                      </svg>
                    ) : (
                      <DeviconWrapper iconClass={skill.iconClass} />
                    )
                  }
                  component={Link}
                  href={getSkillUrl(skill.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  clickable
                  sx={{
                    background:
                      "linear-gradient(90deg, #fafdff 0%, #e8eef6 100%)",
                    color: "#222",
                    borderRadius: "999px",
                    height: "44px",
                    fontWeight: 500,
                    fontSize: "1.08rem",
                    px: 2.5,
                    boxShadow: "0 2px 12px rgba(31,38,135,0.08)",
                    border: "none",
                    "& .MuiChip-label": { paddingLeft: "8px" },
                    "& .MuiChip-icon": { marginLeft: "10px", color: "inherit" },
                    "&:hover": {
                      background:
                        "linear-gradient(90deg, #e8eef6 0%, #fafdff 100%)",
                      transform: "translateY(-4px) scale(1.06)",
                      boxShadow: "0 8px 24px rgba(31,38,135,0.13)",
                    },
                    transition: "all 0.3s cubic-bezier(.4,0,.2,1)",
                  }}
                />
              ))}
            </Box>
          </Box>
          <Divider sx={{ my: 1, width: "90%", mx: "auto" }} />
          {/* TOOLS & PLATFORMS SECTION */}
          <Box sx={{ width: "100%", mb: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <BuildIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
              <Typography
                variant="h5"
                sx={{ fontWeight: 700, color: theme.palette.primary.main }}
              >
                Tools & Platforms
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 2,
                justifyContent: "center",
              }}
            >
              {skillCategories[2].skills.map((skill, skillIndex) => (
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
                    background:
                      "linear-gradient(90deg, #fafdff 0%, #e8eef6 100%)",
                    color: "#222",
                    borderRadius: "999px",
                    height: "44px",
                    fontWeight: 500,
                    fontSize: "1.08rem",
                    px: 2.5,
                    boxShadow: "0 2px 12px rgba(31,38,135,0.08)",
                    border: "none",
                    "& .MuiChip-label": { paddingLeft: "8px" },
                    "& .MuiChip-icon": { marginLeft: "10px", color: "inherit" },
                    "&:hover": {
                      background:
                        "linear-gradient(90deg, #e8eef6 0%, #fafdff 100%)",
                      transform: "translateY(-4px) scale(1.06)",
                      boxShadow: "0 8px 24px rgba(31,38,135,0.13)",
                    },
                    transition: "all 0.3s cubic-bezier(.4,0,.2,1)",
                  }}
                />
              ))}
            </Box>
          </Box>
        </Paper>
      </Box>
      {/* Currently Learning Card */}
      <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
        <Paper
          elevation={0}
          sx={{
            background: "linear-gradient(135deg, #fafdff 0%, #e8eef6 100%)",
            borderRadius: "24px",
            p: { xs: 3, sm: 5 },
            boxShadow: "0 6px 24px 0 rgba(31, 38, 135, 0.10)",
            maxWidth: 700,
            width: "100%",
            mt: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: theme.palette.primary.main,
              mb: 2,
              letterSpacing: 0.5,
            }}
          >
            Currently Learning
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 2,
              justifyContent: "center",
            }}
          >
            {learningSkills.map((skill, skillIndex) => (
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
                  background: "rgba(56, 189, 248, 0.1)",
                  color: "#334155",
                  borderRadius: "999px",
                  height: "38px",
                  fontWeight: 500,
                  fontSize: "1.05rem",
                  px: 2.5,
                  boxShadow: "0 2px 8px rgba(31,38,135,0.06)",
                  border: "none",
                  "& .MuiChip-label": { paddingLeft: "8px" },
                  "& .MuiChip-icon": { marginLeft: "10px", color: "inherit" },
                  "&:hover": {
                    background: "rgba(56, 189, 248, 0.18)",
                    transform: "translateY(-2px) scale(1.04)",
                    boxShadow: "0 6px 16px rgba(31,38,135,0.10)",
                  },
                  transition: "all 0.3s cubic-bezier(.4,0,.2,1)",
                }}
              />
            ))}
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}
