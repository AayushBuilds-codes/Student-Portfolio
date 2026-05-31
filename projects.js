/**
 * Projects database for dynamic portfolio rendering
 */
const isLocal = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.protocol === 'file:');

const projects = [
    {
        id: "weather-dashboard",
        title: "Weather Dashboard",
        category: "frontend",
        description: "Interactive weather dashboard showing real-time atmospheric conditions and forecasts by location.",
        longDescription: "A modern, responsive weather dashboard built with HTML, CSS, and Vanilla JavaScript. It leverages global weather API integrations to fetch real-time weather details including temperature, humidity, wind speed, and weather conditions by city name or user geolocation.",
        image: "assets/project-weather.png",
        tech: ["HTML5", "CSS3", "JavaScript", "Fetch API", "Weather API"],
        demoUrl: isLocal ? "../Weather Dashboard/index.html" : "https://aayushbuilds-codes.github.io/Weather-Dashboard/",
        repoUrl: "https://github.com/AayushBuilds-codes/Weather-Dashboard",
        features: [
            "Real-time weather query using global weather APIs",
            "Dynamic background transitions matching the weather conditions",
            "Detailed statistics for wind speed, humidity, and atmospheric pressure",
            "Fully responsive glassmorphic cards for multi-day forecast display"
        ]
    },
    {
        id: "calculator",
        title: "Interactive Web Calculator",
        category: "frontend",
        description: "A beautifully styled, fully functional web calculator supporting core arithmetic calculations.",
        longDescription: "A sleek, responsive calculator application implementing clean grid layouts and interactive button animations. Supports standard arithmetic operations, decimal entries, and error handling for mathematical boundary conditions.",
        image: "assets/project-calculator.png",
        tech: ["HTML5", "CSS Grid", "CSS Variables", "JavaScript"],
        demoUrl: isLocal ? "../Calculator basic/index.html" : "https://aayushbuilds-codes.github.io/Calculator/",
        repoUrl: "https://github.com/AayushBuilds-codes/Calculator",
        features: [
            "Modern glassmorphism button UI with fluid hover transitions",
            "Keyboard input support with visual feedback on keypress",
            "Error handling for division by zero and long decimal entries",
            "Clean responsive layout designed to work perfectly on mobile and desktop"
        ]
    },
    {
        id: "pinnacle-portfolio",
        title: "Pinnacle Portfolio Workspace",
        category: "fullstack",
        description: "A premium personal portfolio website showcasing ML certifications, internships, and engineering skills.",
        longDescription: "The website you are currently browsing! Features advanced scroll triggers, glassmorphic layout components, direct terminal sending animations, and theme state management. Integrates his resume data and github repositories directly.",
        image: "assets/project-portfolio.png",
        tech: ["HTML5", "CSS3", "Vanilla JS", "ScrollObserver", "GitHub API"],
        demoUrl: "./index.html",
        repoUrl: "https://github.com/AayushBuilds-codes/Pinnacle",
        features: [
            "Custom dark/light theme toggle with local storage persistence",
            "Animated statistics counting elements triggered upon view",
            "Dynamic project rendering from local store and GitHub API integrations",
            "Interactive terminal simulation block for contact transmissions"
        ]
    }
];
