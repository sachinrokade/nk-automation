# Quick Start Guide - After Fixes

## What Was Fixed

✅ Angular build compilation errors
✅ Missing dependencies and configuration
✅ Naukri login issues with better selector detection
✅ Enhanced error messages and debugging

## To Run the Application

### Step 1: Verify Configuration
Edit `src/assets/config/app-config.json` and ensure:
```json
{
  "naukri": {
    "username": "YOUR_NAUKRI_EMAIL",
    "password": "YOUR_NAUKRI_PASSWORD"
  },
  ...
}
```

### Step 2: Start the Application
```bash
npm start
```

The application will open in your browser at `http://localhost:4200`

### Step 3: Run Automation
1. Click the "Start Automation" button
2. A browser window will open showing the login process
3. Watch the console for detailed logs
4. If login succeeds, the app will search for jobs
5. Results will appear in the table below

## If Login Still Fails

### Check These First:
1. Can you login to Naukri.com manually? Try it in the same browser
2. Are your credentials correct? Verify them
3. Is your Naukri account active and not locked?
4. Does your password have special JSON characters? If yes, escape them

### Debug Mode:
1. Open Developer Console (F12)
2. Look for messages like:
   - `"Found email input with selector: input#useremail"` ✓ GOOD
   - `"Selector input#useremail not found"` ✗ BAD
3. Note which selectors fail
4. Inspect the Naukri login form (right-click → Inspect)
5. Find the actual input field attributes

### Update Selectors:
If selectors are wrong, update `src/app/services/naukri-auth.service.ts`:
1. Find the `emailSelectors` array around line 39
2. Add your custom selector at the end
3. Restart the app and try again

Example:
```typescript
const emailSelectors = [
  'input[placeholder="Enter your email ID"]',
  'input#useremail',
  'input[name="useremail"]',
  'input[type="email"]',
  'input[placeholder*="email"]',
  'input[class*="email"]'  // Add new selector if needed
];
```

## Key Files

| File | Purpose |
|------|---------|
| `src/assets/config/app-config.json` | Your Naukri credentials & job preferences |
| `src/app/services/naukri-auth.service.ts` | Login logic - modify if selectors change |
| `src/app/app.component.ts` | Main app logic |
| `LOGIN_TROUBLESHOOTING.md` | Detailed troubleshooting guide |
| `FIXES_SUMMARY.md` | Technical details of all fixes |

## Common Issues & Solutions

### "Cannot find puppeteer module"
- Run: `npm install`
- This is normal - puppeteer is optional for browser mode

### "Failed to login to Naukri"
- Check browser console for exact error
- Verify credentials in config file
- Try logging in manually first

### "No jobs found"
- Adjust job search criteria in config file
- Try different skills or locations
- Ensure you're logged in

### Browser shows login page but doesn't fill fields
- Check browser console for selector errors
- Inspect elements and find correct selectors
- Update service file with working selectors

## Important Notes

⚠️ **Security**: Keep your Naukri credentials safe
- Don't commit `app-config.json` with real credentials to version control
- Consider using environment variables for sensitive data

⚠️ **Naukri Terms**: This tool is for automation, ensure it complies with Naukri's terms of service

⚠️ **Rate Limiting**: Naukri may rate-limit requests
- Add delays if needed
- Don't run automation too frequently

## Support

For detailed help, see:
- `LOGIN_TROUBLESHOOTING.md` - Login-specific issues
- `FIXES_SUMMARY.md` - Technical background
- Browser Console (F12) - Real-time debugging

## Next: Make It Better

After the login works, you may want to:
1. Customize job search criteria
2. Add resume parsing logic
3. Improve form filling logic
4. Add scheduling for regular automation
5. Add email notifications for results
