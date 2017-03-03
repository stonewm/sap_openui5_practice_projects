sap.ui.define([
		  "sap/ui/core/UIComponent",
		  "sap/ui/model/resource/ResourceModel",
		  "sap/ui/model/json/JSONModel"
	], 
	  
    function (UIComponent, ResourceModel, JSONModel, AppModel) {
		"use strict";

		return UIComponent.extend("stonewang.sapui5.demo.Component", {
		
			metadata : {
				manifest: "json"
			},

	        init : function () {
	            // call the base component's init function
	            UIComponent.prototype.init.apply(this, arguments);	            
	            
	             var oAppModel = new sap.ui.model.json.JSONModel("/Suppliers");
	            
	            jQuery.ajax({
	                type : "GET",
	                contentType : "application/json",
	                url : "/Suppliers",
	                dataType : "json",
	                success : function(oData) {
	                    oAppModel.setData(oData);
	                },
	                error : function() {
	                    jQuery.sap.log.debug(
	                    	"Something went wrong while retrieving the data");
	                }
				});
	            
	            
	             this.setModel(oAppModel);
	            
	            // create the views based on the url/hash
				this.getRouter().initialize();
	        } // end of init function
		});
});