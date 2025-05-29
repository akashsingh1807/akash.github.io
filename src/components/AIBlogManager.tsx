// AI-powered blog management component
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Loader2,
  Sparkles,
  FileText,
  Settings,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Clock,
  BookOpen
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ai21BlogService } from '@/services/ai21BlogService';
import { FormattedContent } from '@/components/FormattedContent';
import { useQueryClient } from '@tanstack/react-query';
import { BLOG_CATEGORIES, getRandomTopicFromCategory, AI_BLOG_CONFIG } from '@/config/blogConfig';
import { BlogGenerationRequest, BlogGenerationResponse, BlogCategory } from '@/types/blog';
import { addAIGeneratedPost, getAllBlogPosts, getBlogStats } from '@/utils/blogIntegration';
import { blogPosts } from '@/data/blogPosts';

interface AIBlogManagerProps {
  onPostGenerated?: (post: BlogGenerationResponse) => void;
}

export const AIBlogManager: React.FC<AIBlogManagerProps> = ({ onPostGenerated }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'unknown' | 'connected' | 'error'>('unknown');
  const [generatedPosts, setGeneratedPosts] = useState<BlogGenerationResponse[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('web-development');
  const [customTopic, setCustomTopic] = useState('');
  const [generationSettings, setGenerationSettings] = useState({
    targetAudience: 'intermediate' as const,
    wordCount: 1200,
    tone: 'professional' as const,
    includeCodeExamples: true
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Test AI21 connection on component mount
  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    setIsTestingConnection(true);
    try {
      const isConnected = await ai21BlogService.testConnection();
      setConnectionStatus(isConnected ? 'connected' : 'error');

      if (isConnected) {
        toast({
          title: "AI Service Connected",
          description: "Ready to generate blog content!",
        });
      } else {
        toast({
          title: "Connection Failed",
          description: "Please check your API key configuration.",
          variant: "destructive",
        });
      }
    } catch (error) {
      setConnectionStatus('error');
      toast({
        title: "Connection Error",
        description: "Failed to connect to AI service.",
        variant: "destructive",
      });
    } finally {
      setIsTestingConnection(false);
    }
  };

  const generateSinglePost = async () => {
    if (connectionStatus !== 'connected') {
      toast({
        title: "Not Connected",
        description: "Please ensure AI service is connected first.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const category = BLOG_CATEGORIES.find(cat => cat.id === selectedCategory);
      if (!category) throw new Error('Invalid category selected');

      const topic = customTopic.trim() || getRandomTopicFromCategory(selectedCategory);
      if (!topic) throw new Error('No topic available for generation');

      const request: BlogGenerationRequest = {
        topic,
        category,
        ...generationSettings,
        keywords: topic.toLowerCase().split(' ').slice(0, 3)
      };

      const generatedPost = await ai21BlogService.generateBlogPost(request);

      // Add to the blog system for persistence
      const blogPost = addAIGeneratedPost(generatedPost);

      // Update local state
      setGeneratedPosts(prev => [generatedPost, ...prev]);

      // Invalidate React Query cache to refresh blog pages
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });

      if (onPostGenerated) {
        onPostGenerated(generatedPost);
      }

      toast({
        title: "Blog Post Generated & Saved!",
        description: `Successfully created and saved: "${generatedPost.title}". Check the blog page to see it!`,
      });

      // Clear custom topic after successful generation
      setCustomTopic('');
    } catch (error) {
      console.error('Blog generation error:', error);
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const generateMultiplePosts = async () => {
    if (connectionStatus !== 'connected') {
      toast({
        title: "Not Connected",
        description: "Please ensure AI service is connected first.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const category = BLOG_CATEGORIES.find(cat => cat.id === selectedCategory);
      if (!category) throw new Error('Invalid category selected');

      // Generate 3 posts for the selected category
      const topics = [
        getRandomTopicFromCategory(selectedCategory),
        getRandomTopicFromCategory(selectedCategory),
        getRandomTopicFromCategory(selectedCategory)
      ].filter(Boolean) as string[];

      if (topics.length === 0) {
        throw new Error('No topics available for this category');
      }

      const posts = await ai21BlogService.generateMultiplePosts(topics, category);

      // Add all posts to the blog system for persistence
      const savedPosts = posts.map(post => addAIGeneratedPost(post));

      // Update local state
      setGeneratedPosts(prev => [...posts, ...prev]);

      // Invalidate React Query cache to refresh blog pages
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });

      posts.forEach(post => {
        if (onPostGenerated) {
          onPostGenerated(post);
        }
      });

      toast({
        title: "Batch Generation Complete!",
        description: `Generated and saved ${posts.length} blog posts successfully. Check the blog page!`,
      });
    } catch (error) {
      console.error('Batch generation error:', error);
      toast({
        title: "Batch Generation Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const ConnectionStatusIndicator = () => (
    <div className="flex items-center gap-2">
      {connectionStatus === 'connected' && (
        <>
          <CheckCircle className="h-4 w-4 text-green-500" />
          <span className="text-sm text-green-600">AI Service Connected</span>
        </>
      )}
      {connectionStatus === 'error' && (
        <>
          <AlertCircle className="h-4 w-4 text-red-500" />
          <span className="text-sm text-red-600">Connection Failed</span>
        </>
      )}
      {connectionStatus === 'unknown' && (
        <>
          <Clock className="h-4 w-4 text-yellow-500" />
          <span className="text-sm text-yellow-600">Testing Connection...</span>
        </>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            AI Tech Blog Generator
          </h2>
          <p className="text-muted-foreground mt-1">
            Automated content generation for technical blogs
          </p>
        </div>
        <div className="flex items-center gap-3">
          <ConnectionStatusIndicator />
          <Button
            variant="outline"
            size="sm"
            onClick={testConnection}
            disabled={isTestingConnection}
          >
            {isTestingConnection ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Test Connection
          </Button>
        </div>
      </div>

      <Tabs defaultValue="generate" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="generate">Generate Content</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="history">Generated Posts</TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Content Generation
              </CardTitle>
              <CardDescription>
                Generate high-quality blog posts on web development, AI advancements, and programming tutorials
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {BLOG_CATEGORIES.map(category => (
                        <SelectItem key={category.id} value={category.id}>
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: category.color }}
                            />
                            {category.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="audience">Target Audience</Label>
                  <Select
                    value={generationSettings.targetAudience}
                    onValueChange={(value: any) =>
                      setGenerationSettings(prev => ({ ...prev, targetAudience: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="custom-topic">Custom Topic (Optional)</Label>
                <Textarea
                  id="custom-topic"
                  placeholder="Enter a specific topic or leave blank for auto-selection..."
                  value={customTopic}
                  onChange={(e) => setCustomTopic(e.target.value)}
                  rows={2}
                />
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={generateSinglePost}
                  disabled={isGenerating || connectionStatus !== 'connected'}
                  className="flex-1"
                >
                  {isGenerating ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Sparkles className="h-4 w-4 mr-2" />
                  )}
                  Generate Single Post
                </Button>
                <Button
                  onClick={generateMultiplePosts}
                  disabled={isGenerating || connectionStatus !== 'connected'}
                  variant="outline"
                  className="flex-1"
                >
                  {isGenerating ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <FileText className="h-4 w-4 mr-2" />
                  )}
                  Generate Batch (3 posts)
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Generation Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="word-count">Word Count</Label>
                  <Input
                    id="word-count"
                    type="number"
                    min="500"
                    max="3000"
                    value={generationSettings.wordCount}
                    onChange={(e) =>
                      setGenerationSettings(prev => ({
                        ...prev,
                        wordCount: parseInt(e.target.value) || 1200
                      }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tone">Writing Tone</Label>
                  <Select
                    value={generationSettings.tone}
                    onValueChange={(value: any) =>
                      setGenerationSettings(prev => ({ ...prev, tone: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="casual">Casual</SelectItem>
                      <SelectItem value="technical">Technical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="include-code"
                  checked={generationSettings.includeCodeExamples}
                  onChange={(e) =>
                    setGenerationSettings(prev => ({
                      ...prev,
                      includeCodeExamples: e.target.checked
                    }))
                  }
                  className="rounded"
                />
                <Label htmlFor="include-code">Include code examples</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Generated Posts ({generatedPosts.length})
              </CardTitle>
              <CardDescription>
                Click on any post to view its full content
              </CardDescription>
            </CardHeader>
            <CardContent>
              {generatedPosts.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No posts generated yet. Start creating content!
                </p>
              ) : (
                <div className="space-y-4">
                  {generatedPosts.map((post, index) => (
                    <Card key={index} className="border hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">{post.title}</CardTitle>
                        <CardDescription>{post.excerpt}</CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-3">
                          {/* Content Preview */}
                          <div className="bg-muted/50 rounded-lg p-4">
                            <h5 className="font-medium text-sm mb-2">Content Preview:</h5>
                            <div className="space-y-2 text-sm text-muted-foreground">
                              {post.content.slice(0, 2).map((paragraph, idx) => (
                                <div key={idx} className="line-clamp-3 prose prose-sm max-w-none">
                                  <FormattedContent content={paragraph} />
                                </div>
                              ))}
                              {post.content.length > 2 && (
                                <p className="text-xs italic">
                                  ... and {post.content.length - 2} more paragraphs
                                </p>
                              )}
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
                                <div key={idx} className="leading-relaxed text-muted-foreground prose prose-sm max-w-none">
                                  <FormattedContent content={paragraph} />
                                </div>
                              ))}
                            </div>
                          </details>

                          {/* Metadata */}
                          <div className="flex items-center justify-between">
                            <div className="flex gap-2">
                              {post.tags.slice(0, 4).map(tag => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span>{post.readTime} min read</span>
                              <span>{post.content.length} paragraphs</span>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex gap-2 pt-2 border-t">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                // Copy content to clipboard
                                const fullContent = `# ${post.title}\n\n${post.content.join('\n\n')}`;
                                navigator.clipboard.writeText(fullContent);
                                toast({
                                  title: "Content Copied!",
                                  description: "Blog post content copied to clipboard.",
                                });
                              }}
                            >
                              Copy Content
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                // Download as markdown
                                const fullContent = `# ${post.title}\n\n${post.excerpt}\n\n${post.content.join('\n\n')}\n\n---\n\nTags: ${post.tags.join(', ')}\nRead Time: ${post.readTime} minutes`;
                                const blob = new Blob([fullContent], { type: 'text/markdown' });
                                const url = URL.createObjectURL(blob);
                                const a = document.createElement('a');
                                a.href = url;
                                a.download = `${post.slug}.md`;
                                a.click();
                                URL.revokeObjectURL(url);
                              }}
                            >
                              Download MD
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              disabled
                              className="opacity-75"
                            >
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Saved to Blog
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
