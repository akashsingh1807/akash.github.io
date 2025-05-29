
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Brain,
  Eye,
  Target,
  BookOpen,
  Sparkles,
  ArrowRight,
  Zap,
  Code,
  Cpu
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { AIBlogManager } from '@/components/AIBlogManager';
import { BlogGenerationResponse } from '@/types/blog';
import { blogPosts } from '@/data/blogPosts';
import { InlineFormattedContent } from '@/components/FormattedContent';
import { addAIGeneratedPost, clearAIGeneratedPosts, fixMalformedPosts } from '@/utils/blogIntegration';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';

export const AIFeaturesPage = () => {
  const [recentlyGenerated, setRecentlyGenerated] = useState<BlogGenerationResponse[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handlePostGenerated = (post: BlogGenerationResponse) => {
    setRecentlyGenerated(prev => [post, ...prev.slice(0, 4)]); // Keep last 5 posts
  };

  // Demo function to add sample content
  const addDemoContent = () => {
    const demoPost: BlogGenerationResponse = {
      title: "Demo: **Advanced React Performance** Optimization",
      slug: "demo-advanced-react-performance-optimization",
      excerpt: "A demonstration of how **formatted content** works with `code examples` and proper styling.",
      content: [
        "This is a **demo blog post** to show how the persistence and formatting works. Notice how the **bold text** is properly rendered.",
        "Here's some `inline code` and a code block example with proper syntax highlighting:\n\n```javascript\nconst optimizeReact = () => {\n  return useMemo(() => {\n    return expensiveCalculation();\n  }, [dependency]);\n};\n\n// Example of React component optimization\nconst MyComponent = React.memo(({ data }) => {\n  const processedData = useMemo(() => {\n    return data.map(item => ({ ...item, processed: true }));\n  }, [data]);\n\n  return <div>{processedData.map(item => <span key={item.id}>{item.name}</span>)}</div>;\n});\n```",
        "You can also include **TypeScript** examples:\n\n```typescript\ninterface User {\n  id: number;\n  name: string;\n  email: string;\n}\n\nconst fetchUser = async (id: number): Promise<User> => {\n  const response = await fetch(`/api/users/${id}`);\n  return response.json();\n};\n```",
        "And **Python** code blocks work too:\n\n```python\ndef fibonacci(n: int) -> int:\n    if n <= 1:\n        return n\n    return fibonacci(n-1) + fibonacci(n-2)\n\n# Using memoization for better performance\nfrom functools import lru_cache\n\n@lru_cache(maxsize=None)\ndef fibonacci_optimized(n: int) -> int:\n    if n <= 1:\n        return n\n    return fibonacci_optimized(n-1) + fibonacci_optimized(n-2)\n```",
        "The content should be **properly formatted** with good spacing and alignment. This demonstrates that both *persistence* and *formatting* are working correctly with proper code block rendering.",
        "You can find this post in the `/blog` section after it's added. The post will have an **AI Generated** badge to distinguish it from regular posts."
      ],
      tags: ["Demo", "React", "Performance", "Formatting"],
      readTime: 3
    };

    const savedPost = addAIGeneratedPost(demoPost);
    queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
    setRecentlyGenerated(prev => [demoPost, ...prev.slice(0, 4)]);

    toast({
      title: "Demo Content Added!",
      description: "Check the blog page to see the formatted demo post with persistence.",
    });
  };

  // Function to fix malformed posts
  const fixPosts = () => {
    const fixedCount = fixMalformedPosts();
    queryClient.invalidateQueries({ queryKey: ['blogPosts'] });

    toast({
      title: "Posts Fixed!",
      description: `Fixed ${fixedCount} malformed posts. Check the blog page to see the improvements.`,
    });
  };

  // Function to clear all AI posts
  const clearPosts = () => {
    clearAIGeneratedPosts();
    queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
    setRecentlyGenerated([]);

    toast({
      title: "Posts Cleared!",
      description: "All AI-generated posts have been removed.",
    });
  };

  const aiCapabilities = [
    {
      icon: <Brain className="h-6 w-6 text-blue-500" />,
      title: "Natural Language Processing",
      description: "Advanced text analysis and understanding using modern NLP techniques",
      features: ["Sentiment Analysis", "Text Classification", "Named Entity Recognition", "Language Translation"]
    },
    {
      icon: <Eye className="h-6 w-6 text-green-500" />,
      title: "Computer Vision",
      description: "Image and video processing with deep learning models",
      features: ["Object Detection", "Image Classification", "Facial Recognition", "OCR Processing"]
    },
    {
      icon: <Target className="h-6 w-6 text-purple-500" />,
      title: "Recommendation Systems",
      description: "Intelligent content and product recommendation engines",
      features: ["Collaborative Filtering", "Content-Based Filtering", "Hybrid Models", "Real-time Recommendations"]
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-foreground sm:text-5xl flex items-center justify-center gap-3">
              <Sparkles className="h-10 w-10 text-primary" />
              AI Features & Tech Blog
            </h1>
            <p className="mt-4 text-xl text-muted-foreground max-w-3xl mx-auto">
              Exploring artificial intelligence capabilities and automatically generating
              high-quality technical content using advanced language models
            </p>
          </div>

          <Tabs defaultValue="capabilities" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="capabilities" className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                AI Capabilities
              </TabsTrigger>
              <TabsTrigger value="blog-generator" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Tech Blog Generator
              </TabsTrigger>
              <TabsTrigger value="recent-content" className="flex items-center gap-2">
                <Code className="h-4 w-4" />
                Recent Content
              </TabsTrigger>
            </TabsList>

            {/* AI Capabilities Tab */}
            <TabsContent value="capabilities" className="space-y-8">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {aiCapabilities.map((capability, index) => (
                  <Card key={index} className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        {capability.icon}
                        <CardTitle className="text-lg">{capability.title}</CardTitle>
                      </div>
                      <CardDescription>
                        {capability.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <p className="text-sm text-muted-foreground">Key Features:</p>
                        <div className="flex flex-wrap gap-2">
                          {capability.features.map((feature, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="mt-12 prose prose-lg max-w-4xl mx-auto">
                <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5">
                  <CardContent className="p-8">
                    <div className="flex items-center gap-3 mb-4">
                      <Cpu className="h-6 w-6 text-primary" />
                      <h2 className="text-2xl font-bold m-0">How AI Enhances User Experience</h2>
                    </div>
                    <p className="text-muted-foreground mb-6">
                      Artificial Intelligence technologies enable more intuitive and personalized
                      interactions with digital products. From smart assistants to predictive
                      features, AI can transform how users engage with applications.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button size="lg" asChild>
                        <Link to="/blog">
                          <BookOpen className="h-4 w-4 mr-2" />
                          Explore Tech Blog
                        </Link>
                      </Button>
                      <Button size="lg" variant="outline" onClick={addDemoContent}>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Add Demo Content
                      </Button>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 mt-4">
                      <Button size="sm" variant="secondary" onClick={fixPosts}>
                        Fix Malformed Posts
                      </Button>
                      <Button size="sm" variant="destructive" onClick={clearPosts}>
                        Clear All AI Posts
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Blog Generator Tab */}
            <TabsContent value="blog-generator">
              <AIBlogManager onPostGenerated={handlePostGenerated} />
            </TabsContent>

            {/* Recent Content Tab */}
            <TabsContent value="recent-content" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recently Generated Posts */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-primary" />
                      AI-Generated Posts
                    </CardTitle>
                    <CardDescription>
                      Latest content created using AI21 Studio
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {recentlyGenerated.length === 0 ? (
                      <div className="text-center py-8">
                        <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">
                          No AI-generated posts yet. Use the Blog Generator to create content!
                        </p>
                        <Button className="mt-4" variant="outline" size="sm">
                          <ArrowRight className="h-4 w-4 mr-2" />
                          Start Generating
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {recentlyGenerated.map((post, index) => (
                          <div key={index} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                            <h4 className="font-semibold text-sm mb-2">{post.title}</h4>
                            <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                              {post.excerpt}
                            </p>

                            {/* Content Preview */}
                            <details className="mb-3">
                              <summary className="cursor-pointer text-xs text-primary hover:underline">
                                Preview Content ({post.content.length} paragraphs)
                              </summary>
                              <div className="mt-2 space-y-2 text-xs text-muted-foreground bg-muted/30 rounded p-2">
                                {post.content.slice(0, 2).map((paragraph, idx) => (
                                  <div key={idx} className="line-clamp-3 prose prose-xs max-w-none">
                                    <InlineFormattedContent content={paragraph} />
                                  </div>
                                ))}
                                {post.content.length > 2 && (
                                  <p className="italic">... and {post.content.length - 2} more paragraphs</p>
                                )}
                              </div>
                            </details>

                            <div className="flex items-center justify-between">
                              <div className="flex gap-1">
                                {post.tags.slice(0, 2).map(tag => (
                                  <Badge key={tag} variant="secondary" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                                {post.tags.length > 2 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{post.tags.length - 2}
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span>{post.readTime} min read</span>
                                <Badge variant="outline" className="text-xs">
                                  AI Generated
                                </Badge>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Existing Blog Posts */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-blue-500" />
                      Existing Blog Posts
                    </CardTitle>
                    <CardDescription>
                      Current blog content in the portfolio
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {blogPosts.slice(0, 3).map((post) => (
                        <div key={post.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                          <h4 className="font-semibold text-sm mb-2">{post.title}</h4>
                          <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                            {post.excerpt}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">{post.date}</span>
                            <Button asChild variant="ghost" size="sm">
                              <Link to={`/blog/${post.slug}`}>
                                Read More
                                <ArrowRight className="h-3 w-3 ml-1" />
                              </Link>
                            </Button>
                          </div>
                        </div>
                      ))}
                      <div className="pt-4 border-t">
                        <Button asChild variant="outline" className="w-full">
                          <Link to="/blog">
                            View All Blog Posts
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Integration Info */}
              <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                      <Cpu className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">
                        AI Content Generation
                      </h3>
                      <p className="text-sm text-green-700 dark:text-green-300 mb-4">
                        This system uses advanced language models to automatically
                        generate high-quality technical content. Generated posts are seamlessly integrated
                        with your existing blog infrastructure.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="border-green-300 text-green-700 dark:border-green-700 dark:text-green-300">
                          Advanced AI Models
                        </Badge>
                        <Badge variant="outline" className="border-green-300 text-green-700 dark:border-green-700 dark:text-green-300">
                          Large Context Window
                        </Badge>
                        <Badge variant="outline" className="border-green-300 text-green-700 dark:border-green-700 dark:text-green-300">
                          Vercel Compatible
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AIFeaturesPage;
