import { user } from '../../CONSTANTS/selectors/logindata';
import { test, expect } from '../fixture';
import { Task2 } from '../pom/task2';

test.describe("Task 2 - Unique Submission Tracking", () => {
    test.beforeEach(async ({ task2 }) => {
        await test.step("Navigate to Home Page", async () => {
            await task2.navigateToHome();
        });
    });

    test("Configure and Validate Unique Submission Settings", async ({ task2, browser }) => {
        
        await test.step("Create and Publish a Form", async () => {
            await task2.createAndPublishForm();
        });

        await test.step("Enable Cookie-based Unique Submission Tracking", async () => {
            await task2.enableCookieTracking();
        });

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

        await test.step("Disable Unique Submission Tracking", async () => {
            await task2.disableUniqueSubmissionTracking();
        });

        await test.step("User 3 Submits the Form After Tracking is Disabled", async () => {
            const userThreeContext = await browser.newContext();
            const userThreePage = await userThreeContext.newPage();
            const user3Form = new Task2(userThreePage);

            await user3Form.submitForm(user.email, formURL);
        });

        await test.step("Clean Up - Delete the Form", async () => {
            await task2.deleteForm();
        });
    });
});
