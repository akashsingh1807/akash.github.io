
import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  // Handle scroll effect and active section
  useEffect(() => {
    const handleScroll = () => {
      // Update navbar background
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // Update active section
      const sections = ['hero', 'about', 'projects', 'skills', 'contact'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetHeight = element.offsetHeight;

          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Handle section navigation
  const scrollToSection = (sectionId: string) => {
    setIsMobileMenuOpen(false);
    const section = document.getElementById(sectionId);
    if (section) {
      const yOffset = -80;
      const y = section.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 w-full z-50 transition-all duration-300 px-6 md:px-8 lg:px-12',
        isScrolled
          ? 'bg-background/90 backdrop-blur-md border-b py-4'
          : 'bg-transparent py-6'
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <a
          href="#hero"
          className="text-lg md:text-xl font-bold tracking-tight transition-opacity hover:opacity-80"
          onClick={(e) => {
            e.preventDefault();
            scrollToSection('hero');
          }}
        >
          akash.
        </a>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-10">
          <a
            href="#about"
            className={cn(
              "nav-link text-sm tracking-wider",
              activeSection === 'about' && "active"
            )}
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('about');
            }}
          >
            About
          </a>
          <a
            href="#projects"
            className={cn(
              "nav-link text-sm tracking-wider",
              activeSection === 'projects' && "active"
            )}
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('projects');
            }}
          >
            Projects
          </a>
          <a
            href="#skills"
            className={cn(
              "nav-link text-sm tracking-wider",
              activeSection === 'skills' && "active"
            )}
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('skills');
            }}
          >
            Skills
          </a>
          <a
            href="#contact"
            className={cn(
              "nav-link text-sm tracking-wider",
              activeSection === 'contact' && "active"
            )}
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('contact');
            }}
          >
            Contact
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 focus:outline-none"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          'fixed inset-0 bg-background/95 backdrop-blur-md flex flex-col items-center justify-center space-y-8 pt-16 pb-8 transition-all duration-300 ease-in-out md:hidden',
          isMobileMenuOpen ? 'opacity-100 visible z-40' : 'opacity-0 invisible -z-10'
        )}
      >
        <a
          href="#about"
          className="text-xl nav-link"
          onClick={(e) => {
            e.preventDefault();
            scrollToSection('about');
          }}
        >
          About
        </a>
        <a
          href="#projects"
          className="text-xl nav-link"
          onClick={(e) => {
            e.preventDefault();
            scrollToSection('projects');
          }}
        >
          Projects
        </a>
        <a
          href="#skills"
          className="text-xl nav-link"
          onClick={(e) => {
            e.preventDefault();
            scrollToSection('skills');
          }}
        >
          Skills
        </a>
        <a
          href="#contact"
          className="text-xl nav-link"
          onClick={(e) => {
            e.preventDefault();
            scrollToSection('contact');
          }}
        >
          Contact
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
