import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle } from 'docx';
import { ResumeData, ResumeTemplate } from '@/types/resume';

export class DOCXGenerator {
  private data: ResumeData;
  private template: ResumeTemplate;

  constructor(data: ResumeData, template: ResumeTemplate) {
    this.data = data;
    this.template = template;
  }

  private createHeader(): Paragraph[] {
    const paragraphs: Paragraph[] = [];

    // Name
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: this.data.personalInfo.name,
            bold: true,
            size: this.template.category === 'classic' ? 32 : 36,
            color: this.template.category === 'modern' ? '3B82F6' : '000000',
          }),
        ],
        alignment: this.template.category === 'classic' ? AlignmentType.CENTER : AlignmentType.LEFT,
        spacing: { after: 200 },
      })
    );

    // Contact Information
    const contactInfo = [
      this.data.personalInfo.email,
      this.data.personalInfo.phone,
      this.data.personalInfo.location,
      this.data.personalInfo.linkedin,
      this.data.personalInfo.website,
    ].filter(Boolean);

    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: contactInfo.join(' • '),
            size: 20,
            color: '6B7280',
          }),
        ],
        alignment: this.template.category === 'classic' ? AlignmentType.CENTER : AlignmentType.LEFT,
        spacing: { after: 400 },
        border: {
          bottom: {
            color: this.template.category === 'modern' ? '3B82F6' : '000000',
            space: 1,
            style: BorderStyle.SINGLE,
            size: this.template.category === 'modern' ? 12 : 6,
          },
        },
      })
    );

    return paragraphs;
  }

  private createSection(title: string, content: Paragraph[]): Paragraph[] {
    const sectionParagraphs: Paragraph[] = [];

    // Section Title
    sectionParagraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: title.toUpperCase(),
            bold: true,
            size: 24,
            color: this.template.category === 'modern' ? '3B82F6' : '000000',
          }),
        ],
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 400, after: 200 },
        border: {
          bottom: {
            color: 'E5E7EB',
            space: 1,
            style: BorderStyle.SINGLE,
            size: 6,
          },
        },
      })
    );

    // Section Content
    sectionParagraphs.push(...content);

    return sectionParagraphs;
  }

  private createSummarySection(): Paragraph[] {
    return this.createSection('Professional Summary', [
      new Paragraph({
        children: [
          new TextRun({
            text: this.data.summary,
            size: 22,
            color: '374151',
          }),
        ],
        spacing: { after: 200 },
        alignment: AlignmentType.JUSTIFIED,
      }),
    ]);
  }

  private createExperienceSection(): Paragraph[] {
    const experienceContent: Paragraph[] = [];

    this.data.experience.forEach((exp, index) => {
      // Job Title
      experienceContent.push(
        new Paragraph({
          children: [
            new TextRun({
              text: exp.position,
              bold: true,
              size: 24,
              color: this.template.category === 'modern' ? '1E40AF' : '000000',
            }),
          ],
          spacing: { before: index > 0 ? 300 : 0, after: 100 },
        })
      );

      // Company Info
      experienceContent.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `${exp.company} • ${exp.location} • ${exp.startDate} - ${exp.endDate}`,
              size: 20,
              color: '6B7280',
              italics: this.template.category === 'classic',
            }),
          ],
          spacing: { after: 150 },
        })
      );

      // Job Description
      exp.description.forEach((desc) => {
        experienceContent.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `• ${desc}`,
                size: 20,
                color: '374151',
              }),
            ],
            spacing: { after: 100 },
            indent: { left: 360 },
          })
        );
      });
    });

    return this.createSection('Professional Experience', experienceContent);
  }

  private createEducationSection(): Paragraph[] {
    const educationContent: Paragraph[] = [];

    this.data.education.forEach((edu, index) => {
      educationContent.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `${edu.degree} in ${edu.field}`,
              bold: true,
              size: 22,
              color: '000000',
            }),
          ],
          spacing: { before: index > 0 ? 200 : 0, after: 100 },
        })
      );

      educationContent.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `${edu.institution} • ${edu.graduationDate}`,
              size: 20,
              color: '6B7280',
              italics: this.template.category === 'classic',
            }),
          ],
          spacing: { after: edu.gpa ? 50 : 150 },
        })
      );

      if (edu.gpa) {
        educationContent.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `GPA: ${edu.gpa}`,
                size: 20,
                color: '6B7280',
              }),
            ],
            spacing: { after: 150 },
          })
        );
      }
    });

    return this.createSection('Education', educationContent);
  }

  private createSkillsSection(): Paragraph[] {
    const skillsText = this.template.category === 'classic' 
      ? this.data.skills.map(skill => `• ${skill}`).join('\n')
      : this.data.skills.join(' • ');

    return this.createSection('Technical Skills', [
      new Paragraph({
        children: [
          new TextRun({
            text: skillsText,
            size: 20,
            color: '374151',
          }),
        ],
        spacing: { after: 200 },
      }),
    ]);
  }

  private createCertificationsSection(): Paragraph[] {
    if (!this.data.certifications || this.data.certifications.length === 0) {
      return [];
    }

    const certContent: Paragraph[] = [];

    this.data.certifications.forEach((cert, index) => {
      certContent.push(
        new Paragraph({
          children: [
            new TextRun({
              text: cert.name,
              bold: true,
              size: 22,
              color: '000000',
            }),
          ],
          spacing: { before: index > 0 ? 200 : 0, after: 100 },
        })
      );

      certContent.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `${cert.issuer} • ${cert.date}${cert.expirationDate ? ` • Expires: ${cert.expirationDate}` : ''}`,
              size: 20,
              color: '6B7280',
            }),
          ],
          spacing: { after: 150 },
        })
      );
    });

    return this.createSection('Certifications', certContent);
  }

  private createProjectsSection(): Paragraph[] {
    if (!this.data.projects || this.data.projects.length === 0) {
      return [];
    }

    const projectContent: Paragraph[] = [];

    this.data.projects.forEach((project, index) => {
      projectContent.push(
        new Paragraph({
          children: [
            new TextRun({
              text: project.name,
              bold: true,
              size: 22,
              color: this.template.category === 'modern' ? '1E40AF' : '000000',
            }),
          ],
          spacing: { before: index > 0 ? 200 : 0, after: 100 },
        })
      );

      projectContent.push(
        new Paragraph({
          children: [
            new TextRun({
              text: project.description,
              size: 20,
              color: '374151',
            }),
          ],
          spacing: { after: 100 },
        })
      );

      projectContent.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `Technologies: ${project.technologies.join(', ')}`,
              size: 18,
              color: '6B7280',
            }),
          ],
          spacing: { after: project.url ? 50 : 150 },
        })
      );

      if (project.url) {
        projectContent.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `URL: ${project.url}`,
                size: 18,
                color: '6B7280',
              }),
            ],
            spacing: { after: 150 },
          })
        );
      }
    });

    return this.createSection('Projects', projectContent);
  }

  public async generateDocument(): Promise<Blob> {
    const paragraphs: Paragraph[] = [
      ...this.createHeader(),
      ...this.createSummarySection(),
      ...this.createExperienceSection(),
      ...this.createEducationSection(),
      ...this.createSkillsSection(),
      ...this.createCertificationsSection(),
      ...this.createProjectsSection(),
    ];

    const doc = new Document({
      sections: [
        {
          properties: {},
          children: paragraphs,
        },
      ],
    });

    return await Packer.toBlob(doc);
  }
}
