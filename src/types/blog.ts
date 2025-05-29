// Blog types and interfaces for AI-powered content generation

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  date: string;
  excerpt: string;
  content: string[];
  category: BlogCategory;
  tags: string[];
  readTime: number;
  author: string;
  isAIGenerated: boolean;
  aiModel?: string;
  generatedAt?: string;
}

export interface BlogCategory {
  id: string;
  name: string;
  description: string;
  color: string;
}

export interface BlogGenerationRequest {
  topic: string;
  category: BlogCategory;
  targetAudience: 'beginner' | 'intermediate' | 'advanced';
  wordCount: number;
  includeCodeExamples: boolean;
  tone: 'professional' | 'casual' | 'technical';
  keywords?: string[];
}

export interface BlogGenerationResponse {
  title: string;
  content: string[];
  excerpt: string;
  tags: string[];
  readTime: number;
  slug: string;
}

export interface AIBlogConfig {
  maxPostsPerDay: number;
  autoPublish: boolean;
  categories: BlogCategory[];
  defaultSettings: {
    wordCount: number;
    tone: 'professional' | 'casual' | 'technical';
    targetAudience: 'beginner' | 'intermediate' | 'advanced';
  };
}

// Predefined blog categories
export const BLOG_CATEGORIES: BlogCategory[] = [
  {
    id: 'web-development',
    name: 'Web Development',
    description: 'Frontend and backend development tutorials',
    color: 'bg-blue-500'
  },
  {
    id: 'ai-ml',
    name: 'AI & Machine Learning',
    description: 'Artificial intelligence and ML advancements',
    color: 'bg-purple-500'
  },
  {
    id: 'programming',
    name: 'Programming Tutorials',
    description: 'Programming languages and best practices',
    color: 'bg-green-500'
  },
  {
    id: 'cloud-devops',
    name: 'Cloud & DevOps',
    description: 'Cloud platforms and DevOps practices',
    color: 'bg-orange-500'
  },
  {
    id: 'career',
    name: 'Career Development',
    description: 'Professional growth and career advice',
    color: 'bg-pink-500'
  },
  {
    id: 'tech-trends',
    name: 'Tech Trends',
    description: 'Latest technology trends and insights',
    color: 'bg-indigo-500'
  }
];

// Popular blog topics for AI generation
export const BLOG_TOPICS = {
  'web-development': [
    'React Performance Optimization Techniques',
    'Building Responsive Web Applications',
    'Modern CSS Grid and Flexbox Layouts',
    'JavaScript ES2024 New Features',
    'Web Accessibility Best Practices',
    'Progressive Web Apps Development',
    'TypeScript Advanced Patterns',
    'Frontend Testing Strategies'
  ],
  'ai-ml': [
    'Introduction to Large Language Models',
    'AI in Web Development: Practical Applications',
    'Machine Learning for Beginners',
    'Natural Language Processing Fundamentals',
    'Computer Vision in Modern Applications',
    'AI Ethics and Responsible Development',
    'Prompt Engineering Best Practices',
    'AI-Powered Code Generation Tools'
  ],
  'programming': [
    'Java Spring Boot Microservices',
    'Python for Data Science',
    'Advanced JavaScript Concepts',
    'Database Design Principles',
    'API Development Best Practices',
    'Code Review Guidelines',
    'Design Patterns in Modern Programming',
    'Performance Optimization Techniques'
  ],
  'cloud-devops': [
    'AWS Architecture Best Practices',
    'Docker Containerization Guide',
    'Kubernetes Deployment Strategies',
    'CI/CD Pipeline Implementation',
    'Infrastructure as Code with Terraform',
    'Monitoring and Logging Strategies',
    'Cloud Security Fundamentals',
    'Serverless Architecture Patterns'
  ],
  'career': [
    'Building a Strong Developer Portfolio',
    'Technical Interview Preparation',
    'Remote Work Best Practices',
    'Continuous Learning Strategies',
    'Networking for Developers',
    'Salary Negotiation Tips',
    'Leadership Skills for Developers',
    'Work-Life Balance in Tech'
  ],
  'tech-trends': [
    'The Future of Web Development',
    'Emerging Programming Languages',
    'Quantum Computing Basics',
    'Blockchain Technology Applications',
    'Edge Computing Trends',
    'IoT Development Insights',
    'Cybersecurity Trends 2024',
    'Green Technology in Software'
  ]
};

// AI generation prompts
export const AI_BLOG_PROMPTS = {
  systemPrompt: `You are an expert technical writer and software developer with 10+ years of experience. You write authoritative, engaging blog posts about web development, AI, and programming. Your writing style is:

- Clear and accessible to the target audience
- Includes practical examples and code snippets when relevant
- Well-structured with proper headings and flow
- Authoritative but not overly academic
- Includes actionable insights and takeaways

Always format your response as a JSON object with the following structure:
{
  "title": "Blog post title",
  "excerpt": "Brief summary (150-200 characters)",
  "content": ["Array of paragraphs"],
  "tags": ["Array of relevant tags"],
  "readTime": estimated_read_time_in_minutes
}`,

  contentPrompt: (request: BlogGenerationRequest) => `Write a comprehensive blog post about "${request.topic}" for ${request.targetAudience} developers.

Requirements:
- Target word count: ${request.wordCount} words
- Tone: ${request.tone}
- Category: ${request.category.name}
- Include code examples: ${request.includeCodeExamples ? 'Yes' : 'No'}
${request.keywords ? `- Focus keywords: ${request.keywords.join(', ')}` : ''}

Structure the post with:
1. Engaging introduction
2. Main content sections with clear headings
3. Practical examples and code snippets (if requested)
4. Key takeaways or conclusion
5. Relevant tags for SEO

Make it informative, practical, and engaging for developers looking to improve their skills.`
};
