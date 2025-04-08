
import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Projects from '@/components/Projects';
import Skills from '@/components/Skills';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import BackgroundAnimation from '@/components/BackgroundAnimation';
import AutoPilotGame from '@/components/AutoPilotGame';
import SnakeGame from '@/components/SnakeGame';
import SplineBackground from '@/components/SplineBackground';
import SkillTimeline from '@/components/SkillTimeline';
import { motion, useScroll, useTransform } from 'framer-motion';

const Index = () => {
  const [activeSection, setActiveSection] = useState<string>('hero');
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  
  // Initialize animation classes and smooth scrolling with improved performance
  useEffect(() => {
    // Add animation delay to elements with animate-on-scroll class
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach((element, index) => {
      const delay = index * 60; // Even faster animations to reduce perceived lag
      (element as HTMLElement).style.transitionDelay = `${delay}ms`;
    });

    // Enable smooth scrolling with improved performance
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Optimize scrolling performance with passive event listeners and throttling
    let ticking = false;
    const scrollOptions = { passive: true };
    
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          // Determine active section for navigation highlighting
          const sections = document.querySelectorAll('section[id]');
          const scrollPosition = window.scrollY + window.innerHeight / 3;
          
          sections.forEach(section => {
            const sectionTop = (section as HTMLElement).offsetTop;
            const sectionHeight = (section as HTMLElement).offsetHeight;
            const sectionId = section.getAttribute('id') || '';
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
              setActiveSection(sectionId);
            }
          });
          
          // Add scroll-based parallax and reveal effects
          const parallaxElements = document.querySelectorAll('.parallax-element');
          parallaxElements.forEach(element => {
            const speed = parseFloat(element.getAttribute('data-speed') || '0.1');
            const rect = element.getBoundingClientRect();
            const inView = rect.top < window.innerHeight && rect.bottom > 0;
            if (inView) {
              const yPos = -((window.scrollY - rect.top) * speed);
              (element as HTMLElement).style.transform = `translateY(${yPos}px)`;
            }
          });

          // Handle reveal animations more efficiently
          const revealElements = document.querySelectorAll('.reveal-element:not(.revealed)');
          revealElements.forEach(element => {
            const rect = element.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            
            if (rect.top < windowHeight * 0.85) {
              element.classList.add('revealed');
              element.classList.add('animate-fade-in');
            }
          });
          
          ticking = false;
        });
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', handleScroll, scrollOptions);

    // Improved Intersection Observer for better animation performance
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

    document.querySelectorAll('.animate-on-scroll').forEach((element) => {
      observer.observe(element);
    });

    // Improve image loading with priority loading for visible images
    const preloadImages = () => {
      const images = document.querySelectorAll('img');
      images.forEach(img => {
        if (img.getAttribute('loading') !== 'lazy') {
          img.setAttribute('loading', 'lazy');
          img.setAttribute('decoding', 'async'); // Add async decoding for better performance
        }
      });
    };
    
    preloadImages();

    // Apply initial animations
    document.querySelectorAll('.initial-animation').forEach((element, index) => {
      setTimeout(() => {
        element.classList.add('visible');
      }, index * 100);
    });

    // Set document title
    document.title = "Akash Singh - Senior Software Engineer";

    return () => {
      document.documentElement.style.scrollBehavior = '';
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  // Progressive enhancement indicator that can be toggled by the user
  const [showVisualEffects, setShowVisualEffects] = useState(true);

  return (
    <div className="min-h-screen bg-background text-foreground antialiased">
      <Navbar activeSection={activeSection} />
      
      <motion.div 
        className="fixed top-4 right-4 z-50 bg-card/80 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-medium shadow-md"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2 }}
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
        {/* Background animations - conditionally rendered based on preference */}
        {showVisualEffects && (
          <>
            <SplineBackground />
            <BackgroundAnimation opacity={0.10} />
            <div className="hidden md:block">
              <AutoPilotGame />
            </div>
            <div className="hidden lg:block">
              <SnakeGame />
            </div>
          </>
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
        
        {/* Timeline section - enhanced career journey */}
        <SkillTimeline />
        
        {/* Additional sections */}
        <Skills />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
