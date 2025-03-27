
import React, { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Github, ChevronRight, ChevronLeft } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { projects } from '@/data/projects';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const Projects = () => {
  const projectsRef = useRef<HTMLDivElement>(null);
  const [visibleProjects, setVisibleProjects] = useState(6);
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 6;
  const totalPages = Math.ceil(projects.length / projectsPerPage);

  const handleLoadMore = () => {
    setVisibleProjects(prev => Math.min(prev + 3, projects.length));
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const currentProjects = projects.slice(
    (currentPage - 1) * projectsPerPage,
    currentPage * projectsPerPage
  );

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
  }, [currentPage]);

  return (
    <section id="projects" className="section bg-muted/10 overflow-hidden">
      <div className="relative">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_left,rgba(var(--muted),0.3),transparent_70%)]" />
        
        <div className="mb-16 max-w-2xl">
          <h2 className="text-sm uppercase tracking-wider text-muted-foreground mb-4">
            Selected Work
          </h2>
          <h3 className="text-4xl md:text-5xl font-bold tracking-tight mb-8">
            Projects I've Built
          </h3>
          <p className="text-muted-foreground text-lg leading-relaxed">
            A showcase of my recent work in software development and engineering solutions.
            Each project represents a unique challenge and solution.
          </p>
        </div>

        <div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" 
          ref={projectsRef}
        >
          {currentProjects.map((project) => (
            <Card 
              key={project.id} 
              className="project-card opacity-0 bg-transparent backdrop-blur-sm border-border/30 hover:border-border hover:shadow-lg overflow-hidden transition-all duration-500 flex flex-col"
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
                    target.src = 'https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg';
                  }}
                />
              </div>
              <CardHeader>
                <CardTitle className="text-xl tracking-tight">{project.title}</CardTitle>
                <CardDescription className="line-clamp-2">{project.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="flex flex-wrap gap-2">
                  {project.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="secondary" className="font-medium text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {project.tags.length > 3 && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Badge variant="outline" className="font-medium text-xs cursor-pointer">
                          +{project.tags.length - 3}
                        </Badge>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>{project.title}</DialogTitle>
                          <DialogDescription>Technologies used in this project</DialogDescription>
                        </DialogHeader>
                        <div className="flex flex-wrap gap-2 mt-4">
                          {project.tags.map((tag) => (
                            <Badge key={tag} variant="secondary">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between pt-0 space-x-2">
                <Button variant="outline" size="sm" className="w-1/2" asChild>
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                    <Github className="h-4 w-4 mr-2" />
                    Code
                  </a>
                </Button>
                <Button size="sm" className="w-1/2 group" asChild>
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
                    <span>Demo</span>
                    <ArrowUpRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </a>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-center mt-12">
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={handlePrevPage} 
              disabled={currentPage === 1}
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={handleNextPage} 
              disabled={currentPage === totalPages}
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
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
      </div>
    </section>
  );
};

export default Projects;
