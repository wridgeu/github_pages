export const config: WebdriverIO.Config = {
	autoCompileOpts: {
		autoCompile: true,
		tsNodeOpts: {
			transpileOnly: true,
			project: "test/tsconfig.json",
		},
	},
	specs: ["./test/specs/**/*.ts"],
	exclude: [
		// 'path/to/excluded/files'
	],
	maxInstances: 10,
	capabilities: [
		{
			maxInstances: 5,
			browserName: "chrome",
			'wdio:devtoolsOptions': {
				headless: true
			},
			path: '/wd/hub',
			acceptInsecureCerts: true,
		},
	],
	// Level of logging verbosity: trace | debug | info | warn | error | silent
	logLevel: "info",
	bail: 0,
	baseUrl: "http://localhost:8080",
	waitforTimeout: 10000,
	connectionRetryTimeout: 120000,
	connectionRetryCount: 3,
	services: ["ui5", "chromedriver"],
	wdi5: {
		// screenshotPath: require('path').join('test', 'report', 'screenshots'), // [optional] using the project root
		screenshotsDisabled: true, // [optional] {Boolean}; if set to true screenshots won't be taken and not written to file system
		logLevel: 'verbose', // [optional] error | verbose | silent
		platform: 'browser', // [mandatory] browser | android | ios | electron
		url: 'index.html', // [mandatory, not empty] path to your bootstrap html file. If your server autoredirects to a 'domain:port/' like root url use empty string ''
		deviceType: 'web', // [mandatory] native | web
		skipInjectUI5OnStart: false, // [optional] true when UI5 is not on the start page, you need to later call <wdioUI5service>.injectUI5(); manually
		waitForUI5Timeout: 15000 // [optional] maximum waiting time while checking for UI5 availability
	},
	framework: "mocha",
	mochaOpts: {
		// ui: "bdd",
		timeout: 60000,
	},
	reporters: ["spec"]
};
