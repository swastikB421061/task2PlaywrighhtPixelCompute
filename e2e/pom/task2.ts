import { Page, expect } from "@playwright/test";
import { SELECTORS } from "../constants/selectors/Task2Constants";
import { TASK2TEXT } from "../constants/texts/task2text";


export class Task2 {
    constructor(private page: Page) { }

    async navigateToHome() {
        await this.page.goto("/");
    }

    async createAndPublishForm() {
        await this.page.getByTestId(SELECTORS.ADD_FORM_BUTTON).click();
        await this.page.getByTestId(SELECTORS.START_FROM_SCRATCH_BUTTON).click();
        await this.page.getByTestId(SELECTORS.PUBLISH_BUTTON).click();
    }

    async enableCookieTracking() {
        await this.page.getByTestId(SELECTORS.SETTINGS_TAB).click();
        await this.page.getByTestId(SELECTORS.UNIQUE_SUBMISSION_LINK).click();
        await this.page.getByTestId(SELECTORS.COOKIE_TRACK_OPTION).check();
        await this.page.getByTestId(SELECTORS.SAVE_CHANGES_BUTTON).click();
    }

    async getFormURL(): Promise<string> {
        await this.page.getByRole('link', { name: 'Share' }).click();
        const formURL = await this.page.locator(SELECTORS.SHARE_LINK).textContent();

        if (!formURL) throw new Error("Error: Form URL not found!");
        return formURL.trim();
    }

    async submitForm(email: string, url: string) {
        await this.page.goto(url);
        await this.page.getByTestId(SELECTORS.EMAIL_FIELD).fill(email);
        await this.page.getByTestId(SELECTORS.SUBMIT_BUTTON).click();
        await expect(this.page.getByTestId(SELECTORS.THANK_YOU_MESSAGE)).toBeVisible();
    }

    async checkDuplicateSubmission(url: string) {
        await this.page.goto(url);
        await expect(this.page.getByTestId(SELECTORS.ALREADY_SUBMITTED_MESSAGE)).toBeVisible();
    }

    async disableUniqueSubmissionTracking() {
        await this.page.bringToFront();
        await this.page.getByTestId(SELECTORS.SETTINGS_TAB).click();
        await this.page.getByTestId(SELECTORS.UNIQUE_SUBMISSION_LINK).click();
        await this.page.getByTestId(SELECTORS.NO_TRACK_OPTION).check();
        await this.page.getByTestId(SELECTORS.SAVE_CHANGES_BUTTON).click();
    }

    async deleteForm() {
        await this.page.bringToFront();
        await this.page.getByTestId(SELECTORS.DELETE_DROPDOWN_ICON).click();
        await this.page.getByTestId(SELECTORS.DELETE_BUTTON).click();
        await this.page.getByTestId(SELECTORS.DELETE_CHECKBOX).click();
        await this.page.getByTestId(SELECTORS.CONFIRM_DELETE_BUTTON).click();
    }

    async createAndPublishForm3() {
        await this.page.getByTestId(SELECTORS.ADD_FORM_BUTTON).click();
        await this.page.getByTestId(SELECTORS.START_FROM_SCRATCH_BUTTON).click();
        await this.page.getByTestId(SELECTORS.ADD_SINGLE_CHOICE_ELEMENT).click();
        await this.page.getByTestId(SELECTORS.CONTENT_TEXT_FIELD).fill(TASK2TEXT.INTERESTED_IN_PLAYWRIGHT);
        await this.page.getByTestId(SELECTORS.OPTION_INPUT_0).fill("Yes");
        await this.page.getByTestId(SELECTORS.OPTION_INPUT_1).fill("No");
        await this.page.getByTestId(SELECTORS.OPTION_3_HOVER).hover();
        await this.page.getByTestId(SELECTORS.OPTION_3_DELETE).click();
        await this.page.getByTestId(SELECTORS.OPTION_2_HOVER).hover();
        await this.page.getByTestId(SELECTORS.OPTION_2_DELETE).click();

        const start = await this.page.getByTestId(SELECTORS.MULTIPLE_CHOICE_PREVIEW_GROUP);
        const end = await this.page.getByTestId(SELECTORS.EMAIL_PREVIEW_GROUP);

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
        await this.page.getByTestId(SELECTORS.SETTINGS_TAB).click();
        await this.page.getByTestId(SELECTORS.CONDITIONAL_LOGIC_SETTINGS_LINK).click();

        await this.page.getByTestId(SELECTORS.NO_DATA_PRIMARY_BUTTON).click();
        await this.page.getByTestId(SELECTORS.CONDITION_QUESTION_SELECT_INPUT).click();
        await this.page
            .getByText(TASK2TEXT.INTERESTED_IN_PLAYWRIGHT, { exact: true })
            .click();
        await this.page.getByTestId(SELECTORS.CONDITION_VERB_SELECT_INPUT).click();
        await this.page.getByText(TASK2TEXT.CONTAINS, { exact: true }).click();
        await this.page.getByTestId(SELECTORS.CONDITION_VALUE_SELECT_INPUT).click();
        await this.page.getByText(TASK2TEXT.YES, { exact: true }).click();

        await this.page.getByTestId(SELECTORS.ACTION_TYPE_SELECT_INPUT).click();
        await this.page.getByText(TASK2TEXT.SHOW, { exact: true }).click();
        await this.page.getByTestId(SELECTORS.ACTION_FIELD_SELECT_INPUT).click();
        await this.page.getByText(TASK2TEXT.EMAIL_ADDRESS, { exact: true }).click();
        await this.page.getByTestId(SELECTORS.SAVE_CHANGES_BUTTON).click();

        await this.page.getByTestId(SELECTORS.PUBLISH_BUTTON).click();
    }

