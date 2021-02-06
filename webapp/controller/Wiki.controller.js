sap.ui.define([
		"./Base",
		"sapmarco/projectpages/util/marked",
		"sapmarco/projectpages/util/githubService",
		"sap/m/ActionListItem"
	], (BaseController, markedParser, githubService, ActionListItem) => {
		"use strict";

		return BaseController.extend("sapmarco.projectpages.controller.Wiki", {

			/**
			 * Set the content density and
			 * attach routing event-handler
			 */
			onInit() {
				this.getView().addStyleClass(
					this.getOwnerComponent().getContentDensityClass()
				);
				this.getRouter()
					.getRoute("RouteWiki")
					.attachMatched(this._onRouteMatched, this);
			},

			/**
			 * Event-handler for theme toggle
			 */
			onThemeSwap() {
				this.toggleTheme();
			},

			/**
			 * Event-handler for backwards navigation
			 */
			onBackHome() {
				this.onNavBack();
				//Reset the header as we're not reloading the page when re-entering it
				this.byId("wikiPage").setTitle(
					this.getView().getModel("i18n").getResourceBundle().getText("wiki")
				);
			},
			
			/**
			 * @param  {string} sMarkdownFileName name of markdown file
			 */
			async onSidebarSelection(sMarkdownFileName) {
				//get markdown page and encode - to %20
				const markdownPage = await githubService.getSelectedContent(sMarkdownFileName);
				//set title to currently selected page for better UX
				this.byId("wikiPage").setTitle(sMarkdownFileName);
				//fill content with actual parsed markdown				
				this.byId("markdownContainer").getDomRef().innerHTML = await markedParser(markdownPage);
				//improve UX by always starting at the top when opening up new content
				this.byId("markdownSection").scrollTo(0, 0);
			},

			/**
			 * Event-handler for route matched
			 */
			_onRouteMatched() {
				this._initializeSidebar();
			},

			/**
			 * Initialization of sidebar
			 */
			async _initializeSidebar() {
				//get sidebar from actual github-wiki
				const wikiIndex = await githubService.getWikiIndex();
				//parse markdown to html
				const parsedMarkdown = await markedParser(wikiIndex);
				let matches = [...parsedMarkdown.matchAll(/\wiki\/(.*?)\"/g)];
				matches.forEach(element => {
					this.byId("sidebar").addItem(
								new ActionListItem({
									text: `${element[1]}`,
									press: this.onSidebarSelection.bind(this, element[1]),
								})
					)
				})				
			},
		});
	}
);
