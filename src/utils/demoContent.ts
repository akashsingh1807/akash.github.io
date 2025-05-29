// Demo content for testing blog persistence without API calls
import { BlogGenerationResponse } from '@/types/blog';
import { addAIGeneratedPost, getAllBlogPosts, getBlogStats } from '@/utils/blogIntegration';
import { blogPosts } from '@/data/blogPosts';

// Sample AI-generated blog posts for demonstration
export const sampleAIBlogPosts: BlogGenerationResponse[] = [
  {
    title: "Advanced React Performance Optimization Techniques",
    slug: "advanced-react-performance-optimization-techniques",
    excerpt: "Discover cutting-edge strategies to boost your React application's performance, from code splitting to virtual DOM optimization.",
    content: [
      "React applications can become sluggish as they grow in complexity. Performance optimization is crucial for maintaining a smooth user experience and ensuring your application scales effectively.",
      "One of the most impactful optimization techniques is code splitting. By breaking your application into smaller chunks, you can load only the code that's needed for the current page or feature. React.lazy() and Suspense make this process straightforward.",
      "Memoization is another powerful tool in your optimization arsenal. React.memo, useMemo, and useCallback can prevent unnecessary re-renders and expensive calculations. However, use them judiciously – premature optimization can sometimes hurt performance.",
      "Virtual DOM optimization involves understanding how React's reconciliation algorithm works. By providing stable keys for list items and avoiding inline object creation in render methods, you can help React make more efficient updates.",
      "Bundle analysis tools like webpack-bundle-analyzer can reveal opportunities for optimization. Look for duplicate dependencies, large libraries that could be replaced with lighter alternatives, and unused code that can be eliminated.",
      "Consider implementing lazy loading for images and components that aren't immediately visible. Libraries like react-intersection-observer can help you implement efficient lazy loading patterns.",
      "Finally, don't forget about the importance of measuring performance. Use React DevTools Profiler and browser performance tools to identify bottlenecks and validate that your optimizations are actually improving performance."
    ],
    tags: ["React", "Performance", "Optimization", "JavaScript", "Web Development"],
    readTime: 8
  },
  {
    title: "Understanding Large Language Models: A Developer's Guide",
    slug: "understanding-large-language-models-developers-guide",
    excerpt: "Explore the architecture, capabilities, and practical applications of large language models in modern software development.",
    content: [
      "Large Language Models (LLMs) have revolutionized the way we interact with AI systems. As a developer, understanding how these models work can help you leverage them effectively in your applications.",
      "At their core, LLMs are neural networks trained on vast amounts of text data. They learn patterns in language that allow them to generate human-like text, answer questions, and even write code. The transformer architecture, introduced in the 'Attention is All You Need' paper, forms the foundation of most modern LLMs.",
      "The training process involves two main phases: pre-training and fine-tuning. During pre-training, the model learns general language patterns from a diverse dataset. Fine-tuning then specializes the model for specific tasks or domains.",
      "Context windows are a crucial limitation to understand. Most LLMs can only process a limited amount of text at once – typically ranging from 4,000 to 200,000 tokens. This affects how you structure prompts and manage conversations.",
      "Prompt engineering has emerged as a critical skill for working with LLMs. Techniques like few-shot learning, chain-of-thought prompting, and role-playing can significantly improve model performance on specific tasks.",
      "When integrating LLMs into applications, consider factors like latency, cost, and reliability. API rate limits, token costs, and potential downtime should all factor into your architecture decisions.",
      "The future of LLMs includes developments in multimodal capabilities, improved reasoning, and more efficient architectures. Staying informed about these advances will help you make better decisions about when and how to incorporate AI into your projects."
    ],
    tags: ["AI", "Machine Learning", "LLM", "GPT", "Natural Language Processing"],
    readTime: 10
  },
  {
    title: "Building Scalable APIs with Node.js and TypeScript",
    slug: "building-scalable-apis-nodejs-typescript",
    excerpt: "Learn how to design and implement robust, type-safe APIs using Node.js and TypeScript with modern best practices.",
    content: [
      "Building scalable APIs requires careful consideration of architecture, type safety, and performance. Node.js combined with TypeScript provides an excellent foundation for creating robust backend services.",
      "Start with a solid project structure. Organize your code into layers: controllers handle HTTP requests, services contain business logic, and repositories manage data access. This separation of concerns makes your code more maintainable and testable.",
      "TypeScript brings static typing to JavaScript, catching errors at compile time rather than runtime. Define interfaces for your API requests and responses, and use strict TypeScript configuration to maximize type safety benefits.",
      "Implement proper error handling with custom error classes and middleware. Consistent error responses make your API easier to consume and debug. Consider using libraries like http-errors for standardized error handling.",
      "Validation is crucial for API security and reliability. Libraries like Joi or Zod can validate incoming requests against schemas, ensuring data integrity and providing clear error messages for invalid inputs.",
      "For database interactions, consider using an ORM like Prisma or TypeORM. These tools provide type-safe database queries and help prevent SQL injection attacks while maintaining good performance.",
      "Implement proper logging and monitoring from the start. Libraries like Winston for logging and tools like Prometheus for metrics collection will help you understand your API's behavior in production.",
      "Don't forget about documentation. Tools like Swagger/OpenAPI can generate interactive documentation from your code, making it easier for other developers to understand and use your API."
    ],
    tags: ["Node.js", "TypeScript", "API", "Backend", "Scalability"],
    readTime: 12
  }
];

