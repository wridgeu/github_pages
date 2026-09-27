import { test, expect } from "@playwright/test";

test.describe("Home page smoke test", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/index.html");
	});

	// CardDataMode.Auto leaves below-the-fold cards ~2px tall until scrolled to.
	test("gives the integration cards their height before they are scrolled to", async ({ page }) => {
		const cards = page.locator(".integrationcard");
		await expect(cards).toHaveCount(3);

		for (let i = 0; i < 3; i++) {
			await expect
				.poll(async () => (await cards.nth(i).boundingBox())?.height ?? 0, { timeout: 10000 })
				.toBeGreaterThan(100);
		}
	});

	// An <img> press handler loses middle-click / open-in-new-tab; a real anchor keeps them.
	test("renders each social as a real link", async ({ page }) => {
		const socials = page.locator(".socials");
		// toHaveCount retries until the view has rendered; count() does not.
		await expect(socials).toHaveCount(6);
		const count = await socials.count();

		for (let i = 0; i < count; i++) {
			const social = socials.nth(i);
			expect(await social.evaluate((el) => el.tagName)).toBe("A");
			expect(await social.getAttribute("href")).toBeTruthy();
			expect(await social.getAttribute("target")).toBe("_blank");
			expect(await social.getAttribute("rel")).toContain("noopener");
		}

		await expect(page.locator('.socials[href*="bsky.app"]')).toHaveCount(1);
	});

	// narrow viewports only stay stable because the role labels wrap
	for (const width of [1280, 900, 420]) {
		test(`keeps the experience tree the same width when expanded at ${width}px`, async ({ page }) => {
			await page.setViewportSize({ width, height: 900 });
			const tree = page.locator(".sapMList").first();
			await expect(tree).toBeVisible();

			// several passes, so nested levels revealed by their parent are reached too
			const toggleAll = async (expand: boolean) => {
				for (let pass = 0; pass < 4; pass++) {
					const expanders = page.locator(
						`li.sapMTreeItemBase[aria-expanded="${expand ? "false" : "true"}"] .sapMTreeItemBaseExpander`,
					);
					const count = await expanders.count();
					if (count === 0) break;
					for (let i = count - 1; i >= 0; i--) {
						await expanders.nth(i).click();
					}
					await page.waitForTimeout(150);
				}
			};

			await toggleAll(false);
			const collapsed = await tree.boundingBox();

			await toggleAll(true);
			const expanded = await tree.boundingBox();

			// the tree is centred, so a width change also moves its left edge
			expect(Math.round(expanded!.width)).toBe(Math.round(collapsed!.width));
			expect(Math.round(expanded!.x)).toBe(Math.round(collapsed!.x));
		});
	}
});
