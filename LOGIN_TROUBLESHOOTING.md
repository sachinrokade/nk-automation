# Naukri Login Troubleshooting Guide

## Issue: Failed to Login to Naukri

If you're experiencing login failures after clicking "Start Automation", here are the solutions and debugging steps:

### Common Causes and Solutions

#### 1. **Incorrect Credentials**
- Verify your email and password in `src/assets/config/app-config.json`
- Ensure the email matches the one registered on Naukri
- Ensure the password is correct (copy-paste to avoid typos)
- Check if there are any special characters in your password that need escaping in JSON

#### 2. **Website DOM Changes**
Naukri frequently updates their website, which may change the HTML selectors. The improved auth service now tries multiple selector options:
- `input[placeholder="Enter your email ID"]`
- `input#useremail`
- `input[name="useremail"]`
- `input[type="email"]`
- For password: `input[type="password"]`, `input#userpass`, `input[name="userpass"]`
- For submit: `button[type="submit"]`, `button#loginBtn`, `button.btn-primary`, `input[type="submit"]`

**If still failing:** Open `src/assets/config/app-config.json` and check the browser console logs to see which selectors are being tried.

#### 3. **Headless Mode Issues**
The service now runs in **non-headless mode** (`headless: false`) by default, which:
- Opens a visible browser window so you can see what's happening
- Is easier for debugging
- May require a display (X11) in headless environments

To switch back to headless mode:
```typescript
// In naukri-auth.service.ts, line 30
this.browser = await puppeteer.launch({ 
  headless: true,  // Change to true
  args: ['--no-sandbox', '--disable-setuid-sandbox']
});
```

#### 4. **Naukri Rate Limiting or Bot Detection**
Naukri may block automated access:
- Add random delays between actions (already done with `{ delay: 100 }`)
- Check if you're already logged in via browser and close that session
- Try logging in manually first to ensure account is working
- Wait a few minutes and retry

#### 5. **Network/Timeout Issues**
- Check your internet connection
- Ensure `waitUntil: 'networkidle2'` isn't timing out (default 30 seconds)
- Increase timeout if needed in the service

### Debugging Steps

1. **Open Browser Developer Tools**
   - The browser window will be visible (non-headless mode)
   - Check the Console tab for detailed error messages
   - Check the Network tab to see what requests are being made

2. **Check Console Logs**
   - Look for messages like:
     - `"Found email input with selector: ..."` ✓
     - `"Selector input[placeholder='...'] not found"` ✗
   - This shows which selectors are working

3. **Inspect Naukri Page Elements**
   - In the visible browser window, right-click and select "Inspect"
   - Find the email input field and check its:
     - `type` attribute
     - `name` attribute
     - `id` attribute
     - `placeholder` attribute
   - Find the password input and check its attributes
   - Find the login button and check its attributes

4. **Add Custom Selectors**
   If the standard selectors don't work, you can add custom ones to the service:
   ```typescript
   const emailSelectors = [
     // ... existing selectors ...
     'input[data-testid="email"]',  // Add new one
   ];
   ```

### Updating Selectors for Naukri Changes

If Naukri's website has changed and login is failing:

1. Open the app and click "Start Automation"
2. When the browser opens, inspect the email input field
3. Note its selector (id, name, placeholder, class, etc.)
4. Update `src/app/services/naukri-auth.service.ts` with the new selector
5. Restart the app and try again

### Expected Login Flow

1. Browser opens (visible window)
2. Page navigates to Naukri login
3. Email field is filled
4. Password field is filled
5. Submit button is clicked
6. Page waits for navigation
7. Success page is loaded (checks for /mnjuser/ in URL)

### If Nothing Works

The service now provides detailed console logging. Check the browser console for:
- Any JavaScript errors
- Network errors (404, 500, etc.)
- Timeout messages
- Selector not found messages

You may also need to:
1. Manually test the Naukri website to confirm it works
2. Check if Naukri has added CAPTCHA or other verification
3. Check if your account is locked or needs verification
4. Contact Naukri support if your login works on their website but not here

### Configuration Options

In `src/assets/config/app-config.json`:
```json
{
  "naukri": {
    "username": "your-email@gmail.com",
    "password": "your-password"
  },
  "automation": {
    "headless": false,          // Set to false for debugging
    "timeout": 30000,           // 30 second timeout
    "logFilePath": "./logs/applications.log",
    "formSubmitWaitTime": 3000
  }
}
```

### Recent Improvements

The authentication service now includes:
✓ Multiple selector options for resilience
✓ Detailed console logging
✓ Better error messages
✓ Non-headless mode for debugging
✓ Improved navigation detection
✓ Multiple login success detection methods
