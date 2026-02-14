import { Page, expect } from '@playwright/test';

export class LoginPage {
  constructor(private page: Page) {}

  async goto(url?: string) {
    await this.page.goto(url || 'https://dev.covoro.ai/login');
  }

  async login(email: string, password: string) {
    await this.page.fill('#email-label', email);
    await this.page.fill('input[name="password"]', password);
    await this.page.click('#sign-in');

    await this.page.waitForURL(/dashboard|home/, { timeout: 60000 });
    await expect(this.page).not.toHaveURL(/login/);
    console.log('Login Successful')
  }

  async setUp(){
    await this.page.goto('https://ae.covoro.ai/login');
  }

  async tearDown(){
    await this.page.close()
  }

  async logout(){
    await this.page.locator('#userDetails').click()
    await this.page.locator("div[class^='sign-out']").click()
    await this.page.locator('#email-label').isVisible()
    console.log('Logout Successful')
  }

}
