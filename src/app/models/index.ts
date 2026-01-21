export interface NaukriConfig {
  username: string;
  password: string;
}

export interface JobSearchConfig {
  skills: string[];
  excludeCompanies: string[];
  includeCompanies: string[];
  location: string;
  experience: string;
  currentCTC?: string;
  expectedCTC?: string;
}

export interface AutomationConfig {
  naukri: NaukriConfig;
  jobSearch: JobSearchConfig;
  automation: {
    headless: boolean;
    timeout: number;
    logFilePath: string;
    formSubmitWaitTime?: number;
  };
  resumeConfig: ResumeConfig;
  formFieldMappings: FormFieldMappings;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  postedDate: Date;
  skills: string[];
  description: string;
  url: string;
}

export interface ApplicationLog {
  jobId: string;
  jobTitle: string;
  company: string;
  postedDate: Date;
  skills: string[];
  appliedDate: Date;
  status: 'applied' | 'skipped' | 'failed';
  reason?: string;
  formFilled?: boolean;
}

export interface ResumeConfig {
  resumeFolderPath: string;
  defaultResumeName: string;
  autoFillForms: boolean;
}

export interface FormFieldMappings {
  experience: string[];
  currentCTC: string[];
  expectedCTC: string[];
  location: string[];
  noticePeriod: string[];
  skills: string[];
}

export interface NaukriFormField {
  name: string;
  type: 'text' | 'number' | 'select' | 'radio' | 'checkbox' | 'textarea';
  label: string;
  value?: string;
  options?: string[];
  required: boolean;
}

export interface NaukriForm {
  fields: NaukriFormField[];
  submitButtonSelector: string;
}

export interface ResumeData {
  experience: string;
  skills: string[];
  currentCTC: string;
  expectedCTC: string;
  location: string;
  noticePeriod: string;
}
