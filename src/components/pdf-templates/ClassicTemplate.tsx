import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { ResumeData } from '@/types/resume';
import { baseStyles } from './PDFTemplateBase';

// Classic template with traditional formatting
const classicStyles = StyleSheet.create({
  ...baseStyles,
  page: {
    ...baseStyles.page,
    backgroundColor: '#FFFFFF',
    padding: 50,
  },
  header: {
    ...baseStyles.header,
    textAlign: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#000000',
    paddingBottom: 20,
    marginBottom: 30,
  },
  name: {
    ...baseStyles.name,
    fontSize: 22,
    color: '#000000',
    textAlign: 'center',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  contactInfo: {
    ...baseStyles.contactInfo,
    justifyContent: 'center',
    fontSize: 10,
    color: '#333333',
  },
  sectionTitle: {
    ...baseStyles.sectionTitle,
    color: '#000000',
    fontSize: 12,
    textAlign: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    paddingBottom: 3,
    marginBottom: 15,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  jobTitle: {
    ...baseStyles.jobTitle,
    color: '#000000',
    fontSize: 11,
    fontWeight: 'bold',
  },
  companyInfo: {
    ...baseStyles.companyInfo,
    fontStyle: 'italic',
    color: '#333333',
  },
  skillsContainer: {
    ...baseStyles.skillsContainer,
    flexDirection: 'column',
    gap: 0,
  },
  skillItem: {
    fontSize: 10,
    color: '#333333',
    marginBottom: 2,
    paddingLeft: 15,
  },
  bullet: {
    ...baseStyles.bullet,
    backgroundColor: '#000000',
    width: 3,
    height: 3,
  },
  summary: {
    ...baseStyles.summary,
    textAlign: 'left',
    fontStyle: 'italic',
    paddingLeft: 20,
    paddingRight: 20,
  },
  educationItem: {
    ...baseStyles.educationItem,
    marginBottom: 12,
  },
  degree: {
    ...baseStyles.degree,
    fontSize: 11,
    color: '#000000',
  },
  institution: {
    ...baseStyles.institution,
    fontSize: 10,
    color: '#333333',
    fontStyle: 'italic',
  },
});

interface ClassicTemplateProps {
  data: ResumeData;
}

export const ClassicTemplate: React.FC<ClassicTemplateProps> = ({ data }) => {
  const renderHeader = () => (
    <View style={classicStyles.header}>
      <Text style={classicStyles.name}>{data.personalInfo.name}</Text>
      <View style={classicStyles.contactInfo}>
        <Text style={classicStyles.contactItem}>{data.personalInfo.email}</Text>
        <Text style={classicStyles.contactItem}> • </Text>
        <Text style={classicStyles.contactItem}>{data.personalInfo.phone}</Text>
        <Text style={classicStyles.contactItem}> • </Text>
        <Text style={classicStyles.contactItem}>{data.personalInfo.location}</Text>
        {data.personalInfo.linkedin && (
          <>
            <Text style={classicStyles.contactItem}> • </Text>
            <Text style={classicStyles.contactItem}>{data.personalInfo.linkedin}</Text>
          </>
        )}
      </View>
    </View>
  );

  const renderSummary = () => (
    <View style={classicStyles.section}>
      <Text style={classicStyles.sectionTitle}>Professional Summary</Text>
      <Text style={classicStyles.summary}>{data.summary}</Text>
    </View>
  );

  const renderExperience = () => (
    <View style={classicStyles.section}>
      <Text style={classicStyles.sectionTitle}>Professional Experience</Text>
      {data.experience.map((exp, index) => (
        <View key={index} style={classicStyles.experienceItem}>
          <Text style={classicStyles.jobTitle}>{exp.position}</Text>
          <Text style={classicStyles.companyInfo}>
            {exp.company}, {exp.location} ({exp.startDate} - {exp.endDate})
          </Text>
          <View style={classicStyles.description}>
            {exp.description.map((desc, descIndex) => (
              <View key={descIndex} style={classicStyles.bulletPoint}>
                <View style={classicStyles.bullet} />
                <Text style={{ flex: 1 }}>{desc}</Text>
              </View>
            ))}
          </View>
        </View>
      ))}
    </View>
  );

  const renderEducation = () => (
    <View style={classicStyles.section}>
      <Text style={classicStyles.sectionTitle}>Education</Text>
      {data.education.map((edu, index) => (
        <View key={index} style={classicStyles.educationItem}>
          <Text style={classicStyles.degree}>{edu.degree} in {edu.field}</Text>
          <Text style={classicStyles.institution}>{edu.institution}, {edu.graduationDate}</Text>
          {edu.gpa && <Text style={classicStyles.institution}>Grade Point Average: {edu.gpa}</Text>}
        </View>
      ))}
    </View>
  );

  const renderSkills = () => (
    <View style={classicStyles.section}>
      <Text style={classicStyles.sectionTitle}>Technical Competencies</Text>
      <View style={classicStyles.skillsContainer}>
        {data.skills.map((skill, index) => (
          <Text key={index} style={classicStyles.skillItem}>• {skill}</Text>
        ))}
      </View>
    </View>
  );

  const renderCertifications = () => {
    if (!data.certifications || data.certifications.length === 0) return null;
    
    return (
      <View style={classicStyles.section}>
        <Text style={classicStyles.sectionTitle}>Professional Certifications</Text>
        {data.certifications.map((cert, index) => (
          <View key={index} style={classicStyles.educationItem}>
            <Text style={classicStyles.degree}>{cert.name}</Text>
            <Text style={classicStyles.institution}>{cert.issuer}, {cert.date}</Text>
            {cert.expirationDate && (
              <Text style={classicStyles.institution}>Valid through: {cert.expirationDate}</Text>
            )}
          </View>
        ))}
      </View>
    );
  };

  const renderProjects = () => {
    if (!data.projects || data.projects.length === 0) return null;
    
    return (
      <View style={classicStyles.section}>
        <Text style={classicStyles.sectionTitle}>Notable Projects</Text>
        {data.projects.map((project, index) => (
          <View key={index} style={classicStyles.experienceItem}>
            <Text style={classicStyles.jobTitle}>{project.name}</Text>
            <Text style={classicStyles.description}>{project.description}</Text>
            <Text style={classicStyles.institution}>
              Technologies: {project.technologies.join(', ')}
            </Text>
            {project.url && (
              <Text style={classicStyles.institution}>Project URL: {project.url}</Text>
            )}
          </View>
        ))}
      </View>
    );
  };

  return (
    <Document>
      <Page size="A4" style={classicStyles.page}>
        {renderHeader()}
        {renderSummary()}
        {renderExperience()}
        {renderEducation()}
        {renderSkills()}
        {renderCertifications()}
        {renderProjects()}
      </Page>
    </Document>
  );
};
