# ⚡ Quick Start - 5 Minutes to Job Applications

## 🎯 TL;DR

1. Run: `npm start`
2. Click: "▶️ Start Automation"
3. Log in: Manually in the browser window (handle CAPTCHA/OTP)
4. Watch: Real-time job applications on UI
5. Done! 🎉

---

## 📋 Prerequisites

Before you start, ensure:

- ✅ Node.js installed (`node --version`)
- ✅ Dependencies installed (`npm install` already done)
- ✅ Config file updated: `/src/assets/config/app-config.json`

---

## 1️⃣ Update Configuration

Edit `/src/assets/config/app-config.json`:

```json
{
  "naukri": {
    "username": "your-email@gmail.com",
    "password": "your-password"  // Not used in manual login, but keep it
  },
  "jobSearch": {
    "skills": ["Java", "Spring Boot"],     // YOUR SKILLS
    "excludeCompanies": ["Accenture"],     // COMPANIES TO SKIP
    "location": "India",                   // YOUR LOCATION
    "experience": "0-6",                   // YOUR EXPERIENCE
    "currentCTC": "18",                    // CURRENT SALARY IN LPA
    "expectedCTC": "24"                    // EXPECTED SALARY IN LPA
  }
}
```

---

## 2️⃣ Start the Application

```bash
npm start
```

Wait for:
```
✔ Compiled successfully
```

Then:
- Browser opens: `http://localhost:4200`
- You see: Naukri Job Automation UI
- Button says: "▶️ Start Automation"

---

## 3️⃣ Click "Start Automation"

UI shows:
```
🔐 Opening Naukri login portal - Please log in manually...
🔔 Waiting for you to login manually...
```

And:
- ✅ Chrome browser opens with Naukri login page
- ✅ **This window is visible** (non-headless mode)
- ✅ You can see exactly what's happening

---

## 4️⃣ Manual Login (You Do This)

In the Chrome browser:

1. Enter your **email/username**
2. Enter your **password**
3. If prompted, complete **CAPTCHA**
4. If prompted, enter **OTP** (check your email)
5. Click **Login**

The system waits for **up to 5 minutes** for you to complete login.

---

## 5️⃣ Watch Real-Time Applications

Once you're logged in, the UI automatically shows:

```
✅ Applied (1) | ⏭️ Skipped (0) | Processing: Java Developer at TCS
```

Updates every 2-3 seconds with:
- Number of jobs **applied**
- Number of jobs **skipped**
- Current job being **processed**

Table shows each job with:
| Job Title | Company | Skills | Posted | Status |
|-----------|---------|--------|--------|--------|
| Java Dev | TCS | Java, Spring Boot | Jan 21 | ✅ Applied |

---

## 6️⃣ Done!

When complete, you see:

```
🎉 Automation completed!
Applied: 23
Skipped: 5
Failed: 0
```

Optional: Click **"📥 Export Logs"** to download CSV with all details.

---

## 📊 What Each Status Means

| Status | Emoji | Meaning |
|--------|-------|---------|
| **Applied** | ✅ | Successfully applied to this job |
| **Skipped** | ⏭️ | Already applied / Apply button not found |
| **Failed** | ❌ | Error occurred while applying |

---

## ⏱️ Time Estimates

| Step | Time |
|------|------|
| Start app | 30 seconds |
| Manual login | 1-2 minutes (you do this) |
| Job search | 30 seconds |
| Apply to jobs | 1-2 minutes (depends on number of jobs) |
| **Total** | **3-5 minutes** |

---

## 🔧 Common Issues & Quick Fixes

### Browser doesn't open
**Check config**: Make sure `"headless": false` in `/src/assets/config/app-config.json`

### Login timeout (waits 5 minutes, then fails)
**Solution**: Log in faster, or increase timeout in code if needed

### No jobs found
**Check criteria**: Skills, location, experience in config might be too restrictive

### Jobs not applying
**Check console**: F12 → Console tab → Look for errors

---

## 📱 What You See on UI

### Before starting:
```
🚀 Naukri Job Automation

📋 Configuration
Skills: Java, Spring Boot, Microservices
Exclude Companies: Accenture
Location: India

▶️ Start Automation    📥 Export Logs

[Status area - empty]
```

### During login:
```
🔐 Opening Naukri login portal - Please log in manually...
```

### During job applications:
```
✅ Applied (5) | ⏭️ Skipped (2) | Processing: Java Developer at TCS

📊 Statistics
Applied: 5
Skipped: 2
Total: 7

📝 Application Logs (7)
[Table showing all jobs...]
```

### After completion:
```
🎉 Automation completed! Applied: 23, Skipped: 5, Failed: 0

📊 Statistics
Applied: 23
Skipped: 5
Total: 28

📝 Application Logs (28)
[Table with all 28 jobs...]
```

---

## 🖥️ Browser Window During Automation

The Chrome browser window:
- ✅ Stays open the entire time
- ✅ Shows the jobs being navigated to
- ✅ You can watch applications happening
- ✅ Useful for debugging if something goes wrong
- ✅ Closes automatically at the end

---

## 📥 Export Logs

After applications complete:

1. Click **"📥 Export Logs"** button
2. File downloads: `naukri-applications-1642764000000.csv`
3. Open in Excel/Google Sheets

File contains:
- Applied date
- Status (Applied/Skipped/Failed)
- Job title
- Company
- Posted date
- Required skills
- Notes/reasons

---

## ✅ Success Checklist

Confirm each before you start:

- [ ] Read this guide
- [ ] Updated `/src/assets/config/app-config.json`
- [ ] Ran `npm start`
- [ ] App compiled without errors
- [ ] Can see UI at `http://localhost:4200`
- [ ] Ready to click "▶️ Start Automation"

---

## 🔐 Security Note

- ✅ Your credentials are only stored in local config file
- ✅ No credentials sent to our servers
- ✅ Browser automation happens locally
- ✅ Only you interact with Naukri

---

## 📞 Need Help?

- Check console logs (F12 in Chrome)
- Read `/src/assets/config/app-config.json` comments
- Check files that changed: `naukri-auth.service.ts`, `app.component.ts`

---

## 🚀 You're Ready!

### Now run:
```bash
npm start
```

### Then:
1. Click "▶️ Start Automation"
2. Log in manually
3. Watch jobs apply in real-time
4. Download results

**Good luck with your job search!** 🎯

---

**Last Updated**: January 21, 2026
**Time to Read**: 5 minutes
**Time to Use**: 3-5 minutes per session
