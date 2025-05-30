import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Briefcase,
  Plus,
  Trash2,
  Calendar,
  MapPin,
  Building,
  CheckCircle,
  AlertCircle,
  GripVertical
} from 'lucide-react';
import { useResumeBuilder } from '@/contexts/ResumeBuilderContext';
import { ExperienceForm } from '@/types/resumeBuilder';
import { useToast } from '@/hooks/use-toast';

export const ExperienceStep: React.FC = () => {
  const { state, actions } = useResumeBuilder();
  const { toast } = useToast();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<ExperienceForm>>({});

  const experiences = state.resumeData.experience || [];
  const isStepComplete = experiences.length > 0;

  const handleAddNew = () => {
    const newId = Date.now().toString();
    setEditingId(newId);
    setFormData({
      id: newId,
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: [],
      achievements: []
    });
  };

  const handleSave = () => {
    if (!formData.company || !formData.position || !formData.startDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in company, position, and start date.",
        variant: "destructive"
      });
      return;
    }

    const experienceData: ExperienceForm = {
      id: formData.id || Date.now().toString(),
      company: formData.company || '',
      position: formData.position || '',
      location: formData.location || '',
      startDate: formData.startDate || '',
      endDate: formData.current ? 'Present' : (formData.endDate || ''),
      current: formData.current || false,
      description: formData.description || [],
      achievements: formData.achievements || []
    };

    const existingIndex = experiences.findIndex(exp => exp.id === experienceData.id);
    if (existingIndex >= 0) {
      actions.updateExperience(experienceData.id, experienceData);
    } else {
      actions.addExperience(experienceData);
    }

    setEditingId(null);
    setFormData({});

    toast({
      title: "Experience Saved",
      description: "Work experience has been added successfully.",
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({});
  };

  const handleEdit = (experience: any) => {
    setEditingId(experience.id);
    setFormData(experience);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this experience?')) {
      actions.removeExperience(id);
      toast({
        title: "Experience Deleted",
        description: "Work experience has been removed.",
      });
    }
  };

  const addDescriptionPoint = () => {
    const newDescription = [...(formData.description || []), ''];
    setFormData({ ...formData, description: newDescription });
  };

  const updateDescriptionPoint = (index: number, value: string) => {
    const newDescription = [...(formData.description || [])];
    newDescription[index] = value;
    setFormData({ ...formData, description: newDescription });
  };

  const removeDescriptionPoint = (index: number) => {
    const newDescription = [...(formData.description || [])];
    newDescription.splice(index, 1);
    setFormData({ ...formData, description: newDescription });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-primary" />
            Work Experience
          </CardTitle>
          <p className="text-muted-foreground">
            Add your work experience, starting with your most recent position. Include specific achievements and responsibilities.
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
                {experiences.length} work experience{experiences.length !== 1 ? 's' : ''} added
              </span>
            </div>
            <Badge variant={isStepComplete ? "default" : "secondary"}>
              {isStepComplete ? "Complete" : "Add Experience"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Experience List */}
      {experiences.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Your Work Experience</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {experiences.map((experience, index) => (
              <div
                key={experience.id}
                className="flex items-start gap-4 p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-center gap-2 text-muted-foreground">
                  <GripVertical className="h-4 w-4" />
                  <span className="text-sm font-medium">#{index + 1}</span>
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-lg">{experience.position}</h4>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <span className="flex items-center gap-1">
                          <Building className="h-3 w-3" />
                          {experience.company}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {experience.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {experience.startDate} - {experience.endDate}
                        </span>
                      </div>
                      {experience.description && experience.description.length > 0 && (
                        <ul className="mt-2 text-sm text-gray-600 space-y-1">
                          {experience.description.slice(0, 2).map((desc, descIndex) => (
                            <li key={descIndex}>• {desc}</li>
                          ))}
                          {experience.description.length > 2 && (
                            <li className="text-muted-foreground">
                              +{experience.description.length - 2} more responsibilities
                            </li>
                          )}
                        </ul>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(experience)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(experience.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Add/Edit Form */}
      {editingId ? (
        <Card>
          <CardHeader>
            <CardTitle>
              {experiences.find(exp => exp.id === editingId) ? 'Edit Experience' : 'Add Work Experience'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="position">Job Title *</Label>
                <Input
                  id="position"
                  placeholder="Marketing Manager, Sales Associate, Teacher, Nurse, etc."
                  value={formData.position || ''}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">Company/Organization *</Label>
                <Input
                  id="company"
                  placeholder="ABC Company, City Hospital, School District, etc."
                  value={formData.company || ''}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="San Francisco, CA"
                  value={formData.location || ''}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date *</Label>
                <Input
                  id="startDate"
                  type="month"
                  value={formData.startDate || ''}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                />
              </div>
            </div>

            {/* Current Job Checkbox */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="current"
                checked={formData.current || false}
                onCheckedChange={(checked) => setFormData({ ...formData, current: checked as boolean })}
              />
              <Label htmlFor="current">I currently work here</Label>
            </div>

            {/* End Date */}
            {!formData.current && (
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="month"
                  value={formData.endDate || ''}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                />
              </div>
            )}

            {/* Job Description */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Job Responsibilities & Achievements</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addDescriptionPoint}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Point
                </Button>
              </div>

              {(formData.description || []).map((desc, index) => (
                <div key={index} className="flex items-start gap-2">
                  <Textarea
                    placeholder="• Managed team of 10 employees, increasing productivity by 25%"
                    value={desc}
                    onChange={(e) => updateDescriptionPoint(index, e.target.value)}
                    className="min-h-[60px]"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeDescriptionPoint(index)}
                    className="text-red-600 hover:text-red-700 mt-2"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              {(!formData.description || formData.description.length === 0) && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={addDescriptionPoint}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Responsibility
                </Button>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-4">
              <Button onClick={handleSave} size="lg">
                <CheckCircle className="h-4 w-4 mr-2" />
                Save Experience
              </Button>
              <Button variant="outline" onClick={handleCancel} size="lg">
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        /* Add New Button */
        <Card className="border-dashed border-2 border-primary/30 hover:border-primary/50 transition-colors">
          <CardContent className="p-8">
            <div className="text-center">
              <div className="p-4 bg-primary/10 rounded-full w-fit mx-auto mb-4">
                <Plus className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Add Work Experience</h3>
              <p className="text-muted-foreground mb-4">
                Add your professional experience to showcase your career progression
              </p>
              <Button onClick={handleAddNew} size="lg">
                <Plus className="h-4 w-4 mr-2" />
                Add Experience
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tips */}
      <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
        <CardContent className="p-4">
          <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-3">💡 Pro Tips for Work Experience</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800 dark:text-blue-200">
            <ul className="space-y-2">
              <li>• Start each bullet point with a strong action verb</li>
              <li>• Include specific numbers and percentages when possible</li>
              <li>• Focus on achievements, not just responsibilities</li>
            </ul>
            <ul className="space-y-2">
              <li>• List experiences in reverse chronological order</li>
              <li>• Keep descriptions concise but impactful</li>
              <li>• Tailor content to match the job you're applying for</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
