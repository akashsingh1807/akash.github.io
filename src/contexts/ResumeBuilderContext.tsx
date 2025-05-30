import React, { createContext, useContext, useReducer, useEffect } from 'react';
import {
  ResumeBuilderState,
  ResumeBuilderActions,
  ResumeBuilderStep,
  PersonalInfoForm,
  ExperienceForm,
  EducationForm,
  SkillItem,
  ProjectForm,
  CertificationForm,
  LanguageForm,
  FormValidation
} from '@/types/resumeBuilder';
import { ResumeTemplate } from '@/types/resume';
import { v4 as uuidv4 } from 'uuid';

// Initial state
const initialState: ResumeBuilderState = {
  currentStep: 0,
  steps: [
    { id: 'template', title: 'Choose Template', description: 'Select a professional template', icon: 'Palette', completed: false, required: true, enabled: true },
    { id: 'personal', title: 'Personal Info', description: 'Add your contact details', icon: 'User', completed: false, required: true, enabled: true },
    { id: 'summary', title: 'Professional Summary', description: 'Write a compelling summary', icon: 'FileText', completed: false, required: true, enabled: true },
    { id: 'experience', title: 'Work Experience', description: 'Add your work history', icon: 'Briefcase', completed: false, required: true, enabled: true },
    { id: 'education', title: 'Education', description: 'Add your educational background', icon: 'GraduationCap', completed: false, required: true, enabled: true },
    { id: 'skills', title: 'Skills', description: 'List your technical and soft skills', icon: 'Code', completed: false, required: true, enabled: true },
    { id: 'projects', title: 'Projects', description: 'Showcase your key projects', icon: 'Folder', completed: false, required: false, enabled: true },
    { id: 'certifications', title: 'Certifications', description: 'Add professional certifications', icon: 'Award', completed: false, required: false, enabled: true },
    { id: 'languages', title: 'Languages', description: 'List languages you speak', icon: 'Globe', completed: false, required: false, enabled: true },
    { id: 'review', title: 'Review & Download', description: 'Final review and download', icon: 'Download', completed: false, required: true, enabled: true }
  ],
  resumeData: {
    personalInfo: {
      name: '',
      email: '',
      phone: '',
      location: ''
    },
    summary: '',
    experience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
    languages: []
  },
  selectedTemplate: null,
  isPreviewMode: false,
  isDirty: false
};

// Action types
type ResumeBuilderAction =
  | { type: 'SET_TEMPLATE'; payload: ResumeTemplate }
  | { type: 'UPDATE_PERSONAL_INFO'; payload: Partial<PersonalInfoForm> }
  | { type: 'UPDATE_SUMMARY'; payload: string }
  | { type: 'ADD_EXPERIENCE'; payload: ExperienceForm }
  | { type: 'UPDATE_EXPERIENCE'; payload: { id: string; data: Partial<ExperienceForm> } }
  | { type: 'REMOVE_EXPERIENCE'; payload: string }
  | { type: 'ADD_EDUCATION'; payload: EducationForm }
  | { type: 'UPDATE_EDUCATION'; payload: { id: string; data: Partial<EducationForm> } }
  | { type: 'REMOVE_EDUCATION'; payload: string }
  | { type: 'ADD_SKILL'; payload: SkillItem }
  | { type: 'UPDATE_SKILL'; payload: { id: string; data: Partial<SkillItem> } }
  | { type: 'REMOVE_SKILL'; payload: string }
  | { type: 'ADD_PROJECT'; payload: ProjectForm }
  | { type: 'UPDATE_PROJECT'; payload: { id: string; data: Partial<ProjectForm> } }
  | { type: 'REMOVE_PROJECT'; payload: string }
  | { type: 'ADD_CERTIFICATION'; payload: CertificationForm }
  | { type: 'UPDATE_CERTIFICATION'; payload: { id: string; data: Partial<CertificationForm> } }
  | { type: 'REMOVE_CERTIFICATION'; payload: string }
  | { type: 'ADD_LANGUAGE'; payload: LanguageForm }
  | { type: 'UPDATE_LANGUAGE'; payload: { id: string; data: Partial<LanguageForm> } }
  | { type: 'REMOVE_LANGUAGE'; payload: string }
  | { type: 'NEXT_STEP' }
  | { type: 'PREVIOUS_STEP' }
  | { type: 'GO_TO_STEP'; payload: number }
  | { type: 'TOGGLE_PREVIEW' }
  | { type: 'MARK_STEP_COMPLETED'; payload: string }
  | { type: 'TOGGLE_SECTION'; payload: string }
  | { type: 'REORDER_SECTIONS'; payload: ResumeBuilderStep[] }
  | { type: 'SET_DIRTY'; payload: boolean }
  | { type: 'RESET_BUILDER' }
  | { type: 'LOAD_STATE'; payload: Partial<ResumeBuilderState> };

