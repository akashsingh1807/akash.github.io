import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Settings,
  GripVertical,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Info,
  RotateCcw
} from 'lucide-react';
import { useResumeBuilder } from '@/contexts/ResumeBuilderContext';
import { ResumeBuilderStep } from '@/types/resumeBuilder';
import { useToast } from '@/hooks/use-toast';

export const SectionManager: React.FC = () => {
  const { state, actions } = useResumeBuilder();
  const { toast } = useToast();
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  const handleToggleSection = (sectionId: string) => {
    const section = state.steps.find(step => step.id === sectionId);
    if (!section) return;

    if (section.required) {
      toast({
        title: "Cannot Disable Required Section",
        description: "This section is required and cannot be disabled.",
        variant: "destructive"
      });
      return;
    }

    actions.toggleSection(sectionId);
    toast({
      title: section.enabled ? "Section Disabled" : "Section Enabled",
      description: `${section.title} has been ${section.enabled ? 'disabled' : 'enabled'}.`,
    });
  };

  const handleDragStart = (e: React.DragEvent, stepId: string) => {
    setDraggedItem(stepId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetStepId: string) => {
    e.preventDefault();

    if (!draggedItem || draggedItem === targetStepId) {
      setDraggedItem(null);
      return;
    }

    const currentSteps = [...state.steps];
    const draggedIndex = currentSteps.findIndex(step => step.id === draggedItem);
    const targetIndex = currentSteps.findIndex(step => step.id === targetStepId);

    if (draggedIndex === -1 || targetIndex === -1) {
      setDraggedItem(null);
      return;
    }

    // Remove dragged item and insert at target position
    const [draggedStep] = currentSteps.splice(draggedIndex, 1);
    if (draggedStep) {
      currentSteps.splice(targetIndex, 0, draggedStep);
    }

    actions.reorderSections(currentSteps);
    setDraggedItem(null);

    toast({
      title: "Sections Reordered",
      description: "Resume sections have been reordered successfully.",
    });
  };

  const resetToDefault = () => {
    // Reset to default order and enable all sections
    const defaultSteps: ResumeBuilderStep[] = [
      { id: 'template', title: 'Choose Template', description: 'Select a professional template', icon: 'Palette', completed: state.steps.find(s => s.id === 'template')?.completed || false, required: true, enabled: true },
      { id: 'personal', title: 'Personal Info', description: 'Add your contact details', icon: 'User', completed: state.steps.find(s => s.id === 'personal')?.completed || false, required: true, enabled: true },
      { id: 'summary', title: 'Professional Summary', description: 'Write a compelling summary', icon: 'FileText', completed: state.steps.find(s => s.id === 'summary')?.completed || false, required: true, enabled: true },
      { id: 'experience', title: 'Work Experience', description: 'Add your work history', icon: 'Briefcase', completed: state.steps.find(s => s.id === 'experience')?.completed || false, required: true, enabled: true },
      { id: 'education', title: 'Education', description: 'Add your educational background', icon: 'GraduationCap', completed: state.steps.find(s => s.id === 'education')?.completed || false, required: true, enabled: true },
      { id: 'skills', title: 'Skills', description: 'List your technical and soft skills', icon: 'Code', completed: state.steps.find(s => s.id === 'skills')?.completed || false, required: true, enabled: true },
      { id: 'projects', title: 'Projects', description: 'Showcase your key projects', icon: 'Folder', completed: state.steps.find(s => s.id === 'projects')?.completed || false, required: false, enabled: true },
      { id: 'certifications', title: 'Certifications', description: 'Add professional certifications', icon: 'Award', completed: state.steps.find(s => s.id === 'certifications')?.completed || false, required: false, enabled: true },
      { id: 'languages', title: 'Languages', description: 'List languages you speak', icon: 'Globe', completed: state.steps.find(s => s.id === 'languages')?.completed || false, required: false, enabled: true },
      { id: 'review', title: 'Review & Download', description: 'Final review and download', icon: 'Download', completed: state.steps.find(s => s.id === 'review')?.completed || false, required: true, enabled: true }
    ];

    actions.reorderSections(defaultSteps);
    toast({
      title: "Reset to Default",
      description: "Section order and visibility have been reset to default.",
    });
  };

  const enabledSections = state.steps.filter(step => step.enabled);
  const disabledSections = state.steps.filter(step => !step.enabled);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            Section Management
          </CardTitle>
          <p className="text-muted-foreground">
            Customize which sections appear in your resume and reorder them to match your preferences.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{enabledSections.length}</div>
              <div className="text-sm text-green-700 dark:text-green-300">Enabled Sections</div>
            </div>
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{state.steps.filter(s => s.required).length}</div>
              <div className="text-sm text-blue-700 dark:text-blue-300">Required Sections</div>
            </div>
            <div className="text-center p-4 bg-amber-50 dark:bg-amber-950 rounded-lg">
              <div className="text-2xl font-bold text-amber-600">{disabledSections.length}</div>
              <div className="text-sm text-amber-700 dark:text-amber-300">Disabled Sections</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Info className="h-4 w-4 text-blue-500" />
              <span className="text-sm text-muted-foreground">
                Drag sections to reorder them. Toggle optional sections on/off.
              </span>
            </div>
            <Button variant="outline" onClick={resetToDefault}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset to Default
            </Button>
          </div>

          {/* Section List */}
          <div className="space-y-3">
            {state.steps.map((step, index) => (
              <div
                key={step.id}
                draggable
                onDragStart={(e) => handleDragStart(e, step.id)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, step.id)}
                className={`
                  flex items-center gap-4 p-4 border rounded-lg transition-all duration-200
                  ${step.enabled ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-900 opacity-60'}
                  ${draggedItem === step.id ? 'opacity-50 scale-95' : ''}
                  hover:shadow-md cursor-move
                `}
              >
                {/* Drag Handle */}
                <div className="flex items-center gap-2 text-muted-foreground">
                  <GripVertical className="h-4 w-4" />
                  <span className="text-sm font-medium">#{index + 1}</span>
                </div>

                {/* Section Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h4 className="font-semibold">{step.title}</h4>
                    <div className="flex items-center gap-2">
                      {step.required && (
                        <Badge variant="destructive" className="text-xs">Required</Badge>
                      )}
                      {step.completed && (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )}
                      {!step.completed && step.required && (
                        <AlertCircle className="h-4 w-4 text-amber-500" />
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>

                {/* Toggle Switch */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    {step.enabled ? (
                      <Eye className="h-4 w-4 text-green-500" />
                    ) : (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    )}
                    <Switch
                      checked={step.enabled}
                      onCheckedChange={() => handleToggleSection(step.id)}
                      disabled={step.required}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Help Text */}
          <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
            <CardContent className="p-4">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">💡 Section Management Tips</h4>
              <div className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                <p>• <strong>Required sections</strong> cannot be disabled as they're essential for a complete resume</p>
                <p>• <strong>Drag and drop</strong> sections to change their order in your resume</p>
                <p>• <strong>Optional sections</strong> can be toggled on/off based on your needs</p>
                <p>• <strong>Section order</strong> affects how your resume is structured and presented</p>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};
