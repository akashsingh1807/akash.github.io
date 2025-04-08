
import React, { useEffect } from 'react';
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

const Index = () => {
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

  return (
    <div className="min-h-screen bg-background text-foreground antialiased">
      <Navbar />
      <main className="overflow-x-hidden">
        {/* Background animations */}
        <SplineBackground />
        <BackgroundAnimation opacity={0.15} />
        <AutoPilotGame />
        <SnakeGame />
        
        {/* Page content */}
        <Hero />
        <About />
        <Projects />
        <Skills />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