// Reducer
function resumeBuilderReducer(state: ResumeBuilderState, action: ResumeBuilderAction): ResumeBuilderState {
  switch (action.type) {
    case 'SET_TEMPLATE':
      const templateState = {
        ...state,
        selectedTemplate: action.payload,
        steps: state.steps.map(step =>
          step.id === 'template' ? { ...step, completed: true } : step
        ),
        isDirty: true
      };
      return checkAndUpdateReviewStep(templateState);

    case 'UPDATE_PERSONAL_INFO':
      const updatedPersonalInfo = {
        name: '',
        email: '',
        phone: '',
        location: '',
        ...state.resumeData.personalInfo,
        ...action.payload
      };
      const personalState = {
        ...state,
        resumeData: {
          ...state.resumeData,
          personalInfo: updatedPersonalInfo
        },
        steps: state.steps.map(step =>
          step.id === 'personal' ? { ...step, completed: isPersonalInfoComplete(updatedPersonalInfo) } : step
        ),
        isDirty: true
      };
      return checkAndUpdateReviewStep(personalState);

    case 'UPDATE_SUMMARY':
      const summaryState = {
        ...state,
        resumeData: {
          ...state.resumeData,
          summary: action.payload
        },
        steps: state.steps.map(step =>
          step.id === 'summary' ? { ...step, completed: action.payload.length > 50 } : step
        ),
        isDirty: true
      };
      return checkAndUpdateReviewStep(summaryState);

    case 'ADD_EXPERIENCE':
      const newExperience = [...(state.resumeData.experience || []), action.payload];
      const addExpState = {
        ...state,
        resumeData: {
          ...state.resumeData,
          experience: newExperience
        },
        steps: state.steps.map(step =>
          step.id === 'experience' ? { ...step, completed: newExperience.length > 0 } : step
        ),
        isDirty: true
      };
      return checkAndUpdateReviewStep(addExpState);

    case 'UPDATE_EXPERIENCE':
      const updatedExperience = (state.resumeData.experience || []).map(exp =>
        exp.id === action.payload.id ? { ...exp, ...action.payload.data } : exp
      );
      return {
        ...state,
        resumeData: {
          ...state.resumeData,
          experience: updatedExperience
        },
        isDirty: true
      };

    case 'REMOVE_EXPERIENCE':
      const filteredExperience = (state.resumeData.experience || []).filter(exp => exp.id !== action.payload);
      const removeExpState = {
        ...state,
        resumeData: {
          ...state.resumeData,
          experience: filteredExperience
        },
        steps: state.steps.map(step =>
          step.id === 'experience' ? { ...step, completed: filteredExperience.length > 0 } : step
        ),
        isDirty: true
      };
      return checkAndUpdateReviewStep(removeExpState);

    case 'ADD_EDUCATION':
      const newEducation = [...(state.resumeData.education || []), action.payload];
      const addEduState = {
        ...state,
        resumeData: {
          ...state.resumeData,
          education: newEducation
        },
        steps: state.steps.map(step =>
          step.id === 'education' ? { ...step, completed: newEducation.length > 0 } : step
        ),
        isDirty: true
      };
      return checkAndUpdateReviewStep(addEduState);

    case 'UPDATE_EDUCATION':
      const updatedEducation = (state.resumeData.education || []).map(edu =>
        edu.id === action.payload.id ? { ...edu, ...action.payload.data } : edu
      );
      return {
        ...state,
        resumeData: {
          ...state.resumeData,
          education: updatedEducation
        },
        isDirty: true
      };

    case 'REMOVE_EDUCATION':
      const filteredEducation = (state.resumeData.education || []).filter(edu => edu.id !== action.payload);
      const removeEduState = {
        ...state,
        resumeData: {
          ...state.resumeData,
          education: filteredEducation
        },
        steps: state.steps.map(step =>
          step.id === 'education' ? { ...step, completed: filteredEducation.length > 0 } : step
        ),
        isDirty: true
      };
      return checkAndUpdateReviewStep(removeEduState);

    case 'ADD_SKILL':
      const newSkills = [...(state.resumeData.skills || []), action.payload.name];
      const addSkillState = {
        ...state,
        resumeData: {
          ...state.resumeData,
          skills: newSkills
        },
        steps: state.steps.map(step =>
          step.id === 'skills' ? { ...step, completed: newSkills.length > 0 } : step
        ),
        isDirty: true
      };
      return checkAndUpdateReviewStep(addSkillState);

    case 'REMOVE_SKILL':
      const filteredSkills = (state.resumeData.skills || []).filter((_, index) => index.toString() !== action.payload);
      const removeSkillState = {
        ...state,
        resumeData: {
          ...state.resumeData,
          skills: filteredSkills
        },
        steps: state.steps.map(step =>
          step.id === 'skills' ? { ...step, completed: filteredSkills.length > 0 } : step
        ),
        isDirty: true
      };
      return checkAndUpdateReviewStep(removeSkillState);

    case 'ADD_PROJECT':
      const newProjects = [...(state.resumeData.projects || []), action.payload];
      return {
        ...state,
        resumeData: {
          ...state.resumeData,
          projects: newProjects
        },
        steps: state.steps.map(step =>
          step.id === 'projects' ? { ...step, completed: newProjects.length > 0 } : step
        ),
        isDirty: true
      };

    case 'UPDATE_PROJECT':
      const updatedProjects = (state.resumeData.projects || []).map(proj =>
        proj.id === action.payload.id ? { ...proj, ...action.payload.data } : proj
      );
      return {
        ...state,
        resumeData: {
          ...state.resumeData,
          projects: updatedProjects
        },
        isDirty: true
      };

    case 'REMOVE_PROJECT':
      const filteredProjects = (state.resumeData.projects || []).filter(proj => proj.id !== action.payload);
      return {
        ...state,
        resumeData: {
          ...state.resumeData,
          projects: filteredProjects
        },
        steps: state.steps.map(step =>
          step.id === 'projects' ? { ...step, completed: filteredProjects.length > 0 } : step
        ),
        isDirty: true
      };

    case 'ADD_CERTIFICATION':
      const newCertifications = [...(state.resumeData.certifications || []), action.payload];
      return {
        ...state,
        resumeData: {
          ...state.resumeData,
          certifications: newCertifications
        },
        steps: state.steps.map(step =>
          step.id === 'certifications' ? { ...step, completed: newCertifications.length > 0 } : step
        ),
        isDirty: true
      };

    case 'UPDATE_CERTIFICATION':
      const updatedCertifications = (state.resumeData.certifications || []).map(cert =>
        cert.id === action.payload.id ? { ...cert, ...action.payload.data } : cert
      );
      return {
        ...state,
        resumeData: {
          ...state.resumeData,
          certifications: updatedCertifications
        },
        isDirty: true
      };

    case 'REMOVE_CERTIFICATION':
      const filteredCertifications = (state.resumeData.certifications || []).filter(cert => cert.id !== action.payload);
      return {
        ...state,
        resumeData: {
          ...state.resumeData,
          certifications: filteredCertifications
        },
        steps: state.steps.map(step =>
          step.id === 'certifications' ? { ...step, completed: filteredCertifications.length > 0 } : step
        ),
        isDirty: true
      };

    case 'ADD_LANGUAGE':
      const newLanguages = [...(state.resumeData.languages || []), action.payload];
      return {
        ...state,
        resumeData: {
          ...state.resumeData,
          languages: newLanguages
        },
        steps: state.steps.map(step =>
          step.id === 'languages' ? { ...step, completed: newLanguages.length > 0 } : step
        ),
        isDirty: true
      };

    case 'UPDATE_LANGUAGE':
      const updatedLanguages = (state.resumeData.languages || []).map(lang =>
        lang.id === action.payload.id ? { ...lang, ...action.payload.data } : lang
      );
      return {
        ...state,
        resumeData: {
          ...state.resumeData,
          languages: updatedLanguages
        },
        isDirty: true
      };

    case 'REMOVE_LANGUAGE':
      const filteredLanguages = (state.resumeData.languages || []).filter(lang => lang.id !== action.payload);
      return {
        ...state,
        resumeData: {
          ...state.resumeData,
          languages: filteredLanguages
        },
        steps: state.steps.map(step =>
          step.id === 'languages' ? { ...step, completed: filteredLanguages.length > 0 } : step
        ),
        isDirty: true
      };

    case 'NEXT_STEP':
      return {
        ...state,
        currentStep: Math.min(state.currentStep + 1, state.steps.length - 1)
      };

    case 'PREVIOUS_STEP':
      return {
        ...state,
        currentStep: Math.max(state.currentStep - 1, 0)
      };

    case 'GO_TO_STEP':
      return {
        ...state,
        currentStep: Math.max(0, Math.min(action.payload, state.steps.length - 1))
      };

    case 'TOGGLE_PREVIEW':
      return {
        ...state,
        isPreviewMode: !state.isPreviewMode
      };

    case 'RESET_BUILDER':
      return initialState;

    case 'LOAD_STATE':
      return { ...state, ...action.payload };

    case 'MARK_STEP_COMPLETED':
      return {
        ...state,
        steps: state.steps.map(step =>
          step.id === action.payload ? { ...step, completed: true } : step
        ),
        isDirty: true
      };

    case 'TOGGLE_SECTION':
      return {
        ...state,
        steps: state.steps.map(step =>
          step.id === action.payload ? { ...step, enabled: !step.enabled } : step
        ),
        isDirty: true
      };

    case 'REORDER_SECTIONS':
      return {
        ...state,
        steps: action.payload,
        isDirty: true
      };

    default:
      return state;
  }
}

