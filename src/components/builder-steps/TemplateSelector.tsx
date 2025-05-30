import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Search,
  Star,
  CheckCircle,
  Zap,
  Shield,
  Palette,
  FileText,
  Briefcase,
  Code,
  Paintbrush,
  Minimize
} from 'lucide-react';
import { useResumeBuilder } from '@/contexts/ResumeBuilderContext';
import { ResumeTemplate } from '@/types/resume';
import { cn } from '@/lib/utils';

// Sample templates data
const templates: ResumeTemplate[] = [
  {
    id: 'modern-1',
    name: 'Modern Professional',
    description: 'Clean, modern design with subtle colors and excellent readability',
    preview: '/templates/modern-1.png',
    category: 'modern',
    industry: ['Technology', 'Finance', 'Consulting', 'Business', 'Marketing']
  },
  {
    id: 'classic-1',
    name: 'Classic Executive',
    description: 'Traditional format perfect for corporate and executive positions',
    preview: '/templates/classic-1.png',
    category: 'classic',
    industry: ['Finance', 'Law', 'Healthcare', 'Government', 'Education', 'Non-profit']
  },
  {
    id: 'creative-1',
    name: 'Creative Designer',
    description: 'Eye-catching design for creative professionals and designers',
    preview: '/templates/creative-1.png',
    category: 'creative',
    industry: ['Design', 'Marketing', 'Media', 'Arts', 'Entertainment', 'Advertising']
  },
  {
    id: 'minimal-1',
    name: 'Minimal Clean',
    description: 'Ultra-clean design focusing on content with minimal distractions',
    preview: '/templates/minimal-1.png',
    category: 'minimal',
    industry: ['Any Industry', 'Entry Level', 'Career Change', 'All Professions']
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
    industry: ['Business', 'Management', 'Sales', 'Operations', 'Retail', 'Customer Service']
  }
];

