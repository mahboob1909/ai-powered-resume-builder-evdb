import puppeteer from 'puppeteer';
import fs from 'fs/promises';
import path from 'path';
import Handlebars from 'handlebars';
import { registerHelpers } from './templateHelpers';

// Register Handlebars helpers
registerHelpers();

export interface ResumeData {
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    location: string;
    website?: string;
    linkedin?: string;
    summary: string;
  };
  experience: Array<{
    company: string;
    position: string;
    startDate: string;
    endDate?: string;
    current: boolean;
    description: string[];
    location: string;
  }>;
  education: Array<{
    institution: string;
    degree: string;
    field: string;
    startDate: string;
    endDate?: string;
    gpa?: string;
    honors?: string;
  }>;
  skills: string[];
  template: string;
}

export interface CoverLetterData {
  companyName: string;
  jobTitle: string;
  hiringManagerName?: string;
  content: {
    opening: string;
    body: string[];
    closing: string;
  };
  template: string;
}

export class PDFGenerator {
  private browser: puppeteer.Browser | null = null;

  async initialize() {
    if (!this.browser) {
      this.browser = await puppeteer.launch({
        headless: 'new',
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--disable-gpu'
        ]
      });
    }
  }

  async generatePDF(resumeData: ResumeData): Promise<Buffer> {
    await this.initialize();

    if (!this.browser) {
      throw new Error('Failed to initialize browser');
    }

    const page = await this.browser.newPage();

    try {
      // Load the appropriate template
      const templatePath = path.join(__dirname, '..', 'templates', `${resumeData.template}.hbs`);
      let templateContent: string;

      try {
        templateContent = await fs.readFile(templatePath, 'utf-8');
      } catch (error) {
        // Fallback to modern template if requested template doesn't exist
        console.warn(`Template ${resumeData.template} not found, using modern template`);
        const fallbackPath = path.join(__dirname, '..', 'templates', 'modern.hbs');
        templateContent = await fs.readFile(fallbackPath, 'utf-8');
      }

      // Compile the template
      const template = Handlebars.compile(templateContent);
      const html = template(resumeData);

      // Set page content
      await page.setContent(html, {
        waitUntil: 'networkidle0'
      });

      // Generate PDF
      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '0.5in',
          right: '0.5in',
          bottom: '0.5in',
          left: '0.5in'
        },
        preferCSSPageSize: true
      });

      return pdfBuffer;
    } finally {
      await page.close();
    }
  }

  async generateCoverLetterPDF(coverLetterData: CoverLetterData): Promise<Buffer> {
    await this.initialize();

    if (!this.browser) {
      throw new Error('Failed to initialize browser');
    }

    const page = await this.browser.newPage();

    try {
      // Load the appropriate cover letter template
      const templatePath = path.join(__dirname, '..', 'templates', `cover-letter-${coverLetterData.template}.hbs`);
      let templateContent: string;

      try {
        templateContent = await fs.readFile(templatePath, 'utf-8');
      } catch (error) {
        // Fallback to professional template if requested template doesn't exist
        console.warn(`Cover letter template ${coverLetterData.template} not found, using professional template`);
        const fallbackPath = path.join(__dirname, '..', 'templates', 'cover-letter-professional.hbs');
        templateContent = await fs.readFile(fallbackPath, 'utf-8');
      }

      // Compile the template
      const template = Handlebars.compile(templateContent);
      const html = template({
        ...coverLetterData,
        currentDate: new Date().toISOString().split('T')[0]
      });

      // Set page content
      await page.setContent(html, {
        waitUntil: 'networkidle0'
      });

      // Generate PDF
      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '0.5in',
          right: '0.5in',
          bottom: '0.5in',
          left: '0.5in'
        },
        preferCSSPageSize: true
      });

      return pdfBuffer;
    } finally {
      await page.close();
    }
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }
}

// Singleton instance
export const pdfGenerator = new PDFGenerator();

// Cleanup on process exit
process.on('exit', () => {
  pdfGenerator.close();
});

process.on('SIGINT', () => {
  pdfGenerator.close();
  process.exit(0);
});

process.on('SIGTERM', () => {
  pdfGenerator.close();
  process.exit(0);
});