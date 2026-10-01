import { test, expect, type Page } from "@playwright/test";

const WIKI = "https://github.com/wridgeu/wridgeu.github.io/wiki";

async function waitForController(page: Page): Promise<void> {
	await page.evaluate(() => navigator.serviceWorker.ready);
	// a fresh worker controls the pages loaded after it activated
	await page.reload();
	await expect.poll(() => page.evaluate(() => !!navigator.serviceWorker.controller)).toBe(true);
}

test.beforeEach(async ({ context }) => {
	// context.route also sees requests the service worker makes
	await context.route("https://raw.githubusercontent.com/**", (route) => {
		const url = route.request().url();
		return route.fulfill({
			headers: { "access-control-allow-origin": "*" },
			body: url.endsWith("_Sidebar.md") ? `[TestPage](${WIKI}/TestPage)\n` : "# OFFLINE CONTENT",
		});
	});
});

test("serves the app, a read wiki page and both themes offline", async ({ page, context }) => {
	await page.goto("/index.html");
	await waitForController(page);
	await page.goto("/index.html#/wiki/TestPage");
	await expect(page.locator(".wikiMarkdown")).toContainText("OFFLINE CONTENT");

	await context.setOffline(true);
	const failed: string[] = [];
	// livereload (from ui5 serve) is not part of the deployed site
	page.on("requestfailed", (request) => !request.url().includes(":35729") && failed.push(request.url()));

	await page.reload();
	await expect(page.locator(".wikiMarkdown")).toContainText("OFFLINE CONTENT");
	await page.goto("/index.html#/");
	await expect(page.locator(".sapMGT").first()).toBeVisible();
	await page.goto("/index.html#/nope");
	await expect(page.locator(".sapMIllustratedMessage svg")).toBeVisible();
	await page.evaluate(() => sap.ui.require("sap/ui/core/Theming").setTheme("sap_horizon_dark"));
	await expect(page.locator("html")).toHaveClass(/sapUiTheme-sap_horizon_dark/);
	await page.waitForLoadState("networkidle");

	expect(failed).toEqual([]);
});

test("deletes the previous worker's caches, and only those", async ({ page }) => {
	// a page that registers no worker, so the caches exist before the new one activates
	await page.goto("/model/cv.json");
	await page.evaluate(() =>
		Promise.all(["app-1.25.1", "STATIC-0.0.0", "other-project-page"].map((name) => caches.open(name))),
	);
	await page.goto("/index.html");
	await waitForController(page);
	await expect.poll(() => page.evaluate(() => caches.keys())).not.toContain("STATIC-0.0.0");
	const keys = await page.evaluate(() => caches.keys());
	expect(keys).not.toContain("app-1.25.1");
	// project pages under wridgeu.github.io/* share this origin's caches
	expect(keys).toContain("other-project-page");
});
