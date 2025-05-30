
import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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
  const location = useLocation();
  const navigate = useNavigate();

  // Shared navigation item styles for perfect alignment
  const navItemStyles = 'text-sm tracking-wider hover:text-primary transition-colors duration-200 touch-button inline-flex items-center justify-center h-6 leading-6 font-normal';

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

  const handleSectionNavigation = (sectionId: string) => {
    setIsMobileMenuOpen(false);

    // If we're not on the home page, navigate to home first
    if (location.pathname !== '/') {
      navigate(`/#${sectionId}`);
      return;
    }

    // If we're on the home page, scroll to the section
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest'
      });
    }
  };

  // Handle navigation with hash when arriving at home page
  useEffect(() => {
    if (location.pathname === '/' && location.hash) {
      const sectionId = location.hash.substring(1);
      const section = document.getElementById(sectionId);
      if (section) {
        // Small delay to ensure the page has loaded
        setTimeout(() => {
          section.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
            inline: 'nearest'
          });
        }, 100);
      }
    }
  }, [location]);

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
        <div className="hidden md:flex items-baseline space-x-6 lg:space-x-8">
          {['about', 'projects', 'skills', 'contact'].map((section) => (
            <button
              key={section}
              className={cn(
                navItemStyles,
                'bg-transparent border-none p-0 cursor-pointer',
                activeSection === section ? 'text-primary font-semibold' : ''
              )}
              onClick={() => handleSectionNavigation(section)}
            >
              {section.charAt(0).toUpperCase() + section.slice(1)}
            </button>
          ))}
          <Link
            to="/blog"
            className={cn(
              navItemStyles,
              activeSection === 'blog' ? 'text-primary font-semibold' : ''
            )}
          >
            AI-Powered Content Hub
          </Link>

          <Link
            to="/resume"
            className={cn(
              navItemStyles,
              activeSection === 'resume' ? 'text-primary font-semibold' : ''
            )}
          >
            Resume Enhancer
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
            <button
              key={section}
              className={cn(
                'text-xl font-medium hover:text-primary transition-colors duration-200 touch-button animate-mobile-slide-up bg-transparent border-none p-0 cursor-pointer inline-flex items-center justify-center',
                { 'animation-delay-100': index === 1 },
                { 'animation-delay-200': index === 2 },
                { 'animation-delay-300': index === 3 }
              )}
              onClick={() => handleSectionNavigation(section)}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {section.charAt(0).toUpperCase() + section.slice(1)}
            </button>
          ))}
          <Link
            to="/blog"
            className="text-xl font-medium hover:text-primary transition-colors duration-200 touch-button animate-mobile-slide-up inline-flex items-center justify-center"
            style={{ animationDelay: '400ms' }}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            AI-Powered Content Hub
          </Link>

          <Link
            to="/resume"
            className="text-xl font-medium hover:text-primary transition-colors duration-200 touch-button animate-mobile-slide-up inline-flex items-center justify-center"
            style={{ animationDelay: '500ms' }}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Resume Enhancer
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
