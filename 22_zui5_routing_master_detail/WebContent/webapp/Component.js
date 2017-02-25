sap.ui.define([
		"sap/ui/core/UIComponent",
		"sap/ui/model/resource/ResourceModel",
		"sap/ui/model/json/JSONModel"
		
	], function (UIComponent, ResourceModel, JSONModel) {
	"use strict";

	return UIComponent.extend("webapp.Component", {

		metadata: {
			manifest: "json"
		 },

		init : function () {
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			// create the views based on the url/hash
			this.getRouter().initialize();
		}
	});
});