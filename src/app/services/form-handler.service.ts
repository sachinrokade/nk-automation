import { Injectable } from '@angular/core';
import { NaukriForm, NaukriFormField, FormFieldMappings, ResumeData, AutomationConfig } from '../models';
import { ResumeParserService } from './resume-parser.service';

@Injectable({
  providedIn: 'root'
})
export class FormHandlerService {
  constructor(private resumeParser: ResumeParserService) {}

  async detectAndFillForm(
    page: any,
    config: AutomationConfig,
    resumeData?: ResumeData
  ): Promise<boolean> {
    try {
      // Wait for popup to appear
      await page.waitForTimeout(1000);

      const formExists = await page.$('.nk-form, form[role="form"], [class*="modal"]');
      if (!formExists) {
        console.log('No form detected');
        return false;
      }

      console.log('Form detected, parsing fields...');

      // Extract form fields
      const formFields = await this.extractFormFields(page, config.formFieldMappings);

      if (formFields.length === 0) {
        console.log('No form fields found');
        return false;
      }

      // Get resume data if not provided
      if (!resumeData) {
        const resumePath = `${config.resumeConfig.resumeFolderPath}/${config.resumeConfig.defaultResumeName}`;
        resumeData = await this.resumeParser.parseResume(resumePath);
      }

      // Fill form fields
      await this.fillFormFields(page, formFields, config, resumeData);

      // Submit form
      await this.submitForm(page, config);

      console.log('Form submitted successfully');
      return true;
    } catch (error) {
      console.error('Error handling form:', error);
      return false;
    }
  }

  private async extractFormFields(
    page: any,
    fieldMappings: FormFieldMappings
  ): Promise<NaukriFormField[]> {
    return await page.$$eval('input, select, textarea', (elements: any[]) => {
      return elements
        .map((el) => {
          const name = el.getAttribute('name') || el.getAttribute('id') || '';
          const type = el.tagName.toLowerCase() === 'select' ? 'select' : el.getAttribute('type') || 'text';
          const label = el.getAttribute('placeholder') || el.getAttribute('aria-label') || name;
          const required = el.hasAttribute('required');

          const options = type === 'select'
            ? Array.from(el.querySelectorAll('option'))
                .map((opt: any) => opt.textContent || opt.value)
            : [];

          return {
            name,
            type,
            label,
            required,
            options
          };
        })
        .filter((field) => field.name);
    });
  }

  private async fillFormFields(
    page: any,
    fields: NaukriFormField[],
    config: AutomationConfig,
    resumeData: ResumeData
  ): Promise<void> {
    for (const field of fields) {
      const fieldName = field.name.toLowerCase();
      let value = '';

      // Map field to config value
      if (this.matchesFieldType(fieldName, config.formFieldMappings.experience)) {
        value = resumeData.experience || config.jobSearch.experience || '';
      } else if (this.matchesFieldType(fieldName, config.formFieldMappings.currentCTC)) {
        value = resumeData.currentCTC || config.jobSearch.currentCTC || '';
      } else if (this.matchesFieldType(fieldName, config.formFieldMappings.expectedCTC)) {
        value = resumeData.expectedCTC || config.jobSearch.expectedCTC || '';
      } else if (this.matchesFieldType(fieldName, config.formFieldMappings.location)) {
        value = resumeData.location || config.jobSearch.location || '';
      } else if (this.matchesFieldType(fieldName, config.formFieldMappings.noticePeriod)) {
        value = resumeData.noticePeriod || '30';
      }

      if (value) {
        await this.fillField(page, field, value);
        console.log(`Filled field: ${field.name} = ${value}`);
      }
    }
  }

  private matchesFieldType(fieldName: string, mappings: string[]): boolean {
    return mappings.some((mapping) => fieldName.includes(mapping.toLowerCase()));
  }

  private async fillField(page: any, field: NaukriFormField, value: string): Promise<void> {
    try {
      const selector = `[name="${field.name}"], [id="${field.name}"]`;

      if (field.type === 'select') {
        await page.select(selector, value);
      } else if (field.type === 'radio') {
        const radioSelector = `input[name="${field.name}"][value="${value}"]`;
        await page.click(radioSelector);
      } else if (field.type === 'checkbox') {
        const checkboxSelector = `input[name="${field.name}"][value="${value}"]`;
        await page.click(checkboxSelector);
      } else {
        await page.type(selector, value);
      }
    } catch (error) {
      console.warn(`Could not fill field ${field.name}:`, error);
    }
  }

  private async submitForm(page: any, config: AutomationConfig): Promise<void> {
    try {
      // Try different submit button selectors
      const submitSelectors = [
        'button[type="submit"]',
        'button:contains("Submit")',
        'button:contains("Apply")',
        '.nk-btn-submit',
        '[class*="submit"]'
      ];

      for (const selector of submitSelectors) {
        const button = await page.$(selector);
        if (button) {
          await button.click();
          await page.waitForTimeout(config.automation.formSubmitWaitTime);
          return;
        }
      }

      // Fallback: press Enter key
      await page.keyboard.press('Enter');
      await page.waitForTimeout(config.automation.formSubmitWaitTime);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  }

  async hasFormPopup(page: any): Promise<boolean> {
    try {
      const formElements = await page.$$(
        '.nk-form, form[role="form"], [class*="modal"], [class*="popup"], [class*="dialog"]'
      );
      return formElements.length > 0;
    } catch (error) {
      return false;
    }
  }
}
