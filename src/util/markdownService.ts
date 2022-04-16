import hljs from "highlight.js";
import MarkdownIt from "markdown-it";

const md = MarkdownIt({
	linkify: true,
	highlight: function (str, lang) {
		// if (lang === "i18n" || lang === "" || lang === "url") return;
		if (lang && hljs.getLanguage(lang)) {
			try {
				return hljs.highlight(str, { language: lang }).value;
			} catch (e) {
				console.error(e);
			}
		}
		return "";
	},
});

md.renderer.rules.text = function (tokens, idx /*, options, env */) {
	// transform <p>-tags that match the regex to <img>-tags
	const regEx = /\[\[.+?\.(?:jpg|gif|png)\]\]/g;
	// doesn't match our [[<something>.jpg]]-pattern
	if (!tokens[idx].content.match(regEx))
		return md.utils.escapeHtml(tokens[idx].content);
	// remove whitespace (edge case) && remove '[[' and ']]'
	const image =
		tokens[idx].content.trim() &&
		tokens[idx].content.substring(2, tokens[idx].content.length - 2);
	// rebuild image path for raw github
	const imagePath = `https://raw.githubusercontent.com/wiki/wridgeu/wridgeu.github.io/${image}`;

	return `<img class="wikiImage" src="${imagePath}"></img>`;
};

/**
 * @namespace sapmarco.projectpages.util
 */
export { md as markdownService };
