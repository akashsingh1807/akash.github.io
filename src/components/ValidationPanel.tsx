import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  RefreshCw, 
  TrendingUp,
  Shield,
  Target,
  Lightbulb
} from 'lucide-react';
import { useResumeBuilder } from '@/contexts/ResumeBuilderContext';
import { FormValidation } from '@/types/resumeBuilder';

export const ValidationPanel: React.FC = () => {
  const { actions } = useResumeBuilder();
  const [validation, setValidation] = useState<FormValidation>({ isValid: true, errors: {}, warnings: {} });
  const [isValidating, setIsValidating] = useState(false);

  const runValidation = async () => {
    setIsValidating(true);
    // Add a small delay to show loading state
    await new Promise(resolve => setTimeout(resolve, 500));
    const result = actions.validateForm();
    setValidation(result);
    setIsValidating(false);
  };

  useEffect(() => {
    runValidation();
  }, []);

  const errorCount = Object.keys(validation.errors).length;
  const warningCount = Object.keys(validation.warnings).length;
  const totalIssues = errorCount + warningCount;

  // Calculate completion score
  const maxPossibleIssues = 20; // Estimated max issues for scoring
  const completionScore = Math.max(0, Math.min(100, ((maxPossibleIssues - totalIssues) / maxPossibleIssues) * 100));

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 90) return { label: 'Excellent', variant: 'default' as const };
    if (score >= 80) return { label: 'Good', variant: 'secondary' as const };
    if (score >= 60) return { label: 'Fair', variant: 'outline' as const };
    return { label: 'Needs Work', variant: 'destructive' as const };
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Resume Validation
          </CardTitle>
          <p className="text-muted-foreground">
            Comprehensive analysis of your resume quality, ATS compatibility, and completeness.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Validation Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className={`border-2 ${validation.isValid ? 'border-green-200 bg-green-50 dark:bg-green-950' : 'border-red-200 bg-red-50 dark:bg-red-950'}`}>
              <CardContent className="p-4 text-center">
                {validation.isValid ? (
                  <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                ) : (
                  <XCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                )}
                <div className="font-semibold">
                  {validation.isValid ? 'Valid Resume' : 'Issues Found'}
                </div>
                <div className="text-sm text-muted-foreground">
                  {validation.isValid ? 'Ready for submission' : `${errorCount} error${errorCount !== 1 ? 's' : ''} to fix`}
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-blue-200 bg-blue-50 dark:bg-blue-950">
              <CardContent className="p-4 text-center">
                <Target className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <div className="font-semibold">Quality Score</div>
                <div className={`text-2xl font-bold ${getScoreColor(completionScore)}`}>
                  {Math.round(completionScore)}%
                </div>
                <Badge {...getScoreBadge(completionScore)} className="mt-1">
                  {getScoreBadge(completionScore).label}
                </Badge>
              </CardContent>
            </Card>

            <Card className="border-2 border-amber-200 bg-amber-50 dark:bg-amber-950">
              <CardContent className="p-4 text-center">
                <TrendingUp className="h-8 w-8 text-amber-500 mx-auto mb-2" />
                <div className="font-semibold">Optimization</div>
                <div className="text-sm text-muted-foreground">
                  {warningCount} suggestion{warningCount !== 1 ? 's' : ''}
                </div>
                <div className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                  ATS & Impact
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Resume Completeness</span>
              <span className="text-sm text-muted-foreground">{Math.round(completionScore)}%</span>
            </div>
            <Progress value={completionScore} className="h-2" />
          </div>

          {/* Refresh Button */}
          <div className="flex justify-center">
            <Button 
              onClick={runValidation} 
              disabled={isValidating}
              variant="outline"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isValidating ? 'animate-spin' : ''}`} />
              {isValidating ? 'Validating...' : 'Refresh Validation'}
            </Button>
          </div>

          {/* Errors Section */}
          {errorCount > 0 && (
            <Card className="border-red-200 bg-red-50 dark:bg-red-950">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-300">
                  <XCircle className="h-5 w-5" />
                  Critical Issues ({errorCount})
                </CardTitle>
                <p className="text-sm text-red-600 dark:text-red-400">
                  These issues must be fixed before your resume is ready for submission.
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(validation.errors).map(([key, message]) => (
                    <div key={key} className="flex items-start gap-3 p-3 bg-white dark:bg-red-900 rounded-lg">
                      <XCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="font-medium text-red-900 dark:text-red-100">
                          {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </div>
                        <div className="text-sm text-red-700 dark:text-red-300">{message}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Warnings Section */}
          {warningCount > 0 && (
            <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-amber-700 dark:text-amber-300">
                  <AlertTriangle className="h-5 w-5" />
                  Optimization Suggestions ({warningCount})
                </CardTitle>
                <p className="text-sm text-amber-600 dark:text-amber-400">
                  These suggestions can help improve your resume's impact and ATS compatibility.
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(validation.warnings).map(([key, message]) => (
                    <div key={key} className="flex items-start gap-3 p-3 bg-white dark:bg-amber-900 rounded-lg">
                      <Lightbulb className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="font-medium text-amber-900 dark:text-amber-100">
                          {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </div>
                        <div className="text-sm text-amber-700 dark:text-amber-300">{message}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Success State */}
          {validation.isValid && errorCount === 0 && warningCount === 0 && (
            <Card className="border-green-200 bg-green-50 dark:bg-green-950">
              <CardContent className="p-6 text-center">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-2">
                  Perfect Resume! 🎉
                </h3>
                <p className="text-green-700 dark:text-green-300">
                  Your resume passes all validation checks and is ready for submission. 
                  Great job on creating a comprehensive and professional resume!
                </p>
              </CardContent>
            </Card>
          )}

          {/* Validation Tips */}
          <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
            <CardContent className="p-4">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-3 flex items-center gap-2">
                <Lightbulb className="h-4 w-4" />
                Validation Tips
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800 dark:text-blue-200">
                <ul className="space-y-2">
                  <li>• <strong>Red errors</strong> must be fixed for a valid resume</li>
                  <li>• <strong>Yellow warnings</strong> are suggestions for improvement</li>
                  <li>• <strong>Quality score</strong> reflects overall resume completeness</li>
                </ul>
                <ul className="space-y-2">
                  <li>• Use action verbs to improve ATS compatibility</li>
                  <li>• Include quantifiable results when possible</li>
                  <li>• Keep descriptions concise but informative</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};
