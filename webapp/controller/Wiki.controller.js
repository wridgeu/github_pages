sap.ui.define(
	["./Base", "sapmarco/projectpages/model/marked", "sap/m/ActionListItem"],
	function (BaseController, Marked, ActionListItem) {
		"use strict";
		return BaseController.extend("sapmarco.projectpages.controller.Wiki", {
			onInit: function () {
				//Init
				this.initializeViewTheme();
				this.getView().addStyleClass(
					this.getOwnerComponent().getContentDensityClass()
				);
				this._initializeSidebar();
			},
			onThemeSwap: function (sTheme) {
				this.toggleTheme(sTheme);
			},
			onBackHome: function () {
				this.onNavBack();
			},
			_initializeSidebar: function () {
				// set up the sidebar
				(async function () {
					const response = await fetch(
						"https://raw.githubusercontent.com/wiki/SAPMarco/SAPMarco.github.io/_Sidebar.md"
					).then((response) => response.text());
					const parsedMarkdown = await Marked(response);
					let matches = [...parsedMarkdown.matchAll(/\wiki\/(.*?)\"/g)];
					for (let i = 0; i < matches.length; i++) {
						this.byId("sidebar").addItem(
							new ActionListItem({
								text: `${matches[i][1]}`,
								press: this.onSidebarSelection,
							})
						);
					}
				}.call(this));
			},
			onSidebarSelection: function () {
				(async function () {
					//get markdown page and encode - to %20
					const response = await fetch(
						`https://raw.githubusercontent.com/wiki/SAPMarco/SAPMarco.github.io/${this.getText().replace(/[-*?]/g,"%20")}.md`
					).then((response) => response.text());
					//dirty but works for now...
					this.getParent().getParent().getParent().getParent().getParent().getParent().getParent().getParent().byId("markdownContainer").getDomRef().childNodes[1].innerHTML = await Marked(response);
				}.call(this));
			},
		});
	}
);
