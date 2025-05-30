import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Download,
  Eye,
  CheckCircle,
  AlertCircle,
  FileText,
  User,
  Briefcase,
  GraduationCap,
  Code,
  Folder,
  Award,
  Globe,
  Palette
} from 'lucide-react';
import { useResumeBuilder } from '@/contexts/ResumeBuilderContext';
import { useToast } from '@/hooks/use-toast';
import { generatePDF } from '@/services/fileGenerator';

export const ReviewStep: React.FC = () => {
  const { state, actions } = useResumeBuilder();
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);

  const handlePreview = () => {
    if (!state.isPreviewMode) {
      actions.togglePreview();
    }
    toast({
      title: "Preview Enabled",
      description: "Your resume preview is now visible on the right panel.",
    });
  };

  const handleDownloadPDF = async () => {
    if (!state.selectedTemplate) {
      toast({
        title: "Template Required",
        description: "Please select a template before downloading.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      await generatePDF(state.resumeData, state.selectedTemplate);
      toast({
        title: "PDF Generated",
        description: "Your resume has been downloaded successfully.",
      });
    } catch (error) {
      console.error('PDF generation failed:', error);
      toast({
        title: "Download Failed",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const getSectionStatus = (sectionData: any, isRequired: boolean = false) => {
    const hasData = Array.isArray(sectionData) ? sectionData.length > 0 : !!sectionData;

    if (hasData) {
      return { status: 'complete', icon: CheckCircle, color: 'text-green-500', label: 'Complete' };
    } else if (isRequired) {
      return { status: 'required', icon: AlertCircle, color: 'text-red-500', label: 'Required' };
    } else {
      return { status: 'optional', icon: AlertCircle, color: 'text-amber-500', label: 'Optional' };
    }
  };

  const sections = [
    {
      name: 'Template',
      icon: Palette,
      data: state.selectedTemplate,
      required: true,
      description: state.selectedTemplate?.name || 'No template selected'
    },
    {
      name: 'Personal Information',
      icon: User,
      data: state.resumeData.personalInfo?.name && state.resumeData.personalInfo?.email,
      required: true,
      description: state.resumeData.personalInfo?.name || 'No personal information'
    },
    {
      name: 'Professional Summary',
      icon: FileText,
      data: state.resumeData.summary,
      required: true,
      description: state.resumeData.summary ? `${state.resumeData.summary.length} characters` : 'No summary added'
    },
    {
      name: 'Work Experience',
      icon: Briefcase,
      data: state.resumeData.experience,
      required: true,
      description: `${state.resumeData.experience?.length || 0} experience entries`
    },
    {
      name: 'Education',
      icon: GraduationCap,
      data: state.resumeData.education,
      required: true,
      description: `${state.resumeData.education?.length || 0} education entries`
    },
    {
      name: 'Skills',
      icon: Code,
      data: state.resumeData.skills,
      required: true,
      description: `${state.resumeData.skills?.length || 0} skills listed`
    },
    {
      name: 'Projects',
      icon: Folder,
      data: state.resumeData.projects,
      required: false,
      description: `${state.resumeData.projects?.length || 0} projects added`
    },
    {
      name: 'Certifications',
      icon: Award,
      data: state.resumeData.certifications,
      required: false,
      description: `${state.resumeData.certifications?.length || 0} certifications added`
    },
    {
      name: 'Languages',
      icon: Globe,
      data: state.resumeData.languages,
      required: false,
      description: `${state.resumeData.languages?.length || 0} languages added`
    }
  ];

  const requiredSections = sections.filter(section => section.required);
  const completedRequired = requiredSections.filter(section => {
    const status = getSectionStatus(section.data, section.required);
    return status.status === 'complete';
  });

  const isResumeComplete = completedRequired.length === requiredSections.length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5 text-primary" />
            Review & Download
          </CardTitle>
          <p className="text-muted-foreground">
            Review your resume sections and download your professional resume.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Completion Status */}
          <Card className={`border-2 ${isResumeComplete ? 'border-green-200 bg-green-50 dark:bg-green-950' : 'border-amber-200 bg-amber-50 dark:bg-amber-950'}`}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                {isResumeComplete ? (
                  <CheckCircle className="h-6 w-6 text-green-500" />
                ) : (
                  <AlertCircle className="h-6 w-6 text-amber-500" />
                )}
                <div>
                  <h4 className={`font-semibold ${isResumeComplete ? 'text-green-900 dark:text-green-100' : 'text-amber-900 dark:text-amber-100'}`}>
                    {isResumeComplete ? 'Resume Complete!' : 'Resume Incomplete'}
                  </h4>
                  <p className={`text-sm ${isResumeComplete ? 'text-green-700 dark:text-green-300' : 'text-amber-700 dark:text-amber-300'}`}>
                    {isResumeComplete
                      ? 'All required sections are complete. You can now download your resume.'
                      : `Complete ${requiredSections.length - completedRequired.length} more required section${requiredSections.length - completedRequired.length !== 1 ? 's' : ''} to finish your resume.`
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              variant="outline"
              onClick={handlePreview}
              size="lg"
              className="w-full sm:w-auto"
            >
              <Eye className="h-4 w-4 mr-2" />
              {state.isPreviewMode ? 'Preview Active' : 'Show Preview'}
            </Button>
            <Button
              onClick={handleDownloadPDF}
              disabled={!isResumeComplete || isGenerating}
              size="lg"
              className="w-full sm:w-auto"
            >
              <Download className="h-4 w-4 mr-2" />
              {isGenerating ? 'Generating PDF...' : 'Download PDF'}
            </Button>
          </div>

          {/* Resume Sections Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Resume Sections</CardTitle>
              <p className="text-sm text-muted-foreground">
                Review the completion status of each section
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sections.map((section) => {
                  const status = getSectionStatus(section.data, section.required);
                  const StatusIcon = status.icon;
                  const SectionIcon = section.icon;

                  return (
                    <div key={section.name} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <SectionIcon className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <div className="flex items-center gap-2">
                            <h5 className="font-medium">{section.name}</h5>
                            {section.required && (
                              <Badge variant="outline" className="text-xs">Required</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{section.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <StatusIcon className={`h-5 w-5 ${status.color}`} />
                        <Badge
                          variant={status.status === 'complete' ? 'default' : status.status === 'required' ? 'destructive' : 'secondary'}
                          className="text-xs"
                        >
                          {status.label}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Resume Summary Stats */}
          <Card className="bg-gray-50 dark:bg-gray-900">
            <CardContent className="p-4">
              <h4 className="font-semibold mb-3">Resume Statistics</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="text-center">
                  <div className="font-bold text-lg text-primary">{completedRequired.length}/{requiredSections.length}</div>
                  <div className="text-muted-foreground">Required Complete</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-lg text-primary">{state.resumeData.experience?.length || 0}</div>
                  <div className="text-muted-foreground">Work Experience</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-lg text-primary">{state.resumeData.skills?.length || 0}</div>
                  <div className="text-muted-foreground">Skills Listed</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-lg text-primary">
                    {(state.resumeData.projects?.length || 0) + (state.resumeData.certifications?.length || 0) + (state.resumeData.languages?.length || 0)}
                  </div>
                  <div className="text-muted-foreground">Additional Sections</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {!isResumeComplete && (
            <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950">
              <CardContent className="p-4">
                <h4 className="font-medium text-amber-900 dark:text-amber-100 mb-2">Complete Your Resume</h4>
                <p className="text-sm text-amber-700 dark:text-amber-300 mb-3">
                  To download your resume, please complete the following required sections:
                </p>
                <div className="space-y-2">
                  {requiredSections
                    .filter(section => getSectionStatus(section.data, section.required).status !== 'complete')
                    .map(section => (
                      <div key={section.name} className="flex items-center gap-2 text-sm">
                        <AlertCircle className="h-4 w-4 text-amber-500" />
                        <span className="text-amber-700 dark:text-amber-300">{section.name}</span>
                      </div>
                    ))
                  }
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
