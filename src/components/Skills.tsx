import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Award, Calendar } from 'lucide-react';

const skillCategories = [
  {
    title: 'Programming Skills',
    skills: [
      { name: 'Java', level: 95 },
      { name: 'JavaScript', level: 85 },
      { name: 'HTML/CSS', level: 85 },
      { name: 'Data Structures', level: 90 },
      { name: 'Algorithms', level: 90 },
    ],
  },
  {
    title: 'DevOps Technologies',
    skills: [
      { name: 'Docker', level: 90 },
      { name: 'Kubernetes', level: 85 },
      { name: 'Jenkins', level: 85 },
      { name: 'Git/GitHub', level: 90 },
      { name: 'AWS', level: 85 },
      { name: 'Grafana/Prometheus', level: 80 },
      { name: 'Maven/Ant', level: 85 },
    ],
  },
  {
    title: 'Frameworks & Technologies',
    skills: [
      { name: 'Spring Boot', level: 95 },
      { name: 'Spring MVC', level: 90 },
      { name: 'Spring Security', level: 85 },
      { name: 'REST API', level: 95 },
      { name: 'Microservices', level: 90 },
      { name: 'Hibernate/JPA', level: 85 },
      { name: 'jQuery', level: 85 },
      { name: 'JUnit/Mockito', level: 80 },
    ],
  },
  {
    title: 'Database Systems & Servers',
    skills: [
      { name: 'MySQL', level: 90 },
      { name: 'PostgreSQL', level: 85 },
      { name: 'Oracle', level: 80 },
      { name: 'Tomcat', level: 85 },
      { name: 'JBoss', level: 80 },
      { name: 'WildFly', level: 80 },
    ],
  },
];

const certifications = [
  {
    title: 'AWS Technical Essentials',
    issuer: 'Amazon Web Services',
    date: '2022',
  },
  {
    title: 'Spring and Hibernate Certification',
    issuer: 'Udemy',
    date: '2021',
  },
  {
    title: 'Design Pattern in Java',
    issuer: 'Udemy',
    date: '2021',
  },
  {
    title: 'Secure Coding - Secure Application Development',
    issuer: 'Udemy',
    date: '2020',
  },
];

const workExperiences = [
  {
    title: 'Senior Software Engineer',
    company: 'Microfocus (now OpenText)',
    period: 'May 2022 - Present',
    description: 'Working as Software Development Engineer(R&D) in the development and containerization of products in the domain of compliance, monitoring, and provisioning of large-scale network devices. Designed high-performance REST APIs, migrated codebase from Java 8 to Java 11, and implemented automation testing with Robot Framework.',
  },
  {
    title: 'Software Engineer',
    company: 'Crimsonlogic',
    period: 'April 2020 - May 2022',
    description: 'Project: Frontier - a one-stop convenient Business Licensing platform for Singapore Community. Implemented several licenses from scratch using Spring MVC, Java, Hibernate, JSP, JavaScript, and jQuery. Developed RESTful APIs for various modules and resolved production defects.',
  },
  {
    title: 'PG-DAC',
    company: 'Centre for Development of Advanced Computing (CDAC), Bengaluru',
    period: 'Aug 2019 - Feb 2020',
    description: 'Completed Post Graduate Diploma in Advanced Computing, focusing on cutting-edge technologies and practical application development.',
  },
];

const SkillBar = ({ name, level }: { name: string; level: number }) => {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          if (barRef.current) {
            barRef.current.style.width = `${level}%`;
            barRef.current.style.opacity = '1';
          }
          observer.unobserve(entries[0].target);
        }
      },
      { threshold: 0.1 }
    );

    if (barRef.current?.parentElement) {
      observer.observe(barRef.current.parentElement);
    }

    return () => observer.disconnect();
  }, [level]);

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <span className="text-base font-medium">{name}</span>
        <span className="text-sm text-muted-foreground">{level}%</span>
      </div>
      <div className="h-3 bg-secondary rounded-full overflow-hidden">
        <div
          ref={barRef}
          className="h-full bg-primary rounded-full opacity-0 transition-all duration-1000 ease-out"
          style={{ width: '0%' }}
        ></div>
      </div>
    </div>
  );
};

