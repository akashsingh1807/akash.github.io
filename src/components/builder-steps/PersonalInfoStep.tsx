import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Globe,
  Github,
  Briefcase,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useResumeBuilder } from '@/contexts/ResumeBuilderContext';
import { cn } from '@/lib/utils';

export const PersonalInfoStep: React.FC = () => {
  const { state, actions } = useResumeBuilder();
  const personalInfo = state.resumeData.personalInfo || {
    name: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    website: '',
    github: '',
    portfolio: ''
  };

  const handleInputChange = (field: string, value: string) => {
    actions.updatePersonalInfo({ [field]: value });
  };

  const isFieldRequired = (field: string) => {
    return ['name', 'email', 'phone', 'location'].includes(field);
  };

  const isFieldValid = (field: string, value: string) => {
    if (isFieldRequired(field) && !value) return false;

    if (field === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value);
    }

    if (field === 'phone' && value) {
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      return phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''));
    }

    return true;
  };

  const getFieldError = (field: string, value: string) => {
    if (isFieldRequired(field) && !value) {
      return 'This field is required';
    }

    if (field === 'email' && value && !isFieldValid(field, value)) {
      return 'Please enter a valid email address';
    }

    if (field === 'phone' && value && !isFieldValid(field, value)) {
      return 'Please enter a valid phone number';
    }

    return null;
  };

  const requiredFields = ['name', 'email', 'phone', 'location'];
  const completedRequiredFields = requiredFields.filter(field =>
    personalInfo[field as keyof typeof personalInfo] &&
    isFieldValid(field, personalInfo[field as keyof typeof personalInfo] as string)
  );
  const isStepComplete = completedRequiredFields.length === requiredFields.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Personal Information
          </CardTitle>
          <p className="text-muted-foreground">
            Add your contact details and professional links. Required fields are marked with *.
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
                {completedRequiredFields.length} of {requiredFields.length} required fields completed
              </span>
            </div>
            <Badge variant={isStepComplete ? "default" : "secondary"}>
              {isStepComplete ? "Complete" : "In Progress"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Form */}
      <Card>
        <CardContent className="p-6 space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <User className="h-4 w-4" />
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-1">
                  Full Name *
                  {!isFieldValid('name', personalInfo.name || '') && personalInfo.name && (
                    <AlertCircle className="h-3 w-3 text-red-500" />
                  )}
                </Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={personalInfo.name || ''}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={cn(
                    !isFieldValid('name', personalInfo.name || '') && personalInfo.name && "border-red-500"
                  )}
                />
                {getFieldError('name', personalInfo.name || '') && (
                  <p className="text-xs text-red-500">{getFieldError('name', personalInfo.name || '')}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-1">
                  <Mail className="h-3 w-3" />
                  Email Address *
                  {!isFieldValid('email', personalInfo.email || '') && personalInfo.email && (
                    <AlertCircle className="h-3 w-3 text-red-500" />
                  )}
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john.doe@email.com"
                  value={personalInfo.email || ''}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={cn(
                    !isFieldValid('email', personalInfo.email || '') && personalInfo.email && "border-red-500"
                  )}
                />
                {getFieldError('email', personalInfo.email || '') && (
                  <p className="text-xs text-red-500">{getFieldError('email', personalInfo.email || '')}</p>
                )}
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  Phone Number *
                  {!isFieldValid('phone', personalInfo.phone || '') && personalInfo.phone && (
                    <AlertCircle className="h-3 w-3 text-red-500" />
                  )}
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="(555) 123-4567"
                  value={personalInfo.phone || ''}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className={cn(
                    !isFieldValid('phone', personalInfo.phone || '') && personalInfo.phone && "border-red-500"
                  )}
                />
                {getFieldError('phone', personalInfo.phone || '') && (
                  <p className="text-xs text-red-500">{getFieldError('phone', personalInfo.phone || '')}</p>
                )}
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location" className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  Location *
                  {!isFieldValid('location', personalInfo.location || '') && personalInfo.location && (
                    <AlertCircle className="h-3 w-3 text-red-500" />
                  )}
                </Label>
                <Input
                  id="location"
                  placeholder="San Francisco, CA"
                  value={personalInfo.location || ''}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className={cn(
                    !isFieldValid('location', personalInfo.location || '') && personalInfo.location && "border-red-500"
                  )}
                />
                {getFieldError('location', personalInfo.location || '') && (
                  <p className="text-xs text-red-500">{getFieldError('location', personalInfo.location || '')}</p>
                )}
              </div>
            </div>
          </div>

          {/* Professional Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Professional Links
              <Badge variant="outline" className="text-xs">Optional</Badge>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* LinkedIn */}
              <div className="space-y-2">
                <Label htmlFor="linkedin" className="flex items-center gap-1">
                  <Linkedin className="h-3 w-3" />
                  LinkedIn Profile
                </Label>
                <Input
                  id="linkedin"
                  placeholder="linkedin.com/in/johndoe"
                  value={personalInfo.linkedin || ''}
                  onChange={(e) => handleInputChange('linkedin', e.target.value)}
                />
              </div>

              {/* Website/Portfolio */}
              <div className="space-y-2">
                <Label htmlFor="website" className="flex items-center gap-1">
                  <Briefcase className="h-3 w-3" />
                  Website/Portfolio
                </Label>
                <Input
                  id="website"
                  placeholder="www.johndoe.com"
                  value={personalInfo.website || ''}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                />
              </div>

              {/* GitHub */}
              <div className="space-y-2">
                <Label htmlFor="github" className="flex items-center gap-1">
                  <Github className="h-3 w-3" />
                  GitHub Profile
                </Label>
                <Input
                  id="github"
                  placeholder="github.com/johndoe"
                  value={personalInfo.github || ''}
                  onChange={(e) => handleInputChange('github', e.target.value)}
                />
              </div>

              {/* Portfolio */}
              <div className="space-y-2">
                <Label htmlFor="portfolio" className="flex items-center gap-1">
                  <Globe className="h-3 w-3" />
                  Portfolio URL
                </Label>
                <Input
                  id="portfolio"
                  placeholder="portfolio.johndoe.com"
                  value={personalInfo.portfolio || ''}
                  onChange={(e) => handleInputChange('portfolio', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Tips */}
          <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
            <CardContent className="p-4">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">💡 Pro Tips</h4>
              <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                <li>• Use a professional email address (avoid nicknames or numbers)</li>
                <li>• Include your city and state, but you can omit your full address</li>
                <li>• Make sure your LinkedIn profile is up-to-date and matches your resume</li>
                <li>• Only include links that are professional and relevant to your career</li>
              </ul>
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {isStepComplete ? (
                <span className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  All required information completed
                </span>
              ) : (
                <span className="flex items-center gap-2 text-amber-600">
                  <AlertCircle className="h-4 w-4" />
                  Please complete all required fields to continue
                </span>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                // Auto-fill with sample data for testing
                actions.updatePersonalInfo({
                  name: 'John Doe',
                  email: 'john.doe@email.com',
                  phone: '(555) 123-4567',
                  location: 'San Francisco, CA',
                  linkedin: 'linkedin.com/in/johndoe',
                  website: 'www.johndoe.com'
                });
              }}
            >
              Fill Sample Data
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
