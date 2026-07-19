import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
	testDir: "./test",
	// A single `ui5 serve` (on-the-fly TS transpile + npm-module bundling) backs
	// every test; concurrent cold app loads starve it and flake the smoke
	// assertions, so run this small suite serially.
	fullyParallel: false,
	workers: 1,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	reporter: "list",
	use: {
		baseURL: "http://localhost:8080",
		trace: "on-first-retry",
	},
	projects: [
		{
			name: "chromium",
			use: { ...devices["Desktop Chrome"] },
		},
	],
	webServer: {
		command: "npm run serve",
		url: "http://localhost:8080/index.html",
		reuseExistingServer: !process.env.CI,
		timeout: 120_000,
	},
});
