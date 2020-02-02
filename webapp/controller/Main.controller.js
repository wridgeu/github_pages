sap.ui.define([
  "sap/ui/core/mvc/Controller"
], function(Controller) {
  "use strict";
  return Controller.extend("sapmarco.projectpages.controller.Main", {
    onInit: function(){
    // this.byId("cvTree").expandToLevel(1); sap_fiori_3_dark
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        sap.ui.getCore().applyTheme("sap_fiori_3_dark");
        this.byId("cVRow").removeStyleClass("cV");
      };
    },
    onUI5IconPress : function () {
			this.getOwnerComponent().openVersionDialog();
    },
    onThemeSwap: function(sTheme){
      //read current theme sap_belize
      if(sap.ui.getCore().getConfiguration().getTheme() == "sap_belize"){
        sap.ui.getCore().applyTheme(sTheme);
       this.byId("cVRow").removeStyleClass("cV");
      } else{
        sap.ui.getCore().applyTheme("sap_belize");
        this.byId("cVRow").addStyleClass("cV");
      }}
  });
});
