sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"zui5_odata_http_request/model/models"
], function(UIComponent, Device, models) {
	"use strict";

	return UIComponent.extend("zui5_odata_http_request.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function() {
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);
		}
	});

});