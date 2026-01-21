# Naukri Job Automation

Automated job search and application system for Naukri.com portal.

## Features

- **Automated Login**: Secure login to Naukri portal
- **Smart Job Search**: Search by specific skills
- **Company Filtering**: Include/exclude specific companies
- **Auto Application**: Automatically apply for matching jobs
- **Application Logging**: Track all applied jobs with details

## Setup Instructions

### Prerequisites
- Node.js v18+
- npm or yarn
- Angular CLI

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure Naukri credentials in `src/assets/config/app-config.json`:
```json
{
  "naukri": {
    "username": "your-email@example.com",
    "password": "your-password"
  },
  "jobSearch": {
    "skills": ["Angular", "TypeScript"],
    "excludeCompanies": ["Company1"],
    "includeCompanies": []
  }
}
```

3. Start the application:
```bash
npm start
```

4. Navigate to `http://localhost:4200`

## Configuration

Edit `src/assets/config/app-config.json`:

- **skills**: Array of job skills to search for
- **excludeCompanies**: Companies to skip during search
- **includeCompanies**: If set, only apply to these companies
- **location**: Job location preference
- **experience**: Experience level filter

## Usage

1. Click "Start Automation"
2. Monitor the status updates
3. View application logs in real-time
4. Export logs as CSV using "Export Logs"

## Logs

Application logs are saved with:
- Applied date/time
- Job title and company
- Posted date
- Skills matched
- Application status