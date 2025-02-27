import { test } from '../fixture';
import { Task1 } from '../pom/task1';

test.describe("Task 1 - Password Protection", () => {
    test.beforeEach(async ({ task1 }) => {
        await test.step("Navigate to Home Page", async () => {
            await task1.navigateToHome();
        });
    });

    test("Configure and Validate Password Protection", async ({ task1, browser }) => {
        
        await test.step("Create and Open Form Settings", async () => {
            await task1.createAndOpenFormSettings();
        });

        await test.step("Enable Password Protection and Enter Invalid/Correct Passwords", async () => {
            await task1.enablePasswordProtection("00", "welcome");
        });

        let formURL: string;
        await test.step("Publish Form and Retrieve Shareable Link", async () => {
            formURL = await task1.publishFormAndGetURL();
            console.log("Extracted Form URL:", formURL);
        });

        await test.step("Submit Form Using a New User Session", async () => {
            const newUserContext = await browser.newContext({
                storageState: { cookies: [], origins: [] },
            });
            const page = await newUserContext.newPage();
            const userForm = new Task1(page);

            await userForm.submitFormWithPassword("oliver@example.com", formURL, "welcome");
            await page.close();
        });

        await test.step("Reload Page and Verify Submission", async () => {
            await task1.verifySubmission("oliver@example.com");
        });
    });
});
