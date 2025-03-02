import { user } from '../constants/selectors/logindata';
import { test, expect } from '../fixture';
import { Task2 } from '../pom/task2';

test.describe("Task 2 - Unique Submission Tracking", () => {
    test.beforeEach(async ({ task2 }) => {
        await test.step("Navigate to Home Page", async () => 
             task2.navigateToHome()
        );
    });


    test("Configure and Validate Password Protection", async ({ task2, browser }) => {
        
        await test.step("Create and Open Form Settings", async () => 
             task2.createAndOpenFormSettings()
        );

        await test.step("Enable Password Protection and Enter Invalid/Correct Passwords", async () => 
             task2.enablePasswordProtection("00", "welcome")
        );

        let formURL: string;
        await test.step("Publish Form and Retrieve Shareable Link", async () => {
            formURL = await task2.publishFormAndGetURL();
            console.log("Extracted Form URL:", formURL);
        });

        await test.step("Submit Form Using a New User Session", async () => {
            const newUserContext = await browser.newContext({
                storageState: { cookies: [], origins: [] },
            });
            const page = await newUserContext.newPage();
            const userForm = new Task2(page);

            await userForm.submitFormWithPassword("oliver@example.com", formURL, "welcome");
            await page.close();
        });

        await test.step("Reload Page and Verify Submission", async () => 
             task2.verifySubmission(user.email)
        );
    });



    test("Configure and Validate Unique Submission Settings", async ({ task2, browser }) => {
        
        await test.step("Create and Publish a Form", async () => 
             task2.createAndPublishForm()
        );

        await test.step("Enable Cookie-based Unique Submission Tracking", async () => 
             task2.enableCookieTracking()
        );

        let formURL: string;
        await test.step("Extract the Shareable Form URL", async () => {
            formURL = await task2.getFormURL();
        });

        await test.step("User 1 Fills and Submits the Form and tries again", async () => {
            const userOneContext = await browser.newContext();
            const userOnePage = await userOneContext.newPage();
            const user1Form = new Task2(userOnePage);

            await user1Form.submitForm(user.email, formURL);
            await user1Form.checkDuplicateSubmission(formURL);
        });

        await test.step("User 2 Successfully Submits the Form", async () => {
            const userTwoContext = await browser.newContext();
            const userTwoPage = await userTwoContext.newPage();
            const user2Form = new Task2(userTwoPage);

            await user2Form.submitForm("user2@example.com", formURL);
        });

        await test.step("Disable Unique Submission Tracking", async () => 
             task2.disableUniqueSubmissionTracking()
        );

        await test.step("User 3 Submits the Form After Tracking is Disabled", async () => {
            const userThreeContext = await browser.newContext();
            const userThreePage = await userThreeContext.newPage();
            const user3Form = new Task2(userThreePage);

            await user3Form.submitForm(user.email, formURL);
        });

        await test.step("Clean Up - Delete the Form", async () => 
             task2.deleteForm()
        );
    });


    test("Configure and Validate Conditional Logic", async ({ task2 }) => {
        
        await test.step("Create and Publish a Form", async () => {
            await task2.createAndPublishForm3();
        });

        await test.step("Enable Conditional Logic for Showing Email Field", async () => {
            await task2.enableConditionalLogic();
        });

        await test.step("Check Preview for 'No' (Email Should Be Hidden)", async () => {
            const previewPage = await task2.previewFormAndSelectOption("No");
            await task2.verifyPreviewForNo(previewPage);
        });

        await test.step("Check Preview for 'Yes' (Email Should Be Visible)", async () => {
            const previewPage = await task2.previewFormAndSelectOption("Yes");
            await task2.verifyPreviewForYes(previewPage);
        });

        await test.step("Disable Conditional Logic and Verify Form Preview", async () => {
            await task2.disableConditionalLogicAndVerifyPreview();
        });

        await test.step("Clean Up - Delete the Form", async () => {
            await task2.deleteForm();
        });
    });
});
