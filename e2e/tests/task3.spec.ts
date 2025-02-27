import { test } from '../fixture';
import { Task3 } from '../pom/task3';

test.describe("Task 1 - Conditional Logic and Preview", () => {
    test.beforeEach(async ({ task3 }) => {
        await test.step("Navigate to Home Page", async () => {
            await task3.navigateToHome();
        });
    });

    test("Configure and Validate Conditional Logic", async ({ task3 }) => {
        
        await test.step("Create and Publish a Form", async () => {
            await task3.createAndPublishForm();
        });

        await test.step("Enable Conditional Logic for Showing Email Field", async () => {
            await task3.enableConditionalLogic();
        });

        await test.step("Check Preview for 'No' (Email Should Be Hidden)", async () => {
            const previewPage = await task3.previewFormAndSelectOption("No");
            await task3.verifyPreviewForNo(previewPage);
        });

        await test.step("Check Preview for 'Yes' (Email Should Be Visible)", async () => {
            const previewPage = await task3.previewFormAndSelectOption("Yes");
            await task3.verifyPreviewForYes(previewPage);
        });

        await test.step("Disable Conditional Logic and Verify Form Preview", async () => {
            await task3.disableConditionalLogicAndVerifyPreview();
        });

        await test.step("Clean Up - Delete the Form", async () => {
            await task3.deleteForm();
        });
    });
});
