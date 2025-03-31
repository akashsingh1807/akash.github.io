import React, { useEffect, useRef } from 'react';
import { ArrowUpRight, Github } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const projects = [
  {
    id: 1,
    title: 'Portfolio Website',
    description: 'A modern, responsive portfolio website built with React, TypeScript, and Tailwind CSS. Features include smooth animations, dark mode, and a chatbot integration.',
    image: 'https://akash-github-io.vercel.app/og-image.png',
    tags: ['React', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'OpenRouter API'],
    liveUrl: 'https://akash-github-io.vercel.app/',
    githubUrl: 'https://github.com/akashsingh3030/akash.github.io',
  },
  {
    id: 2,
    title: 'NextGen Healthcare',
    description: 'Working as a Senior Software Engineer in the healthcare domain, contributing to the development and enhancement of healthcare solutions. Involved in designing and developing scalable, high-performance applications using Java, Spring Boot, and Microservices architecture.',
    image: 'https://www.kohezion.com/wp-content/uploads/2024/10/NextGen-Office-768x379.png',
    tags: ['Java', 'Spring Boot', 'Microservices', 'REST API', 'AWS', 'Azure', 'Hibernate', 'MySQL', 'PostgreSQL', 'Docker', 'Kubernetes', 'FHIR', 'HL7'],
    liveUrl: 'https://www.nextgen.com/',
    githubUrl: '#',
  },
  {
    id: 3,
    title: 'Network Automation - OpenText',
    description: 'Working as a Senior Software Engineer in the development and containerization of products for compliance, monitoring, and provisioning of large-scale network devices. Designed and implemented high-performance REST APIs, migrated the codebase from Java 8 to Java 11.',
    image: 'https://docs.microfocus.com/file/images/6/65/NAUserInterface.png',
    tags: ['Java', 'Spring Framework', 'Spring Boot', 'Microservices', 'REST API', 'Docker', 'Kubernetes', 'AWS', 'Azure', 'MySQL', 'JUnit', 'Mockito'],
    liveUrl: 'https://www.opentext.com/products/network-automation',
    githubUrl: '#',
  },
  {
    id: 4,
    title: 'Frontier - Business Licensing Platform',
    description: 'Contributed to the development of Frontier, a one-stop Business Licensing platform for Singapore Community end-users, under the Singapore Government. Worked on implementing various licenses, developing and maintaining RESTful APIs.',
    image: 'https://www.taxi.org.sg/images/gobusiness-r1.png',
    tags: ['Spring MVC', 'Java', 'Hibernate', 'MySQL', 'RESTful API', 'JSP', 'JavaScript', 'jQuery', 'HTML', 'CSS', 'Microservices', 'PostgreSQL', 'Docker', 'AWS'],
    liveUrl: 'https://licence1.business.gov.sg/feportal/web/frontier/home',
    githubUrl: '#',
  },
  {
    id: 5,
    title: 'Feeding Trends - Digital Publishing Platform',
    description: 'Designed and developed a digital experience for budding writers and readers. Redesigned the website from scratch to improve UX, create a positive user journey, and align with marketing strategy.',
    image: 'https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg',
    tags: ['UI/UX Design', 'Responsive Design', 'Adobe Creative Suite', 'Sketch', 'Flinto', 'Brand Identity', 'Wireframing', 'Prototyping', 'Design System'],
    liveUrl: 'https://feedingtrends.com/',
    githubUrl: '#',
  },
  {
    id: 6,
    title: 'Traffic Analyzer for HTTP/HTTPS',
    description: 'A web application that monitors and analyzes HTTP\'s encrypted traffic for security, enabling attack detection and preventing information leakage.',
    image: 'https://images.pexels.com/photos/5473298/pexels-photo-5473298.jpeg',
    tags: ['Java', 'Security', 'Web Applications', 'HTTP Analysis'],
    liveUrl: '#',
    githubUrl: '#',
  },
  {
    id: 7,
    title: 'Complaint Tracking Automation System',
    description: 'A Java application that provides an interface for clients to register complaints/grievances which are then automatically processed by the company.',
    image: 'src/assets/network_automation.jpg',
    tags: ['Java', 'J2SE', 'Automation', 'Customer Service'],
    liveUrl: '#',
    githubUrl: '#',
  },
  {
    id: 8,
    title: 'Project RED',
    description: 'An innovative system that leverages cutting-edge technology to deliver real-time data processing and analytics for enterprise applications.',
    image: 'https://images.pexels.com/photos/5483077/pexels-photo-5483077.jpeg',
    tags: ['React', 'TypeScript', 'Node.js', 'MongoDB', 'AWS'],
    liveUrl: '#',
    githubUrl: '#',
  },
  {
    id: 9,
    title: 'Open Banking API',
    description: 'Developed critical modules for Open Banking APIs that facilitate secure and standardized financial data sharing between institutions.',
    image: 'https://images.pexels.com/photos/210607/pexels-photo-210607.jpeg',
    tags: ['Java', 'Spring Boot', 'Microservices', 'REST API', 'Security'],
    liveUrl: '#',
    githubUrl: '#',
  },
  {
    id: 10,
    title: 'CICD Pipeline Optimization',
    description: 'Improved deployment efficiency by optimizing CI/CD pipelines, reducing build times and enhancing automated testing coverage.',
    image: 'https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg',
    tags: ['Jenkins', 'Docker', 'Kubernetes', 'DevOps', 'CI/CD'],
    liveUrl: '#',
    githubUrl: '#',
  }
];

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
            {projects.map((project, index) => (
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
                          <Badge variant="outline" className="font-medium text-xs">
                            +{project.tags.length - 3}
                          </Badge>
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

          <div className="text-center mt-16">
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