const Skills = () => {
  const skillsRef = useRef<HTMLDivElement>(null);
  const experienceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (skillsRef.current) {
      const elements = skillsRef.current.querySelectorAll('.skill-category');
      elements.forEach((el, i) => {
        // Stagger the animations
        setTimeout(() => {
          observer.observe(el);
        }, i * 200);
      });
    }

    if (experienceRef.current) {
      const elements = experienceRef.current.querySelectorAll('.experience-item');
      elements.forEach((el, i) => {
        setTimeout(() => {
          observer.observe(el);
        }, i * 150);
      });
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section id="skills" className="section">
      <div className="mb-12 text-center">
        <h2 className="text-sm uppercase tracking-wider text-muted-foreground mb-2">
          Expertise
        </h2>
        <h3 className="section-heading">Skills & Experience</h3>
        <p className="section-subheading mx-auto">
          A comprehensive overview of my technical skills, work experience, and certifications.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12" ref={skillsRef}>
        {skillCategories.map((category, index) => (
          <div
            key={index}
            className={cn(
              "skill-category opacity-0 p-6 rounded-lg border",
            )}
          >
            <h3 className="text-xl font-bold mb-6">{category.title}</h3>
            <div>
              {category.skills.map((skill) => (
                <SkillBar key={skill.name} name={skill.name} level={skill.level} />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16" ref={experienceRef}>
        <h3 className="text-xl font-bold mb-8 text-center">Work Experience & Education</h3>
        <div className="space-y-8">
          {workExperiences.map((experience, index) => (
            <div 
              key={index} 
              className="experience-item opacity-0 bg-card rounded-lg border p-6 shadow-sm"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                <div>
                  <h4 className="text-lg font-medium">{experience.title}</h4>
                  <p className="text-primary font-medium">{experience.company}</p>
                </div>
                <div className="flex items-center mt-2 md:mt-0 text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span className="text-sm">{experience.period}</span>
                </div>
              </div>
              <p className="text-muted-foreground">{experience.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-16">
        <h3 className="text-xl font-bold mb-6 text-center">Education</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card rounded-lg border p-6 shadow-sm">
            <h4 className="text-lg font-medium mb-2">B.Tech in Computer Science & Engineering</h4>
            <p className="text-primary font-medium mb-1">BBDNITM, Lucknow</p>
            <p className="text-muted-foreground">2015 - 2019</p>
          </div>
          <div className="bg-card rounded-lg border p-6 shadow-sm">
            <h4 className="text-lg font-medium mb-2">PG-DAC</h4>
            <p className="text-primary font-medium mb-1">Centre for Development of Advanced Computing (CDAC), Bengaluru</p>
            <p className="text-muted-foreground">Aug 2019 - Feb 2020</p>
          </div>
        </div>
      </div>

      <div className="mt-16">
        <h3 className="text-xl font-bold mb-6 text-center">Technical Certifications</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {certifications.map((cert, index) => (
            <div key={index} className="bg-card rounded-lg border p-6 shadow-sm">
              <div className="flex items-start">
                <div className="rounded-full bg-primary/10 p-3 mr-4">
                  <Award className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="text-lg font-medium mb-1">{cert.title}</h4>
                  <div className="flex flex-col sm:flex-row sm:items-center text-muted-foreground">
                    <span className="mr-2">{cert.issuer}</span>
                    <span className="text-sm hidden sm:inline">•</span>
                    <span className="text-sm mt-1 sm:mt-0 sm:ml-2">{cert.date}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-16">
        <h3 className="text-xl font-bold mb-6 text-center">Notable Projects</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card rounded-lg border p-6 shadow-sm">
            <h4 className="text-lg font-medium mb-2">Traffic Analyzer for HTTP/HTTPS Web Applications</h4>
            <p className="text-muted-foreground">
              Developed a traffic analyzer that monitors and analyzes HTTP/HTTPS encrypted traffic for security and attack detection. 
              The system prevents information leakage and enhances application security through real-time monitoring.
            </p>
          </div>
          <div className="bg-card rounded-lg border p-6 shadow-sm">
            <h4 className="text-lg font-medium mb-2">Complaint Tracking Automation System</h4>
            <p className="text-muted-foreground">
              Built a Java (J2SE) application that provides an interface for clients to register complaints/grievances towards 
              the company, which are then received and serviced immediately by the company.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
