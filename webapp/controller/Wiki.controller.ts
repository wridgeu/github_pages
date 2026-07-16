import Page from "sap/m/Page";
import Component from "../Component";
import {
	getSelectedContent,
	getWikiIndex,
	getContentEditLink
} from "../util/githubService";
import { markdownService } from "../util/markdownService";
import BaseController from "./Base.controller";
import List from "sap/m/List";
import SplitContainer from "sap/m/SplitContainer";
import ActionListItem from "sap/m/ActionListItem";
import JSONModel from "sap/ui/model/json/JSONModel";
import Device from "sap/ui/Device";

/**
 * @namespace sapmarco.projectpages.controller
 */
export default class WikiController extends BaseController {
	private _wikiContentModel: JSONModel;
	private _viewStateModel: JSONModel;
	private _selectionToken = 0;

	public onInit(): void {
		this.getView().addStyleClass(
			(this.getOwnerComponent() as Component).getContentDensityClass()
		);

		this._wikiContentModel = new JSONModel({
			markdown: "",
			title: "",
			edit: ""
		});

		this.getView().setModel(this._wikiContentModel, "convertedmarkdown");

		this._viewStateModel = new JSONModel({ busy: false });
		this.getView().setModel(this._viewStateModel, "viewState");

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
	 * Back navigation. On phone the SplitContainer shows one column at a time, so
	 * when the detail (content) is up, step back to the master (sidebar) rather
	 * than leaving the wiki. On desktop the master is always shown
	 * (StretchCompressMode), so this falls through to the default (home).
	 */
	public onNavBack(): void {
		const split = this.byId("wikiSplit") as SplitContainer;
		if (split && !split.isMasterShown()) {
			split.toMaster((this.byId("sidebarPage") as Page).getId(), "show");
			return;
		}
		super.onNavBack();
	}

	/**
	 * Event-handler for route matched
	 */
	private async _onRouteMatched(): Promise<void> {
		await this._initializeSidebar();
	}

	/**
	 * Initialization of sidebar
	 */
	private async _initializeSidebar(): Promise<void> {
		this._viewStateModel.setProperty("/busy", true);
		try {
			//get sidebar from actual github-wiki
			const wikiIndex = await getWikiIndex();
			//parse markdown to html
			const parsedMarkdown = markdownService.parse(wikiIndex);
			const matches = [...parsedMarkdown.matchAll(/\wiki\/(.*?)"/g)];
			// RouteWiki's matched handler runs on every entry into the wiki and the
			// sidebar List is cached across visits, so clear it first — otherwise
			// the entries are appended again on each re-navigation.
			(this.byId("sidebar") as List).destroyItems();
			matches.forEach(element => {
				(this.byId("sidebar") as List).addItem(
					new ActionListItem({
						text: `${element[1]}`,
						press: this.onSidebarSelection.bind(
							this,
							element[1],
							this._wikiContentModel,
							Device.system.phone
						)
					})
				);
			});
		} finally {
			this._viewStateModel.setProperty("/busy", false);
		}
	}

	/**
	 * @param  {string} sMarkdownFileName name of markdown file
	 */
	private onSidebarSelection(
		sMarkdownFileName: string,
		jsonModel: JSONModel,
		isOpenedOnPhone: boolean
	): void {
		// Each tap supersedes the previous one; a later tap bumps the token so a
		// slower earlier fetch cannot overwrite the newer pane or clear its busy.
		const token = ++this._selectionToken;
		// fix eslint issue in press event handler of ActionListItem:
		// see: https://stackoverflow.com/a/63488201
		// also: https://typescript-eslint.io/rules/no-floating-promises/
		void (async () => {
			this._viewStateModel.setProperty("/busy", true);
			try {
				//get markdown page and encode - to %20
				const markdownPage = await getSelectedContent(sMarkdownFileName);
				const editLink = getContentEditLink(sMarkdownFileName);
				const parsedMarkdown = markdownService.parse(markdownPage);

				// A newer tap has taken over while this fetch was in flight; drop
				// the stale result so it cannot replace the newer content.
				if (token !== this._selectionToken) {
					return;
				}

				jsonModel.setData({
					markdown: `<div class="container">${parsedMarkdown}</div>`,
					title: sMarkdownFileName,
					edit: editLink
				});

				//improve UX by always starting at the top when opening up new content & jumping to new pane
				if (isOpenedOnPhone)
					// On phone the SplitContainer collapses to a single column; reveal
					// the detail (content) page after a sidebar tap via its public API.
					(this.byId("wikiSplit") as SplitContainer).toDetail(
						(this.byId("markdownSection") as Page).getId(),
						"show"
					);
				if (this.byId("markdownSection"))
					(this.byId("markdownSection") as Page).scrollTo(0, 0);
			} finally {
				// Only the latest tap owns the busy state; an out-of-order earlier
				// tap must not clear the newer tap's indicator.
				if (token === this._selectionToken) {
					this._viewStateModel.setProperty("/busy", false);
				}
			}
		})();
	}
}
