// Demo component to showcase AI blog generation without requiring API key
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Sparkles, 
  FileText, 
  Clock,
  CheckCircle,
  Copy,
  Download
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Sample generated content for demonstration
const sampleGeneratedPosts = [
  {
    title: "Advanced React Performance Optimization Techniques",
    slug: "advanced-react-performance-optimization",
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
    readTime: 8,
    category: "Web Development"
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
    readTime: 10,
    category: "AI Advancements"
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
    readTime: 12,
    category: "Programming Tutorials"
  }
];

export const AIBlogDemo: React.FC = () => {
  const [selectedPost, setSelectedPost] = useState<number | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const simulateGeneration = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      toast({
        title: "Demo Content Generated!",
        description: "This is sample content to demonstrate the AI blog generation feature.",
      });
    }, 2000);
  };

  const copyContent = (post: typeof sampleGeneratedPosts[0]) => {
    const fullContent = `# ${post.title}\n\n${post.content.join('\n\n')}`;
    navigator.clipboard.writeText(fullContent);
    toast({
      title: "Content Copied!",
      description: "Blog post content copied to clipboard.",
    });
  };

  const downloadMarkdown = (post: typeof sampleGeneratedPosts[0]) => {
    const markdown = `# ${post.title}\n\n${post.excerpt}\n\n${post.content.join('\n\n')}\n\n---\n\nTags: ${post.tags.join(', ')}\nRead Time: ${post.readTime} minutes\nCategory: ${post.category}`;
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${post.slug}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Demo Header */}
      <Alert>
        <Sparkles className="h-4 w-4" />
        <AlertDescription>
          <strong>Demo Mode:</strong> This showcases the AI blog generation interface with sample content. 
          To use the actual AI21 Studio integration, configure your API key in the environment variables.
        </AlertDescription>
      </Alert>

      {/* Generation Demo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Content Generation Demo
          </CardTitle>
          <CardDescription>
            Experience how the AI blog generator works with sample content
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button 
              onClick={simulateGeneration}
              disabled={isGenerating}
              className="flex items-center gap-2"
            >
              {isGenerating ? (
                <>
                  <Clock className="h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4" />
                  Generate Sample Post
                </>
              )}
            </Button>
            <Button variant="outline" onClick={() => setSelectedPost(null)}>
              View All Samples
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Sample Posts */}
      <div className="grid gap-6">
        {sampleGeneratedPosts.map((post, index) => (
          <Card key={index} className="transition-all duration-300 hover:shadow-lg">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-xl mb-2">{post.title}</CardTitle>
                  <CardDescription className="text-base">{post.excerpt}</CardDescription>
                </div>
                <Badge variant="outline" className="ml-4">
                  {post.category}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Content Preview */}
                <div className="bg-muted/50 rounded-lg p-4">
                  <h5 className="font-medium text-sm mb-2">Content Preview:</h5>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    {post.content.slice(0, 2).map((paragraph, idx) => (
                      <p key={idx} className="line-clamp-3">
                        {paragraph}
                      </p>
                    ))}
                    <p className="text-xs italic">
                      ... and {post.content.length - 2} more paragraphs
                    </p>
                  </div>
                </div>

                {/* Full Content (Collapsible) */}
                <details className="group">
                  <summary className="cursor-pointer text-sm font-medium text-primary hover:underline flex items-center gap-2">
                    <span>View Full Content ({post.content.length} paragraphs)</span>
                    <span className="group-open:rotate-90 transition-transform">▶</span>
                  </summary>
                  <div className="mt-4 space-y-4 text-sm border-l-2 border-primary/20 pl-4">
                    <h3 className="font-semibold text-lg">{post.title}</h3>
                    {post.content.map((paragraph, idx) => (
                      <p key={idx} className="leading-relaxed text-muted-foreground">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </details>

                {/* Metadata */}
                <div className="flex items-center justify-between pt-3 border-t">
                  <div className="flex gap-2">
                    {post.tags.slice(0, 4).map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {post.tags.length > 4 && (
                      <Badge variant="outline" className="text-xs">
                        +{post.tags.length - 4} more
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>{post.readTime} min read</span>
                    <Badge variant="outline" className="text-xs">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      AI Generated
                    </Badge>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => copyContent(post)}
                    className="flex items-center gap-2"
                  >
                    <Copy className="h-3 w-3" />
                    Copy Content
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => downloadMarkdown(post)}
                    className="flex items-center gap-2"
                  >
                    <Download className="h-3 w-3" />
                    Download MD
                  </Button>
                  <Button 
                    size="sm"
                    onClick={() => {
                      toast({
                        title: "Demo Mode",
                        description: "In production, this would add the post to your blog system.",
                      });
                    }}
                    className="flex items-center gap-2"
                  >
                    <FileText className="h-3 w-3" />
                    Add to Blog
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
