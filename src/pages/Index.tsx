
import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Projects from '@/components/Projects';
import Skills from '@/components/Skills';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

const Index = () => {
  // Initialize animation classes
  useEffect(() => {
    // Add animation delay to elements with animate-on-scroll class
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach((element, index) => {
      const delay = index * 100; // 100ms staggered delay
      (element as HTMLElement).style.transitionDelay = `${delay}ms`;
    });

    // Apply smooth scrolling
    document.documentElement.style.scrollBehavior = 'smooth';

    // Intersection Observer for animation with improved threshold
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
        threshold: 0.15,
        rootMargin: '0px 0px -5% 0px' 
      }
    );

    document.querySelectorAll('.animate-on-scroll').forEach((element) => {
      observer.observe(element);
    });

    // Improve image loading
    const preloadImages = () => {
      const images = document.querySelectorAll('img');
      images.forEach(img => {
        if (img.getAttribute('loading') !== 'lazy') {
          img.setAttribute('loading', 'lazy');
        }
      });
    };
    
    preloadImages();

    // Set document title
    document.title = "Akash Singh - Senior Software Engineer";

    return () => {
      document.documentElement.style.scrollBehavior = '';
      observer.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground antialiased overflow-x-hidden">
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
