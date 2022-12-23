import { wdi5 } from "wdio-ui5-service";
class UI5Con {
	async open() {
		await wdi5.goTo("#/UI5Con");
	}
	async navigateBack() {
		await browser
			.asControl({
				selector: {
					id: "container-projectpages---UI5Con--ui5ConPage-navButton-iconBtn",
				},
			})
			.press();
	}
}
export default new UI5Con();
