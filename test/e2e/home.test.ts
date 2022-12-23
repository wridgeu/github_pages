import Icon from "sap/ui/core/Icon";
import Image from "sap/m/Image";
import { wdi5 } from "wdio-ui5-service";
import { wdi5Selector } from "wdio-ui5-service/dist/types/wdi5.types";

describe("basic test", () => {
	before(async () => {
		await wdi5.goTo("#/Home");
	});

	it("should count 6 icons", async () => {
		const allIconsSelector: wdi5Selector = {
			selector: {
				controlType: "sap.ui.core.Icon",
				viewName: "sapmarco.projectpages.view.Home",
			},
		};
		const allIcons = (await browser.allControls(
			allIconsSelector
		)) as unknown as Array<Icon>;
		expect(allIcons.length).toEqual(6);
	});
	
	it("should count 5 social icons", async () => {
		const allImageSelector: wdi5Selector = {
			selector: {
				controlType: "sap.m.Image",
				viewName: "sapmarco.projectpages.view.Home",
			},
		};
		const allImages = (await browser.allControls(
			allImageSelector
		)) as unknown as Array<Image>;
		expect(allImages.length).toEqual(5);
	});
});
