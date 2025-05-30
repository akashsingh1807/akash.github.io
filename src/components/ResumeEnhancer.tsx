import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  FileText,
  Upload,
  Brain,
  Download,
  AlertCircle,
  Zap,
  Target,
  CheckCircle
} from 'lucide-react';
import { ResumeUploader } from './ResumeUploader';
import { ResumeAnalyzer } from './ResumeAnalyzer';
import { ResumePreview } from './ResumePreview';
import { ResumeTemplates } from './ResumeTemplates';
import {
  ResumeData,
  ResumeAnalysis,
  Enhancement,
  ResumeProcessingState,
  ResumeTemplate
} from '@/types/resume';
import { useToast } from '@/hooks/use-toast';

export const ResumeEnhancer: React.FC = () => {
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [originalResumeData, setOriginalResumeData] = useState<ResumeData | null>(null);
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [enhancements, setEnhancements] = useState<Enhancement[]>([]);
  const [appliedEnhancements, setAppliedEnhancements] = useState<Enhancement[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<ResumeTemplate | null>(null);
  const [currentTab, setCurrentTab] = useState<string>('upload');
  const [processingState, setProcessingState] = useState<ResumeProcessingState>({
    step: 'upload',
    progress: 0,
    message: '',
    error: null
  });
  const { toast } = useToast();

  const handleFileUpload = async (file: File) => {
    setProcessingState({
      step: 'analyzing',
      progress: 10,
      message: 'Reading file content...',
      error: null
    });

    try {
      // Step 1: Extract text from file
      await new Promise(resolve => setTimeout(resolve, 800));
      setProcessingState({
        step: 'analyzing',
        progress: 25,
        message: 'Extracting text from document...',
        error: null
      });

      const text = await extractTextFromFile(file);

      // Step 2: Parse resume structure
      await new Promise(resolve => setTimeout(resolve, 600));
      setProcessingState({
        step: 'analyzing',
        progress: 45,
        message: 'Parsing resume structure...',
        error: null
      });

      const parsedData = await parseResumeText(text, file.name);
      setResumeData(parsedData);
      setOriginalResumeData(parsedData);

      // Step 3: AI Analysis
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProcessingState({
        step: 'analyzing',
        progress: 70,
        message: 'Running AI analysis...',
        error: null
      });

      const analysisResult = await analyzeResume(parsedData);
      setAnalysis(analysisResult.analysis);
      setEnhancements(analysisResult.enhancements);

      // Step 4: Complete
      await new Promise(resolve => setTimeout(resolve, 500));
      setProcessingState({
        step: 'preview',
        progress: 100,
        message: 'Analysis complete!',
        error: null
      });

      // Auto-advance to analyze tab
      setCurrentTab('analyze');

      toast({
        title: "Resume Analyzed Successfully!",
        description: `Found ${analysisResult.enhancements.length} enhancement opportunities with an overall score of ${analysisResult.analysis.overallScore}/100.`,
      });

    } catch (error) {
      setProcessingState({
        step: 'upload',
        progress: 0,
        message: '',
        error: error instanceof Error ? error.message : 'Failed to process resume'
      });

      toast({
        title: "Analysis Failed",
        description: "Please try uploading your resume again.",
        variant: "destructive"
      });
    }
  };

  const handleApplyEnhancements = async (selectedEnhancements: Enhancement[]) => {
    if (!resumeData) return;

    setProcessingState({
      step: 'enhancing',
      progress: 20,
      message: 'Preparing enhancements...',
      error: null
    });

    try {
      // Step 1: Validate enhancements
      await new Promise(resolve => setTimeout(resolve, 500));
      setProcessingState({
        step: 'enhancing',
        progress: 40,
        message: 'Applying content improvements...',
        error: null
      });

      // Step 2: Apply enhancements
      await new Promise(resolve => setTimeout(resolve, 800));
      const enhancedData = await applyEnhancements(resumeData, selectedEnhancements);
      setResumeData(enhancedData);
      setAppliedEnhancements(selectedEnhancements);

      // Step 3: Re-analyze enhanced resume
      setProcessingState({
        step: 'enhancing',
        progress: 70,
        message: 'Re-analyzing enhanced resume...',
        error: null
      });

      await new Promise(resolve => setTimeout(resolve, 600));
      const newAnalysis = await analyzeResume(enhancedData);
      setAnalysis(newAnalysis.analysis);

      // Step 4: Complete
      setProcessingState({
        step: 'preview',
        progress: 100,
        message: 'Enhancements applied successfully!',
        error: null
      });

      // Auto-advance to preview tab
      setCurrentTab('enhance');

      toast({
        title: "Resume Enhanced!",
        description: `Applied ${selectedEnhancements.length} improvements. New score: ${newAnalysis.analysis.overallScore}/100.`,
      });

    } catch (error) {
      toast({
        title: "Enhancement Failed",
        description: "Please try again or contact support.",
        variant: "destructive"
      });
    }
  };

  const handleDownload = async (format: 'pdf' | 'docx') => {
    if (!resumeData) return;

    setProcessingState({
      step: 'download',
      progress: 30,
      message: 'Preparing document...',
      error: null
    });

    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      setProcessingState({
        step: 'download',
        progress: 70,
        message: `Generating ${format.toUpperCase()} file...`,
        error: null
      });

      // File generation is now handled by the ResumeTemplates component
      console.log('Download initiated for format:', format);

      await new Promise(resolve => setTimeout(resolve, 500));
      setProcessingState({
        step: 'preview',
        progress: 100,
        message: 'Download complete!',
        error: null
      });

      toast({
        title: "Resume Downloaded!",
        description: `Your enhanced resume has been saved as ${format.toUpperCase()}.`,
      });

    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Please try again or contact support.",
        variant: "destructive"
      });
    }
  };

  const resetProcess = () => {
    setResumeData(null);
    setOriginalResumeData(null);
    setAnalysis(null);
    setEnhancements([]);
    setAppliedEnhancements([]);
    setSelectedTemplate(null);
    setCurrentTab('upload');
    setProcessingState({
      step: 'upload',
      progress: 0,
      message: '',
      error: null
    });
  };

  const handleTabChange = (value: string) => {
    setCurrentTab(value);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      {/* Header */}
      <div className="text-center space-y-6">
        <h1 className="text-4xl md:text-5xl font-bold flex items-center justify-center gap-3">
          <FileText className="h-10 w-10 md:h-12 md:w-12 text-primary" />
          AI Resume Enhancer
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Upload your resume and let AI analyze, enhance, and optimize it for better job opportunities.
          Get ATS-friendly formatting and industry-specific improvements.
        </p>
      </div>

      {/* Progress Indicator */}
      {processingState.step !== 'upload' && (
        <Card className="border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                <span className="font-medium">Processing Status</span>
              </div>
              <Badge variant={processingState.error ? 'destructive' : 'default'}>
                {processingState.step.charAt(0).toUpperCase() + processingState.step.slice(1)}
              </Badge>
            </div>
            <Progress value={processingState.progress} className="mb-2" />
            <p className="text-sm text-muted-foreground">{processingState.message}</p>
            {processingState.error && (
              <div className="flex items-center gap-2 mt-2 text-destructive">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">{processingState.error}</span>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Step Indicator */}
      <div className="flex items-center justify-center space-x-4 mb-8">
        {[
          { key: 'upload', label: 'Upload', icon: Upload, completed: !!resumeData },
          { key: 'analyze', label: 'Analyze', icon: Target, completed: !!analysis },
          { key: 'enhance', label: 'Enhance', icon: Zap, completed: appliedEnhancements.length > 0 },
          { key: 'download', label: 'Download', icon: Download, completed: false }
        ].map((step, index) => (
          <div key={step.key} className="flex items-center">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
              step.completed
                ? 'bg-green-500 border-green-500 text-white'
                : currentTab === step.key
                  ? 'border-primary text-primary'
                  : 'border-muted-foreground text-muted-foreground'
            }`}>
              {step.completed ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                <step.icon className="h-5 w-5" />
              )}
            </div>
            <span className={`ml-2 text-sm font-medium ${
              currentTab === step.key ? 'text-primary' : 'text-muted-foreground'
            }`}>
              {step.label}
            </span>
            {index < 3 && (
              <div className={`w-8 h-0.5 mx-4 ${
                step.completed ? 'bg-green-500' : 'bg-muted-foreground/30'
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Main Content */}
      <Tabs value={currentTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-12">
          <TabsTrigger value="upload" className="flex items-center gap-2 py-3">
            <Upload className="h-4 w-4" />
            Upload
          </TabsTrigger>
          <TabsTrigger value="analyze" disabled={!resumeData} className="flex items-center gap-2 py-3">
            <Target className="h-4 w-4" />
            Analyze
          </TabsTrigger>
          <TabsTrigger value="enhance" disabled={!analysis} className="flex items-center gap-2 py-3">
            <Zap className="h-4 w-4" />
            Enhance
          </TabsTrigger>
          <TabsTrigger value="download" disabled={!resumeData} className="flex items-center gap-2 py-3">
            <Download className="h-4 w-4" />
            Download
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="mt-0">
          <ResumeUploader onFileUpload={handleFileUpload} />
        </TabsContent>

        <TabsContent value="analyze" className="mt-0">
          {analysis && (
            <ResumeAnalyzer
              analysis={analysis}
              enhancements={enhancements}
              onApplyEnhancements={handleApplyEnhancements}
            />
          )}
        </TabsContent>

        <TabsContent value="enhance" className="mt-0">
          {resumeData && originalResumeData && (
            <ResumePreview
              originalData={originalResumeData}
              enhancedData={resumeData}
              enhancements={enhancements}
              appliedEnhancements={appliedEnhancements}
              onTemplateSelect={setSelectedTemplate}
            />
          )}
        </TabsContent>

        <TabsContent value="download" className="mt-0">
          <ResumeTemplates
            selectedTemplate={selectedTemplate}
            onTemplateSelect={setSelectedTemplate}
            onDownload={handleDownload}
            resumeData={resumeData}
            analysis={analysis}
            appliedEnhancements={appliedEnhancements}
          />
        </TabsContent>
      </Tabs>

      {/* Reset Button */}
      {resumeData && (
        <div className="flex justify-center pt-8">
          <Button variant="outline" onClick={resetProcess} size="lg">
            Start Over
          </Button>
        </div>
      )}
    </div>
  );
};

// Helper functions (to be implemented with actual AI21 Studio integration)
const extractTextFromFile = async (_file: File): Promise<string> => {
  // Mock implementation - replace with actual PDF/DOC text extraction
  return `John Doe
Software Engineer
john.doe@email.com | (555) 123-4567 | LinkedIn: linkedin.com/in/johndoe

SUMMARY
Experienced software engineer with 5 years of experience in web development.

EXPERIENCE
Software Engineer | Tech Company | 2020-Present
• Developed web applications using React and Node.js
• Collaborated with cross-functional teams
• Improved application performance by 30%

EDUCATION
Bachelor of Science in Computer Science | University Name | 2020

SKILLS
JavaScript, React, Node.js, Python, SQL`;
};

const parseResumeText = async (_text: string, _fileName: string): Promise<ResumeData> => {
  // Enhanced mock implementation with more realistic data
  const sampleNames = ["Alex Johnson", "Sarah Chen", "Michael Rodriguez", "Emily Davis", "David Kim"];
  const sampleCompanies = ["TechCorp", "InnovateSoft", "DataDyne", "CloudFirst", "NextGen Solutions"];
  const sampleSkills = [
    ["JavaScript", "React", "Node.js", "TypeScript", "AWS", "MongoDB", "Git", "Docker"],
    ["Python", "Django", "PostgreSQL", "Redis", "Kubernetes", "Jenkins", "Linux", "REST APIs"],
    ["Java", "Spring Boot", "MySQL", "Apache Kafka", "Microservices", "Maven", "JUnit", "Agile"],
    ["C#", ".NET Core", "SQL Server", "Azure", "Entity Framework", "ASP.NET", "Unit Testing", "CI/CD"]
  ];

  const randomName = sampleNames[Math.floor(Math.random() * sampleNames.length)] || "John Doe";
  const randomCompany = sampleCompanies[Math.floor(Math.random() * sampleCompanies.length)] || "Tech Company";
  const randomSkillSet = sampleSkills[Math.floor(Math.random() * sampleSkills.length)] || ["JavaScript", "React", "Node.js"];

  return {
    personalInfo: {
      name: randomName,
      email: `${randomName.toLowerCase().replace(' ', '.')}@email.com`,
      phone: `(${Math.floor(Math.random() * 900) + 100}) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
      location: "San Francisco, CA",
      linkedin: `linkedin.com/in/${randomName.toLowerCase().replace(' ', '')}`
    },
    summary: `Experienced software engineer with ${Math.floor(Math.random() * 8) + 2} years of experience in full-stack development. Passionate about building scalable applications and leading technical initiatives.`,
    experience: [
      {
        id: "1",
        company: randomCompany,
        position: "Senior Software Engineer",
        location: "San Francisco, CA",
        startDate: "2021",
        endDate: "Present",
        current: true,
        description: [
          `Developed and maintained web applications using ${randomSkillSet[0]} and ${randomSkillSet[1]}`,
          "Led a team of 4 developers in implementing new features",
          `Improved application performance by ${Math.floor(Math.random() * 40) + 20}% through optimization`,
          "Collaborated with product managers and designers on user experience improvements"
        ]
      },
      {
        id: "2",
        company: "Previous Company",
        position: "Software Engineer",
        location: "San Francisco, CA",
        startDate: "2019",
        endDate: "2021",
        current: false,
        description: [
          "Built RESTful APIs and microservices architecture",
          "Implemented automated testing and CI/CD pipelines",
          "Mentored junior developers and conducted code reviews"
        ]
      }
    ],
    education: [{
      id: "1",
      institution: "University of California",
      degree: "Bachelor of Science",
      field: "Computer Science",
      graduationDate: "2019",
      gpa: "3.7"
    }],
    skills: randomSkillSet,
    certifications: [
      {
        id: "1",
        name: "AWS Certified Solutions Architect",
        issuer: "Amazon Web Services",
        date: "2022",
        expirationDate: "2025"
      }
    ],
    projects: [
      {
        id: "1",
        name: "E-commerce Platform",
        description: "Built a full-stack e-commerce platform with real-time inventory management",
        technologies: randomSkillSet.slice(0, 4),
        url: "github.com/example/ecommerce"
      }
    ]
  };
};

const analyzeResume = async (data: ResumeData) => {
  // Enhanced mock implementation with dynamic scoring based on resume content
  const baseScore = Math.floor(Math.random() * 30) + 60; // 60-90 range
  const skillsCount = data.skills.length;
  const experienceCount = data.experience.length;
  const hasProjects = data.projects && data.projects.length > 0;
  const hasCertifications = data.certifications && data.certifications.length > 0;

  // Calculate dynamic scores
  const summaryScore = Math.min(95, baseScore + (data.summary.length > 100 ? 10 : 0));
  const experienceScore = Math.min(95, baseScore + (experienceCount * 5) + (hasProjects ? 10 : 0));
  const skillsScore = Math.min(95, baseScore + Math.min(skillsCount * 2, 20));
  const educationScore = Math.min(95, baseScore + (data.education[0]?.gpa ? 10 : 0) + (hasCertifications ? 15 : 0));

  const overallScore = Math.floor((summaryScore + experienceScore + skillsScore + educationScore) / 4);

  const analysis: ResumeAnalysis = {
    overallScore,
    sections: {
      summary: {
        score: summaryScore,
        strengths: summaryScore > 80 ?
          ["Clear and compelling narrative", "Quantified experience", "Industry-relevant keywords"] :
          ["Clear structure", "Professional tone"],
        improvements: summaryScore < 75 ?
          ["Add specific achievements", "Include quantified results", "Highlight unique value proposition"] :
          ["Consider adding leadership examples", "Mention specific technologies"]
      },
      experience: {
        score: experienceScore,
        strengths: experienceScore > 80 ?
          ["Strong action verbs", "Quantified achievements", "Progressive responsibility", "Relevant experience"] :
          ["Relevant experience", "Clear job progression"],
        improvements: experienceScore < 75 ?
          ["Add quantified achievements", "Use stronger action verbs", "Include more technical details", "Show impact and results"] :
          ["Consider adding leadership examples", "Highlight cross-functional collaboration"]
      },
      skills: {
        score: skillsScore,
        strengths: skillsScore > 80 ?
          ["Comprehensive technical skills", "Industry-relevant technologies", "Good mix of hard and soft skills"] :
          ["Relevant technical skills", "Current technologies"],
        improvements: skillsScore < 75 ?
          ["Organize by categories", "Add proficiency levels", "Include more trending technologies", "Add soft skills"] :
          ["Consider adding emerging technologies", "Group by expertise level"]
      },
      education: {
        score: educationScore,
        strengths: educationScore > 80 ?
          ["Strong academic background", "Relevant degree", "Additional certifications"] :
          ["Relevant degree", "Clear educational background"],
        improvements: educationScore < 75 ?
          ["Add relevant coursework", "Include academic achievements", "Consider adding certifications"] :
          ["Consider adding recent training", "Highlight relevant projects"]
      }
    },
    atsOptimization: {
      score: Math.floor(Math.random() * 25) + 65, // 65-90 range
      keywords: {
        found: data.skills.slice(0, Math.floor(data.skills.length * 0.7)),
        missing: ["Agile", "Scrum", "DevOps", "Cloud Computing", "Machine Learning"].filter(skill =>
          !data.skills.includes(skill)
        ).slice(0, 3),
        suggestions: ["Full-stack Development", "API Design", "Database Management", "System Architecture", "Team Leadership"].slice(0, 3)
      },
      formatting: {
        score: Math.floor(Math.random() * 20) + 75, // 75-95 range
        issues: [
          "Use consistent bullet points",
          "Improve section spacing",
          "Standardize date formats",
          "Optimize for ATS scanning"
        ].slice(0, Math.floor(Math.random() * 3) + 1)
      }
    },
    suggestions: []
  };

  // Generate dynamic enhancements based on analysis
  const enhancements: Enhancement[] = [];
  let enhancementId = 1;

  // Summary enhancements
  if (summaryScore < 85) {
    enhancements.push({
      id: (enhancementId++).toString(),
      type: "content",
      section: "summary",
      original: data.summary,
      enhanced: `Results-driven ${data.experience[0]?.position || 'Professional'} with ${Math.floor(Math.random() * 8) + 3}+ years of experience in ${data.skills.slice(0, 3).join(', ')}, delivering measurable business impact through innovative solutions and technical leadership.`,
      reason: "Enhanced with quantified experience and specific technical skills",
      impact: "high",
      applied: false
    });
  }

  // Skills enhancements
  if (skillsScore < 80) {
    const additionalSkills = ["Git", "Agile", "REST APIs", "Microservices", "Docker", "CI/CD"].filter(skill =>
      !data.skills.includes(skill)
    ).slice(0, 3);

    enhancements.push({
      id: (enhancementId++).toString(),
      type: "keyword",
      section: "skills",
      original: data.skills.join(", "),
      enhanced: [...data.skills, ...additionalSkills].join(", "),
      reason: "Added industry-standard keywords to improve ATS compatibility",
      impact: "high",
      applied: false
    });
  }

  // Experience enhancements
  if (experienceScore < 80 && data.experience.length > 0) {
    const firstJob = data.experience[0];
    if (firstJob) {
      const enhancedDescription = firstJob.description.map(desc => {
        if (!desc.includes('%') && !desc.includes('$') && Math.random() > 0.5) {
          return `${desc}, resulting in ${Math.floor(Math.random() * 40) + 15}% improvement in efficiency`;
        }
        return desc.replace(/^[a-z]/, (match) => match.toUpperCase()).replace(/^(Developed|Built|Created|Implemented)/,
          () => ['Architected', 'Engineered', 'Designed', 'Spearheaded'][Math.floor(Math.random() * 4)] || 'Enhanced'
        );
      });

      enhancements.push({
        id: (enhancementId++).toString(),
        type: "content",
        section: "experience",
        original: firstJob.description.join("; "),
        enhanced: enhancedDescription.join("; "),
        reason: "Strengthened action verbs and added quantified achievements",
        impact: "medium",
        applied: false
      });
    }
  }

  // Format enhancements
  if (analysis.atsOptimization.formatting.score < 85) {
    enhancements.push({
      id: (enhancementId++).toString(),
      type: "format",
      section: "overall",
      original: "Current formatting",
      enhanced: "ATS-optimized formatting with consistent bullet points, proper spacing, and keyword placement",
      reason: "Improved formatting for better ATS scanning and readability",
      impact: "medium",
      applied: false
    });
  }

  // Education enhancements
  if (educationScore < 80 && data.education.length > 0) {
    const education = data.education[0];
    if (education) {
      enhancements.push({
        id: (enhancementId++).toString(),
        type: "content",
        section: "education",
        original: `${education.degree} in ${education.field}`,
        enhanced: `${education.degree} in ${education.field} - Relevant Coursework: Data Structures, Algorithms, Software Engineering, Database Systems`,
        reason: "Added relevant coursework to strengthen educational background",
        impact: "low",
        applied: false
      });
    }
  }

  return { analysis, enhancements };
};

const applyEnhancements = async (data: ResumeData, enhancements: Enhancement[]): Promise<ResumeData> => {
  // Mock implementation - apply selected enhancements to resume data
  const enhancedData = { ...data };

  enhancements.forEach(enhancement => {
    if (enhancement.section === 'summary') {
      enhancedData.summary = enhancement.enhanced;
    }
    // Apply other enhancements based on section
  });

  return enhancedData;
};

// Remove the old generateResumeFile function - it's now handled by the FileGenerationService
