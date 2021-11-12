import Dialog from "sap/m/Dialog";
import Event from "sap/ui/base/Event";
import Control from "sap/ui/core/Control";
import Fragment from "sap/ui/core/Fragment";
import View from "sap/ui/core/mvc/View";
import syncStyleClass from "sap/ui/core/syncStyleClass";
import JSONModel from "sap/ui/model/json/JSONModel";
import VersionInfo from "sap/ui/VersionInfo";
import Component from "../Component";

/**
 * @namespace sapmarco.projectpages.controller
 */
export default class VersionDialog extends Control {

	private _oView: Control;

	constructor(oView: Control){
		super();
		this._oView = oView;
	}

	public async open(): Promise<void> {
		const oView = this._oView;

		// create dialog lazily
		if (!(oView as View).byId("VersionDialog")) {
			const oFragmentController = {
				onCloseDialog(oEvt: Event) {
					((oEvt.getSource() as Control).getParent() as Dialog).close();
					(oEvt.getSource() as Control).getParent().getModel("versionInfo").destroy();
				}
			};
			// load asynchronous XML fragment
			await Fragment.load({
				type: "XML",
				id: oView.getId(),
				name: "sapmarco.projectpages.view.VersionDialog",
				controller: oFragmentController,
			}).then(async function (oDialog: Control) {
				// connect dialog to the root view of this component (models, lifecycle)
				oView.addDependent(oDialog);
				sap.ui.require(["sap/ui/VersionInfo"], async function (oVersInfo: VersionInfo) {
					return await oVersInfo.load().then(function (oVersion?: Promise<object>) {
						oDialog.setModel(new JSONModel(oVersion, true), "versionInfo");
					});
				});
				// forward compact/cozy style into dialog
				syncStyleClass(((oView as View).getController().getOwnerComponent() as Component).getContentDensityClass(), oView, oDialog);
				await (oDialog as VersionDialog).open();
			});
		} else {
			await ((this._oView as View).byId("VersionDialog") as VersionDialog).open();
		}
	}

	exit() {
		delete this._oView;
	}
}