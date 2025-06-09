import { useRef, useEffect } from 'react';
import { Code, Server, Layout } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PublicResume from './PublicResume';
import { motion } from 'framer-motion';



const About = () => {
  const aboutRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (entry && entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in');
            observer.unobserve(entry.target);
          }
        },
        { threshold: 0.1 }
    );

    if (aboutRef.current) {
      observer.observe(aboutRef.current);
    }

    return () => {
      const currentRef = aboutRef.current;
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return (
      <section id="about" className="section relative overflow-hidden" ref={aboutRef}>
        {/* Background decorative elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-accent/5 rounded-full blur-3xl" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.div
              className="mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="text-sm uppercase tracking-wider text-muted-foreground mb-2">
                About me
              </h2>
              <h3 className="section-heading">
                Full Stack Java Engineer, <br />
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Cloud & Enterprise Systems Specialist
                </span>
              </h3>
            </motion.div>

            <div className="space-y-4 text-lg text-muted-foreground mb-8">
              <p>
                I’m Akash Singh, a software engineer who turns caffeine into code
                and enterprise headaches into scalable solutions. With 5 years of experience,
                I’ve built and optimized systems across healthcare, business licensing,
                and network automation.
              </p>
              <p>
                At <strong>NextGen Healthcare</strong>, I engineer healthcare solutions that
                (hopefully) make doctors' lives easier, using Java, Spring Boot, and microservices.
                Previously, at <strong>OpenText (Microfocus)</strong>, I worked on large-scale network
                automation, designing high-performance REST APIs and leading migrations from Java 8 to 11.
                Before that, at <strong>CrimsonLogic</strong>, I helped digitize Singapore’s business licensing
                platform with Spring MVC, Hibernate, and RESTful APIs..
              </p>
              <p>
                My stack includes Java, Spring, REST APIs, Docker, Kubernetes, AWS, and more.
                I believe in clean, maintainable code—unless it’s Friday evening, then it’s just “it works, ship it!” 🚀
              </p>
            </div>

            <motion.div
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 1 }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button asChild className="relative overflow-hidden group">
                  <a href="#contact">
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "100%" }}
                      transition={{ duration: 0.5 }}
                    />
                    <span className="relative z-10">Contact me</span>
                  </a>
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <PublicResume />
              </motion.div>
            </motion.div>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
          >
            <motion.div
              className="col-span-1 md:col-span-2"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <motion.div
                className="bg-card rounded-lg border p-6 shadow-sm transition-all hover:shadow-md group relative overflow-hidden"
                whileHover={{ scale: 1.02, y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  initial={false}
                />
                <div className="flex items-center mb-4 relative z-10">
                  <motion.div
                    className="rounded-full bg-primary/10 p-3 mr-4"
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Code className="h-6 w-6 text-primary" />
                  </motion.div>
                  <h3 className="font-bold">Backend Development</h3>
                </div>
                <p className="text-muted-foreground relative z-10">
                  Specializing in Java, Spring Boot, Hibernate, and REST APIs, I design and
                  optimize high-performance, scalable applications for enterprise and healthcare solutions.
                </p>
              </motion.div>
            </motion.div>

            <motion.div
              className="col-span-1"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <motion.div
                className="bg-card rounded-lg border p-6 shadow-sm h-full transition-all hover:shadow-md group relative overflow-hidden"
                whileHover={{ scale: 1.02, y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  initial={false}
                />
                <div className="flex items-center mb-4 relative z-10">
                  <motion.div
                    className="rounded-full bg-primary/10 p-3 mr-4"
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Server className="h-6 w-6 text-primary" />
                  </motion.div>
                  <h3 className="font-bold">Cloud & DevOps</h3>
                </div>
                <p className="text-muted-foreground relative z-10">
                  Experienced in Docker, Kubernetes, CI/CD pipelines, AWS, Azure, and cloud-native
                  technologies to ensure seamless deployments and scalability.
                </p>
              </motion.div>
            </motion.div>

            <motion.div
              className="col-span-1"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.9 }}
            >
              <motion.div
                className="bg-card rounded-lg border p-6 shadow-sm h-full transition-all hover:shadow-md group relative overflow-hidden"
                whileHover={{ scale: 1.02, y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  initial={false}
                />
                <div className="flex items-center mb-4 relative z-10">
                  <motion.div
                    className="rounded-full bg-primary/10 p-3 mr-4"
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Layout className="h-6 w-6 text-primary" />
                  </motion.div>
                  <h3 className="font-bold">Frontend Development</h3>
                </div>
                <p className="text-muted-foreground relative z-10">
                  Proficient in React, JavaScript, JSP, jQuery, HTML, and CSS. I create intuitive
                  user interfaces that balance aesthetics with functionality.
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>
  );
};

export default About;
