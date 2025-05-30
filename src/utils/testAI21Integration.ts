/**
 * Test utilities for AI21 Studio integration
 * This file contains testing functions and should be moved to __tests__ directory in production
 */

import { ai21BlogService } from '@/services/ai21BlogService';
import { BLOG_CATEGORIES } from '@/config/blogConfig';
import { BlogGenerationRequest } from '@/types/blog';
import { addAIGeneratedPost, getAllBlogPosts, getBlogStats } from '@/utils/blogIntegration';
import { blogPosts } from '@/data/blogPosts';
import { logger } from '@/utils/logger';


/**
 * Test result interface
 */
interface TestResult {
  success: boolean;
  message: string;
  details?: unknown;
}

/**
 * Test AI service API connection
 * @returns Promise with test result
 */
export const testAI21Connection = async (): Promise<TestResult> => {
  try {
    logger.debug('Testing AI service connection...', undefined, 'testAI21Integration');

    const isConnected = await ai21BlogService.testConnection();

    if (isConnected) {
      return {
        success: true,
        message: '✅ AI service connection successful!'
      };
    } else {
      return {
        success: false,
        message: '❌ AI service connection failed. Please check your API key.'
      };
    }
  } catch (error) {
    logger.error('Error testing AI connection', error, 'testAI21Integration');
    return {
      success: false,
      message: '❌ Error testing AI connection',
      details: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

/**
 * Test blog post generation
 */
export const testBlogGeneration = async (): Promise<{
  success: boolean;
  message: string;
  post?: any;
  details?: any;
}> => {
  try {
    console.log('🔄 Testing blog post generation...');

    // Use a simple test topic
    const testRequest: BlogGenerationRequest = {
      topic: 'Introduction to React Hooks',
      category: BLOG_CATEGORIES[0] || BLOG_CATEGORIES.find(cat => cat.id === 'web-development')!, // Web Development
      targetAudience: 'intermediate',
      wordCount: 800,
      includeCodeExamples: true,
      tone: 'professional',
      keywords: ['react', 'hooks', 'javascript']
    };

    const generatedPost = await ai21BlogService.generateBlogPost(testRequest);

    // Validate the generated post
    if (!generatedPost.title || !generatedPost.content || generatedPost.content.length === 0) {
      return {
        success: false,
        message: '❌ Generated post is missing required fields',
        details: generatedPost
      };
    }

    return {
      success: true,
      message: '✅ Blog post generation successful!',
      post: {
        title: generatedPost.title,
        excerpt: generatedPost.excerpt,
        contentLength: generatedPost.content.length,
        tags: generatedPost.tags,
        readTime: generatedPost.readTime
      }
    };
  } catch (error) {
    return {
      success: false,
      message: '❌ Error generating blog post',
      details: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

/**
 * Test blog integration
 */
export const testBlogIntegration = async (): Promise<{
  success: boolean;
  message: string;
  stats?: any;
  details?: any;
}> => {
  try {
    console.log('🔄 Testing blog integration...');

    // Generate a test post
    const testRequest: BlogGenerationRequest = {
      topic: 'Testing AI Blog Integration',
      category: BLOG_CATEGORIES[1] || BLOG_CATEGORIES.find(cat => cat.id === 'ai-ml')!, // AI Advancements
      targetAudience: 'beginner',
      wordCount: 600,
      includeCodeExamples: false,
      tone: 'casual'
    };

    const generatedPost = await ai21BlogService.generateBlogPost(testRequest);

    // Add to blog system
    const blogPost = addAIGeneratedPost(generatedPost);

    // Get combined posts
    const allPosts = getAllBlogPosts(blogPosts);

    // Get statistics
    const stats = getBlogStats(blogPosts);

    return {
      success: true,
      message: '✅ Blog integration successful!',
      stats: {
        totalPosts: allPosts.length,
        aiGenerated: stats.aiGenerated,
        existing: stats.existing,
        newPostId: blogPost.id,
        newPostTitle: blogPost.title
      }
    };
  } catch (error) {
    return {
      success: false,
      message: '❌ Error testing blog integration',
      details: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

/**
 * Test multiple post generation
 */
export const testBatchGeneration = async (): Promise<{
  success: boolean;
  message: string;
  posts?: any[];
  details?: any;
}> => {
  try {
    console.log('🔄 Testing batch generation...');

    const category = BLOG_CATEGORIES[0]; // Web Development
    const topics = [
      'Modern CSS Grid Layouts',
      'JavaScript ES2024 Features',
      'React Performance Tips'
    ];

    const posts = await ai21BlogService.generateMultiplePosts(topics, category || BLOG_CATEGORIES.find(cat => cat.id === 'web-development')!);

    if (posts.length === 0) {
      return {
        success: false,
        message: '❌ No posts were generated in batch'
      };
    }

    return {
      success: true,
      message: `✅ Batch generation successful! Generated ${posts.length} posts.`,
      posts: posts.map(post => ({
        title: post.title,
        excerpt: post.excerpt.substring(0, 100) + '...',
        tags: post.tags.slice(0, 3)
      }))
    };
  } catch (error) {
    return {
      success: false,
      message: '❌ Error in batch generation',
      details: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

/**
 * Run comprehensive test suite
 */
export const runComprehensiveTest = async (): Promise<{
  success: boolean;
  results: any[];
  summary: string;
}> => {
  console.log('🚀 Starting comprehensive AI integration test...\n');

  const results = [];
  let successCount = 0;

  // Test 1: Connection
  const connectionTest = await testAI21Connection();
  results.push({ test: 'Connection', ...connectionTest });
  if (connectionTest.success) successCount++;

  // Test 2: Single post generation (only if connection works)
  if (connectionTest.success) {
    const generationTest = await testBlogGeneration();
    results.push({ test: 'Single Post Generation', ...generationTest });
    if (generationTest.success) successCount++;

    // Test 3: Blog integration (only if generation works)
    if (generationTest.success) {
      const integrationTest = await testBlogIntegration();
      results.push({ test: 'Blog Integration', ...integrationTest });
      if (integrationTest.success) successCount++;

      // Test 4: Batch generation (only if previous tests work)
      if (integrationTest.success) {
        const batchTest = await testBatchGeneration();
        results.push({ test: 'Batch Generation', ...batchTest });
        if (batchTest.success) successCount++;
      }
    }
  }

  const totalTests = results.length;
  const success = successCount === totalTests;

  const summary = success
    ? `🎉 All ${totalTests} tests passed! AI integration is working perfectly.`
    : `⚠️  ${successCount}/${totalTests} tests passed. Some issues need attention.`;

  console.log('\n' + summary);

  return {
    success,
    results,
    summary
  };
};

/**
 * Quick connection test for UI
 */
export const quickConnectionTest = async (): Promise<boolean> => {
  try {
    return await ai21BlogService.testConnection();
  } catch (error) {
    console.error('Quick connection test failed:', error);
    return false;
  }
};

/**
 * Generate sample content for demonstration
 */
export const generateSampleContent = async (): Promise<{
  success: boolean;
  posts: any[];
  message: string;
}> => {
  try {
    const sampleTopics = [
      'Getting Started with TypeScript',
      'Building REST APIs with Node.js',
      'Introduction to Machine Learning'
    ];

    const posts = [];

    for (const topic of sampleTopics) {
      const request: BlogGenerationRequest = {
        topic,
        category: BLOG_CATEGORIES[0] || BLOG_CATEGORIES.find(cat => cat.id === 'web-development')!,
        targetAudience: 'intermediate',
        wordCount: 1000,
        includeCodeExamples: true,
        tone: 'professional'
      };

      try {
        const post = await ai21BlogService.generateBlogPost(request);
        posts.push(post);

        // Add delay between requests
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`Failed to generate post for topic "${topic}":`, error);
      }
    }

    return {
      success: posts.length > 0,
      posts,
      message: `Generated ${posts.length} sample posts successfully!`
    };
  } catch (error) {
    return {
      success: false,
      posts: [],
      message: `Failed to generate sample content: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
};
