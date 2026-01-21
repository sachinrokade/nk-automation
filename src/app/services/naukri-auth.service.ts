import { Injectable } from '@angular/core';
import { NaukriConfig } from '../models';
import { BehaviorSubject, Observable } from 'rxjs';

declare const require: any;

@Injectable({
  providedIn: 'root'
})
export class NaukriAuthService {
  private page: any;
  private browser: any;
  private loginStatusSubject = new BehaviorSubject<boolean>(false);
  public loginStatus$ = this.loginStatusSubject.asObservable();

  async login(config: NaukriConfig, onStatusUpdate?: (status: string) => void): Promise<boolean> {
    try {
      // Lazy load puppeteer - only available in Node.js environment
      let puppeteer: any;
      try {
        puppeteer = require('puppeteer');
      } catch (e) {
        console.error('puppeteer module not available');
        return false;
      }

      const status = (msg: string) => {
        console.log(msg);
        onStatusUpdate?.(msg);
      };

      status('🚀 Launching browser...');
      this.browser = await puppeteer.launch({ 
        headless: false,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--start-maximized']
      });
      this.page = await this.browser.newPage();
      await this.page.setViewport({ width: 1920, height: 1080 });

      status('📱 Opening Naukri login portal...');
      await this.page.goto('https://www.naukri.com/nlogin/login', {
        waitUntil: 'networkidle0',
        timeout: 30000
      });

      await this.page.waitForTimeout(3000);

      status('');
      status('╔════════════════════════════════════════════════════════════╗');
      status('║           🔐 MANUAL LOGIN REQUIRED                         ║');
      status('╚════════════════════════════════════════════════════════════╝');
      status('');
      status('👉 In the browser window that opened:');
      status('   1. Enter your Naukri email/username');
      status('   2. Enter your password');
      status('   3. Complete CAPTCHA if prompted');
      status('   4. Enter OTP if sent to your email');
      status('   5. Click "Login" button');
      status('');
      status('⏳ System waiting... (checking every 2 seconds)');
      status('⏰ Timeout: 10 minutes');
      status('');
      
      // Wait for user to manually login (max 10 minutes)
      let isLoggedIn = false;
      let waitTime = 0;
      const maxWaitTime = 10 * 60 * 1000; // 10 minutes
      const checkInterval = 2000; // Check every 2 seconds
      let lastUrl = '';

      while (waitTime < maxWaitTime && !isLoggedIn) {
        await this.page.waitForTimeout(checkInterval);
        waitTime += checkInterval;

        try {
          const currentUrl = this.page.url();
          
          // Log URL change
          if (currentUrl !== lastUrl) {
            console.log(`[${(waitTime / 1000).toFixed(0)}s] URL changed to: ${currentUrl}`);
            lastUrl = currentUrl;
          }

          // Success patterns - expanded list
          const successPatterns = [
            '/mnjuser/homepage',
            '/mnjuser/profile',
            '/mnjuser/jobs',
            '/jobs',
            '/mnjuser/appliedJobs',
            '/mnjuser/myProfile',
            '/myProfile',
            '/mnjuser/dashboard',
            '/naukri.com/jobs/'
          ];

          // Check if any success pattern matches
          const isSuccessUrl = successPatterns.some(pattern => currentUrl.includes(pattern));
          
          // Also check: if URL changed away from login and doesn't contain 'nlogin'
          const leftLoginPage = currentUrl.includes('naukri.com') && 
                               !currentUrl.includes('nlogin/login') &&
                               !currentUrl.includes('nlogin') &&
                               lastUrl !== '';

          if (isSuccessUrl || leftLoginPage) {
            status('');
            status('✅ Login successful! You have been logged in.');
            status('');
            isLoggedIn = true;
            this.loginStatusSubject.next(true);
            await this.page.waitForTimeout(3000);
            break;
          }

          // Show progress every 30 seconds
          if (waitTime % 30000 === 0) {
            status(`⏳ Still waiting... (${(waitTime / 1000).toFixed(0)}s elapsed)`);
          }
        } catch (e) {
          console.error('Error checking URL:', e);
        }
      }

      if (!isLoggedIn) {
        status('');
        status('❌ LOGIN TIMEOUT - You did not complete login within 10 minutes');
        status('');
        status('📋 What to do:');
        status('   • Check the browser window - did you see the login page?');
        status('   • Try logging in again - click "▶️ Start Automation" again');
        status('   • If browser window never opened: Check your system');
        status('   • If CAPTCHA is blocking: Try manual browser login first');
        status('');
        return false;
      }

      return isLoggedIn;
    } catch (error: any) {
      console.error('Login failed:', error);
      const status = onStatusUpdate || ((msg: string) => console.log(msg));
      status(`❌ Error during login: ${error.message}`);
      return false;
    }
  }

  getPage() {
    return this.page;
  }

  getBrowser() {
    return this.browser;
  }

  async logout(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
    }
  }
}
