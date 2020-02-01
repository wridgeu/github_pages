sap.ui.define([
  "sap/ui/core/mvc/Controller"
], function(Controller) {
  "use strict";
  return Controller.extend("sapmarco.projectpages.controller.Main", {
    onInit: function(){
    // this.byId("cvTree").expandToLevel(1);
    },
    /*
    onUI5IconPress: function(oEvt){
      sap.ui.require(['sap/ui/VersionInfo'], function(oVersInfo) {
        oVersInfo.load().then(function(something){console.log(something)});
      });
    },*/
    onUI5IconPress : function () {
			this.getOwnerComponent().openVersionDialog();
		}
  });
});
