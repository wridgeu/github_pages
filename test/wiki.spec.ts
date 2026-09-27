import { test, expect, type Page } from "@playwright/test";

// Wiki content is mocked; the service worker would bypass page.route.
test.use({ serviceWorkers: "block" });

const SIDEBAR_MD = "[TestPage](https://github.com/wridgeu/wridgeu.github.io/wiki/TestPage)\n";

const CODE_SNIPPET = "const answer = 42;";
const PAGE_MD = [
	"# Test Wiki Page",
	"",
	"A [safe link](https://example.com/) here.",
	"",
	"```js",
	CODE_SNIPPET,
	"```",
	"",
	"<script>window.__xssExecuted = true;</script>",
	"",
	'<img src="x" onerror="window.__xssExecuted = true;">',
	"",
].join("\n");

async function mockWikiAndOpen(page: Page): Promise<void> {
	await page.route("**/raw.githubusercontent.com/**", (route) => {
		const url = route.request().url();
		const body = url.endsWith("_Sidebar.md") ? SIDEBAR_MD : url.endsWith("TestPage.md") ? PAGE_MD : "";
		return route.fulfill({
			status: 200,
			contentType: "text/plain; charset=utf-8",
			headers: { "access-control-allow-origin": "*" },
			body,
		});
	});
	await page.goto("/index.html#/wiki");
}

function selectSidebarPage(page: Page) {
	return page.locator(".sidebar").getByText("TestPage", { exact: true }).click();
}

test.describe("Wiki page", () => {
	test.beforeEach(async ({ page }) => {
		await mockWikiAndOpen(page);
	});

	test("keeps the safe new-tab link the markdown service emits", async ({ page }) => {
		await selectSidebarPage(page);
		const safeLink = page.locator('.wikiMarkdown a[target="_blank"][rel="noopener noreferrer"]');
		await expect(safeLink).toHaveCount(1);
		await expect(safeLink).toHaveAttribute("href", "https://example.com/");
	});

	test("strips script and event-handler XSS payloads", async ({ page }) => {
		await selectSidebarPage(page);
		await expect(page.locator(".wikiMarkdown")).toContainText("Test Wiki Page");

		await expect(page.locator(".wikiMarkdown script")).toHaveCount(0);
		expect(await page.evaluate(() => (window as unknown as { __xssExecuted?: boolean }).__xssExecuted)).toBeFalsy();
	});

	test("copies a code block to the clipboard via the copy button", async ({ page, context }) => {
		await context.grantPermissions(["clipboard-read", "clipboard-write"]);
		await selectSidebarPage(page);

		const copyButton = page.locator(".wikiMarkdown .wikiCodeBlock .wikiCopyButton");
		await expect(copyButton).toHaveCount(1);

		await copyButton.click();
		// wait for the confirmation so the read cannot race writeText
		await expect(copyButton).toHaveAttribute("title", "Copied!");
		expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(CODE_SNIPPET);
		await expect(copyButton).toHaveAttribute("title", "Copy to clipboard");
	});

	test("does not duplicate sidebar entries across re-navigation", async ({ page }) => {
		const sidebar = page.locator(".sidebar");
		const entry = sidebar.getByText("TestPage", { exact: true });
		await expect(entry).toHaveCount(1);

		// hash navigation, not a reload, so the cached view is reused
		await page.evaluate(() => (window.location.hash = "#/"));
		await expect(sidebar).toBeHidden();
		await page.evaluate(() => (window.location.hash = "#/wiki"));
		await expect(sidebar).toBeVisible();

		await expect(entry).toHaveCount(1);
	});

	test("does not leak a UIArea when the Markdown control re-renders", async ({ page }) => {
		await selectSidebarPage(page);
		const copyButton = page.locator(".wikiMarkdown .wikiCodeBlock .wikiCopyButton");
		await expect(copyButton).toHaveCount(1);

		const uiAreaCount = () =>
			page.evaluate(
				() =>
					(
						sap.ui.require("sap/ui/core/UIArea") as {
							registry: { size: number };
						}
					).registry.size,
			);

		const before = await uiAreaCount();
		await page.evaluate(async () => {
			const Element = sap.ui.require("sap/ui/core/Element") as {
				registry: {
					filter: (f: (e: { isA: (t: string) => boolean }) => boolean) => {
						invalidate: () => void;
					}[];
				};
			};
			const markdown = Element.registry.filter((e) => e.isA("sapmarco.projectpages.control.Markdown"))[0];
			for (let i = 0; i < 3; i++) {
				markdown.invalidate();
				await new Promise((resolve) => setTimeout(resolve, 60));
			}
		});

		await expect(copyButton).toHaveCount(1);
		expect(await uiAreaCount()).toBe(before);
	});
});

test.describe("Wiki page on phone", () => {
	test.use({
		viewport: { width: 375, height: 720 },
		isMobile: true,
		hasTouch: true,
		userAgent:
			"Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1",
	});

	test.beforeEach(async ({ page }) => {
		await mockWikiAndOpen(page);
	});

	test("reveals the content pane after a sidebar tap", async ({ page }) => {
		const content = page.locator(".wikiMarkdown");
		await expect(content).toBeHidden();
		await selectSidebarPage(page);
		await expect(content).toBeVisible();
		await expect(content).toContainText("Test Wiki Page");
	});

	test("navigates back from content to the sidebar", async ({ page }) => {
		const content = page.locator(".wikiMarkdown");
		const sidebar = page.locator(".sidebar");
		await selectSidebarPage(page);
		await expect(content).toBeVisible();
		await expect(sidebar).toBeHidden();

		await page.locator('[id$="wikiPage-navButton"]').click();
		await expect(sidebar).toBeVisible();
		await expect(content).toBeHidden();
	});
});

test.describe("Wiki page rapid selection", () => {
	const RACE_SIDEBAR_MD = [
		"[SlowPage](https://github.com/wridgeu/wridgeu.github.io/wiki/SlowPage)",
		"[FastPage](https://github.com/wridgeu/wridgeu.github.io/wiki/FastPage)",
		"",
	].join("\n");

	test.beforeEach(async ({ page }) => {
		await page.route("**/raw.githubusercontent.com/**", async (route) => {
			const url = route.request().url();
			let body = "";
			let delay = 0;
			if (url.endsWith("_Sidebar.md")) {
				body = RACE_SIDEBAR_MD;
			} else if (url.endsWith("SlowPage.md")) {
				body = "# SLOW CONTENT";
				delay = 400;
			} else if (url.endsWith("FastPage.md")) {
				body = "# FAST CONTENT";
				delay = 40;
			}
			if (delay) {
				await new Promise((resolve) => setTimeout(resolve, delay));
			}
			return route.fulfill({
				status: 200,
				contentType: "text/plain; charset=utf-8",
				headers: { "access-control-allow-origin": "*" },
				body,
			});
		});
		await page.goto("/index.html#/wiki");
	});

	test("keeps the latest selection when an earlier fetch resolves last", async ({ page }) => {
		const sidebar = page.locator(".sidebar");
		await sidebar.getByText("SlowPage", { exact: true }).click();
		await sidebar.getByText("FastPage", { exact: true }).click();

		const content = page.locator(".wikiMarkdown");
		await expect(content).toContainText("FAST CONTENT");

		// outlast the slow fetch
		await page.waitForTimeout(500);
		await expect(content).toContainText("FAST CONTENT");
		await expect(content).not.toContainText("SLOW CONTENT");
	});
});
