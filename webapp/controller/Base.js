sap.ui.define(
	[
		"sap/ui/core/mvc/Controller",
		"sap/ui/core/routing/History",
		"sap/ui/core/UIComponent",
	], 
	(Controller, History, UIComponent) => {
		"use strict";
		var sFiori3DarkTheme = "sap_fiori_3_dark";
		var sSapBelize = "sap_belize";
		return Controller.extend("Base", {
			initializeViewTheme() {
				this._setInvertedStyleOnSocials = function () {
					return this.byId("socialsGrouped").aCustomStyleClasses.indexOf(
						"invertSocials"
					) > -1
						? this.byId("socialsGrouped").removeStyleClass("invertSocials")
						: this.byId("socialsGrouped").addStyleClass("invertSocials");
				};
				//check users preferred color scheme
				if (
					window.matchMedia &&
					window.matchMedia("(prefers-color-scheme: dark)").matches
				) {
					sap.ui.getCore().applyTheme(sFiori3DarkTheme);
					if (this.byId("cVRow")) {
						this.byId("cVRow").removeStyleClass("cV");
						this._setInvertedStyleOnSocials();
					}
					if (
						this.byId("footerToolbar").aCustomStyleClasses.indexOf("toolbar") >
						-1
					) {
						this.byId("footerToolbar").removeStyleClass("toolbar");
						this.byId("footerToolbar").addStyleClass("setToolbarDarkMode");
					}
				}
			},

			toggleTheme(sTheme) {
				if (sap.ui.getCore().getConfiguration().getTheme() === sSapBelize) {
					sap.ui.getCore().applyTheme(sTheme);
					this.byId("cVRow").removeStyleClass("cV");
					this.byId("footerToolbar")
						.removeStyleClass("toolbar")
						.addStyleClass("setToolbarDarkMode");
					this._setInvertedStyleOnSocials();
				} else {
					sap.ui.getCore().applyTheme(sSapBelize);
					this.byId("cVRow").addStyleClass("cV");
					this.byId("footerToolbar")
						.removeStyleClass("setToolbarDarkMode")
						.addStyleClass("toolbar");
					this._setInvertedStyleOnSocials();
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
			},
		});
	}
);
