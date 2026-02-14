import { test, Page } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { DashboardPage } from '../pages/dashboard.page';
import { InvoicePage } from '../pages/invoice.page';
import { FinalSubmitInvoiceAlternate } from '../pages/FinalSubmitInvoiceAlternate.page';
import * as dotenv from 'dotenv';

dotenv.config(); // Load environment variables

test.beforeAll(async()=>{
  console.log("Test execution starting")
})

test.beforeEach(async({page})=>{
  const loginPage= new LoginPage(page)
  await loginPage.setUp()
})

test.afterEach(async({page})=>{
const loginPage= new LoginPage(page)
await loginPage.tearDown()
})

test("TC001: Validate login, navigation to dashboard and logout functionality", async({page})=>{
  console.log(process.env.USERNAME as string)
  const loginPage= new LoginPage(page)
  await loginPage.login( process.env.USERNAME as string,process.env.PASSWORD as string)
  await loginPage.logout()
})

test("TC002: Validate login functionality", async({page})=>{
  const loginPage= new LoginPage(page)
  await loginPage.login( process.env.USERNAME as string,process.env.PASSWORD as string)
  await loginPage.logout()
})
