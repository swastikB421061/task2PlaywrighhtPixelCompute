import { test } from "../fixture";
import { STORAGE_STATE } from "../../playwright.config";
import {user} from "../../CONSTANTS/selectors/logindata";

test.describe("Login page", () => {
    test("should login to home page with correct credentials.", async ({
        page,
        loginPage
    }) => {
        await page.goto("/");

        await loginPage.loginAndVerifyUser({
            email: user.email,
            password: user.password,
            username: user.username,
        });
        await page.context().storageState({ path: STORAGE_STATE });
    });
})