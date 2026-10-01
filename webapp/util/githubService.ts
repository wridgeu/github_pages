/**
 * Fetch the markdown content
 * @returns {Promise<string>} content of markdown file
 */
async function getSelectedContent(requestedContent: string): Promise<string> {
	const base = "https://raw.githubusercontent.com/wiki/wridgeu/wridgeu.github.io/";
	// pushed pages are stored with spaces, pages created in the web editor with hyphens
	let response = await fetch(`${base}${requestedContent.replace(/[-*?]/g, "%20")}.md`);
	if (response.status === 404) {
		response = await fetch(`${base}${encodeURIComponent(requestedContent)}.md`);
	}
	return response.text();
}

/**
 * Fetch the markdown table of contents (index) of
 * the github wiki
 * @returns {Promise<string>} content of markdown file
 */
function getWikiIndex(): Promise<string> {
	//return sidebar to use as initial entry point
	return fetch(`https://raw.githubusercontent.com/wiki/wridgeu/wridgeu.github.io/_Sidebar.md`).then((response) =>
		response.text(),
	);
}

function getContentEditLink(requestedContent: string): string {
	return `https://github.com/wridgeu/wridgeu.github.io/wiki/${requestedContent}/_edit`;
}

/**
 * @namespace sapmarco.projectpages.util
 */
export { getWikiIndex, getSelectedContent, getContentEditLink };
