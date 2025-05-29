// Blog integration utilities for AI-generated content
import { BlogPost } from '@/data/blogPosts';
import { BlogGenerationResponse } from '@/types/blog';

// In-memory storage for AI-generated posts (in production, this would be a database)
let aiGeneratedPosts: BlogPost[] = [];
let nextId = 1000; // Start AI-generated posts with ID 1000+

// Load posts from localStorage on initialization
const loadPostsFromStorage = () => {
  try {
    const stored = localStorage.getItem('ai-generated-posts');
    if (stored) {
      const posts = JSON.parse(stored) as BlogPost[];
      aiGeneratedPosts = posts;
      if (posts.length > 0) {
        nextId = Math.max(...posts.map(p => p.id)) + 1;
      }
      console.log(`Loaded ${posts.length} AI-generated posts from storage`);
    }
  } catch (error) {
    console.error('Failed to load posts from storage:', error);
  }
};

// Save posts to localStorage
const savePostsToStorage = () => {
  try {
    localStorage.setItem('ai-generated-posts', JSON.stringify(aiGeneratedPosts));
    console.log(`Saved ${aiGeneratedPosts.length} AI-generated posts to storage`);
  } catch (error) {
    console.error('Failed to save posts to storage:', error);
  }
};

// Initialize storage
loadPostsFromStorage();

/**
 * Convert AI-generated response to BlogPost format
 */
export const convertToBlogPost = (
  aiPost: BlogGenerationResponse,
  category: string = 'ai-generated'
): BlogPost => {
  const id = nextId++;
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return {
    id,
    title: aiPost.title,
    slug: aiPost.slug,
    date: currentDate,
    excerpt: aiPost.excerpt,
    content: aiPost.content,
    // Add metadata to distinguish AI-generated posts
    category,
    isAIGenerated: true,
    aiModel: 'Advanced AI Model',
    generatedAt: new Date().toISOString()
  };
};

/**
 * Add AI-generated post to the blog system
 */
export const addAIGeneratedPost = (aiPost: BlogGenerationResponse): BlogPost => {
  const blogPost = convertToBlogPost(aiPost);
  aiGeneratedPosts.unshift(blogPost); // Add to beginning of array

  // Keep only the last 50 AI-generated posts to prevent memory issues
  if (aiGeneratedPosts.length > 50) {
    aiGeneratedPosts = aiGeneratedPosts.slice(0, 50);
  }

  // Save to localStorage for persistence
  savePostsToStorage();

  console.log(`Added AI-generated post: "${blogPost.title}" (ID: ${blogPost.id})`);

  return blogPost;
};

/**
 * Get all AI-generated posts
 */
export const getAIGeneratedPosts = (): BlogPost[] => {
  return [...aiGeneratedPosts];
};

/**
 * Get combined blog posts (existing + AI-generated)
 */
export const getAllBlogPosts = (existingPosts: BlogPost[]): BlogPost[] => {
  const combined = [...aiGeneratedPosts, ...existingPosts];

  // Sort by date (newest first)
  return combined.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateB.getTime() - dateA.getTime();
  });
};

/**
 * Find a blog post by slug (checks both AI-generated and existing posts)
 */
export const findPostBySlug = (slug: string, existingPosts: BlogPost[]): BlogPost | undefined => {
  // First check AI-generated posts
  const aiPost = aiGeneratedPosts.find(post => post.slug === slug);
  if (aiPost) return aiPost;

  // Then check existing posts
  return existingPosts.find(post => post.slug === slug);
};

/**
 * Get recent AI-generated posts
 */
export const getRecentAIGeneratedPosts = (limit: number = 5): BlogPost[] => {
  return aiGeneratedPosts.slice(0, limit);
};

/**
 * Clear all AI-generated posts (useful for testing)
 */
export const clearAIGeneratedPosts = (): void => {
  aiGeneratedPosts = [];
  nextId = 1000;
  savePostsToStorage();
  console.log('Cleared all AI-generated posts');
};

/**
 * Fix malformed posts that might have JSON content instead of proper arrays
 */
