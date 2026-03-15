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
  },
  {
    id: 2,
    image: null, // TODO: add public/images/lionsden.png
    role: "FULL-STACK DEVELOPER",
    title: "Lions Den Cinemas Website and Mobile App",
    accentColor: "#c20000",
    tags: ["React Native", "Node.js", "SQL", "GitHub"],
    description:
      "A full-stack cinema management system with a mobile app and website for browsing showtimes, purchasing tickets, and an admin panel for staff operations.",
    extendedDescription:
      "Lions Den Cinemas represents a comprehensive full-stack solution that seamlessly connects customers with cinema services through multiple platforms. The project encompasses a cross-platform mobile application built with React Native, a responsive web interface, and a powerful administrative dashboard. Customers can browse current and upcoming movie showtimes, view detailed film information, and purchase tickets and concessions either as guests or through authenticated accounts. The mobile app provides a native experience on both iOS and Android devices, with smooth navigation and intuitive user flows. The web interface ensures desktop users have full access to all features, while the admin panel empowers cinema staff to manage movie listings, update showtimes, adjust ticket pricing, and monitor inventory in real-time. The backend architecture, built with Node.js and Express, provides RESTful APIs that handle user authentication via JWT tokens, secure payment processing, and real-time inventory management. The PostgreSQL database stores all cinema data, including user accounts, movie information, showtimes, ticket sales, and concession inventory. The system ensures data consistency across all platforms, with the admin panel providing immediate updates that reflect instantly in both the mobile app and website. This project demonstrates expertise in full-stack development, team collaboration, database design, API architecture, and creating intuitive user experiences for both end-users and administrators.",
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
  },
  {
    id: 3,
    image: null, // TODO: add public/images/bloodsugar.png
    role: "IOT & AI DEVELOPER",
    title: "SweetSpot",
    accentColor: "#22c55e",
    tags: ["Python", "Raspberry Pi", "Dexcom API", "AI"],
    description:
      "A Raspberry Pi-powered glucose monitoring system that tracks blood sugar levels and provides AI-driven health insights using the Dexcom API and Grok AI.",
    extendedDescription:
      "SweetSpot is an innovative health monitoring solution that bridges hardware, software, and artificial intelligence to create a comprehensive diabetes management system. The project integrates a Raspberry Pi as the central processing unit, connecting to the Dexcom API to retrieve real-time glucose level data from continuous glucose monitors. The system processes this data using Python, implementing sophisticated algorithms to identify patterns, trends, and potential health concerns. Grok AI integration enables the system to provide personalized health insights, generating recommendations based on individual glucose patterns, meal timing, exercise habits, and historical data. The user interface, designed with a modern grey and bright green color scheme, displays real-time glucose readings, interactive trend graphs, and AI-generated analysis in an intuitive dashboard format. The visualization system uses Python libraries to create clear, actionable charts that help users understand their glucose patterns over time. The system can predict future glucose readings based on historical data and current trends, alerting users to potential issues before they occur. SweetSpot demonstrates expertise in hardware integration, API integration, data processing, AI implementation, and creating user-friendly interfaces for health technology. The project showcases the ability to work with embedded systems, process real-time data streams, and leverage AI to provide meaningful insights that improve user health outcomes.",
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
  },
  {
    id: 4,
    image: "/images/workly/workly1.png",
    role: "MOBILE APP DEVELOPER",
    title: "Workly",
    accentColor: ACCENT_WORKLY,
    tags: ["Flutter", "Dart", "Firebase", "Mobile", "GitHub"],
    description:
      "A mobile job search app with a Tinder-like swipe interface, AI-powered matching, and cover letter generation built with Flutter and Firebase.",
    extendedDescription:
      "Workly revolutionizes the job search experience by combining an intuitive, gamified interface with powerful AI-driven features. Built with Flutter for true cross-platform compatibility, the app provides a native experience on iOS, Android, and web platforms. The core interaction model uses a Tinder-like swipe interface, allowing job seekers to quickly browse opportunities by swiping right on interesting positions or left to pass, making the traditionally tedious job search process fast, engaging, and enjoyable. The app features sophisticated AI-powered job matching that analyzes user qualifications, skills, experience, and preferences to calculate a matching score for each job opportunity. This intelligent matching system helps users focus on positions that align with their career goals and qualifications. One of Workly's standout features is the AI cover letter generator, which creates personalized cover letters tailored to specific job postings, saving users significant time while ensuring each application is customized and relevant. The backend infrastructure, built entirely on Firebase, leverages Cloud Firestore for real-time data synchronization, ensuring job listings, user profiles, and application statuses update instantly across all devices. Firebase Authentication provides secure user account management, while Firebase Cloud Functions handle server-side logic for job matching algorithms and AI processing. The app includes comprehensive user profile management, allowing job seekers to upload resumes, specify skills, set preferences, and track their application history. The Provider state management pattern ensures efficient data flow and reactive UI updates throughout the application. Workly demonstrates expertise in cross-platform mobile development, Firebase backend services, AI integration, and creating engaging user experiences that solve real-world problems.",
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
  },
];
