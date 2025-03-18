
import React, { useEffect, useRef } from 'react';
import { ArrowRight, Github, Linkedin, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);

  // Animate elements on load
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

    if (heroRef.current) {
      const elements = heroRef.current.querySelectorAll('.animate-on-scroll');
      elements.forEach((el) => observer.observe(el));
    }

    return () => observer.disconnect();
  }, []);

  // Scroll to About section
  const scrollToAbout = () => {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      const yOffset = -80;
      const y = aboutSection.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-center px-6 md:px-8 lg:px-12 pt-20 pb-16 overflow-hidden"
      ref={heroRef}
    >
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,rgba(var(--accent),0.08),transparent_70%)]" />
      
      <div className="max-w-5xl mx-auto">
        <p className="opacity-0 animate-on-scroll text-muted-foreground mb-4 tracking-wider uppercase text-sm">
          Hello, I'm
        </p>
        <h1 className="opacity-0 animate-on-scroll text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-6">
          Akash Singh
        </h1>
        <h2 className="opacity-0 animate-on-scroll text-xl md:text-2xl lg:text-3xl text-muted-foreground font-medium mb-8 max-w-xl">
          Senior Software Engineer crafting high-performance Java solutions
        </h2>
        <p className="opacity-0 animate-on-scroll text-muted-foreground max-w-xl mb-10 leading-relaxed">
          Specialized in developing scalable REST APIs and network automation solutions.
          Experienced in Java, Spring, and full-stack development.
        </p>

        <div className="opacity-0 animate-on-scroll flex flex-wrap items-center gap-4 mb-16">
          <Button 
            className="group px-6 py-6 text-base"
            onClick={scrollToAbout}
          >
            View my work
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
          <Button 
            variant="outline" 
            className="px-6 py-6 text-base"
            asChild
          >
            <a href="#contact">Get in touch</a>
          </Button>
        </div>

        <div className="opacity-0 animate-on-scroll flex items-center space-x-6">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full hover:bg-muted transition-colors"
            aria-label="GitHub"
          >
            <Github className="w-6 h-6" />
          </a>
          <a
            href="https://www.linkedin.com/in/itsmeakashsingh/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full hover:bg-muted transition-colors"
            aria-label="LinkedIn"
          >
            <Linkedin className="w-6 h-6" />
          </a>
          <a
            href="mailto:Engg.akashsingh@gmail.com"
            className="p-2 rounded-full hover:bg-muted transition-colors"
            aria-label="Email"
          >
            <Mail className="w-6 h-6" />
          </a>
        </div>
      </div>

      <div className="absolute bottom-10 left-6">
        <div className="flex flex-col items-start justify-center">
          <span className="text-sm mb-2 text-muted-foreground tracking-wider uppercase">Scroll</span>
          <div className="w-[2px] h-[60px] bg-border overflow-hidden">
            <div className="w-full h-[60px] bg-foreground animate-[scroll-indicator_2s_ease-in-out_infinite]"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
