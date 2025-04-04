import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, Github, Linkedin, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import ChatBot from './Chatbot';

const interests = [
  { text: 'Java Development', icon: '💻' },
  { text: 'Cloud Architecture', icon: '☁️' },
  { text: 'Microservices', icon: '🔄' },
  { text: 'DevOps', icon: '🚀' },
  { text: 'Healthcare IT', icon: '🏥' },
  { text: 'Caffeine Conversion Specialist', icon: '☕' },
  { text: 'Bug Whisperer', icon: '🐛' },
  { text: 'Stack Overflow Survivor', icon: '🏆' },
];

const codingQuotes = [
  "I don't always test my code, but when I do, I do it in production.",
  "It's not a bug, it's an undocumented feature.",
  "My code doesn't work, I have no idea why. My code works, I have no idea why.",
  "The best thing about a boolean is even if you're wrong, you're only off by a bit.",
  "Life would be so much easier if we only had the source code.",
];

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: 'easeOut',
    },
  }),
};

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const [activeInterest, setActiveInterest] = useState(0);
  const [activeQuote, setActiveQuote] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

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

    const interestInterval = setInterval(() => {
      setActiveInterest((prev) => (prev + 1) % interests.length);
    }, 3000);

    const quoteInterval = setInterval(() => {
      setActiveQuote((prev) => (prev + 1) % codingQuotes.length);
    }, 8000);

    return () => {
      observer.disconnect();
      clearInterval(interestInterval);
      clearInterval(quoteInterval);
    };
  }, []);

  return (
    <section
        id="hero"
        className="relative min-h-screen flex flex-col justify-center px-6 md:px-8 lg:px-12 pt-20 pb-16 overflow-hidden"
        ref={heroRef}
    >
      <ChatBot />

      <div className="absolute inset-0 -z-10 opacity-10 pointer-events-none overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-primary font-mono text-xs sm:text-sm"
            initial={{
              x: Math.random() * 100 - 50 + "%",
              y: Math.random() * 100 - 50 + "%",
              opacity: 0,
            }}
            animate={{
              x: Math.random() * 100 - 50 + "%",
              y: Math.random() * 100 - 50 + "%",
              opacity: [0, 0.7, 0],
              rotate: Math.random() * 360,
            }}
            transition={{
              duration: 15 + Math.random() * 20,
              repeat: Infinity,
              delay: i * 2,
            }}
          >
            {[
              "if (coffee.isEmpty()) { dev.replenish(); }",
              "while (alive) { eat(); sleep(); code(); repeat(); }",
              "try { code(); } catch (bugs) { fixBugs(); }",
              "function solve(problem) { return coffee + code; }",
              "// TODO: Write better comments"
            ][i % 5]}
          </motion.div>
        ))}
      </div>

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
          <span className="inline-block">
            <span className="inline-block hover:animate-pulse transition duration-300">A</span>
            <span className="inline-block hover:animate-pulse transition duration-300 delay-75">k</span>
            <span className="inline-block hover:animate-pulse transition duration-300 delay-100">a</span>
            <span className="inline-block hover:animate-pulse transition duration-300 delay-150">s</span>
            <span className="inline-block hover:animate-pulse transition duration-300 delay-200">h</span>
          </span>{" "}
          <motion.span 
            className="inline-block relative"
            whileHover={{
              rotateY: 360,
              transition: { duration: 0.8 }
            }}
          >
            Singh
          </motion.span>
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
          className="max-w-xl mb-6 px-4 py-3 bg-secondary/50 border border-primary/10 rounded-lg relative overflow-hidden"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={3.5}
          variants={fadeInUp}
        >
          <AnimatePresence mode="wait">
            <motion.p
              key={activeQuote}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="text-muted-foreground italic font-mono"
            >
              "{codingQuotes[activeQuote]}"
            </motion.p>
          </AnimatePresence>
          <motion.div 
            className="absolute bottom-0 left-0 h-1 bg-primary/30"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 8, repeat: Infinity, repeatType: "loop" }}
          />
        </motion.div>

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
              <span className="font-medium ml-2">{interests[activeInterest].text}</span>
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
            initial={{ rotate: 0 }}
            animate={isHovered ? { rotate: [0, -5, 5, -5, 0] } : {}}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
          >
            <Button 
                className="group px-6 py-6 text-base relative overflow-hidden" 
                onClick={() => {
                  const aboutSection = document.getElementById('about');
                  aboutSection?.scrollIntoView({ behavior: 'smooth' });
                }}
            >
              <span className="relative z-10 flex items-center">
                Learn More
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
              <motion.span
                  className="absolute inset-0 bg-primary/10 -z-10"
                  initial={{ scale: 0, opacity: 0 }}
                  whileHover={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
              />
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button variant="outline" className="px-6 py-6 text-base relative overflow-hidden" asChild>
              <a href="#contact">
                <span className="relative z-10">Let's Connect</span>
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
              variants={{
                hidden: { opacity: 0, scale: 0.8 },
                visible: { opacity: 1, scale: 1 }
              }}
              whileHover={{ scale: 1.2, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
          >
            <Github className="w-6 h-6" />
          </motion.a>
          <motion.a
              href="https://www.linkedin.com/in/itsmeakashsingh/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full hover:bg-muted transition-colors"
              variants={{
                hidden: { opacity: 0, scale: 0.8 },
                visible: { opacity: 1, scale: 1 }
              }}
              whileHover={{ scale: 1.2, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
          >
            <Linkedin className="w-6 h-6" />
          </motion.a>
          <motion.a
              href="mailto:Engg.akashsingh@gmail.com"
              className="p-2 rounded-full hover:bg-muted transition-colors"
              variants={{
                hidden: { opacity: 0, scale: 0.8 },
                visible: { opacity: 1, scale: 1 }
              }}
              whileHover={{ scale: 1.2, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
          >
            <Mail className="w-6 h-6" />
          </motion.a>
        </motion.div>
      </div>

      <motion.div
          className="absolute bottom-10 left-6 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
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
