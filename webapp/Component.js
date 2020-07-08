sap.ui.define(
	[
		"sap/ui/core/UIComponent",
		"sap/ui/Device",
		"sapmarco/projectpages/model/models",
		"./controller/VersionDialog",
	],
	(UIComponent, Device, models, VersionDialog) => {
		"use strict";
		return UIComponent.extend("sapmarco.projectpages.Component", {
			metadata: {
				manifest: "json",
			},
			/**
			 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
			 * @public
			 * @override
			 */
			init() {
				// call the base component's init function
				UIComponent.prototype.init.apply(this, arguments);

				//set Dailog
				this._VersionDialog = new VersionDialog(this.getRootControl());

				// enable routing
				this.getRouter().initialize();

				// set the device model
				this.setModel(models.createDeviceModel(), "device");

				//configure module loading - provide shim (nonUI5Dependency)
				//provide custom shim for hljs as it otherwhise does 'require' in it' source code which
				//isn't supported /build and throws errors even in build version
				sap.ui.loader.config({
					async: true,
					shim: {
						"sapmarco/projectpages/libs/highlight": {
							amd: true,
							exports: "hljs"
						}
					},
				});
			},
			openVersionDialog() {
				this._VersionDialog.open();
			},
			getContentDensityClass() {
				if (!this._sContentDensityClass) {
					if (!Device.support.touch) {
						this._sContentDensityClass = "sapUiSizeCompact";
					} else {
						this._sContentDensityClass = "sapUiSizeCozy";
					}
				}
				return this._sContentDensityClass;
			},
			exit() {
				this._VersionDialog.destroy();
				delete this._VersionDialog;
			},
		});
	}
);
