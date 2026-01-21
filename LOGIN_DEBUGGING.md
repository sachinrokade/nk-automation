# 🔧 LOGIN TROUBLESHOOTING GUIDE

## ❌ "Login cancelled or timeout" Error

If you're getting this error, here's what to check:

---

## 🔍 Diagnostic Checklist

### 1️⃣ Did Browser Window Open?
**Check**: Look at your taskbar or desktop

**If NO browser window opened**:
- Close the app: Ctrl+C in terminal
- Check if you have Chrome/Chromium installed
- Try: `npm start` again
- If still nothing, check browser config in code

**If YES, browser opened**:
- Continue to next step

---

### 2️⃣ Did You See Naukri Login Page?
**Check**: Did you see the login form in the browser?

**If NO - blank page or error**:
- Browser might be loading - wait 5-10 seconds
- Check internet connection
- Try refreshing browser (F5)
- Check if Naukri is down (try naukri.com in new tab)

**If YES - login form visible**:
- Continue to next step

---

### 3️⃣ Could You Enter Your Credentials?
**Check**: Were you able to type your email and password?

**If NO - fields not responding**:
- Browser might be frozen
- Try clicking in the email field
- Try refreshing (F5)
- Close browser and try again (click Start Automation again)

**If YES - you entered credentials**:
- Continue to next step

---

### 4️⃣ Did CAPTCHA Block You?
**Check**: Did you see "I'm not a robot" verification?

**If YES - CAPTCHA appeared**:
- ✅ That's NORMAL! Manual login handles this
- Complete the CAPTCHA challenge
- This is why manual login is better than automation
- System will wait for you

**After completing CAPTCHA**:
- Continue to next step

---

### 5️⃣ Did OTP Appear?
**Check**: Did you get an OTP (One-Time Password)?

**If YES - OTP sent to email**:
- ✅ That's NORMAL! Check your email
- Copy the OTP code
- Paste it in the browser
- This is why manual login is better than automation

**After entering OTP**:
- Continue to next step

---

### 6️⃣ Did You Click Login?
**Check**: Did you click the "Login" button?

**If NO - you forgot to click**:
- 👆 Click the blue "Login" button in the browser
- Wait for page to load

**If YES - clicked and waiting**:
- Continue to next step

---

### 7️⃣ What's the Current Status?
**Check**: What does the Naukri page show now?

| Status | Action |
|--------|--------|
| Loading... | Wait 5-10 more seconds |
| Login error | Try credentials again (different email?) |
| Logged in! ✓ | System should auto-detect in 5-10 seconds |
| Still on login page | Click Login button again |

---

## 🆘 Common Issues & Solutions

### Issue: "Timeout" Error After 10 Minutes

**Causes**:
1. ❌ Login never completed
2. ❌ System couldn't detect successful login
3. ❌ Browser crashed/closed

**Solutions**:
1. ✅ Click "▶️ Start Automation" again
2. ✅ Log in faster (within 10 minutes this time)
3. ✅ Check if browser window actually opened
4. ✅ Try different email/password combination

---

### Issue: Browser Never Opened

**Causes**:
1. ❌ Chrome/Chromium not installed
2. ❌ Puppeteer not properly installed
3. ❌ Port conflicts
4. ❌ System permissions issue

**Solutions**:
```bash
# 1. Install Puppeteer
npm install puppeteer

# 2. Clear node modules and reinstall
rm -rf node_modules
npm install

# 3. Check if Chrome is installed
which google-chrome
# or
which chromium
```

---

### Issue: "I logged in but system didn't detect it"

**Causes**:
1. ❌ URL pattern not recognized
2. ❌ Page still loading
3. ❌ Session not fully established

**Solutions**:
1. ✅ Wait a bit longer after clicking Login
2. ✅ Check if you're actually logged in (look for profile icon)
3. ✅ Try manual page navigation (visit a job page in the browser)
4. ✅ Click "▶️ Start Automation" again

---

### Issue: CAPTCHA Won't Load

**Causes**:
1. ❌ Browser extension blocking it
2. ❌ JavaScript not enabled
3. ❌ Naukri is blocking the request

**Solutions**:
1. ✅ Try in a regular Chrome window (not in automation)
2. ✅ Clear browser cache and cookies
3. ✅ Try on a different network (if possible)
4. ✅ Wait 24 hours if blocked (Naukri temporary ban)

---

### Issue: OTP Not Received

**Causes**:
1. ❌ Spam folder
2. ❌ Wrong email configured
3. ❌ Email server delay

