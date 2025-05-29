// Chat types and interfaces for the conversational chatbot

export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  type?: 'text' | 'menu' | 'link' | 'form';
  metadata?: {
    intent?: string;
    confidence?: number;
    buttons?: QuickReplyButton[];
    links?: ChatLink[];
  };
}

export interface QuickReplyButton {
  id: string;
  label: string;
  value: string;
  icon?: string;
  action?: 'message' | 'link' | 'form';
  url?: string;
}

export interface ChatLink {
  title: string;
  url: string;
  description?: string;
  type?: 'github' | 'demo' | 'portfolio' | 'contact';
}

export interface ChatIntent {
  name: string;
  patterns: string[];
  response: string;
  buttons?: QuickReplyButton[];
  links?: ChatLink[];
}

export interface ChatContext {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  sessionId: string;
}

// Predefined menu options
export const MAIN_MENU_OPTIONS: QuickReplyButton[] = [
  {
    id: 'projects',
    label: '🚀 Explore Projects',
    value: 'show_projects',
    action: 'message'
  },
  {
    id: 'qualifications',
    label: '🎓 View Qualifications',
    value: 'show_qualifications',
    action: 'message'
  },
  {
    id: 'requirements',
    label: '📝 Submit Requirements',
    value: 'submit_requirements',
    action: 'form'
  },
  {
    id: 'contact',
    label: '📞 Contact Support',
    value: 'contact_support',
    action: 'message'
  }
];

// Project links
export const PROJECT_LINKS: ChatLink[] = [
  {
    title: 'E-Commerce Platform',
    url: 'https://github.com/akashsingh01',
    description: 'Full-stack e-commerce solution with Spring Boot and React',
    type: 'github'
  },
  {
    title: 'Microservices Architecture',
    url: 'https://github.com/akashsingh01',
    description: 'Scalable microservices with Docker and Kubernetes',
    type: 'github'
  },
  {
    title: 'Portfolio Website',
    url: 'https://akashcodes.vercel.app',
    description: 'This responsive portfolio with AI chatbot',
    type: 'demo'
  },
  {
    title: 'Full Project Portfolio',
    url: '#projects',
    description: 'View all projects and case studies',
    type: 'portfolio'
  }
];

// Qualification information
export const QUALIFICATIONS = {
  skills: [
    'Java & Spring Boot',
    'React & TypeScript',
    'Microservices Architecture',
    'Cloud Platforms (AWS, Azure)',
    'DevOps & CI/CD',
    'Database Design (SQL, NoSQL)'
  ],
  experience: '5+ years in Full Stack Development',
  certifications: [
    'AWS Certified Solutions Architect',
    'Oracle Java Certification',
    'Spring Professional Certification'
  ],
  education: 'Bachelor\'s in Computer Science'
};

// Intent patterns for natural language understanding
export const CHAT_INTENTS: ChatIntent[] = [
  {
    name: 'greeting',
    patterns: ['hello', 'hi', 'hey', 'good morning', 'good afternoon'],
    response: 'Hello! I\'m Akash\'s AI assistant. I can help you explore his projects, qualifications, or discuss your requirements. What would you like to know?',
    buttons: MAIN_MENU_OPTIONS
  },
  {
    name: 'projects',
    patterns: ['projects', 'work', 'portfolio', 'github', 'demos', 'what have you built'],
    response: 'Here are some of Akash\'s featured projects. Each showcases different aspects of his full-stack development expertise:',
    links: PROJECT_LINKS
  },
  {
    name: 'skills',
    patterns: ['skills', 'expertise', 'technologies', 'qualifications', 'experience'],
    response: `Akash is a Full Stack Java Developer with ${QUALIFICATIONS.experience}. His core expertise includes: ${QUALIFICATIONS.skills.join(', ')}. He holds certifications in ${QUALIFICATIONS.certifications.join(', ')}.`,
    buttons: [
      {
        id: 'resume',
        label: '📄 Download Resume',
        value: 'download_resume',
        action: 'link',
        url: 'mailto:Engg.akashsingh@gmail.com?subject=Resume Request'
      },
      {
        id: 'projects_from_skills',
        label: '🚀 See Projects',
        value: 'show_projects',
        action: 'message'
      }
    ]
  },
  {
    name: 'contact',
    patterns: ['contact', 'email', 'hire', 'reach out', 'get in touch'],
    response: 'You can reach Akash through multiple channels:',
    buttons: [
      {
        id: 'email',
        label: '📧 Email',
        value: 'email_contact',
        action: 'link',
        url: 'mailto:Engg.akashsingh@gmail.com'
      },
      {
        id: 'linkedin',
        label: '💼 LinkedIn',
        value: 'linkedin_contact',
        action: 'link',
        url: 'https://linkedin.com/in/akashsingh'
      },
      {
        id: 'requirements',
        label: '📝 Submit Project Requirements',
        value: 'submit_requirements',
        action: 'form'
      }
    ]
  },
  {
    name: 'requirements',
    patterns: ['requirements', 'project', 'hire', 'work together', 'collaboration'],
    response: 'I\'d love to hear about your project! You can share your requirements in several ways:',
    buttons: [
      {
        id: 'email_requirements',
        label: '📧 Email Requirements',
        value: 'email_requirements',
        action: 'link',
        url: 'mailto:Engg.akashsingh@gmail.com?subject=Project Requirements&body=Hi Akash,%0D%0A%0D%0AProject Details:%0D%0A- Project Type:%0D%0A- Technology Stack:%0D%0A- Timeline:%0D%0A- Budget Range:%0D%0A%0D%0ADescription:%0D%0A%0D%0ABest regards'
      },
      {
        id: 'contact_form',
        label: '📝 Contact Form',
        value: 'contact_form',
        action: 'link',
        url: '#contact'
      }
    ]
  }
];
