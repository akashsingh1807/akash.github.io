
import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import ThemeToggle from './ThemeToggle';
import LogoAnimation from './LogoAnimation';

interface NavbarProps {
  activeSection?: string;
}

const Navbar: React.FC<NavbarProps> = ({ activeSection = 'hero' }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  // Performance optimized scroll handler
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    // Use passive listener for better performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    setIsMobileMenuOpen(false);
    const section = document.getElementById(sectionId);
    section?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className={cn(
      'fixed top-0 left-0 w-full z-50 transition-all duration-300 px-6 md:px-8 lg:px-12',
      isScrolled ? 'bg-background/90 backdrop-blur-md border-b py-4' : 'bg-transparent py-6'
    )}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <LogoAnimation />

        <div className="hidden md:flex items-center space-x-8">
          {['about', 'projects', 'skills', 'contact'].map((section) => (
            <a
              key={section}
              href={`#${section}`}
              className={cn(
                'text-sm tracking-wider hover:text-primary transition-colors',
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
              'text-sm tracking-wider hover:text-primary transition-colors',
              activeSection === 'blog' ? 'text-primary font-semibold' : ''
            )}
          >
            Blog
          </Link>

          <Link
            to="/ai-features"
            className={cn(
              'text-sm tracking-wider hover:text-primary transition-colors',
              activeSection === 'ai-features' ? 'text-primary font-semibold' : ''
            )}
          >
            AI Features
          </Link>
          
          <ThemeToggle />
        </div>

        <div className="md:hidden flex items-center space-x-2">
          <ThemeToggle />
          <button
            className="p-2 focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Simplified mobile menu with fewer animations */}
      <div
        className={cn(
          'fixed inset-0 bg-background/95 backdrop-blur-md flex flex-col items-center justify-center space-y-8 pt-16 pb-8 md:hidden transition-opacity duration-300 z-40',
          isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        )}
      >
        {['about', 'projects', 'skills', 'contact'].map((section) => (
          <a
            key={section}
            href={`#${section}`}
            className="text-xl hover:text-primary transition-colors"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection(section);
            }}
          >
            {section.charAt(0).toUpperCase() + section.slice(1)}
          </a>
        ))}
        <Link to="/blog" className="text-xl hover:text-primary transition-colors">
          Blog
        </Link>
        <Link to="/ai-features" className="text-xl hover:text-primary transition-colors">
          AI Features
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
