
import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

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
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 100, damping: 10 }}
        >
          <Link to="/" className="text-lg md:text-xl font-bold tracking-tight flex items-center">
            <motion.span 
              className="inline-block"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              a
            </motion.span>
            <motion.span 
              className="ml-1"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              kash.
            </motion.span>
          </Link>
        </motion.div>

        <div className="hidden md:flex items-center space-x-8">
          {['about', 'projects', 'skills', 'contact'].map((section) => (
            <a
              key={section}
              href={`#${section}`}
              className={cn(
                'text-sm tracking-wider hover:text-primary transition-colors',
                activeSection === section ? 'text-primary font-semibold text-highlight' : ''
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
        </div>

        <button
          className="md:hidden p-2 focus:outline-none"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Simplified mobile menu with fewer animations */}
      <div
        className={cn(
          'fixed inset-0 bg-background/95 backdrop-blur-md flex flex-col items-center justify-center space-y-8 pt-16 pb-8 md:hidden transition-opacity duration-300 z-40',
          isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        )}
      >
        {['about', 'projects', 'skills', 'contact', 'blog'].map((section) => (
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
      </div>
    </nav>
  );
};

export default Navbar;
