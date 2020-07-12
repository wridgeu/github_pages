sap.ui.define(
	[
		"sap/ui/core/mvc/Controller",
		"sap/ui/core/routing/History",
		"sap/ui/core/UIComponent"
	], 
	(Controller, History, UIComponent) => {
		"use strict";
		
		return Controller.extend("Base", {

			sDarkTheme: "sap_fiori_3_dark",
			sLightTheme: "sap_belize",
			oCore: sap.ui.getCore(),

			initializeTheme() {
				//check preferred color scheme of user
				if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
					this.oCore.applyTheme(this.sDarkTheme);
				}
			},
			
			toggleTheme() {
				if (this.oCore.getConfiguration().getTheme() === this.sLightTheme) {
					this.oCore.applyTheme(this.sDarkTheme);
				} else {
					this.oCore.applyTheme(this.sLightTheme);
				}
			},
			navTo(psTarget, pmParameters, pbReplace) {
				this.getRouter().navTo(psTarget, pmParameters, pbReplace);
			},

			getRouter() {
				return UIComponent.getRouterFor(this);
			},

			onNavBack() {
				var sPreviousHash = History.getInstance().getPreviousHash();

				if (sPreviousHash !== undefined) {
					window.history.back();
				} else {
					this.getRouter().navTo("RouteMain", {}, true /*no history*/);
				}
			}
		});
	}
);
