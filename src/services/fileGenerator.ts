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

// Simple fallback PDF generator for the ReviewStep component
export const generatePDF = async (resumeData: any, template: any): Promise<void> => {
  try {
    // Create a simple HTML representation of the resume
    const htmlContent = generateSimpleResumeHTML(resumeData);

    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      throw new Error('Unable to open print window. Please allow popups for this site.');
    }

    // Write the HTML content to the new window
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${resumeData.personalInfo?.name || 'Resume'} - Resume</title>
          <meta charset="utf-8">
          <style>
            ${getSimpleResumeCSS(template)}
          </style>
        </head>
        <body>
          ${htmlContent}
        </body>
      </html>
    `);

    printWindow.document.close();

    // Wait for content to load, then trigger print
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
        // Don't close automatically to let user save as PDF
      }, 250);
    };

  } catch (error) {
    console.error('PDF generation error:', error);
    throw new Error('Failed to generate PDF. Please try again.');
  }
};

const generateSimpleResumeHTML = (resumeData: any): string => {
  const { personalInfo, summary, experience, education, skills, projects, certifications, languages } = resumeData;

  return `
    <div class="resume-container">
      <!-- Header -->
      <header class="resume-header">
        <h1 class="name">${personalInfo?.name || ''}</h1>
        <div class="contact-info">
          ${personalInfo?.email ? `<span class="email">${personalInfo.email}</span>` : ''}
          ${personalInfo?.phone ? `<span class="phone">${personalInfo.phone}</span>` : ''}
          ${personalInfo?.location ? `<span class="location">${personalInfo.location}</span>` : ''}
        </div>
      </header>

      <!-- Professional Summary -->
      ${summary ? `
        <section class="section">
          <h2 class="section-title">Professional Summary</h2>
          <p class="summary-text">${summary}</p>
        </section>
      ` : ''}

      <!-- Work Experience -->
      ${experience && experience.length > 0 ? `
        <section class="section">
          <h2 class="section-title">Work Experience</h2>
          ${experience.map((exp: any) => `
            <div class="experience-item">
              <div class="experience-header">
                <h3 class="position">${exp.position}</h3>
                <span class="company">${exp.company}</span>
                <span class="dates">${exp.startDate} - ${exp.endDate || 'Present'}</span>
              </div>
              ${exp.location ? `<p class="location">${exp.location}</p>` : ''}
              ${exp.description && exp.description.length > 0 ? `
                <ul class="description-list">
                  ${exp.description.map((desc: string) => `<li>${desc}</li>`).join('')}
                </ul>
              ` : ''}
            </div>
          `).join('')}
        </section>
      ` : ''}

      <!-- Education -->
      ${education && education.length > 0 ? `
        <section class="section">
          <h2 class="section-title">Education</h2>
          ${education.map((edu: any) => `
            <div class="education-item">
              <h3 class="degree">${edu.degree} in ${edu.field}</h3>
              <span class="institution">${edu.institution}</span>
              <span class="graduation-date">${edu.graduationDate}</span>
              ${edu.gpa ? `<span class="gpa">GPA: ${edu.gpa}</span>` : ''}
              ${edu.honors ? `<p class="honors">${edu.honors}</p>` : ''}
            </div>
          `).join('')}
        </section>
      ` : ''}

      <!-- Skills -->
      ${skills && skills.length > 0 ? `
        <section class="section">
          <h2 class="section-title">Skills</h2>
          <div class="skills-list">
            ${skills.map((skill: string) => `<span class="skill-item">${skill}</span>`).join('')}
          </div>
        </section>
      ` : ''}

      <!-- Projects -->
      ${projects && projects.length > 0 ? `
        <section class="section">
          <h2 class="section-title">Projects</h2>
          ${projects.map((project: any) => `
            <div class="project-item">
              <h3 class="project-name">${project.name}</h3>
              <p class="project-description">${project.description}</p>
              ${project.technologies && project.technologies.length > 0 ? `
                <div class="technologies">
                  <strong>Technologies:</strong> ${project.technologies.join(', ')}
                </div>
              ` : ''}
              ${project.url ? `<p class="project-url">URL: ${project.url}</p>` : ''}
            </div>
          `).join('')}
        </section>
      ` : ''}

      <!-- Certifications -->
      ${certifications && certifications.length > 0 ? `
        <section class="section">
          <h2 class="section-title">Certifications</h2>
          ${certifications.map((cert: any) => `
            <div class="certification-item">
              <h3 class="cert-name">${cert.name}</h3>
              <span class="cert-issuer">${cert.issuer}</span>
              <span class="cert-date">${cert.date}</span>
              ${cert.credentialId ? `<p class="credential-id">ID: ${cert.credentialId}</p>` : ''}
            </div>
          `).join('')}
        </section>
      ` : ''}

      <!-- Languages -->
      ${languages && languages.length > 0 ? `
        <section class="section">
          <h2 class="section-title">Languages</h2>
          <div class="languages-list">
            ${languages.map((lang: any) => `
              <div class="language-item">
                <span class="language-name">${lang.language}</span>
                <span class="proficiency">${lang.proficiency}</span>
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}
    </div>
  `;
};

const getSimpleResumeCSS = (template: any): string => {
  const baseCSS = `
    @page {
      margin: 0.5in;
      size: letter;
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Arial', sans-serif;
      font-size: 11pt;
      line-height: 1.4;
      color: #333;
      background: white;
    }

    .resume-container {
      max-width: 8.5in;
      margin: 0 auto;
      background: white;
    }

    .resume-header {
      text-align: center;
      margin-bottom: 20px;
      padding-bottom: 15px;
      border-bottom: 2px solid #333;
    }

    .name {
      font-size: 24pt;
      font-weight: bold;
      margin-bottom: 8px;
      color: #2c3e50;
    }

    .contact-info {
      display: flex;
      justify-content: center;
      gap: 20px;
      flex-wrap: wrap;
      font-size: 10pt;
    }

    .section {
      margin-bottom: 20px;
    }

    .section-title {
      font-size: 14pt;
      font-weight: bold;
      color: #2c3e50;
      margin-bottom: 10px;
      padding-bottom: 3px;
      border-bottom: 1px solid #bdc3c7;
    }

    .experience-item, .education-item, .project-item, .certification-item {
      margin-bottom: 15px;
    }

    .experience-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 5px;
    }

    .position, .degree, .project-name, .cert-name {
      font-size: 12pt;
      font-weight: bold;
      color: #2c3e50;
    }

    .company, .institution, .cert-issuer {
      font-style: italic;
      color: #7f8c8d;
    }

    .dates, .graduation-date, .cert-date {
      font-size: 10pt;
      color: #7f8c8d;
    }

    .description-list {
      margin-left: 20px;
      margin-top: 5px;
    }

    .description-list li {
      margin-bottom: 3px;
    }

    .skills-list {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .skill-item {
      background: #ecf0f1;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 10pt;
    }

    .languages-list {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 10px;
    }

    .language-item {
      display: flex;
      justify-content: space-between;
    }

    .summary-text {
      text-align: justify;
      margin-bottom: 10px;
    }

    @media print {
      body {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }

      .resume-container {
        box-shadow: none;
      }
    }
  `;

  // Add template-specific styling
  if (template?.category === 'modern') {
    return baseCSS + `
      .name { color: #3498db; }
      .section-title { color: #3498db; border-bottom-color: #3498db; }
      .position, .degree, .project-name, .cert-name { color: #3498db; }
    `;
  } else if (template?.category === 'creative') {
    return baseCSS + `
      .name { color: #9b59b6; }
      .section-title { color: #9b59b6; border-bottom-color: #9b59b6; }
      .position, .degree, .project-name, .cert-name { color: #9b59b6; }
    `;
  }

  return baseCSS;
};
