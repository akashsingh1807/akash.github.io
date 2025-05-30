
import React, { useRef, useEffect } from 'react';
import { ArrowRight, Github, Linkedin, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import ThreeDModel from './ThreeDModel';
import { useIsMobile } from '@/hooks/use-mobile';
import CodeParticles from './CodeParticles';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};



// Floating elements animation
const FloatingElement = ({ children, delay = 0, duration = 3 }: { children: React.ReactNode; delay?: number; duration?: number }) => (
  <motion.div
    animate={{
      y: [-10, 10, -10],
      rotate: [-2, 2, -2],
    }}
    transition={{
      duration,
      repeat: Infinity,
      delay,
      ease: "easeInOut",
    }}
  >
    {children}
  </motion.div>
);

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in');
          }
        });
      },
      { threshold: 0.1 }
    );

    if (heroRef.current) {
      const elements = heroRef.current.querySelectorAll('.animate-on-scroll');
      elements.forEach((el) => observer.observe(el));
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-center px-4 md:px-8 lg:px-12 pt-20 md:pt-32 pb-16"
      ref={heroRef}
      aria-label="Introduction"
    >
      {/* Enhanced Background with particles */}
      <motion.div
        className="absolute inset-0 -z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(var(--accent),0.08),transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(var(--accent),0.05),transparent_70%)]" />
        <CodeParticles />
      </motion.div>

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12 items-center">
        {/* Left side - Text content */}
        <div className="space-y-4 md:space-y-6 lg:space-y-8 order-2 lg:order-1">
          <motion.p
            className="text-muted-foreground tracking-wider uppercase text-xs md:text-sm"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0}
            variants={fadeInUp}
          >
            Hello, I'm
          </motion.p>

          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tighter"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={1}
            variants={fadeInUp}
          >
            <span className="gradient-text">Akash Singh</span>
          </motion.h1>

          <motion.h2
            className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-medium"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={2}
            variants={fadeInUp}
          >
            <span className="highlight-text">Full Stack Developer</span>
          </motion.h2>

          <motion.p
            className="text-base md:text-lg text-muted-foreground max-w-xl leading-relaxed"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={3}
            variants={fadeInUp}
          >
            Passionate about building scalable applications and creating exceptional user experiences.
            Specialized in Java, Spring Boot, and modern web technologies.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-3 md:gap-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={4}
            variants={fadeInUp}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto"
            >
              <Button
                size={isMobile ? "default" : "lg"}
                className="hover-highlight group w-full relative overflow-hidden"
                aria-label="View my projects"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.5 }}
                />
                <span className="relative z-10">View Projects</span>
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1 relative z-10" />
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto"
            >
              <Button
                size={isMobile ? "default" : "lg"}
                variant="outline"
                className="hover-highlight w-full group relative overflow-hidden"
                aria-label="Contact me"
              >
                <motion.div
                  className="absolute inset-0 bg-primary/10"
                  initial={{ scale: 0 }}
                  whileHover={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                />
                <span className="relative z-10">Contact Me</span>
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            className="flex items-center justify-center sm:justify-start gap-4 md:gap-6 pt-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={5}
            variants={fadeInUp}
          >
            {[
              { href: "https://github.com/akashsingh01", icon: Github, label: "Visit my GitHub profile", delay: 0 },
              { href: "https://linkedin.com/in/akashsingh01", icon: Linkedin, label: "Connect with me on LinkedIn", delay: 0.1 },
              { href: "mailto:engg.akashsingh@gmail.com", icon: Mail, label: "Send me an email", delay: 0.2 }
            ].map((social, index) => (
              <FloatingElement key={index} delay={social.delay} duration={4}>
                <motion.a
                  href={social.href}
                  target={social.href.startsWith('mailto:') ? undefined : "_blank"}
                  rel={social.href.startsWith('mailto:') ? undefined : "noopener noreferrer"}
                  className="text-muted-foreground hover:text-sky-400 transition-all duration-300 p-3 hover:bg-sky-400/10 rounded-full touch-button group relative"
                  aria-label={social.label}
                  whileHover={{
                    scale: 1.2,
                    rotate: [0, -10, 10, 0],
                    transition: { duration: 0.3 }
                  }}
                  whileTap={{ scale: 0.9 }}
                >
                  <motion.div
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-sky-400/20 to-primary/20"
                    initial={{ scale: 0, opacity: 0 }}
                    whileHover={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                  <social.icon className="h-5 w-5 relative z-10 group-hover:drop-shadow-lg" />
                </motion.a>
              </FloatingElement>
            ))}
          </motion.div>
        </div>

        {/* Right side - Enhanced 3D Model */}
        <div className="relative h-[250px] md:h-[350px] lg:h-[450px] xl:h-[500px] w-full order-1 lg:order-2">
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotateY: -30 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
            className="w-full h-full relative"
          >
            {/* Floating decorative elements */}
            <FloatingElement delay={1} duration={5}>
              <div className="absolute top-4 right-4 w-3 h-3 bg-primary/60 rounded-full blur-sm" />
            </FloatingElement>
            <FloatingElement delay={2} duration={4}>
              <div className="absolute bottom-8 left-8 w-2 h-2 bg-accent/60 rounded-full blur-sm" />
            </FloatingElement>
            <FloatingElement delay={0.5} duration={6}>
              <div className="absolute top-1/3 left-4 w-1 h-1 bg-sky-400/60 rounded-full blur-sm" />
            </FloatingElement>

            <ThreeDModel />
          </motion.div>
          {!isMobile && (
            <motion.div
              className="absolute inset-0 pointer-events-none bg-gradient-to-r from-transparent to-background/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;
