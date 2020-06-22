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
				this.getRouter().getRoute("RouteWiki").attachMatched(this._onRouteMatched, this);
			},
			onThemeSwap: function (sTheme) {
				this.toggleTheme(sTheme);
			},
			onBackHome: function () {
				this.onNavBack();
			},
			onSidebarSelection: function (oEvt) {
				//TODO: fetch in another file
				(async function () {
					//get markdown page and encode - to %20
					const response = await fetch(
						`https://raw.githubusercontent.com/wiki/SAPMarco/SAPMarco.github.io/${this.getText().replace(/[-*?]/g,"%20")}.md`
					).then((response) => response.text());
					//dirty but works for now...
					//childNodes[1]
					this.getParent().getParent().getParent().getParent().getParent().getParent().getParent().getParent().byId("markdownContainer").getDomRef().innerHTML = await Marked(response);
				}.call(this));
			},
			_onRouteMatched: function(oEvt){
				this._initializeSidebar();
			},
			_initializeSidebar: function () {
				// set up the sidebar - TODO: fetch in another file
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
			}
		});
	}
);
