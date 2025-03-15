
import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

const skillCategories = [
  {
    title: 'Frontend',
    skills: [
      { name: 'React', level: 95 },
      { name: 'TypeScript', level: 90 },
      { name: 'JavaScript', level: 95 },
      { name: 'HTML/CSS', level: 95 },
      { name: 'Next.js', level: 85 },
      { name: 'Tailwind CSS', level: 90 },
    ],
  },
  {
    title: 'Backend',
    skills: [
      { name: 'Node.js', level: 85 },
      { name: 'Express', level: 85 },
      { name: 'Python', level: 75 },
      { name: 'REST APIs', level: 90 },
      { name: 'GraphQL', level: 80 },
      { name: 'MongoDB', level: 85 },
    ],
  },
  {
    title: 'Tools & Others',
    skills: [
      { name: 'Git', level: 95 },
      { name: 'Docker', level: 80 },
      { name: 'CI/CD', level: 80 },
      { name: 'AWS', level: 75 },
      { name: 'Jest/Testing', level: 85 },
      { name: 'UI/UX Design', level: 80 },
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12" ref={skillsRef}>
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
    </section>
  );
};

export default Skills;
