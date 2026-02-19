import { Page, expect } from '@playwright/test';

export class LoginPage {
  constructor(private page: Page) {}

  
 

  async setUp(){
    await this.page.goto('https://ae.covoro.ai/login');
  }

  async tearDown(){
    await this.page.close()
  }

}
