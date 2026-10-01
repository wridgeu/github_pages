// Deletes caches this site no longer uses, such as those of the pre-Workbox worker
// (app-1.25.1, STATIC-0.0.0). Every current cache is named "projectpages-...".
self.addEventListener("activate", (event) => {
	event.waitUntil(
		caches
			.keys()
			.then((keys) =>
				Promise.all(keys.filter((key) => !key.startsWith("projectpages-")).map((key) => caches.delete(key))),
			),
	);
});
