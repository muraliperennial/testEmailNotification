import { test, Page } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { COVORO } from '../pages/covoroHomePage';
import { DashboardPage } from '../pages/dashboard.page';
import { InvoicePage } from '../pages/invoice.page';
import { FinalSubmitInvoiceAlternate } from '../pages/FinalSubmitInvoiceAlternate.page';
import * as dotenv from 'dotenv';

dotenv.config({quiet:true}); // Load environment variables

test.describe.configure({ mode: 'serial' });
let page: Page;

test.beforeAll(async({browser})=>{
  console.log("Test execution starting")
  // 2. Create a new context and page manually
  const context = await browser.newContext();
  page = await context.newPage();

  const loginPage= new LoginPage(page)
  await loginPage.setUp()
})


test("TC001: Validate login, navigation to dashboard and logout functionality", async()=>{
  const Covoro= new COVORO(page)
  await Covoro.login( process.env.DEMO_USERNAME as string,process.env.DEMO_PASSWORD as string)
})

test('TC002: Create Invoice- Verify user can create an invoice with valid details and save it successfully',async()=>{
    const Covoro= new COVORO(page)
    const result = await Covoro.createInvoice();
    console.log(`[LOG] Invoice Number:${result.invoice} and Status:${result.status}`) 
  });

test('TC003: Invoice Filter- Verify user can filter invoices using invoice number and view correct results',async()=>{
    const Covoro= new COVORO(page)
    const result =await Covoro.verifyFilter();
    console.log(`[LOG] Invoice Number:${result.invoice} and Status:${result.status}`) 
});

test('TC004: Invoice Status- Verify invoice status is updated correctly until Delivered',async()=>{
    const Covoro= new COVORO(page)
    await Covoro.submitInvoice()
    const result =await Covoro.verifyTillDelivered()
    console.log(`[LOG] Invoice Number:${result.invoice} and Status:${result.status}`) 
  });


test('TC005: File Upload-Verify user can upload an Excel file successfully and view processing status',async()=>{
    const Covoro= new COVORO(page)
    const result = await Covoro.verifyUploadInvoice()
    await Covoro.logout()
    console.log(`[LOG] Invoice Number:${result.invoice} and Status:${result.status}`) 
  });



