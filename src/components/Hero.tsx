
import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, Github, Linkedin, Mail, Camera, Dumbbell, PaintBrush, CupSoda, Waves } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const [activeInterest, setActiveInterest] = useState(0);

  const interests = [
    { icon: <Camera className="w-5 h-5 mr-2" />, text: "Part-time Photographer" },
    { icon: <PaintBrush className="w-5 h-5 mr-2" />, text: "Graphic Designer" },
    { icon: <CupSoda className="w-5 h-5 mr-2" />, text: "Hardcore Tea Lover" },
    { icon: <Dumbbell className="w-5 h-5 mr-2" />, text: "Gym & Calisthenics Enthusiast" },
    { icon: <Waves className="w-5 h-5 mr-2" />, text: "Swimmer" },
  ];

  useEffect(() => {
    // Animation observer for fade-in effect
    const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('animate-fade-in');
              observer.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.1,
          rootMargin: '0px 0px -5% 0px'
        }
    );

    if (heroRef.current) {
      const elements = heroRef.current.querySelectorAll('.animate-on-scroll');
      elements.forEach((el) => observer.observe(el));
    }

    // Rotate through interests
    const interestInterval = setInterval(() => {
      setActiveInterest((prev) => (prev + 1) % interests.length);
    }, 2000);

    return () => {
      observer.disconnect();
      clearInterval(interestInterval);
    };
  }, []);

  const scrollToAbout = () => {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      const yOffset = -80;
      const y = aboutSection.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({
        top: y,
        behavior: 'smooth',
      });
    }
  };

  const handleScrollDownClick = () => {
    scrollToAbout();
  };

  return (
      <section
          id="hero"
          className="relative min-h-screen flex flex-col justify-center px-6 md:px-8 lg:px-12 pt-20 pb-16"
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
            Full Stack Java Engineer | Cloud & Enterprise Software Developer
          </h2>
          <p className="opacity-0 animate-on-scroll text-muted-foreground max-w-xl mb-6 leading-relaxed">
            Passionate about building scalable and high-performance applications.
            With 5 years of experience in Java, Spring Boot, Microservices, and cloud-native
            technologies, I specialize in developing solutions that drive efficiency and reliability.
            My expertise spans backend development, DevOps, and enterprise software architecture.
          </p>
          
          <div className="opacity-0 animate-on-scroll mb-10">
            <motion.div 
              className="flex items-center px-4 py-2 bg-primary/10 rounded-full text-primary w-fit"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 20, opacity: 0 }}
              key={activeInterest}
              transition={{ duration: 0.5 }}
            >
              {interests[activeInterest].icon}
              <span className="font-medium">{interests[activeInterest].text}</span>
            </motion.div>
          </div>

          <div className="opacity-0 animate-on-scroll flex flex-wrap items-center gap-4 mb-16">
            <Button
                className="group px-6 py-6 text-base"
                onClick={scrollToAbout}
                type="button"
            >
              Learn More
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button
                variant="outline"
                className="px-6 py-6 text-base"
                asChild
            >
              <a href="#contact">Let's Connect</a>
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

        <div 
          className="absolute bottom-10 left-6 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={handleScrollDownClick}
          aria-label="Scroll down to explore"
        >
          <div className="flex flex-col items-start justify-center">
            <span className="text-sm mb-2 text-muted-foreground tracking-wider uppercase">Scroll Down to Explore</span>
            <div className="w-[2px] h-[60px] bg-border overflow-hidden">
              <div className="w-full h-[60px] bg-foreground animate-[scroll-indicator_2s_ease-in-out_infinite]"></div>
            </div>
          </div>
        </div>
      </section>
  );
};

export default Hero;
