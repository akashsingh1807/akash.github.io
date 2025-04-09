import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, Github, Linkedin, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import ChatBot from './Chatbot';
import ThreeDShowcase from './ThreeDShowcase';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: 'easeOut',
    },
  }),
};

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in');
          }
        });
      },
      { threshold: 0.1 }
    );

    if (heroRef.current) {
      const elements = heroRef.current.querySelectorAll('.animate-on-scroll');
      elements.forEach((el) => observer.observe(el));
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-center px-6 md:px-8 lg:px-12 pt-32 pb-16"
      ref={heroRef}
      aria-label="Introduction"
    >
      <ChatBot />

      {/* Background gradient */}
      <motion.div
        className="absolute inset-0 -z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(var(--accent),0.08),transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(var(--accent),0.05),transparent_70%)]" />
      </motion.div>

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        {/* Left side - Text content */}
        <div className="space-y-6 lg:space-y-8">
          <motion.p
            className="text-muted-foreground tracking-wider uppercase text-sm"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0}
            variants={fadeInUp}
          >
            Hello, I'm
          </motion.p>

          <motion.h1
            className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={1}
            variants={fadeInUp}
          >
            <span className="gradient-text">Akash Singh</span>
          </motion.h1>

          <motion.h2
            className="text-2xl md:text-3xl lg:text-4xl font-medium"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={2}
            variants={fadeInUp}
          >
            <span className="highlight-text">Full Stack Developer</span>
          </motion.h2>

          <motion.p
            className="text-lg text-muted-foreground max-w-xl leading-relaxed"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={3}
            variants={fadeInUp}
          >
            Passionate about building scalable applications and creating exceptional user experiences.
            Specialized in Java, Spring Boot, and modern web technologies.
          </motion.p>

          <motion.div
            className="flex flex-wrap gap-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={4}
            variants={fadeInUp}
          >
            <Button 
              size="lg" 
              className="hover-highlight group"
              aria-label="View my projects"
            >
              View Projects 
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="hover-highlight"
              aria-label="Contact me"
            >
              Contact Me
            </Button>
          </motion.div>

          <motion.div
            className="flex items-center gap-6 pt-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={5}
            variants={fadeInUp}
          >
            <a
              href="https://github.com/akashsingh01"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-sky-400 transition-colors p-2 hover:bg-sky-400/10 rounded-full"
              aria-label="Visit my GitHub profile"
            >
              <Github className="h-5 w-5" />
            </a>
            <a
              href="https://linkedin.com/in/akashsingh01"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-sky-400 transition-colors p-2 hover:bg-sky-400/10 rounded-full"
              aria-label="Connect with me on LinkedIn"
            >
              <Linkedin className="h-5 w-5" />
            </a>
            <a
              href="mailto:engg.akashsingh@gmail.com"
              className="text-muted-foreground hover:text-sky-400 transition-colors p-2 hover:bg-sky-400/10 rounded-full"
              aria-label="Send me an email"
            >
              <Mail className="h-5 w-5" />
            </a>
          </motion.div>
        </div>

        {/* Right side - 3D Showcase */}
        <motion.div
          className="relative h-[500px] w-full rounded-lg overflow-hidden bg-gradient-to-br from-sky-400/5 to-transparent"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <ThreeDShowcase />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;