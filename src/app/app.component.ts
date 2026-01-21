import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  ConfigService,
  NaukriAuthService,
  JobSearchService,
  JobApplicatorService,
  LoggerService
} from './services';
import { AutomationConfig, ApplicationLog } from './models';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  config: AutomationConfig | null = null;
  isRunning = false;
  status = '';
  applicationLogs: ApplicationLog[] = [];
  appliedCount = 0;
  skippedCount = 0;

  constructor(
    private configService: ConfigService,
    private authService: NaukriAuthService,
    private jobSearch: JobSearchService,
    private jobApplicator: JobApplicatorService,
    private logger: LoggerService
  ) {}

  ngOnInit(): void {
    this.loadConfig();
  }

  loadConfig(): void {
    this.configService.loadConfig().subscribe({
      next: (config) => {
        this.config = config;
        this.status = 'Configuration loaded successfully';
      },
      error: (err) => {
        this.status = `Error loading configuration: ${err.message}`;
      }
    });
  }

  async startAutomation(): Promise<void> {
    if (!this.config) {
      this.status = 'Configuration not loaded';
      return;
    }

    this.isRunning = true;
    this.status = '';
    this.applicationLogs = [];
    this.appliedCount = 0;
    this.skippedCount = 0;

    const updateStatus = (msg: string) => {
      this.status = msg;
      console.log(msg);
    };

    try {
      updateStatus('🔐 Opening Naukri login portal - Please log in manually in the browser window...');
      const loggedIn = await this.authService.login(this.config.naukri, updateStatus);

      if (!loggedIn) {
        updateStatus('❌ Login Failed - Browser window closed or timeout occurred. Please try again.');
        console.log('💡 DEBUGGING TIPS:');
        console.log('   • Did the browser window open? (Check taskbar)');
        console.log('   • Did you see the Naukri login page?');
        console.log('   • Were you able to enter your credentials?');
        console.log('   • Did CAPTCHA or OTP appear and block you?');
        console.log('   • Try clicking "▶️ Start Automation" again');
        return;
      }

      updateStatus('🔍 Searching for matching jobs...');
      const page = this.authService.getPage();
      const jobs = await this.jobSearch.searchJobs(page, this.config.jobSearch);

      if (jobs.length === 0) {
        updateStatus('⚠️ No jobs found matching your criteria. Try broadening your search.');
        return;
      }

      updateStatus(`📊 Found ${jobs.length} jobs. Starting applications...`);
      
      const logs = await this.jobApplicator.applyForJobs(
        page, 
        jobs, 
        this.config,
        (log: ApplicationLog) => {
          this.applicationLogs = [...this.applicationLogs, log];
          if (log.status === 'applied') {
            this.appliedCount++;
            this.status = `✅ Applied (${this.appliedCount}) | ⏭️ Skipped (${this.skippedCount}) | Processing: ${log.jobTitle} at ${log.company}`;
          } else if (log.status === 'skipped') {
            this.skippedCount++;
            this.status = `✅ Applied (${this.appliedCount}) | ⏭️ Skipped (${this.skippedCount}) | Skipped: ${log.jobTitle} at ${log.company}`;
          } else {
            this.status = `✅ Applied (${this.appliedCount}) | ⏭️ Skipped (${this.skippedCount}) | Failed: ${log.jobTitle}`;
          }
        }
      );

      const failedCount = logs.filter((l) => l.status === 'failed').length;
      updateStatus(`🎉 Automation completed! Applied: ${this.appliedCount}, Skipped: ${this.skippedCount}, Failed: ${failedCount}`);
    } catch (error: any) {
      this.status = `❌ Error: ${error.message}`;
      console.error('Automation error:', error);
    } finally {
      await this.authService.logout();
      this.isRunning = false;
    }
  }

  exportLogs(): void {
    // Create CSV format export
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Applied Date,Status,Job Title,Company,Posted Date,Skills,Notes\n';
    
    this.applicationLogs.forEach((log) => {
      const row = [
        log.appliedDate.toISOString(),
        log.status,
        `"${log.jobTitle}"`,
        `"${log.company}"`,
        log.postedDate.toDateString(),
        `"${log.skills.join(', ')}"`,
        `"${log.reason || ''}"`
      ].join(',');
      csvContent += row + '\n';
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `naukri-applications-${new Date().getTime()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