export const fixMalformedPosts = (): number => {
  let fixedCount = 0;

  aiGeneratedPosts = aiGeneratedPosts.map(post => {
    // Check if content is malformed (contains JSON strings instead of proper content)
    if (Array.isArray(post.content)) {
      const hasJsonContent = post.content.some(paragraph =>
        typeof paragraph === 'string' &&
        (paragraph.includes('"title":') || paragraph.includes('"content":') || paragraph.includes('"excerpt":'))
      );

      if (hasJsonContent) {
        // Try to extract readable content from JSON-like strings
        const cleanContent = post.content
          .filter(paragraph => typeof paragraph === 'string')
          .map(paragraph => {
            // Remove JSON-like patterns and extract readable text
            return paragraph
              .replace(/"[^"]*":\s*"/g, '') // Remove JSON keys
              .replace(/[{}[\]]/g, '') // Remove JSON brackets
              .replace(/,\s*"/g, '. ') // Replace commas with periods
              .replace(/"/g, '') // Remove remaining quotes
              .trim();
          })
          .filter(paragraph => paragraph.length > 20 && !paragraph.includes('title') && !paragraph.includes('excerpt'))
          .slice(0, 10); // Limit to reasonable number of paragraphs

        if (cleanContent.length > 0) {
          post.content = cleanContent;
          fixedCount++;
        }
      }
    }

    return post;
  });

  if (fixedCount > 0) {
    savePostsToStorage();
    console.log(`Fixed ${fixedCount} malformed posts`);
  }

  return fixedCount;
};

/**
 * Get blog post statistics
 */
export const getBlogStats = (existingPosts: BlogPost[]) => {
  const totalPosts = existingPosts.length + aiGeneratedPosts.length;
  const aiGeneratedCount = aiGeneratedPosts.length;
  const existingCount = existingPosts.length;

  return {
    total: totalPosts,
    aiGenerated: aiGeneratedCount,
    existing: existingCount,
    aiPercentage: totalPosts > 0 ? Math.round((aiGeneratedCount / totalPosts) * 100) : 0
  };
};

/**
 * Export AI-generated posts as JSON (for backup/migration)
 */
export const exportAIGeneratedPosts = (): string => {
  return JSON.stringify(aiGeneratedPosts, null, 2);
};

/**
 * Import AI-generated posts from JSON (for backup/migration)
 */
export const importAIGeneratedPosts = (jsonData: string): boolean => {
  try {
    const posts = JSON.parse(jsonData) as BlogPost[];

    // Validate the data structure
    if (!Array.isArray(posts)) {
      throw new Error('Invalid data format: expected array');
    }

    // Validate each post has required fields
    for (const post of posts) {
      if (!post.id || !post.title || !post.slug || !post.content) {
        throw new Error('Invalid post format: missing required fields');
      }
    }

    aiGeneratedPosts = posts;

    // Update nextId to avoid conflicts
    if (posts.length > 0) {
      const maxId = Math.max(...posts.map(p => p.id));
      nextId = maxId + 1;
    }

    return true;
  } catch (error) {
    console.error('Failed to import AI-generated posts:', error);
    return false;
  }
};

/**
 * Search through all blog posts (AI-generated and existing)
 */
export const searchBlogPosts = (
  query: string,
  existingPosts: BlogPost[]
): BlogPost[] => {
  const allPosts = getAllBlogPosts(existingPosts);
  const searchTerm = query.toLowerCase();

  return allPosts.filter(post =>
    post.title.toLowerCase().includes(searchTerm) ||
    post.excerpt.toLowerCase().includes(searchTerm) ||
    post.content.some(paragraph =>
      paragraph.toLowerCase().includes(searchTerm)
    )
  );
};

/**
 * Get posts by category (for AI-generated posts)
 */
export const getPostsByCategory = (category: string): BlogPost[] => {
  return aiGeneratedPosts.filter(post =>
    post.category === category
  );
};

/**
 * Update an AI-generated post
 */
export const updateAIGeneratedPost = (
  id: number,
  updates: Partial<BlogPost>
): BlogPost | null => {
  const index = aiGeneratedPosts.findIndex(post => post.id === id);

  if (index === -1) {
    return null;
  }

  aiGeneratedPosts[index] = {
    ...aiGeneratedPosts[index],
    ...updates
  };

  return aiGeneratedPosts[index];
};

/**
 * Delete an AI-generated post
 */
export const deleteAIGeneratedPost = (id: number): boolean => {
  const index = aiGeneratedPosts.findIndex(post => post.id === id);

  if (index === -1) {
    return false;
  }

  aiGeneratedPosts.splice(index, 1);
  return true;
};

/**
 * Check if a slug already exists
 */
export const isSlugUnique = (slug: string, existingPosts: BlogPost[]): boolean => {
  const existsInAI = aiGeneratedPosts.some(post => post.slug === slug);
  const existsInExisting = existingPosts.some(post => post.slug === slug);

  return !existsInAI && !existsInExisting;
};

/**
 * Generate a unique slug if the provided one already exists
 */
export const ensureUniqueSlug = (baseSlug: string, existingPosts: BlogPost[]): string => {
  if (isSlugUnique(baseSlug, existingPosts)) {
    return baseSlug;
  }

  let counter = 1;
  let newSlug = `${baseSlug}-${counter}`;

  while (!isSlugUnique(newSlug, existingPosts)) {
    counter++;
    newSlug = `${baseSlug}-${counter}`;
  }

  return newSlug;
};
