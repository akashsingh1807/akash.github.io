import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Eye,
  Star,
  Zap,
  Shield,
  Palette,
  FileText,
  Maximize2,
  X
} from 'lucide-react';
import { ResumeData, ResumeTemplate } from '@/types/resume';
import { FileGenerationService } from '@/services/fileGenerator';
import { cn } from '@/lib/utils';

interface TemplatePreviewProps {
  template: ResumeTemplate;
  resumeData: ResumeData | null;
  isSelected: boolean;
  onSelect: (template: ResumeTemplate) => void;
  onPreview?: (template: ResumeTemplate) => void;
}

export const TemplatePreview: React.FC<TemplatePreviewProps> = ({
  template,
  resumeData,
  isSelected,
  onSelect,
  onPreview
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isGeneratingPreview, setIsGeneratingPreview] = useState(false);
  const [showFullPreview, setShowFullPreview] = useState(false);
  const fileService = FileGenerationService.getInstance();

  const metadata = fileService.getTemplateMetadata(template);

  const generatePreview = async () => {
    if (!resumeData || isGeneratingPreview) return;

    setIsGeneratingPreview(true);
    try {
      const url = await fileService.generatePreview(resumeData, template);
      setPreviewUrl(url);
    } catch (error) {
      console.error('Failed to generate preview:', error);
    } finally {
      setIsGeneratingPreview(false);
    }
  };

  useEffect(() => {
    if (resumeData && isSelected && !previewUrl) {
      generatePreview();
    }
  }, [resumeData, isSelected]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'modern': return <Zap className="h-4 w-4" />;
      case 'classic': return <Shield className="h-4 w-4" />;
      case 'creative': return <Palette className="h-4 w-4" />;
      case 'minimal': return <FileText className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getATSBadgeVariant = (score: number) => {
    if (score >= 90) return 'default';
    if (score >= 80) return 'secondary';
    return 'outline';
  };

  const renderSampleContent = () => (
    <div className="space-y-4 p-4 bg-white rounded-lg border text-xs">
      {/* Header */}
      <div className={cn(
        "pb-3 border-b",
        template.category === 'modern' && "border-blue-200",
        template.category === 'classic' && "border-gray-800 text-center",
        template.category === 'creative' && "border-purple-200",
        template.category === 'minimal' && "border-gray-200"
      )}>
        <h3 className={cn(
          "font-bold text-lg mb-1",
          template.category === 'modern' && "text-blue-600",
          template.category === 'classic' && "text-black uppercase tracking-wide",
          template.category === 'creative' && "text-purple-600",
          template.category === 'minimal' && "text-gray-800"
        )}>
          John Doe
        </h3>
        <p className="text-gray-600 text-xs">
          john.doe@email.com • (555) 123-4567 • San Francisco, CA
        </p>
      </div>

      {/* Summary */}
      <div>
        <h4 className={cn(
          "font-semibold text-sm mb-2 uppercase tracking-wide",
          template.category === 'modern' && "text-blue-600 border-b border-blue-200 pb-1",
          template.category === 'classic' && "text-black text-center border-b border-black pb-1",
          template.category === 'creative' && "text-purple-600",
          template.category === 'minimal' && "text-gray-800 border-b border-gray-200 pb-1"
        )}>
          Professional Summary
        </h4>
        <p className="text-gray-700 text-xs leading-relaxed">
          Experienced software engineer with 5+ years developing scalable applications...
        </p>
      </div>

      {/* Experience */}
      <div>
        <h4 className={cn(
          "font-semibold text-sm mb-2 uppercase tracking-wide",
          template.category === 'modern' && "text-blue-600 border-b border-blue-200 pb-1",
          template.category === 'classic' && "text-black text-center border-b border-black pb-1",
          template.category === 'creative' && "text-purple-600",
          template.category === 'minimal' && "text-gray-800 border-b border-gray-200 pb-1"
        )}>
          Experience
        </h4>
        <div className="space-y-2">
          <div>
            <h5 className={cn(
              "font-semibold text-xs",
              template.category === 'modern' && "text-blue-700",
              template.category === 'classic' && "text-black",
              template.category === 'creative' && "text-purple-700",
              template.category === 'minimal' && "text-gray-800"
            )}>
              Senior Software Engineer
            </h5>
            <p className="text-gray-600 text-xs">TechCorp • 2021 - Present</p>
            <ul className="text-xs text-gray-700 mt-1 space-y-1">
              <li>• Led development of microservices architecture</li>
              <li>• Improved application performance by 40%</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Skills */}
      <div>
        <h4 className={cn(
          "font-semibold text-sm mb-2 uppercase tracking-wide",
          template.category === 'modern' && "text-blue-600 border-b border-blue-200 pb-1",
          template.category === 'classic' && "text-black text-center border-b border-black pb-1",
          template.category === 'creative' && "text-purple-600",
          template.category === 'minimal' && "text-gray-800 border-b border-gray-200 pb-1"
        )}>
          Skills
        </h4>
        <div className={cn(
          "flex flex-wrap gap-1",
          template.category === 'classic' && "flex-col gap-0"
        )}>
          {template.category === 'classic' ? (
            <>
              <span className="text-xs text-gray-700">• JavaScript</span>
              <span className="text-xs text-gray-700">• React</span>
              <span className="text-xs text-gray-700">• Node.js</span>
            </>
          ) : (
            <>
              <span className={cn(
                "px-2 py-1 rounded text-xs",
                template.category === 'modern' && "bg-blue-100 text-blue-700 border border-blue-200",
                template.category === 'creative' && "bg-purple-100 text-purple-700",
                template.category === 'minimal' && "bg-gray-100 text-gray-700"
              )}>
                JavaScript
              </span>
              <span className={cn(
                "px-2 py-1 rounded text-xs",
                template.category === 'modern' && "bg-blue-100 text-blue-700 border border-blue-200",
                template.category === 'creative' && "bg-purple-100 text-purple-700",
                template.category === 'minimal' && "bg-gray-100 text-gray-700"
              )}>
                React
              </span>
              <span className={cn(
                "px-2 py-1 rounded text-xs",
                template.category === 'modern' && "bg-blue-100 text-blue-700 border border-blue-200",
                template.category === 'creative' && "bg-purple-100 text-purple-700",
                template.category === 'minimal' && "bg-gray-100 text-gray-700"
              )}>
                Node.js
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Card
        className={cn(
          "cursor-pointer transition-all duration-200 hover:shadow-lg group",
          isSelected
            ? "ring-2 ring-primary border-primary shadow-lg"
            : "hover:border-primary/50"
        )}
        onClick={() => onSelect(template)}
      >
        <CardContent className="p-6">
          {/* Template Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                {getCategoryIcon(template.category)}
                <h3 className="font-semibold text-lg">{template.name}</h3>
                {isSelected && (
                  <Badge variant="default" className="ml-2">
                    Selected
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                {template.description}
              </p>
            </div>
          </div>

          {/* Template Preview */}
          <div className="aspect-[8.5/11] bg-gray-50 rounded-lg mb-4 overflow-hidden relative group">
            {isGeneratingPreview ? (
              <div className="flex items-center justify-center h-full">
                <div className="space-y-2 w-full p-4">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-2/3" />
                </div>
              </div>
            ) : previewUrl ? (
              <iframe
                src={previewUrl}
                className="w-full h-full border-0"
                title={`${template.name} Preview`}
              />
            ) : (
              renderSampleContent()
            )}

            {/* Preview Overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowFullPreview(true);
                  }}
                  className="bg-white/90 hover:bg-white"
                >
                  <Maximize2 className="h-4 w-4 mr-1" />
                  Preview
                </Button>
                {onPreview && (
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={(e) => {
                      e.stopPropagation();
                      onPreview(template);
                    }}
                    className="bg-white/90 hover:bg-white"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Quick View
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Template Metadata */}
          <div className="space-y-3">
            {/* Category and Rating */}
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="capitalize">
                {template.category}
              </Badge>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className="h-3 w-3 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
            </div>

            {/* ATS Compatibility */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">ATS Compatibility</span>
              <Badge variant={getATSBadgeVariant(metadata.atsCompatibility)}>
                {metadata.atsCompatibility}%
              </Badge>
            </div>

            {/* Features */}
            <div>
              <span className="text-sm font-medium mb-2 block">Features</span>
              <div className="flex flex-wrap gap-1">
                {metadata.features.slice(0, 3).map((feature, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {feature}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Best For */}
            <div>
              <span className="text-sm font-medium mb-1 block">Best for</span>
              <div className="flex flex-wrap gap-1">
                {template.industry.slice(0, 2).map((industry, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {industry}
                  </Badge>
                ))}
                {template.industry.length > 2 && (
                  <Badge variant="outline" className="text-xs">
                    +{template.industry.length - 2} more
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Full Preview Modal */}
      {showFullPreview && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] w-full overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">{template.name} Preview</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFullPreview(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-4 overflow-auto max-h-[calc(90vh-80px)]">
              {previewUrl ? (
                <iframe
                  src={previewUrl}
                  className="w-full h-[600px] border rounded"
                  title={`${template.name} Full Preview`}
                />
              ) : (
                <div className="aspect-[8.5/11] max-w-2xl mx-auto">
                  {renderSampleContent()}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
