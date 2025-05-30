import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import { ResumeData } from '@/types/resume';

// Register fonts for better typography
Font.register({
  family: 'Inter',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2' },
    { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuI6fAZ9hiA.woff2', fontWeight: 'bold' },
  ]
});

// Base styles for all templates
export const baseStyles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 40,
    fontFamily: 'Inter',
    fontSize: 10,
    lineHeight: 1.4,
  },
  header: {
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  contactInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
    fontSize: 9,
    color: '#6B7280',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionContent: {
    paddingLeft: 0,
  },
  experienceItem: {
    marginBottom: 15,
  },
  jobTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 2,
  },
  companyInfo: {
    fontSize: 10,
    color: '#6B7280',
    marginBottom: 6,
  },
  description: {
    fontSize: 9,
    color: '#374151',
    lineHeight: 1.5,
  },
  bulletPoint: {
    flexDirection: 'row',
    marginBottom: 3,
    paddingLeft: 10,
  },
  bullet: {
    width: 4,
    height: 4,
    backgroundColor: '#6B7280',
    borderRadius: 2,
    marginTop: 4,
    marginRight: 8,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillTag: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    fontSize: 8,
    color: '#374151',
  },
  educationItem: {
    marginBottom: 10,
  },
  degree: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#111827',
  },
  institution: {
    fontSize: 10,
    color: '#6B7280',
    marginBottom: 2,
  },
  summary: {
    fontSize: 10,
    color: '#374151',
    lineHeight: 1.6,
    textAlign: 'justify',
  },
});

// Base PDF Template Component
interface PDFTemplateBaseProps {
  data: ResumeData;
  template: 'modern' | 'classic' | 'creative' | 'minimal';
  customStyles?: any;
}

export const PDFTemplateBase: React.FC<PDFTemplateBaseProps> = ({
  data,
  template: _template,
  customStyles = {}
}) => {
  const styles = { ...baseStyles, ...customStyles };

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.name}>{data.personalInfo.name}</Text>
      <View style={styles.contactInfo}>
        <Text style={styles.contactItem}>{data.personalInfo.email}</Text>
        <Text style={styles.contactItem}>{data.personalInfo.phone}</Text>
        <Text style={styles.contactItem}>{data.personalInfo.location}</Text>
        {data.personalInfo.linkedin && (
          <Text style={styles.contactItem}>{data.personalInfo.linkedin}</Text>
        )}
        {data.personalInfo.website && (
          <Text style={styles.contactItem}>{data.personalInfo.website}</Text>
        )}
      </View>
    </View>
  );

  const renderSummary = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Professional Summary</Text>
      <Text style={styles.summary}>{data.summary}</Text>
    </View>
  );

  const renderExperience = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Experience</Text>
      {data.experience.map((exp, index) => (
        <View key={index} style={styles.experienceItem}>
          <Text style={styles.jobTitle}>{exp.position}</Text>
          <Text style={styles.companyInfo}>
            {exp.company} • {exp.location} • {exp.startDate} - {exp.endDate}
          </Text>
          <View style={styles.description}>
            {exp.description.map((desc, descIndex) => (
              <View key={descIndex} style={styles.bulletPoint}>
                <View style={styles.bullet} />
                <Text style={{ flex: 1 }}>{desc}</Text>
              </View>
            ))}
          </View>
        </View>
      ))}
    </View>
  );

  const renderEducation = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Education</Text>
      {data.education.map((edu, index) => (
        <View key={index} style={styles.educationItem}>
          <Text style={styles.degree}>{edu.degree} in {edu.field}</Text>
          <Text style={styles.institution}>{edu.institution}</Text>
          <Text style={styles.institution}>{edu.graduationDate}</Text>
          {edu.gpa && <Text style={styles.institution}>GPA: {edu.gpa}</Text>}
        </View>
      ))}
    </View>
  );

  const renderSkills = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Skills</Text>
      <View style={styles.skillsContainer}>
        {data.skills.map((skill, index) => (
          <Text key={index} style={styles.skillTag}>{skill}</Text>
        ))}
      </View>
    </View>
  );

  const renderCertifications = () => {
    if (!data.certifications || data.certifications.length === 0) return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Certifications</Text>
        {data.certifications.map((cert, index) => (
          <View key={index} style={styles.educationItem}>
            <Text style={styles.degree}>{cert.name}</Text>
            <Text style={styles.institution}>{cert.issuer} • {cert.date}</Text>
            {cert.expirationDate && (
              <Text style={styles.institution}>Expires: {cert.expirationDate}</Text>
            )}
          </View>
        ))}
      </View>
    );
  };

  const renderProjects = () => {
    if (!data.projects || data.projects.length === 0) return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Projects</Text>
        {data.projects.map((project, index) => (
          <View key={index} style={styles.experienceItem}>
            <Text style={styles.jobTitle}>{project.name}</Text>
            <Text style={styles.description}>{project.description}</Text>
            <View style={styles.skillsContainer}>
              {project.technologies.map((tech, techIndex) => (
                <Text key={techIndex} style={styles.skillTag}>{tech}</Text>
              ))}
            </View>
            {project.url && (
              <Text style={[styles.institution, { marginTop: 4 }]}>{project.url}</Text>
            )}
          </View>
        ))}
      </View>
    );
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
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
