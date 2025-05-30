import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Globe,
  Plus,
  Trash2,
  CheckCircle,
  AlertCircle,
  GripVertical,
  Star
} from 'lucide-react';
import { useResumeBuilder } from '@/contexts/ResumeBuilderContext';
import { LanguageForm } from '@/types/resumeBuilder';
import { useToast } from '@/hooks/use-toast';

const proficiencyLevels = [
  { value: 'Basic', label: 'Basic', description: 'Can understand and use familiar everyday expressions' },
  { value: 'Conversational', label: 'Conversational', description: 'Can handle most situations while traveling' },
  { value: 'Fluent', label: 'Fluent', description: 'Can express ideas fluently and spontaneously' },
  { value: 'Native', label: 'Native', description: 'Native or bilingual proficiency' }
];

const commonLanguages = [
  'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Russian',
  'Chinese (Mandarin)', 'Japanese', 'Korean', 'Arabic', 'Hindi', 'Dutch',
  'Swedish', 'Norwegian', 'Danish', 'Polish', 'Turkish', 'Hebrew', 'Thai'
];

export const LanguagesStep: React.FC = () => {
  const { state, actions } = useResumeBuilder();
  const { toast } = useToast();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<LanguageForm>>({});

  const languages = state.resumeData.languages || [];
  const isStepComplete = languages.length > 0;

  const handleAddNew = () => {
    const newId = Date.now().toString();
    setEditingId(newId);
    setFormData({
      id: newId,
      language: '',
      proficiency: 'Conversational'
    });
  };

  const handleSave = () => {
    if (!formData.language || !formData.proficiency) {
      toast({
        title: "Missing Information",
        description: "Please fill in language and proficiency level.",
        variant: "destructive"
      });
      return;
    }

    // Check if language already exists
    if (languages.some(lang => lang.language.toLowerCase() === formData.language?.toLowerCase() && lang.id !== formData.id)) {
      toast({
        title: "Language Already Added",
        description: "This language is already in your list.",
        variant: "destructive"
      });
      return;
    }

    const languageData: LanguageForm = {
      id: formData.id || Date.now().toString(),
      language: formData.language || '',
      proficiency: formData.proficiency as 'Basic' | 'Conversational' | 'Fluent' | 'Native' || 'Conversational'
    };

    const existingIndex = languages.findIndex(lang => lang.id === languageData.id);
    if (existingIndex >= 0) {
      actions.updateLanguage(languageData.id, languageData);
    } else {
      actions.addLanguage(languageData);
    }

    setEditingId(null);
    setFormData({});

    toast({
      title: "Language Saved",
      description: "Language has been added successfully.",
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({});
  };

  const handleEdit = (language: any) => {
    setEditingId(language.id);
    setFormData(language);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this language?')) {
      actions.removeLanguage(id);
      toast({
        title: "Language Deleted",
        description: "Language has been removed.",
      });
    }
  };

  const handleQuickAdd = (language: string) => {
    if (languages.some(lang => lang.language.toLowerCase() === language.toLowerCase())) {
      toast({
        title: "Language Already Added",
        description: "This language is already in your list.",
        variant: "destructive"
      });
      return;
    }

    const languageData: LanguageForm = {
      id: Date.now().toString(),
      language: language,
      proficiency: 'Conversational'
    };

    actions.addLanguage(languageData);
    toast({
      title: "Language Added",
      description: `${language} has been added with Conversational proficiency.`,
    });
  };

  const getProficiencyColor = (proficiency: string) => {
    switch (proficiency) {
      case 'Basic': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Conversational': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'Fluent': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Native': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getProficiencyStars = (proficiency: string) => {
    switch (proficiency) {
      case 'Basic': return 2;
      case 'Conversational': return 3;
      case 'Fluent': return 4;
      case 'Native': return 5;
      default: return 3;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" />
            Languages
          </CardTitle>
          <p className="text-muted-foreground">
            Add languages you speak and your proficiency level. This can be valuable for international roles or diverse teams.
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
                {languages.length} language{languages.length !== 1 ? 's' : ''} added
              </span>
            </div>
            <Badge variant={isStepComplete ? "default" : "secondary"}>
              {isStepComplete ? "Complete" : "Optional"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Languages List */}
      {languages.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Your Languages</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {languages.map((language, index) => (
              <div
                key={language.id}
                className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-center gap-2 text-muted-foreground">
                  <GripVertical className="h-4 w-4" />
                  <span className="text-sm font-medium">#{index + 1}</span>
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div>
                        <h4 className="font-semibold text-lg">{language.language}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={getProficiencyColor(language.proficiency)}>
                            {language.proficiency}
                          </Badge>
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-3 w-3 ${
                                  star <= getProficiencyStars(language.proficiency)
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(language)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(language.id)}
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

      {/* Quick Add Common Languages */}
      {!editingId && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Add Common Languages</CardTitle>
            <p className="text-sm text-muted-foreground">
              Click to quickly add a language with Conversational proficiency (you can edit later)
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {commonLanguages
                .filter(lang => !languages.some(userLang => userLang.language.toLowerCase() === lang.toLowerCase()))
                .map((language) => (
                <Button
                  key={language}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickAdd(language)}
                  className="justify-start text-left"
                >
                  <Plus className="h-3 w-3 mr-2" />
                  {language}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add/Edit Form */}
      {editingId ? (
        <Card>
          <CardHeader>
            <CardTitle>
              {languages.find(lang => lang.id === editingId) ? 'Edit Language' : 'Add Language'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Language and Proficiency */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="language">Language *</Label>
                <Input
                  id="language"
                  placeholder="English, Spanish, French..."
                  value={formData.language || ''}
                  onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="proficiency">Proficiency Level *</Label>
                <Select
                  value={formData.proficiency || 'Conversational'}
                  onValueChange={(value) => setFormData({ ...formData, proficiency: value as any })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select proficiency level" />
                  </SelectTrigger>
                  <SelectContent>
                    {proficiencyLevels.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        <div>
                          <div className="font-medium">{level.label}</div>
                          <div className="text-xs text-muted-foreground">{level.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Proficiency Preview */}
            {formData.proficiency && (
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <Badge className={getProficiencyColor(formData.proficiency)}>
                    {formData.proficiency}
                  </Badge>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= getProficiencyStars(formData.proficiency || 'Conversational')
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {proficiencyLevels.find(level => level.value === formData.proficiency)?.description}
                  </span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-4">
              <Button onClick={handleSave} size="lg">
                <CheckCircle className="h-4 w-4 mr-2" />
                Save Language
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
              <h3 className="text-lg font-semibold mb-2">Add Language</h3>
              <p className="text-muted-foreground mb-4">
                Add languages you speak to showcase your communication abilities
              </p>
              <Button onClick={handleAddNew} size="lg">
                <Plus className="h-4 w-4 mr-2" />
                Add Custom Language
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tips */}
      <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
        <CardContent className="p-4">
          <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-3">💡 Pro Tips for Languages</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800 dark:text-blue-200">
            <ul className="space-y-2">
              <li>• Be honest about your proficiency level</li>
              <li>• Include languages relevant to your target role</li>
              <li>• Consider adding programming languages separately in Skills</li>
            </ul>
            <ul className="space-y-2">
              <li>• Native speakers should mark as "Native"</li>
              <li>• Include sign languages if applicable</li>
              <li>• Update proficiency as you improve</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
