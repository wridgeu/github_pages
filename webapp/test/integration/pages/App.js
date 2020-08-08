sap.ui.require([
	"sap/ui/test/Opa5",
	"sap/ui/test/matchers/AggregationLengthEquals"
], function (Opa5, AggregationLengthEquals) {
	"use strict";

	var sViewName = "sapmarco.projectpages.view.Shell";
	var sAppId = "app";

	Opa5.createPageObjects({
		onTheAppPage: {

			assertions: {

				iShouldSeePageCount: function(iItemCount) {
					return this.waitFor({
						id: sAppId,
						viewName: sViewName,
						matchers: [new AggregationLengthEquals({
							name: "pages",
							length: iItemCount
						})],
						success: function() {
							Opa5.assert.ok(true, "The app contains no direct page and is properly using a the Shell");
						},
						errorMessage: "App does not have expected number of pages '" + iItemCount + "'."
					});
				}
			}

		}
	});

});