    async previewFormAndSelectOption(option: "Yes" | "No") {
        const previewPromise = this.page.waitForEvent("popup");
        await this.page.getByTestId(SELECTORS.PUBLISH_PREVIEW_BUTTON).click();
        const previewPage = await previewPromise;

        await previewPage.locator(`//span[normalize-space()='${option}']`).click();
        return previewPage;
    }

    async verifyPreviewForNo(previewPage: Page) {
        await expect(previewPage.getByTestId(SELECTORS.EMAIL_FIELD)).toBeHidden();
        await previewPage.getByTestId(SELECTORS.SUBMIT_BUTTON).click();
        await expect(previewPage.getByTestId(SELECTORS.THANK_YOU_MESSAGE)).toBeVisible();
    }

    async verifyPreviewForYes(previewPage: Page) {
        await expect(previewPage.getByTestId(SELECTORS.EMAIL_FIELD)).toBeVisible();
    }

    async disableConditionalLogicAndVerifyPreview() {
        await this.page.bringToFront();
        await this.page.getByTestId(SELECTORS.CONDITIONAL_LOGIC_DROPDOWN).click();
        await this.page.getByText("Disable", { exact: true }).click();

        const previewPromise = this.page.waitForEvent("popup");
        await this.page.getByTestId(SELECTORS.PUBLISH_PREVIEW_BUTTON).click();
        const previewPage = await previewPromise;
        await previewPage.bringToFront();

        await previewPage.locator(`//span[normalize-space()='Yes']`).click();
        await expect(previewPage.getByTestId(SELECTORS.EMAIL_FIELD)).toBeVisible();
        await expect(previewPage.getByTestId(SELECTORS.MULTIPLE_CHOICE_GROUP)).toBeVisible();
    }
    async createAndOpenFormSettings() {
        await this.page.getByTestId(SELECTORS.ADD_FORM_BUTTON).click();
        await this.page.getByTestId(SELECTORS.START_FROM_SCRATCH_BUTTON).click();
        await this.page.getByTestId(SELECTORS.SETTINGS_TAB).click();
    }

    async enablePasswordProtection(invalidPassword: string, correctPassword: string) {
        await this.page.getByTestId(SELECTORS.ACCESS_CONTROL_LINK).click();
        await this.page.getByTestId(SELECTORS.PASSWORD_PROTECT_RADIO).click();

        await this.page.getByTestId(SELECTORS.PASSWORD_FIELD).fill(invalidPassword);
        await this.page.getByTestId(SELECTORS.HEADER).click();
        await expect(this.page.getByTestId(SELECTORS.PASSWORD_ERROR)).toBeVisible();

        await this.page.getByTestId(SELECTORS.PASSWORD_FIELD).fill(correctPassword);
        await this.page.getByTestId(SELECTORS.SAVE_CHANGES_BUTTON).click();
    }

    async publishFormAndGetURL(): Promise<string> {
        await this.page.getByTestId(SELECTORS.PUBLISH_BUTTON).click();
        await this.page.getByRole('link', { name: 'Share' }).click();

        const formURL = await this.page.locator(SELECTORS.SHARE_LINK).textContent();
        if (!formURL) throw new Error("Error: Form URL not found!");

        return formURL.trim();
    }

    async submitFormWithPassword(email: string, url: string, password: string) {
        await this.page.goto(url);
        await this.page.getByTestId(SELECTORS.PASSWORD_TEXT_FIELD).fill(password);
        await this.page.getByTestId(SELECTORS.CONTINUE_BUTTON).click();
        await this.page.getByTestId(SELECTORS.EMAIL_TEXT_FIELD).fill(email);
        await this.page.getByTestId(SELECTORS.SUBMIT_BUTTON).click();
        await expect(this.page.getByTestId(SELECTORS.THANK_YOU_MESSAGE)).toBeVisible();
    }

    async verifySubmission(email: string) {
        await this.page.reload();
        await this.page.getByRole('link', { name: SELECTORS.SUBMISSIONS_TAB }).click();
        await expect(this.page.locator(SELECTORS.SUBMISSION_EMAIL_LINK.replace("{}", email))).toBeVisible();
    }
}