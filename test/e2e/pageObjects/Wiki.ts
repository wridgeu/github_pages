import { wdi5 } from "wdio-ui5-service";

class Wiki {
	async open() {
		await wdi5.goTo("#/Wiki");
	}
	async journey() {
		await browser
			.asControl({
				selector: {
					controlType: "sap.m.ActionListItem",
					viewId: "container-projectpages---Wiki",
					properties: {
						text: "UI5-Views",
					},
				},
			})
			.press();
		await browser.asControl({
			selector: {
				id: "container-projectpages---Wiki--markdownSection",
			},
		});
		await browser.asControl({
			selector: {
				id: "container-projectpages---Wiki--markdownSection",
			},
		});
	}
	async navigateBack() {
		await browser
			.asControl({
				selector: {
					id: "container-projectpages---Wiki--wikiPage-navButton",
				},
			})
			.press();
	}
}
export default new Wiki();
