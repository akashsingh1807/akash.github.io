
import React, { useEffect, useRef } from 'react';
import { ArrowDown, Github, Linkedin, Mail } from 'lucide-react';
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
      className="relative min-h-screen flex flex-col justify-center items-center pt-20 pb-16 px-6 md:px-8 lg:px-12 overflow-hidden"
      ref={heroRef}
    >
      <div className="absolute inset-0 -z-10 w-full h-full bg-[radial-gradient(ellipse_at_center,rgba(var(--secondary),0.2),transparent_75%)]" />
      
      <div className="max-w-5xl mx-auto text-center">
        <p className="opacity-0 animate-on-scroll text-lg md:text-xl text-muted-foreground mb-4 font-medium">
          Hello, I'm
        </p>
        <h1 className="opacity-0 animate-on-scroll text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-6">
          Akash Singh
        </h1>
        <h2 className="opacity-0 animate-on-scroll text-2xl md:text-3xl lg:text-4xl text-muted-foreground font-medium tracking-tight mb-8">
          Senior Software Engineer
        </h2>
        <p className="opacity-0 animate-on-scroll text-muted-foreground max-w-2xl mx-auto mb-10 text-lg md:text-xl">
          Specialized in developing high-performance REST APIs and network automation solutions. 
          Experienced in Java, Spring, and full-stack development.
        </p>

        <div className="opacity-0 animate-on-scroll flex flex-col md:flex-row items-center justify-center gap-4 mb-16">
          <Button className="w-full md:w-auto px-8 py-6 text-base" onClick={scrollToAbout}>
            View my work
          </Button>
          <Button 
            variant="outline" 
            className="w-full md:w-auto px-8 py-6 text-base"
            asChild
          >
            <a href="#contact">Get in touch</a>
          </Button>
        </div>

        <div className="opacity-0 animate-on-scroll flex items-center justify-center space-x-6">
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

      <button
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center justify-center opacity-0 animate-on-scroll animate-bounce"
        onClick={scrollToAbout}
        aria-label="Scroll down"
      >
        <span className="text-sm mb-2 text-muted-foreground">Scroll</span>
        <ArrowDown className="w-6 h-6 text-muted-foreground" />
      </button>
    </section>
  );
};

export default Hero;
