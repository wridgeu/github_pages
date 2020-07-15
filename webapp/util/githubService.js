sap.ui.define([],() => {
	"use strict";

	return {
		getSelectedContent(mdContent){
			//return markdown content & encode '-' with %20
			return fetch(
				`https://raw.githubusercontent.com/wiki/SAPMarco/SAPMarco.github.io/${mdContent.replace(/[-*?]/g,"%20")}.md`
			).then((response) => response.text())
		},
		getWikiIndex(){
			//return sidebar to use as initial entry point
			return fetch(
				`https://raw.githubusercontent.com/wiki/SAPMarco/SAPMarco.github.io/_Sidebar.md`
			).then((response) => response.text());
		}
	};
});
