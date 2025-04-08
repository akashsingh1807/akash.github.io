
import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

interface NavbarProps {
  activeSection?: string;
}

const Navbar: React.FC<NavbarProps> = ({ activeSection }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
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
          <motion.div whileHover={{ scale: 1.05 }}>
            <Link to="/" className="text-lg md:text-xl font-bold tracking-tight flex items-center">
              <motion.span
                  className="inline-block"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
              >
                a
              </motion.span>
              <motion.span
                  className="ml-1"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
              >
                kash.
              </motion.span>
            </Link>
          </motion.div>

          <div className="hidden md:flex items-center space-x-8">
            {['about', 'projects', 'skills', 'contact'].map((section) => (
                <motion.a
                    key={section}
                    href={`#${section}`}
                    className={cn(
                      "text-sm tracking-wider transition-colors",
                      activeSection === section ? "text-primary font-medium" : "hover:text-primary"
                    )}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(section);
                    }}
                    whileHover={{ scale: 1.05 }}
                >
                  {section.charAt(0).toUpperCase() + section.slice(1)}
                </motion.a>
            ))}
            <Link
                to="/blog"
                className="text-sm tracking-wider hover:text-primary transition-colors"
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

        <motion.div
            className={cn(
                'fixed inset-0 bg-background/95 backdrop-blur-md flex flex-col items-center justify-center space-y-8 pt-16 pb-8 md:hidden',
                isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
            )}
            animate={isMobileMenuOpen ? 'open' : 'closed'}
            variants={{
              open: { opacity: 1, transition: { staggerChildren: 0.1 } },
              closed: { opacity: 0 }
            }}
        >
          {['about', 'projects', 'skills', 'contact', 'blog'].map((section, index) => (
              <motion.a
                  key={section}
                  href={`#${section}`}
                  className={cn(
                    "text-xl transition-colors",
                    activeSection === section ? "text-primary font-medium" : "hover:text-primary"
                  )}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(section);
                  }}
                  variants={{
                    open: { y: 0, opacity: 1 },
                    closed: { y: -20, opacity: 0 }
                  }}
                  transition={{ delay: index * 0.1 }}
              >
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </motion.a>
          ))}
        </motion.div>
      </nav>
  );
};

export default Navbar;
