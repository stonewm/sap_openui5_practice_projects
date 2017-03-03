sap.ui.define([
        "sap/ui/core/mvc/Controller",
        "sap/ui/core/UIComponent"
    ], 		
		
	function(Controller, UIComponent){
	    "use strict";
	    
	     return Controller.extend("webapp.controller.Master", {

	    	 onListPress: function(oEvent){
	    		 var oRouter = UIComponent.getRouterFor(this);
	    		 var oItem = oEvent.getSource();
	    		 var sPath = oItem.getBindingContext().getPath();
	    		 oRouter.navTo("detail", {
	    			 supplierPath: encodeURIComponent(sPath)
	    		});;
	    	 }
	     });
	
	}
);