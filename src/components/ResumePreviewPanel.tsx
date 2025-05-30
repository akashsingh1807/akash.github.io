import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, FileText } from 'lucide-react';
import { useResumeBuilder } from '@/contexts/ResumeBuilderContext';
import { cn } from '@/lib/utils';

export const ResumePreviewPanel: React.FC = () => {
  const { state } = useResumeBuilder();
  const { resumeData, selectedTemplate } = state;

  const renderPreviewContent = () => {
    if (!selectedTemplate) {
      return (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Template Selected</h3>
          <p className="text-muted-foreground">
            Please select a template to see the preview.
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-4 p-4 bg-white rounded border text-sm">
        {/* Header */}
        <div className={cn(
          "pb-3 border-b",
          selectedTemplate.category === 'modern' && "border-blue-200",
          selectedTemplate.category === 'classic' && "border-gray-800 text-center",
          selectedTemplate.category === 'creative' && "border-purple-200",
          selectedTemplate.category === 'minimal' && "border-gray-200"
        )}>
          <h3 className={cn(
            "font-bold text-lg mb-2",
            selectedTemplate.category === 'modern' && "text-blue-600",
            selectedTemplate.category === 'classic' && "text-black uppercase tracking-wide",
            selectedTemplate.category === 'creative' && "text-purple-600",
            selectedTemplate.category === 'minimal' && "text-gray-800"
          )}>
            {resumeData.personalInfo?.name || 'Your Name'}
          </h3>
          <div className="text-gray-600 text-sm space-y-1">
            {resumeData.personalInfo?.email && (
              <p>{resumeData.personalInfo.email}</p>
            )}
            {resumeData.personalInfo?.phone && (
              <p>{resumeData.personalInfo.phone}</p>
            )}
            {resumeData.personalInfo?.location && (
              <p>{resumeData.personalInfo.location}</p>
            )}
            {resumeData.personalInfo?.linkedin && (
              <p>{resumeData.personalInfo.linkedin}</p>
            )}
          </div>
        </div>

        {/* Summary */}
        {resumeData.summary && (
          <div>
            <h4 className={cn(
              "font-semibold text-sm mb-2 uppercase tracking-wide",
              selectedTemplate.category === 'modern' && "text-blue-600 border-b border-blue-200 pb-1",
              selectedTemplate.category === 'classic' && "text-black text-center border-b border-black pb-1",
              selectedTemplate.category === 'creative' && "text-purple-600",
              selectedTemplate.category === 'minimal' && "text-gray-800 border-b border-gray-200 pb-1"
            )}>
              Professional Summary
            </h4>
            <p className="text-gray-700 text-sm leading-relaxed">
              {resumeData.summary}
            </p>
          </div>
        )}

        {/* Experience */}
        {resumeData.experience && resumeData.experience.length > 0 && (
          <div>
            <h4 className={cn(
              "font-semibold text-sm mb-2 uppercase tracking-wide",
              selectedTemplate.category === 'modern' && "text-blue-600 border-b border-blue-200 pb-1",
              selectedTemplate.category === 'classic' && "text-black text-center border-b border-black pb-1",
              selectedTemplate.category === 'creative' && "text-purple-600",
              selectedTemplate.category === 'minimal' && "text-gray-800 border-b border-gray-200 pb-1"
            )}>
              Experience
            </h4>
            <div className="space-y-3">
              {resumeData.experience.slice(0, 2).map((exp, index) => (
                <div key={index}>
                  <h5 className={cn(
                    "font-semibold text-sm",
                    selectedTemplate.category === 'modern' && "text-blue-700",
                    selectedTemplate.category === 'classic' && "text-black",
                    selectedTemplate.category === 'creative' && "text-purple-700",
                    selectedTemplate.category === 'minimal' && "text-gray-800"
                  )}>
                    {exp.position}
                  </h5>
                  <p className="text-gray-600 text-xs">
                    {exp.company} • {exp.startDate} - {exp.endDate}
                  </p>
                  {exp.description && exp.description.length > 0 && (
                    <ul className="text-xs text-gray-700 mt-1 space-y-1">
                      {exp.description.slice(0, 2).map((desc, descIndex) => (
                        <li key={descIndex}>• {desc}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {resumeData.education && resumeData.education.length > 0 && (
          <div>
            <h4 className={cn(
              "font-semibold text-sm mb-2 uppercase tracking-wide",
              selectedTemplate.category === 'modern' && "text-blue-600 border-b border-blue-200 pb-1",
              selectedTemplate.category === 'classic' && "text-black text-center border-b border-black pb-1",
              selectedTemplate.category === 'creative' && "text-purple-600",
              selectedTemplate.category === 'minimal' && "text-gray-800 border-b border-gray-200 pb-1"
            )}>
              Education
            </h4>
            <div className="space-y-2">
              {resumeData.education.slice(0, 2).map((edu, index) => (
                <div key={index}>
                  <h5 className="font-semibold text-sm">{edu.degree} in {edu.field}</h5>
                  <p className="text-gray-600 text-xs">{edu.institution} • {edu.graduationDate}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {resumeData.skills && resumeData.skills.length > 0 && (
          <div>
            <h4 className={cn(
              "font-semibold text-sm mb-2 uppercase tracking-wide",
              selectedTemplate.category === 'modern' && "text-blue-600 border-b border-blue-200 pb-1",
              selectedTemplate.category === 'classic' && "text-black text-center border-b border-black pb-1",
              selectedTemplate.category === 'creative' && "text-purple-600",
              selectedTemplate.category === 'minimal' && "text-gray-800 border-b border-gray-200 pb-1"
            )}>
              Skills
            </h4>
            <div className={cn(
              "flex flex-wrap gap-1",
              selectedTemplate.category === 'classic' && "flex-col gap-0"
            )}>
              {resumeData.skills.slice(0, 8).map((skill, index) => (
                <span
                  key={index}
                  className={cn(
                    "text-xs",
                    selectedTemplate.category === 'classic'
                      ? "text-gray-700"
                      : "px-2 py-1 rounded",
                    selectedTemplate.category === 'modern' && "bg-blue-100 text-blue-700",
                    selectedTemplate.category === 'creative' && "bg-purple-100 text-purple-700",
                    selectedTemplate.category === 'minimal' && "bg-gray-100 text-gray-700"
                  )}
                >
                  {selectedTemplate.category === 'classic' ? `• ${skill}` : skill}
                </span>
              ))}
              {resumeData.skills.length > 8 && (
                <span className="text-xs text-gray-500">
                  +{resumeData.skills.length - 8} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Projects */}
        {resumeData.projects && resumeData.projects.length > 0 && (
          <div>
            <h4 className={cn(
              "font-semibold text-sm mb-2 uppercase tracking-wide",
              selectedTemplate.category === 'modern' && "text-blue-600 border-b border-blue-200 pb-1",
              selectedTemplate.category === 'classic' && "text-black text-center border-b border-black pb-1",
              selectedTemplate.category === 'creative' && "text-purple-600",
              selectedTemplate.category === 'minimal' && "text-gray-800 border-b border-gray-200 pb-1"
            )}>
              Projects
            </h4>
            <div className="space-y-2">
              {resumeData.projects.slice(0, 2).map((project, index) => (
                <div key={index}>
                  <h5 className="font-semibold text-sm">{project.name}</h5>
                  <p className="text-gray-600 text-xs">{project.description}</p>
                  {project.technologies && project.technologies.length > 0 && (
                    <p className="text-xs text-gray-500 mt-1">
                      Tech: {project.technologies.slice(0, 3).join(', ')}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {resumeData.certifications && resumeData.certifications.length > 0 && (
          <div>
            <h4 className={cn(
              "font-semibold text-sm mb-2 uppercase tracking-wide",
              selectedTemplate.category === 'modern' && "text-blue-600 border-b border-blue-200 pb-1",
              selectedTemplate.category === 'classic' && "text-black text-center border-b border-black pb-1",
              selectedTemplate.category === 'creative' && "text-purple-600",
              selectedTemplate.category === 'minimal' && "text-gray-800 border-b border-gray-200 pb-1"
            )}>
              Certifications
            </h4>
            <div className="space-y-1">
              {resumeData.certifications.slice(0, 3).map((cert, index) => (
                <div key={index}>
                  <h5 className="font-semibold text-sm">{cert.name}</h5>
                  <p className="text-gray-600 text-xs">{cert.issuer} • {cert.date}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Languages */}
        {resumeData.languages && resumeData.languages.length > 0 && (
          <div>
            <h4 className={cn(
              "font-semibold text-sm mb-2 uppercase tracking-wide",
              selectedTemplate.category === 'modern' && "text-blue-600 border-b border-blue-200 pb-1",
              selectedTemplate.category === 'classic' && "text-black text-center border-b border-black pb-1",
              selectedTemplate.category === 'creative' && "text-purple-600",
              selectedTemplate.category === 'minimal' && "text-gray-800 border-b border-gray-200 pb-1"
            )}>
              Languages
            </h4>
            <div className="space-y-1">
              {resumeData.languages.slice(0, 4).map((language, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm font-medium">{language.language}</span>
                  <span className="text-xs text-gray-600">{language.proficiency}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className="h-fit">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-primary" />
            Live Preview
          </CardTitle>
          {selectedTemplate && (
            <Badge variant="outline" className="capitalize">
              {selectedTemplate.name}
            </Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground">
          See how your resume looks as you build it
        </p>
      </CardHeader>
      <CardContent className="p-4">
        <div className="aspect-[8.5/11] bg-gray-50 rounded-lg overflow-hidden border">
          {renderPreviewContent()}
        </div>
      </CardContent>
    </Card>
  );
};
