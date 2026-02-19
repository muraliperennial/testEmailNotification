import { Page, expect } from '@playwright/test';

export class LoginPage {
  constructor(private page: Page) {}

  
 

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
