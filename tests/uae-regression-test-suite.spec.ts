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

test.beforeAll(async()=>{
  console.log("Test execution starting")
})

test.beforeEach(async({page})=>{
  const loginPage= new LoginPage(page)
  await loginPage.setUp()
})

test.afterAll(async({page})=>{
const loginPage= new LoginPage(page)
await loginPage.tearDown()
})

test("TC001: Validate login, navigation to dashboard and logout functionality", async({page})=>{
  const Covoro= new COVORO(page)
  await Covoro.login( process.env.DEMO_USERNAME as string,process.env.DEMO_PASSWORD as string)
  // await loginPage.logout()
})

test('TC002: Create Invoice- Verify user can create an invoice with valid details and save it successfully',async({page})=>{
    const Covoro= new COVORO(page)
    await Covoro.login( process.env.DEMO_USERNAME as string,process.env.DEMO_PASSWORD as string)
    const result = await Covoro.createInvoice();
    console.log(`[LOG] Invoice Number:${result.invoice} and Status:${result.status}`) 
  });

test('TC003: Invoice Filter- Verify user can filter invoices using invoice number and view correct results',async({page})=>{
    const Covoro= new COVORO(page)
    await Covoro.login( process.env.DEMO_USERNAME as string,process.env.DEMO_PASSWORD as string)
    await Covoro.createInvoice();
    const result =await Covoro.verifyFilter();
    console.log(`[LOG] Invoice Number:${result.invoice} and Status:${result.status}`) 
});
/*
test('TC004: Invoice Status- Verify invoice status is updated correctly until Delivered',async({page})=>{
    const Covoro= new COVORO(page)
    await Covoro.login( process.env.DEMO_USERNAME as string,process.env.DEMO_PASSWORD as string)
    await Covoro.createInvoice();
    await Covoro.verifyFilter();
    await Covoro.submitInvoice()
    const result =await Covoro.verifyTillDelivered()
    console.log(`[LOG] Invoice Number:${result.invoice} and Status:${result.status}`) 
  });
*/





