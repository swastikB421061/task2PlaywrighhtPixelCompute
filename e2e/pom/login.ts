
import { Page, expect } from "@playwright/test";
import { LoginPageSelectors } from "../../CONSTANTS/selectors/logindata";
// import { LOGIN_SELECTORS } from "../constants/selectors/login";
export default class LoginPage {
    page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    loginAndVerifyUser = async ({
        email,
        password,
        username
    }: {
        email: string;
        password: string;
        username: string;
    }) => {

        await this.page.getByTestId(LoginPageSelectors.email).fill(email)
        await this.page.getByTestId(LoginPageSelectors.password).fill(password)

        await expect(this.page.getByTestId(LoginPageSelectors.submit)).toBeEnabled({ timeout: 10000 });
        await this.page.getByTestId(LoginPageSelectors.submit).click();

        await expect(this.page.getByTestId(LoginPageSelectors.profile)).toBeVisible({ timeout: 10000 });
    }
}