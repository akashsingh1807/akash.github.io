// AI Blog Generation Service
import { BlogPost, BlogGenerationRequest, BlogGenerationResponse, BlogCategory } from '@/types/blog';
import { processAIResponse } from '@/utils/jsonCodeProcessor';

export interface AI21ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AI21ChatResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export class AI21BlogService {
  private apiKey: string;
  private baseUrl = 'https://api.ai21.com/studio/v1';

  constructor() {
    this.apiKey = import.meta.env.VITE_AI21_API_KEY || process.env.AI21_API_KEY || '';
    if (!this.apiKey) {
      console.warn('AI API key not found. Blog generation will not work.');
    }
  }

  /**
   * Test the AI21 API connection
   */
  async testConnection(): Promise<boolean> {
    try {
      const response = await this.makeRequest('/chat/completions', {
        model: 'jamba-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant.'
          },
          {
            role: 'user',
            content: 'Hello, this is a test message.'
          }
        ],
        max_tokens: 50,
        temperature: 0.7
      });

      return response.choices && response.choices.length > 0;
    } catch (error) {
      console.error('AI21 connection test failed:', error);
      return false;
    }
  }

  /**
   * Generate a blog post using AI21 Studio
   */
  async generateBlogPost(request: BlogGenerationRequest): Promise<BlogGenerationResponse> {
    const systemPrompt = this.createSystemPrompt(request);
    const userPrompt = this.createUserPrompt(request);

    try {
      const response = await this.makeRequest('/chat/completions', {
        model: 'jamba-large', // Using the larger model for better content quality
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: 4000, // Increased for comprehensive blog posts
        temperature: 0.7,
        top_p: 0.9
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No content generated from AI service');
      }

      return this.parseGeneratedContent(content, request);
    } catch (error) {
      console.error('Blog generation failed:', error);
      throw new Error(`Failed to generate blog post: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Generate multiple blog posts for different categories
   */
  async generateMultiplePosts(topics: string[], category: BlogCategory): Promise<BlogGenerationResponse[]> {
    const posts: BlogGenerationResponse[] = [];

    for (const topic of topics) {
      try {
        const request: BlogGenerationRequest = {
          topic,
          category,
          targetAudience: 'intermediate',
          wordCount: 1200,
          includeCodeExamples: true,
          tone: 'professional',
          keywords: this.extractKeywords(topic)
        };

        const post = await this.generateBlogPost(request);
        posts.push(post);

        // Add delay to respect rate limits
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        console.error(`Failed to generate post for topic "${topic}":`, error);
      }
    }

    return posts;
  }

  /**
   * Make HTTP request to AI21 API
   */
  private async makeRequest(endpoint: string, data: any): Promise<AI21ChatResponse> {
    if (!this.apiKey) {
      throw new Error('AI API key not configured');
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`AI API error: ${response.status} - ${errorText}`);
    }

    return response.json();
  }

  /**
   * Create system prompt for blog generation
   */
  private createSystemPrompt(request: BlogGenerationRequest): string {
    return `You are an expert technical writer specializing in ${request.category.name.toLowerCase()}.
Your task is to create high-quality, authoritative blog posts that are:

- Written for ${request.targetAudience} developers
- Approximately ${request.wordCount} words
- ${request.tone} in tone
- ${request.includeCodeExamples ? 'Include practical code examples' : 'Focus on concepts without code'}
- Well-structured with clear headings and flow
- Technically accurate and up-to-date
- Engaging and actionable

IMPORTANT: Format your response as a valid JSON object with this exact structure:
{
  "title": "Compelling blog post title",
  "excerpt": "Brief summary in 150-200 characters",
  "content": ["Array of paragraphs, each as a separate string"],
  "tags": ["Array of relevant tags"],
  "readTime": estimated_read_time_in_minutes
}

CRITICAL CODE FORMATTING RULES:
When explaining programming concepts that include code implementations:
1. **Explain the concept** clearly in plain text within the content paragraphs
2. **Include code in separate paragraphs** using proper markdown code blocks
3. **Use explicit language syntax** (e.g., \`\`\`javascript, \`\`\`python, \`\`\`java)
4. **Ensure code is well-formatted** with proper indentation and syntax
5. **Do NOT use JSON escape characters** in code blocks (no \\n, \\", etc.)

Example structure for content array:
[
  "ArrayList is a dynamic array implementation in Java that grows automatically.",
  "\`\`\`java\\npublic class ArrayList<E> {\\n    private Object[] elements;\\n    private int size = 0;\\n\\n    public void add(E element) {\\n        ensureCapacity();\\n        elements[size++] = element;\\n    }\\n}\\n\`\`\`",
  "This implementation provides O(1) amortized insertion time."
]

Rules:
- Return ONLY the JSON object, no additional text
- Each paragraph should be complete and well-formed
- Separate explanatory text from code examples into different paragraphs
- Use \\n for line breaks within code blocks in JSON
- Use \`backticks\` for inline code references
- Ensure content is original, informative, and provides real value
- Do not wrap the JSON in markdown code blocks`;
  }

  /**
   * Create user prompt for specific topic
   */
  private createUserPrompt(request: BlogGenerationRequest): string {
    const keywordsText = request.keywords?.length ?
      `\nInclude these keywords naturally: ${request.keywords.join(', ')}` : '';

    return `Write a comprehensive blog post about "${request.topic}".${keywordsText}

The post should cover:
- Introduction to the topic
- Key concepts and principles
- ${request.includeCodeExamples ? 'Practical examples with code snippets' : 'Real-world applications'}
- Best practices and common pitfalls
- Conclusion with actionable takeaways

Target audience: ${request.targetAudience} developers
Tone: ${request.tone}
Word count: approximately ${request.wordCount} words`;
  }

  /**
   * Parse the generated content from AI21 response
   */
  private parseGeneratedContent(content: string, request: BlogGenerationRequest): BlogGenerationResponse {
    try {
      // Clean the content first - remove any markdown code block markers
      let cleanContent = content.trim();
      if (cleanContent.startsWith('```json')) {
        cleanContent = cleanContent.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      }
      if (cleanContent.startsWith('```')) {
        cleanContent = cleanContent.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }

      // Try to parse as JSON first
      const parsed = JSON.parse(cleanContent);

      // Validate required fields
      if (!parsed.title || !parsed.content || !Array.isArray(parsed.content)) {
        throw new Error('Invalid response format');
      }

      // Process the response to handle JSON-escaped code blocks
      const processedResponse = processAIResponse(parsed);

      return {
        title: processedResponse.title,
        content: processedResponse.content,
        excerpt: processedResponse.excerpt || this.generateExcerpt(processedResponse.content[0] || ''),
        tags: processedResponse.tags || this.generateTags(request.topic),
        readTime: processedResponse.readTime || this.calculateReadTime(processedResponse.content.join(' ')),
        slug: this.generateSlug(processedResponse.title)
      };
    } catch (error) {
      console.warn('Failed to parse as JSON, falling back to plain text parsing:', error);
      // Fallback: parse as plain text
      return this.parseAsPlainText(content, request);
    }
  }

  /**
   * Fallback parser for plain text responses
   */
  private parseAsPlainText(content: string, request: BlogGenerationRequest): BlogGenerationResponse {
    // Check if content looks like it contains JSON fields
    if (content.includes('"title":') || content.includes('"content":')) {
      // Try to extract JSON-like content
      try {
        // Look for patterns like "title": "value" and extract them
        const titleMatch = content.match(/"title":\s*"([^"]+)"/);
        const excerptMatch = content.match(/"excerpt":\s*"([^"]+)"/);

        // Extract content array - look for content between quotes
        const contentMatches = content.match(/"([^"]{50,})"/g);
        const extractedContent = contentMatches
          ? contentMatches.map(match => match.slice(1, -1)).filter(text =>
              !text.includes('title') &&
              !text.includes('excerpt') &&
              !text.includes('tags') &&
              text.length > 50
            )
          : [];

        if (titleMatch && extractedContent.length > 0) {
          return {
            title: titleMatch[1],
            content: extractedContent,
            excerpt: excerptMatch ? excerptMatch[1] : this.generateExcerpt(extractedContent[0]),
            tags: this.generateTags(request.topic),
            readTime: this.calculateReadTime(extractedContent.join(' ')),
            slug: this.generateSlug(titleMatch[1])
          };
        }
      } catch (error) {
        console.warn('Failed to extract JSON-like content:', error);
      }
    }

    // Standard plain text parsing
    const lines = content.split('\n').filter(line => line.trim());
    const title = lines[0] || request.topic;
    const contentParagraphs = lines.slice(1).filter(line => line.length > 50);

    return {
      title: title.replace(/^#+\s*/, '').replace(/^"/, '').replace(/"$/, ''), // Remove markdown headers and quotes
      content: contentParagraphs.length > 0 ? contentParagraphs : [content],
      excerpt: this.generateExcerpt(contentParagraphs[0] || content),
      tags: this.generateTags(request.topic),
      readTime: this.calculateReadTime(content),
      slug: this.generateSlug(title)
    };
  }

  /**
   * Generate excerpt from content
   */
  private generateExcerpt(text: string): string {
    return text.substring(0, 180).trim() + (text.length > 180 ? '...' : '');
  }

  /**
   * Generate tags from topic
   */
  private generateTags(topic: string): string[] {
    const commonTags = ['programming', 'development', 'tutorial'];
    const topicWords = topic.toLowerCase()
      .split(/[\s\-_]+/)
      .filter(word => word.length > 2);

    return [...new Set([...topicWords.slice(0, 3), ...commonTags])].slice(0, 5);
  }

  /**
   * Calculate estimated read time
   */
  private calculateReadTime(text: string): number {
    const wordsPerMinute = 200;
    const wordCount = text.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  }

  /**
   * Generate URL slug from title
   */
  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  /**
   * Extract keywords from topic
   */
  private extractKeywords(topic: string): string[] {
    return topic
      .toLowerCase()
      .split(/[\s\-_]+/)
      .filter(word => word.length > 2)
      .slice(0, 3);
  }
}

// Export singleton instance
export const ai21BlogService = new AI21BlogService();
