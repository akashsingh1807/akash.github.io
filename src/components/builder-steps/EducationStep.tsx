import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  GraduationCap,
  Plus,
  Trash2,
  Calendar,
  School,
  CheckCircle,
  AlertCircle,
  GripVertical,
  Award
} from 'lucide-react';
import { useResumeBuilder } from '@/contexts/ResumeBuilderContext';
import { EducationForm } from '@/types/resumeBuilder';
import { useToast } from '@/hooks/use-toast';

export const EducationStep: React.FC = () => {
  const { state, actions } = useResumeBuilder();
  const { toast } = useToast();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<EducationForm>>({});

  const education = state.resumeData.education || [];
  const isStepComplete = education.length > 0;

  const handleAddNew = () => {
    const newId = Date.now().toString();
    setEditingId(newId);
    setFormData({
      id: newId,
      institution: '',
      degree: '',
      field: '',
      graduationDate: '',
      gpa: '',
      honors: '',
      relevantCoursework: [],
      activities: []
    });
  };

  const handleSave = () => {
    if (!formData.institution || !formData.degree || !formData.field || !formData.graduationDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in institution, degree, field of study, and graduation date.",
        variant: "destructive"
      });
      return;
    }

    const educationData: EducationForm = {
      id: formData.id || Date.now().toString(),
      institution: formData.institution || '',
      degree: formData.degree || '',
      field: formData.field || '',
      graduationDate: formData.graduationDate || '',
      gpa: formData.gpa || '',
      honors: formData.honors || '',
      relevantCoursework: formData.relevantCoursework || [],
      activities: formData.activities || []
    };

    const existingIndex = education.findIndex(edu => edu.id === educationData.id);
    if (existingIndex >= 0) {
      actions.updateEducation(educationData.id, educationData);
    } else {
      actions.addEducation(educationData);
    }

    setEditingId(null);
    setFormData({});

    toast({
      title: "Education Saved",
      description: "Educational background has been added successfully.",
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({});
  };

  const handleEdit = (education: any) => {
    setEditingId(education.id);
    setFormData(education);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this education entry?')) {
      actions.removeEducation(id);
      toast({
        title: "Education Deleted",
        description: "Educational background has been removed.",
      });
    }
  };

  const addCourseworkItem = () => {
    const newCoursework = [...(formData.relevantCoursework || []), ''];
    setFormData({ ...formData, relevantCoursework: newCoursework });
  };

  const updateCourseworkItem = (index: number, value: string) => {
    const newCoursework = [...(formData.relevantCoursework || [])];
    newCoursework[index] = value;
    setFormData({ ...formData, relevantCoursework: newCoursework });
  };

  const removeCourseworkItem = (index: number) => {
    const newCoursework = [...(formData.relevantCoursework || [])];
    newCoursework.splice(index, 1);
    setFormData({ ...formData, relevantCoursework: newCoursework });
  };

  const addActivityItem = () => {
    const newActivities = [...(formData.activities || []), ''];
    setFormData({ ...formData, activities: newActivities });
  };

  const updateActivityItem = (index: number, value: string) => {
    const newActivities = [...(formData.activities || [])];
    newActivities[index] = value;
    setFormData({ ...formData, activities: newActivities });
  };

  const removeActivityItem = (index: number) => {
    const newActivities = [...(formData.activities || [])];
    newActivities.splice(index, 1);
    setFormData({ ...formData, activities: newActivities });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-primary" />
            Education
          </CardTitle>
          <p className="text-muted-foreground">
            Add your educational background, degrees, and academic achievements. Include your most recent education first.
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
                {education.length} education entr{education.length !== 1 ? 'ies' : 'y'} added
              </span>
            </div>
            <Badge variant={isStepComplete ? "default" : "secondary"}>
              {isStepComplete ? "Complete" : "Add Education"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Education List */}
      {education.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Your Education</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {education.map((edu, index) => (
              <div
                key={edu.id}
                className="flex items-start gap-4 p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-center gap-2 text-muted-foreground">
                  <GripVertical className="h-4 w-4" />
                  <span className="text-sm font-medium">#{index + 1}</span>
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-lg">{edu.degree} in {edu.field}</h4>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <span className="flex items-center gap-1">
                          <School className="h-3 w-3" />
                          {edu.institution}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {edu.graduationDate}
                        </span>
                        {edu.gpa && (
                          <span className="flex items-center gap-1">
                            <Award className="h-3 w-3" />
                            GPA: {edu.gpa}
                          </span>
                        )}
                      </div>
                      {edu.honors && (
                        <div className="mt-2">
                          <Badge variant="secondary" className="text-xs">
                            {edu.honors}
                          </Badge>
                        </div>
                      )}
                      {edu.relevantCoursework && edu.relevantCoursework.length > 0 && (
                        <div className="mt-2">
                          <span className="text-sm font-medium text-muted-foreground">Relevant Coursework: </span>
                          <span className="text-sm text-gray-600">
                            {edu.relevantCoursework.slice(0, 3).join(', ')}
                            {edu.relevantCoursework.length > 3 && ` +${edu.relevantCoursework.length - 3} more`}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(edu)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(edu.id)}
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
              {education.find(edu => edu.id === editingId) ? 'Edit Education' : 'Add Education'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="degree">Degree *</Label>
                <Input
                  id="degree"
                  placeholder="Bachelor of Science"
                  value={formData.degree || ''}
                  onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="field">Field of Study *</Label>
                <Input
                  id="field"
                  placeholder="Computer Science"
                  value={formData.field || ''}
                  onChange={(e) => setFormData({ ...formData, field: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="institution">Institution *</Label>
                <Input
                  id="institution"
                  placeholder="University of California, Berkeley"
                  value={formData.institution || ''}
                  onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="graduationDate">Graduation Date *</Label>
                <Input
                  id="graduationDate"
                  type="month"
                  value={formData.graduationDate || ''}
                  onChange={(e) => setFormData({ ...formData, graduationDate: e.target.value })}
                />
              </div>
            </div>

            {/* Optional Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="gpa">GPA (Optional)</Label>
                <Input
                  id="gpa"
                  placeholder="3.8"
                  value={formData.gpa || ''}
                  onChange={(e) => setFormData({ ...formData, gpa: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="honors">Honors/Awards (Optional)</Label>
                <Input
                  id="honors"
                  placeholder="Magna Cum Laude, Dean's List"
                  value={formData.honors || ''}
                  onChange={(e) => setFormData({ ...formData, honors: e.target.value })}
                />
              </div>
            </div>

            {/* Relevant Coursework */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Relevant Coursework (Optional)</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addCourseworkItem}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Course
                </Button>
              </div>

              {(formData.relevantCoursework || []).map((course, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    placeholder="Data Structures and Algorithms"
                    value={course}
                    onChange={(e) => updateCourseworkItem(index, e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeCourseworkItem(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Activities */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Activities & Organizations (Optional)</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addActivityItem}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Activity
                </Button>
              </div>

              {(formData.activities || []).map((activity, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    placeholder="Computer Science Club, Student Government"
                    value={activity}
                    onChange={(e) => updateActivityItem(index, e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeActivityItem(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-4">
              <Button onClick={handleSave} size="lg">
                <CheckCircle className="h-4 w-4 mr-2" />
                Save Education
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
              <h3 className="text-lg font-semibold mb-2">Add Education</h3>
              <p className="text-muted-foreground mb-4">
                Add your educational background to showcase your academic achievements
              </p>
              <Button onClick={handleAddNew} size="lg">
                <Plus className="h-4 w-4 mr-2" />
                Add Education
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tips */}
      <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
        <CardContent className="p-4">
          <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-3">💡 Pro Tips for Education Section</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800 dark:text-blue-200">
            <ul className="space-y-2">
              <li>• List education in reverse chronological order</li>
              <li>• Include GPA if it's 3.5 or higher</li>
              <li>• Mention relevant coursework for your target role</li>
            </ul>
            <ul className="space-y-2">
              <li>• Include honors, awards, and academic achievements</li>
              <li>• Add relevant extracurricular activities</li>
              <li>• Use full institution names, not abbreviations</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
