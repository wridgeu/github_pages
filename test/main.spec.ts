import { test, expect } from "@playwright/test";

test.describe("Home page smoke test", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/index.html");
	});

	test("renders the home page", async ({ page }) => {
		await expect(page.locator(".socials")).toHaveCount(6);
	});

	test("renders the three integration cards", async ({ page }) => {
		await expect(page.locator(".integrationcard")).toHaveCount(3);
	});

	// Middle-click, ctrl-click and "open in new tab" are browser behaviour on a
	// real anchor. A press handler on an <img> gets none of them, so assert the
	// markup that earns them rather than the interaction itself.
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

	test("keeps the experience tree the same width when expanded", async ({ page }) => {
		const tree = page.locator(".sapMList").first();
		await expect(tree).toBeVisible();

		// Toggle every node whose current state differs from the one we want, a
		// few times over, so nested levels that only appear once their parent is
		// open are reached too.
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

		// The tree is centred, so a content-driven width change also shifts its
		// left edge and makes the whole column jump between clicks.
		expect(Math.round(expanded!.width)).toBe(Math.round(collapsed!.width));
		expect(Math.round(expanded!.x)).toBe(Math.round(collapsed!.x));
	});
});
