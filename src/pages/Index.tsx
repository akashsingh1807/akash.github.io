
import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Projects from '@/components/Projects';
import Skills from '@/components/Skills';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import DialogflowChat from '@/components/DialogflowChat';

import SkillTimeline from '@/components/SkillTimeline';
import { motion, useScroll, useTransform } from 'framer-motion';

const Index = () => {
  const [activeSection, setActiveSection] = useState<string>('hero');
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  
  // Optimize the effect to reduce reflows and repaints
  useEffect(() => {
    // Enhanced observer configuration for mobile
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.getAttribute('id') || '';
            setActiveSection(sectionId);
            
            // Add visible class to animate elements
            entry.target.querySelectorAll('.animate-on-scroll').forEach(el => {
              el.classList.add('animate-fade-in');
            });
          }
        });
      },
      { 
        threshold: 0.2, // Reduced threshold for mobile
        rootMargin: '-10% 0px -10% 0px' // Added margin for better mobile detection
      }
    );

    // Observe all sections
    document.querySelectorAll('section[id]').forEach(section => {
      observer.observe(section);
    });

    // Enhanced smooth scrolling for mobile
    const handleSmoothScroll = (e: Event) => {
      const target = e.target as HTMLAnchorElement;
      if (target.hash) {
        e.preventDefault();
        const element = document.querySelector(target.hash);
        if (element) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
            inline: 'nearest'
          });
        }
      }
    };

    // Add smooth scroll to all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', handleSmoothScroll);
    });

    // Clean up
    return () => {
      observer.disconnect();
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.removeEventListener('click', handleSmoothScroll);
      });
    };
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground antialiased overflow-x-hidden">
      <Navbar activeSection={activeSection} />
      
      <main className="relative">
        {/* Mobile-optimized progress indicator */}
        <motion.div 
          className="fixed bottom-4 left-4 z-50 flex items-center gap-2 bg-background/80 backdrop-blur-sm rounded-full px-3 py-2 border md:bg-transparent md:backdrop-blur-none md:border-0 md:px-0 md:py-0"
          style={{ opacity }}
        >
          <div className="w-16 md:w-20 h-1 md:h-1.5 bg-muted rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-primary origin-left" 
              style={{ scaleX: scrollYProgress }}
            />
          </div>
          <span className="text-xs font-medium hidden md:inline">Scroll</span>
        </motion.div>
        
        {/* Page content with mobile spacing */}
        <div className="space-y-0">
          <Hero />
          <About />
          <Projects />
          <SkillTimeline />
          <Skills />
          <Contact />
        </div>
      </main>
      
      <Footer />
      
      {/* Dialogflow Chat Widget - Mobile optimized */}
      <DialogflowChat />
    </div>
  );
};

export default Index;
