sap.ui.define(["./Base", "sapmarco/projectpages/libs/marked.min"], function (
	BaseController,
	Marked
) {
	"use strict";
	return BaseController.extend("sapmarco.projectpages.controller.Wiki", {
		onBackHome: function () {
			this.onNavBack();
		},
		onMarkdown: function () {
			(async function () {
				let response = await fetch(
					"https://raw.githubusercontent.com/wiki/SAPMarco/SAPMarco.github.io/UI5%20CLI.md"
				).then((response) => response.text());
				this.byId("markdown").getDomRef().innerHTML = Marked(response); //_xContent.innerHTML
			}.bind(this)());
		},
	});
});
