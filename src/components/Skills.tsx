import React from 'react';
import { Award, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

const skillCategories = [
    {
        title: 'Programming',
        skills: ['Java', 'Python', 'JavaScript', 'HTML/CSS', 'Data Structures', 'Algorithms', 'OOP'],
    },
    {
        title: 'DevOps & Cloud',
        skills: ['Docker', 'Kubernetes', 'Jenkins', 'GitHub', 'AWS', 'Azure', 'Grafana', 'Maven'],
    },
    {
        title: 'Backend & Frameworks',
        skills: ['Spring Boot', 'Spring MVC', 'Spring Security', 'REST API', 'Microservices', 'Hibernate', 'JUnit'],
    },
    {
        title: 'Healthcare & Compliance',
        skills: ['HL7', 'FHIR API', 'CCDA', 'USCDI Compliance', 'HIPAA', 'Healthcare Interoperability'],
    },
    {
        title: 'Network & Automation',
        skills: ['Linux', 'Shell Scripting', 'Python Scripting', 'Ansible', 'Network Automation', 'Microfocus Scripting'],
    },
    {
        title: 'Database & Servers',
        skills: ['MySQL', 'PostgreSQL', 'Oracle', 'Tomcat', 'JBoss', 'WildFly'],
    },
];

const certifications = [
    { title: 'Career Essentials in GitHub Professional Certificate', issuer: 'GitHub', date: 'Mar 2025', link: '#' },
    { title: 'Java Foundations Professional Certificate', issuer: 'JetBrains', date: 'Mar 2025', link: '#' },
    { title: 'Microservices Foundations Professional Certificate', issuer: 'Kong Inc.', date: 'Mar 2025', link: '#' },
    { title: 'AWS Essential Training for Developers', issuer: 'LinkedIn', date: 'Apr 2024', link: '#' },
    { title: 'Spring & Hibernate for Beginners (Spring Boot)', issuer: 'Udemy', date: 'May 2021', link: 'https://www.udemy.com/certificate/UC-4d7db98c-5b13-4d81-b848-51c1832c9dba/' },
    { title: 'Secure Coding - Secure Application Development', issuer: 'Udemy', date: 'Nov 2020', link: 'https://www.udemy.com/certificate/UC-56494948-057f-4853-b09b-be0106b5134e/' },
    { title: 'Design Patterns in Java', issuer: 'Udemy', date: 'Aug 2020', link: 'https://www.udemy.com/certificate/UC-1906fc8a-d4e1-4c4e-b2c7-dd4edda5b1f4/' },
    { title: 'Proficiency in English', issuer: 'Aspiring Minds', date: 'Jun 2019', link: '#' },
    { title: 'Software Development Trainee', issuer: 'Aspiring Minds', date: 'Jun 2019', link: '#' },
    { title: 'JavaScript Certification', issuer: 'Sololearn', date: 'May 2019', link: '#' },
];

const SkillCard = ({ category, skills }: { category: string; skills: string[] }) => {
    return (
        <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-card rounded-xl border p-6 shadow-md transition-all hover:shadow-lg"
        >
            <h3 className="text-lg font-bold mb-4">{category}</h3>
            <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                    <motion.div
                        key={index}
                        whileHover={{ scale: 1.1 }}
                        className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium"
                    >
                        {skill}
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};

const Certifications = () => {
    return (
        <div className="mt-16">
            <h3 className="text-xl font-bold mb-6 text-center">Certifications</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {certifications.map((cert, index) => (
                    <motion.div
                        key={index}
                        whileHover={{ scale: 1.05 }}
                        className="bg-card rounded-xl border p-6 shadow-md transition-all"
                    >
                        <div className="flex items-start">
                            <div className="rounded-full bg-primary/10 p-3 mr-4">
                                <Award className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <h4 className="text-lg font-medium mb-1">{cert.title}</h4>
                                <p className="text-sm text-muted-foreground">{cert.issuer} • {cert.date}</p>
                                {cert.link && (
                                    <a href={cert.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 flex items-center mt-1">
                                        Show Credential <ExternalLink className="h-4 w-4 ml-1" />
                                    </a>
                                )}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

const Skills = () => {
    return (
        <section id="skills" className="section">
            <div className="mb-12 text-center">
                <h2 className="text-sm uppercase tracking-wider text-muted-foreground mb-2">Expertise</h2>
                <h3 className="section-heading">Skills & Certifications</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {skillCategories.map((category, index) => (
                    <SkillCard key={index} category={category.title} skills={category.skills} />
                ))}
            </div>

            <Certifications />
        </section>
    );
};

export default Skills;
