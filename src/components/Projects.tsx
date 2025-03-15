
import React, { useEffect, useRef } from 'react';
import { ArrowUpRight, Github } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const projects = [
  {
    id: 1,
    title: 'E-commerce Platform',
    description:
      'A full-stack e-commerce platform with customer and admin interfaces, payment processing, and inventory management.',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158',
    tags: ['React', 'Node.js', 'MongoDB', 'Stripe'],
    liveUrl: '#',
    githubUrl: '#',
  },
  {
    id: 2,
    title: 'Task Management App',
    description:
      'A productivity application for managing tasks, projects, and team collaboration with real-time updates.',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085',
    tags: ['React', 'Firebase', 'Tailwind CSS', 'TypeScript'],
    liveUrl: '#',
    githubUrl: '#',
  },
  {
    id: 3,
    title: 'Weather Dashboard',
    description:
      'An interactive weather application that provides real-time weather data and forecasts for locations worldwide.',
    image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d',
    tags: ['JavaScript', 'HTML/CSS', 'Weather API', 'Chart.js'],
    liveUrl: '#',
    githubUrl: '#',
  },
];

const Projects = () => {
  const projectsRef = useRef<HTMLDivElement>(null);

  // Animation on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (projectsRef.current) {
      const elements = projectsRef.current.querySelectorAll('.project-card');
      elements.forEach((el, i) => {
        // Stagger the animations
        setTimeout(() => {
          observer.observe(el);
        }, i * 150);
      });
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section id="projects" className="section bg-secondary/30">
      <div className="mb-12 text-center">
        <h2 className="text-sm uppercase tracking-wider text-muted-foreground mb-2">
          My Work
        </h2>
        <h3 className="section-heading">Featured Projects</h3>
        <p className="section-subheading mx-auto">
          A showcase of my recent work, featuring web applications and software solutions.
        </p>
      </div>

      <div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" 
        ref={projectsRef}
      >
        {projects.map((project) => (
          <Card 
            key={project.id} 
            className="project-card opacity-0 border border-border/60 backdrop-blur-sm overflow-hidden transition-all hover:shadow-lg hover:border-border"
          >
            <div className="aspect-video overflow-hidden">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-105"
              />
            </div>
            <CardHeader>
              <CardTitle className="text-xl">{project.title}</CardTitle>
              <CardDescription>{project.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="font-medium">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" size="sm" asChild>
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                  <Github className="h-4 w-4 mr-2" />
                  Code
                </a>
              </Button>
              <Button size="sm" asChild>
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                  <span>View Demo</span>
                  <ArrowUpRight className="h-4 w-4 ml-2" />
                </a>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="text-center mt-12">
        <Button variant="outline" size="lg" asChild>
          <a 
            href="https://github.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2"
          >
            <Github className="h-5 w-5" />
            <span>View More on GitHub</span>
          </a>
        </Button>
      </div>
    </section>
  );
};

export default Projects;
