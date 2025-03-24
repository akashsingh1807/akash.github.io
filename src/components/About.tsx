import React, { useEffect, useRef } from 'react';
import { Code, Server, Layout } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PublicResume from './PublicResume';

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
                Cloud & Enterprise Systems Specialist
              </h3>
            </div>

            <div className="space-y-4 text-lg text-muted-foreground mb-8">
              <p>
                I’m Akash Singh, a software engineer who turns caffeine into code
                and enterprise headaches into scalable solutions. With 5 years of experience,
                I’ve built and optimized systems across healthcare, business licensing,
                and network automation.
              </p>
              <p>
                At <strong>NextGen Healthcare</strong>, I engineer healthcare solutions that
                (hopefully) make doctors' lives easier, using Java, Spring Boot, and microservices.
                Previously, at <strong>OpenText (Microfocus)</strong>, I worked on large-scale network
                automation, designing high-performance REST APIs and leading migrations from Java 8 to 11.
                Before that, at <strong>CrimsonLogic</strong>, I helped digitize Singapore’s business licensing
                platform with Spring MVC, Hibernate, and RESTful APIs.
              </p>
              <p>
                My stack includes Java, Spring, REST APIs, Docker, Kubernetes, AWS, and more.
                I believe in clean, maintainable code—unless it’s Friday evening, then it’s just “it works, ship it!” 🚀
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Button asChild>
                <a href="#contact">Contact me</a>
              </Button>
              <PublicResume />
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
                  Specializing in Java, Spring Boot, Hibernate, and REST APIs, I design and
                  optimize high-performance, scalable applications for enterprise and healthcare solutions.
                </p>
              </div>
            </div>

            <div className="col-span-1">
              <div className="bg-card rounded-lg border p-6 shadow-sm h-full transition-all hover:shadow-md">
                <div className="flex items-center mb-4">
                  <div className="rounded-full bg-primary/10 p-3 mr-4">
                    <Server className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-bold">Cloud & DevOps</h3>
                </div>
                <p className="text-muted-foreground">
                  Experienced in Docker, Kubernetes, CI/CD pipelines, AWS, Azure, and cloud-native
                  technologies to ensure seamless deployments and scalability.
                </p>
              </div>
            </div>

            <div className="col-span-1">
              <div className="bg-card rounded-lg border p-6 shadow-sm h-full transition-all hover:shadow-md">
                <div className="flex items-center mb-4">
                  <div className="rounded-full bg-primary/10 p-3 mr-4">
                    <Layout className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-bold">Frontend Development</h3>
                </div>
                <p className="text-muted-foreground">
                  Proficient in React, JavaScript, JSP, jQuery, HTML, and CSS. I create intuitive
                  user interfaces that balance aesthetics with functionality.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
  );
};

export default About;
