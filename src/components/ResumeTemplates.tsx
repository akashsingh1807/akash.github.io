import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import {
  Download,
  FileText,
  Palette,
  CheckCircle,
  Briefcase,
  Code,
  Paintbrush,
  Minimize,
  Search,
  Filter,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { ResumeData, ResumeTemplate } from '@/types/resume';
import { TemplatePreview } from '@/components/TemplatePreview';
import { FileGenerationService, FileGenerationProgress } from '@/services/fileGenerator';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface ResumeTemplatesProps {
  selectedTemplate: ResumeTemplate | null;
  onTemplateSelect: (template: ResumeTemplate) => void;
  onDownload: (format: 'pdf' | 'docx') => void;
  resumeData: ResumeData | null;
  analysis?: any;
  appliedEnhancements?: any[];
}

const templates: ResumeTemplate[] = [
  {
    id: 'modern-1',
    name: 'Modern Professional',
    description: 'Clean, modern design with subtle colors and excellent readability',
    preview: '/templates/modern-1.png',
    category: 'modern',
    industry: ['Technology', 'Finance', 'Consulting']
  },
  {
    id: 'classic-1',
    name: 'Classic Executive',
    description: 'Traditional format perfect for corporate and executive positions',
    preview: '/templates/classic-1.png',
    category: 'classic',
    industry: ['Finance', 'Law', 'Healthcare', 'Government']
  },
  {
    id: 'creative-1',
    name: 'Creative Designer',
    description: 'Eye-catching design for creative professionals and designers',
    preview: '/templates/creative-1.png',
    category: 'creative',
    industry: ['Design', 'Marketing', 'Media', 'Arts']
  },
  {
    id: 'minimal-1',
    name: 'Minimal Clean',
    description: 'Ultra-clean design focusing on content with minimal distractions',
    preview: '/templates/minimal-1.png',
    category: 'minimal',
    industry: ['Technology', 'Startups', 'Research', 'Academia']
  },
  {
    id: 'modern-2',
    name: 'Tech Professional',
    description: 'Modern layout optimized for technical roles and IT professionals',
    preview: '/templates/modern-2.png',
    category: 'modern',
    industry: ['Technology', 'Engineering', 'Data Science']
  },
  {
    id: 'classic-2',
    name: 'Business Professional',
    description: 'Professional format ideal for business and management roles',
    preview: '/templates/classic-2.png',
    category: 'classic',
    industry: ['Business', 'Management', 'Sales', 'Operations']
  }
];

export const ResumeTemplates: React.FC<ResumeTemplatesProps> = ({
  selectedTemplate,
  onTemplateSelect,
  onDownload: _onDownload,
  resumeData,
  analysis,
  appliedEnhancements = []
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [downloadFormat, setDownloadFormat] = useState<'pdf' | 'docx'>('pdf');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState<FileGenerationProgress | null>(null);
  const { toast } = useToast();
  const fileService = FileGenerationService.getInstance();

  // Filter templates based on category and search
  const filteredTemplates = templates.filter(template => {
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesSearch = searchQuery === '' ||
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.industry.some(industry => industry.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  const handleDownload = async (format: 'pdf' | 'docx') => {
    if (!resumeData || !selectedTemplate) {
      toast({
        title: "Download Failed",
        description: "Please select a template and ensure resume data is available.",
        variant: "destructive"
      });
      return;
    }

    setIsDownloading(true);
    setDownloadProgress(null);

    try {
      await fileService.generateAndDownload(
        {
          data: resumeData,
          template: selectedTemplate,
          format
        },
        (progress) => setDownloadProgress(progress)
      );

      toast({
        title: "Download Successful!",
        description: `Your enhanced resume has been downloaded as ${format.toUpperCase()}.`,
      });

    } catch (error) {
      console.error('Download failed:', error);
      toast({
        title: "Download Failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsDownloading(false);
      setDownloadProgress(null);
    }
  };

  // getCategoryIcon function removed - now handled by TemplatePreview component

  // Remove the old TemplateCard component - we'll use the new TemplatePreview component

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4 flex items-center justify-center gap-3">
          <Palette className="h-8 w-8 text-primary" />
          Choose Template & Download
        </h2>
        <p className="text-lg text-muted-foreground">
          Select a professional template and download your enhanced resume
        </p>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Find Your Perfect Template
          </CardTitle>
          <CardDescription>
            Search and filter templates by category, industry, or features
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search templates by name, industry, or features..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Category Tabs */}
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">All Templates</TabsTrigger>
              <TabsTrigger value="modern" className="flex items-center gap-2">
                <Code className="h-4 w-4" />
                Modern
              </TabsTrigger>
              <TabsTrigger value="classic" className="flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                Classic
              </TabsTrigger>
              <TabsTrigger value="creative" className="flex items-center gap-2">
                <Paintbrush className="h-4 w-4" />
                Creative
              </TabsTrigger>
              <TabsTrigger value="minimal" className="flex items-center gap-2">
                <Minimize className="h-4 w-4" />
                Minimal
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Results Count */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''} found</span>
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearchQuery('')}
                className="h-auto p-0 text-primary hover:text-primary/80"
              >
                Clear search
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Templates Grid */}
      {filteredTemplates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <TemplatePreview
              key={template.id}
              template={template}
              resumeData={resumeData}
              isSelected={selectedTemplate?.id === template.id}
              onSelect={onTemplateSelect}
            />
          ))}
        </div>
      ) : (
        <Card className="text-center py-12">
          <CardContent>
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No templates found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search criteria or browse all templates
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
            >
              Show All Templates
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Resume Summary */}
      {analysis && (
        <Card className="border-green-200 bg-green-50/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Resume Enhancement Summary
            </CardTitle>
            <CardDescription>
              Your resume has been successfully enhanced and optimized
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-white rounded-lg border">
                <div className="text-2xl font-bold text-green-600">{analysis.overallScore}/100</div>
                <div className="text-sm text-muted-foreground">Overall Score</div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg border">
                <div className="text-2xl font-bold text-blue-600">{appliedEnhancements.length}</div>
                <div className="text-sm text-muted-foreground">Enhancements Applied</div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg border">
                <div className="text-2xl font-bold text-purple-600">{analysis.atsOptimization.score}/100</div>
                <div className="text-sm text-muted-foreground">ATS Compatibility</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Download Section */}
      {selectedTemplate && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5 text-primary" />
              Download Your Enhanced Resume
            </CardTitle>
            <CardDescription>
              Selected template: <strong>{selectedTemplate.name}</strong>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Format Selection */}
            <div>
              <h4 className="font-medium mb-3">Choose Download Format</h4>
              <Tabs value={downloadFormat} onValueChange={(value) => setDownloadFormat(value as 'pdf' | 'docx')}>
                <TabsList className="grid w-full grid-cols-2 max-w-md">
                  <TabsTrigger value="pdf" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    PDF
                  </TabsTrigger>
                  <TabsTrigger value="docx" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Word (DOCX)
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Format Benefits */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={cn(
                "p-4 rounded-lg border-2 transition-colors",
                downloadFormat === 'pdf' ? 'border-primary bg-primary/5' : 'border-muted'
              )}>
                <h5 className="font-medium mb-2">PDF Format</h5>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Preserves exact formatting</li>
                  <li>• Universal compatibility</li>
                  <li>• Ideal for online applications</li>
                  <li>• Print-ready quality</li>
                </ul>
              </div>
              <div className={cn(
                "p-4 rounded-lg border-2 transition-colors",
                downloadFormat === 'docx' ? 'border-primary bg-primary/5' : 'border-muted'
              )}>
                <h5 className="font-medium mb-2">Word Format</h5>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Easy to edit and customize</li>
                  <li>• ATS-friendly format</li>
                  <li>• Widely accepted by employers</li>
                  <li>• Collaborative editing support</li>
                </ul>
              </div>
            </div>

            {/* Download Progress */}
            {isDownloading && downloadProgress && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{downloadProgress.message}</span>
                  <span>{downloadProgress.progress}%</span>
                </div>
                <Progress value={downloadProgress.progress} className="h-2" />
              </div>
            )}

            {/* Download Button */}
            <div className="flex justify-center gap-4">
              <Button
                size="lg"
                onClick={() => handleDownload(downloadFormat)}
                disabled={!resumeData || !selectedTemplate || isDownloading}
                className="min-w-[200px]"
              >
                {isDownloading ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Download className="h-5 w-5 mr-2" />
                    Download {downloadFormat.toUpperCase()}
                  </>
                )}
              </Button>

              {!selectedTemplate && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  Please select a template first
                </div>
              )}
            </div>

            {/* Privacy Notice */}
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Privacy Protected:</strong> Your resume data is processed locally and never stored on our servers.
                All files are generated client-side for maximum privacy and security.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}

      {/* Template Features */}
      <Card>
        <CardHeader>
          <CardTitle>All Templates Include</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm">ATS-Optimized</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm">Professional Fonts</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm">Perfect Spacing</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm">Print-Ready</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm">Mobile Responsive</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm">Industry Standards</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm">Easy Customization</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm">Multiple Formats</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
