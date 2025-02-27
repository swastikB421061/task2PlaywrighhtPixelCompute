import { Page, expect } from "@playwright/test";

import { Task3Constants } from "../../CONSTANTS/selectors/Task3Constants";

export class Task3 {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async navigateToHome() {
        await this.page.goto(Task3Constants.urls.home);
    }

    async createAndPublishForm() {
        await this.page.getByTestId(Task3Constants.testIds.addFormButton).click();
        await this.page.getByTestId(Task3Constants.testIds.startFromScratchButton).click();
        await this.page.getByTestId(Task3Constants.testIds.addSingleChoiceElement).click();
        await this.page.getByTestId(Task3Constants.testIds.contentTextField).fill(Task3Constants.formTexts.question);
        await this.page.waitForTimeout(1000);
        await this.page.getByTestId(Task3Constants.testIds.optionInput0).fill(Task3Constants.formTexts.optionYes);
        await this.page.getByTestId(Task3Constants.testIds.optionInput1).fill(Task3Constants.formTexts.optionNo);
        await this.page.getByTestId(Task3Constants.testIds.option3Hover).hover();
        await this.page.getByTestId(Task3Constants.testIds.option3Delete).click();
        await this.page.getByTestId(Task3Constants.testIds.option2Hover).hover();
        await this.page.getByTestId(Task3Constants.testIds.option2Delete).click();


        const start = await this.page.getByTestId(Task3Constants.testIds.multipleChoicePreviewGroup);
        const end = await this.page.getByTestId(Task3Constants.testIds.emailPreviewGroup);



        const box = await start.boundingBox();

        if (box) {
            const startX = box.x + box.width / 2;
            const startY = box.y + box.height / 2;
            const endY = startY - 100;


            await this.page.mouse.move(startX, startY);
            await this.page.mouse.down();
            await this.page.mouse.move(startX, endY, { steps: 10 });
            await this.page.mouse.up();
        }


    }

    async enableConditionalLogic() {
        await this.page.getByTestId(Task3Constants.testIds.settingsTab).click();
        await this.page.getByTestId(Task3Constants.testIds.conditionalLogicSettingsLink).click();
        await this.page.getByTestId(Task3Constants.testIds.conditionsNewButton).click();

        await this.page.locator(Task3Constants.conditionSettings.fieldXPath).click();
        await this.page.getByText(Task3Constants.formTexts.question).click();
        await this.page.locator(Task3Constants.conditionSettings.verbXPath).click();
        await this.page.getByText(Task3Constants.actions.contains, { exact: true }).click();
        await this.page.locator(Task3Constants.conditionSettings.valueXPath).click();
        await this.page.getByText(Task3Constants.formTexts.optionYes, { exact: true }).click();
        await this.page.locator(Task3Constants.conditionSettings.actionTypeXPath).click();
        await this.page.getByText(Task3Constants.actions.show, { exact: true }).click();

        await this.page.locator(Task3Constants.conditionSettings.fieldsXPath).click();
        await this.page.getByText(Task3Constants.formTexts.emailAddressField, { exact: true }).click();
        await this.page.getByTestId(Task3Constants.testIds.saveChangesButton).click();
        await this.page.getByTestId(Task3Constants.testIds.publishButton).click();
    }

    async previewFormAndSelectOption(option: "Yes" | "No") {
        const previewPromise = this.page.waitForEvent("popup");
        await this.page.getByTestId(Task3Constants.testIds.publishPreviewButton).click();
        const previewPage = await previewPromise;

        await previewPage.locator(`//span[normalize-space()='${option}']`).click();

        return previewPage;
    }

    async verifyPreviewForNo(previewPage: Page) {
        await expect(previewPage.getByTestId(Task3Constants.testIds.emailTextField)).toBeHidden();
        await previewPage.getByTestId(Task3Constants.testIds.startOrSubmitButton).click();
        await expect(previewPage.getByTestId(Task3Constants.testIds.thankYouPageMessage)).toBeVisible();
    }

    async verifyPreviewForYes(previewPage: Page) {
        await expect(previewPage.getByTestId(Task3Constants.testIds.emailTextField)).toBeVisible();
    }

    async disableConditionalLogicAndVerifyPreview() {
        await this.page.bringToFront();
        await this.page.getByTestId(Task3Constants.testIds.conditionalLogicDropdown).click();
        await this.page.getByText(Task3Constants.actions.disable, { exact: true }).click();

        const previewPromise = this.page.waitForEvent("popup");
        await this.page.getByTestId(Task3Constants.testIds.publishPreviewButton).click();
        const previewPage = await previewPromise;
        await previewPage.bringToFront();

        await previewPage.locator(`//span[normalize-space()='${Task3Constants.formTexts.optionYes}']`).click();
        await expect(previewPage.getByTestId(Task3Constants.testIds.emailTextField)).toBeVisible();
        await expect(previewPage.getByTestId(Task3Constants.testIds.multipleChoiceGroup)).toBeVisible();
    }

    async deleteForm() {
        await this.page.bringToFront();
        await this.page.getByTestId(Task3Constants.testIds.nuiDropdownIcon).click();
        await this.page.getByTestId(Task3Constants.testIds.formDeleteButton).click();
        await this.page.getByTestId(Task3Constants.testIds.deleteArchiveAlertCheckbox).click();
        await this.page.getByTestId(Task3Constants.testIds.deleteArchiveAlertButton).click();
    }
}






