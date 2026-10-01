import { generateSW } from "workbox-build";

const themes = "{sap_horizon,sap_horizon_dark}";
const languages = "{en,de}";

const { count, size, warnings } = await generateSW({
	globDirectory: "dist",
	swDest: "dist/sw.js",
	cacheId: "projectpages",
	importScripts: ["sw-cleanup.js"],
	// No skipWaiting: a new version takes over once every tab of the old one is closed,
	// so a running page never mixes files from two deploys.
	cleanupOutdatedCaches: true,
	// The build is 250 MB of UI5 libraries; precache only what the app loads.
	// The offline test (npm run test:sw) fails if this misses something.
	globPatterns: [
		"index.html",
		"*.js",
		"manifest.json",
		"i18n/*.properties",
		"model/*.json",
		"css/*.css",
		"control/*.css",
		"integrationcards/*.json",
		"resources/sap-ui-custom.js",
		"resources/sap-ui-version.json",
		"resources/sap/ui/core/boot/*.js",
		"resources/sap/ui/{layout,unified}/library-preload-lazy.js",
		`resources/sap/ui/core/cldr/${languages}.json`,
		`resources/**/messagebundle_${languages}.properties`,
		`resources/**/themes/${themes}/library.css`,
		`resources/sap/ui/core/themes/${themes}/fonts/*.woff2`,
		"resources/sap/m/themes/base/illustrations/{metadata.json,sapIllus-Patterns.svg,sapIllus-*-PageNotFound.svg}",
	],
	globIgnores: ["sw.js"],
	// UI5 appends the app version to theme URLs
	ignoreURLParametersMatching: [/^utm_/, /^fbclid$/, /^sap-ui-dist-version$/],
	maximumFileSizeToCacheInBytes: 8 * 1024 * 1024,
	runtimeCaching: [
		{
			// wiki markdown and images: show the cached copy, refresh it in the background
			urlPattern: ({ url }) => url.origin === "https://raw.githubusercontent.com",
			handler: "StaleWhileRevalidate",
			options: { cacheName: "projectpages-wiki", expiration: { maxEntries: 50 } },
		},
		{
			urlPattern: ({ request, sameOrigin }) => sameOrigin && request.destination === "image",
			handler: "StaleWhileRevalidate",
			options: { cacheName: "projectpages-images", expiration: { maxEntries: 60 } },
		},
		{
			// anything else the app loads lazily and the precache does not cover
			urlPattern: ({ sameOrigin }) => sameOrigin,
			handler: "NetworkFirst",
			options: { cacheName: "projectpages-runtime", expiration: { maxEntries: 100 } },
		},
	],
});

for (const warning of warnings) {
	console.warn(warning);
}
console.log(`sw.js: precaching ${count} files, ${(size / 1024 / 1024).toFixed(1)} MB`);
