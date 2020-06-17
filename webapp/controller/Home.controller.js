sap.ui.define(["./Base"], function (BaseController) {
	"use strict";
	return BaseController.extend("sapmarco.projectpages.controller.Home", {
		onInit: function () {
			//set content density
			this.initializeViewTheme();
			this.getView().addStyleClass(
				this.getOwnerComponent().getContentDensityClass()
			);
		},
		onUI5IconPress: function () {
			this.getOwnerComponent().openVersionDialog();
		},
		onThemeSwap: function (sTheme) {
			this.toggleTheme(sTheme);
		},
		onWiki: function(){
			this.navTo("RouteWiki");
		}
	});
});
