
import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Building2, MapPin, Calendar, Briefcase, ExternalLink } from 'lucide-react';
import * as THREE from 'three';
import { useTheme } from '@/hooks/use-theme';

const experiences = [
  {
    company: 'NextGen Healthcare',
    role: 'Senior Software Engineer',
    type: 'Full-time',
    duration: 'Mar 2024 - Present',
    location: 'Bengaluru, Karnataka, India',
    isRemote: true,
    logo: 'public/images/nextgen.png',
    skills: ['React', 'TypeScript', 'Node.js', 'AWS', 'Microservices'],
    website: 'https://www.nextgen.com'
  },
  {
    company: 'MicroFocus now OpenText (formerly HP / Hewlett Packard Enterprise)',
    role: 'Software Designer 2',
    type: 'Full-time',
    duration: 'May 2022 - Mar 2024',
    location: 'Bengaluru South, Karnataka, India',
    logo: 'public/images/microfocus.png',
    skills: ['Java', 'Spring Boot', 'Angular', 'Docker', 'Kubernetes'],
    website: 'https://www.microfocus.com'
  },
  {
    company: 'CrimsonLogic Pte Ltd',
    role: 'Software Engineer',
    type: 'Full-time',
    duration: 'Apr 2021 - May 2022',
    location: 'Bengaluru, Karnataka, India',
    logo: 'public/images/crimsonlogic.png',
    skills: ['Java', 'Spring', 'React', 'MySQL', 'REST APIs'],
    website: 'https://www.crimsonlogic.com'
  },
  {
    company: 'CrimsonLogic Pte Ltd',
    role: 'Graduate Associate',
    type: 'Full-time',
    duration: 'Apr 2020 - Apr 2021',
    location: 'Bengaluru, Karnataka',
    logo: 'public/images/crimsonlogic.png',
    skills: ['Java', 'JavaScript', 'HTML/CSS', 'SQL', 'Git'],
    website: 'https://www.crimsonlogic.com'
  },
  {
    company: 'Feeding Trends',
    role: 'Frontend Developer',
    type: 'Full-time',
    duration: 'Aug 2017 - Apr 2019',
    location: 'Lucknow Area, India',
    logo: 'public/images/feedingtrends.png',
    skills: ['JavaScript', 'React', 'Redux', 'HTML/CSS', 'Bootstrap'],
    website: 'https://feedingtrends.com'
  }
];

const SkillTimeline = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (!canvasRef.current) return;

    // Initialize Three.js scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Setup camera
    const camera = new THREE.PerspectiveCamera(
      75,
      canvasRef.current.clientWidth / canvasRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;
    cameraRef.current = camera;

    // Setup renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true
    });
    renderer.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;

    // Create particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 2000;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 5;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    // Use primary color based on theme
    const particleColor = theme === 'dark' ? '#3B82F6' : '#2563EB';
    
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.005,
      color: particleColor,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);
    particlesRef.current = particles;

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);

      if (particlesRef.current) {
        particlesRef.current.rotation.y += 0.0005;
        particlesRef.current.rotation.x += 0.0002;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      if (!canvasRef.current || !cameraRef.current || !rendererRef.current) return;

      cameraRef.current.aspect = canvasRef.current.clientWidth / canvasRef.current.clientHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
    };
  }, [theme]);

  return (
    <section id="experience" className="py-20 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(var(--primary),0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(var(--primary),0.1),transparent_50%)]" />
      </div>

      {/* 3D Canvas */}
      <div className="absolute inset-0 -z-5">
        <canvas
          ref={canvasRef}
          className="w-full h-full opacity-30"
          style={{ position: 'absolute', top: 0, left: 0 }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
        <div className="mb-16 text-center">
          <h2 className="text-sm uppercase tracking-wider text-muted-foreground mb-2">My Journey</h2>
          <h3 className="section-heading">Career Timeline</h3>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Explore my professional journey through the years, highlighting key skills, projects, and milestones that have shaped my career in software development.
          </p>
        </div>

        {/* Split timeline design */}
        <div className="relative">
          {/* Center line with gradient */}
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 transform -translate-x-1/2 bg-gradient-to-b from-primary/30 via-primary to-primary/30 hidden md:block" />
          
          {experiences.map((exp, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={cn(
                'relative mb-16 md:mb-32 last:mb-0',
                'grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16'
              )}
            >
              {/* Content positioning based on index */}
              <div className={cn(
                'relative z-10',
                index % 2 === 0 ? 'md:col-start-1' : 'md:col-start-2'
              )}>
                {/* Content card with glassmorphism effect */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4 }}
                  className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-xl p-6 shadow-lg hover:shadow-primary/10 transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <a 
                      href={exp.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-16 h-16 rounded-lg bg-background/50 p-2 flex items-center justify-center shadow-lg border border-border/50 hover:border-primary/50 transition-colors hover:shadow-primary/20"
                    >
                      <img
                        src={exp.logo}
                        alt={`${exp.company} logo`}
                        className="w-full h-full object-contain"
                      />
                    </a>
                    <div className="flex-1">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <Building2 size={16} className="text-primary" />
                          <a 
                            href={exp.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-center gap-1"
                          >
                            <h4 className="text-xl font-bold text-primary group-hover:text-primary/80 transition-colors">
                              {exp.company}
                            </h4>
                            <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                          </a>
                        </div>
                        <h5 className="text-lg font-semibold">{exp.role}</h5>
                        <div className="flex flex-wrap items-center gap-2 text-muted-foreground">
                          <Briefcase size={16} />
                          <span>{exp.type}</span>
                          <Calendar size={16} className="ml-2" />
                          <span>{exp.duration}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin size={16} />
                          <span>{exp.location}</span>
                          {exp.isRemote && (
                            <span className="px-2 py-0.5 text-xs bg-primary/10 text-primary rounded-full">
                              Remote
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Skills with gradient hover effect */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="flex flex-wrap gap-2 mt-4"
                  >
                    {exp.skills.map((skill, skillIndex) => (
                      <motion.span
                        key={skillIndex}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: skillIndex * 0.1 }}
                        className={cn(
                          "px-3 py-1 text-sm rounded-full transition-all duration-300",
                          "bg-gradient-to-r from-primary/10 to-primary/5 text-primary",
                          "hover:from-primary/20 hover:to-primary/10"
                        )}
                      >
                        {skill}
                      </motion.span>
                    ))}
                  </motion.div>
                </motion.div>
              </div>
              
              {/* Timeline node */}
              <div className="absolute left-1/2 top-6 -translate-x-1/2 hidden md:block">
                <div className="w-5 h-5 rounded-full bg-primary relative z-10">
                  <div className="absolute inset-0 rounded-full bg-primary/30 animate-ping" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SkillTimeline;
