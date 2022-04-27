import Page from "sap/m/Page";
import Component from "../Component";
import {
	getSelectedContent,
	getWikiIndex,
	getContentEditLink,
} from "../util/githubService";
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
	private _isPhone: boolean;

	private _wikiContentModel: JSONModel;

	public onInit(): void {
		this.getView().addStyleClass(
			(this.getOwnerComponent() as Component).getContentDensityClass()
		);

		// TODO: Add type definition for devicemodel system struct
		this._isPhone = (this.getOwnerComponent() as Component)
			.getModel("device")
			.getData().system.phone;
		this._wikiContentModel = this.getView()
			.setModel(new JSONModel(), "convertedmarkdown")
			.getModel("convertedmarkdown") as JSONModel;

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
		matches.forEach((element) => {
			(this.byId("sidebar") as List).addItem(
				new ActionListItem({
					text: `${element[1]}`,
					press: this.onSidebarSelection.bind(
						this,
						element[1],
						this._wikiContentModel,
						this._isPhone
					),
				})
			);
		});
	}

	/**
	 * @param  {string} sMarkdownFileName name of markdown file
	 */
	private async onSidebarSelection(
		sMarkdownFileName: string,
		jsonModel: JSONModel,
		isOpenedOnPhone: boolean
	): Promise<void> {
		//get markdown page and encode - to %20
		const markdownPage = await getSelectedContent(sMarkdownFileName);
		const editLink = getContentEditLink(sMarkdownFileName);

		jsonModel.setData({
			markdown: `<div class="container">${markdownService.parse(
				markdownPage
			)}</div>`,
			title: sMarkdownFileName,
			edit: editLink,
		});

		//improve UX by always starting at the top when opening up new content & jumping to new pane
		if (isOpenedOnPhone)
			(this.byId("responsiveSplitter") as ResponsiveSplitter)._activatePage(1);
		if (this.byId("markdownSection"))
			(this.byId("markdownSection") as Page).scrollTo(0, 0);
	}
}
