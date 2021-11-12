import ResourceBundle from "sap/base/i18n/ResourceBundle";
import Page from "sap/m/Page";
import ResourceModel from "sap/ui/model/resource/ResourceModel";
import Component from "../Component";
import { getSelectedContent, getWikiIndex } from "../util/githubService";
import { markdownService } from "../util/markdownService";
import BaseController from "./Base.controller";
import List from "sap/m/List";
import ActionListItem from "sap/m/ActionListItem";

/**
 * @namespace sapmarco.projectpages.controller
 */
export default class WikiController extends BaseController {

	public onInit(): void {
		this.getView().addStyleClass(
			(this.getOwnerComponent() as Component).getContentDensityClass()
		);
		this.getRouter()
			.getRoute("RouteWiki")
			.attachMatched(this._onRouteMatched.bind(this), this);
	}

	/**
	 * Event-handler for theme toggle
	 */
	public onThemeSwap(): void {
		this.toggleTheme();
	}

	/**
	 * Event-handler for route matched
	 */
	private async _onRouteMatched(): Promise<void> {
		await this._initializeSidebar();
	}

	/**
	 * Event-handler for backwards navigation
	 */
	public onBackHome(): void {
		this.onNavBack();
		//Reset the header as we're not reloading the page when re-entering it
		(this.byId("wikiPage") as Page).setTitle(
			((this.getView().getModel("i18n") as ResourceModel).getResourceBundle() as ResourceBundle).getText("wiki")
		);
	}			

	/**
	 * Initialization of sidebar
	 */
	private async _initializeSidebar(): Promise<void> {
		//get sidebar from actual github-wiki
		const wikiIndex = await getWikiIndex();
		//parse markdown to html
		const parsedMarkdown = markdownService.parse(wikiIndex);
		const matches = [...parsedMarkdown.matchAll(/\wiki\/(.*?)\"/g)];
		matches.forEach(element => {
			(this.byId("sidebar") as List).addItem(
						new ActionListItem({
							text: `${element[1]}`,
							press: this.onSidebarSelection.bind(this, element[1]),
						})
			)
		})				
	}

	/**
	 * @param  {string} sMarkdownFileName name of markdown file
	 */
	private async onSidebarSelection(sMarkdownFileName: string): Promise<void> {
		//get markdown page and encode - to %20
		const markdownPage = await getSelectedContent(sMarkdownFileName);
		//set title to currently selected page for better UX
		(this.byId("wikiPage") as Page).setTitle(sMarkdownFileName);
		//fill content with actual parsed markdown
		this.byId("markdownContainer").getDomRef().innerHTML = markdownService.parse(markdownPage);
		//improve UX by always starting at the top when opening up new content
		(this.byId("markdownSection") as Page).scrollTo(0, 0);
	}

}