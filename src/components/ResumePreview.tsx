import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Eye,
  Download,
  FileText,
  User,
  Briefcase,
  GraduationCap,
  Award,
  Code,
  ArrowLeftRight
} from 'lucide-react';
import { ResumeData, Enhancement, ResumeTemplate } from '@/types/resume';
import { cn } from '@/lib/utils';

interface ResumePreviewProps {
  originalData: ResumeData;
  enhancedData?: ResumeData;
  enhancements: Enhancement[];
  appliedEnhancements?: Enhancement[];
  onTemplateSelect?: (template: ResumeTemplate) => void;
}

export const ResumePreview: React.FC<ResumePreviewProps> = ({
  originalData,
  enhancedData,
  enhancements: _enhancements,
  appliedEnhancements = [],
  onTemplateSelect: _onTemplateSelect
}) => {
  const [viewMode, setViewMode] = useState<'original' | 'enhanced' | 'comparison'>('comparison');

  // Use provided enhanced data or original data
  const displayEnhancedData = enhancedData || originalData;

  const ResumeSection: React.FC<{
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
    className?: string;
  }> = ({ title, icon, children, className }) => (
    <div className={cn("mb-6", className)}>
      <h3 className="flex items-center gap-2 text-lg font-semibold mb-3 text-primary">
        {icon}
        {title}
      </h3>
      {children}
    </div>
  );

  const ResumeDisplay: React.FC<{ data: ResumeData; title: string; variant?: 'original' | 'enhanced' }> = ({
    data,
    title,
    variant = 'original'
  }) => (
    <Card className={cn(
      "h-full",
      variant === 'enhanced' ? 'border-green-200 bg-green-50/50' : 'border-red-200 bg-red-50/50'
    )}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Personal Information */}
        <ResumeSection title="Contact Information" icon={<User className="h-4 w-4" />}>
          <div className="space-y-1">
            <h2 className="text-xl font-bold">{data.personalInfo.name}</h2>
            <p className="text-muted-foreground">{data.personalInfo.email}</p>
            <p className="text-muted-foreground">{data.personalInfo.phone}</p>
            <p className="text-muted-foreground">{data.personalInfo.location}</p>
            {data.personalInfo.linkedin && (
              <p className="text-muted-foreground">{data.personalInfo.linkedin}</p>
            )}
          </div>
        </ResumeSection>

        {/* Summary */}
        <ResumeSection title="Professional Summary" icon={<Eye className="h-4 w-4" />}>
          <p className="text-sm leading-relaxed">{data.summary}</p>
        </ResumeSection>

        {/* Experience */}
        <ResumeSection title="Work Experience" icon={<Briefcase className="h-4 w-4" />}>
          <div className="space-y-4">
            {data.experience.map((exp) => (
              <div key={exp.id} className="border-l-2 border-primary/20 pl-4">
                <h4 className="font-semibold">{exp.position}</h4>
                <p className="text-sm text-muted-foreground">
                  {exp.company} • {exp.location} • {exp.startDate} - {exp.endDate}
                </p>
                <ul className="mt-2 space-y-1">
                  {exp.description.map((desc, index) => (
                    <li key={index} className="text-sm">• {desc}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </ResumeSection>

        {/* Education */}
        <ResumeSection title="Education" icon={<GraduationCap className="h-4 w-4" />}>
          <div className="space-y-3">
            {data.education.map((edu) => (
              <div key={edu.id}>
                <h4 className="font-semibold">{edu.degree} in {edu.field}</h4>
                <p className="text-sm text-muted-foreground">
                  {edu.institution} • {edu.graduationDate}
                </p>
                {edu.gpa && (
                  <p className="text-sm text-muted-foreground">GPA: {edu.gpa}</p>
                )}
              </div>
            ))}
          </div>
        </ResumeSection>

        {/* Skills */}
        <ResumeSection title="Skills" icon={<Code className="h-4 w-4" />}>
          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill, index) => (
              <Badge key={index} variant="outline">
                {skill}
              </Badge>
            ))}
          </div>
        </ResumeSection>

        {/* Certifications */}
        {data.certifications && data.certifications.length > 0 && (
          <ResumeSection title="Certifications" icon={<Award className="h-4 w-4" />}>
            <div className="space-y-2">
              {data.certifications.map((cert) => (
                <div key={cert.id}>
                  <h4 className="font-medium">{cert.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {cert.issuer} • {cert.date}
                    {cert.expirationDate && ` • Expires: ${cert.expirationDate}`}
                  </p>
                </div>
              ))}
            </div>
          </ResumeSection>
        )}

        {/* Projects */}
        {data.projects && data.projects.length > 0 && (
          <ResumeSection title="Projects" icon={<Code className="h-4 w-4" />}>
            <div className="space-y-3">
              {data.projects.map((project) => (
                <div key={project.id}>
                  <h4 className="font-semibold">{project.name}</h4>
                  <p className="text-sm mb-2">{project.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {project.technologies.map((tech, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                  {project.url && (
                    <p className="text-sm text-primary mt-1">{project.url}</p>
                  )}
                </div>
              ))}
            </div>
          </ResumeSection>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4 flex items-center justify-center gap-3">
          <Eye className="h-8 w-8 text-primary" />
          Resume Preview
        </h2>
        <p className="text-lg text-muted-foreground">
          Compare your original resume with the AI-enhanced version
        </p>
      </div>

      {/* View Mode Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Preview Options</CardTitle>
          <CardDescription>
            Choose how you'd like to view your resume
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as any)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="original">Original</TabsTrigger>
              <TabsTrigger value="enhanced">Enhanced</TabsTrigger>
              <TabsTrigger value="comparison">Side by Side</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>

      {/* Resume Display */}
      <div className="space-y-8">
        {viewMode === 'original' && (
          <ResumeDisplay data={originalData} title="Original Resume" variant="original" />
        )}

        {viewMode === 'enhanced' && (
          <ResumeDisplay data={displayEnhancedData} title="Enhanced Resume" variant="enhanced" />
        )}

        {viewMode === 'comparison' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ResumeDisplay data={originalData} title="Original Resume" variant="original" />
            <ResumeDisplay data={displayEnhancedData} title="Enhanced Resume" variant="enhanced" />
          </div>
        )}
      </div>

      {/* Enhancement Summary */}
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowLeftRight className="h-5 w-5 text-primary" />
            Enhancement Summary
          </CardTitle>
          <CardDescription>
            Overview of improvements made to your resume
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {appliedEnhancements.length}
              </div>
              <div className="text-sm text-muted-foreground">Applied Enhancements</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {appliedEnhancements.filter(e => e.impact === 'high').length}
              </div>
              <div className="text-sm text-muted-foreground">High Impact Changes</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {appliedEnhancements.filter(e => e.type === 'keyword').length}
              </div>
              <div className="text-sm text-muted-foreground">Keywords Added</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {appliedEnhancements.filter(e => e.type === 'content').length}
              </div>
              <div className="text-sm text-muted-foreground">Content Improvements</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4">
        <Button variant="outline" onClick={() => window.print()}>
          <Eye className="h-4 w-4 mr-2" />
          Print Preview
        </Button>
        <Button>
          <Download className="h-4 w-4 mr-2" />
          Continue to Download
        </Button>
      </div>
    </div>
  );
};
