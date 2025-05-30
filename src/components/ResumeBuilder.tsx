import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  Save,
  Download,
  RotateCcw,
  CheckCircle,
  Palette,
  User,
  FileText,
  Briefcase,
  GraduationCap,
  Code,
  Folder,
  Award,
  Globe
} from 'lucide-react';
import { useResumeBuilder } from '@/contexts/ResumeBuilderContext';
import { TemplateSelector } from './builder-steps/TemplateSelector';
import { PersonalInfoStep } from './builder-steps/PersonalInfoStep';
import { SummaryStep } from './builder-steps/SummaryStep';
import { ExperienceStep } from './builder-steps/ExperienceStep';
import { EducationStep } from './builder-steps/EducationStep';
import { SkillsStep } from './builder-steps/SkillsStep';
import { ProjectsStep } from './builder-steps/ProjectsStep';
import { CertificationsStep } from './builder-steps/CertificationsStep';
import { LanguagesStep } from './builder-steps/LanguagesStep';
import { ReviewStep } from './builder-steps/ReviewStep';
import { ResumePreviewPanel } from './ResumePreviewPanel';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const stepIcons = {
  'template': Palette,
  'personal': User,
  'summary': FileText,
  'experience': Briefcase,
  'education': GraduationCap,
  'skills': Code,
  'projects': Folder,
  'certifications': Award,
  'languages': Globe,
  'review': Download
};

