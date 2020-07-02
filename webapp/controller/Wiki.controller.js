sap.ui.define(
	[
		"./Base",
		"sapmarco/projectpages/model/marked",
		"sap/m/ActionListItem",
		"sapmarco/projectpages/model/githubService",
	],
	function (BaseController, Marked, ActionListItem, githubService) {
		"use strict";
		return BaseController.extend("sapmarco.projectpages.controller.Wiki", {
			onInit: function () {
				//Init
				this.initializeViewTheme();
				this.getView().addStyleClass(
					this.getOwnerComponent().getContentDensityClass()
				);
				this.getRouter()
					.getRoute("RouteWiki")
					.attachMatched(this._onRouteMatched, this);
			},
			onThemeSwap: function (sTheme) {
				this.toggleTheme(sTheme);
			},
			onBackHome: function () {
				this.onNavBack();
				//Reset the header as we're not reloading the page when re-entering it								
				this.byId("wikiPage").setTitle(this.getView().getModel("i18n").getResourceBundle().getText("wiki"));
			},
			onSidebarSelection: async function (oEvt) {
				//get markdown page and encode - to %20
				const response = await githubService.getSelectedContent(this.getText());
				// dirty & unflexible... -> has to be revisited
				this.getParent()
				.getParent()
				.getParent()
				.getParent()
				.getParent()
				.getParent()
				.getParent()
				.getParent()
				.byId("wikiPage").setTitle(this.getText())
				// parse markdown to html - dirty & unflexible... -> has to be revisited
				this.getParent()
					.getParent()
					.getParent()
					.getParent()
					.getParent()
					.getParent()
					.getParent()
					.getParent()
					.byId("markdownContainer")
					.getDomRef().innerHTML = await Marked(response);
			},
			_onRouteMatched: function (oEvt) {
				this._initializeSidebar();
			},
			_initializeSidebar: async function () {
				//get sidebar from wiki
				const response = await githubService.getWikiIndex();
				//parse markdown to html
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
			},
		});
	}
);
