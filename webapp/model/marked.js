sap.ui.define(["sapmarco/projectpages/libs/marked.min"], function (Marked) {
	"use strict";

	Marked.setOptions({
		highlight: function (code, lang, callback) {
			sap.ui.require(["sapmarco/projectpages/libs/prism"], function (Prism) {
				// syntax highlighting via prism.js
				callback(Prism.highlight(code, lang).toString());
			});
		},
	});
	const renderer = {
		paragraph(text) {
			//transform <p>-tags that match the regex to <img>-tags
			const regEx = /\[\[.+?\.(?:jpg|gif|png)\]\]/g;
			if (!text.match(regEx)) {
				return false;
			}
			const image = text.substring(2, text.length - 2);
			const imagePath = `https://raw.githubusercontent.com/wiki/SAPMarco/SAPMarco.github.io/${image}`;
			return `
				<img src="${imagePath}"></img>
			`;
		},
	};

	Marked.use({ renderer });

	return Marked;
});
