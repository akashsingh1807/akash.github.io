import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Code,
  Plus,
  X,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  Search
} from 'lucide-react';
import { useResumeBuilder } from '@/contexts/ResumeBuilderContext';
import { useToast } from '@/hooks/use-toast';

const skillCategories = [
  'Technical Skills',
  'Software & Tools',
  'Communication',
  'Leadership & Management',
  'Creative & Design',
  'Sales & Marketing',
  'Finance & Analytics',
  'Healthcare & Medical',
  'Education & Training',
  'Industry-Specific',
  'Other'
];

const commonSkills = {
  'Technical Skills': ['Microsoft Office', 'Excel', 'PowerPoint', 'Google Workspace', 'Data Analysis', 'SQL', 'Python', 'JavaScript', 'HTML/CSS', 'Adobe Creative Suite'],
  'Software & Tools': ['Salesforce', 'HubSpot', 'Slack', 'Zoom', 'Trello', 'Asana', 'Monday.com', 'QuickBooks', 'SAP', 'Oracle'],
  'Communication': ['Public Speaking', 'Written Communication', 'Presentation Skills', 'Interpersonal Skills', 'Active Listening', 'Negotiation', 'Customer Service', 'Multilingual'],
  'Leadership & Management': ['Team Leadership', 'Project Management', 'Strategic Planning', 'Budget Management', 'Performance Management', 'Conflict Resolution', 'Mentoring', 'Change Management'],
  'Creative & Design': ['Graphic Design', 'Web Design', 'Photography', 'Video Editing', 'Content Creation', 'Brand Development', 'UI/UX Design', 'Adobe Photoshop', 'Illustrator', 'InDesign'],
  'Sales & Marketing': ['Digital Marketing', 'Social Media Marketing', 'SEO/SEM', 'Lead Generation', 'Sales Strategy', 'Market Research', 'Email Marketing', 'Content Marketing', 'CRM Management'],
  'Finance & Analytics': ['Financial Analysis', 'Budgeting', 'Forecasting', 'Risk Management', 'Investment Analysis', 'Accounting', 'Tax Preparation', 'Financial Reporting', 'Excel Modeling'],
  'Healthcare & Medical': ['Patient Care', 'Medical Terminology', 'HIPAA Compliance', 'Electronic Health Records', 'Clinical Research', 'Medical Coding', 'Pharmacy Management', 'Healthcare Administration'],
  'Education & Training': ['Curriculum Development', 'Lesson Planning', 'Student Assessment', 'Classroom Management', 'Educational Technology', 'Learning Management Systems', 'Training Development'],
  'Industry-Specific': ['Retail Management', 'Food Service', 'Manufacturing', 'Construction', 'Real Estate', 'Legal Research', 'Event Planning', 'Supply Chain', 'Quality Assurance', 'Logistics'],
  'Other': ['Problem Solving', 'Critical Thinking', 'Time Management', 'Adaptability', 'Attention to Detail', 'Multitasking', 'Research Skills', 'Documentation', 'Process Improvement']
};

export const SkillsStep: React.FC = () => {
  const { state, actions } = useResumeBuilder();
  const { toast } = useToast();
  const [newSkill, setNewSkill] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Technical Skills');
  const [searchQuery, setSearchQuery] = useState('');

  const skills = state.resumeData.skills || [];
  const isStepComplete = skills.length > 0;

  const handleAddSkill = (skill: string) => {
    if (!skill.trim()) return;

    if (skills.includes(skill.trim())) {
      toast({
        title: "Skill Already Added",
        description: "This skill is already in your list.",
        variant: "destructive"
      });
      return;
    }

    actions.addSkill({ id: Date.now().toString(), name: skill.trim(), level: 'Intermediate', category: selectedCategory });
    setNewSkill('');

    toast({
      title: "Skill Added",
      description: `${skill} has been added to your skills.`,
    });
  };

  const handleRemoveSkill = (index: number) => {
    actions.removeSkill(index.toString());
    toast({
      title: "Skill Removed",
      description: "Skill has been removed from your list.",
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill(newSkill);
    }
  };

  const filteredCommonSkills = commonSkills[selectedCategory as keyof typeof commonSkills]?.filter(skill =>
    skill.toLowerCase().includes(searchQuery.toLowerCase()) && !skills.includes(skill)
  ) || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5 text-primary" />
            Skills & Competencies
          </CardTitle>
          <p className="text-muted-foreground">
            Add your professional skills, software proficiency, and core competencies. Include both technical and soft skills relevant to your career.
          </p>
        </CardHeader>
      </Card>

      {/* Progress Indicator */}
      <Card className="border-primary/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isStepComplete ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <AlertCircle className="h-5 w-5 text-amber-500" />
              )}
              <span className="font-medium">
                {skills.length} skill{skills.length !== 1 ? 's' : ''} added
              </span>
            </div>
            <Badge variant={isStepComplete ? "default" : "secondary"}>
              {isStepComplete ? "Complete" : "Add Skills"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Current Skills */}
      {skills.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Your Skills</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="flex items-center gap-2 px-3 py-1 text-sm"
                >
                  {skill}
                  <button
                    onClick={() => handleRemoveSkill(index)}
                    className="ml-1 hover:text-red-600 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add Skills */}
      <Card>
        <CardHeader>
          <CardTitle>Add Skills</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Manual Skill Entry */}
          <div className="space-y-4">
            <Label htmlFor="newSkill">Add Custom Skill</Label>
            <div className="flex gap-2">
              <Input
                id="newSkill"
                placeholder="Enter a skill (e.g., Microsoft Excel, Project Management, Customer Service)"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
              />
              <Button
                onClick={() => handleAddSkill(newSkill)}
                disabled={!newSkill.trim()}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>
          </div>

          {/* Skill Categories */}
          <div className="space-y-4">
            <Label>Browse Skills by Category</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {skillCategories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="text-xs"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* Search Common Skills */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Label>Common {selectedCategory} Skills</Label>
              <div className="relative flex-1 max-w-xs">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Common Skills Grid */}
            {filteredCommonSkills.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {filteredCommonSkills.map((skill) => (
                  <Button
                    key={skill}
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddSkill(skill)}
                    className="justify-start text-left"
                  >
                    <Plus className="h-3 w-3 mr-2" />
                    {skill}
                  </Button>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Code className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No skills found. Try a different search or category.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tips */}
      <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
        <CardContent className="p-4">
          <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-3 flex items-center gap-2">
            <Lightbulb className="h-4 w-4" />
            Pro Tips for Skills Section
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800 dark:text-blue-200">
            <ul className="space-y-2">
              <li>• Include both technical and soft skills</li>
              <li>• Focus on skills relevant to your industry</li>
              <li>• Use keywords from job descriptions</li>
              <li>• Include software and tools you use</li>
            </ul>
            <ul className="space-y-2">
              <li>• List 8-15 skills for optimal impact</li>
              <li>• Mix hard skills with soft skills</li>
              <li>• Keep skills current and relevant</li>
              <li>• Avoid outdated or basic skills</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
