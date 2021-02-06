sap.ui.define([
		"sap/ui/core/Core",
		"sap/ui/core/mvc/Controller",
		"sap/ui/core/routing/History",
		"sap/ui/core/UIComponent"
	], (Core, Controller, History, UIComponent) => {
		"use strict";
		
		return Controller.extend("Base", {

			_sDarkTheme: "sap_fiori_3_dark",
			_sLightTheme: "sap_fiori_3",

			/**
			 * Check the preferred color scheme of user
			 * and initialize the UI5 theming accordingly
			 */
			initializeTheme() {
				if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
					Core.applyTheme(this._sDarkTheme);
				}
			},			
			/**
			 * Switching between light & dark themes
			 */
			toggleTheme() {
				if (Core.getConfiguration().getTheme() === this._sLightTheme) {
					Core.applyTheme(this._sDarkTheme);
				} else {
					Core.applyTheme(this._sLightTheme);
				}
			},			
			/**
			 * @param  {string} psTarget Target
			 * @param  {object} pmParameters Parameters
			 * @param  {boolean} pbReplace Replace routing hash?
			 */
			navTo(psTarget, pmParameters, pbReplace) {
				this.getRouter().navTo(psTarget, pmParameters, pbReplace);
			},
			/**
			 * @returns {sap.ui.core.routing.Router} UIComponent router via context 
			 */
			getRouter() {
				return UIComponent.getRouterFor(this);
			},
			/**
			 * Event-handler for backwards navigation
			 */
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
