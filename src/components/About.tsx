
import React, { useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Code, Server, Layout } from 'lucide-react';
import { Button } from '@/components/ui/button';

const About = () => {
  const aboutRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          controls.start('visible');
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
  }, [controls]);

  return (
    <section id="about" className="section" ref={aboutRef}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <div>
          <div className="mb-6">
            <h2 className="text-sm uppercase tracking-wider text-muted-foreground mb-2">
              About me
            </h2>
            <h3 className="section-heading">
              Passionate Developer, <br />
              Problem Solver
            </h3>
          </div>

          <div className="space-y-4 text-lg text-muted-foreground mb-8">
            <p>
              With over 5 years of experience in software development, I specialize in building
              robust and scalable web applications that deliver exceptional user experiences.
            </p>
            <p>
              My journey in programming began during my computer science studies, where I developed
              a deep passion for creating elegant solutions to complex problems.
            </p>
            <p>
              I believe in clean, maintainable code and staying up-to-date with the latest
              technologies and best practices in the ever-evolving tech landscape.
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
                <h3 className="font-bold">Frontend Development</h3>
              </div>
              <p className="text-muted-foreground">
                Creating responsive, accessible, and performant user interfaces with modern
                frameworks like React, Next.js, and TypeScript.
              </p>
            </div>
          </div>

          <div className="col-span-1">
            <div className="bg-card rounded-lg border p-6 shadow-sm h-full transition-all hover:shadow-md">
              <div className="flex items-center mb-4">
                <div className="rounded-full bg-primary/10 p-3 mr-4">
                  <Server className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-bold">Backend</h3>
              </div>
              <p className="text-muted-foreground">
                Building robust APIs and server logic with Node.js, Express, and various databases.
              </p>
            </div>
          </div>

          <div className="col-span-1">
            <div className="bg-card rounded-lg border p-6 shadow-sm h-full transition-all hover:shadow-md">
              <div className="flex items-center mb-4">
                <div className="rounded-full bg-primary/10 p-3 mr-4">
                  <Layout className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-bold">UI/UX</h3>
              </div>
              <p className="text-muted-foreground">
                Designing intuitive user experiences with a focus on usability, accessibility, and
                aesthetics.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
