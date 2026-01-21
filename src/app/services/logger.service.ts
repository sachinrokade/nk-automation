import { Injectable } from '@angular/core';
import { ApplicationLog } from '../models';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {
  private logs: ApplicationLog[] = [];

  logApplication(log: ApplicationLog): void {
    this.logs.push(log);
    this.printLog(log);
  }

  private printLog(log: ApplicationLog): void {
    const logEntry = `
    [${log.appliedDate.toISOString()}] ${log.status.toUpperCase()}
    Job: ${log.jobTitle}
    Company: ${log.company}
    Posted: ${log.postedDate.toDateString()}
    Skills: ${log.skills.join(', ')}
    ${log.reason ? `Reason: ${log.reason}` : ''}
    `;
    console.log(logEntry);
  }

  getLogs(): ApplicationLog[] {
    return this.logs;
  }

  exportLogs(): string {
    return this.logs
      .map(
        (log) =>
          `${log.appliedDate.toISOString()} | ${log.status} | ${log.jobTitle} | ${log.company} | ${log.postedDate.toDateString()} | ${log.skills.join(',')} | ${log.reason || 'N/A'}`
      )
      .join('\n');
  }
}
