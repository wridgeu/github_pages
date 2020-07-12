sap.ui.define(["./Base"], (BaseController) => {
	"use strict";
	return BaseController.extend("sapmarco.projectpages.controller.Home", {
		onInit() {
			// Initialize Theme - might prefer dark mode
			this.initializeTheme();

			// set content density
			this.getView().addStyleClass(
				this.getOwnerComponent().getContentDensityClass()
			);
		},
		onUI5IconPress() {
			this.getOwnerComponent().openVersionDialog();
		},
		onThemeSwap() {
			this.toggleTheme();
		},
		onWiki(){
			this.navTo("RouteWiki");
		}
	});
});
