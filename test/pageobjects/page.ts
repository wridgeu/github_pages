/**
* main page object containing all methods, selectors and functionality
* that is shared across all page objects
*/
export default class Page {
    /**
    * Opens a sub page of the page
    * @param path path of the sub page (e.g. /path/to/page.html)
    */
    public open(path: string): Promise<string> {
        // https://github.com/js-soft/wdi5/blob/main/wdio-ui5-service/README.md#navigation
        return browser.goTo(path);
    }
}
