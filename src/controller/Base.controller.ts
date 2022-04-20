import Core from "sap/ui/core/Core";
import Controller from "sap/ui/core/mvc/Controller";
import History from "sap/ui/core/routing/History";
import Router from "sap/ui/core/routing/Router";
import UIComponent from "sap/ui/core/UIComponent";

/**
 * @namespace sapmarco.projectpages.controller
 */
export default class BaseController extends Controller {
	private _sLightTheme = "sap_horizon";
	private _sDarkTheme = "sap_horizon_dark";

	public toggleTheme(): void {
		if (Core.getConfiguration().getTheme() === this._sLightTheme) {
			Core.applyTheme(this._sDarkTheme);
		} else {
			Core.applyTheme(this._sLightTheme);
		}
	}

	/**
	 * @param  {string} psTarget Target
	 * @param  {object} pmParameters Parameters
	 * @param  {boolean} pbReplace Replace routing hash?
	 */
	public navTo(
		psTarget: string,
		pmParameters?: object,
		targetInfo?: object,
		pbReplace?: boolean
	): void {
		this.getRouter().navTo(psTarget, pmParameters, targetInfo, pbReplace);
	}

	/**
	 * @returns {sap.ui.core.routing.Router} UIComponent router via context
	 */
	public getRouter(): Router {
		return UIComponent.getRouterFor(this);
	}

	/**
	 * Event-handler for backwards navigation
	 */
	public onNavBack() {
		const sPreviousHash = History.getInstance().getPreviousHash();

		if (sPreviousHash !== undefined) {
			window.history.back();
		} else {
			this.getRouter().navTo("RouteMain", {}, {}, true /*no history*/);
		}
	}
}
