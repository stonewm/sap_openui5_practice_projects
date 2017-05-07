sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(Controller) {
	"use strict";

	return Controller.extend("zui5_odata_sap_backend.controller.App", {

		//---------------------------
		// Create employee
		//--------------------------
		onCreateEmp: function() {
			var newData = {
				"d": {
					"Mandt": "100",
					"EmpId": "5",
					"EmpName": "Bruce Lee",
					"EmpAddr": "Hong Kong"
				}
			};

			var oModel = this.getOwnerComponent().getModel();
			oModel.create("/EmployeeCollection", newData, {
				success: function(oData, oResponse) {
					window.console.log(oResponse);
				},
				error: function(oError) {
					window.console.log("Error", oError);
				}
			});
		},
		
		//-------------------
		// Update data
		//-------------------
		onUpdateEmp: function() {
			var oModel = this.getOwnerComponent().getModel();

			var newData = {
				"d": {
					"EmpName": "李小龙",
					"EmpAddr": "香港"
				}
			};

			oModel.update("/EmployeeCollection(Mandt='100',EmpId='5')", newData, {
				success: function(oData, oResponse) {
					window.console.log(oResponse);
				},
				error: function(oError) {
					window.console.log("Error", oError);
				}
			});
		},
		
		//------------------------
		// Delete employee
		//------------------------
		onDeleteEmp: function(){
			var oModel = this.getOwnerComponent().getModel();
			oModel.remove("/EmployeeCollection(Mandt='100',EmpId='5')",{
				success: function(oData, oResponse) {
					window.console.log(oResponse);
				},
				error: function(oError) {
					window.console.log("Error", oError);
				}
			});
		}
	});

});