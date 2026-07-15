import { test, expect } from "@playwright/test";

test.describe("Home page smoke test", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/index.html");
	});

	test("renders the home page", async ({ page }) => {
		await expect(page.locator(".socials")).toHaveCount(5);
	});

	test("renders the three integration cards", async ({ page }) => {
		await expect(page.locator(".integrationcard")).toHaveCount(3);
	});
});
