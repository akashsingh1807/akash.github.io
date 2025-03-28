
import React from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { blogPosts } from "@/data/blogPosts";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const { data: post, isLoading } = useQuery({
    queryKey: ["blogPost", slug],
    queryFn: () => {
      const foundPost = blogPosts.find(post => post.slug === slug);
      if (!foundPost) {
        navigate("/blog");
        return null;
      }
      return foundPost;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-16 mt-16">
          <div className="max-w-3xl mx-auto">
            <div className="animate-pulse">
              <div className="h-10 bg-muted rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-muted rounded w-1/4 mb-8"></div>
              <div className="h-4 bg-muted rounded w-full mb-2"></div>
              <div className="h-4 bg-muted rounded w-full mb-2"></div>
              <div className="h-4 bg-muted rounded w-3/4 mb-6"></div>
              <div className="h-4 bg-muted rounded w-full mb-2"></div>
              <div className="h-4 bg-muted rounded w-full mb-2"></div>
              <div className="h-4 bg-muted rounded w-5/6"></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!post) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-16 mt-16">
        <article className="max-w-3xl mx-auto prose prose-slate lg:prose-lg">
          <Button 
            variant="ghost" 
            className="mb-8 animate-fade-in" 
            onClick={() => navigate("/blog")}
          >
            ← Back to blog
          </Button>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4 not-prose animate-fade-in">{post.title}</h1>
          
          <div className="flex items-center gap-1 text-muted-foreground mb-8 not-prose animate-fade-in">
            <Calendar className="h-4 w-4" />
            <span>{post.date}</span>
          </div>
          
          {post.content.map((paragraph, idx) => (
            <p key={idx} className="animate-fade-in" style={{ animationDelay: `${idx * 50}ms` }}>{paragraph}</p>
          ))}
          
          <div className="not-prose mt-12 border-t pt-6 animate-fade-in">
            <Button asChild variant="outline">
              <Link to="/blog">
                Back to all posts
              </Link>
            </Button>
          </div>
        </article>
      </main>
      
      <Footer />
    </div>
  );
};

export default BlogPost;
