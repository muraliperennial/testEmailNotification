import { test, Page, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { DashboardPage } from '../pages/dashboard.page';
import { InvoicePage } from '../pages/invoice.page';
import { FinalSubmitInvoiceAlternate } from '../pages/FinalSubmitInvoiceAlternate.page';

export class COVORO {
    private invoiceNumber: string | undefined;
    private finalStatus: string | undefined;

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
    this.invoiceNumber = await invoice.enterInvoiceNumber(0);
    console.log(`Invoice number entered: ${this.invoiceNumber}`);
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
    return { invoice: this.invoiceNumber, status:this.finalStatus };
  }

  async verifyFilter(){
    const login = new LoginPage(this.page);
    const dashboard = new DashboardPage(this.page);
    const invoice = new InvoicePage(this.page);
    await invoice.submitInvoice();
    const finalSubmit = new FinalSubmitInvoiceAlternate(this.page, this.invoiceNumber!);
    await finalSubmit.clickFilter();
    await this.page.waitForTimeout(1000);
    await finalSubmit.enterInvoiceNumber();
    await finalSubmit.clickApply();
    await this.page.waitForTimeout(1000);
    this.finalStatus = 'Filter applied';
    return { invoice: this.invoiceNumber, status:this.finalStatus };
  }


  async submitInvoice() {
    const finalSubmit = new FinalSubmitInvoiceAlternate(this.page, this.invoiceNumber!);
    await finalSubmit.clickFinalSubmit();
    this.finalStatus = 'Submitted';
    return { invoice: this.invoiceNumber, status:this.finalStatus };
  }

  async verifyTillDelivered(){
    const finalSubmit = new FinalSubmitInvoiceAlternate(this.page, this.invoiceNumber!);
    await finalSubmit.getStatusTillSubmitted();
    await finalSubmit.getStatusTillDelivered();
    await finalSubmit.verifyInvoiceStatusAfterFinalSubmit(/delivered/i);
    this.finalStatus = 'Delivered';
    return { invoice: this.invoiceNumber, status:this.finalStatus };
  }








  /**
 * UAE Regression v1 – 6 cases (TC002–TC004 merged).
 * throughStep: 1=Login, 2=Create Invoice+Buyer+Item, 3=Filter, 4=Submit, 5=Final Status, 6=File Upload.
 
async function runStepsUpToV1(
  page: Page,
  throughStep: number
): Promise<{ invoiceNumber?: string; finalStatus?: string }> {
  const log = (msg: string, url?: string) => {
    console.log(`[LOG] ${msg} | URL: ${url ?? page.url()}`);
  };
  const login = new LoginPage(page);
  const dashboard = new DashboardPage(page);
  const invoice = new InvoicePage(page);
  let invoiceNumber: string | undefined;
  let finalStatus: string | undefined;

  // Step 1: Login
  if (throughStep >= 1) {
    log('Navigating to login page', BASE_URL);
    await login.goto(BASE_URL);
    await login.login('mayur.telke+receiveram@perennialsys.com', '12345678@aA');
    log('Opening dashboard');
    await dashboard.openDashboard();
  }

  // Step 2 (merged): Create Invoice + Search Buyer + Search Item
  if (throughStep >= 2) {
    await invoice.clickCreateInvoice();
    invoiceNumber = await invoice.enterInvoiceNumber(0);
    log(`Invoice number entered: ${invoiceNumber}`);
    await invoice.selectTxnTypeByIndex(0);
    await page.locator('//button[.//text()[normalize-space()="Save"]]').click();
    await page.waitForTimeout(1000);
    await invoice.fillSellerVatIdentifier('102303340122203');
    await page.locator('//button[.//text()[normalize-space()="Save"]]').click();
    await invoice.selectBuyer('Desai Brothers');
    await invoice.addItem();
    await page.locator('//button[.//text()[normalize-space()="Save"]]').click();
    await invoice.selectPaymentMeans();
    await invoice.selectTodayDate();
    await page.locator('//button[.//text()[normalize-space()="Save"]]').click();
    finalStatus = 'Created';
  }

  // Step 3: Filter Functionality
  if (throughStep >= 3) {
    
    await invoice.submitInvoice();
    const finalSubmit = new FinalSubmitInvoiceAlternate(page, invoiceNumber!);
    await finalSubmit.clickFilter();
    await page.waitForTimeout(1000);
    await finalSubmit.enterInvoiceNumber();
    await finalSubmit.clickApply();
    await page.waitForTimeout(1000);
    finalStatus = 'Filter applied';
  }

  // Step 4: Submit Invoice
  if (throughStep >= 4) {
    const finalSubmit = new FinalSubmitInvoiceAlternate(page, invoiceNumber!);
    await finalSubmit.clickFinalSubmit();
    finalStatus = 'Submitted';
  }

  // Step 5: Final Status – verify till "Delivered"
  if (throughStep >= 5) {
    const finalSubmit = new FinalSubmitInvoiceAlternate(page, invoiceNumber!);
    await finalSubmit.getStatusTillDelivered();
    await finalSubmit.verifyInvoiceStatusAfterFinalSubmit(/delivered/i);
    finalStatus = 'Delivered';
  }

  // Step 6: File Upload
  if (throughStep >= 6) {
    await invoice.clickUploadInvoice();
    await page.waitForTimeout(1000);
    await invoice.selectAndUploadExcelFile(EXCEL_PATH);
    await page.waitForTimeout(5000);
    await invoice.getUploadStatusText();
  }

  return { invoiceNumber, finalStatus };
}
  
  */

}
