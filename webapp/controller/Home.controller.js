sap.ui.define(["./Base"], (BaseController) => {
	"use strict";
	return BaseController.extend("sapmarco.projectpages.controller.Home", {
		onInit() {
			//set content density
			this.initializeViewTheme();
			this.getView().addStyleClass(
				this.getOwnerComponent().getContentDensityClass()
			);
		},
		onUI5IconPress() {
			this.getOwnerComponent().openVersionDialog();
		},
		onThemeSwap(sTheme) {
			this.toggleTheme(sTheme);
		},
		onWiki(){
			this.navTo("RouteWiki");
		}
	});
});
