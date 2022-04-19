import hljs from "highlight.js";
import { marked } from "marked";

/**
 * Syntax Highlighting
 * @returns {string} highlighted code block
 */
marked.setOptions({
	highlight: function (string: string, lang?: string): string|void {
		if(lang && hljs.getLanguage(lang)) {
			return hljs.highlight(string, { language: lang }).value;
		}
	},
});

/**
 * Image Rendering
 * @returns {HTMLImageElement|string} Dynamic image HTML-Tag
 */
const renderer = {
	paragraph(text: string) {
		// transform <p>-tags that match the regex to <img>-tags
		const regEx = /\[\[.+?\.(?:jpg|gif|png)\]\]/g;
		// doesn't match our [[<something>.jpg]]-pattern
		if (!text.match(regEx)) return false;
		// remove whitespace (edge case) && remove '[[' and ']]'
		const image = text.trim() && text.substring(2, text.length - 2);
		// rebuild image path for raw github
		const imagePath = `https://raw.githubusercontent.com/wiki/wridgeu/wridgeu.github.io/${image}`;

		return `<img class="wikiImage" src="${imagePath}"></img>`;
	},
};

marked.use({ renderer });

/**
 * @namespace sapmarco.projectpages.util
 */
export { marked as markdownService };
