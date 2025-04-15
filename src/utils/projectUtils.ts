
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
    title: 'NextGen Healthcare ',
    description:
        '\Working as a Senior Software Engineer in the healthcare domain, contributing to the development and enhancement of healthcare solutions. Involved in designing and developing scalable, high-performance applications using Java, Spring Boot, and Microservices architecture. Responsible for building and optimizing RESTful APIs, ensuring seamless integration with healthcare data systems, and implementing cloud-based solutions for improved efficiency.',
    image: '/images/NexGenPatientPortal.webp',
    tags: [
      'Java', 'Spring Boot', 'Microservices', 'REST API', 'AWS',
      'Azure', 'Hibernate', 'MySQL', 'PostgreSQL', 'Docker',
      'Kubernetes', 'FHIR', 'HL7', 'Healthcare IT'
    ],
    liveUrl: 'https://www.nextgen.com/',
    githubUrl: '#',
  }
,
  {
    id: 2,
    title: 'Network Automation - OpenText',
    description:
        'Working as a Senior Software Engineer in the development and containerization of products for compliance, monitoring, and provisioning of large-scale network devices. Designed and implemented high-performance REST APIs, migrated the codebase from Java 8 to Java 11, and automated test cases to enhance efficiency. Contributed to the scalability and deployment of microservices using Docker and cloud platforms like AWS and Azure.',
    image: '/images/network_automation.jpg',
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
    title: 'Frontier - Business Licensing Platform (Singapore Government)',
    description:
        'Contributed to the development of Frontier, a one-stop Business Licensing platform for Singapore Community end-users, under the Singapore Government. Worked on implementing various licenses, developing and maintaining RESTful APIs, and handling production defect resolution. Involved in backend development using Spring MVC, Java, Hibernate, and MySQL, and frontend development using JSP, JavaScript, jQuery, HTML, and CSS. Ensured seamless integration between modules and optimized system performance.',
    image: '/images/frontier.png',
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
    title: 'Traffic Analyzer for HTTP/HTTPS',
    description:
      'A web application that monitors and analyzes HTTP\'s encrypted traffic for security, enabling attack detection and preventing information leakage.',
    image: 'https://images.pexels.com/photos/5473298/pexels-photo-5473298.jpeg',
    tags: ['Java', 'Security', 'Web Applications', 'HTTP Analysis'],
    liveUrl: '#',
    githubUrl: '#',
  },
  {
    id: 5,
    title: 'Complaint Tracking Automation System',
    description:
      'A Java application that provides an interface for clients to register complaints/grievances which are then automatically processed by the company.',
    image: 'https://images.pexels.com/photos/7654096/pexels-photo-7654096.jpeg',
    tags: ['Java', 'J2SE', 'Automation', 'Customer Service'],
    liveUrl: '#',
    githubUrl: '#',
  },
  {
    id: 6,
    title: 'Project RED',
    description:
      'An innovative system that leverages cutting-edge technology to deliver real-time data processing and analytics for enterprise applications.',
    image: 'https://images.pexels.com/photos/5483077/pexels-photo-5483077.jpeg',
    tags: ['React', 'TypeScript', 'Node.js', 'MongoDB', 'AWS'],
    liveUrl: '#',
    githubUrl: '#',
  },
  {
    id: 7,
    title: 'Open Banking API',
    description:
      'Developed critical modules for Open Banking APIs that facilitate secure and standardized financial data sharing between institutions.',
    image: 'https://images.pexels.com/photos/210607/pexels-photo-210607.jpeg',
    tags: ['Java', 'Spring Boot', 'Microservices', 'REST API', 'Security'],
    liveUrl: '#',
    githubUrl: '#',
  },
  {
    id: 8,
    title: 'CICD Pipeline Optimization',
    description:
      'Improved deployment efficiency by optimizing CI/CD pipelines, reducing build times and enhancing automated testing coverage.',
    image: 'https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg',
    tags: ['Jenkins', 'Docker', 'Kubernetes', 'DevOps', 'CI/CD'],
    liveUrl: '#',
    githubUrl: '#',
  }
];

// Fallback image in case the original image fails to load
export const fallbackImage = "https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg";
