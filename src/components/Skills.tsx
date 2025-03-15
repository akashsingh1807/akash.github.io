
import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

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
    ],
  },
  {
    title: 'Frameworks & Technologies',
    skills: [
      { name: 'Spring Boot', level: 95 },
      { name: 'Spring MVC', level: 90 },
      { name: 'REST API', level: 95 },
      { name: 'Microservices', level: 90 },
      { name: 'Hibernate', level: 85 },
      { name: 'jQuery', level: 85 },
    ],
  },
  {
    title: 'Database Systems & Tools',
    skills: [
      { name: 'MySQL', level: 90 },
      { name: 'PostgreSQL', level: 85 },
      { name: 'Tomcat', level: 85 },
      { name: 'JBoss', level: 80 },
      { name: 'WildFly', level: 80 },
    ],
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

    return () => observer.disconnect();
  }, []);

  return (
    <section id="skills" className="section">
      <div className="mb-12 text-center">
        <h2 className="text-sm uppercase tracking-wider text-muted-foreground mb-2">
          Expertise
        </h2>
        <h3 className="section-heading">Skills & Technologies</h3>
        <p className="section-subheading mx-auto">
          A comprehensive overview of my technical skills, tools, and technologies I work with.
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

      <div className="mt-16">
        <h3 className="text-xl font-bold mb-6 text-center">Technical Certifications</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-card rounded-lg border p-6 shadow-sm">
            <h4 className="text-lg font-medium mb-4">AWS Technical Essentials</h4>
            <p className="text-muted-foreground">Certified by AWS</p>
          </div>
          <div className="bg-card rounded-lg border p-6 shadow-sm">
            <h4 className="text-lg font-medium mb-4">Spring and Hibernate Certification</h4>
            <p className="text-muted-foreground">Certified by Udemy</p>
          </div>
          <div className="bg-card rounded-lg border p-6 shadow-sm">
            <h4 className="text-lg font-medium mb-4">Design Pattern in Java</h4>
            <p className="text-muted-foreground">Certified by Udemy</p>
          </div>
          <div className="bg-card rounded-lg border p-6 shadow-sm">
            <h4 className="text-lg font-medium mb-4">Secure Coding-Secure Application Development</h4>
            <p className="text-muted-foreground">Certified by Udemy</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
