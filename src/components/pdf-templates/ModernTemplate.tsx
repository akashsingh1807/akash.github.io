import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { ResumeData } from '@/types/resume';
import { baseStyles } from './PDFTemplateBase';

// Modern template with accent colors and clean design
const modernStyles = StyleSheet.create({
  ...baseStyles,
  page: {
    ...baseStyles.page,
    backgroundColor: '#FFFFFF',
  },
  header: {
    ...baseStyles.header,
    backgroundColor: '#F8FAFC',
    padding: 20,
    marginBottom: 25,
    borderBottomWidth: 3,
    borderBottomColor: '#3B82F6',
  },
  name: {
    ...baseStyles.name,
    fontSize: 28,
    color: '#1E40AF',
    marginBottom: 10,
  },
  sectionTitle: {
    ...baseStyles.sectionTitle,
    color: '#3B82F6',
    fontSize: 13,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingBottom: 5,
    marginBottom: 15,
  },
  jobTitle: {
    ...baseStyles.jobTitle,
    color: '#1E40AF',
    fontSize: 13,
  },
  skillTag: {
    ...baseStyles.skillTag,
    backgroundColor: '#EFF6FF',
    color: '#1E40AF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  bullet: {
    ...baseStyles.bullet,
    backgroundColor: '#3B82F6',
  },
  contactInfo: {
    ...baseStyles.contactInfo,
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  summary: {
    ...baseStyles.summary,
    backgroundColor: '#F8FAFC',
    padding: 15,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
  },
});

interface ModernTemplateProps {
  data: ResumeData;
}

export const ModernTemplate: React.FC<ModernTemplateProps> = ({ data }) => {
  const renderHeader = () => (
    <View style={modernStyles.header}>
      <Text style={modernStyles.name}>{data.personalInfo.name}</Text>
      <View style={modernStyles.contactInfo}>
        <Text style={modernStyles.contactItem}>{data.personalInfo.email}</Text>
        <Text style={modernStyles.contactItem}>{data.personalInfo.phone}</Text>
        <Text style={modernStyles.contactItem}>{data.personalInfo.location}</Text>
        {data.personalInfo.linkedin && (
          <Text style={modernStyles.contactItem}>{data.personalInfo.linkedin}</Text>
        )}
        {data.personalInfo.website && (
          <Text style={modernStyles.contactItem}>{data.personalInfo.website}</Text>
        )}
      </View>
    </View>
  );

  const renderSummary = () => (
    <View style={modernStyles.section}>
      <Text style={modernStyles.sectionTitle}>Professional Summary</Text>
      <Text style={modernStyles.summary}>{data.summary}</Text>
    </View>
  );

  const renderExperience = () => (
    <View style={modernStyles.section}>
      <Text style={modernStyles.sectionTitle}>Professional Experience</Text>
      {data.experience.map((exp, index) => (
        <View key={index} style={modernStyles.experienceItem}>
          <Text style={modernStyles.jobTitle}>{exp.position}</Text>
          <Text style={modernStyles.companyInfo}>
            {exp.company} • {exp.location} • {exp.startDate} - {exp.endDate}
          </Text>
          <View style={modernStyles.description}>
            {exp.description.map((desc, descIndex) => (
              <View key={descIndex} style={modernStyles.bulletPoint}>
                <View style={modernStyles.bullet} />
                <Text style={{ flex: 1 }}>{desc}</Text>
              </View>
            ))}
          </View>
        </View>
      ))}
    </View>
  );

  const renderSkills = () => (
    <View style={modernStyles.section}>
      <Text style={modernStyles.sectionTitle}>Technical Skills</Text>
      <View style={modernStyles.skillsContainer}>
        {data.skills.map((skill, index) => (
          <Text key={index} style={modernStyles.skillTag}>{skill}</Text>
        ))}
      </View>
    </View>
  );

  const renderEducation = () => (
    <View style={modernStyles.section}>
      <Text style={modernStyles.sectionTitle}>Education</Text>
      {data.education.map((edu, index) => (
        <View key={index} style={modernStyles.educationItem}>
          <Text style={modernStyles.degree}>{edu.degree} in {edu.field}</Text>
          <Text style={modernStyles.institution}>{edu.institution}</Text>
          <Text style={modernStyles.institution}>{edu.graduationDate}</Text>
          {edu.gpa && <Text style={modernStyles.institution}>GPA: {edu.gpa}</Text>}
        </View>
      ))}
    </View>
  );

  const renderCertifications = () => {
    if (!data.certifications || data.certifications.length === 0) return null;
    
    return (
      <View style={modernStyles.section}>
        <Text style={modernStyles.sectionTitle}>Certifications</Text>
        {data.certifications.map((cert, index) => (
          <View key={index} style={modernStyles.educationItem}>
            <Text style={modernStyles.degree}>{cert.name}</Text>
            <Text style={modernStyles.institution}>{cert.issuer} • {cert.date}</Text>
            {cert.expirationDate && (
              <Text style={modernStyles.institution}>Expires: {cert.expirationDate}</Text>
            )}
          </View>
        ))}
      </View>
    );
  };

  const renderProjects = () => {
    if (!data.projects || data.projects.length === 0) return null;
    
    return (
      <View style={modernStyles.section}>
        <Text style={modernStyles.sectionTitle}>Key Projects</Text>
        {data.projects.map((project, index) => (
          <View key={index} style={modernStyles.experienceItem}>
            <Text style={modernStyles.jobTitle}>{project.name}</Text>
            <Text style={modernStyles.description}>{project.description}</Text>
            <View style={modernStyles.skillsContainer}>
              {project.technologies.map((tech, techIndex) => (
                <Text key={techIndex} style={modernStyles.skillTag}>{tech}</Text>
              ))}
            </View>
            {project.url && (
              <Text style={[modernStyles.institution, { marginTop: 4 }]}>{project.url}</Text>
            )}
          </View>
        ))}
      </View>
    );
  };

  return (
    <Document>
      <Page size="A4" style={modernStyles.page}>
        {renderHeader()}
        {renderSummary()}
        {renderExperience()}
        {renderSkills()}
        {renderEducation()}
        {renderCertifications()}
        {renderProjects()}
      </Page>
    </Document>
  );
};
