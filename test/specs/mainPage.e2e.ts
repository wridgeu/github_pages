// import LoginPage from  '../pageobjects/login.page';
// import SecurePage from '../pageobjects/secure.page';

import mainPage from "../pageobjects/main.page";
import _ui5Service from "wdio-ui5-service";

describe("My Main Page", () => {
	before(async () => {
		await mainPage.open();
        // https://github.com/js-soft/wdi5/tree/main/wdio-ui5-service#skip-ui5wdi5-initialization-on-startup
		await new _ui5Service().injectUI5();
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
		expect(await control.getText()).toEqual('Visit');
	});
});
