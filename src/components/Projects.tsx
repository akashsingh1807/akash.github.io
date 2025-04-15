
import React, { useEffect, useRef } from 'react';
import { ArrowUpRight, Github } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { projectsData, fallbackImage } from '@/utils/projectUtils';

const Projects = () => {
  const projectsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setTimeout(() => {
                entry.target.classList.add('animate-fade-in');
              }, parseInt(entry.target.getAttribute('data-index') || '0') * 100);
            }
          });
        },
        {
          threshold: 0.1,
          rootMargin: '0px 0px -10% 0px'
        }
    );

    if (projectsRef.current) {
      const elements = projectsRef.current.querySelectorAll('.project-card');
      elements.forEach((el, index) => {
        el.setAttribute('data-index', index.toString());
        observer.observe(el);
      });
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
      <section id="projects" className="section bg-muted/10 overflow-hidden">
        <div className="relative">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_left,rgba(var(--muted),0.3),transparent_70%)]" />

          <div className="mb-16 max-w-2xl">
            <h2 className="text-sm uppercase tracking-wider text-muted-foreground mb-4 animate-on-scroll">
              Selected Work
            </h2>
            <h3 className="text-4xl md:text-5xl font-bold tracking-tight mb-8 animate-on-scroll">
              Projects I've Built
            </h3>
            <p className="text-muted-foreground text-lg leading-relaxed animate-on-scroll">
              A showcase of my recent work in software development and engineering solutions.
              Each project represents a unique challenge and solution.
              <span className="block text-sm mt-2 text-muted-foreground/70 italic">
                Some projects are in collaboration with or inspired by other developers' work, with proper attribution.
              </span>
            </p>
          </div>

          <div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              ref={projectsRef}
          >
            {projectsData.map((project, index) => (
                <Card
                    key={project.id}
                    className="project-card opacity-0 bg-transparent backdrop-blur-sm border-border/30 hover:border-border hover:shadow-lg overflow-hidden transition-all duration-500 flex flex-col hover:-translate-y-2 hover:shadow-xl"
                >
                  <div className="aspect-video overflow-hidden">
                    <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-110"
                        loading="lazy"
                        decoding="async"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = fallbackImage;
                        }}
                    />
                  </div>
                  <CardHeader>
                    <CardTitle className="text-xl tracking-tight animate-on-scroll hover:text-primary transition-colors">{project.title}</CardTitle>
                    <CardDescription className="line-clamp-2 animate-on-scroll">{project.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <div className="flex flex-wrap gap-2 animate-on-scroll">
                      {project.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="secondary" className="font-medium text-xs hover:bg-primary hover:text-primary-foreground transition-colors">
                            {tag}
                          </Badge>
                      ))}
                      {project.tags.length > 3 && (
                          <Badge variant="outline" className="font-medium text-xs hover:bg-secondary/80 transition-colors">
                            +{project.tags.length - 3}
                          </Badge>
                      )}
                    </div>
                    {project.attribution && (
                        <p className="text-xs text-muted-foreground mt-4 italic animate-on-scroll">
                          {project.attribution}
                        </p>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-between pt-0 space-x-2">
                    <Button variant="outline" size="sm" className="w-1/2 animate-on-scroll hover:scale-105 transition-transform" asChild>
                      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                        <Github className="h-4 w-4 mr-2" />
                        Code
                      </a>
                    </Button>
                    <Button size="sm" className="w-1/2 group animate-on-scroll hover:scale-105 transition-transform" asChild>
                      <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
                        <span>Demo</span>
                        <ArrowUpRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                      </a>
                    </Button>
                  </CardFooter>
                </Card>
            ))}
          </div>

          <div className="text-center mt-16">
            <Button variant="outline" size="lg" asChild className="animate-on-scroll hover:scale-105 transition-transform">
              <a
                  href="https://github.com/Akashsingh01"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
              >
                <Github className="h-5 w-5" />
                <span>View Original Projects on GitHub</span>
              </a>
            </Button>
          </div>
        </div>
      </section>
  );
};

export default Projects;
