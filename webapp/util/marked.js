sap.ui.define(
	[
		"thirdparty/marked/marked.min", 
		"thirdparty/highlightjs/highlight"
	],() => {
	"use strict";
	
	/**
	 * Syntax Highlighting
	 * @returns {string} highlighted code block 
	 */
	marked.setOptions({
		highlight: function (code, lang) {
			// unsupported edge-cases
			if (lang === 'i18n' || lang === '' || lang === 'url' ) return
			// eslint-disable-next-line consistent-return
			return hljs.highlightAuto(code).value;
		}
	});

	/**
	 * Image Rendering
	 * @returns {HTMLImageElement|string} Dynamic image HTML-Tag
	 */
	const renderer = {
		paragraph(text) {
			// transform <p>-tags that match the regex to <img>-tags
			const regEx = /\[\[.+?\.(?:jpg|gif|png)\]\]/g;
			// doesn't match our [[<something>.jpg]]-pattern
			if (!text.match(regEx)) return false
			// remove whitespace (edge case) && remove '[[' and ']]'
			const image = text.trim() && text.substring(2, text.length - 2);
			// rebuild image path for raw github
			const imagePath = `https://raw.githubusercontent.com/wiki/wridgeu/wridgeu.github.io/${image}`;

			return `<img class="wikiImage" src="${imagePath}"></img>`;
		}
	};

	marked.use({ renderer });

	return marked;
});
