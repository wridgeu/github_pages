sap.ui.define([
		"sap/ui/base/Object",
		"sap/ui/core/Fragment",
		"sap/ui/core/syncStyleClass"
	], (ManagedObject, Fragment, syncStyleClass) => {
		"use strict";

		return ManagedObject.extend("sapmarco.projectpages.controller.VersionDialog", {
			
				/**
				 * @param  {object} oView View
				 */
				constructor: function (oView) {
					this._oView = oView;
				},

				open() {
					var oView = this._oView;

					// create dialog lazily
					if (!oView.byId("VersionDialog")) {
						var oFragmentController = {
							onCloseDialog(oEvt) {
								oEvt.getSource().getParent().close();
								oEvt.getSource().getParent().getModel("versionInfo").destroy();
							}
						};
						// load asynchronous XML fragment
						Fragment.load({
							type: "XML",
							id: oView.getId(),
							name: "sapmarco.projectpages.view.VersionDialog",
							controller: oFragmentController,
						}).then(function (oDialog) {
							// connect dialog to the root view of this component (models, lifecycle)
							oView.addDependent(oDialog);
							sap.ui.require(["sap/ui/VersionInfo"], function (oVersInfo) {
								oVersInfo.load().then(function (oVersion) {
									oDialog.setModel(new sap.ui.model.json.JSONModel(oVersion, true), "versionInfo");
								});
							});
							// forward compact/cozy style into dialog
							syncStyleClass(oView.getController().getOwnerComponent().getContentDensityClass(), oView, oDialog);
							oDialog.open();
						});
					} else {
						oView.byId("VersionDialog").open();
					}
				},

				exit() {
					delete this._oView;
				},
			}
		);
	}
);
