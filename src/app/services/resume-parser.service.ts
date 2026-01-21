import { Injectable } from '@angular/core';
import { ResumeData } from '../models';

declare const require: any;

@Injectable({
  providedIn: 'root'
})
export class ResumeParserService {
  async parseResume(filePath: string): Promise<ResumeData> {
    try {
      // Lazy load fs and pdf-parse - only available in Node.js environment
      let fs: any;
      let PDFParser: any;
      try {
        fs = require('fs');
        PDFParser = require('pdf-parse');
      } catch (e) {
        console.error('Node.js modules not available in browser environment');
        return this.getDefaultResumeData();
      }

      if (!fs.existsSync(filePath)) {
        console.warn(`Resume file not found: ${filePath}`);
        return this.getDefaultResumeData();
      }

      const fileBuffer = fs.readFileSync(filePath);
      const pdfData = await PDFParser(fileBuffer);
      const text = pdfData.text;

      return this.extractDataFromText(text);
    } catch (error) {
      console.error('Error parsing resume:', error);
      return this.getDefaultResumeData();
    }
  }

  private extractDataFromText(text: string): ResumeData {
    return {
      experience: this.extractExperience(text),
      skills: this.extractSkills(text),
      currentCTC: this.extractCurrentCTC(text),
      expectedCTC: this.extractExpectedCTC(text),
      location: this.extractLocation(text),
      noticePeriod: this.extractNoticePeriod(text)
    };
  }

  private extractExperience(text: string): string {
    const patterns = [
      /(\d+)\s*years?\s*of\s*experience/i,
      /exp[erience]*:\s*(\d+)\s*y/i,
      /total\s*exp[erience]*:\s*(\d+)/i,
      /(\d+)\s*yrs?/i
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) {
        return match[1];
      }
    }
    return '';
  }

  private extractSkills(text: string): string[] {
    const patterns = [
      /skills?[:\s]*([\w+\s,\.]+?)(?=experience|education|$)/i,
      /technical\s*skills?[:\s]*([\w+\s,\.]+?)(?=\n\n|\n[A-Z])/i
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) {
        return match[1]
          .split(/[,;]/)
          .map((s) => s.trim())
          .filter((s) => s.length > 0);
      }
    }
    return [];
  }

  private extractCurrentCTC(text: string): string {
    const patterns = [
      /current\s*ctc[:\s]*₹?\s*([\d.]+)/i,
      /current\s*salary[:\s]*₹?\s*([\d.]+)/i,
      /ctc[:\s]*₹?\s*([\d.]+)/i
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) {
        return match[1];
      }
    }
    return '';
  }

  private extractExpectedCTC(text: string): string {
    const patterns = [
      /expected\s*ctc[:\s]*₹?\s*([\d.]+)/i,
      /expected\s*salary[:\s]*₹?\s*([\d.]+)/i,
      /salary\s*expectation[:\s]*₹?\s*([\d.]+)/i
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) {
        return match[1];
      }
    }
    return '';
  }

  private extractLocation(text: string): string {
    const patterns = [
      /location[:\s]*([A-Za-z\s,]+?)(?=\n|$)/i,
      /based\s*in\s*([A-Za-z\s,]+?)(?=\n|$)/i,
      /city[:\s]*([A-Za-z\s,]+?)(?=\n|$)/i
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) {
        return match[1].trim();
      }
    }
    return '';
  }

  private extractNoticePeriod(text: string): string {
    const patterns = [
      /notice\s*period[:\s]*(\d+)\s*days?/i,
      /available\s*in\s*(\d+)\s*days?/i,
      /notice[:\s]*(\d+)/i
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) {
        return match[1];
      }
    }
    return '30';
  }

  private getDefaultResumeData(): ResumeData {
    return {
      experience: '',
      skills: [],
      currentCTC: '',
      expectedCTC: '',
      location: '',
      noticePeriod: '30'
    };
  }
}
