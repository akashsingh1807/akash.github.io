import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import {
  FileText,
  Lightbulb,
  CheckCircle,
  AlertCircle,
  Wand2,
  Copy,
  RotateCcw
} from 'lucide-react';
import { useResumeBuilder } from '@/contexts/ResumeBuilderContext';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const sampleSummaries = [
  "Results-driven Software Engineer with 5+ years of experience developing scalable web applications using modern JavaScript frameworks. Proven track record of delivering high-quality solutions that improve user experience and drive business growth. Passionate about clean code, agile methodologies, and continuous learning.",

  "Experienced Marketing Professional with 7+ years of expertise in digital marketing, brand management, and campaign optimization. Successfully increased brand awareness by 150% and generated $2M+ in revenue through data-driven marketing strategies. Skilled in SEO, social media marketing, and marketing automation.",

  "Dedicated Project Manager with 6+ years of experience leading cross-functional teams and delivering complex projects on time and within budget. Expert in Agile and Scrum methodologies with a proven ability to improve team productivity by 40%. Strong communication and stakeholder management skills.",

  "Compassionate Registered Nurse with 4+ years of experience providing exceptional patient care in fast-paced hospital environments. Skilled in patient assessment, medication administration, and collaborative healthcare delivery. Consistently maintained 98% patient satisfaction scores while managing 15+ patients per shift.",

  "Dynamic Sales Professional with 8+ years of experience exceeding sales targets by 30%+ annually. Expert in relationship building, consultative selling, and CRM management. Successfully managed key accounts worth $5M+ and mentored junior sales team members to achieve top performance.",

  "Passionate Elementary Teacher with 6+ years of experience creating engaging learning environments for diverse student populations. Developed innovative curriculum that improved student reading scores by 25%. Skilled in classroom management, parent communication, and educational technology integration.",

  "Detail-oriented Accountant with 5+ years of experience in financial analysis, budgeting, and regulatory compliance. Managed accounts payable/receivable for companies with $10M+ annual revenue. Implemented cost-saving measures that reduced operational expenses by 15% while maintaining accuracy standards.",

  "Customer-focused Service Representative with 3+ years of experience resolving complex issues and building lasting client relationships. Consistently maintained 95%+ customer satisfaction scores while handling 100+ inquiries daily. Skilled in conflict resolution, product knowledge, and multi-channel support."
];

export const SummaryStep: React.FC = () => {
  const { state, actions } = useResumeBuilder();
  const { toast } = useToast();
  const [selectedSample, setSelectedSample] = useState<number | null>(null);

  const summary = state.resumeData.summary || '';
  const wordCount = summary.trim().split(/\s+/).filter(word => word.length > 0).length;
  const charCount = summary.length;
  const isComplete = summary.length >= 50 && wordCount >= 10;

  const handleSummaryChange = (value: string) => {
    actions.updateSummary(value);
  };

  const handleUseSample = (sampleText: string, index: number) => {
    setSelectedSample(index);
    handleSummaryChange(sampleText);
    toast({
      title: "Sample Applied",
      description: "You can now customize this summary to match your experience.",
    });
  };

  const handleCopySample = async (sampleText: string) => {
    try {
      await navigator.clipboard.writeText(sampleText);
      toast({
        title: "Copied to Clipboard",
        description: "Sample summary has been copied. You can paste it in the text area.",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Please manually copy the text.",
        variant: "destructive"
      });
    }
  };

  const handleClearSummary = () => {
    handleSummaryChange('');
    setSelectedSample(null);
  };

  const getWordCountColor = () => {
    if (wordCount < 10) return 'text-red-500';
    if (wordCount < 30) return 'text-amber-500';
    return 'text-green-500';
  };

  const getCharCountColor = () => {
    if (charCount < 50) return 'text-red-500';
    if (charCount < 150) return 'text-amber-500';
    return 'text-green-500';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Professional Summary
          </CardTitle>
          <p className="text-muted-foreground">
            Write a compelling summary that highlights your key achievements, skills, and career goals.
            This is often the first thing recruiters read.
          </p>
        </CardHeader>
      </Card>

      {/* Progress Indicator */}
      <Card className="border-primary/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isComplete ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <AlertCircle className="h-5 w-5 text-amber-500" />
              )}
              <span className="font-medium">
                Summary {isComplete ? "Complete" : "In Progress"}
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <span className={getWordCountColor()}>
                {wordCount} words
              </span>
              <span className={getCharCountColor()}>
                {charCount} characters
              </span>
              <Badge variant={isComplete ? "default" : "secondary"}>
                {isComplete ? "Ready" : "Needs Work"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Editor */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <Label htmlFor="summary" className="text-base font-semibold">
              Your Professional Summary
            </Label>
            <div className="flex items-center gap-2">
              {summary && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearSummary}
                  className="text-red-600 hover:text-red-700"
                >
                  <RotateCcw className="h-4 w-4 mr-1" />
                  Clear
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            id="summary"
            placeholder="Write a compelling professional summary that highlights your experience, key skills, and career achievements. Focus on what makes you unique and valuable to potential employers..."
            value={summary}
            onChange={(e) => handleSummaryChange(e.target.value)}
            className={cn(
              "min-h-[150px] resize-none",
              !isComplete && summary && "border-amber-300",
              isComplete && "border-green-300"
            )}
          />

          {/* Guidelines */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className={cn(
              "flex items-center gap-2 p-2 rounded",
              wordCount >= 10 ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
            )}>
              {wordCount >= 10 ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              <span>At least 10 words</span>
            </div>

            <div className={cn(
              "flex items-center gap-2 p-2 rounded",
              charCount >= 50 ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
            )}>
              {charCount >= 50 ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              <span>At least 50 characters</span>
            </div>

            <div className={cn(
              "flex items-center gap-2 p-2 rounded",
              wordCount <= 100 ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"
            )}>
              {wordCount <= 100 ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              <span>Keep under 100 words</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sample Summaries */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-amber-500" />
            Sample Summaries for Inspiration
          </CardTitle>
          <p className="text-muted-foreground">
            Use these examples as inspiration or starting points. Customize them to match your experience.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {sampleSummaries.map((sample, index) => (
            <Card
              key={index}
              className={cn(
                "transition-all duration-200 hover:shadow-md cursor-pointer",
                selectedSample === index && "ring-2 ring-primary border-primary"
              )}
            >
              <CardContent className="p-4">
                <p className="text-sm leading-relaxed mb-3">{sample}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{sample.split(' ').length} words</span>
                    <span>•</span>
                    <span>{sample.length} characters</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopySample(sample)}
                    >
                      <Copy className="h-4 w-4 mr-1" />
                      Copy
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUseSample(sample, index)}
                    >
                      <Wand2 className="h-4 w-4 mr-1" />
                      Use This
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>

      {/* Writing Tips */}
      <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
        <CardContent className="p-4">
          <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-3 flex items-center gap-2">
            <Lightbulb className="h-4 w-4" />
            Writing Tips for a Strong Summary
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800 dark:text-blue-200">
            <ul className="space-y-2">
              <li>• Start with your years of experience and job title</li>
              <li>• Include 2-3 key skills or areas of expertise</li>
              <li>• Mention specific achievements with numbers when possible</li>
              <li>• Use action words like "developed," "led," "improved"</li>
            </ul>
            <ul className="space-y-2">
              <li>• Keep it concise (2-4 sentences, 50-100 words)</li>
              <li>• Tailor it to the job you're applying for</li>
              <li>• Avoid generic phrases like "hard worker"</li>
              <li>• End with your career goal or what you bring to employers</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