/**
 * Add sample AI-generated posts to the blog system for demonstration
 */
export const addSampleAIBlogPosts = (): void => {
  console.log('Adding sample AI-generated blog posts...');
  
  sampleAIBlogPosts.forEach(post => {
    const savedPost = addAIGeneratedPost(post);
    console.log(`Added: ${savedPost.title} (ID: ${savedPost.id})`);
  });
  
  const stats = getBlogStats(blogPosts);
  console.log('Blog Statistics:', stats);
};

/**
 * Get all blog posts including AI-generated ones for demonstration
 */
export const getDemoBlogPosts = () => {
  return getAllBlogPosts(blogPosts);
};

/**
 * Simulate AI blog generation for demo purposes
 */
export const simulateAIBlogGeneration = async (topic: string): Promise<BlogGenerationResponse> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Generate a simple blog post based on the topic
  const slug = topic.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-');
  
  return {
    title: topic,
    slug,
    excerpt: `A comprehensive guide to ${topic.toLowerCase()}, covering key concepts and practical applications.`,
    content: [
      `${topic} is an important concept in modern software development that every developer should understand.`,
      `In this article, we'll explore the fundamentals of ${topic.toLowerCase()} and how it can be applied in real-world scenarios.`,
      `Understanding ${topic.toLowerCase()} requires a solid foundation in programming principles and best practices.`,
      `Let's dive into the key aspects that make ${topic.toLowerCase()} so valuable for developers today.`,
      `By the end of this guide, you'll have a clear understanding of how to implement ${topic.toLowerCase()} in your own projects.`
    ],
    tags: topic.split(' ').slice(0, 3).concat(['Programming', 'Tutorial']),
    readTime: Math.ceil(Math.random() * 10) + 5
  };
};

/**
 * Demo function to show blog persistence in action
 */
export const demoBlogPersistence = async (): Promise<{
  success: boolean;
  message: string;
  stats: any;
}> => {
  try {
    console.log('🚀 Starting blog persistence demo...');
    
    // Get initial stats
    const initialStats = getBlogStats(blogPosts);
    console.log('Initial stats:', initialStats);
    
    // Add sample posts
    addSampleAIBlogPosts();
    
    // Get updated stats
    const finalStats = getBlogStats(blogPosts);
    console.log('Final stats:', finalStats);
    
    // Get all posts to verify persistence
    const allPosts = getAllBlogPosts(blogPosts);
    console.log(`Total posts after demo: ${allPosts.length}`);
    
    return {
      success: true,
      message: `Successfully added ${sampleAIBlogPosts.length} AI-generated posts to the blog system!`,
      stats: {
        initial: initialStats,
        final: finalStats,
        totalPosts: allPosts.length,
        aiGeneratedPosts: finalStats.aiGenerated
      }
    };
  } catch (error) {
    return {
      success: false,
      message: `Demo failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      stats: null
    };
  }
};

/**
 * Clear all demo content (useful for testing)
 */
export const clearDemoContent = (): void => {
  // This would clear the AI-generated posts from the blog system
  console.log('Demo content cleared');
};
