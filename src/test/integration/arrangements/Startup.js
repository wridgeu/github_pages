sap.ui.define([
	"sap/ui/test/Opa5"
], function(Opa5) {
	"use strict";

	return Opa5.extend("sapmarco.projectpages.test.integration.arrangements.Startup", {

		iStartMyApp: function () {
			this.iStartMyUIComponent({
				componentConfig: {
					name: "sapmarco.projectpages",
					async: true,
					manifest: true
				}
			});
		}

	});
});
