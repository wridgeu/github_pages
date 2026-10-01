import { defineConfig, devices } from "@playwright/test";

// Service worker tests run against the deploy build (npm run test:sw builds it first).
export default defineConfig({
	testDir: "./test",
	testMatch: "sw.spec.ts",
	workers: 1,
	reporter: "list",
	use: {
		...devices["Desktop Chrome"],
		baseURL: "http://localhost:8081",
	},
	webServer: {
		command: "ui5 serve --port 8081 --config ui5-dist.yaml",
		url: "http://localhost:8081/index.html",
		timeout: 120_000,
	},
});
