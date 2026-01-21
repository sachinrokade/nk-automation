import { Injectable } from '@angular/core';
import { Job, JobSearchConfig } from '../models';

@Injectable({
  providedIn: 'root'
})
export class JobSearchService {
  async searchJobs(page: any, config: JobSearchConfig): Promise<Job[]> {
    const jobs: Job[] = [];

    try {
      for (const skill of config.skills) {
        console.log(`Searching for jobs with skill: ${skill}`);
        await this.searchBySkill(page, skill, config, jobs);
      }

      return this.sortJobsByDate(jobs);
    } catch (error) {
      console.error('Job search failed:', error);
      return jobs;
    }
  }

  private async searchBySkill(
    page: any,
    skill: string,
    config: JobSearchConfig,
    jobs: Job[]
  ): Promise<void> {
    const searchUrl = `https://www.naukri.com/${skill.toLowerCase()}-jobs`;
    await page.goto(searchUrl, { waitUntil: 'networkidle2' });

    const jobListings = await page.$$eval('.jobTuple', (elements: any[]) => {
      return elements.map((el) => ({
        id: el.getAttribute('data-job-id'),
        title: el.querySelector('.jobTitle')?.textContent?.trim(),
        company: el.querySelector('.companyName')?.textContent?.trim(),
        location: el.querySelector('.location')?.textContent?.trim(),
        postedDate: el.querySelector('.postedOn')?.textContent?.trim(),
        url: el.querySelector('a')?.href
      }));
    });

    for (const listing of jobListings) {
      if (this.shouldIncludeJob(listing.company, config)) {
        jobs.push({
          id: listing.id,
          title: listing.title,
          company: listing.company,
          location: listing.location,
          postedDate: new Date(listing.postedDate),
          skills: [skill],
          description: '',
          url: listing.url
        });
      }
    }
  }

  private shouldIncludeJob(company: string, config: JobSearchConfig): boolean {
    const isExcluded = config.excludeCompanies.some(
      (exc) => company.toLowerCase().includes(exc.toLowerCase())
    );

    if (config.includeCompanies.length > 0) {
      const isIncluded = config.includeCompanies.some(
        (inc) => company.toLowerCase().includes(inc.toLowerCase())
      );
      return !isExcluded && isIncluded;
    }

    return !isExcluded;
  }

  private sortJobsByDate(jobs: Job[]): Job[] {
    return jobs.sort(
      (a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime()
    );
  }
}
