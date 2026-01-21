import { Injectable } from '@angular/core';
import { Job, ApplicationLog, AutomationConfig, ResumeData } from '../models';
import { LoggerService } from './logger.service';
import { FormHandlerService } from './form-handler.service';
import { ResumeParserService } from './resume-parser.service';

@Injectable({
  providedIn: 'root'
})
export class JobApplicatorService {
  constructor(
    private logger: LoggerService,
    private formHandler: FormHandlerService,
    private resumeParser: ResumeParserService
  ) {}

  async applyForJobs(
    page: any,
    jobs: Job[],
    config: AutomationConfig,
    onUpdate?: (log: ApplicationLog) => void
  ): Promise<ApplicationLog[]> {
    const applicationLogs: ApplicationLog[] = [];

    // Load resume data once
    const resumePath = `${config.resumeConfig.resumeFolderPath}/${config.resumeConfig.defaultResumeName}`;
    let resumeData: any = null;
    
    try {
      resumeData = await this.resumeParser.parseResume(resumePath);
    } catch (e) {
      console.warn('Could not parse resume:', e);
    }

    console.log(`📋 Starting to apply for ${jobs.length} jobs...`);

    for (let i = 0; i < jobs.length; i++) {
      const job = jobs[i];
      console.log(`\n[${i + 1}/${jobs.length}] Processing: ${job.title} at ${job.company}`);

      try {
        console.log(`   📍 Navigating to job: ${job.url}`);
        await page.goto(job.url, { waitUntil: 'networkidle2', timeout: 60000 });
        await page.waitForTimeout(1000);

        // Look for apply button
        const applySelectors = [
          '.applyBtn',
          'button[data-apply]',
          'a[data-apply]',
          '[class*="apply"]',
          'button:contains("Apply")',
          '.btn-apply',
          '[data-qa="buttonApplyJob"]'
        ];

        let applyButton = null;
        for (const selector of applySelectors) {
          try {
            applyButton = await page.$(selector);
            if (applyButton) {
              console.log(`   ✓ Found apply button with selector: ${selector}`);
              break;
            }
          } catch (e) {
            // Continue to next selector
          }
        }

        if (!applyButton) {
          const log: ApplicationLog = {
            jobId: job.id,
            jobTitle: job.title,
            company: job.company,
            postedDate: job.postedDate,
            skills: job.skills,
            appliedDate: new Date(),
            status: 'skipped',
            reason: '⏭️ Apply button not found (already applied?)'
          };
          applicationLogs.push(log);
          onUpdate?.(log);
          console.log(`   ⏭️ Skipped - apply button not found`);
          continue;
        }

        console.log(`   👆 Clicking apply button...`);
        await applyButton.click();
        await page.waitForTimeout(2000);

        // Check for popup form
        let formHandled = false;
        if (config.resumeConfig.autoFillForms && resumeData) {
          console.log(`   📝 Attempting to fill form...`);
          try {
            formHandled = await this.formHandler.detectAndFillForm(page, config, resumeData);
            if (formHandled) {
              console.log(`   ✓ Form filled successfully`);
            }
          } catch (e) {
            console.log(`   ⚠️ Could not fill form:`, e);
          }
        }

        // Wait for application success
        await page.waitForTimeout(2000);

        const log: ApplicationLog = {
          jobId: job.id,
          jobTitle: job.title,
          company: job.company,
          postedDate: job.postedDate,
          skills: job.skills,
          appliedDate: new Date(),
          status: 'applied',
          formFilled: formHandled
        };

        applicationLogs.push(log);
        onUpdate?.(log);
        this.logger.logApplication(log);
        
        const formMsg = formHandled ? ' (Form filled)' : '';
        console.log(`   ✅ Successfully applied for: ${job.title}${formMsg}`);
      } catch (error: any) {
        const log: ApplicationLog = {
          jobId: job.id,
          jobTitle: job.title,
          company: job.company,
          postedDate: job.postedDate,
          skills: job.skills,
          appliedDate: new Date(),
          status: 'failed',
          reason: `❌ ${error.message}`
        };
        applicationLogs.push(log);
        onUpdate?.(log);
        console.error(`   ❌ Failed to apply:`, error.message);
      }
    }

    console.log(`\n🎉 Application process complete!`);
    return applicationLogs;
  }
}