**Solutions**:
1. ✅ Check spam folder
2. ✅ Verify email in config is correct
3. ✅ Request new OTP (there's usually a button)
4. ✅ Wait 5 minutes for email to arrive

---

## 🎯 Step-by-Step: What Should Happen

### Expected Timeline

```
0:00  → Click "▶️ Start Automation"
       → You see: "🔐 MANUAL LOGIN REQUIRED"
       → You see: "👉 In the browser window that opened:"
       → You see: "System waiting... (checking every 2 seconds)"

0:05  → Browser window opens
       → You see Naukri login page
       → Email field is visible

0:10  → You enter your email
       → You enter your password
       → You complete CAPTCHA
       
0:30  → You enter OTP (if requested)
       → You click Login button

0:45  → Page is loading...
       → System checking URL...
       
1:00  → ✅ You see: "✅ Login successful!"
       → System proceeds to job search
       → Real-time counter starts: "Applied (0) | Skipped (0)"
```

---

## 📞 Still Not Working?

### Check Console Logs
1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for messages like:
   ```
   Checking URL: https://www.naukri.com/mnjuser/homepage
   [Login successful detected]
   ```

### Check Application Logs
1. In the terminal running `npm start`
2. Look for error messages
3. Search for "error" or "failed"

### Common Log Patterns

**If you see**:
```
Checking URL (50s): https://www.naukri.com/nlogin/login
```
→ You're still on login page. Try clicking Login button again.

**If you see**:
```
Checking URL (50s): https://www.naukri.com/mnjuser/homepage
✅ Login successful!
```
→ Great! System detected login. Proceed with jobs.

**If you see**:
```
Error: ERR_INVALID_URL
```
→ Browser crashed. Try again.

---

## 🚨 Emergency Actions

### If Everything Fails

1. **Close app**: Ctrl+C in terminal
2. **Close browser**: Alt+F4 (or close manually)
3. **Log in manually**: 
   - Open Chrome
   - Go to naukri.com
   - Log in normally
4. **Try again**: Run `npm start`

---

## ✅ Success Indicators

You'll know login worked when:
- ✅ Browser shows Naukri homepage (not login page)
- ✅ You see your profile in top right
- ✅ UI shows: "✅ Login successful!"
- ✅ Real-time counter appears
- ✅ Job search starts automatically

---

## 💡 Pro Tips

### Tip 1: Have Credentials Ready
- Keep email and password visible before starting
- Don't rely on password manager (might be slow)
- Copy-paste email/password ready

### Tip 2: Stable Internet
- Use stable WiFi or wired connection
- Avoid VPN (some IPs blocked by Naukri)
- Test: `ping naukri.com` before starting

### Tip 3: One Chrome Window
- Don't open other Chrome windows during automation
- Close other browser tabs
- Use dedicated Chrome window for this app

### Tip 4: Browser Zoom
- Make sure browser zoom is 100% (Ctrl+0)
- Some elements might not click if zoom is off

---

## 📋 Quick Reference

| Problem | Quick Fix |
|---------|-----------|
| Timeout | Try again, log in faster |
| No browser | Reinstall: `npm install puppeteer` |
| CAPTCHA blocks | Complete CAPTCHA manually |
| OTP not received | Check spam, request new OTP |
| Still on login | Click Login button |
| Not detecting login | Wait longer, check URL in console |
| System frozen | Ctrl+C, restart |

---

## 🔄 Recovery Steps

If you're stuck:

1. **Terminate**: Ctrl+C in terminal
2. **Close browser**: Alt+F4
3. **Wait**: 5-10 seconds
4. **Start fresh**: Run `npm start` again
5. **Try once more**: Click "▶️ Start Automation"

---

## 📞 Contact Support

If you've tried everything:
1. Note the exact error message
2. Check console logs (F12)
3. Take a screenshot of the error
4. Check if Naukri website is working
5. Try on a different network
6. Try on a different computer if possible

---

## 🎯 Remember

**Manual login is BETTER than automation because**:
- ✅ You handle CAPTCHA (no code can bypass it)
- ✅ You enter OTP (secure)
- ✅ 100% success rate (no flaky automation)
- ✅ You can debug if something wrong
- ✅ Naukri can't block the automation

So if it times out, it's usually:
1. You didn't complete login
2. System couldn't detect the login
3. Browser crashed

**Simple fix**: Try again! 🚀

---

**Last Updated**: January 21, 2026  
**Version**: 2.0 - Manual Login Troubleshooting
