sap.ui.define(["sapmarco/projectpages/libs/marked.min", "sapmarco/projectpages/libs/highlight"], function (Marked, Highlight) {
	"use strict";
	// Syntax Highlighting
	Marked.setOptions({
		highlight: function (code, lang, callback) {
			// unsupported edge-cases
			if(lang === 'i18n' || lang === '' || lang === 'url' ) return
			return Highlight.highlightAuto(code).value;
		}
	});

	// Image Rendering
	const renderer = {
		paragraph(text) {
			// transform <p>-tags that match the regex to <img>-tags
			const regEx = /\[\[.+?\.(?:jpg|gif|png)\]\]/g;
			// doesn't match our [[<something>.jpg]]-pattern
			if (!text.match(regEx)) return false
			// remove whitespace (edge case)
			text = text.trim()
			// remove '[[' and ']]'
			const image = text.substring(2, text.length - 2);
			// rebuild image path for raw github
			const imagePath = `https://raw.githubusercontent.com/wiki/SAPMarco/SAPMarco.github.io/${image}`;
			return `
				<img class="wikiImage" src="${imagePath}"></img>
			`;
		}
	};

	Marked.use({ renderer });

	return Marked;
});
