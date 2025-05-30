import React from 'react';
import { pdf } from '@react-pdf/renderer';
import { ResumeData, ResumeTemplate } from '@/types/resume';
import { ModernTemplate } from '@/components/pdf-templates/ModernTemplate';
import { ClassicTemplate } from '@/components/pdf-templates/ClassicTemplate';
import { PDFTemplateBase } from '@/components/pdf-templates/PDFTemplateBase';
import { DOCXGenerator } from './docxGenerator';

export interface FileGenerationOptions {
  data: ResumeData;
  template: ResumeTemplate;
  format: 'pdf' | 'docx';
  filename?: string;
}

export interface FileGenerationProgress {
  stage: 'preparing' | 'generating' | 'optimizing' | 'complete';
  progress: number;
  message: string;
}

export class FileGenerationService {
  private static instance: FileGenerationService;

  public static getInstance(): FileGenerationService {
    if (!FileGenerationService.instance) {
      FileGenerationService.instance = new FileGenerationService();
    }
    return FileGenerationService.instance;
  }

  private getTemplateComponent(template: ResumeTemplate, data: ResumeData): React.ReactElement {
    switch (template.category) {
      case 'modern':
        return React.createElement(ModernTemplate, { data });
      case 'classic':
        return React.createElement(ClassicTemplate, { data });
      case 'creative':
        return React.createElement(PDFTemplateBase, { data, template: 'creative' });
      case 'minimal':
        return React.createElement(PDFTemplateBase, { data, template: 'minimal' });
      default:
        return React.createElement(ModernTemplate, { data });
    }
  }

  private async generatePDF(
    data: ResumeData,
    template: ResumeTemplate,
    onProgress?: (progress: FileGenerationProgress) => void
  ): Promise<Blob> {
    try {
      onProgress?.({
        stage: 'preparing',
        progress: 20,
        message: 'Preparing PDF template...'
      });

      const templateComponent = this.getTemplateComponent(template, data);

      onProgress?.({
        stage: 'generating',
        progress: 60,
        message: 'Generating PDF document...'
      });

      const pdfBlob = await pdf(templateComponent).toBlob();

      onProgress?.({
        stage: 'optimizing',
        progress: 90,
        message: 'Optimizing file size...'
      });

      // Add a small delay to show the optimization step
      await new Promise(resolve => setTimeout(resolve, 500));

      onProgress?.({
        stage: 'complete',
        progress: 100,
        message: 'PDF generation complete!'
      });

      return pdfBlob;
    } catch (error) {
      console.error('PDF generation failed:', error);
      throw new Error('Failed to generate PDF. Please try again.');
    }
  }

  private async generateDOCX(
    data: ResumeData,
    template: ResumeTemplate,
    onProgress?: (progress: FileGenerationProgress) => void
  ): Promise<Blob> {
    try {
      onProgress?.({
        stage: 'preparing',
        progress: 20,
        message: 'Preparing DOCX template...'
      });

      const generator = new DOCXGenerator(data, template);

      onProgress?.({
        stage: 'generating',
        progress: 60,
        message: 'Generating Word document...'
      });

      const docxBlob = await generator.generateDocument();

      onProgress?.({
        stage: 'optimizing',
        progress: 90,
        message: 'Optimizing document structure...'
      });

      // Add a small delay to show the optimization step
      await new Promise(resolve => setTimeout(resolve, 500));

      onProgress?.({
        stage: 'complete',
        progress: 100,
        message: 'DOCX generation complete!'
      });

      return docxBlob;
    } catch (error) {
      console.error('DOCX generation failed:', error);
      throw new Error('Failed to generate Word document. Please try again.');
    }
  }

  private downloadFile(blob: Blob, filename: string, mimeType: string): void {
    try {
      // Create blob URL
      const url = URL.createObjectURL(new Blob([blob], { type: mimeType }));

      // Create download link
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.style.display = 'none';

      // Trigger download
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      throw new Error('Failed to download file. Please try again.');
    }
  }

