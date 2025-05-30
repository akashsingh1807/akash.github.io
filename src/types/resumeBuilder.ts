import { ResumeData, ResumeTemplate } from './resume';

export interface ResumeBuilderStep {
  id: string;
  title: string;
  description: string;
  icon: string;
  completed: boolean;
  required: boolean;
}

export interface ResumeBuilderState {
  currentStep: number;
  steps: ResumeBuilderStep[];
  resumeData: Partial<ResumeData>;
  selectedTemplate: ResumeTemplate | null;
  isPreviewMode: boolean;
  isDirty: boolean;
}

export interface PersonalInfoForm {
  name: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  website?: string;
  github?: string;
  portfolio?: string;
}

export interface ExperienceForm {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string[];
  achievements: string[];
  technologies?: string[];
}

export interface EducationForm {
  id: string;
  institution: string;
  degree: string;
  field: string;
  graduationDate: string;
  gpa?: string;
  honors?: string;
  relevantCoursework?: string[];
  activities?: string[];
}

export interface SkillCategory {
  id: string;
  name: string;
  skills: SkillItem[];
}

export interface SkillItem {
  id: string;
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  category: string;
}

export interface ProjectForm {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  url?: string;
  github?: string;
  startDate?: string;
  endDate?: string;
  highlights: string[];
}

export interface CertificationForm {
  id: string;
  name: string;
  issuer: string;
  date: string;
  expirationDate?: string;
  credentialId?: string;
  url?: string;
}

export interface LanguageForm {
  id: string;
  language: string;
  proficiency: 'Basic' | 'Conversational' | 'Fluent' | 'Native';
}

export interface ResumeSection {
  id: string;
  name: string;
  title: string;
  enabled: boolean;
  order: number;
  required: boolean;
}

export interface ResumeBuilderConfig {
  sections: ResumeSection[];
  templates: ResumeTemplate[];
  skillCategories: string[];
  commonSkills: Record<string, string[]>;
  industryTemplates: Record<string, string[]>;
}

export interface FormValidation {
  isValid: boolean;
  errors: Record<string, string>;
  warnings: Record<string, string>;
}

export interface ResumeBuilderActions {
  updatePersonalInfo: (info: Partial<PersonalInfoForm>) => void;
  addExperience: (experience: ExperienceForm) => void;
  updateExperience: (id: string, experience: Partial<ExperienceForm>) => void;
  removeExperience: (id: string) => void;
  addEducation: (education: EducationForm) => void;
  updateEducation: (id: string, education: Partial<EducationForm>) => void;
  removeEducation: (id: string) => void;
  addSkill: (skill: SkillItem) => void;
  updateSkill: (id: string, skill: Partial<SkillItem>) => void;
  removeSkill: (id: string) => void;
  addProject: (project: ProjectForm) => void;
  updateProject: (id: string, project: Partial<ProjectForm>) => void;
  removeProject: (id: string) => void;
  addCertification: (cert: CertificationForm) => void;
  updateCertification: (id: string, cert: Partial<CertificationForm>) => void;
  removeCertification: (id: string) => void;
  addLanguage: (language: LanguageForm) => void;
  updateLanguage: (id: string, language: Partial<LanguageForm>) => void;
  removeLanguage: (id: string) => void;
  updateSummary: (summary: string) => void;
  selectTemplate: (template: ResumeTemplate) => void;
  toggleSection: (sectionId: string) => void;
  reorderSections: (sections: ResumeSection[]) => void;
  nextStep: () => void;
  previousStep: () => void;
  goToStep: (step: number) => void;
  togglePreview: () => void;
  markStepCompleted: (stepId: string) => void;
  saveProgress: () => void;
  loadProgress: () => void;
  resetBuilder: () => void;
  validateForm: () => FormValidation;
}

export interface TemplateCustomization {
  colorScheme: {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    background: string;
  };
  typography: {
    headingFont: string;
    bodyFont: string;
    fontSize: 'small' | 'medium' | 'large';
  };
  layout: {
    margins: 'narrow' | 'normal' | 'wide';
    spacing: 'compact' | 'normal' | 'spacious';
    columns: 1 | 2;
  };
  sections: {
    showIcons: boolean;
    showDividers: boolean;
    sectionSpacing: 'small' | 'medium' | 'large';
  };
}

export interface ResumeBuilderPreset {
  id: string;
  name: string;
  description: string;
  industry: string[];
  level: 'entry' | 'mid' | 'senior' | 'executive';
  template: ResumeTemplate;
  sections: ResumeSection[];
  sampleData: Partial<ResumeData>;
  customization: TemplateCustomization;
}

export interface AIAssistance {
  enabled: boolean;
  suggestions: {
    summary: string[];
    skills: string[];
    achievements: string[];
    keywords: string[];
  };
  autoComplete: {
    companies: string[];
    positions: string[];
    schools: string[];
    degrees: string[];
  };
  contentOptimization: {
    bulletPoints: string[];
    actionVerbs: string[];
    quantifiers: string[];
  };
}