export const TemplateSelector: React.FC = () => {
  const { state, actions } = useResumeBuilder();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredTemplates = templates.filter(template => {
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesSearch = searchQuery === '' ||
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.industry.some(industry => industry.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'modern': return <Zap className="h-4 w-4" />;
      case 'classic': return <Shield className="h-4 w-4" />;
      case 'creative': return <Palette className="h-4 w-4" />;
      case 'minimal': return <FileText className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getATSScore = (category: string) => {
    switch (category) {
      case 'modern': return 90;
      case 'classic': return 95;
      case 'creative': return 75;
      case 'minimal': return 92;
      default: return 85;
    }
  };

  const renderSampleContent = (template: ResumeTemplate) => (
    <div className="space-y-3 p-3 bg-white rounded border text-xs">
      {/* Header */}
      <div className={cn(
        "pb-2 border-b",
        template.category === 'modern' && "border-blue-200",
        template.category === 'classic' && "border-gray-800 text-center",
        template.category === 'creative' && "border-purple-200",
        template.category === 'minimal' && "border-gray-200"
      )}>
        <h3 className={cn(
          "font-bold text-sm mb-1",
          template.category === 'modern' && "text-blue-600",
          template.category === 'classic' && "text-black uppercase tracking-wide",
          template.category === 'creative' && "text-purple-600",
          template.category === 'minimal' && "text-gray-800"
        )}>
          John Doe
        </h3>
        <p className="text-gray-600 text-xs">
          john.doe@email.com • (555) 123-4567
        </p>
      </div>

      {/* Summary */}
      <div>
        <h4 className={cn(
          "font-semibold text-xs mb-1 uppercase tracking-wide",
          template.category === 'modern' && "text-blue-600 border-b border-blue-200 pb-1",
          template.category === 'classic' && "text-black text-center border-b border-black pb-1",
          template.category === 'creative' && "text-purple-600",
          template.category === 'minimal' && "text-gray-800 border-b border-gray-200 pb-1"
        )}>
          Summary
        </h4>
        <p className="text-gray-700 text-xs leading-relaxed">
          Experienced professional with 5+ years...
        </p>
      </div>

      {/* Experience */}
      <div>
        <h4 className={cn(
          "font-semibold text-xs mb-1 uppercase tracking-wide",
          template.category === 'modern' && "text-blue-600 border-b border-blue-200 pb-1",
          template.category === 'classic' && "text-black text-center border-b border-black pb-1",
          template.category === 'creative' && "text-purple-600",
          template.category === 'minimal' && "text-gray-800 border-b border-gray-200 pb-1"
        )}>
          Experience
        </h4>
        <div>
          <h5 className={cn(
            "font-semibold text-xs",
            template.category === 'modern' && "text-blue-700",
            template.category === 'classic' && "text-black",
            template.category === 'creative' && "text-purple-700",
            template.category === 'minimal' && "text-gray-800"
          )}>
            Senior Developer
          </h5>
          <p className="text-gray-600 text-xs">TechCorp • 2021 - Present</p>
        </div>
      </div>

      {/* Skills */}
      <div>
        <h4 className={cn(
          "font-semibold text-xs mb-1 uppercase tracking-wide",
          template.category === 'modern' && "text-blue-600 border-b border-blue-200 pb-1",
          template.category === 'classic' && "text-black text-center border-b border-black pb-1",
          template.category === 'creative' && "text-purple-600",
          template.category === 'minimal' && "text-gray-800 border-b border-gray-200 pb-1"
        )}>
          Skills
        </h4>
        <div className="flex flex-wrap gap-1">
          {['JavaScript', 'React', 'Node.js'].map((skill, index) => (
            <span key={index} className={cn(
              "px-1 py-0.5 rounded text-xs",
              template.category === 'modern' && "bg-blue-100 text-blue-700",
              template.category === 'creative' && "bg-purple-100 text-purple-700",
              template.category === 'minimal' && "bg-gray-100 text-gray-700",
              template.category === 'classic' && "text-gray-700"
            )}>
              {template.category === 'classic' ? `• ${skill}` : skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-primary" />
            Choose Your Template
          </CardTitle>
          <p className="text-muted-foreground">
            Select a professional template that matches your industry and personal style.
            You can customize colors and fonts later.
          </p>
        </CardHeader>
      </Card>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-6 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search templates by name, industry, or style..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Category Tabs */}
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">All</TabsTrigger>
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <Card
            key={template.id}
            className={cn(
              "cursor-pointer transition-all duration-200 hover:shadow-lg group",
              state.selectedTemplate?.id === template.id
                ? "ring-2 ring-primary border-primary shadow-lg"
                : "hover:border-primary/50"
            )}
            onClick={() => actions.selectTemplate(template)}
          >
            <CardContent className="p-4">
              {/* Template Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {getCategoryIcon(template.category)}
                    <h3 className="font-semibold">{template.name}</h3>
                    {state.selectedTemplate?.id === template.id && (
                      <CheckCircle className="h-4 w-4 text-primary" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {template.description}
                  </p>
                </div>
              </div>

              {/* Template Preview */}
              <div className="aspect-[8.5/11] bg-gray-50 rounded mb-3 overflow-hidden">
                {renderSampleContent(template)}
              </div>

              {/* Template Metadata */}
              <div className="space-y-2">
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

                {/* ATS Score */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">ATS Score</span>
                  <Badge variant="secondary">
                    {getATSScore(template.category)}%
                  </Badge>
                </div>

                {/* Industries */}
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
                        +{template.industry.length - 2}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Select Button */}
              {state.selectedTemplate?.id === template.id ? (
                <Button className="w-full mt-3" disabled>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Selected
                </Button>
              ) : (
                <Button
                  variant="outline"
                  className="w-full mt-3 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    actions.selectTemplate(template);
                  }}
                >
                  Select Template
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No Results */}
      {filteredTemplates.length === 0 && (
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
    </div>
  );
};