export const ResumeBuilder: React.FC = () => {
  const { state, actions } = useResumeBuilder();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const currentStepData = state.steps[state.currentStep];
  const completedSteps = state.steps.filter(step => step.completed).length;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      actions.saveProgress();
      toast({
        title: "Progress Saved",
        description: "Your resume progress has been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Failed to save progress. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to start over? All progress will be lost.')) {
      actions.resetBuilder();
      toast({
        title: "Builder Reset",
        description: "Resume builder has been reset to start fresh.",
      });
    }
  };

  const canProceedToNext = () => {
    const currentStep = state.steps[state.currentStep];

    // If it's the last step (review), allow completion if all required steps are done
    if (state.currentStep === state.steps.length - 1) {
      const requiredSteps = state.steps.filter(step => step.required);
      const completedRequiredSteps = requiredSteps.filter(step => step.completed);
      return completedRequiredSteps.length === requiredSteps.length;
    }

    // For other steps, check if current step is completed (if required)
    if (currentStep?.required && !currentStep.completed) {
      return false;
    }

    return state.currentStep < state.steps.length - 1;
  };

  const canGoBack = () => {
    return state.currentStep > 0;
  };

  const renderCurrentStep = () => {
    switch (currentStepData?.id) {
      case 'template':
        return <TemplateSelector />;
      case 'personal':
        return <PersonalInfoStep />;
      case 'summary':
        return <SummaryStep />;
      case 'experience':
        return <ExperienceStep />;
      case 'education':
        return <EducationStep />;
      case 'skills':
        return <SkillsStep />;
      case 'projects':
        return <ProjectsStep />;
      case 'certifications':
        return <CertificationsStep />;
      case 'languages':
        return <LanguagesStep />;
      case 'review':
        return <ReviewStep />;
      default:
        return <div>Step not found</div>;
    }
  };

  if (!currentStepData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Main container with navbar spacing */}
      <div className="max-w-7xl mx-auto pt-24 md:pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-16">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="p-3 bg-primary/10 rounded-full">
            <FileText className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Resume Builder
          </h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Create professional resumes from scratch using our guided step-by-step process and beautiful templates
        </p>
        <div className="flex items-center justify-center gap-4 mt-6">
          <Badge variant="outline" className="px-3 py-1">
            Step {state.currentStep + 1} of {state.steps.length}
          </Badge>
          <Badge variant="secondary" className="px-3 py-1">
            {completedSteps} Completed
          </Badge>
        </div>
      </div>

      {/* Step Progress Indicator */}
      <div className="flex items-center justify-center space-x-4 mb-12">
        {state.steps.map((step, index) => {
          const StepIcon = stepIcons[step.id as keyof typeof stepIcons];
          return (
            <div key={step.id} className="flex items-center">
              <button
                onClick={() => actions.goToStep(index)}
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-200 ${
                  step.completed
                    ? 'bg-green-500 border-green-500 text-white'
                    : index === state.currentStep
                      ? 'border-primary text-primary bg-primary/10'
                      : 'border-muted-foreground text-muted-foreground hover:border-primary/50'
                }`}
              >
                {step.completed ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  <StepIcon className="h-5 w-5" />
                )}
              </button>
              <span className={`ml-2 text-sm font-medium hidden sm:block ${
                index === state.currentStep ? 'text-primary' : 'text-muted-foreground'
              }`}>
                {step.title}
              </span>
              {index < state.steps.length - 1 && (
                <div className={`w-8 h-0.5 mx-4 ${
                  step.completed ? 'bg-green-500' : 'bg-muted-foreground/30'
                }`} />
              )}
            </div>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-center gap-4 mb-12">
        <Button
          variant="outline"
          onClick={actions.togglePreview}
          className="flex items-center gap-2"
        >
          {state.isPreviewMode ? (
            <>
              <EyeOff className="h-4 w-4" />
              Hide Preview
            </>
          ) : (
            <>
              <Eye className="h-4 w-4" />
              Show Preview
            </>
          )}
        </Button>

        <Button
          variant="outline"
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          {isSaving ? 'Saving...' : 'Save Progress'}
        </Button>

        <Button
          variant="ghost"
          onClick={handleReset}
          className="text-destructive hover:text-destructive flex items-center gap-2"
        >
          <RotateCcw className="h-4 w-4" />
          Start Over
        </Button>
      </div>

      {/* Main Content */}
      <div className={cn(
        "grid gap-8",
        state.isPreviewMode ? "lg:grid-cols-2" : "lg:grid-cols-1"
      )}>
        {/* Left Panel - Current Step */}
        <div className="space-y-6">
          {/* Current Step Header */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {React.createElement(stepIcons[currentStepData.id as keyof typeof stepIcons], {
                      className: "h-5 w-5 text-primary"
                    })}
                    {currentStepData.title}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {currentStepData.description}
                  </p>
                </div>
                {currentStepData.completed && (
                  <CheckCircle className="h-6 w-6 text-green-500" />
                )}
              </div>
            </CardHeader>
          </Card>

          {/* Current Step Content */}
          <div className="min-h-[500px]">
            {renderCurrentStep()}
          </div>

          {/* Navigation Buttons */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  onClick={actions.previousStep}
                  disabled={!canGoBack()}
                  size="lg"
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>

                <div className="flex items-center gap-3">
                  {!currentStepData.completed && currentStepData.required && (
                    <Badge variant="outline" className="text-amber-600 border-amber-200">
                      Required Step
                    </Badge>
                  )}

                  <Button
                    onClick={actions.nextStep}
                    disabled={!canProceedToNext()}
                    size="lg"
                  >
                    {state.currentStep === state.steps.length - 1 ? (
                      <>
                        Complete Resume
                        <Download className="h-4 w-4 ml-2" />
                      </>
                    ) : (
                      <>
                        Continue
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Panel - Preview */}
        {state.isPreviewMode && (
          <div className="lg:sticky lg:top-24 lg:h-fit">
            <ResumePreviewPanel />
          </div>
        )}
      </div>

      {/* Mobile Preview Toggle */}
      <div className="lg:hidden fixed bottom-4 right-4 z-50">
        <Button
          onClick={actions.togglePreview}
          size="lg"
          className="rounded-full shadow-lg"
        >
          {state.isPreviewMode ? (
            <EyeOff className="h-5 w-5" />
          ) : (
            <Eye className="h-5 w-5" />
          )}
        </Button>
      </div>
      </div>
    </div>
  );
};
