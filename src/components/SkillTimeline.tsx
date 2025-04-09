
import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Calendar, Award, Code, Database, Server, Globe, Monitor } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

// Timeline data structure
const timelineData = [
  {
    year: 2019,
    title: "Career Start",
    description: "Began my journey in software development with fundamental technologies",
    skills: ["Java", "JavaScript", "HTML/CSS", "MySQL"],
    projects: [
      {
        name: "Student Portal Application",
        description: "Created a web application for student management",
        technologies: ["Java", "MySQL", "HTML/CSS", "JavaScript"]
      }
    ],
    icon: <Calendar className="h-6 w-6" />
  },
  {
    year: 2020,
    title: "Backend Specialization",
    description: "Focused on backend technologies and database optimization",
    skills: ["Spring Boot", "JUnit", "Docker", "PostgreSQL", "REST API"],
    projects: [
      {
        name: "Healthcare API System",
        description: "Built RESTful APIs for healthcare data exchange",
        technologies: ["Spring Boot", "PostgreSQL", "Docker"]
      }
    ],
    icon: <Server className="h-6 w-6" />
  },
  {
    year: 2021,
    title: "Full Stack Development",
    description: "Expanded to full stack development with focus on microservices",
    skills: ["React", "Microservices", "Kubernetes", "Spring Security", "CI/CD"],
    projects: [
      {
        name: "Microservices Platform",
        description: "Developed a scalable microservices architecture",
        technologies: ["Spring Boot", "Docker", "Kubernetes", "React"]
      }
    ],
    icon: <Code className="h-6 w-6" />
  },
  {
    year: 2022,
    title: "Cloud & DevOps",
    description: "Embraced cloud technologies and advanced DevOps practices",
    skills: ["AWS", "Jenkins", "Terraform", "Grafana", "Cloud Architecture"],
    projects: [
      {
        name: "Cloud Migration Project",
        description: "Led migration of on-premise systems to AWS",
        technologies: ["AWS", "Terraform", "Docker", "Jenkins"]
      }
    ],
    icon: <Globe className="h-6 w-6" />
  },
  {
    year: 2023,
    title: "Healthcare Interoperability",
    description: "Specialized in healthcare data exchange and compliance",
    skills: ["HL7", "FHIR API", "HIPAA Compliance", "CCDA", "Healthcare Integration"],
    projects: [
      {
        name: "FHIR Interoperability Platform",
        description: "Built a platform for healthcare data integration",
        technologies: ["FHIR", "Spring Boot", "AWS", "React"]
      }
    ],
    icon: <Database className="h-6 w-6" />
  },
  {
    year: 2024,
    title: "Advanced Visualization & UI",
    description: "Focused on advanced UI technologies and 3D visualization",
    skills: ["Three.js", "WebGL", "React Advanced Patterns", "Framer Motion", "3D Visualization"],
    projects: [
      {
        name: "Interactive 3D Portfolio",
        description: "Created a portfolio with interactive 3D elements",
        technologies: ["Three.js", "React", "Framer Motion", "WebGL"]
      }
    ],
    icon: <Monitor className="h-6 w-6" />
  },
  {
    year: 2025,
    title: "Looking Forward",
    description: "Exploring innovative technologies and future possibilities",
    skills: ["AI Integration", "WebAssembly", "Web3", "Advanced Animation"],
    projects: [
      {
        name: "Future Projects",
        description: "What exciting technologies will I explore next?",
        technologies: ["AI", "WebAssembly", "Web3"]
      }
    ],
    icon: <Award className="h-6 w-6" />
  }
];

const TimelineItem = ({ item, index, activeIndex, onClick }: { item: any; index: number; activeIndex: number; onClick: () => void }) => {
  const isActive = activeIndex === index;
  
  return (
    <div className={`relative ${index < timelineData.length - 1 ? 'mb-24' : ''}`}>
      {/* Year marker */}
      <motion.div 
        className={`flex items-center cursor-pointer mb-4`}
        onClick={onClick}
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className={`flex items-center justify-center w-12 h-12 rounded-full ${isActive ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'} mr-4 transition-all duration-300`}>
          {item.icon}
        </div>
        <h3 className={`text-2xl font-bold ${isActive ? 'text-primary' : 'text-foreground'}`}>{item.year}</h3>
      </motion.div>

      {/* Content */}
      <motion.div 
        className="pl-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h4 className="text-xl font-bold mb-2">{item.title}</h4>
        <p className="text-muted-foreground mb-4">{item.description}</p>
        
        {/* Skills */}
        <div className="mb-6">
          <h5 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">Skills</h5>
          <div className="flex flex-wrap gap-2">
            {item.skills.map((skill: string, i: number) => (
              <Badge key={i} variant={isActive ? "default" : "secondary"} className="transition-all duration-300">
                {skill}
              </Badge>
            ))}
          </div>
        </div>
        
        {/* Projects */}
        {isActive && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h5 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">Projects</h5>
            <div className="grid gap-4 md:grid-cols-2">
              {item.projects.map((project: any, i: number) => (
                <Card key={i} className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{project.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{project.description}</CardDescription>
                  </CardContent>
                  <CardFooter className="pt-0 flex-wrap gap-2">
                    {project.technologies.map((tech: string, j: number) => (
                      <Badge key={j} variant="outline" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </CardFooter>
                </Card>
              ))}
            </div>
          </motion.div>
        )}
        
        {/* Timeline connector */}
        {index < timelineData.length - 1 && (
          <div className="absolute left-6 top-12 w-0.5 bg-muted/50 h-24 transform -translate-x-1/2" />
        )}
      </motion.div>
    </div>
  );
};

const SkillTimeline = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Scroll animation
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  
  const opacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      
      const items = document.querySelectorAll(".timeline-item");
      const containerTop = containerRef.current.offsetTop;
      const containerHeight = containerRef.current.offsetHeight;
      const scrollPosition = window.scrollY + window.innerHeight / 2;
      
      let closestIndex = 0;
      let closestDistance = Infinity;
      
      items.forEach((item, index) => {
        const itemTop = containerTop + (item as HTMLElement).offsetTop;
        const distance = Math.abs(scrollPosition - itemTop);
        
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });
      
      setActiveIndex(closestIndex);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <section id="timeline" className="section bg-background relative">
      <motion.div 
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_bottom,rgba(var(--primary),0.1),transparent_70%)]"
        style={{ opacity }}
      />
      
      <div className="mb-16 text-center">
        <h2 className="text-sm uppercase tracking-wider text-muted-foreground mb-2">My Journey</h2>
        <h3 className="section-heading">Career Timeline</h3>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Explore my professional journey through the years, highlighting key skills, 
          projects, and milestones that have shaped my career in software development.
        </p>
      </div>
      
      <div ref={containerRef} className="max-w-4xl mx-auto">
        {timelineData.map((item, index) => (
          <div key={index} className="timeline-item">
            <TimelineItem 
              item={item} 
              index={index} 
              activeIndex={activeIndex}
              onClick={() => setActiveIndex(index)} 
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default SkillTimeline;
