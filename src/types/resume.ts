export interface ResumeData {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    location: string;
    linkedin?: string;
    website?: string;
    github?: string;
    portfolio?: string;
  };
  summary: string;
  experience: WorkExperience[];
  education: Education[];
  skills: string[];
  certifications?: Certification[];
  projects?: Project[];
  languages?: Language[];
}

export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string[];
}

export interface Education {
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

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  expirationDate?: string;
  credentialId?: string;
  url?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  url?: string;
  github?: string;
  startDate?: string;
  endDate?: string;
  highlights?: string[];
}

export interface Language {
  id: string;
  language: string;
  proficiency: 'Basic' | 'Conversational' | 'Fluent' | 'Native';
}

export interface ResumeAnalysis {
  overallScore: number;
  sections: {
    summary: SectionAnalysis;
    experience: SectionAnalysis;
    skills: SectionAnalysis;
    education: SectionAnalysis;
  };
  atsOptimization: ATSAnalysis;
  suggestions: Enhancement[];
}

export interface SectionAnalysis {
  score: number;
  strengths: string[];
  improvements: string[];
}

export interface ATSAnalysis {
  score: number;
  keywords: {
    found: string[];
    missing: string[];
    suggestions: string[];
  };
  formatting: {
    score: number;
    issues: string[];
  };
}

export interface Enhancement {
  id: string;
  type: 'content' | 'format' | 'keyword' | 'grammar';
  section: string;
  original: string;
  enhanced: string;
  reason: string;
  impact: 'high' | 'medium' | 'low';
  applied: boolean;
}

export interface ResumeTemplate {
  id: string;
  name: string;
  description: string;
  preview: string;
  category: 'modern' | 'classic' | 'creative' | 'minimal';
  industry: string[];
}

export interface ResumeUploadState {
  file: File | null;
  uploading: boolean;
  error: string | null;
  progress: number;
}

export interface ResumeProcessingState {
  step: 'upload' | 'analyzing' | 'enhancing' | 'preview' | 'download';
  progress: number;
  message: string;
  error: string | null;
}

export interface ResumeEnhancementRequest {
  resumeText: string;
  targetIndustry?: string;
  targetRole?: string;
  experienceLevel: 'entry' | 'mid' | 'senior' | 'executive';
  focusAreas: ('ats' | 'content' | 'keywords' | 'format')[];
}

export interface ResumeEnhancementResponse {
  analysis: ResumeAnalysis;
  enhancements: Enhancement[];
  enhancedResume: ResumeData;
  recommendations: string[];
}
