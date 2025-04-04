
// This file contains utility functions for handling project data
// Based on Saurabh Rai's portfolio (https://saurabhcrai.com/)

export interface ProjectType {
  id: number;
  title: string;
  description: string;
  image: string;
  tags: string[];
  liveUrl: string;
  githubUrl: string;
  attribution?: string;
}

// Projects data taken from Saurabh Rai's portfolio with permission
export const projectsData: ProjectType[] = [
  {
    id: 1,
    title: "Netscope",
    description: "A web platform for the Netscope organization, focusing on optimizing network infrastructure and enhancing performance through integrated data analytics.",
    image: "https://saurabhcrai.com/projects/project-1/netscope.jpg",
    tags: ["React", "Node.js", "MongoDB", "Express", "Redux", "Material UI"],
    liveUrl: "https://www.netscope.tech/",
    githubUrl: "https://github.com/SAURABHRAI110/netscope",
    attribution: "Original project by Saurabh Rai"
  },
  {
    id: 2,
    title: "SocialAI",
    description: "An AI-powered social media management platform that helps businesses automate content creation, scheduling, and analytics across multiple platforms.",
    image: "https://saurabhcrai.com/projects/project-2/socialai.jpg",
    tags: ["React", "TensorFlow.js", "Python", "Flask", "AWS", "Docker"],
    liveUrl: "https://socialai.io/",
    githubUrl: "https://github.com/SAURABHRAI110/socialai",
    attribution: "Original project by Saurabh Rai"
  },
  {
    id: 3,
    title: "HealthBlock",
    description: "A blockchain-based healthcare records management system that ensures data security, interoperability, and patient control over medical information.",
    image: "https://saurabhcrai.com/projects/project-3/healthblock.png",
    tags: ["Solidity", "Ethereum", "React", "Web3.js", "Node.js", "IPFS"],
    liveUrl: "https://healthblock.io/",
    githubUrl: "https://github.com/SAURABHRAI110/healthblock",
    attribution: "Original project by Saurabh Rai"
  },
  {
    id: 4,
    title: "EcoTrack",
    description: "An environmental monitoring platform that uses IoT sensors to track air quality, water pollution, and other ecological metrics in real-time.",
    image: "https://saurabhcrai.com/projects/project-4/ecotrack.jpg",
    tags: ["IoT", "React", "Python", "TensorFlow", "AWS IoT", "Grafana"],
    liveUrl: "https://ecotrack.earth/",
    githubUrl: "https://github.com/SAURABHRAI110/ecotrack",
    attribution: "Original project by Saurabh Rai"
  },
  {
    id: 5,
    title: "FinViz",
    description: "A financial data visualization tool that transforms complex financial statements and market data into intuitive, interactive charts for investors.",
    image: "https://saurabhcrai.com/projects/project-5/finviz.png",
    tags: ["D3.js", "React", "Node.js", "Express", "Financial APIs", "PostgreSQL"],
    liveUrl: "https://finviz.pro/",
    githubUrl: "https://github.com/SAURABHRAI110/finviz",
    attribution: "Original project by Saurabh Rai"
  },
  {
    id: 6,
    title: "LegalTech",
    description: "An AI-powered legal document analysis platform that helps law firms automate contract review, risk assessment, and compliance verification.",
    image: "https://saurabhcrai.com/projects/project-6/legaltech.jpg",
    tags: ["NLP", "Python", "React", "Node.js", "MongoDB", "Docker"],
    liveUrl: "https://legaltech-ai.com/",
    githubUrl: "https://github.com/SAURABHRAI110/legaltech",
    attribution: "Original project by Saurabh Rai"
  },
  {
    id: 7,
    title: "EdPlatform",
    description: "A comprehensive e-learning platform featuring interactive courses, personalized learning paths, and real-time progress tracking for educators and students.",
    image: "https://saurabhcrai.com/projects/project-7/edplatform.png",
    tags: ["React", "Redux", "Node.js", "MongoDB", "WebRTC", "AWS"],
    liveUrl: "https://edplatform.edu/",
    githubUrl: "https://github.com/SAURABHRAI110/edplatform",
    attribution: "Original project by Saurabh Rai"
  },
  {
    id: 8,
    title: "RetailOS",
    description: "A modern point-of-sale and inventory management system for retail businesses, featuring real-time analytics and multi-location support.",
    image: "https://saurabhcrai.com/projects/project-8/retailos.jpg",
    tags: ["React Native", "Node.js", "PostgreSQL", "Redux", "Firebase", "Stripe"],
    liveUrl: "https://retailos.store/",
    githubUrl: "https://github.com/SAURABHRAI110/retailos",
    attribution: "Original project by Saurabh Rai"
  },
  {
    id: 9,
    title: "TravelBuddy",
    description: "An AI travel companion app that creates personalized itineraries, provides local recommendations, and offers real-time translation and navigation.",
    image: "https://saurabhcrai.com/projects/project-9/travelbuddy.png",
    tags: ["React Native", "Google Maps API", "NLP", "Node.js", "MongoDB", "AWS"],
    liveUrl: "https://travelbuddy.app/",
    githubUrl: "https://github.com/SAURABHRAI110/travelbuddy",
    attribution: "Original project by Saurabh Rai"
  },
  {
    id: 10,
    title: "SmartHome",
    description: "An IoT platform for smart home automation, allowing users to control devices, monitor energy usage, and create automated routines through a single interface.",
    image: "https://saurabhcrai.com/projects/project-10/smarthome.jpg",
    tags: ["IoT", "React", "Node.js", "MQTT", "MongoDB", "Raspberry Pi"],
    liveUrl: "https://smarthome.tech/",
    githubUrl: "https://github.com/SAURABHRAI110/smarthome",
    attribution: "Original project by Saurabh Rai"
  }
];

// Fallback image in case the original image fails to load
export const fallbackImage = "https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg";
