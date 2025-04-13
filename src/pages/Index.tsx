
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
    // Simpler observer configuration for better performance
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
      { threshold: 0.3 }
    );

    // Observe all sections
    document.querySelectorAll('section[id]').forEach(section => {
      observer.observe(section);
    });

    // Clean up observer on component unmount
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground antialiased">
      <Navbar activeSection={activeSection} />
      
      <main className="overflow-x-hidden">
        {/* Background animation */}
        
        
        {/* Hero section with progress indicator */}
        <motion.div 
          className="fixed bottom-4 left-4 z-50 flex items-center gap-2"
          style={{ opacity }}
        >
          <div className="w-20 h-1.5 bg-muted rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-primary origin-left" 
              style={{ scaleX: scrollYProgress }}
            />
          </div>
          <span className="text-xs font-medium">Scroll</span>
        </motion.div>
        
        {/* Page content */}
        <Hero />
        <About />
        <Projects />
        <SkillTimeline />
        <Skills />
        <Contact />
      </main>
      
      <Footer />
      
      {/* Dialogflow Chat Widget */}
      <DialogflowChat />
    </div>
  );
};

export default Index;
