sap.ui.define([], function () {
	"use strict";

	return {
		getSelectedContent: function(mdContent){
			//return markdown content & encode '-' with %20
			return fetch(
				`https://raw.githubusercontent.com/wiki/SAPMarco/SAPMarco.github.io/${mdContent.replace(/[-*?]/g,"%20")}.md`
			).then((response) => response.text())
		},
		getWikiIndex: function(){
			//return sidebar to use as initial entry point
			return fetch(
				`https://raw.githubusercontent.com/wiki/SAPMarco/SAPMarco.github.io/_Sidebar.md`
			).then((response) => response.text());
		}
	};
});
