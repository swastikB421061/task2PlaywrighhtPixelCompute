import { Page, expect } from "@playwright/test";
import { Task1Constants } from "../../CONSTANTS/selectors/Task1Constants";

export class Task1 {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async navigateToHome() {
        await this.page.goto(Task1Constants.URLs.HOME);
    }

    async createAndOpenFormSettings() {
        await this.page.getByTestId(Task1Constants.Selectors.ADD_FORM_BUTTON).click();
        await this.page.getByTestId(Task1Constants.Selectors.START_FROM_SCRATCH_BUTTON).click();
        await this.page.getByTestId(Task1Constants.Selectors.SETTINGS_TAB).click();
    }

    async enablePasswordProtection(invalidPassword: string, correctPassword: string) {
        await this.page.getByTestId(Task1Constants.Selectors.ACCESS_CONTROL_LINK).click();
        await this.page.getByTestId(Task1Constants.Selectors.PASSWORD_PROTECT_RADIO).click();

        await this.page.getByTestId(Task1Constants.Selectors.PASSWORD_FIELD).fill(invalidPassword);
        await this.page.getByTestId(Task1Constants.Selectors.HEADER).click();
        await expect(this.page.getByTestId(Task1Constants.Selectors.PASSWORD_ERROR)).toBeVisible();

        
        await this.page.getByTestId(Task1Constants.Selectors.PASSWORD_FIELD).fill(correctPassword);
        await this.page.getByTestId(Task1Constants.Selectors.SAVE_CHANGES_BUTTON).click();
    }

    async publishFormAndGetURL(): Promise<string> {
        await this.page.getByTestId(Task1Constants.Selectors.PUBLISH_BUTTON).click();
        await this.page.getByRole('link', { name: 'Share' }).click();

        const formURL = await this.page.locator(Task1Constants.Selectors.SHARE_LINK).textContent();
        if (!formURL) throw new Error(Task1Constants.Messages.FORM_URL_NOT_FOUND);

        return formURL.trim();
    }

    async submitFormWithPassword(email: string, url: string, password: string) {
        await this.page.goto(url);
        await this.page.getByTestId(Task1Constants.Selectors.PASSWORD_TEXT_FIELD).fill(password);
        await this.page.getByTestId(Task1Constants.Selectors.CONTINUE_BUTTON).click();
        await this.page.getByTestId(Task1Constants.Selectors.EMAIL_TEXT_FIELD).fill(email);
        await this.page.getByTestId(Task1Constants.Selectors.SUBMIT_BUTTON).click();
        await expect(this.page.getByTestId(Task1Constants.Selectors.THANK_YOU_MESSAGE)).toBeVisible();
    }

    async verifySubmission(email: string) {
        await this.page.reload();
        await this.page.getByRole('link', { name: Task1Constants.Selectors.SUBMISSIONS_TAB }).click();
        await expect(this.page.locator(Task1Constants.Selectors.SUBMISSION_EMAIL_LINK.replace("{}", email))).toBeVisible();
    }
}
