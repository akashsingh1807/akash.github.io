
export interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  tags: string[];
  liveUrl: string;
  githubUrl: string;
}

export const projects: Project[] = [
  {
    id: 1,
    title: "NextGen Healthcare ",
    description:
        'Working as a Senior Software Engineer in the healthcare domain, contributing to the development and enhancement of healthcare solutions. Involved in designing and developing scalable, high-performance applications using Java, Spring Boot, and Microservices architecture. Responsible for building and optimizing RESTful APIs, ensuring seamless integration with healthcare data systems, and implementing cloud-based solutions for improved efficiency.',
    image: 'https://www.kohezion.com/wp-content/uploads/2024/10/NextGen-Office-768x379.png',
    tags: [
      'Java', 'Spring Boot', 'Microservices', 'REST API', 'AWS',
      'Azure', 'Hibernate', 'MySQL', 'PostgreSQL', 'Docker',
      'Kubernetes', 'FHIR', 'HL7', 'Healthcare IT'
    ],
    liveUrl: 'https://www.nextgen.com/',
    githubUrl: '#',
  },
  {
    id: 2,
    title: "Network Automation - OpenText",
    description:
        'Working as a Senior Software Engineer in the development and containerization of products for compliance, monitoring, and provisioning of large-scale network devices. Designed and implemented high-performance REST APIs, migrated the codebase from Java 8 to Java 11, and automated test cases to enhance efficiency. Contributed to the scalability and deployment of microservices using Docker and cloud platforms like AWS and Azure.',
    image: 'https://docs.microfocus.com/file/images/6/65/NAUserInterface.png',
    tags: [
      'Java', 'Spring Framework', 'Spring Boot', 'Microservices', 'REST API',
      'Docker', 'Kubernetes', 'AWS', 'Azure', 'MySQL',
      'JUnit', 'Mockito', 'InstallAnywhere', 'Compliance Automation'
    ],
    liveUrl: 'https://www.opentext.com/products/network-automation',
    githubUrl: '#',
  },
  {
    id: 3,
    title: "Frontier - Business Licensing Platform (Singapore Government)",
    description:
        'Contributed to the development of Frontier, a one-stop Business Licensing platform for Singapore Community end-users, under the Singapore Government. Worked on implementing various licenses, developing and maintaining RESTful APIs, and handling production defect resolution. Involved in backend development using Spring MVC, Java, Hibernate, and MySQL, and frontend development using JSP, JavaScript, jQuery, HTML, and CSS. Ensured seamless integration between modules and optimized system performance.',
    image: 'https://www.taxi.org.sg/images/gobusiness-r1.png',
    tags: [
      'Spring MVC', 'Java', 'Hibernate', 'MySQL', 'RESTful API',
      'JSP', 'JavaScript', 'jQuery', 'HTML', 'CSS',
      'Microservices', 'PostgreSQL', 'Docker', 'AWS'
    ],
    liveUrl: 'https://licence1.business.gov.sg/feportal/web/frontier/home',
    githubUrl: '#',
  },
  {
    id: 4,
    title: "Traffic Analyzer for HTTP/HTTPS",
    description:
      'A web application that monitors and analyzes HTTP\'s encrypted traffic for security, enabling attack detection and preventing information leakage.',
    image: 'https://images.pexels.com/photos/5473298/pexels-photo-5473298.jpeg',
    tags: ['Java', 'Security', 'Web Applications', 'HTTP Analysis'],
    liveUrl: '#',
    githubUrl: '#',
  },
  {
    id: 5,
    title: "Complaint Tracking Automation System",
    description:
      'A Java application that provides an interface for clients to register complaints/grievances which are then automatically processed by the company.',
    image: 'src/assets/network_automation.jpg',
    tags: ['Java', 'J2SE', 'Automation', 'Customer Service'],
    liveUrl: '#',
    githubUrl: '#',
  },
  {
    id: 6,
    title: "Nuxt Portfolio Template",
    description:
      'A fast, responsive portfolio template built with Nuxt.js 3, Vue 3, and TailwindCSS. Features dark mode, smooth animations, and SEO optimization.',
    image: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg',
    tags: ['Vue.js', 'Nuxt.js', 'TailwindCSS', 'JavaScript', 'UI/UX'],
    liveUrl: 'https://nuxt-portfolio-template.netlify.app/',
    githubUrl: 'https://github.com/yourusername/nuxt-portfolio',
  },
  {
    id: 7,
    title: "UI Components Library",
    description:
      'A comprehensive React component library with 50+ reusable components following atomic design principles. Includes documentation and Storybook integration.',
    image: 'https://images.pexels.com/photos/92904/pexels-photo-92904.jpeg',
    tags: ['React', 'TypeScript', 'Storybook', 'Atomic Design', 'UI Library'],
    liveUrl: 'https://ui-components-library.netlify.app/',
    githubUrl: 'https://github.com/yourusername/ui-components',
  },
  {
    id: 8,
    title: "E-commerce Solution",
    description:
      'Full-stack e-commerce application built with MERN stack. Features include product catalog, shopping cart, user authentication, payment processing, and admin dashboard.',
    image: 'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg',
    tags: ['MongoDB', 'Express', 'React', 'Node.js', 'E-commerce', 'Full Stack'],
    liveUrl: 'https://mern-ecommerce-shop.herokuapp.com/',
    githubUrl: 'https://github.com/yourusername/mern-ecommerce',
  },
  {
    id: 9,
    title: "AI Content Generator",
    description:
      'Web application that leverages OpenAI API to generate various types of content including blog posts, social media captions, and marketing copy based on user prompts.',
    image: 'https://images.pexels.com/photos/1181377/pexels-photo-1181377.jpeg',
    tags: ['React', 'Node.js', 'OpenAI API', 'AI', 'Content Generation'],
    liveUrl: 'https://ai-content-generator.vercel.app/',
    githubUrl: 'https://github.com/yourusername/ai-content-generator',
  },
  {
    id: 10,
    title: "Weather Dashboard",
    description:
      'Interactive weather application that displays current weather and 5-day forecast for any location. Features include geolocation, weather maps, and historical data graphs.',
    image: 'https://images.pexels.com/photos/1118873/pexels-photo-1118873.jpeg',
    tags: ['JavaScript', 'Weather API', 'Chart.js', 'Geolocation', 'PWA'],
    liveUrl: 'https://weather-dashboard-app.netlify.app/',
    githubUrl: 'https://github.com/yourusername/weather-dashboard',
  },
  {
    id: 11,
    title: "Task Management System",
    description:
      'Kanban-style task management application built with React and Firebase. Features include drag-and-drop interface, task categorization, due dates, and team collaboration.',
    image: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg',
    tags: ['React', 'Firebase', 'Drag and Drop', 'Task Management', 'Real-time'],
    liveUrl: 'https://task-management-system.web.app/',
    githubUrl: 'https://github.com/yourusername/task-management',
  },
  {
    id: 12,
    title: "Fitness Tracker",
    description:
      'Mobile-first web application for tracking workouts, setting fitness goals, and monitoring progress. Includes exercise library, custom workout creation, and progress visualization.',
    image: 'https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg',
    tags: ['React Native', 'Redux', 'Health API', 'Mobile App', 'Fitness'],
    liveUrl: 'https://fitness-tracker-app.io/',
    githubUrl: 'https://github.com/yourusername/fitness-tracker',
  }
];
