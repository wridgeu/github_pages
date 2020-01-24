sap.ui.define([
  "sap/ui/core/mvc/Controller",
  'sap/ui/model/json/JSONModel'
], function(Controller, JSONModel) {
  "use strict";
  return Controller.extend("sapmarco.projectpages.controller.Main", {
    onSocialPress(oEvt, url){
      window.open(url, '_blank')
    }
  });
});
