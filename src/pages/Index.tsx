
import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Projects from '@/components/Projects';
import Skills from '@/components/Skills';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import BackgroundAnimation from '@/components/BackgroundAnimation';
import SkillTimeline from '@/components/SkillTimeline';
import { motion, useScroll, useTransform } from 'framer-motion';

const Index = () => {
  const [activeSection, setActiveSection] = useState<string>('hero');
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const [showVisualEffects, setShowVisualEffects] = useState(true);
  
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
      
      <motion.div 
        className="fixed top-4 right-4 z-50 bg-card/80 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-medium shadow-md"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <label className="flex items-center cursor-pointer">
          <span className="mr-2">Visual Effects</span>
          <input 
            type="checkbox" 
            checked={showVisualEffects} 
            onChange={() => setShowVisualEffects(!showVisualEffects)}
            className="sr-only peer"
          />
          <div className="relative w-10 h-5 bg-muted rounded-full peer peer-checked:bg-primary peer-focus:ring-2 peer-focus:ring-primary/30 transition-colors">
            <div className="absolute left-0.5 top-0.5 bg-white w-4 h-4 rounded-full transition-all peer-checked:left-5"></div>
          </div>
        </label>
      </motion.div>
      
      <main className="overflow-x-hidden">
        {/* Only show minimal background animations when effects are enabled */}
        {showVisualEffects && (
          <BackgroundAnimation opacity={0.05} />
        )}
        
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
    </div>
  );
};

export default Index;
