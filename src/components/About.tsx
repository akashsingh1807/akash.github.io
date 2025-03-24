
import React, { useEffect, useRef } from 'react';
import { Code, Server, Layout } from 'lucide-react';
import { Button } from '@/components/ui/button';

const About = () => {
  const aboutRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          entries[0].target.classList.add('animate-fade-in');
          observer.unobserve(entries[0].target);
        }
      },
      { threshold: 0.1 }
    );

    if (aboutRef.current) {
      observer.observe(aboutRef.current);
    }

    return () => {
      if (aboutRef.current) {
        observer.unobserve(aboutRef.current);
      }
    };
  }, []);

  return (
    <section id="about" className="section" ref={aboutRef}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <div>
          <div className="mb-6">
            <h2 className="text-sm uppercase tracking-wider text-muted-foreground mb-2">
              About me
            </h2>
            <h3 className="section-heading">
              Full Stack Java Engineer, <br />
              Software Development Expert
            </h3>
          </div>

          <div className="space-y-4 text-lg text-muted-foreground mb-8">
            <p>
              I'm a Full Stack Java Engineer at NextGen Healthcare specializing in the development 
              of enterprise applications using Java/J2EE, Spring Boot, and microservices architecture.
            </p>
            <p>
              With expertise in Java, Spring framework, REST APIs, Microservices, Docker, Kubernetes, 
              and various frontend technologies, I build robust and scalable solutions for complex business problems.
            </p>
            <p>
              I believe in writing clean, maintainable code and staying current with the latest 
              technologies and industry best practices.
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <Button asChild>
              <a href="#contact">Contact me</a>
            </Button>
            <Button variant="outline" asChild>
              <a href="#" download>
                Download CV
              </a>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-1 md:col-span-2">
            <div className="bg-card rounded-lg border p-6 shadow-sm transition-all hover:shadow-md">
              <div className="flex items-center mb-4">
                <div className="rounded-full bg-primary/10 p-3 mr-4">
                  <Code className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-bold">Backend Development</h3>
              </div>
              <p className="text-muted-foreground">
                Designing and implementing high-performance applications using Java, Spring Boot, JPA/Hibernate, 
                and RESTful APIs, with a focus on scalability and efficiency.
              </p>
            </div>
          </div>

          <div className="col-span-1">
            <div className="bg-card rounded-lg border p-6 shadow-sm h-full transition-all hover:shadow-md">
              <div className="flex items-center mb-4">
                <div className="rounded-full bg-primary/10 p-3 mr-4">
                  <Server className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-bold">DevOps</h3>
              </div>
              <p className="text-muted-foreground">
                Expertise in Docker, Kubernetes, Jenkins, CI/CD pipelines, Git, GitHub, AWS, Azure, and cloud-native technologies.
              </p>
            </div>
          </div>

          <div className="col-span-1">
            <div className="bg-card rounded-lg border p-6 shadow-sm h-full transition-all hover:shadow-md">
              <div className="flex items-center mb-4">
                <div className="rounded-full bg-primary/10 p-3 mr-4">
                  <Layout className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-bold">Frontend</h3>
              </div>
              <p className="text-muted-foreground">
                Experience in developing responsive web interfaces using JavaScript, React, JSP, jQuery, HTML, and CSS.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
