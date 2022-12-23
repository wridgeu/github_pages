import UI5Con from "../pageObjects/UI5Con";
import Home from "../pageObjects/Home";
import { wdi5 } from "wdio-ui5-service";

describe("basic navigation test ui5con", () => {
	before(async () => {
		await wdi5.goTo("#/Home");
	});

	it("should navigate to ui5con and back", async () => {
		await Home.journeyToUI5Con();
		await UI5Con.navigateBack();
	});
});
