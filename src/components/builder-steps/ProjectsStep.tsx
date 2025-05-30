import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Folder,
  Plus,
  Trash2,
  ExternalLink,
  Github,
  CheckCircle,
  AlertCircle,
  GripVertical,
  Calendar
} from 'lucide-react';
import { useResumeBuilder } from '@/contexts/ResumeBuilderContext';
import { ProjectForm } from '@/types/resumeBuilder';
import { useToast } from '@/hooks/use-toast';

export const ProjectsStep: React.FC = () => {
  const { state, actions } = useResumeBuilder();
  const { toast } = useToast();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<ProjectForm>>({});

  const projects = state.resumeData.projects || [];
  const isStepComplete = projects.length > 0;

  const handleAddNew = () => {
    const newId = Date.now().toString();
    setEditingId(newId);
    setFormData({
      id: newId,
      name: '',
      description: '',
      technologies: [],
      url: '',
      github: '',
      startDate: '',
      endDate: '',
      highlights: []
    });
  };

  const handleSave = () => {
    if (!formData.name || !formData.description) {
      toast({
        title: "Missing Information",
        description: "Please fill in project name and description.",
        variant: "destructive"
      });
      return;
    }

    const projectData: ProjectForm = {
      id: formData.id || Date.now().toString(),
      name: formData.name || '',
      description: formData.description || '',
      technologies: formData.technologies || [],
      url: formData.url || '',
      github: formData.github || '',
      startDate: formData.startDate || '',
      endDate: formData.endDate || '',
      highlights: formData.highlights || []
    };

    const existingIndex = projects.findIndex(proj => proj.id === projectData.id);
    if (existingIndex >= 0) {
      actions.updateProject(projectData.id, projectData);
    } else {
      actions.addProject(projectData);
    }

    setEditingId(null);
    setFormData({});

    toast({
      title: "Project Saved",
      description: "Project has been added successfully.",
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({});
  };

  const handleEdit = (project: any) => {
    setEditingId(project.id);
    setFormData(project);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      actions.removeProject(id);
      toast({
        title: "Project Deleted",
        description: "Project has been removed.",
      });
    }
  };

  const addTechnology = (tech: string) => {
    if (tech.trim() && !formData.technologies?.includes(tech.trim())) {
      setFormData({
        ...formData,
        technologies: [...(formData.technologies || []), tech.trim()]
      });
    }
  };

  const removeTechnology = (index: number) => {
    const newTechnologies = [...(formData.technologies || [])];
    newTechnologies.splice(index, 1);
    setFormData({ ...formData, technologies: newTechnologies });
  };

  const addHighlight = () => {
    setFormData({
      ...formData,
      highlights: [...(formData.highlights || []), '']
    });
  };

  const updateHighlight = (index: number, value: string) => {
    const newHighlights = [...(formData.highlights || [])];
    newHighlights[index] = value;
    setFormData({ ...formData, highlights: newHighlights });
  };

  const removeHighlight = (index: number) => {
    const newHighlights = [...(formData.highlights || [])];
    newHighlights.splice(index, 1);
    setFormData({ ...formData, highlights: newHighlights });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Folder className="h-5 w-5 text-primary" />
            Projects & Key Accomplishments
          </CardTitle>
          <p className="text-muted-foreground">
            Showcase your key projects, initiatives, campaigns, or significant accomplishments. Include measurable results and impact.
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
                {projects.length} project{projects.length !== 1 ? 's' : ''} added
              </span>
            </div>
            <Badge variant={isStepComplete ? "default" : "secondary"}>
              {isStepComplete ? "Complete" : "Add Projects"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Projects List */}
      {projects.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Your Projects</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {projects.map((project, index) => (
              <div
                key={project.id}
                className="flex items-start gap-4 p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-center gap-2 text-muted-foreground">
                  <GripVertical className="h-4 w-4" />
                  <span className="text-sm font-medium">#{index + 1}</span>
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-lg">{project.name}</h4>
                      <p className="text-sm text-muted-foreground mt-1 mb-2">
                        {project.description}
                      </p>

                      {project.technologies && project.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {project.technologies.map((tech, techIndex) => (
                            <Badge key={techIndex} variant="outline" className="text-xs">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        {project.startDate && (
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {project.startDate} - {project.endDate || 'Present'}
                          </span>
                        )}
                        {project.url && (
                          <a
                            href={project.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-primary hover:underline"
                          >
                            <ExternalLink className="h-3 w-3" />
                            Live Demo
                          </a>
                        )}
                        {project.github && (
                          <a
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-primary hover:underline"
                          >
                            <Github className="h-3 w-3" />
                            GitHub
                          </a>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(project)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(project.id)}
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
              {projects.find(proj => proj.id === editingId) ? 'Edit Project' : 'Add Project'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Project/Initiative Name *</Label>
                <Input
                  id="name"
                  placeholder="Marketing Campaign, Process Improvement, Event Planning, etc."
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="url">Project URL/Link (Optional)</Label>
                <Input
                  id="url"
                  placeholder="https://company.com/project or portfolio link"
                  value={formData.url || ''}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Project Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe the project, its objectives, your role, and key outcomes..."
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="min-h-[100px]"
              />
            </div>

            {/* Links */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="github">Additional Link (Optional)</Label>
                <Input
                  id="github"
                  placeholder="Portfolio, documentation, or related link"
                  value={formData.github || ''}
                  onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="month"
                  value={formData.startDate || ''}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                />
              </div>
            </div>

            {/* Technologies */}
            <div className="space-y-4">
              <Label>Tools & Methods Used</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {(formData.technologies || []).map((tech, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {tech}
                    <button
                      onClick={() => removeTechnology(index)}
                      className="ml-1 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Add tools/methods (e.g., Excel, Agile, Photoshop, CRM)"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTechnology(e.currentTarget.value);
                      e.currentTarget.value = '';
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={(e) => {
                    const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                    addTechnology(input.value);
                    input.value = '';
                  }}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Key Highlights */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Key Highlights & Achievements</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addHighlight}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Highlight
                </Button>
              </div>

              {(formData.highlights || []).map((highlight, index) => (
                <div key={index} className="flex items-start gap-2">
                  <Textarea
                    placeholder="• Increased sales by 25% through new marketing strategy"
                    value={highlight}
                    onChange={(e) => updateHighlight(index, e.target.value)}
                    className="min-h-[60px]"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeHighlight(index)}
                    className="text-red-600 hover:text-red-700 mt-2"
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
                Save Project
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
              <h3 className="text-lg font-semibold mb-2">Add Project</h3>
              <p className="text-muted-foreground mb-4">
                Showcase your projects to demonstrate your skills and experience
              </p>
              <Button onClick={handleAddNew} size="lg">
                <Plus className="h-4 w-4 mr-2" />
                Add Project
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tips */}
      <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
        <CardContent className="p-4">
          <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-3">💡 Pro Tips for Projects Section</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800 dark:text-blue-200">
            <ul className="space-y-2">
              <li>• Include 3-5 of your most impactful projects</li>
              <li>• Focus on projects relevant to your target role</li>
              <li>• Include measurable results and outcomes</li>
              <li>• Show your specific role and contributions</li>
            </ul>
            <ul className="space-y-2">
              <li>• Highlight tools, methods, and skills used</li>
              <li>• Use action verbs and quantify impact</li>
              <li>• Include both work and personal projects</li>
              <li>• Keep descriptions clear and concise</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
