
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const AIFeaturesPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-1">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-foreground sm:text-5xl">
              AI Features
            </h1>
            <p className="mt-4 text-xl text-muted-foreground">
              Exploring artificial intelligence capabilities in web applications
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Natural Language Processing</CardTitle>
                <CardDescription>
                  Text analysis and understanding
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Using modern NLP techniques to analyze and understand human language,
                  enabling chatbots and content analysis.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Computer Vision</CardTitle>
                <CardDescription>
                  Image and video processing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Implementing AI solutions that can interpret visual data from images
                  and video streams for object detection and classification.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recommendation Systems</CardTitle>
                <CardDescription>
                  Personalized content suggestions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Building intelligent systems that learn user preferences to deliver
                  tailored recommendations for products, content, and services.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 prose prose-lg max-w-3xl mx-auto">
            <h2>How AI Enhances User Experience</h2>
            <p>
              Artificial Intelligence technologies enable more intuitive and personalized
              interactions with digital products. From smart assistants to predictive
              features, AI can transform how users engage with applications.
            </p>
            <div className="mt-8 flex justify-center">
              <Button size="lg">
                Explore AI Demos
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AIFeaturesPage;
