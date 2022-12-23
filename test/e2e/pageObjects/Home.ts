import { wdi5 } from "wdio-ui5-service";

class Home {
	async open() {
		await wdi5.goTo("#/Home");
	}
	async journeyToWiki() {
		await browser
			.asControl({
				selector: {
					controlType: "sap.m.GenericTile",
					viewId: "container-projectpages---Home",
					i18NText: {
						propertyName: "header",
						key: "wikiButtonHeader",
					},
				},
			})
			.press();
	}
	async journeyToUI5Con() {
		await browser
			.asControl({
				selector: {
					controlType: "sap.m.GenericTile",
					viewId: "container-projectpages---Home",
					i18NText: {
						propertyName: "header",
						key: "ui5ConButtonHeader",
					},
				},
			})
			.press();
	}
}
export default new Home();