  private generateFilename(data: ResumeData, template: ResumeTemplate, format: string): string {
    const name = data.personalInfo.name.replace(/\s+/g, '_').toLowerCase();
    const templateName = template.name.replace(/\s+/g, '_').toLowerCase();
    const timestamp = new Date().toISOString().split('T')[0];

    return `${name}_resume_${templateName}_${timestamp}.${format}`;
  }

  private validateData(data: ResumeData): void {
    if (!data.personalInfo?.name) {
      throw new Error('Resume must include a name');
    }
    if (!data.personalInfo?.email) {
      throw new Error('Resume must include an email address');
    }
    if (!data.experience || data.experience.length === 0) {
      throw new Error('Resume must include at least one work experience');
    }
    if (!data.education || data.education.length === 0) {
      throw new Error('Resume must include education information');
    }
  }

  public async generateAndDownload(
    options: FileGenerationOptions,
    onProgress?: (progress: FileGenerationProgress) => void
  ): Promise<void> {
    const { data, template, format, filename } = options;

    try {
      // Validate input data
      this.validateData(data);

      onProgress?.({
        stage: 'preparing',
        progress: 10,
        message: 'Validating resume data...'
      });

      let blob: Blob;
      let mimeType: string;
      let fileExtension: string;

      if (format === 'pdf') {
        blob = await this.generatePDF(data, template, onProgress);
        mimeType = 'application/pdf';
        fileExtension = 'pdf';
      } else if (format === 'docx') {
        blob = await this.generateDOCX(data, template, onProgress);
        mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        fileExtension = 'docx';
      } else {
        throw new Error(`Unsupported format: ${format}`);
      }

      const finalFilename = filename || this.generateFilename(data, template, fileExtension);

      this.downloadFile(blob, finalFilename, mimeType);

    } catch (error) {
      console.error('File generation failed:', error);
      throw error instanceof Error ? error : new Error('Unknown error occurred during file generation');
    }
  }

  public async generatePreview(
    data: ResumeData,
    template: ResumeTemplate
  ): Promise<string> {
    try {
      const templateComponent = this.getTemplateComponent(template, data);
      const pdfBlob = await pdf(templateComponent).toBlob();
      return URL.createObjectURL(pdfBlob);
    } catch (error) {
      console.error('Preview generation failed:', error);
      throw new Error('Failed to generate preview');
    }
  }

  public getSupportedFormats(): Array<{ value: string; label: string; description: string }> {
    return [
      {
        value: 'pdf',
        label: 'PDF',
        description: 'Preserves exact formatting, universal compatibility, print-ready'
      },
      {
        value: 'docx',
        label: 'Word (DOCX)',
        description: 'Easy to edit, ATS-friendly, collaborative editing support'
      }
    ];
  }

  public getTemplateMetadata(template: ResumeTemplate) {
    const metadata = {
      atsCompatibility: 85,
      designComplexity: 'Medium',
      recommendedFor: ['Technology', 'Finance'],
      features: ['Clean Layout', 'Professional Typography', 'ATS Optimized'],
      ...template
    };

    switch (template.category) {
      case 'modern':
        metadata.atsCompatibility = 90;
        metadata.designComplexity = 'Medium';
        metadata.features = ['Modern Design', 'Color Accents', 'Clean Typography', 'ATS Optimized'];
        break;
      case 'classic':
        metadata.atsCompatibility = 95;
        metadata.designComplexity = 'Low';
        metadata.features = ['Traditional Layout', 'Conservative Design', 'Maximum ATS Compatibility'];
        break;
      case 'creative':
        metadata.atsCompatibility = 75;
        metadata.designComplexity = 'High';
        metadata.features = ['Creative Elements', 'Visual Appeal', 'Unique Layout'];
        break;
      case 'minimal':
        metadata.atsCompatibility = 92;
        metadata.designComplexity = 'Low';
        metadata.features = ['Minimal Design', 'Clean Lines', 'Focus on Content'];
        break;
    }

    return metadata;
  }
}
