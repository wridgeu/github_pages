sap.ui.define([],() => {
	"use strict";

	return {
		/**
		 * Fetch the selected markdown content
		 * @param  {string} mdContent filename of markdown file
		 * @returns {Promise<string>} content of markdown file
		 */
		getSelectedContent(mdContent){
			//return markdown content & encode '-' with %20
			return fetch(
				`https://raw.githubusercontent.com/wiki/wridgeu/wridgeu.github.io/${mdContent.replace(/[-*?]/g,"%20")}.md`
			).then((response) => response.text())
		},
		/**
		 * Fetch the markdown table of contents (index) of
		 * the github wiki
		 * @returns {Promise<string>} content of markdown file
		 */
		getWikiIndex(){
			//return sidebar to use as initial entry point
			return fetch(
				`https://raw.githubusercontent.com/wiki/wridgeu/wridgeu.github.io/_Sidebar.md`
			).then((response) => response.text());
		}
	};
});
