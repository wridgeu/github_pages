import { Marked, type Tokens, type RendererThis } from "marked";
import { markedHighlight } from "marked-highlight";
import hljs from "highlight.js/lib/core";
import js from "highlight.js/lib/languages/javascript";
import xml from "highlight.js/lib/languages/xml";
import css from "highlight.js/lib/languages/css";
import shell from "highlight.js/lib/languages/shell";
import bash from "highlight.js/lib/languages/bash";
import json from "highlight.js/lib/languages/json";
import plaintext from "highlight.js/lib/languages/plaintext";

// Register only the languages in use, keeping the self-contained bundle small.
// 'plaintext' is the fallback for code blocks with an unknown/absent language.
hljs.registerLanguage("javascript", js);
hljs.registerLanguage("xml", xml);
hljs.registerLanguage("css", css);
hljs.registerLanguage("shell", shell);
hljs.registerLanguage("bash", bash);
hljs.registerLanguage("json", json);
hljs.registerLanguage("plaintext", plaintext);

const marked = new Marked(
	markedHighlight({
		emptyLangClass: "hljs",
		langPrefix: "hljs language-",
		highlight(code, lang) {
			const language = hljs.getLanguage(lang) ? lang : "plaintext";
			return hljs.highlight(code, { language }).value;
		}
	})
);

const renderer = {
	// Render a paragraph that is solely the wiki '[[<file>.jpg]]' syntax as an
	// <img>; return false to fall back to marked's default paragraph renderer.
	paragraph(token: Tokens.Paragraph) {
		const imageSyntax = /\[\[.+?\.(?:jpg|gif|png)\]\]/;
		if (!imageSyntax.test(token.text)) {
			return false;
		}
		const image = token.text.trim().slice(2, -2);
		const imagePath = `https://raw.githubusercontent.com/wiki/wridgeu/wridgeu.github.io/${image}`;
		return `<img class="wikiImage" src="${imagePath}">`;
	},
	// Open links in a new tab without leaking the opener, keeping the SPA intact.
	link(this: RendererThis, token: Tokens.Link) {
		const text = this.parser.parseInline(token.tokens);
		const title = token.title ? ` title="${token.title}"` : "";
		return `<a target="_blank" rel="noopener noreferrer" href="${token.href}"${title}>${text}</a>`;
	}
};

marked.use({ renderer });

// Re-selecting a wiki page re-parses identical markdown, re-running marked and
// highlight.js from scratch. parse is pure and synchronous, so memoize it keyed
// by the raw markdown string. Both call sites (the sidebar index and each page
// body) share the cache; the wiki serves a small, fixed set of pages, so the map
// stays naturally bounded. Sanitization still runs downstream in the Markdown
// control on every render, so the security contract is unchanged.
const parseCache = new Map<string, string>();

const markdownService = {
	parse(markdown: string): string {
		const cached = parseCache.get(markdown);
		if (cached !== undefined) {
			return cached;
		}
		const html = marked.parse(markdown) as string;
		parseCache.set(markdown, html);
		return html;
	}
};

/**
 * @namespace sapmarco.projectpages.util
 */
export { markdownService };
