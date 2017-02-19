sap.ui.define([
       "sap/ui/core/mvc/Controller"        
	], 
			
	function(Controller){
		"use strict";
		
		return Controller.extend("webapp.controller.Detail", {
			onNavPress: function(){
				oApp.back();
			}		
		});
	}
);