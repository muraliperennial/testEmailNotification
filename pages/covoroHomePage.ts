import { test, Page, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { DashboardPage } from '../pages/dashboard.page';
import { InvoicePage } from '../pages/invoice.page';
import { FinalSubmitInvoiceAlternate } from '../pages/FinalSubmitInvoiceAlternate.page';

export class COVORO {
    public static invoiceNumber: string | undefined;
    public static finalStatus: string | undefined;

    constructor(private page: Page) {

    
    }


   async login(email: string, password: string) {
    await this.page.fill('#email-label', email);
    await this.page.fill('input[name="password"]', password);
    await this.page.click('#sign-in');

    await this.page.waitForURL(/dashboard|home/, { timeout: 60000 });
    await expect(this.page).not.toHaveURL(/login/);
    console.log('Login Successful')
    await this.page.getByRole('button', { name: 'View Dashboard' }).click();
  }

  async createInvoice(){
    const login = new LoginPage(this.page);
    const dashboard = new DashboardPage(this.page);
    const invoice = new InvoicePage(this.page);

    await invoice.clickCreateInvoice();
    COVORO.invoiceNumber = await invoice.enterInvoiceNumber(0);
    console.log(`Invoice number entered: ${COVORO.invoiceNumber}`);
    await invoice.selectTxnTypeByIndex(0);
    await this.page.locator('//button[.//text()[normalize-space()="Save"]]').click();
    await this.page.waitForTimeout(1000);
    await invoice.fillSellerVatIdentifier('102303340122203');
    await this.page.locator('//button[.//text()[normalize-space()="Save"]]').click();
    await invoice.selectBuyer('Desai Brothers');
    await invoice.addItem();
    await this.page.locator('//button[.//text()[normalize-space()="Save"]]').click();
    await invoice.selectPaymentMeans();
    await invoice.selectTodayDate();
    await this.page.locator('//button[.//text()[normalize-space()="Save"]]').click();
    return { invoice: COVORO.invoiceNumber, status:COVORO.finalStatus };
  }

  async verifyFilter(){
    const login = new LoginPage(this.page);
    const dashboard = new DashboardPage(this.page);
    const invoice = new InvoicePage(this.page);
    await invoice.submitInvoice();
    const finalSubmit = new FinalSubmitInvoiceAlternate(this.page, COVORO.invoiceNumber!);
    await finalSubmit.clickFilter();
    await this.page.waitForTimeout(1000);
    await finalSubmit.enterInvoiceNumber();
    await finalSubmit.clickApply();
    await this.page.waitForTimeout(1000);
    COVORO.finalStatus = 'Filter applied';
    return { invoice: COVORO.invoiceNumber, status:COVORO.finalStatus };
  }


  async submitInvoice() {
    const finalSubmit = new FinalSubmitInvoiceAlternate(this.page, COVORO.invoiceNumber!);
    await finalSubmit.clickFinalSubmit();
    COVORO.finalStatus = 'Submitted';
    return { invoice: COVORO.invoiceNumber, status:COVORO.finalStatus };
  }

  async verifyTillDelivered(){
    const finalSubmit = new FinalSubmitInvoiceAlternate(this.page, COVORO.invoiceNumber!);
    await finalSubmit.getStatusTillSubmitted();
    await finalSubmit.getStatusTillDelivered();
    await finalSubmit.verifyInvoiceStatusAfterFinalSubmit(/delivered/i);
    COVORO.finalStatus = 'Delivered';
    return { invoice: COVORO.invoiceNumber, status:COVORO.finalStatus };
  }

  async verifyUploadInvoice(){
    const invoice = new InvoicePage(this.page);
    await invoice.clickUploadInvoice();
    await this.page.waitForTimeout(1000);
    await invoice.selectAndUploadExcelFile('./testData/ValidforAdmin4.xlsx');
    await this.page.waitForTimeout(5000);
    const status= await invoice.getUploadStatusText();
    return { invoice: COVORO.invoiceNumber, status };
  }


  async logout(){
    await this.page.locator('#userDetails').click()
    await this.page.locator("div[class^='sign-out']").click()
    await this.page.locator('#email-label').isVisible()
    console.log('Logout Successful')
  }
  
}
  
