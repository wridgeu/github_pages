// import LoginPage from  '../pageobjects/login.page';
// import SecurePage from '../pageobjects/secure.page';

import wikiPage from "../pageobjects/wiki.page";

describe("My Wiki Page", () => {
	// before(async () => {
	// 	await mainPage.open();
	// });

	it("should render the container element", async () => {
		// await expect(wikiPage.mainContainer).toBeDisplayed();
	});

	it("should display three integration cards", async () => {
		// await expect(mainPage.integrationcards).toHaveChildren({
			// eq: 3,
		// });
	});

	it("should validate that the wiki button exists", async () => {
		// const btnSelector = {
		// 	forceSelect: true,
		// 	timeout: 15000,
		// 	selector: {
		// 		id: "wiki-button",
		// 		viewName: "sapmarco.projectpages.view.Home",
		// 	},
		// };
		// const control = await browser.asControl(btnSelector);
		// expect(await control.getText()).toEqual("Visit");
	});
});
