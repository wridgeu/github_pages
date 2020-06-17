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
				let response = await fetch(
					"https://raw.githubusercontent.com/wiki/SAPMarco/SAPMarco.github.io/_Sidebar.md"
				).then((response) => response.text());
				this.byId("markdown").getDomRef().innerHTML = Marked(response); //_xContent.innerHTML
			}.bind(this)());
		},
	});
});
