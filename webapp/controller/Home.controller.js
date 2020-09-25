sap.ui.define(["./Base"], (BaseController) => {
	"use strict";
	return BaseController.extend("sapmarco.projectpages.controller.Home", {

		/**
		 * Initialize theme and set the content density
		 */
		onInit() {
			this.initializeTheme();
			this.getView().addStyleClass(
				this.getOwnerComponent().getContentDensityClass()
			);
		},
		/**
		 * Event-handler for click on the UI5Icon
		 * within the application footer 
		 */
		onUI5IconPress() {
			this.getOwnerComponent().openVersionDialog();
		},
		/**
		 * Event-handler for click on theme toggle
		 */
		onThemeSwap() {
			this.toggleTheme();
		},
		/**
		 * Event-handler for navigation
		 * to the Wiki-Page
		 */
		onWiki(){
			this.navTo("RouteWiki");
		}
	});
});
