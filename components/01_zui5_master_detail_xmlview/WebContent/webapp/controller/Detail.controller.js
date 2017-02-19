sap.ui.define([
         "sap/ui/core/mvc/Controller"
    ], 
    
	function(Controller){
		return Controller.extend("webapp.controller.Detail",{
			onNavPress: function(oEvent){
				oApp.back();
			}
		});
	}
);