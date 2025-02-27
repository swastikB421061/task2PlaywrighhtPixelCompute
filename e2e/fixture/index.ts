import { test as base, expect } from "@playwright/test";
import LoginPage from "../pom/login";
import { Task2 } from "../pom/task2";
import { Task1 } from "../pom/task1";
import { Task3 } from "../pom/task3";


interface ExtendedFixtures {
    loginPage: LoginPage;
    task2: Task2;
    task1:Task1;
    task3:Task3;
}

export const test = base.extend<ExtendedFixtures>({
    loginPage: async ({ page }, use) => {
        const loginPage = new LoginPage(page);
        await use(loginPage);
    },
    task2: async ({ page }, use) => {
        const task2 = new Task2(page);
        await use(task2);
    },
    task1: async ({ page }, use) => {
        const task1 = new Task1(page);
        await use(task1);
    },
    task3: async ({ page }, use) => {
        const task3 = new Task3(page);
        await use(task3);
    },
})
export { expect };

