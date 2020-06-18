sap.ui.define(["./Base", "sapmarco/projectpages/libs/marked.min"], function (
	BaseController,
	Marked
) {
	"use strict";
	return BaseController.extend("sapmarco.projectpages.controller.Wiki", {
		onInit: function () {
			//Init
			this.initializeViewTheme();
			this.getView().addStyleClass(
				this.getOwnerComponent().getContentDensityClass()
			);
		},
		onThemeSwap: function (sTheme) {
			this.toggleTheme(sTheme);
		},
		onBackHome: function () {
			this.onNavBack();
		},
		onMarkdown: function () {
			(async function () {
				Marked.setOptions({
					highlight: function (code, lang, callback) {
						sap.ui.require(["sapmarco/projectpages/libs/prism"], function (
							prism
						) {
							const result = prism.highlight(code, lang);
							callback(result.toString());
						});
					},
				});
				const renderer = {
					paragraph(text) {
						const regEx = /\.(?:jpg|gif|png)/g;
						if (!text.match(regEx)) {
							return false;
						}
						const image = text.substring(2, text.length - 2);
						const imagePath = `https://raw.githubusercontent.com/wiki/SAPMarco/SAPMarco.github.io/${image}`;
						return `
							<img src="${imagePath}"></img>
						`;
					},
				};
				Marked.use({ renderer });
				let response = await fetch(
					"https://raw.githubusercontent.com/wiki/SAPMarco/SAPMarco.github.io/UI5%20Instantiation.md" //_Sidebar.md"
				).then((response) => response.text());
				// this.byId("container").getDomRef().innerHTML = Marked(response);
				this.byId("container").getDomRef().childNodes[1].innerHTML = Marked(
					response
				);
			}.call(this));
		},
	});
});