// Helper functions
function isPersonalInfoComplete(info: any): boolean {
  return !!(info?.name && info?.email && info?.phone && info?.location);
}

function checkAndUpdateReviewStep(state: ResumeBuilderState): ResumeBuilderState {
  // Get all required steps except the review step
  const requiredStepsExceptReview = state.steps.filter(step => step.required && step.id !== 'review');
  const completedRequiredSteps = requiredStepsExceptReview.filter(step => step.completed);

  // If all required steps (except review) are completed, mark review as completed
  const shouldMarkReviewComplete = completedRequiredSteps.length === requiredStepsExceptReview.length;

  return {
    ...state,
    steps: state.steps.map(step =>
      step.id === 'review' ? { ...step, completed: shouldMarkReviewComplete } : step
    )
  };
}

// Context
const ResumeBuilderContext = createContext<{
  state: ResumeBuilderState;
  actions: ResumeBuilderActions;
} | null>(null);

// Provider component
export const ResumeBuilderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(resumeBuilderReducer, initialState);

  // Auto-save to localStorage
  useEffect(() => {
    if (state.isDirty) {
      localStorage.setItem('resumeBuilderState', JSON.stringify(state));
    }
  }, [state]);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('resumeBuilderState');
    if (saved) {
      try {
        const parsedState = JSON.parse(saved);
        dispatch({ type: 'LOAD_STATE', payload: parsedState });
      } catch (error) {
        console.error('Failed to load saved state:', error);
      }
    }
  }, []);

  const actions: ResumeBuilderActions = {
    updatePersonalInfo: (info) => dispatch({ type: 'UPDATE_PERSONAL_INFO', payload: info }),
    addExperience: (experience) => dispatch({ type: 'ADD_EXPERIENCE', payload: { ...experience, id: experience.id || uuidv4() } }),
    updateExperience: (id, experience) => dispatch({ type: 'UPDATE_EXPERIENCE', payload: { id, data: experience } }),
    removeExperience: (id) => dispatch({ type: 'REMOVE_EXPERIENCE', payload: id }),
    addEducation: (education) => dispatch({ type: 'ADD_EDUCATION', payload: { ...education, id: education.id || uuidv4() } }),
    updateEducation: (id, education) => dispatch({ type: 'UPDATE_EDUCATION', payload: { id, data: education } }),
    removeEducation: (id) => dispatch({ type: 'REMOVE_EDUCATION', payload: id }),
    addSkill: (skill) => dispatch({ type: 'ADD_SKILL', payload: skill }),
    updateSkill: (id, skill) => dispatch({ type: 'UPDATE_SKILL', payload: { id, data: skill } }),
    removeSkill: (id) => dispatch({ type: 'REMOVE_SKILL', payload: id }),
    addProject: (project) => dispatch({ type: 'ADD_PROJECT', payload: { ...project, id: project.id || uuidv4() } }),
    updateProject: (id, project) => dispatch({ type: 'UPDATE_PROJECT', payload: { id, data: project } }),
    removeProject: (id) => dispatch({ type: 'REMOVE_PROJECT', payload: id }),
    addCertification: (cert) => dispatch({ type: 'ADD_CERTIFICATION', payload: { ...cert, id: cert.id || uuidv4() } }),
    updateCertification: (id, cert) => dispatch({ type: 'UPDATE_CERTIFICATION', payload: { id, data: cert } }),
    removeCertification: (id) => dispatch({ type: 'REMOVE_CERTIFICATION', payload: id }),
    addLanguage: (language) => dispatch({ type: 'ADD_LANGUAGE', payload: { ...language, id: language.id || uuidv4() } }),
    updateLanguage: (id, language) => dispatch({ type: 'UPDATE_LANGUAGE', payload: { id, data: language } }),
    removeLanguage: (id) => dispatch({ type: 'REMOVE_LANGUAGE', payload: id }),
    updateSummary: (summary) => dispatch({ type: 'UPDATE_SUMMARY', payload: summary }),
    selectTemplate: (template) => dispatch({ type: 'SET_TEMPLATE', payload: template }),
    toggleSection: (sectionId: string) => dispatch({ type: 'TOGGLE_SECTION', payload: sectionId }),
    reorderSections: (sections: ResumeBuilderStep[]) => dispatch({ type: 'REORDER_SECTIONS', payload: sections }),
    nextStep: () => dispatch({ type: 'NEXT_STEP' }),
    previousStep: () => dispatch({ type: 'PREVIOUS_STEP' }),
    goToStep: (step) => dispatch({ type: 'GO_TO_STEP', payload: step }),
    togglePreview: () => dispatch({ type: 'TOGGLE_PREVIEW' }),
    markStepCompleted: (stepId) => dispatch({ type: 'MARK_STEP_COMPLETED', payload: stepId }),
    saveProgress: () => {
      localStorage.setItem('resumeBuilderState', JSON.stringify(state));
    },
    loadProgress: () => {
      const saved = localStorage.getItem('resumeBuilderState');
      if (saved) {
        dispatch({ type: 'LOAD_STATE', payload: JSON.parse(saved) });
      }
    },
    resetBuilder: () => dispatch({ type: 'RESET_BUILDER' }),
    validateForm: (): FormValidation => {
      const errors: Record<string, string> = {};
      const warnings: Record<string, string> = {};

      // Validate Personal Information
      const personalInfo = state.resumeData.personalInfo;
      if (!personalInfo?.name?.trim()) {
        errors.name = 'Full name is required';
      }
      if (!personalInfo?.email?.trim()) {
        errors.email = 'Email address is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(personalInfo.email)) {
        errors.email = 'Please enter a valid email address';
      }
      if (!personalInfo?.phone?.trim()) {
        errors.phone = 'Phone number is required';
      } else if (!/^[\+]?[1-9][\d]{0,15}$/.test(personalInfo.phone.replace(/[\s\-\(\)]/g, ''))) {
        warnings.phone = 'Phone number format may not be recognized by all systems';
      }
      if (!personalInfo?.location?.trim()) {
        warnings.location = 'Location helps employers understand your availability';
      }

      // Validate Professional Summary
      const summary = state.resumeData.summary;
      if (!summary?.trim()) {
        errors.summary = 'Professional summary is required';
      } else if (summary.length < 50) {
        warnings.summary = 'Consider expanding your summary to at least 50 characters for better impact';
      } else if (summary.length > 500) {
        warnings.summary = 'Consider shortening your summary to under 500 characters for better readability';
      }

      // Validate Work Experience
      const experience = state.resumeData.experience || [];
      if (experience.length === 0) {
        errors.experience = 'At least one work experience entry is required';
      } else {
        experience.forEach((exp, index) => {
          if (!exp.position?.trim()) {
            errors[`experience_${index}_position`] = `Position title is required for experience entry ${index + 1}`;
          }
          if (!exp.company?.trim()) {
            errors[`experience_${index}_company`] = `Company name is required for experience entry ${index + 1}`;
          }
          if (!exp.startDate) {
            errors[`experience_${index}_startDate`] = `Start date is required for experience entry ${index + 1}`;
          }
          if (!exp.description || exp.description.length === 0) {
            warnings[`experience_${index}_description`] = `Consider adding job responsibilities for experience entry ${index + 1}`;
          }
        });
      }

      // Validate Education
      const education = state.resumeData.education || [];
      if (education.length === 0) {
        errors.education = 'At least one education entry is required';
      } else {
        education.forEach((edu, index) => {
          if (!edu.degree?.trim()) {
            errors[`education_${index}_degree`] = `Degree is required for education entry ${index + 1}`;
          }
          if (!edu.field?.trim()) {
            errors[`education_${index}_field`] = `Field of study is required for education entry ${index + 1}`;
          }
          if (!edu.institution?.trim()) {
            errors[`education_${index}_institution`] = `Institution name is required for education entry ${index + 1}`;
          }
        });
      }

      // Validate Skills
      const skills = state.resumeData.skills || [];
      if (skills.length === 0) {
        errors.skills = 'At least one skill is required';
      } else if (skills.length < 5) {
        warnings.skills = 'Consider adding more skills (recommended: 8-15 skills)';
      } else if (skills.length > 20) {
        warnings.skills = 'Consider reducing skills to focus on most relevant ones';
      }

      // Validate Template Selection
      if (!state.selectedTemplate) {
        errors.template = 'Please select a resume template';
      }

      // ATS Optimization Checks
      const allText = [
        personalInfo?.name || '',
        summary || '',
        ...experience.flatMap(exp => [exp.position, exp.company, ...(exp.description || [])]),
        ...education.flatMap(edu => [edu.degree, edu.field, edu.institution]),
        ...skills
      ].join(' ').toLowerCase();

      const hasActionVerbs = /\b(achieved|managed|led|developed|created|improved|increased|reduced|implemented|designed|coordinated|supervised|analyzed|optimized|streamlined)\b/.test(allText);
      if (!hasActionVerbs) {
        warnings.ats_optimization = 'Consider using action verbs (achieved, managed, led, etc.) for better ATS compatibility';
      }

      const isValid = Object.keys(errors).length === 0;

      return {
        isValid,
        errors,
        warnings
      };
    }
  };

  return (
    <ResumeBuilderContext.Provider value={{ state, actions }}>
      {children}
    </ResumeBuilderContext.Provider>
  );
};

// Hook to use the context
export const useResumeBuilder = () => {
  const context = useContext(ResumeBuilderContext);
  if (!context) {
    throw new Error('useResumeBuilder must be used within a ResumeBuilderProvider');
  }
  return context;
};
