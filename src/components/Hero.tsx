
import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, Github, Linkedin, Mail, Camera, Dumbbell, Paintbrush, CupSoda, Waves } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const [activeInterest, setActiveInterest] = useState(0);

  const interests = [
    { icon: <Camera className="w-5 h-5 mr-2" />, text: "Part-time Photographer" },
    { icon: <Paintbrush className="w-5 h-5 mr-2" />, text: "Graphic Designer" },
    { icon: <CupSoda className="w-5 h-5 mr-2" />, text: "Hardcore Tea Lover" },
    { icon: <Dumbbell className="w-5 h-5 mr-2" />, text: "Gym & Calisthenics Enthusiast" },
    { icon: <Waves className="w-5 h-5 mr-2" />, text: "Swimmer" },
  ];

  // Animation variants for different elements
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.15,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };

  const socialIconVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: (i: number) => ({
      opacity: 1,
      scale: 1,
      transition: {
        delay: i * 0.1 + 0.8,
        duration: 0.3,
        type: "spring",
        stiffness: 200
      }
    }),
    hover: {
      scale: 1.2,
      rotate: 5,
      transition: { duration: 0.2 }
    },
    tap: { scale: 0.95 }
  };

  useEffect(() => {
    // Animation observer for fade-in effect
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

    if (heroRef.current) {
      const elements = heroRef.current.querySelectorAll('.animate-on-scroll');
      elements.forEach((el) => observer.observe(el));
    }

    // Rotate through interests
    const interestInterval = setInterval(() => {
      setActiveInterest((prev) => (prev + 1) % interests.length);
    }, 2000);

    return () => {
      observer.disconnect();
      clearInterval(interestInterval);
    };
  }, []);

  const scrollToAbout = () => {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      const yOffset = -80;
      const y = aboutSection.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({
        top: y,
        behavior: 'smooth',
      });
    }
  };

  const handleScrollDownClick = () => {
    scrollToAbout();
  };

  return (
      <section
          id="hero"
          className="relative min-h-screen flex flex-col justify-center px-6 md:px-8 lg:px-12 pt-20 pb-16"
          ref={heroRef}
      >
        <motion.div 
          className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,rgba(var(--accent),0.08),transparent_70%)]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        />

        <div className="max-w-5xl mx-auto">
          <motion.p 
            className="text-muted-foreground mb-4 tracking-wider uppercase text-sm"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0}
            variants={fadeInUp}
          >
            Hello, I'm
          </motion.p>
          
          <motion.h1 
            className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={1}
            variants={fadeInUp}
          >
            Akash Singh
          </motion.h1>
          
          <motion.h2 
            className="text-xl md:text-2xl lg:text-3xl text-muted-foreground font-medium mb-8 max-w-xl"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={2}
            variants={fadeInUp}
          >
            Full Stack Java Engineer | Cloud & Enterprise Software Developer
          </motion.h2>
          
          <motion.p 
            className="text-muted-foreground max-w-xl mb-6 leading-relaxed"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={3}
            variants={fadeInUp}
          >
            Passionate about building scalable and high-performance applications.
            With 5 years of experience in Java, Spring Boot, Microservices, and cloud-native
            technologies, I specialize in developing solutions that drive efficiency and reliability.
            My expertise spans backend development, DevOps, and enterprise software architecture.
          </motion.p>
          
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={4}
            variants={fadeInUp}
            className="mb-10"
          >
            <AnimatePresence mode="wait">
              <motion.div 
                className="flex items-center px-4 py-2 bg-primary/10 rounded-full text-primary w-fit"
                key={activeInterest}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 20, opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                {interests[activeInterest].icon}
                <span className="font-medium">{interests[activeInterest].text}</span>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          <motion.div 
            className="flex flex-wrap items-center gap-4 mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={5}
            variants={fadeInUp}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                  className="group px-6 py-6 text-base relative overflow-hidden"
                  onClick={scrollToAbout}
                  type="button"
              >
                <motion.span className="relative z-10 flex items-center">
                  Learn More
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </motion.span>
                <motion.span 
                  className="absolute inset-0 bg-primary/10 -z-10" 
                  initial={{ scale: 0, opacity: 0 }}
                  whileHover={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </Button>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                  variant="outline"
                  className="px-6 py-6 text-base relative overflow-hidden"
                  asChild
              >
                <a href="#contact">
                  <motion.span className="relative z-10">Let's Connect</motion.span>
                  <motion.span 
                    className="absolute inset-0 bg-primary/5 -z-10" 
                    initial={{ scale: 0, opacity: 0 }}
                    whileHover={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </a>
              </Button>
            </motion.div>
          </motion.div>

          <motion.div 
            className="flex items-center space-x-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={6}
            variants={fadeInUp}
          >
            <motion.a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full hover:bg-muted transition-colors"
                aria-label="GitHub"
                variants={socialIconVariants}
                custom={0}
                whileHover="hover"
                whileTap="tap"
            >
              <Github className="w-6 h-6" />
            </motion.a>
            <motion.a
                href="https://www.linkedin.com/in/itsmeakashsingh/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full hover:bg-muted transition-colors"
                aria-label="LinkedIn"
                variants={socialIconVariants}
                custom={1}
                whileHover="hover"
                whileTap="tap"
            >
              <Linkedin className="w-6 h-6" />
            </motion.a>
            <motion.a
                href="mailto:Engg.akashsingh@gmail.com"
                className="p-2 rounded-full hover:bg-muted transition-colors"
                aria-label="Email"
                variants={socialIconVariants}
                custom={2}
                whileHover="hover"
                whileTap="tap"
            >
              <Mail className="w-6 h-6" />
            </motion.a>
          </motion.div>
        </div>

        <motion.div 
          className="absolute bottom-10 left-6 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={handleScrollDownClick}
          aria-label="Scroll down to explore"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.5 }}
          whileHover={{ y: 5 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="flex flex-col items-start justify-center">
            <motion.span
              className="text-sm mb-2 text-muted-foreground tracking-wider uppercase"
              animate={{ opacity: [0.5, 1, 0.5], y: [0, -3, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              Scroll Down to Explore
            </motion.span>
            <div className="w-[2px] h-[60px] bg-border overflow-hidden">
              <motion.div 
                className="w-full h-[60px] bg-foreground"
                animate={{ y: ["-100%", "100%"] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              />
            </div>
          </div>
        </motion.div>
      </section>
  );
};

export default Hero;
