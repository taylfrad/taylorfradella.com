// This file contains the extended project data including timeline, tools, and detailed information
// Animations are handled separately in Projects.jsx and merged at runtime
import { ACCENT_DEFAULT, ACCENT_WORKLY } from "@/constants";

export const projectsData = [
  {
    id: 1,
    image: null, // TODO: add public/images/portfolio.png
    role: "UI ENGINEER · PERSONAL",
    title: "Personal Portfolio Website",
    accentColor: ACCENT_DEFAULT,
    // Deep blue → teal cyan: cool, calm, "interface" energy
    gradientColors: [ACCENT_DEFAULT, "#0EA5E9"],
    tags: ["React", "Framer Motion", "Three.js"],
    description:
      "A modern portfolio featuring liquid glass UI surfaces, a physics-driven lanyard hero, and responsive motion tuned for desktop and mobile.",
    extendedDescription:
      "This portfolio is an end-to-end design focused on visual polish, motion quality, and responsive usability. It uses a custom liquid glass visual system for project surfaces and overlays, with graceful fallbacks so content remains clear and readable across devices. The hero is powered by a physics-driven lanyard built with Three.js, React Three Fiber, and Rapier, including a subtle top-left swing-in on load, drag interaction, and tuned mobile positioning to keep navigation unobstructed. On small screens, the header switches to a hamburger menu for cleaner interaction density, while desktop keeps direct access to primary routes. Motion is implemented with Framer Motion and paired with reduced-effects support so the experience can remain smooth without feeling overwhelming. The app is route-based, performance-minded, and optimized for real-world use with lazy loading, viewport-aware rendering, and accessible semantic structure.",
    status: "Live",
    github: "https://github.com/taylfrad/taylorfradella.com",
    liveUrl: "https://taylorfradella.com",
    tools: [
      "React",
      "Framer Motion",
      "Three.js",
      "React Three Fiber",
      "Rapier Physics",
      "Tailwind CSS",
      "Vite",
      "React Router",
      "React Intersection Observer",
      "Radix UI",
      "JavaScript",
      "ESLint",
    ],
    timeline: [
      {
        phase: "Foundation & Design System",
        date: "Initial phase",
        description:
          "Defined the visual direction, component architecture, and core technology stack for a scalable portfolio foundation.",
      },
      {
        phase: "Core Build",
        date: "Early build",
        description:
          "Built primary pages, reusable UI components, responsive layouts, and initial motion interactions.",
      },
      {
        phase: "Performance & UX Refinement",
        date: "Post-launch improvements",
        description:
          "Optimized animation behavior, improved readability, refined interactions, and tuned cross-device performance.",
      },
      {
        phase: "Launch & Maintenance",
        date: "Live",
        description:
          "Deployed to production with continuous monitoring and regular quality updates.",
      },
      {
        phase: "Ongoing Development",
        date: "Current",
        description:
          "Actively updated with new project content, visual polish, accessibility improvements, and incremental feature enhancements.",
      },
    ],
    keyFeatures: [
      "Fully responsive design with mobile-first approach",
      "Liquid glass UI surfaces with graceful visual fallback behavior",
      "Subtle physics-based lanyard intro with drag interaction",
      "Mobile hero refinements with hamburger menu and lowered lanyard placement",
      "Smooth scroll animations and transitions using Framer Motion",
      "Project showcase with interactive hover effects",
      "React Router for seamless navigation",
      "Optimized performance with Vite build tool",
      "Accessible navigation with semantic HTML and keyboard support",
    ],
    // ── Scrollytelling data ──────────────────────────────────────────────
    statement: {
      before: "Built from the ground up for",
      highlights: ["visual polish", "motion quality", "responsive usability"],
    },
    spotlights: [
      {
        title: "Liquid Glass",
        text: "A custom visual system for surfaces and overlays with graceful fallbacks across every device.",
      },
      {
        title: "Physics Lanyard",
        text: "Three.js-powered hero with drag interaction, swing-in animation, and tuned mobile positioning.",
      },
      {
        title: "Motion Design",
        text: "Framer Motion animations paired with reduced-effects support for smooth, accessible experiences.",
      },
    ],
    primaryTool: {
      name: "React",
      label: "Primary Framework",
      description:
        "Component-based UI with hooks, context, and the full React ecosystem powering every interaction.",
    },
    toolsDetailed: [
      { name: "Framer Motion", category: "Animation" },
      { name: "Three.js", category: "3D Graphics" },
      { name: "React Three Fiber", category: "React 3D" },
      { name: "Rapier Physics", category: "Physics Engine" },
      { name: "Tailwind CSS", category: "Styling" },
      { name: "Vite", category: "Build Tool" },
      { name: "React Router", category: "Navigation" },
      { name: "Intersection Observer", category: "Scroll API" },
      { name: "Radix UI", category: "Primitives" },
      { name: "JavaScript", category: "Language" },
      { name: "ESLint", category: "Linting" },
    ],
  },
  {
    id: 2,
    image: null, // TODO: add public/images/lionsden.png
    role: "FULL-STACK DEVELOPER",
    title: "Lions Den Cinemas",
    accentColor: "#c20000",
    // Cinema red → deep wine: theatrical, low-light, premiere feel
    gradientColors: ["#c20000", "#4A0E0E"],
    tags: ["React Native", "Node.js", "SQL", "GitHub"],
    description:
      "A full-stack cinema management system with a mobile app and website for browsing showtimes, purchasing tickets, and an admin panel for staff operations.",
    extendedDescription:
      "Lions Den Cinemas connects customers with cinema services through a React Native mobile app, responsive website, and admin dashboard — all powered by a shared Node.js backend. Customers browse showtimes, purchase tickets and concessions, and manage accounts across platforms. The admin panel lets staff update listings, pricing, and inventory in real time. The backend uses Express with JWT authentication, PostgreSQL for data storage, and RESTful APIs that keep every platform in sync.",
    status: "Completed",
    github:
      "https://github.com/Southeastern-Louisiana-University/cmps383-2025-sp-p03-g06",
    tools: [
      "React Native",
      "Node.js",
      "Express",
      "PostgreSQL",
      "RESTful API",
      "JavaScript",
    ],
    timeline: [
      {
        phase: "Requirements & Planning",
        date: "Week 1-2",
        description:
          "Gathering requirements, database schema design, and API endpoint planning.",
      },
      {
        phase: "Backend Development",
        date: "Week 3-5",
        description:
          "Building RESTful APIs, database implementation, authentication system, and admin panel backend.",
      },
      {
        phase: "Frontend Development",
        date: "Week 6-8",
        description:
          "Mobile app development with React Native, website creation, and admin dashboard UI.",
      },
      {
        phase: "Integration & Testing",
        date: "Week 9-10",
        description:
          "Connecting frontend and backend, comprehensive testing, bug fixes, and performance optimization.",
      },
      {
        phase: "Deployment",
        date: "Week 11-12",
        description:
          "Final deployment, documentation, and handoff to the client.",
      },
    ],
    keyFeatures: [
      "Cross-platform mobile app (iOS & Android) built with React Native",
      "Guest checkout and authenticated user account system",
      "Real-time movie showtime and inventory management",
      "Secure ticket and concession purchasing with payment processing",
      "Comprehensive admin dashboard for cinema staff operations",
      "RESTful API backend with PostgreSQL database",
      "Responsive web interface for desktop users",
      "JWT-based authentication and session management",
    ],
    statement: {
      before: "A complete cinema platform connecting",
      highlights: ["mobile customers", "web users", "staff operations"],
    },
    spotlights: [
      { title: "Multi-Platform", text: "React Native mobile app, responsive website, and admin dashboard — all sharing one backend." },
      { title: "Real-Time Sync", text: "Showtimes, inventory, and ticket availability update instantly across every platform." },
      { title: "Secure Commerce", text: "JWT authentication, guest checkout, and payment processing with full data consistency." },
    ],
    primaryTool: { name: "React Native", label: "Mobile Framework", description: "Cross-platform mobile development delivering native iOS and Android experiences from a single codebase." },
    toolsDetailed: [
      { name: "React Native", category: "Mobile" },
      { name: "Node.js", category: "Runtime" },
      { name: "Express", category: "API Framework" },
      { name: "PostgreSQL", category: "Database" },
      { name: "RESTful API", category: "Architecture" },
      { name: "JavaScript", category: "Language" },
    ],
  },
  {
    id: 3,
    image: null, // TODO: add public/images/bloodsugar.png
    role: "IOT & AI DEVELOPER",
    title: "SweetSpot",
    accentColor: "#22c55e",
    // Green → teal: health/medical, calming
    gradientColors: ["#22c55e", "#0E7490"],
    tags: ["Python", "Raspberry Pi", "Dexcom API", "AI"],
    description:
      "A Raspberry Pi-powered glucose monitoring system that tracks blood sugar levels and provides AI-driven health insights using the Dexcom API and Grok AI.",
    extendedDescription:
      "SweetSpot connects a Raspberry Pi to the Dexcom API for continuous glucose monitoring, processing real-time data with Python to identify patterns and trends. Grok AI analyzes glucose history, meal timing, and exercise habits to generate personalized health insights and predictive alerts. The dashboard displays live readings, interactive trend graphs, and AI recommendations in a clean interface designed for quick, actionable health decisions.",
    status: "Completed",
    youtube:
      "https://www.youtube.com/watch?v=64Pnq-MybS8&list=PLk22IJ-X9itqH1UIuWYtNs3cfTwHqOIvM&index=14",
    tools: [
      "Python",
      "Raspberry Pi",
      "Dexcom API",
      "Grok AI",
      "Python Libraries",
    ],
    timeline: [
      {
        phase: "Research & Setup",
        date: "Week 1",
        description:
          "Researching Dexcom API, setting up Raspberry Pi, and configuring development environment.",
      },
      {
        phase: "API Integration",
        date: "Week 2-3",
        description:
          "Integrating Dexcom API for glucose data retrieval and implementing data processing pipeline.",
      },
      {
        phase: "AI Integration",
        date: "Week 4-5",
        description:
          "Integrating Grok AI for health insights, implementing recommendation engine, and data analysis.",
      },
      {
        phase: "Visualization & UI",
        date: "Week 6-7",
        description:
          "Creating data visualization dashboards, building user interface, and real-time display updates.",
      },
      {
        phase: "Testing & Refinement",
        date: "Week 8",
        description:
          "Comprehensive testing, accuracy validation, and system optimization.",
      },
    ],
    keyFeatures: [
      "Real-time glucose level monitoring with SweetSpot interface",
      "AI-powered health insights and personalized recommendations using Grok AI",
      "Interactive data visualization dashboard with grey and bright green design",
      "Raspberry Pi hardware integration for continuous monitoring",
      "Automated data collection and processing from Dexcom API",
      "Historical trend analysis and predictive glucose readings",
      "Python-based data processing and visualization",
    ],
    statement: {
      before: "Bridging hardware and AI for",
      highlights: ["real-time monitoring", "predictive insights", "health outcomes"],
    },
    spotlights: [
      { title: "Hardware Integration", text: "Raspberry Pi processing unit connected to Dexcom CGM for continuous glucose data capture." },
      { title: "AI Insights", text: "Grok AI analyzes glucose patterns and generates personalized health recommendations." },
      { title: "Live Dashboard", text: "Interactive trend graphs, real-time readings, and predictive alerts in one clear interface." },
    ],
    primaryTool: { name: "Python", label: "Core Language", description: "Data processing pipeline, API integration, AI orchestration, and visualization — all in Python." },
    toolsDetailed: [
      { name: "Python", category: "Language" },
      { name: "Raspberry Pi", category: "Hardware" },
      { name: "Dexcom API", category: "Data Source" },
      { name: "Grok AI", category: "Intelligence" },
      { name: "Python Libraries", category: "Visualization" },
    ],
  },
  {
    id: 4,
    image: "/images/workly/workly1.png",
    role: "MOBILE APP DEVELOPER",
    title: "Workly",
    accentColor: ACCENT_WORKLY,
    // Deep red → coral orange: swipe-app warmth, energy
    gradientColors: [ACCENT_WORKLY, "#EA580C"],
    tags: ["Flutter", "Dart", "Firebase", "Mobile", "GitHub"],
    description:
      "A mobile job search app with a Tinder-like swipe interface, AI-powered matching, and cover letter generation built with Flutter and Firebase.",
    extendedDescription:
      "Workly turns job searching into a swipe-based experience built with Flutter for iOS, Android, and web. Swipe right on positions that interest you, left to pass — fast, engaging, and enjoyable. AI-powered matching scores each opportunity against your qualifications and preferences. The cover letter generator creates tailored applications in seconds. Firebase handles real-time sync, authentication, and serverless processing across all devices.",
    status: "Completed",
    github: "https://github.com/maheessh/workly",
    userManual: "/docs/workly-user-manual.pdf",
    screenshots: [
      "/images/workly/workly1.png",
      "/images/workly/workly2.png",
      "/images/workly/workly3.png",
      "/images/workly/workly4.png",
      "/images/workly/workly5.png",
    ],
    tools: [
      "Flutter",
      "Dart",
      "Firebase",
      "Firestore",
      "Firebase Authentication",
      "Firebase Cloud Functions",
      "Provider",
    ],
    timeline: [
      {
        phase: "Concept & Design",
        date: "Week 1-2",
        description:
          "UI/UX design, user flow mapping, and feature specification for the swipe-based interface.",
      },
      {
        phase: "Backend Setup",
        date: "Week 3-4",
        description:
          "Firebase project setup, database schema design, authentication implementation, and cloud functions.",
      },
      {
        phase: "Core Development",
        date: "Week 5-8",
        description:
          "Building swipe interface, job listing system, user profiles, and matching algorithm.",
      },
      {
        phase: "Testing & Deployment",
        date: "Week 9-10",
        description:
          "Cross-platform testing, bug fixes, app store preparation, and deployment.",
      },
    ],
    keyFeatures: [
      "Tinder-like swipe interface for intuitive job browsing",
      "AI-powered job matching algorithm with scoring system",
      "AI cover letter generator for personalized applications",
      "Real-time job matching score based on qualifications",
      "User profile creation and management with preferences",
      "Cross-platform support (iOS, Android, Web) with Flutter",
      "Firebase backend with Firestore for real-time data sync",
      "Smooth animations and transitions for enhanced UX",
    ],
    statement: {
      before: "Reimagining job search with",
      highlights: ["gamified interaction", "AI matching", "instant applications"],
    },
    spotlights: [
      { title: "Swipe Interface", text: "Tinder-like card swiping makes browsing jobs fast, engaging, and enjoyable." },
      { title: "AI Matching", text: "Intelligent scoring analyzes qualifications and preferences to surface the best-fit positions." },
      { title: "Cover Letters", text: "AI-generated cover letters tailored to each posting — personalized in seconds." },
    ],
    primaryTool: { name: "Flutter", label: "App Framework", description: "True cross-platform development delivering native iOS, Android, and web experiences from one Dart codebase." },
    toolsDetailed: [
      { name: "Flutter", category: "Framework" },
      { name: "Dart", category: "Language" },
      { name: "Firebase", category: "Backend" },
      { name: "Firestore", category: "Database" },
      { name: "Firebase Auth", category: "Identity" },
      { name: "Cloud Functions", category: "Serverless" },
      { name: "Provider", category: "State" },
    ],
  },
  {
    id: 5,
    image: null,
    role: "HOMELAB ENGINEER · PERSONAL",
    title: "TaylCraft",
    accentColor: "#43A047",
    // Minecraft grass green → dirt brown: literal block-world palette
    gradientColors: ["#43A047", "#5D4037"],
    tags: ["HTML/JS", "Node.js", "nginx", "Caddy"],
    description:
      "A self-hosted Minecraft Java server with a custom landing page showing live player status, whitelist requests via Discord webhooks, and a Dynmap world viewer.",
    extendedDescription:
      "TaylCraft is a self-hosted Minecraft Java server running on the homelab, paired with a custom landing page that surfaces live server state, accepts whitelist requests, and embeds a Dynmap world viewer. The landing page polls the Minecraft server for online player count, MOTD, and version, displaying them in a styled status panel. Whitelist requests are submitted through a small form that posts to a Discord webhook for moderator review. The deployment uses nginx and Caddy as reverse proxies in front of the Minecraft server and a small Node.js status API, and is run as a long-lived service alongside other homelab containers.",
    status: "Live",
    liveUrl: "https://taylcraft.com",
    tools: ["HTML", "JavaScript", "Node.js", "nginx", "Caddy", "Discord Webhooks"],
    timeline: [],
    keyFeatures: [
      "Live player count, MOTD, and version surfaced on the landing page",
      "Whitelist request form routed to Discord for moderator approval",
      "Embedded Dynmap world viewer for live world exploration",
      "Self-hosted on homelab hardware with reverse-proxied access",
    ],
    statement: {
      before: "A self-hosted server with",
      highlights: ["live status", "community tools", "world exploration"],
    },
    spotlights: [
      { title: "Live Status", text: "Landing page polls the server for player count, MOTD, and version in real time." },
      { title: "Discord Integration", text: "Whitelist requests submit via webhook for moderator review — no manual server access needed." },
      { title: "World Viewer", text: "Embedded Dynmap lets visitors explore the live world from the browser." },
    ],
    primaryTool: { name: "Node.js", label: "Status API", description: "Lightweight Node service polling the Minecraft server and serving live status data to the landing page." },
    toolsDetailed: [
      { name: "HTML", category: "Markup" },
      { name: "JavaScript", category: "Language" },
      { name: "Node.js", category: "Runtime" },
      { name: "nginx", category: "Proxy" },
      { name: "Caddy", category: "Proxy" },
      { name: "Discord Webhooks", category: "Integration" },
    ],
  },
  {
    id: 6,
    image: null,
    role: "FULL-STACK ENGINEER · PERSONAL",
    title: "Fradella.dev",
    accentColor: "#7C3AED",
    // Purple → cyan: dashboard/tech, dark-mode console vibe
    gradientColors: ["#7C3AED", "#0891B2"],
    tags: ["React", "TypeScript", "Vite", "Fastify"],
    description:
      "A full-stack homelab dashboard with live CPU/RAM/temp monitoring, Pi-hole stats, Tailscale peers, and deep panels for Coolify, Immich, and more.",
    extendedDescription:
      "Fradella.dev is a full-stack operations dashboard for the homelab, built with React, TypeScript, and Vite on the frontend and a Fastify Node service on the backend. It surfaces live CPU, RAM, and temperature monitoring, Pi-hole DNS stats, Tailscale peer status, and deeper panels for services like Coolify and Immich. The frontend and backend are co-located in a single container that both serves the built SPA and exposes an internal JSON API. The design favors a dark, information-dense layout with Outfit and JetBrains Mono typography, oriented around quick at-a-glance reads of the homelab's health.",
    status: "Live",
    tools: ["React", "TypeScript", "Vite", "Fastify", "Node.js"],
    timeline: [],
    keyFeatures: [
      "Live CPU, RAM, and temperature monitoring",
      "Pi-hole stats and Tailscale peer status surfaced together",
      "Deep panels for Coolify, Immich, and other homelab services",
      "Single-container deployment serving SPA + internal JSON API",
    ],
    statement: {
      before: "One dashboard for",
      highlights: ["system health", "network status", "service management"],
    },
    spotlights: [
      { title: "Live Metrics", text: "CPU, RAM, and temperature readings streamed in real time from the homelab." },
      { title: "Network View", text: "Pi-hole DNS stats and Tailscale peer status in one unified panel." },
      { title: "Service Panels", text: "Deep-dive views for Coolify, Immich, and other self-hosted services." },
    ],
    primaryTool: { name: "React", label: "Frontend", description: "TypeScript React SPA with Vite, delivering an information-dense dark dashboard with real-time data." },
    toolsDetailed: [
      { name: "React", category: "Framework" },
      { name: "TypeScript", category: "Language" },
      { name: "Vite", category: "Build Tool" },
      { name: "Fastify", category: "API Server" },
      { name: "Node.js", category: "Runtime" },
    ],
  },
  {
    id: 7,
    image: null,
    role: "FRONTEND DEVELOPER · SENIOR CAPSTONE",
    title: "FieldFlow",
    accentColor: "#F97066",
    // Coral → violet: matches the brand gradient used on the Work page
    gradientColors: ["#F97066", "#A855F7"],
    tags: ["Next.js", "React", "TypeScript", "Tailwind"],
    description:
      "An offline-first field service PWA with an AI voice pipeline using Whisper + GPT-4o-mini, built as a senior capstone.",
    extendedDescription:
      "FieldFlow is a senior capstone project: an offline-first progressive web app for field service technicians. It uses wa-sqlite for client-side storage so technicians can capture jobs, notes, and forms without network access, and syncs back when connectivity returns. An AI voice pipeline (Whisper transcription plus GPT-4o-mini structuring) lets technicians dictate visit notes that are parsed into structured form fields. The frontend is built with Next.js, React, TypeScript, and Tailwind, on top of a custom design system tuned for field conditions and one-handed use.",
    status: "Completed",
    tools: ["Next.js", "React", "TypeScript", "Tailwind", "wa-sqlite", "OpenAI Whisper", "GPT-4o-mini"],
    timeline: [],
    keyFeatures: [
      "Offline-first with wa-sqlite client storage and background sync",
      "AI voice pipeline: Whisper transcription + GPT-4o-mini structuring",
      "Custom design system tuned for field conditions",
      "Progressive web app installable on any device",
    ],
    statement: {
      before: "Field service reimagined with",
      highlights: ["offline-first storage", "voice AI", "one-handed design"],
    },
    spotlights: [
      { title: "Offline-First", text: "wa-sqlite client storage captures jobs and forms without network — syncs when connectivity returns." },
      { title: "Voice Pipeline", text: "Whisper transcribes dictated notes, GPT-4o-mini structures them into form fields automatically." },
      { title: "Field-Ready", text: "Custom design system tuned for outdoor conditions, gloves, and one-handed use." },
    ],
    primaryTool: { name: "Next.js", label: "App Framework", description: "React meta-framework powering the PWA with server-side rendering, API routes, and optimized builds." },
    toolsDetailed: [
      { name: "Next.js", category: "Framework" },
      { name: "React", category: "UI Library" },
      { name: "TypeScript", category: "Language" },
      { name: "Tailwind", category: "Styling" },
      { name: "wa-sqlite", category: "Client DB" },
      { name: "OpenAI Whisper", category: "Speech AI" },
      { name: "GPT-4o-mini", category: "Language AI" },
    ],
  },
];
