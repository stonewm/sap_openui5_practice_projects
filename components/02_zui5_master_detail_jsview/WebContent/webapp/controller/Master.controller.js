sap.ui.define(
	["sap/ui/core/mvc/Controller"], 
		
	function(Controller){
		"use strict";
		
		return Controller.extend("webapp.controller.Master", {
			onListPress: function(oEvent){
				var sPageId = "detailView";
				oApp.to(sPageId);
				
				var oContext = oEvent.getSource().getBindingContext();
				var oDetailPage = oApp.getPage(sPageId);
				oDetailPage.setBindingContext(oContext);
				
			}
		});
	}
);