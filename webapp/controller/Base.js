sap.ui.define(
	[
		"sap/ui/core/mvc/Controller",
		"sap/ui/core/routing/History",
		"sap/ui/core/UIComponent",
	],
	function (Controller, History, UIComponent) {
		"use strict";
		var sFiori3DarkTheme = "sap_fiori_3_dark";
		var sSapBelize = "sap_belize";
		return Controller.extend("Base", {
			initializeViewTheme: function () {
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
					this.byId("cVRow").removeStyleClass("cV");
					this._setInvertedStyleOnSocials();
					if (
						this.byId("footerToolbar").aCustomStyleClasses.indexOf("toolbar") >
						-1
					) {
						this.byId("footerToolbar").removeStyleClass("toolbar");
						this.byId("footerToolbar").addStyleClass("setToolbarDarkMode");
					}
				}
			},

			toggleTheme: function (sTheme) {
				if (sap.ui.getCore().getConfiguration().getTheme() === sSapBelize) {
					sap.ui.getCore().applyTheme(sTheme);
					this.byId("cVRow").removeStyleClass("cV");
					this._setInvertedStyleOnSocials();
					this.byId("footerToolbar")
						.removeStyleClass("toolbar")
						.addStyleClass("setToolbarDarkMode");
				} else {
					sap.ui.getCore().applyTheme(sSapBelize);
					this.byId("cVRow").addStyleClass("cV");
					this._setInvertedStyleOnSocials();
					this.byId("footerToolbar")
						.removeStyleClass("setToolbarDarkMode")
						.addStyleClass("toolbar");
				}
			},
			navTo: function (psTarget, pmParameters, pbReplace) {
				this.getRouter().navTo(psTarget, pmParameters, pbReplace);
			},

			getRouter: function () {
				return UIComponent.getRouterFor(this);
			},

			onNavBack: function () {
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
