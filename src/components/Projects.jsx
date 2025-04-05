// src/components/Projects.jsx
import { useRef, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Chip,
  Container,
  useTheme,
  CardMedia,
  CardActions,
  Link,
} from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import useIntersectionObserver from "../hooks/useIntersectionObserver";

export default function Projects() {
  const theme = useTheme();
  const [containerRef, isVisible] = useIntersectionObserver({
    threshold: 0.1,
  });

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
        height: "100%", // Change this
        width: "100%", // Add this
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #0f172a 0%, #334155 100%)",
        overflow: "hidden",
        position: "relative",
        minHeight: "250px", // Add explicit minimum height
      }}
    >
      {/* Animated "browser window" */}
      <Box
        sx={{
          position: "absolute",
          width: "80%",
          height: "80%",
          border: "3px solid rgba(56, 189, 248, 0.6)",
          borderRadius: "12px",
          background: "rgba(15, 23, 42, 0.7)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Browser header */}
        <Box
          sx={{
            height: "30px",
            width: "100%",
            background: "rgba(30, 41, 59, 0.8)",
            display: "flex",
            alignItems: "center",
            padding: "0 10px",
          }}
        >
          {/* Browser controls */}
          <Box sx={{ display: "flex", gap: "6px" }}>
            {["#ff5f57", "#febc2e", "#28c840"].map((color, i) => (
              <Box
                key={i}
                sx={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  background: color,
                }}
              />
            ))}
          </Box>

          {/* URL bar */}
          <Box
            sx={{
              flex: 1,
              height: "16px",
              margin: "0 10px",
              background: "rgba(56, 189, 248, 0.2)",
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
              https://taylor-fradella.com
            </Typography>
          </Box>
        </Box>

        {/* Website content */}
        <Box
          sx={{
            flex: 1,
            padding: "15px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Navigation */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: "15px",
              marginBottom: "20px",
            }}
          >
            {["Home", "Skills", "Projects", "About"].map((item, i) => (
              <Box
                key={i}
                sx={{
                  padding: "5px 10px",
                  borderRadius: "4px",
                  background:
                    i === 0 ? "rgba(56, 189, 248, 0.3)" : "transparent",
                  color: "white",
                  fontSize: "10px",
                  fontWeight: "bold",
                  animation: `navPulse 3s infinite ${i * 0.5}s`,
                  "@keyframes navPulse": {
                    "0%, 100%": { opacity: 0.7 },
                    "50%": { opacity: 1, transform: "translateY(-2px)" },
                  },
                }}
              >
                {item}
              </Box>
            ))}
          </Box>

          {/* Hero section */}
          <Box
            sx={{
              textAlign: "center",
              marginBottom: "20px",
            }}
          >
            <Typography
              sx={{
                fontSize: "18px",
                fontWeight: "bold",
                color: "white",
                marginBottom: "8px",
                background: "linear-gradient(90deg, #f8fafc 0%, #7dd3fc 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                animation: "shimmer 2s infinite linear",
                "@keyframes shimmer": {
                  "0%": { backgroundPosition: "-200px 0" },
                  "100%": { backgroundPosition: "200px 0" },
                },
                backgroundSize: "200% 100%",
              }}
            >
              TAYLOR FRADELLA
            </Typography>
            <Box
              sx={{
                height: "6px",
                width: "70%",
                margin: "0 auto",
                background: "rgba(255,255,255,0.2)",
                borderRadius: "3px",
              }}
            />
          </Box>

          {/* Content sections */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {[...Array(3)].map((_, i) => (
              <Box
                key={i}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  animation: `slideInRight 0.5s ease both ${0.3 + i * 0.2}s`,
                  "@keyframes slideInRight": {
                    "0%": { opacity: 0, transform: "translateX(30px)" },
                    "100%": { opacity: 1, transform: "translateX(0)" },
                  },
                }}
              >
                <Box
                  sx={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "8px",
                    background: `rgba(56, 189, 248, ${0.2 + i * 0.1})`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Box
                    sx={{
                      width: "20px",
                      height: "20px",
                      borderRadius: "4px",
                      background: "rgba(255,255,255,0.3)",
                    }}
                  />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Box
                    sx={{
                      height: "8px",
                      width: "60%",
                      background: "rgba(255,255,255,0.3)",
                      borderRadius: "4px",
                      marginBottom: "6px",
                    }}
                  />
                  <Box
                    sx={{
                      height: "6px",
                      width: "80%",
                      background: "rgba(255,255,255,0.2)",
                      borderRadius: "3px",
                    }}
                  />
                </Box>
              </Box>
            ))}
          </Box>

          {/* Animated cursor */}
          <Box
            sx={{
              position: "absolute",
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              background: "white",
              opacity: 0.7,
              boxShadow: "0 0 10px rgba(255,255,255,0.5)",
              animation: "moveCursor 8s infinite",
              "@keyframes moveCursor": {
                "0%": { top: "30%", left: "50%" },
                "20%": { top: "50%", left: "30%" },
                "40%": { top: "60%", left: "60%" },
                "60%": { top: "40%", left: "70%" },
                "80%": { top: "70%", left: "40%" },
                "100%": { top: "30%", left: "50%" },
              },
            }}
          />
        </Box>
      </Box>

      {/* Floating code elements */}
      {[...Array(6)].map((_, i) => (
        <Box
          key={i}
          sx={{
            position: "absolute",
            padding: "4px 8px",
            borderRadius: "4px",
            background: `rgba(${20 + i * 10}, ${30 + i * 20}, ${
              50 + i * 30
            }, 0.4)`,
            color: "rgba(255,255,255,0.7)",
            fontSize: "8px",
            fontFamily: "monospace",
            boxShadow: "0 0 15px rgba(0,0,0,0.2)",
            whiteSpace: "nowrap",
            transform: `rotate(${-10 + i * 5}deg)`,
            top: `${15 + i * 12}%`,
            left: i % 2 === 0 ? "5%" : "75%",
            animation: `float ${3 + i * 0.5}s infinite ease-in-out ${i * 0.5}s`,
            "@keyframes float": {
              "0%, 100%": {
                transform: `rotate(${-10 + i * 5}deg) translateY(0px)`,
              },
              "50%": {
                transform: `rotate(${-10 + i * 5}deg) translateY(-10px)`,
              },
            },
            zIndex: 10,
          }}
        >
          {
            [
              "<div className='component'>",
              "const [state, setState] = useState();",
              "import { useEffect } from 'react';",
              "return <Box sx={{ display: 'flex' }}>",
              "<Typography variant='h1'>",
              "const theme = createTheme();",
            ][i]
          }
        </Box>
      ))}
    </Box>
  );

  // Lions Den Theaters Animation
  const lionsTheaterAnimation = (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #7f1d1d 0%, #b91c1c 100%)", // Red theme
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Golden decorative elements */}
      {[...Array(5)].map((_, i) => (
        <Box
          key={i}
          sx={{
            position: "absolute",
            width: `${10 + i * 5}px`,
            height: `${10 + i * 5}px`,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(234, 179, 8, 0.8) 0%, rgba(234, 179, 8, 0.1) 70%)",
            top: `${15 + i * 15}%`,
            left: `${10 + i * 18}%`,
            filter: "blur(2px)",
            animation: `goldPulse 4s infinite ease-in-out ${i * 0.7}s`,
            "@keyframes goldPulse": {
              "0%, 100%": { opacity: 0.4, transform: "scale(1)" },
              "50%": { opacity: 0.7, transform: "scale(1.3)" },
            },
          }}
        />
      ))}

      {/* Mobile device outline */}
      <Box
        sx={{
          position: "relative",
          width: "45%",
          height: "75%",
          border: "10px solid #222",
          borderRadius: "30px",
          boxShadow: "0 0 20px rgba(0,0,0,0.3)",
          overflow: "hidden",
          animation: "float 4s infinite ease-in-out",
          zIndex: 2,
        }}
      >
        {/* Screen content */}
        <Box
          sx={{
            width: "100%",
            height: "100%",
            background: "#111",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Header with Lion logo */}
          <Box
            sx={{
              height: "15%",
              background: "linear-gradient(90deg, #b91c1c 0%, #991b1b 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Lion silhouette */}
            <Box />

            <Typography
              sx={{
                color: "#fef3c7", // Light gold color
                fontWeight: "bold",
                fontSize: "15px",
                textShadow: "0 1px 3px rgba(0,0,0,0.5)",
                letterSpacing: "1px",
              }}
            >
              LIONS DEN
            </Typography>
          </Box>

          {/* Movie list */}
          <Box sx={{ flex: 1, padding: "10px", overflow: "hidden" }}>
            {[1, 2, 3, 4].map((item) => (
              <Box
                key={item}
                sx={{
                  height: "20%",
                  background: "rgba(23, 23, 23, 0.9)",
                  marginBottom: "8px",
                  borderRadius: "8px",
                  padding: "6px",
                  display: "flex",
                  border: "1px solid rgba(127, 29, 29, 0.3)",
                  animation: `slideIn 1s ease-out ${item * 0.2}s both`,
                  "@keyframes slideIn": {
                    "0%": { transform: "translateX(-20px)", opacity: 0 },
                    "100%": { transform: "translateX(0)", opacity: 1 },
                  },
                }}
              >
                {/* Movie poster */}
                <Box
                  sx={{
                    width: "30%",
                    height: "100%",
                    background: `linear-gradient(45deg, rgba(${
                      100 + item * 20
                    }, ${20 + item * 5}, ${20 + item * 5}, 0.9), rgba(${
                      120 + item * 10
                    }, ${40}, ${30}, 0.8))`,
                    borderRadius: "4px",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  {/* Movie poster pattern */}
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      opacity: 0.4,
                      backgroundImage:
                        "linear-gradient(45deg, transparent 48%, rgba(234, 179, 8, 0.4) 49%, rgba(234, 179, 8, 0.4) 51%, transparent 52%)",
                      backgroundSize: "8px 8px",
                    }}
                  />
                </Box>

                {/* Movie info */}
                <Box
                  sx={{
                    flex: 1,
                    paddingLeft: "8px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <Box>
                    <Box
                      sx={{
                        height: "7px",
                        width: "70%",
                        background: "#fcd34d",
                        borderRadius: "3px",
                        marginBottom: "4px",
                      }}
                    />
                    <Box
                      sx={{
                        height: "5px",
                        width: "40%",
                        background: "rgba(252, 211, 77, 0.5)",
                        borderRadius: "2px",
                      }}
                    />
                  </Box>

                  <Box
                    sx={{
                      height: "20px",
                      width: "80%",
                      display: "flex",
                      gap: "4px",
                    }}
                  >
                    {[1, 2, 3].map((btn) => (
                      <Box
                        key={btn}
                        sx={{
                          flex: 1,
                          background: `rgba(${127 + btn * 10}, ${
                            29 + btn * 5
                          }, ${29 + btn * 5}, 0.6)`,
                          borderRadius: "3px",
                          animation: `pulse 2s infinite ease-in-out ${
                            btn * 0.3
                          }s`,
                          "@keyframes pulse": {
                            "0%, 100%": { opacity: 0.7 },
                            "50%": { opacity: 1, transform: "scale(1.05)" },
                          },
                          border: "1px solid rgba(220, 38, 38, 0.3)",
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* Database icon and connection */}
      <Box
        sx={{
          position: "absolute",
          right: "15%",
          bottom: "18%",
          width: "50px",
          height: "50px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "10px",
          background: "rgba(20, 20, 20, 0.8)",
          boxShadow: "0 0 15px rgba(0,0,0,0.5)",
          border: "1px solid rgba(127, 29, 29, 0.5)",
          zIndex: 3,
        }}
      >
        <i
          className="devicon-microsoftsqlserver-plain colored"
          style={{
            fontSize: "28px",
            color: "#f87171",
            filter: "drop-shadow(0 0 5px rgba(248, 113, 113, 0.7))",
          }}
        />
      </Box>

      {/* React Native and Node.js icons */}
      <Box
        sx={{
          position: "absolute",
          left: "15%",
          top: "18%",
          width: "50px",
          height: "50px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "10px",
          background: "rgba(20, 20, 20, 0.8)",
          boxShadow: "0 0 15px rgba(0,0,0,0.5)",
          border: "1px solid rgba(127, 29, 29, 0.5)",
          zIndex: 3,
        }}
      >
        <i
          className="devicon-react-plain"
          style={{
            fontSize: "28px",
            color: "#38bdf8",
            filter: "drop-shadow(0 0 5px rgba(56, 189, 248, 0.7))",
          }}
        />
      </Box>

      <Box
        sx={{
          position: "absolute",
          left: "26%",
          top: "34%",
          width: "40px",
          height: "40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "8px",
          background: "rgba(20, 20, 20, 0.8)",
          boxShadow: "0 0 15px rgba(0,0,0,0.5)",
          border: "1px solid rgba(127, 29, 29, 0.5)",
          zIndex: 3,
        }}
      >
        <i
          className="devicon-nodejs-plain"
          style={{
            fontSize: "22px",
            color: "#22c55e",
            filter: "drop-shadow(0 0 5px rgba(34, 197, 94, 0.7))",
          }}
        />
      </Box>

      {/* Lion silhouette background */}
      <Box
        sx={{
          position: "absolute",
          width: "100%",
          height: "100%",
          opacity: 0.06,
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512' fill='%23fcd34d'%3E%3Cpath d='M157.1 121.9C99.2 127.2 54.7 148.9 26.2 190c-16.8 24.2-24.1 48.6-23.3 80 .9 29.2 1.7 32.3 27.5 52.5 13.3 10.4 12.8 12-14.5 27.4-40.3 23.7-43.4 52.5-9.3 78.5 19.9 15.9 63.8 32.6 101.1 40.2 3.7 6 43.9 22.3 68.5 28.8 28.7 7.6 85.3 8.9 124.9.2 20.7 3.1 27.9 6.3 42.5 10.8 24.3 7.9 53.5 9.2 63.3-2.1 7.1-8.2 6-20.5 3.3-28.9-3.1-9.9-1.6-10.8 6.6-8.9 9.9 2.3 37-5.7 50.8-18.1 14.5-12.9 21.4-39.8 16.5-68.4 5.3-8.1 14.1-36.3 16.1-52 5-21.7 4.1-60.9-1.8-81.1-7.9-27.1-23.9-54.6-41.5-72.3-16.7-15.3-18.3-19-26.8-19.4-3.8-.2-34.7 1.6-39.5 3.8-17.9 2.5-31.5 7.8-44.6 17.6-17.1 12.6-40.4 40.4-40.4 43.9 0 1.7-3.3 2.8-4-3.6 0-10.1 6.8-36.5 10.8-46.8 3.2-9 1.9-24.4-1.8-31.9-9.6-15.9-35.5-22.4-55-18.2-17.1 3.8-30.1 12.9-57.5 32.2-5.5 3.9-10.7 6.5-13 7.2.1-4.7 1.9-10.8 4.4-16.1 2.5-5.7 4.1-11.4 4.1-14.7 0-12.3-10.6-23.5-25.3-26.8-6.8-1.5-14.1-2.9-16.1-3.1-2.1-.2-8.7-.1-14.9.3z'/%3E%3C/svg%3E")`,
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "75%",
          zIndex: 0,
        }}
      />

      {/* Connection lines */}
      <Box
        sx={{
          position: "absolute",
          width: "20%",
          height: "3px",
          background: "rgba(234, 179, 8, 0.4)",
          right: "30%",
          bottom: "30%",
          transform: "rotate(30deg)",
          zIndex: 1,
          "&::before": {
            content: '""',
            position: "absolute",
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            background: "rgba(234, 179, 8, 0.8)",
            top: "-3px",
            right: 0,
            animation: "pulse 2s infinite",
          },
          "&::after": {
            content: '""',
            position: "absolute",
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            background: "rgba(234, 179, 8, 0.8)",
            top: "-3px",
            left: 0,
            animation: "pulse 2s infinite 0.5s",
          },
        }}
      />

      <Box
        sx={{
          position: "absolute",
          width: "15%",
          height: "3px",
          background: "rgba(234, 179, 8, 0.4)",
          left: "28%",
          top: "40%",
          transform: "rotate(-45deg)",
          zIndex: 1,
          "&::before": {
            content: '""',
            position: "absolute",
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            background: "rgba(234, 179, 8, 0.8)",
            top: "-3px",
            right: 0,
            animation: "pulse 2s infinite 0.3s",
          },
          "&::after": {
            content: '""',
            position: "absolute",
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            background: "rgba(234, 179, 8, 0.8)",
            top: "-3px",
            left: 0,
            animation: "pulse 2s infinite 0.8s",
          },
        }}
      />
    </Box>
  );

  // Blood Sugar Monitor Animation
  const bloodSugarAnimation = (
    <Box
      sx={{
        height: "100%", // Change this
        width: "100%", // Add this
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #0f172a 0%, #1e40af 100%)",
        overflow: "hidden",
        position: "relative",
        minHeight: "250px", // Add explicit minimum height
      }}
    >
      {/* Animated background pattern - circuit-like */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          opacity: 0.06,
          background: `
          linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px),
          linear-gradient(0deg, rgba(255,255,255,.1) 1px, transparent 1px)
        `,
          backgroundSize: "20px 20px",
        }}
      />

      {/* Raspberry Pi board outline */}
      <Box
        sx={{
          position: "absolute",
          width: "35%",
          height: "55%",
          bottom: "8%",
          right: "10%",
          background: "#3e8e41",
          borderRadius: "8px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
          display: "flex",
          flexDirection: "column",
          padding: "10px",
          gap: "5px",
          zIndex: 2,
          transform: "perspective(500px) rotateY(-15deg) rotateX(5deg)",
        }}
      >
        {/* PCB details */}
        {[...Array(8)].map((_, i) => (
          <Box
            key={i}
            sx={{
              height: "6px",
              width: "40%",
              background: "#2b632d",
              borderRadius: "3px",
              marginLeft: i % 2 === 0 ? "5%" : "55%",
              opacity: 0.8,
            }}
          />
        ))}

        {/* Pi CPU */}
        <Box
          sx={{
            position: "absolute",
            width: "40%",
            height: "25%",
            top: "30%",
            left: "30%",
            background: "#333",
            borderRadius: "4px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 8px rgba(0,0,0,0.5)",
          }}
        >
          <i
            className="devicon-raspberrypi-plain"
            style={{
              color: "#c51a4a", // Raspberry Pi logo color
              fontSize: "25px",
              filter: "drop-shadow(0 0 3px rgba(0,0,0,0.3))",
            }}
          />
        </Box>

        {/* GPIO pins */}
        <Box
          sx={{
            position: "absolute",
            width: "80%",
            height: "15%",
            top: "10%",
            left: "10%",
            display: "flex",
            gap: "2px",
          }}
        >
          {[...Array(12)].map((_, i) => (
            <Box
              key={i}
              sx={{
                flex: 1,
                background: "#aaa",
                borderRadius: "1px",
                animation: `blink 5s infinite ${i * 0.3}s`,
                "@keyframes blink": {
                  "0%, 100%": { opacity: 0.5 },
                  "50%": { opacity: 0.9 },
                },
              }}
            />
          ))}
        </Box>

        {/* USB ports */}
        <Box
          sx={{
            position: "absolute",
            bottom: "15%",
            left: "10%",
            width: "80%",
            height: "10%",
            display: "flex",
            gap: "10px",
          }}
        >
          <Box
            sx={{
              flex: 1,
              background: "#222",
              borderRadius: "3px",
            }}
          />
          <Box
            sx={{
              flex: 1,
              background: "#222",
              borderRadius: "3px",
            }}
          />
        </Box>

        {/* Activity LEDs */}
        <Box
          sx={{
            position: "absolute",
            top: "70%",
            right: "20%",
            display: "flex",
            gap: "8px",
          }}
        >
          {["#ff5f57", "#28c840"].map((color, i) => (
            <Box
              key={i}
              sx={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: color,
                boxShadow: `0 0 5px ${color}`,
                animation: `ledBlink ${1 + i * 2}s infinite alternate ${
                  i * 0.5
                }s`,
                "@keyframes ledBlink": {
                  "0%": { opacity: 0.4 },
                  "100%": { opacity: 1 },
                },
              }}
            />
          ))}
        </Box>
      </Box>

      {/* Blood sugar monitor display */}
      <Box
        sx={{
          position: "absolute",
          width: "60%",
          height: "65%",
          top: "8%",
          left: "5%",
          background: "rgba(255, 255, 255, 0.95)",
          borderRadius: "12px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
          overflow: "hidden",
          padding: "15px",
          zIndex: 3,
          display: "flex",
          flexDirection: "column",
          transform: "perspective(500px) rotateY(5deg) rotateX(3deg)",
        }}
      >
        {/* Header with logo */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid #e0e0e0",
            paddingBottom: "10px",
            marginBottom: "15px",
          }}
        >
          <Typography
            sx={{
              fontSize: "16px",
              fontWeight: "bold",
              color: "#333",
            }}
          >
            Glucose Monitor
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <i
              className="devicon-python-plain"
              style={{
                color: "#3776AB",
                fontSize: "18px",
              }}
            />
            <Typography
              sx={{
                fontSize: "12px",
                color: "#666",
              }}
            >
              v2.1
            </Typography>
          </Box>
        </Box>

        {/* Current glucose reading */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: "15px",
          }}
        >
          <Typography
            sx={{
              fontSize: "28px",
              fontWeight: "bold",
              color: "#2563eb",
              textShadow: "0 0 5px rgba(37, 99, 235, 0.2)",
              animation: "pulse 3s infinite",
            }}
          >
            124
          </Typography>
          <Typography
            sx={{
              fontSize: "12px",
              color: "#666",
              marginLeft: "5px",
              marginTop: "8px",
            }}
          >
            mg/dL
          </Typography>
        </Box>

        {/* Blood sugar graph - now with animated drawing effect */}
        <Box
          sx={{
            flex: 1,
            position: "relative",
            borderBottom: "1px solid #ccc",
            borderLeft: "1px solid #ccc",
            marginBottom: "10px",
          }}
        >
          {/* Y-axis labels */}
          {[0, 1, 2, 3].map((i) => (
            <Box
              key={i}
              sx={{
                position: "absolute",
                left: 0,
                bottom: `${i * 25}%`,
                display: "flex",
                alignItems: "center",
              }}
            >
              <Typography
                sx={{
                  fontSize: "9px",
                  color: "#666",
                  transform: "translateX(-5px)",
                }}
              >
                {220 - i * 50}
              </Typography>
              <Box
                sx={{
                  height: "1px",
                  width: "100%",
                  position: "absolute",
                  left: 0,
                  background: "rgba(0,0,0,0.05)",
                }}
              />
            </Box>
          ))}

          {/* X-axis labels */}
          {[0, 1, 2, 3, 4].map((i) => (
            <Typography
              key={i}
              sx={{
                position: "absolute",
                bottom: "-16px",
                left: `${20 * i}%`,
                fontSize: "9px",
                color: "#666",
              }}
            >
              {i * 3}h
            </Typography>
          ))}

          {/* Target range area */}
          <Box
            sx={{
              position: "absolute",
              width: "100%",
              height: "30%",
              bottom: "35%",
              background: "rgba(34, 197, 94, 0.1)",
              border: "1px dashed rgba(34, 197, 94, 0.4)",
            }}
          />

          {/* Animated path drawing effect */}
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
            {/* Define the blood sugar line path */}
            <path
              d="M0,40 C10,50 15,30 25,35 C35,40 40,20 50,30 C60,40 65,60 75,50 C85,40 90,45 100,30"
              fill="none"
              stroke="#3b82f6"
              strokeWidth="2"
              strokeDasharray="200"
              strokeDashoffset="200"
              style={{
                animation: "drawPath 5s linear forwards",
              }}
            />

            {/* Data points along the path */}
            {[0, 25, 50, 75, 100].map((x, i) => {
              // Calculate y points that match the path
              const yPoints = [40, 35, 30, 50, 30];
              return (
                <circle
                  key={i}
                  cx={`${x}%`}
                  cy={`${yPoints[i]}%`}
                  r="2"
                  fill="#3b82f6"
                  opacity="0"
                  style={{
                    animation: `fadeIn 0.3s ease forwards ${1 + i * 0.8}s`,
                  }}
                />
              );
            })}

            {/* Moving point that follows the path */}
            <circle
              cx="0%"
              cy="40%"
              r="3"
              fill="#2563eb"
              style={{
                filter: "drop-shadow(0 0 3px #3b82f6)",
                animation: "moveDot 5s linear forwards",
              }}
            />

            <style>
              {`
              @keyframes drawPath {
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
                0% { cx: 0%; cy: 40%; }
                25% { cx: 25%; cy: 35%; }
                50% { cx: 50%; cy: 30%; }
                75% { cx: 75%; cy: 50%; }
                100% { cx: 100%; cy: 30%; }
              }
            `}
            </style>
          </svg>
        </Box>

        {/* AI assistant interaction section */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              gap: "8px",
            }}
          >
            <Box
              sx={{
                width: "28px",
                height: "28px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: "14px",
                fontWeight: "bold",
              }}
            >
              G
            </Box>
            <Box
              sx={{
                background: "rgba(59, 130, 246, 0.1)",
                borderRadius: "12px 12px 12px 0",
                padding: "8px 12px",
                maxWidth: "80%",
              }}
            >
              <Typography sx={{ fontSize: "11px", color: "#333" }}>
                Your glucose is stable. Consider a protein snack before exercise
                today.
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              alignSelf: "flex-end",
              display: "flex",
              alignItems: "flex-start",
              gap: "8px",
            }}
          >
            <Box
              sx={{
                background: "rgba(59, 130, 246, 0.05)",
                borderRadius: "12px 12px 0 12px",
                padding: "8px 12px",
                maxWidth: "80%",
                border: "1px solid rgba(59, 130, 246, 0.1)",
              }}
            >
              <Typography sx={{ fontSize: "11px", color: "#666" }}>
                What's my average for today?
              </Typography>
            </Box>
            <Box
              sx={{
                width: "28px",
                height: "28px",
                borderRadius: "50%",
                background: "#e5e7eb",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#374151",
                fontSize: "14px",
                fontWeight: "bold",
              }}
            >
              U
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              gap: "8px",
              animation: "slideUp 0.5s forwards 2s",
              opacity: 0,
              transform: "translateY(20px)",
              "@keyframes slideUp": {
                to: {
                  opacity: 1,
                  transform: "translateY(0)",
                },
              },
            }}
          >
            <Box
              sx={{
                width: "28px",
                height: "28px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: "14px",
                fontWeight: "bold",
              }}
            >
              G
            </Box>
            <Box
              sx={{
                background: "rgba(59, 130, 246, 0.1)",
                borderRadius: "12px 12px 12px 0",
                padding: "8px 12px",
                maxWidth: "80%",
              }}
            >
              <Typography sx={{ fontSize: "11px", color: "#333" }}>
                Your average glucose today is 137 mg/dL with a standard
                deviation of 18.
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Data flow animations between Raspberry Pi and monitor */}
      <Box
        sx={{
          position: "absolute",
          height: "3px",
          width: "20%",
          top: "40%",
          left: "40%",
          background: "rgba(37, 99, 235, 0.2)",
          zIndex: 1,
        }}
      >
        {[...Array(4)].map((_, i) => (
          <Box
            key={i}
            sx={{
              position: "absolute",
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: "#3b82f6",
              top: "-3px",
              boxShadow: "0 0 8px rgba(59, 130, 246, 0.8)",
              animation: `flowData 3s infinite linear ${i * 0.7}s`,
              "@keyframes flowData": {
                "0%": { left: "0%", opacity: 0 },
                "10%": { opacity: 1 },
                "90%": { opacity: 1 },
                "100%": { left: "100%", opacity: 0 },
              },
            }}
          />
        ))}
      </Box>

      {/* Dexcom and AI graphics */}
      <Box
        sx={{
          position: "absolute",
          bottom: "12%",
          left: "40%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          zIndex: 4,
        }}
      >
        <Box
          sx={{
            padding: "8px 12px",
            borderRadius: "8px",
            background: "rgba(255, 255, 255, 0.95)",
            display: "flex",
            alignItems: "center",
            boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
            marginBottom: "15px",
          }}
        >
          <Typography
            sx={{
              fontSize: "12px",
              fontWeight: "bold",
              color: "#0ea5e9",
            }}
          >
            DEXCOM API
          </Typography>
          <Box
            sx={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: "#22c55e",
              marginLeft: "6px",
              animation: "pulse 2s infinite",
            }}
          />
        </Box>

        <Box
          sx={{
            display: "flex",
            gap: "10px",
          }}
        >
          <Box
            sx={{
              width: "40px",
              height: "40px",
              borderRadius: "8px",
              background: "rgba(30, 64, 175, 0.9)",
              boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              animation: "pulse 3s infinite 1s",
              position: "relative",
            }}
          >
            <Typography
              sx={{
                fontSize: "20px",
                fontWeight: "bold",
                color: "white",
              }}
            >
              G
            </Typography>
            <Typography
              sx={{
                position: "absolute",
                bottom: "-14px",
                fontSize: "8px",
                color: "white",
                opacity: 0.9,
                textShadow: "0 1px 3px rgba(0,0,0,0.5)",
              }}
            >
              GROK
            </Typography>
          </Box>

          <Box
            sx={{
              width: "40px",
              height: "40px",
              borderRadius: "8px",
              background: "rgba(20, 184, 166, 0.9)",
              boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              animation: "pulse 3s infinite 2s",
              position: "relative",
            }}
          >
            <i
              className="devicon-python-plain"
              style={{
                color: "white",
                fontSize: "22px",
              }}
            />
            <Typography
              sx={{
                position: "absolute",
                bottom: "-14px",
                fontSize: "8px",
                color: "white",
                opacity: 0.9,
                textShadow: "0 1px 3px rgba(0,0,0,0.5)",
              }}
            >
              PYTHON
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Technical floating elements */}
      {[...Array(5)].map((_, i) => (
        <Box
          key={i}
          sx={{
            position: "absolute",
            padding: "5px 8px",
            borderRadius: "4px",
            background: `rgba(${10 + i * 10}, ${20 + i * 10}, ${
              50 + i * 20
            }, 0.8)`,
            color: "rgba(255,255,255,0.9)",
            fontSize: "8px",
            fontFamily: "monospace",
            boxShadow: "0 0 10px rgba(0,0,0,0.2)",
            whiteSpace: "nowrap",
            transform: `rotate(${-5 + i * 3}deg)`,
            top: `${10 + i * 16}%`,
            left: i % 2 === 0 ? "5%" : "70%",
            animation: `float ${2 + i * 0.3}s infinite ease-in-out ${i * 0.4}s`,
            opacity: 0.7,
            zIndex: 0,
          }}
        >
          {
            [
              "response = dexcom_api.get_readings()",
              "ml_model.predict(glucose_data)",
              "import tensorflow as tf",
              "grok.generate_response(query)",
              "plt.plot(time, glucose_values)",
            ][i]
          }
        </Box>
      ))}
    </Box>
  );

  // Projects array with animations
  const projects = [
    {
      id: 1,
      title: "Personal Portfolio",
      description:
        "A modern, responsive personal portfolio website built with React and Material UI. Features animated backgrounds, smooth scrolling, and interactive elements to showcase my skills and projects.",
      technologies: ["React", "Material UI", "CSS", "Responsive Design"],
      github: "https://github.com/taylfrad/taylorfradella.com",
      animation: portfolioAnimation,
    },
    {
      id: 2,
      title: "Lions Den Theaters",
      description:
        "A comprehensive theater management application built with React Native and Expo. Features include ticket booking, seat selection, movie information, and admin dashboard. Backend powered by Node.js with SQL database integration for data management.",
      technologies: ["SQL", "React Native", "Expo", "Node.js"],
      github:
        "https://github.com/Southeastern-Louisiana-University/cmps383-2025-sp-p03-g06",
      animation: lionsTheaterAnimation,
    },
    {
      id: 3,
      title: "Blood Sugar Monitor with AI",
      description:
        "A Raspberry Pi-powered blood sugar monitoring system that integrates with the Dexcom API to track and display glucose levels. Utilizes Python for backend processing and data visualization. Features AI-driven suggestions for meals and provides glucose level information through natural language queries using Grok.",
      technologies: ["Python", "Raspberry Pi", "Dexcom API", "Grok"],
      github: "https://github.com/taylfrad/blood-sugar-monitor",
      animation: bloodSugarAnimation,
    },
  ];

  // Create separate refs for each project to observe individually
  const projectRefs = useRef(projects.map(() => useRef(null)));
  const projectVisibility = projects.map((_, index) => {
    const [ref, isVisible] = useIntersectionObserver({
      threshold: 0.2,
      rootMargin: "0px 0px -100px 0px", // Trigger earlier for better animation
    });
    projectRefs.current[index] = ref;
    return isVisible;
  });

  return (
    <Box
      id="projects"
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        py: 10,
        position: "relative",
        width: "100%",
        bgcolor: "#ffffff", // White background
      }}
    >
      <Container maxWidth="lg" sx={{ textAlign: "center" }}>
        <Box
          ref={containerRef}
          sx={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(40px)",
            transition: "opacity 0.8s ease, transform 0.8s ease",
            width: "100%",
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
              Projects
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "#334155", // Darker text for white background
                maxWidth: "650px",
                mx: "auto", // Center the paragraph
                mt: 4,
                fontSize: "1.1rem",
              }}
            >
              Here are some of my recent projects that showcase my technical
              skills and problem-solving abilities.
            </Typography>
          </Box>

          {/* Stacked project cards that slide in from alternating sides */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "100%",
              gap: 6,
            }}
          >
            {projects.map((project, index) => (
              <Box
                key={project.id}
                ref={projectRefs.current[index]}
                sx={{
                  opacity: projectVisibility[index] ? 1 : 0,
                  transform: projectVisibility[index]
                    ? "translateX(0)"
                    : index % 2 === 0
                    ? "translateX(-100px)"
                    : "translateX(100px)",
                  transition: "all 0.8s ease",
                  maxWidth: "900px",
                  width: "100%",
                }}
              >
                <Card
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                    borderRadius: "16px",
                    bgcolor: "#ffffff",
                    border: "1px solid rgba(0, 0, 0, 0.08)",
                    transition: "all 0.4s ease",
                    overflow: "hidden",
                    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
                    minHeight: { md: "350px" }, // Ensure sufficient height on medium screens and up
                    "&:hover": {
                      transform: "translateY(-12px)",
                      boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)",
                      "& .project-animation": {
                        filter: "brightness(1.1)",
                      },
                    },
                  }}
                >
                  {/* Project animation */}
                  <Box
                    sx={{
                      width: { xs: "100%", md: "40%" },
                      position: "relative",
                      // Reverse the order for odd-indexed projects on desktop
                      order: { xs: 0, md: index % 2 === 0 ? 0 : 1 },
                      height: { xs: "220px", md: "100%" },
                    }}
                    className="project-animation"
                  >
                    {project.animation}
                  </Box>

                  {/* Project content */}
                  <Box
                    sx={{
                      width: { xs: "100%", md: "60%" },
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      // Reverse the order for odd-indexed projects on desktop
                      order: { xs: 1, md: index % 2 === 0 ? 1 : 0 },
                      textAlign: "left", // Align text to the left
                    }}
                  >
                    <CardContent sx={{ p: 4 }}>
                      <Typography
                        variant="h4"
                        component="h3"
                        gutterBottom
                        sx={{
                          fontWeight: 600,
                          mb: 2,
                          color: "#0f172a", // Dark text for white background
                        }}
                      >
                        {project.title}
                      </Typography>

                      <Typography
                        variant="body1"
                        sx={{
                          mb: 3,
                          fontSize: "1rem",
                          lineHeight: 1.6,
                          color: "#334155", // Darker text for white background
                        }}
                      >
                        {project.description}
                      </Typography>

                      <Box
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 1,
                          mt: 3,
                        }}
                      >
                        {project.technologies.map((tech, techIndex) => (
                          <Chip
                            key={techIndex}
                            label={tech}
                            icon={
                              <DeviconWrapper
                                iconClass={getTechIconClass(tech)}
                              />
                            }
                            component={Link}
                            href={getTechUrl(tech)}
                            target="_blank"
                            rel="noopener noreferrer"
                            clickable
                            sx={{
                              bgcolor: "rgba(56, 189, 248, 0.1)",
                              color: "#334155", // Dark text for white background
                              borderRadius: "6px",
                              mb: 1,
                              height: "32px",
                              "& .MuiChip-label": {
                                paddingLeft: "6px",
                              },
                              transition: "all 0.3s ease",
                              "&:hover": {
                                bgcolor: "rgba(56, 189, 248, 0.2)",
                                transform: "translateY(-2px)",
                                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                              },
                            }}
                          />
                        ))}
                      </Box>
                    </CardContent>

                    <CardActions sx={{ p: 3, pt: 0 }}>
                      <Button
                        component={Link}
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        variant="outlined"
                        color="primary"
                        startIcon={<GitHubIcon />}
                        sx={{
                          borderRadius: "8px",
                          textTransform: "none",
                          "&:hover": {
                            boxShadow: "0 0 10px rgba(56, 189, 248, 0.3)",
                            transform: "translateY(-2px)",
                          },
                        }}
                      >
                        View Code
                      </Button>
                    </CardActions>
                  </Box>
                </Card>
              </Box>
            ))}
          </Box>

          {/* GitHub projects link button */}
          <Box sx={{ textAlign: "center", mt: 6 }}>
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
        </Box>
      </Container>
    </Box>
  );
}
