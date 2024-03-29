// import LoginPage from  '../pageobjects/login.page';
// import SecurePage from '../pageobjects/secure.page';

import _ui5Service from "wdio-ui5-service";

import mainPage from "../pageobjects/main.page";

describe("My Main Page", () => {
	before(async () => {
		const wdioUI5Service = new _ui5Service();
		await wdioUI5Service.injectUI5();
	});

	it("should render the container element", async () => {
		await expect(mainPage.mainContainer).toBeDisplayed();
	});

	it("should display three integration cards", async () => {
		await expect(mainPage.integrationcards).toHaveChildren({
			eq: 3,
		});
	});

	it("should validate that the wiki button exists", async () => {
		const btnSelector = {
			forceSelect: true,
			timeout: 15000,
			selector: {
				id: "wiki-button",
				viewName: "sapmarco.projectpages.view.Home",
			},
		};
		const control = await browser.asControl(btnSelector);
		expect(await control.getText()).toEqual("Visit");
	});
});
