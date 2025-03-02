import { test as base, expect } from "@playwright/test";
import LoginPage from "../pom/login";
import { Task2 } from "../pom/task2";



interface ExtendedFixtures {
    loginPage: LoginPage;
    task2: Task2;

}

export const test = base.extend<ExtendedFixtures>({
    loginPage: async ({ page }, use) => {
        const loginPage = new LoginPage(page);
        await use(loginPage);
    },
    task2: async ({ page }, use) => {
        const task2 = new Task2(page);
        await use(task2);
    }
})
export { expect };

