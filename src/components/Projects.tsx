
import { useEffect, useRef } from 'react';
import { ArrowUpRight, Github } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { projectsData, fallbackImage } from '@/utils/projectUtils';
import { motion } from 'framer-motion';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 50,
    scale: 0.9,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

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

          <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              ref={projectsRef}
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
          >
            {projectsData.map((project) => (
                <motion.div
                    key={project.id}
                    variants={cardVariants}
                    whileHover={{
                      y: -8,
                      transition: { duration: 0.2 }
                    }}
                    className="group"
                >
                  <Card className="bg-transparent backdrop-blur-sm border-border/30 hover:border-border hover:shadow-lg overflow-hidden transition-all duration-500 flex flex-col h-full relative">
                    {/* Hover overlay effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      initial={false}
                    />

                    <div className="aspect-video overflow-hidden relative">
                      <motion.img
                          src={project.image}
                          alt={project.title}
                          className="w-full h-full object-cover object-center"
                          loading="lazy"
                          decoding="async"
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.3 }}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = fallbackImage;
                          }}
                      />
                      {/* Image overlay on hover */}
                      <motion.div
                        className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        initial={false}
                      />
                    </div>

                    <CardHeader className="relative z-10">
                      <CardTitle className="text-xl tracking-tight group-hover:text-primary transition-colors duration-300">{project.title}</CardTitle>
                      <CardDescription className="line-clamp-2">{project.description}</CardDescription>
                    </CardHeader>

                    <CardContent className="flex-grow relative z-10">
                      <div className="flex flex-wrap gap-2">
                        {project.tags.slice(0, 3).map((tag, tagIndex) => (
                            <motion.div
                              key={tag}
                              initial={{ opacity: 0, scale: 0.8 }}
                              whileInView={{ opacity: 1, scale: 1 }}
                              transition={{ delay: tagIndex * 0.1 }}
                              whileHover={{ scale: 1.05 }}
                            >
                              <Badge variant="secondary" className="font-medium text-xs hover:bg-primary hover:text-primary-foreground transition-colors cursor-default">
                                {tag}
                              </Badge>
                            </motion.div>
                        ))}
                        {project.tags.length > 3 && (
                            <Badge variant="outline" className="font-medium text-xs hover:bg-secondary/80 transition-colors">
                              +{project.tags.length - 3}
                            </Badge>
                        )}
                      </div>
                      {project.attribution && (
                          <p className="text-xs text-muted-foreground mt-4 italic">
                            {project.attribution}
                          </p>
                      )}
                    </CardContent>

                    <CardFooter className="flex justify-between pt-0 space-x-2 relative z-10">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-1/2"
                      >
                        <Button variant="outline" size="sm" className="w-full group/btn" asChild>
                          <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                            <Github className="h-4 w-4 mr-2 group-hover/btn:rotate-12 transition-transform" />
                            Code
                          </a>
                        </Button>
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-1/2"
                      >
                        <Button size="sm" className="w-full group/btn" asChild>
                          <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
                            <span>Demo</span>
                            <ArrowUpRight className="h-4 w-4 ml-2 transition-transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1" />
                          </a>
                        </Button>
                      </motion.div>
                    </CardFooter>
                  </Card>
                </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="text-center mt-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button variant="outline" size="lg" asChild className="group relative overflow-hidden">
                <a
                    href="https://github.com/Akashsingh01"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                >
                  <motion.div
                    className="absolute inset-0 bg-primary/10"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.5 }}
                  />
                  <Github className="h-5 w-5 relative z-10 group-hover:rotate-12 transition-transform" />
                  <span className="relative z-10">View Original Projects on GitHub</span>
                </a>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
  );
};

export default Projects;
