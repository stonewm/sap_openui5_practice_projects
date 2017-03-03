sap.ui.define([
        "sap/ui/core/mvc/Controller",
        "sap/ui/core/UIComponent",
        "sap/ui/core/routing/History"
    ], 		
		
    function(Controller, UIComponent, History){
	   "use strict";
	    
	    return Controller.extend("stonewang.sapui5.demo.controller.Detail", {

	    	// add functions here
	    	onInit: function(){
				var oRouter = UIComponent.getRouterFor(this);
				oRouter.getRoute("detail")
					.attachPatternMatched(this._onObjectMatched, this);	
			},
			
			onNavPress: function() {
				var oHistory = History.getInstance();
				var sPreviousHash = oHistory.getPreviousHash();
				
				if (sPreviousHash != undefined){
					window.history.go(-1);
				}else{
					var oRouter = UIComponent.getRouterFor(this);
					oRouter.navTo("master",{}, true);
				}
			},
			
			_onObjectMatched: function (oEvent) {			
				var sPath = oEvent.getParameter("arguments").supplierPath;
				console.log(decodeURIComponent(sPath));
				this.getView().bindElement({path: decodeURIComponent(sPath)});
			}
	     });	
	}
);