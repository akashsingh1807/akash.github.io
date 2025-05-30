import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  TrendingUp,
  Target,
  AlertTriangle,
  CheckCircle,
  Zap,
  Brain,
  FileText,
  ArrowRight
} from 'lucide-react';
import { ResumeAnalysis, Enhancement } from '@/types/resume';
import { cn } from '@/lib/utils';

interface ResumeAnalyzerProps {
  analysis: ResumeAnalysis;
  enhancements: Enhancement[];
  onApplyEnhancements: (selectedEnhancements: Enhancement[]) => void;
}

export const ResumeAnalyzer: React.FC<ResumeAnalyzerProps> = ({
  analysis,
  enhancements,
  onApplyEnhancements
}) => {
  const [selectedEnhancements, setSelectedEnhancements] = useState<string[]>(
    enhancements.filter(e => e.impact === 'high').map(e => e.id)
  );

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 80) return 'default';
    if (score >= 60) return 'secondary';
    return 'destructive';
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-green-500';
      default: return 'text-muted-foreground';
    }
  };

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'high': return <AlertTriangle className="h-4 w-4" />;
      case 'medium': return <Target className="h-4 w-4" />;
      case 'low': return <CheckCircle className="h-4 w-4" />;
      default: return null;
    }
  };

  const handleEnhancementToggle = (enhancementId: string) => {
    setSelectedEnhancements(prev =>
      prev.includes(enhancementId)
        ? prev.filter(id => id !== enhancementId)
        : [...prev, enhancementId]
    );
  };

  const handleApplySelected = () => {
    const selected = enhancements.filter(e => selectedEnhancements.includes(e.id));
    onApplyEnhancements(selected);
  };

  const groupedEnhancements = enhancements.reduce((acc, enhancement) => {
    if (!acc[enhancement.section]) {
      acc[enhancement.section] = [];
    }
    acc[enhancement.section]!.push(enhancement);
    return acc;
  }, {} as Record<string, Enhancement[]>);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Overall Score */}
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Resume Analysis Results
          </CardTitle>
          <CardDescription>
            Comprehensive analysis of your resume's effectiveness and ATS compatibility
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Overall Score */}
            <div className="text-center">
              <div className="relative w-24 h-24 mx-auto mb-3">
                <Progress
                  value={analysis.overallScore}
                  className="w-full h-full rounded-full"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={cn("text-2xl font-bold", getScoreColor(analysis.overallScore))}>
                    {analysis.overallScore}
                  </span>
                </div>
              </div>
              <h3 className="font-semibold">Overall Score</h3>
              <Badge variant={getScoreBadgeVariant(analysis.overallScore)}>
                {analysis.overallScore >= 80 ? 'Excellent' :
                 analysis.overallScore >= 60 ? 'Good' : 'Needs Improvement'}
              </Badge>
            </div>

            {/* ATS Score */}
            <div className="text-center">
              <div className="relative w-24 h-24 mx-auto mb-3">
                <Progress
                  value={analysis.atsOptimization.score}
                  className="w-full h-full rounded-full"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={cn("text-2xl font-bold", getScoreColor(analysis.atsOptimization.score))}>
                    {analysis.atsOptimization.score}
                  </span>
                </div>
              </div>
              <h3 className="font-semibold">ATS Compatibility</h3>
              <Badge variant={getScoreBadgeVariant(analysis.atsOptimization.score)}>
                {analysis.atsOptimization.score >= 80 ? 'ATS-Ready' : 'Needs Work'}
              </Badge>
            </div>

            {/* Enhancements Available */}
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-3 flex items-center justify-center bg-primary/10 rounded-full">
                <Zap className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold">Enhancements</h3>
              <Badge variant="outline">
                {enhancements.length} Suggestions
              </Badge>
            </div>

            {/* High Impact Items */}
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-3 flex items-center justify-center bg-red-100 rounded-full">
                <AlertTriangle className="h-8 w-8 text-red-500" />
              </div>
              <h3 className="font-semibold">Priority Items</h3>
              <Badge variant="destructive">
                {enhancements.filter(e => e.impact === 'high').length} High Impact
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Analysis */}
      <Tabs defaultValue="sections" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="sections">Section Analysis</TabsTrigger>
          <TabsTrigger value="ats">ATS Optimization</TabsTrigger>
          <TabsTrigger value="enhancements">Enhancements</TabsTrigger>
        </TabsList>

        {/* Section Analysis */}
        <TabsContent value="sections" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(analysis.sections).map(([section, data]) => (
              <Card key={section}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="capitalize">{section}</span>
                    <Badge variant={getScoreBadgeVariant(data.score)}>
                      {data.score}/100
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Progress value={data.score} />

                    {data.strengths.length > 0 && (
                      <div>
                        <h4 className="font-medium text-green-600 mb-2 flex items-center gap-2">
                          <CheckCircle className="h-4 w-4" />
                          Strengths
                        </h4>
                        <ul className="text-sm space-y-1">
                          {data.strengths.map((strength, index) => (
                            <li key={index} className="text-muted-foreground">• {strength}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {data.improvements.length > 0 && (
                      <div>
                        <h4 className="font-medium text-yellow-600 mb-2 flex items-center gap-2">
                          <Target className="h-4 w-4" />
                          Improvements
                        </h4>
                        <ul className="text-sm space-y-1">
                          {data.improvements.map((improvement, index) => (
                            <li key={index} className="text-muted-foreground">• {improvement}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* ATS Optimization */}
        <TabsContent value="ats" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Keywords Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-green-600 mb-2">Found Keywords</h4>
                  <div className="flex flex-wrap gap-2">
                    {analysis.atsOptimization.keywords.found.map((keyword, index) => (
                      <Badge key={index} variant="outline" className="text-green-600">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-red-600 mb-2">Missing Keywords</h4>
                  <div className="flex flex-wrap gap-2">
                    {analysis.atsOptimization.keywords.missing.map((keyword, index) => (
                      <Badge key={index} variant="outline" className="text-red-600">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-blue-600 mb-2">Suggested Keywords</h4>
                  <div className="flex flex-wrap gap-2">
                    {analysis.atsOptimization.keywords.suggestions.map((keyword, index) => (
                      <Badge key={index} variant="outline" className="text-blue-600">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Formatting Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Formatting Score</span>
                    <Badge variant={getScoreBadgeVariant(analysis.atsOptimization.formatting.score)}>
                      {analysis.atsOptimization.formatting.score}/100
                    </Badge>
                  </div>
                  <Progress value={analysis.atsOptimization.formatting.score} />

                  {analysis.atsOptimization.formatting.issues.length > 0 && (
                    <div>
                      <h4 className="font-medium text-yellow-600 mb-2">Formatting Issues</h4>
                      <ul className="text-sm space-y-1">
                        {analysis.atsOptimization.formatting.issues.map((issue, index) => (
                          <li key={index} className="text-muted-foreground">• {issue}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Enhancements */}
        <TabsContent value="enhancements" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-primary" />
                  AI Enhancement Suggestions
                </span>
                <Button
                  onClick={handleApplySelected}
                  disabled={selectedEnhancements.length === 0}
                >
                  Apply Selected ({selectedEnhancements.length})
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardTitle>
              <CardDescription>
                Select the enhancements you'd like to apply to your resume
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {Object.entries(groupedEnhancements).map(([section, sectionEnhancements]) => (
                  <div key={section}>
                    <h3 className="font-semibold text-lg mb-4 capitalize">{section}</h3>
                    <div className="space-y-4">
                      {sectionEnhancements.map((enhancement) => (
                        <Card key={enhancement.id} className="border-l-4 border-l-primary/20">
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              <Checkbox
                                checked={selectedEnhancements.includes(enhancement.id)}
                                onCheckedChange={() => handleEnhancementToggle(enhancement.id)}
                              />
                              <div className="flex-1 space-y-2">
                                <div className="flex items-center gap-2">
                                  <Badge
                                    variant="outline"
                                    className={cn("capitalize", getImpactColor(enhancement.impact))}
                                  >
                                    {getImpactIcon(enhancement.impact)}
                                    {enhancement.impact} Impact
                                  </Badge>
                                  <Badge variant="secondary" className="capitalize">
                                    {enhancement.type}
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">{enhancement.reason}</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                                  <div>
                                    <h5 className="font-medium text-red-600 mb-1">Original</h5>
                                    <p className="text-sm bg-red-50 p-2 rounded border">
                                      {enhancement.original}
                                    </p>
                                  </div>
                                  <div>
                                    <h5 className="font-medium text-green-600 mb-1">Enhanced</h5>
                                    <p className="text-sm bg-green-50 p-2 rounded border">
                                      {enhancement.enhanced}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
