import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
	testDir: "./test",
	// one `ui5 serve` transpiles on the fly; parallel cold loads starve it and flake
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
