import { ChainablePromiseElement } from 'webdriverio';
import Page from './page';

/**
 * sub page containing specific selectors and methods for a specific page
 */
class MainPage extends Page {

    public get mainContainer(): ChainablePromiseElement<Promise<WebdriverIO.Element>> {
        return $('div[id="container"]');
    }

	public get integrationcards(): ChainablePromiseElement<Promise<WebdriverIO.Element>> {
		return $('#container-projectpages---Home--integrationcards-container > div > div')
	}

    /**
     * a method to encapsule automation code to interact with the page
     * e.g. to login using username and password
     */
    // public async login (username: string, password: string): Promise<void> {
    //     await this.inputUsername.setValue(username);
    //     // await this.inputPassword.setValue(password);
    //     // await this.btnSubmit.click();
    // }

    public open(): Promise<string> {
        return super.open('index.html');
    }
}

export default new MainPage();
