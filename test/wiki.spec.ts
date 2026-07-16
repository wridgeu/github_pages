import { test, expect, type Page } from "@playwright/test";

// The wiki page fetches its sidebar and page content from raw.githubusercontent.com.
// Intercept those requests so the tests are hermetic and can inject an XSS payload,
// locking in the DOMPurify sanitize contract of the Markdown control. Block the
// service worker so the interception is not bypassed by the cached fetch handler.
test.use({ serviceWorkers: "block" });

// One markdown link whose rendered href matches the controller's `wiki/(.*?)"`
// sidebar regex, yielding a single ActionListItem labelled "TestPage".
const SIDEBAR_MD =
	"[TestPage](https://github.com/wridgeu/wridgeu.github.io/wiki/TestPage)\n";

// A safe link, a fenced code block (for the copy-button affordance) plus two
// XSS vectors marked passes through as raw HTML for the Markdown control to
// sanitize: an inline <script> and an <img onerror>.
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
	""
].join("\n");

async function mockWikiAndOpen(page: Page): Promise<void> {
	await page.route("**/raw.githubusercontent.com/**", (route) => {
		const url = route.request().url();
		const body = url.endsWith("_Sidebar.md")
			? SIDEBAR_MD
			: url.endsWith("TestPage.md")
				? PAGE_MD
				: "";
		return route.fulfill({
			status: 200,
			contentType: "text/plain; charset=utf-8",
			headers: { "access-control-allow-origin": "*" },
			body
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

	test("renders selected markdown through the Markdown control", async ({
		page
	}) => {
		await selectSidebarPage(page);
		await expect(page.locator(".wikiMarkdown")).toContainText("Test Wiki Page");
	});

	test("keeps the safe new-tab link the markdown service emits", async ({
		page
	}) => {
		await selectSidebarPage(page);
		const safeLink = page.locator(
			'.wikiMarkdown a[target="_blank"][rel="noopener noreferrer"]'
		);
		await expect(safeLink).toHaveCount(1);
		await expect(safeLink).toHaveAttribute("href", "https://example.com/");
	});

	test("strips script and event-handler XSS payloads", async ({ page }) => {
		await selectSidebarPage(page);
		await expect(page.locator(".wikiMarkdown")).toContainText("Test Wiki Page");

		// No <script> survives sanitization and no inline handler ever fired.
		await expect(page.locator(".wikiMarkdown script")).toHaveCount(0);
		expect(
			await page.evaluate(
				() => (window as unknown as { __xssExecuted?: boolean }).__xssExecuted
			)
		).toBeFalsy();
	});

	test("copies a code block to the clipboard via the copy button", async ({
		page,
		context
	}) => {
		await context.grantPermissions(["clipboard-read", "clipboard-write"]);
		await selectSidebarPage(page);

		// The control adds exactly one copy button, into the one code block.
		const copyButton = page.locator(".wikiMarkdown .wikiCodeBlock .wikiCopyButton");
		await expect(copyButton).toHaveCount(1);

		await copyButton.click();
		// The tooltip flips to "Copied!" inside the same promise chain that
		// commits the write, so wait for it before reading the clipboard —
		// otherwise the read can race ahead of writeText resolving.
		await expect(copyButton).toHaveAttribute("title", "Copied!");
		// The code lands on the clipboard with the trailing newline trimmed.
		expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
			CODE_SNIPPET
		);
		// ...and the confirmation reverts on its own.
		await expect(copyButton).toHaveAttribute("title", "Copy to clipboard");
	});

	test("does not duplicate sidebar entries across re-navigation", async ({
		page
	}) => {
		// RouteWiki's matched handler rebuilds the sidebar on every entry, and the
		// List is cached across visits, so a leaving-and-returning must not append
		// the same entry again.
		const sidebar = page.locator(".sidebar");
		const entry = sidebar.getByText("TestPage", { exact: true });
		await expect(entry).toHaveCount(1);

		// Leave the wiki (RouteMain) and return (RouteWiki matched fires again)
		// via hash navigation, without a full reload that would reset the app.
		// Wait for the navigation to actually settle each way so the round-trip
		// is not coalesced into a no-op.
		await page.evaluate(() => (window.location.hash = "#/"));
		await expect(sidebar).toBeHidden();
		await page.evaluate(() => (window.location.hash = "#/wiki"));
		await expect(sidebar).toBeVisible();

		await expect(entry).toHaveCount(1);
	});

	test("does not leak a UIArea when the Markdown control re-renders", async ({
		page
	}) => {
		await selectSidebarPage(page);
		const copyButton = page.locator(
			".wikiMarkdown .wikiCodeBlock .wikiCopyButton"
		);
		await expect(copyButton).toHaveCount(1);

		const uiAreaCount = () =>
			page.evaluate(
				() =>
					(
						sap.ui.require("sap/ui/core/UIArea") as {
							registry: { size: number };
						}
					).registry.size
			);

		const before = await uiAreaCount();
		// Force the Markdown control through several re-render cycles.
		await page.evaluate(async () => {
			const Element = sap.ui.require("sap/ui/core/Element") as {
				registry: {
					filter: (f: (e: { isA: (t: string) => boolean }) => boolean) => {
						invalidate: () => void;
					}[];
				};
			};
			const markdown = Element.registry.filter((e) =>
				e.isA("sapmarco.projectpages.control.Markdown")
			)[0];
			for (let i = 0; i < 3; i++) {
				markdown.invalidate();
				await new Promise((resolve) => setTimeout(resolve, 60));
			}
		});

		// The button re-rendered, and no orphaned UIArea was left behind.
		await expect(copyButton).toHaveCount(1);
		expect(await uiAreaCount()).toBe(before);
	});
});

// On a phone the SplitContainer collapses to a single column showing the master
// (sidebar); selecting an entry must reveal the detail (content) pane via the
// controller's SplitContainer.toDetail call. This guards that navigation.
test.describe("Wiki page on phone", () => {
	test.use({
		viewport: { width: 375, height: 720 },
		isMobile: true,
		hasTouch: true,
		userAgent:
			"Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1"
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

		// The page's back button must return to the sidebar, not leave the wiki.
		await page.locator('[id$="wikiPage-navButton"]').click();
		await expect(sidebar).toBeVisible();
		await expect(content).toBeHidden();
	});
});

// Two sidebar entries whose page fetches resolve out of order: the first tap's
// content arrives *after* the second tap's. The controller must keep the newer
// pane rather than letting the slower earlier fetch overwrite it.
test.describe("Wiki page rapid selection", () => {
	const RACE_SIDEBAR_MD = [
		"[SlowPage](https://github.com/wridgeu/wridgeu.github.io/wiki/SlowPage)",
		"[FastPage](https://github.com/wridgeu/wridgeu.github.io/wiki/FastPage)",
		""
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
				body
			});
		});
		await page.goto("/index.html#/wiki");
	});

	test("keeps the latest selection when an earlier fetch resolves last", async ({
		page
	}) => {
		const sidebar = page.locator(".sidebar");
		// Tap the slow page, then the fast one before the slow fetch resolves.
		await sidebar.getByText("SlowPage", { exact: true }).click();
		await sidebar.getByText("FastPage", { exact: true }).click();

		const content = page.locator(".wikiMarkdown");
		await expect(content).toContainText("FAST CONTENT");

		// Wait past the slow fetch: its late result must not replace the fast one.
		await page.waitForTimeout(500);
		await expect(content).toContainText("FAST CONTENT");
		await expect(content).not.toContainText("SLOW CONTENT");
	});
});
