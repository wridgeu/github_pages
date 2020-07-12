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

			initializeViewTheme() {
				//check preferred color scheme of user
				if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
					this.oCore.applyTheme(this.sDarkTheme);
					this.byId("footerToolbar").addStyleClass("toolbarDarkMode")
					if (this.byId("cVRow")) {
						this.byId("cVRow").removeStyleClass("introductionTextBackground");
						this._setInvertedStyleOnSocials();
					}	
				}
			},

			adjustToolbarTheme(){
				if (this.oCore.getConfiguration().getTheme() === this.sLightTheme) {					
					this.byId("footerToolbar").removeStyleClass("toolbarDarkMode").addStyleClass("toolbarLightMode")						
				} else {					
					this.byId("footerToolbar").removeStyleClass("toolbarLightMode").addStyleClass("toolbarDarkMode")	
				}
			},
			
			toggleTheme(sTheme) {
				if (this.oCore.getConfiguration().getTheme() === this.sLightTheme) {
					this.oCore.applyTheme(sTheme);
					if (this.byId("cVRow")) { this.byId("cVRow").removeStyleClass("introductionTextBackground");}
					this.byId("footerToolbar")
						.removeStyleClass("toolbarLightMode")
						.addStyleClass("toolbarDarkMode");
					this._setInvertedStyleOnSocials();
				} else {
					this.oCore.applyTheme(this.sLightTheme);
					if (this.byId("cVRow")) {this.byId("cVRow").addStyleClass("introductionTextBackground");}
					this.byId("footerToolbar")
						.removeStyleClass("toolbarDarkMode")
						.addStyleClass("toolbarLightMode");
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
			
			_setInvertedStyleOnSocials: function () {
				if(!this.byId("socialsGrouped")) return;
				return this.byId("socialsGrouped").aCustomStyleClasses.indexOf("invertSocials") > -1
					? this.byId("socialsGrouped").removeStyleClass("invertSocials")
					: this.byId("socialsGrouped").addStyleClass("invertSocials");
			}
		});
	}
);
