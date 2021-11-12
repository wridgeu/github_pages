/**
 * Fetch the markdown content
 * @returns {Promise<string>} content of markdown file
 */
function getSelectedContent(mdContent: string): Promise<string> {
	//return markdown content & encode '-' with %20
	return fetch(
		`https://raw.githubusercontent.com/wiki/wridgeu/wridgeu.github.io/${mdContent.replace(/[-*?]/g,"%20")}.md`
	).then((response) => response.text())
}

/**
 * Fetch the markdown table of contents (index) of
 * the github wiki
 * @returns {Promise<string>} content of markdown file
 */
function getWikiIndex(): Promise<string> {
	//return sidebar to use as initial entry point
	return fetch(
		`https://raw.githubusercontent.com/wiki/wridgeu/wridgeu.github.io/_Sidebar.md`
	).then((response) => response.text());
}

/**
 * @namespace sapmarco.projectpages.util
 */
export {getWikiIndex, getSelectedContent};
