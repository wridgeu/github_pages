import Wiki from "../pageObjects/Wiki";
import Home from "../pageObjects/Home";
import { wdi5 } from "wdio-ui5-service";

describe("basic navigation test wiki", () => {
	before(async () => {
		await wdi5.goTo("#/Home");
	});

	it("should navigate to wiki and back", async () => {
		await Home.journeyToWiki();
		await Wiki.journey();
		Wiki.navigateBack();
	});
});
