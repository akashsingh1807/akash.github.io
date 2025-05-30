

import { useState } from 'react';
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Calendar,
  Sparkles,
  Brain,
  Eye,
  Target,
  BookOpen,
  ArrowRight,
  Zap,
  Cpu
} from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { blogPosts } from "@/data/blogPosts";
import { getAllBlogPosts, addAIGeneratedPost, clearAIGeneratedPosts, fixMalformedPosts } from "@/utils/blogIntegration";
import { AIBlogManager } from '@/components/AIBlogManager';
import { BlogGenerationResponse } from '@/types/blog';
import { BlogPost } from '@/data/blogPosts';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';

const Blog = () => {
  const [recentlyGenerated, setRecentlyGenerated] = useState<BlogPost[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: posts, isLoading } = useQuery({
    queryKey: ["blogPosts"],
    queryFn: () => Promise.resolve(getAllBlogPosts(blogPosts)),
    refetchInterval: 5000, // Refetch every 5 seconds to pick up new AI posts
  });

  const handlePostGenerated = (post: BlogGenerationResponse) => {
    // The AIBlogManager already calls addAIGeneratedPost, so we just need to track it for recent display
    // We'll get the actual BlogPost from the query invalidation
    setRecentlyGenerated(prev => {
      // Create a temporary BlogPost-like object for display
      const tempPost: BlogPost = {
        id: Date.now(),
        title: post.title,
        slug: post.slug,
        date: new Date().toLocaleDateString(),
        excerpt: post.excerpt,
        content: post.content,
        category: 'ai-generated',
        isAIGenerated: true,
        aiModel: 'AI21 Studio'
      };
      return [tempPost, ...prev.slice(0, 4)]; // Keep last 5 posts
    });
  };

  // Function to clear all AI-generated posts
  const clearPosts = () => {
    clearAIGeneratedPosts();
    queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
    setRecentlyGenerated([]);

    toast({
      title: "Posts Cleared!",
      description: "All AI-generated posts have been removed.",
    });
  };

  // Function to add demo content
  const addDemoContent = () => {
    const demoPost: BlogGenerationResponse = {
      title: "The Future of Web Development with AI",
      content: [
        "Artificial Intelligence is revolutionizing how we approach web development. From automated code generation to intelligent debugging, AI tools are becoming indispensable for modern developers.",
        "**Key Benefits of AI in Development:**",
        "- **Code Generation**: AI can write boilerplate code and suggest implementations",
        "- **Bug Detection**: Advanced algorithms can identify potential issues before they become problems",
        "- **Performance Optimization**: AI analyzes code patterns to suggest performance improvements",
        "```javascript\n// Example: AI-generated React component\nconst SmartButton = ({ onClick, children }) => {\n  return (\n    <button \n      className=\"ai-optimized-btn\"\n      onClick={onClick}\n      aria-label={children}\n    >\n      {children}\n    </button>\n  );\n};\n```",
        "The integration of AI in development workflows is not just a trend—it's the future of how we build digital experiences."
      ],
      excerpt: "Exploring how artificial intelligence is transforming web development practices and developer workflows.",
      slug: `demo-ai-web-development-${Date.now()}`,
      tags: ['AI', 'web development', 'automation'],
      readTime: 5
    };

    const blogPost = addAIGeneratedPost(demoPost);
    queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
    setRecentlyGenerated(prev => [blogPost, ...prev.slice(0, 4)]);

    toast({
      title: "Demo Content Added!",
      description: "Check the All Posts tab to see the formatted demo post with persistence.",
    });
  };

  // Function to fix malformed posts
  const fixPosts = () => {
    const fixedCount = fixMalformedPosts();
    queryClient.invalidateQueries({ queryKey: ['blogPosts'] });

    toast({
      title: "Posts Fixed!",
      description: `Fixed ${fixedCount} malformed posts. Check the All Posts tab to see the improvements.`,
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto pt-20 md:pt-32 pb-16 px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="text-center space-y-6 mb-16">
            <h1 className="text-4xl md:text-5xl font-bold flex items-center justify-center gap-3">
              <Sparkles className="h-10 w-10 md:h-12 md:w-12 text-primary" />
              AI-Powered Content Hub
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Exploring artificial intelligence capabilities and automatically generating
              high-quality technical content using advanced language models
            </p>
          </div>

          <Tabs defaultValue="all-posts" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-12">
              <TabsTrigger value="all-posts" className="flex items-center gap-2 py-3">
                <BookOpen className="h-4 w-4" />
                All Posts
              </TabsTrigger>
              <TabsTrigger value="ai-generator" className="flex items-center gap-2 py-3">
                <Zap className="h-4 w-4" />
                AI Generator
              </TabsTrigger>
              <TabsTrigger value="ai-capabilities" className="flex items-center gap-2 py-3">
                <Brain className="h-4 w-4" />
                AI Capabilities
              </TabsTrigger>
            </TabsList>

            {/* All Posts Tab */}
            <TabsContent value="all-posts">
              <div className="max-w-4xl mx-auto">
                {isLoading ? (
                  <div className="grid gap-8">
                    {[1, 2, 3].map((i) => (
                      <Card key={i} className="animate-pulse">
                        <CardHeader>
                          <div className="h-7 bg-muted rounded w-3/4"></div>
                          <div className="h-4 bg-muted rounded w-1/4 mt-2"></div>
                        </CardHeader>
                        <CardContent>
                          <div className="h-4 bg-muted rounded w-full mb-2"></div>
                          <div className="h-4 bg-muted rounded w-full mb-2"></div>
                          <div className="h-4 bg-muted rounded w-3/4"></div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="grid gap-8">
                    {posts?.map((post) => (
                      <Card
                        key={post.id}
                        className="transition-all duration-300 hover:shadow-md hover:-translate-y-1"
                      >
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <CardTitle className="text-2xl flex-1">
                              <Link
                                to={`/blog/${post.slug}`}
                                className="hover:text-primary transition-colors"
                              >
                                {post.title}
                              </Link>
                            </CardTitle>
                            {post.isAIGenerated && (
                              <div className="flex items-center gap-1 text-xs text-primary bg-primary/10 px-2 py-1 rounded-full ml-3">
                                <Sparkles className="h-3 w-3" />
                                AI Generated
                              </div>
                            )}
                          </div>
                          <CardDescription className="flex items-center gap-1 mt-2">
                            <Calendar className="h-4 w-4" />
                            <span>{post.date}</span>
                            {post.isAIGenerated && post.aiModel && (
                              <>
                                <span className="mx-2">•</span>
                                <span className="text-xs">Generated by {post.aiModel}</span>
                              </>
                            )}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground">{post.excerpt}</p>
                        </CardContent>
                        <CardFooter>
                          <Button asChild variant="outline">
                            <Link to={`/blog/${post.slug}`}>
                              Read more
                            </Link>
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                )}

                <Pagination className="mt-12">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious href="#" />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#" isActive>1</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#">2</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#">3</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationNext href="#" />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </TabsContent>

            {/* AI Generator Tab */}
            <TabsContent value="ai-generator">
              <AIBlogManager onPostGenerated={handlePostGenerated} />
            </TabsContent>

            {/* AI Capabilities Tab */}
            <TabsContent value="ai-capabilities">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {/* AI Capabilities Cards */}
                <Card className="border-primary/20 hover:border-primary/40 transition-colors">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="h-5 w-5 text-primary" />
                      Natural Language Processing
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Advanced language understanding and generation capabilities for creating
                      human-like content and responses.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-primary/20 hover:border-primary/40 transition-colors">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Eye className="h-5 w-5 text-primary" />
                      Content Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Intelligent analysis of content structure, tone, and quality to ensure
                      optimal readability and engagement.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-primary/20 hover:border-primary/40 transition-colors">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-primary" />
                      Personalization
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Tailored content generation based on specific topics, audiences,
                      and technical requirements.
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-12 prose prose-lg max-w-4xl mx-auto">
                <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5">
                  <CardContent className="p-8">
                    <div className="flex items-center gap-3 mb-4">
                      <Cpu className="h-6 w-6 text-primary" />
                      <h2 className="text-2xl font-bold m-0">How AI Enhances Content Creation</h2>
                    </div>
                    <p className="text-muted-foreground mb-6">
                      Artificial Intelligence technologies enable more intuitive and personalized
                      content creation. From automated blog generation to intelligent formatting,
                      AI can transform how we create and consume digital content.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
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

              {/* Recent Content Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
                {/* Recently Generated Posts */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-primary" />
                      Recently Generated
                    </CardTitle>
                    <CardDescription>
                      Latest AI-generated content
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {recentlyGenerated.length === 0 ? (
                      <div className="text-center py-8">
                        <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">
                          No AI-generated posts yet. Use the AI Generator to create content!
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {recentlyGenerated.slice(0, 3).map((post) => (
                          <Link
                            key={post.id}
                            to={`/blog/${post.slug}`}
                            className="group block border rounded-lg p-4 hover:bg-muted/50 transition-colors hover:border-primary/20"
                          >
                            <h4 className="font-semibold text-sm mb-2 hover:text-primary transition-colors">{post.title}</h4>
                            <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                              {post.excerpt}
                            </p>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-muted-foreground">{post.date}</span>
                              <ArrowRight className="h-3 w-3 text-muted-foreground group-hover:text-primary transition-colors" />
                            </div>
                          </Link>
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
                        <Link
                          key={post.id}
                          to={`/blog/${post.slug}`}
                          className="group block border rounded-lg p-4 hover:bg-muted/50 transition-colors hover:border-primary/20"
                        >
                          <h4 className="font-semibold text-sm mb-2 hover:text-primary transition-colors">{post.title}</h4>
                          <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                            {post.excerpt}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">{post.date}</span>
                            <ArrowRight className="h-3 w-3 text-muted-foreground group-hover:text-primary transition-colors" />
                          </div>
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Blog;
