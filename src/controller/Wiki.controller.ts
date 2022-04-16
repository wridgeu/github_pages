import ResourceBundle from "sap/base/i18n/ResourceBundle";
import Page from "sap/m/Page";
import ResourceModel from "sap/ui/model/resource/ResourceModel";
import Component from "../Component";
import { getSelectedContent, getWikiIndex } from "../util/githubService";
import { markdownService } from "../util/markdownService";
import BaseController from "./Base.controller";
import List from "sap/m/List";
import ActionListItem from "sap/m/ActionListItem";
import JSONModel from "sap/ui/model/json/JSONModel";
import ResponsiveSplitter from "sap/ui/layout/ResponsiveSplitter";

/**
 * @namespace sapmarco.projectpages.controller
 */
export default class WikiController extends BaseController {

	private _isPhone: boolean

	private _jsonModel: JSONModel

	public onInit(): void {
		this.getView().addStyleClass(
			(this.getOwnerComponent() as Component).getContentDensityClass()
		);

		// TODO: Add type definition for devicemodel system struct
		this._isPhone = (this.getOwnerComponent() as Component).getModel("device").getData().system.phone;
		this._jsonModel = (this.getView().setModel(new JSONModel(), "convertedmarkdown").getModel("convertedmarkdown") as JSONModel);

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
		
		const parsedMarkdown = markdownService.render(wikiIndex);
		const matches = [...parsedMarkdown.matchAll(/\wiki\/(.*?)\"/g)];
		matches.forEach(element => {
			(this.byId("sidebar") as List).addItem(
						new ActionListItem({
							text: `${element[1]}`,
							press: this.onSidebarSelection.bind(this, element[1], this._jsonModel, this._isPhone),
						})
			)
		})				
	}

	/**
	 * @param  {string} sMarkdownFileName name of markdown file
	 */
	private async onSidebarSelection(sMarkdownFileName: string, jsonModel: JSONModel, isOpenedOnPhone: boolean): Promise<void> {
		//get markdown page and encode - to %20
		const markdownPage = await getSelectedContent(sMarkdownFileName);
		
		//set title to currently selected page for better UX
		(this.byId("wikiPage") as Page).setTitle(sMarkdownFileName);

		jsonModel.setData({ markdown: `<div class="container">${markdownService.render(markdownPage)}</div>`});

		//improve UX by always starting at the top when opening up new content & jumping to new pane
		if(isOpenedOnPhone) (this.byId("responsiveSplitter") as ResponsiveSplitter)._activatePage(1);
		if(this.byId("markdownSection")) (this.byId("markdownSection") as Page).scrollTo(0, 0);		
	}

}