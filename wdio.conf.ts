export const config: WebdriverIO.Config = {
	autoCompileOpts: {
		autoCompile: true,
		tsNodeOpts: {
			transpileOnly: true,
			project: "test/tsconfig.json",
		},
	},
	// ==================================
	// Where should your test be launched
	// ==================================
	//
	runner: "local",
	//
	// =====================
	// Server Configurations
	// =====================
	// Host address of the running Selenium server. This information is usually obsolete, as
	// WebdriverIO automatically connects to localhost. Also if you are using one of the
	// supported cloud services like Sauce Labs, Browserstack, Testing Bot or LambdaTest, you also don't
	// need to define host and port information (because WebdriverIO can figure that out
	// from your user and key information). However, if you are using a private Selenium
	// backend, you should define the `hostname`, `port`, and `path` here.
	//
	// Override default path ('/wd/hub') for chromedriver service.
	path: '/',
	//
	// =================
	// Service Providers
	// =================
	// WebdriverIO supports Sauce Labs, Browserstack, Testing Bot and LambdaTest. (Other cloud providers
	// should work, too.) These services define specific `user` and `key` (or access key)
	// values you must put here, in order to connect to these services.
	//
	// If you run your tests on SauceLabs you can specify the region you want to run your tests
	// in via the `region` property. Available short handles for regions are `us` (default) and `eu`.
	// These regions are used for the Sauce Labs VM cloud and the Sauce Labs Real Device Cloud.
	// If you don't provide the region, it defaults to `us`.
	// region: 'us',
	//
	// ==================
	// Specify Test Files
	// ==================
	// Define which test specs should run. The pattern is relative to the directory
	// from which `wdio` was called.
	//
	// If you are calling `wdio` from an NPM script (see https://docs.npmjs.com/cli/run-script),
	// then the current working directory is where your `package.json` resides, so `wdio`
	// will be called from there.
	//

	specs: ["./test/specs/**/*.ts"],

	// Patterns to exclude.
	exclude: [],
	//
	// ============
	// Capabilities
	// ============
	// Define your capabilities here. WebdriverIO can run multiple capabilities at the same
	// time. Depending on the number of capabilities, WebdriverIO launches several test
	// sessions. Within your `capabilities`, you can overwrite the `spec` and `exclude`
	// options in order to group specific specs to a specific capability.
	//
	// First, you can define how many instances should be started at the same time. Let's
	// say you have 3 different capabilities (Chrome, Firefox, and Safari) and you have
	// set `maxInstances` to 1. wdio will spawn 3 processes.
	//
	// Therefore, if you have 10 spec files and you set `maxInstances` to 10, all spec files
	// will be tested at the same time and 30 processes will be spawned.
	//
	// The property basically handles how many capabilities from the same test should run tests.
	//
	maxInstances: 5,
	//
	// Or set a limit to run tests with a specific capability.
	// maxInstancesPerCapability: 1,
	//
	// If you have trouble getting all important capabilities together, check out the
	// Sauce Labs platform configurator - a great tool to configure your capabilities:
	// https://docs.saucelabs.com/reference/platforms-configurator
	//
	capabilities: [
		{
			// maxInstances can get overwritten per capability. So if you have an in-house Selenium
			// grid with only 5 firefox instances available you can make sure that not more than
			// 5 instances get started at a time.
			// maxInstances: 1,
			browserName: "chrome",
			"goog:chromeOptions": {
				w3c: false,
				// alternatively a second config i.e. `wdio-ci.conf.ts` could be created, in there we could spread the base conf and adjust it to use headless
				// here we opt for setting the process env to HEADLESS via the `package.json`
				args: process.env.HEADLESS ? ['--headless', '--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu'] : ["window-size=1440,800"],
			},
			acceptInsecureCerts: true,
		},
	],
	// Test runner services
	// Services take over a specific job you don't want to take care of. They enhance
	// your test setup with almost no effort. Unlike plugins, they don't add new
	// commands. Instead, they hook themselves up into the test process.
	// Use the Appium plugin for Webdriver. Without this, we would need to run appium
	// separately on the command line.
	services: [
		"chromedriver",
		"ui5", // service is officially registered "as a service" with webdriver.io
	],
	//
	// Additional list of node arguments to use when starting child processes
	execArgv: [],
	//
	// ===================
	// Test Configurations
	// ===================
	// Define all options that are relevant for the WebdriverIO instance here
	//
	// Level of logging verbosity: trace | debug | info | warn | error | silent
	// logLevel: process.env.HEADLESS ? "silent" : "info",
	//
	// Set specific log levels per logger
	// use 'silent' level to disable logger
	logLevels: {
		webdriver: "silent",
		"@wdio/applitools-service": "silent",
	},
	//
	// If you only want to run your tests until a specific amount of tests have failed use
	// bail (default is 0 - don't bail, run all tests).
	bail: 0,
	//
	// Set a base URL in order to shorten `url()` command calls. If your `url` parameter starts
	// with `/`, the `baseUrl` is prepended, not including the path portion of `baseUrl`.
	//
	// If your `url` parameter starts without a scheme or `/` (like `some/path`), the `baseUrl`
	// gets prepended directly.
	baseUrl: "http://localhost:8080/",
	//
	// Default timeout for all waitForUI5 commands. This is the timeout used for the `executeAsync`funciton
	waitforTimeout: 1000000,
	//
	// Add files to watch (e.g. application code or page objects) when running `wdio` command
	// with `--watch` flag. Globbing is supported.
	filesToWatch: [
		// e.g. rerun tests if I change my application code
		// './app/**/*.js'
	],
	//
	// Framework you want to run your specs with.
	// The following are supported: 'mocha', 'jasmine', and 'cucumber'
	// See also: https://webdriver.io/docs/frameworks.html
	//
	// Make sure you have the wdio adapter package for the specific framework installed before running any tests.
	framework: "mocha",
	mochaOpts: {
		timeout: 5000000,
	},
	//
	// The number of times to retry the entire specfile when it fails as a whole
	// specFileRetries: 1,
	// Default timeout in milliseconds for request
	// if browser driver or grid doesn't send response
	connectionRetryTimeout: 6000000,
	//
	// Default request retries count
	connectionRetryCount: 3,
	//
	// Test reporter for stdout.
	// The only one supported by default is 'dot'
	// See also: https://webdriver.io/docs/dot-reporter.html , and click on "Reporters" in left column
	reporters: ["spec"],
	
	wdi5: {
		// screenshotPath: require('path').join('test', 'report', 'screenshots'), // [optional] using the project root
		screenshotsDisabled: true, // [optional] {Boolean}; if set to true screenshots won't be taken and not written to file system
		logLevel: "verbose", // [optional] error | verbose | silent
		platform: "browser", // [mandatory] browser | android | ios | electron
		url: "index.html", // [mandatory, not empty] path to your bootstrap html file. If your server autoredirects to a 'domain:port/' like root url use empty string ''
		deviceType: "web", // [mandatory] native | web
		skipInjectUI5OnStart: false, // [optional] true when UI5 is not on the start page, you need to later call <wdioUI5service>.injectUI5(); manually
		waitForUI5Timeout: 1500000, // [optional] maximum waiting time while checking for UI5 availability
	},
};
