
import React from 'react';
import { Award, ExternalLink, Code, Database, Server, Globe, Cpu, GitBranch, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

// Enhanced skill categories with Java Full Stack focus
const skillCategories = [
    {
        title: 'Core Programming',
        icon: <Code className="h-5 w-5 text-primary" />,
        skills: ['Java', 'Python', 'JavaScript', 'TypeScript', 'HTML/CSS', 'Data Structures', 'Algorithms', 'OOP'],
    },
    {
        title: 'Database & Data Management',
        icon: <Database className="h-5 w-5 text-primary" />,
        skills: ['MySQL', 'PostgreSQL', 'Oracle', 'MongoDB', 'Redis', 'Hibernate', 'JPA', 'SQL Optimization'],
    },
    {
        title: 'Backend & Frameworks',
        icon: <Server className="h-5 w-5 text-primary" />,
        skills: ['Spring Boot', 'Spring MVC', 'Spring Security', 'REST API', 'Microservices', 'JUnit', 'Mockito', 'Servlets'],
    },
    {
        title: 'Frontend & UI',
        icon: <Globe className="h-5 w-5 text-primary" />,
        skills: ['React', 'Angular', 'jQuery', 'Bootstrap', 'Tailwind CSS', 'Responsive Design', 'Thymeleaf', 'JSP'],
    },
    {
        title: 'DevOps & Cloud',
        icon: <GitBranch className="h-5 w-5 text-primary" />,
        skills: ['Docker', 'Kubernetes', 'Jenkins', 'GitHub Actions', 'AWS', 'Gradle', 'Maven', 'CI/CD Pipelines'],
    },
    {
        title: 'Healthcare & Compliance',
        icon: <Zap className="h-5 w-5 text-primary" />,
        skills: ['HL7', 'FHIR API', 'CCDA', 'USCDI Compliance', 'HIPAA', 'Healthcare Interoperability'],
    },
    {
        title: 'System & Networking',
        icon: <Cpu className="h-5 w-5 text-primary" />,
        skills: ['Linux', 'Shell Scripting', 'Python Scripting', 'Ansible', 'Network Automation', 'Windows', 'Mac OS'],
    },
    {
        title: 'Hobbies & Creative Skills',
        icon: <Zap className="h-5 w-5 text-primary" />,
        skills: ['Graphic Design', 'Illustrator', 'Premiere Pro', 'Lightroom', 'Photoshop', 'Swimming', 'Calisthenics', 'Snooker'],
    },
];

// Updated certifications with more relevant Java Full Stack focus
const certifications = [
    { title: 'Career Essentials in GitHub Professional Certificate', issuer: 'GitHub', date: 'Mar 2025', link: 'https://www.linkedin.com/learning/certificates/3c78c1eea024943b228aeb8887f215bc18f578270515ad726649c4a3fc0ce778?u=2205354' },
    { title: 'Java Foundations Professional Certificate', issuer: 'JetBrains', date: 'Mar 2025', link: 'https://www.linkedin.com/learning/certificates/a21dd82d50c3c5f1d0889e4f09c6e1a6ae3b55d9a1a27f007571bec1ebb59763?u=2205354' },
    { title: 'Microservices Foundations Professional Certificate', issuer: 'Kong Inc.', date: 'Mar 2025', link: 'https://www.linkedin.com/learning/certificates/06357b41a1b60e06be3423266febf591a912473f4a71b2898a0849759b8bf13f?u=2205354' },
    { title: 'AWS Essential Training for Developers', issuer: 'LinkedIn', date: 'Apr 2024', link: 'https://www.linkedin.com/learning/certificates/604b96285138356302982aae187e1f7d98223f40ebaf9277885691d57c736540?u=2205354' },
    { title: 'Spring & Hibernate for Beginners (Spring Boot)', issuer: 'Udemy', date: 'May 2021', link: 'https://www.udemy.com/certificate/UC-4d7db98c-5b13-4d81-b848-51c1832c9dba/' },
    { title: 'Secure Coding - Secure Application Development', issuer: 'Udemy', date: 'Nov 2020', link: 'https://www.udemy.com/certificate/UC-56494948-057f-4853-b09b-be0106b5134e/' },
    { title: 'Design Patterns in Java', issuer: 'Udemy', date: 'Aug 2020', link: 'https://www.udemy.com/certificate/UC-1906fc8a-d4e1-4c4e-b2c7-dd4edda5b1f4/' },
    { title: 'Proficiency in English', issuer: 'Aspiring Minds', date: 'Jun 2019', link: 'https://www.myamcat.com/certificate/9539239/proficiency-in-english/284' },
    { title: 'Software Development Trainee', issuer: 'Aspiring Minds', date: 'Jun 2019', link: 'https://www.myamcat.com/certificate/9539239/software-development-trainee/166' },
    { title: 'JavaScript Certification', issuer: 'Sololearn', date: 'May 2019', link: 'https://www.sololearn.com/Certificate/CT-5RQPANSV/pdf' },
];

// Enhanced skill card with animations and icons
const SkillCard = ({ category, skills, icon }: { category: string; skills: string[]; icon: React.ReactNode }) => {
    return (
        <motion.div
            whileHover={{
                scale: 1.03,
                rotateY: 5,
                transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.97 }}
            className="bg-card rounded-xl border p-6 shadow-md transition-all hover:shadow-lg relative overflow-hidden group"
        >
            {/* Animated background gradient */}
            <motion.div
                className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                initial={false}
            />

            {/* Floating icon */}
            <motion.div
                className="absolute -top-6 -right-6 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center transform rotate-12"
                whileHover={{
                    rotate: 360,
                    scale: 1.1,
                    transition: { duration: 0.5 }
                }}
            >
                {icon}
            </motion.div>

            <h3 className="text-lg font-bold mb-4 relative z-10">{category}</h3>
            <div className="flex flex-wrap gap-2 relative z-10">
                {skills.map((skill, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        whileInView={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ delay: index * 0.05, duration: 0.3 }}
                        whileHover={{
                            scale: 1.1,
                            y: -2,
                            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                            transition: { duration: 0.2 }
                        }}
                        className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium cursor-default relative overflow-hidden"
                    >
                        <motion.div
                            className="absolute inset-0 bg-primary/20"
                            initial={{ scale: 0 }}
                            whileHover={{ scale: 1 }}
                            transition={{ duration: 0.2 }}
                        />
                        <span className="relative z-10">{skill}</span>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};

// Enhanced certifications component
const Certifications = () => {
    return (
        <div className="mt-16">
            <motion.h3
                className="text-xl font-bold mb-6 text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
            >
                Certifications & Professional Development
            </motion.h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {certifications.map((cert, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        whileHover={{ scale: 1.03, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
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
                                    <motion.a
                                        href={cert.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary flex items-center mt-1 hover:underline"
                                        whileHover={{ x: 3 }}
                                    >
                                        Show Credential <ExternalLink className="h-4 w-4 ml-1" />
                                    </motion.a>
                                )}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

// Animated counter component
const AnimatedCounter = ({ value, duration = 1 }: { value: number; duration?: number }) => {
    const [count, setCount] = React.useState(0);
    const [isVisible, setIsVisible] = React.useState(false);

    React.useEffect(() => {
        if (!isVisible) return;

        let startTime: number;
        const animate = (currentTime: number) => {
            if (!startTime) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);

            setCount(Math.floor(progress * value));

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }, [isVisible, value, duration]);

    return (
        <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            onViewportEnter={() => setIsVisible(true)}
            className="text-muted-foreground"
        >
            {count}%
        </motion.span>
    );
};

// Skill bar component to show proficiency levels
const SkillBarMeter = () => {
    const skills = [
        { name: "Java & Spring", level: 95 },
        { name: "Database Design", level: 90 },
        { name: "API Development", level: 92 },
        { name: "Microservices", level: 85 },
        { name: "Frontend (React/Angular)", level: 75 },
        { name: "DevOps & CI/CD", level: 80 },
    ];

    return (
        <motion.div
            className="mt-16 mb-8 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
        >
            <h3 className="text-xl font-bold mb-6 text-center">Core Competencies</h3>

            <div className="space-y-6">
                {skills.map((skill, index) => (
                    <motion.div
                        key={index}
                        className="space-y-2"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                    >
                        <div className="flex justify-between">
                            <span className="font-medium">{skill.name}</span>
                            <AnimatedCounter value={skill.level} duration={1.5} />
                        </div>
                        <div className="h-3 bg-muted rounded-full overflow-hidden relative">
                            <motion.div
                                className="h-full bg-gradient-to-r from-primary to-accent rounded-full relative"
                                initial={{ width: 0 }}
                                whileInView={{ width: `${skill.level}%` }}
                                viewport={{ once: true }}
                                transition={{ duration: 1.5, delay: index * 0.1, ease: "easeOut" }}
                            >
                                {/* Shimmer effect */}
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                                    initial={{ x: "-100%" }}
                                    animate={{ x: "100%" }}
                                    transition={{
                                        duration: 2,
                                        delay: index * 0.1 + 1.5,
                                        ease: "easeInOut"
                                    }}
                                />
                            </motion.div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};

// Main Skills component
const Skills = () => {
    return (
        <section id="skills" className="section">
            <div className="mb-12 text-center">
                <motion.h2
                    className="text-sm uppercase tracking-wider text-muted-foreground mb-2"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    Technical Expertise
                </motion.h2>
                <motion.h3
                    className="section-heading"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    Skills & Certifications
                </motion.h3>

                <motion.p
                    className="text-muted-foreground max-w-2xl mx-auto"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    As a Java Full Stack Developer, I've built a comprehensive skill set spanning backend technologies,
                    frontend frameworks, and DevOps practices. My expertise allows me to architect and implement
                    complete solutions from database to user interface.
                </motion.p>
            </div>

            {/* Skill proficiency bars */}
            <SkillBarMeter />

            {/* Skill categories */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {skillCategories.map((category, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                        <SkillCard
                            category={category.title}
                            skills={category.skills}
                            icon={category.icon}
                        />
                    </motion.div>
                ))}
            </div>

            {/* Certifications section */}
            <Certifications />
        </section>
    );
};

export default Skills;
