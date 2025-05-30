import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Award,
  Plus,
  Trash2,
  ExternalLink,
  Calendar,
  CheckCircle,
  AlertCircle,
  GripVertical,
  Building
} from 'lucide-react';
import { useResumeBuilder } from '@/contexts/ResumeBuilderContext';
import { CertificationForm } from '@/types/resumeBuilder';
import { useToast } from '@/hooks/use-toast';

export const CertificationsStep: React.FC = () => {
  const { state, actions } = useResumeBuilder();
  const { toast } = useToast();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<CertificationForm>>({});

  const certifications = state.resumeData.certifications || [];
  const isStepComplete = certifications.length > 0;

  const handleAddNew = () => {
    const newId = Date.now().toString();
    setEditingId(newId);
    setFormData({
      id: newId,
      name: '',
      issuer: '',
      date: '',
      expirationDate: '',
      credentialId: '',
      url: ''
    });
  };

  const handleSave = () => {
    if (!formData.name || !formData.issuer || !formData.date) {
      toast({
        title: "Missing Information",
        description: "Please fill in certification name, issuer, and date.",
        variant: "destructive"
      });
      return;
    }

    const certificationData: CertificationForm = {
      id: formData.id || Date.now().toString(),
      name: formData.name || '',
      issuer: formData.issuer || '',
      date: formData.date || '',
      expirationDate: formData.expirationDate || '',
      credentialId: formData.credentialId || '',
      url: formData.url || ''
    };

    const existingIndex = certifications.findIndex(cert => cert.id === certificationData.id);
    if (existingIndex >= 0) {
      actions.updateCertification(certificationData.id, certificationData);
    } else {
      actions.addCertification(certificationData);
    }

    setEditingId(null);
    setFormData({});

    toast({
      title: "Certification Saved",
      description: "Certification has been added successfully.",
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({});
  };

  const handleEdit = (certification: any) => {
    setEditingId(certification.id);
    setFormData(certification);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this certification?')) {
      actions.removeCertification(id);
      toast({
        title: "Certification Deleted",
        description: "Certification has been removed.",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            Certifications & Licenses
          </CardTitle>
          <p className="text-muted-foreground">
            Add your professional certifications, licenses, and credentials to showcase your expertise and qualifications.
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
                {certifications.length} certification{certifications.length !== 1 ? 's' : ''} added
              </span>
            </div>
            <Badge variant={isStepComplete ? "default" : "secondary"}>
              {isStepComplete ? "Complete" : "Optional"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Certifications List */}
      {certifications.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Your Certifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {certifications.map((certification, index) => (
              <div
                key={certification.id}
                className="flex items-start gap-4 p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-center gap-2 text-muted-foreground">
                  <GripVertical className="h-4 w-4" />
                  <span className="text-sm font-medium">#{index + 1}</span>
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-lg">{certification.name}</h4>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <span className="flex items-center gap-1">
                          <Building className="h-3 w-3" />
                          {certification.issuer}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {certification.date}
                          {certification.expirationDate && ` - ${certification.expirationDate}`}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 mt-2">
                        {certification.credentialId && (
                          <Badge variant="outline" className="text-xs">
                            ID: {certification.credentialId}
                          </Badge>
                        )}
                        {certification.url && (
                          <a
                            href={certification.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-xs text-primary hover:underline"
                          >
                            <ExternalLink className="h-3 w-3" />
                            View Certificate
                          </a>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(certification)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(certification.id)}
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
              {certifications.find(cert => cert.id === editingId) ? 'Edit Certification' : 'Add Certification'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Certification Name *</Label>
                <Input
                  id="name"
                  placeholder="AWS Certified Solutions Architect"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="issuer">Issuing Organization *</Label>
                <Input
                  id="issuer"
                  placeholder="Amazon Web Services"
                  value={formData.issuer || ''}
                  onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                />
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Issue Date *</Label>
                <Input
                  id="date"
                  type="month"
                  value={formData.date || ''}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expirationDate">Expiration Date (Optional)</Label>
                <Input
                  id="expirationDate"
                  type="month"
                  value={formData.expirationDate || ''}
                  onChange={(e) => setFormData({ ...formData, expirationDate: e.target.value })}
                />
              </div>
            </div>

            {/* Additional Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="credentialId">Credential ID (Optional)</Label>
                <Input
                  id="credentialId"
                  placeholder="ABC123XYZ789"
                  value={formData.credentialId || ''}
                  onChange={(e) => setFormData({ ...formData, credentialId: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="url">Certificate URL (Optional)</Label>
                <Input
                  id="url"
                  placeholder="https://verify.certificate.com/abc123"
                  value={formData.url || ''}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-4">
              <Button onClick={handleSave} size="lg">
                <CheckCircle className="h-4 w-4 mr-2" />
                Save Certification
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
              <h3 className="text-lg font-semibold mb-2">Add Certification</h3>
              <p className="text-muted-foreground mb-4">
                Add professional certifications to demonstrate your expertise and qualifications
              </p>
              <Button onClick={handleAddNew} size="lg">
                <Plus className="h-4 w-4 mr-2" />
                Add Certification
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tips */}
      <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
        <CardContent className="p-4">
          <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-3">💡 Pro Tips for Certifications</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800 dark:text-blue-200">
            <ul className="space-y-2">
              <li>• Include only relevant, current certifications</li>
              <li>• Add credential IDs for verification</li>
              <li>• Include expiration dates if applicable</li>
            </ul>
            <ul className="space-y-2">
              <li>• Link to verification URLs when available</li>
              <li>• List certifications in order of relevance</li>
              <li>• Include both technical and professional certifications</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
