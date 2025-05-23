
import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link, useLocation } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import LogoAnimation from './LogoAnimation';
import { useIsMobile } from '@/hooks/use-mobile';

interface NavbarProps {
  activeSection?: string;
}

const Navbar: React.FC<NavbarProps> = ({ activeSection = 'hero' }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  // Performance optimized scroll handler
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    // Use passive listener for better performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when screen size changes
  useEffect(() => {
    if (!isMobile && isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  }, [isMobile, isMobileMenuOpen]);

  const scrollToSection = (sectionId: string) => {
    setIsMobileMenuOpen(false);
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest'
      });
    }
  };

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  return (
    <nav className={cn(
      'fixed top-0 left-0 w-full z-50 transition-all duration-300 px-4 md:px-6 lg:px-8 xl:px-12 safe-top',
      isScrolled ? 'bg-background/95 backdrop-blur-md border-b py-3 md:py-4' : 'bg-transparent py-4 md:py-6'
    )}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <LogoAnimation />

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
          {['about', 'projects', 'skills', 'contact'].map((section) => (
            <a
              key={section}
              href={`#${section}`}
              className={cn(
                'text-sm tracking-wider hover:text-primary transition-colors duration-200 touch-button',
                activeSection === section ? 'text-primary font-semibold' : ''
              )}
              onClick={(e) => {
                e.preventDefault();
                scrollToSection(section);
              }}
            >
              {section.charAt(0).toUpperCase() + section.slice(1)}
            </a>
          ))}
          <Link
            to="/blog"
            className={cn(
              'text-sm tracking-wider hover:text-primary transition-colors duration-200 touch-button',
              activeSection === 'blog' ? 'text-primary font-semibold' : ''
            )}
          >
            Blog
          </Link>

          <Link
            to="/ai-features"
            className={cn(
              'text-sm tracking-wider hover:text-primary transition-colors duration-200 touch-button',
              activeSection === 'ai-features' ? 'text-primary font-semibold' : ''
            )}
          >
            AI Features
          </Link>

          <Link
            to="/merchandise"
            className={cn(
              'text-sm tracking-wider hover:text-primary transition-colors duration-200 touch-button',
              activeSection === 'merchandise' ? 'text-primary font-semibold' : ''
            )}
          >
            Merch Store
          </Link>
          
          <ThemeToggle />
        </div>

        {/* Mobile menu toggle */}
        <div className="md:hidden flex items-center space-x-3">
          <ThemeToggle />
          <button
            className="p-2 touch-button focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu overlay */}
      <div
        className={cn(
          'fixed inset-0 bg-background/98 backdrop-blur-md md:hidden transition-all duration-300 z-40',
          isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        )}
      >
        <div className="flex flex-col items-center justify-center h-full space-y-8 px-4 safe-bottom">
          {['about', 'projects', 'skills', 'contact'].map((section, index) => (
            <a
              key={section}
              href={`#${section}`}
              className={cn(
                'text-xl font-medium hover:text-primary transition-colors duration-200 touch-button animate-mobile-slide-up',
                { 'animation-delay-100': index === 1 },
                { 'animation-delay-200': index === 2 },
                { 'animation-delay-300': index === 3 }
              )}
              onClick={(e) => {
                e.preventDefault();
                scrollToSection(section);
              }}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {section.charAt(0).toUpperCase() + section.slice(1)}
            </a>
          ))}
          <Link 
            to="/blog" 
            className="text-xl font-medium hover:text-primary transition-colors duration-200 touch-button animate-mobile-slide-up"
            style={{ animationDelay: '400ms' }}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Blog
          </Link>
          <Link 
            to="/ai-features" 
            className="text-xl font-medium hover:text-primary transition-colors duration-200 touch-button animate-mobile-slide-up"
            style={{ animationDelay: '500ms' }}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            AI Features
          </Link>
          <Link 
            to="/merchandise" 
            className="text-xl font-medium hover:text-primary transition-colors duration-200 touch-button animate-mobile-slide-up"
            style={{ animationDelay: '600ms' }}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Merch Store
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
