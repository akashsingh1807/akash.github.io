// Blog configuration for AI-powered content generation
import { BlogCategory, AIBlogConfig } from '@/types/blog';

export const BLOG_CATEGORIES: BlogCategory[] = [
  {
    id: 'web-development',
    name: 'Web Development',
    description: 'Modern web development tutorials, frameworks, and best practices',
    color: '#3B82F6' // Blue
  },
  {
    id: 'ai-advancements',
    name: 'AI Advancements',
    description: 'Latest developments in artificial intelligence and machine learning',
    color: '#8B5CF6' // Purple
  },
  {
    id: 'programming-tutorials',
    name: 'Programming Tutorials',
    description: 'Programming languages, algorithms, and software engineering concepts',
    color: '#10B981' // Green
  },
  {
    id: 'cloud-devops',
    name: 'Cloud & DevOps',
    description: 'Cloud computing, containerization, and deployment strategies',
    color: '#F59E0B' // Orange
  },
  {
    id: 'mobile-development',
    name: 'Mobile Development',
    description: 'iOS, Android, and cross-platform mobile app development',
    color: '#EF4444' // Red
  }
];

export const BLOG_TOPICS_BY_CATEGORY = {
  'web-development': [
    'React Performance Optimization Techniques',
    'Building Responsive Web Applications with CSS Grid',
    'Modern JavaScript ES2024 Features and Best Practices',
    'TypeScript Advanced Patterns for Large Applications',
    'Web Accessibility: Creating Inclusive User Experiences',
    'Progressive Web Apps: Bridging Native and Web',
    'Frontend Testing Strategies with Jest and Cypress',
    'State Management in React: Context vs Redux vs Zustand',
    'Building Scalable Component Libraries',
    'Web Performance Optimization: Core Web Vitals Guide'
  ],
  'ai-advancements': [
    'Understanding Large Language Models: GPT to Gemini',
    'AI in Web Development: Practical Applications',
    'Machine Learning for Frontend Developers',
    'Natural Language Processing: From Theory to Practice',
    'Computer Vision in Modern Web Applications',
    'AI Ethics and Responsible Development Practices',
    'Prompt Engineering: Mastering AI Interactions',
    'AI-Powered Code Generation and Developer Tools',
    'Building Conversational AI Interfaces',
    'The Future of AI in Software Development'
  ],
  'programming-tutorials': [
    'Java Spring Boot Microservices Architecture',
    'Python for Data Science: NumPy to Pandas',
    'Advanced JavaScript Concepts: Closures and Prototypes',
    'Database Design Patterns and Best Practices',
    'API Design: RESTful Services and GraphQL',
    'Functional Programming Concepts in JavaScript',
    'Object-Oriented Programming in Modern Languages',
    'Algorithm Optimization: Time and Space Complexity',
    'Design Patterns Every Developer Should Know',
    'Clean Code Principles and Refactoring Techniques'
  ],
  'cloud-devops': [
    'Docker Containerization for Modern Applications',
    'Kubernetes Orchestration: From Basics to Production',
    'AWS Cloud Architecture Best Practices',
    'CI/CD Pipelines with GitHub Actions',
    'Infrastructure as Code with Terraform',
    'Monitoring and Observability in Distributed Systems',
    'Serverless Computing: Functions and Event-Driven Architecture',
    'Cloud Security: Protecting Your Applications',
    'Microservices Deployment Strategies',
    'DevOps Culture: Bridging Development and Operations'
  ],
  'mobile-development': [
    'React Native vs Flutter: Choosing the Right Framework',
    'iOS Development with SwiftUI: Modern UI Patterns',
    'Android Jetpack Compose: Declarative UI Development',
    'Mobile App Performance Optimization',
    'Cross-Platform Development Best Practices',
    'Mobile Security: Protecting User Data',
    'App Store Optimization: Getting Discovered',
    'Mobile Testing Strategies and Tools',
    'Progressive Web Apps vs Native Apps',
    'Mobile Backend as a Service (BaaS) Solutions'
  ]
};

export const AI_BLOG_CONFIG: AIBlogConfig = {
  maxPostsPerDay: 3,
  autoPublish: false, // Manual review before publishing
  categories: BLOG_CATEGORIES,
  defaultSettings: {
    wordCount: 1200,
    tone: 'professional',
    targetAudience: 'intermediate'
  }
};

export const CONTENT_GENERATION_PROMPTS = {
  systemPrompt: `You are an expert technical writer and software engineer with deep knowledge across web development, AI/ML, programming languages, cloud computing, and mobile development.

Your writing style is:
- Clear and accessible to the target audience
- Technically accurate and up-to-date
- Practical with real-world examples
- Well-structured with logical flow
- Engaging without being overly casual
- Authoritative but not academic

Always include:
- Practical examples and code snippets when relevant
- Best practices and common pitfalls
- Actionable insights readers can implement
- Current industry standards and trends`,

  contentStructure: `Structure your blog post with:
1. Engaging introduction that hooks the reader
2. Clear problem statement or learning objectives
3. Main content divided into logical sections
4. Practical examples with explanations
5. Best practices and tips
6. Common mistakes to avoid
7. Conclusion with key takeaways
8. Next steps or further reading suggestions`,

  codeExampleGuidelines: `For code examples:
- Always wrap code in proper markdown code blocks with language specification
- Use \`\`\`javascript, \`\`\`typescript, \`\`\`python, etc.
- Use modern, idiomatic code
- Include comments for complex logic
- Show both basic and advanced usage
- Provide context for when to use each approach
- Include error handling where appropriate
- Use realistic variable names and scenarios
- Use \`backticks\` for inline code references like function names or variables`
};

export const SCHEDULING_CONFIG = {
  // Generate new content every 3 days
  generationInterval: 3 * 24 * 60 * 60 * 1000, // 3 days in milliseconds

  // Preferred posting times (hours in 24h format)
  preferredPostingHours: [9, 14, 16], // 9 AM, 2 PM, 4 PM

  // Maximum posts per category per week
  maxPostsPerCategoryPerWeek: 2,

  // Minimum time between posts in same category (hours)
  minTimeBetweenCategoryPosts: 48
};

// Helper function to get category by ID
export const getCategoryById = (id: string): BlogCategory | undefined => {
  return BLOG_CATEGORIES.find(category => category.id === id);
};

// Helper function to get topics for a category
export const getTopicsForCategory = (categoryId: string): string[] => {
  return BLOG_TOPICS_BY_CATEGORY[categoryId as keyof typeof BLOG_TOPICS_BY_CATEGORY] || [];
};

// Helper function to get random topic from category
export const getRandomTopicFromCategory = (categoryId: string): string | null => {
  const topics = getTopicsForCategory(categoryId);
  if (topics.length === 0) return null;

  const randomIndex = Math.floor(Math.random() * topics.length);
  const selectedTopic = topics[randomIndex];
  return selectedTopic || null;
};
