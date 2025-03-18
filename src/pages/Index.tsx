
import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Projects from '@/components/Projects';
import Skills from '@/components/Skills';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

const Index = () => {
  // Initialize animation classes and smooth scrolling
  useEffect(() => {
    // Add animation delay to elements with animate-on-scroll class
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach((element, index) => {
      const delay = index * 80; // Slightly faster animations (80ms instead of 100ms)
      (element as HTMLElement).style.transitionDelay = `${delay}ms`;
    });

    // Enable smooth scrolling with improved performance
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Optimize scrolling performance with passive event listeners
    const scrollOptions = { passive: true };
    const handleScroll = () => {
      // Throttled scroll handling
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

    // Set document title
    document.title = "Akash Singh - Senior Software Engineer";

    return () => {
      document.documentElement.style.scrollBehavior = '';
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground antialiased overflow-x-hidden selection:bg-primary/20">
      <Navbar />
      <main>
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
