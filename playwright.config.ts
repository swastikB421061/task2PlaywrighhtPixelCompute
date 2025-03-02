import { defineConfig, devices } from '@playwright/test';
import dotenv from "dotenv";

export const STORAGE_STATE = "./auth/session.json";
dotenv.config({ path: "./e2e/config/.env" });

export default defineConfig({
  testDir: './e2e/tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,

  workers: 1,
  reporter: 'html',
  timeout: 60000,

  use: {
    trace: 'on',
    baseURL: "https://neeto-form-web-playwright.neetodeployapp.com",
    testIdAttribute: "data-cy",
  },

  projects: [
    {
      name: 'login',
      use: { ...devices['Desktop Chrome'] },
      testMatch: "**/login.setup.ts",
    },
    {
      name: "teardown",
      use: { ...devices["Desktop Chrome"] },
      testMatch: "**/globalTeardown.ts",
    },
    {
      name: "Logged In tests",
      use: { ...devices["Desktop Chrome"], storageState: STORAGE_STATE },
      dependencies: ["login"],
      teardown: "teardown",
      testMatch: "**/*.spec.ts",
    },
  ],
});