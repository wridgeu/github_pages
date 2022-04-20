import Component from "../Component";
import BaseController from "./Base.controller";

/**
 * @namespace sapmarco.projectpages.controller
 */
export default class HomeController extends BaseController {
	private _ownerComponent: Component;

	public onInit(): void {
		this._ownerComponent = this.getOwnerComponent() as Component;
		this.getView().addStyleClass(this._ownerComponent.getContentDensityClass());
	}

	public async onUI5IconPress(): Promise<void> {
		await this._ownerComponent.openVersionDialog();
	}
	/**
	 * Event-handler for click on theme toggle
	 */
	public onThemeSwap(): void {
		this.toggleTheme();
	}
	/**
	 * Event-handler for navigation
	 * to the Wiki-Page
	 */
	public onWiki(): void {
		this.navTo("RouteWiki");
	}
}
