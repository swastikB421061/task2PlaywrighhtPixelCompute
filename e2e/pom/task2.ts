import { Page, expect } from "@playwright/test";
import { Task2Constants } from "../../CONSTANTS/selectors/Task2Constants";

export class Task2 {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async navigateToHome() {
        await this.page.goto(Task2Constants.URLs.HOME);
    }

    async createAndPublishForm() {
        await this.page.getByTestId(Task2Constants.Selectors.ADD_FORM_BUTTON).click();
        await this.page.getByTestId(Task2Constants.Selectors.START_FROM_SCRATCH_BUTTON).click();
        await this.page.getByTestId(Task2Constants.Selectors.PUBLISH_BUTTON).click();
    }

    async enableCookieTracking() {
        await this.page.getByTestId(Task2Constants.Selectors.SETTINGS_TAB).click();
        await this.page.getByTestId(Task2Constants.Selectors.UNIQUE_SUBMISSION_LINK).click();
        await this.page.getByTestId(Task2Constants.Selectors.COOKIE_TRACK_OPTION).check();
        await this.page.getByTestId(Task2Constants.Selectors.SAVE_CHANGES_BUTTON).click();
    }

    async getFormURL(): Promise<string> {
        await this.page.getByRole('link', { name: 'Share' }).click();
        const formURL = await this.page.locator(Task2Constants.Selectors.SHARE_LINK).textContent();
        
        if (!formURL) throw new Error(Task2Constants.Messages.FORM_URL_NOT_FOUND);
        return formURL.trim();
    }

    async submitForm(email: string, url: string) {
        await this.page.goto(url);
        await this.page.getByTestId(Task2Constants.Selectors.EMAIL_FIELD).fill(email);
        await this.page.getByTestId(Task2Constants.Selectors.SUBMIT_BUTTON).click();
        await expect(this.page.getByTestId(Task2Constants.Selectors.THANK_YOU_MESSAGE)).toBeVisible();
    }

    async checkDuplicateSubmission(url: string) {
        await this.page.goto(url);
        await expect(this.page.getByTestId(Task2Constants.Selectors.ALREADY_SUBMITTED_MESSAGE)).toBeVisible();
    }

    async disableUniqueSubmissionTracking() {
        await this.page.bringToFront();
        await this.page.getByTestId(Task2Constants.Selectors.SETTINGS_TAB).click();
        await this.page.getByTestId(Task2Constants.Selectors.UNIQUE_SUBMISSION_LINK).click();
        await this.page.getByTestId(Task2Constants.Selectors.NO_TRACK_OPTION).check();
        await this.page.getByTestId(Task2Constants.Selectors.SAVE_CHANGES_BUTTON).click();
    }

    async deleteForm() {
        await this.page.bringToFront();
        await this.page.getByTestId(Task2Constants.Selectors.DELETE_DROPDOWN_ICON).click();
        await this.page.getByTestId(Task2Constants.Selectors.DELETE_BUTTON).click();
        await this.page.getByTestId(Task2Constants.Selectors.DELETE_CHECKBOX).click();
        await this.page.getByTestId(Task2Constants.Selectors.CONFIRM_DELETE_BUTTON).click();
    }
}
