sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(Controller) {
	"use strict";

	var oEmployeeDialog;
	var oEmployeeModel;
	var sServiceUrl;
	var sCurrentPath;
	var sCurrentEmp; // cureent employee

	return Controller.extend("zui5_odata_http_request.controller.App", {

		onInit: function() {
			oEmployeeModel = this.getOwnerComponent().getModel();

			// get service url from manifest.json
			var config = this.getOwnerComponent().getManifest();
			sServiceUrl = config["sap.app"].dataSources.mainService.uri;

			oEmployeeModel.setUseBatch(false);
			this.getView().setModel(oEmployeeModel);

			oEmployeeDialog = this.buildDialog();
		},

		// Build employee dialog
		buildDialog: function() {
			var oView = this.getView();
			var oEmpDialog = oView.byId("employeeDialog");
			if (!oEmpDialog) {
				oEmpDialog = sap.ui.xmlfragment(oView.getId(),
					"zui5_odata_http_request.view.EmployeeDialog");

				oView.addDependent(oEmpDialog);

				var oCancelButton = oView.byId("CancelButton");
				oCancelButton.attachPress(function() {
					oEmpDialog.close();
				});
			}

			return oEmpDialog;
		},

		onCreate: function() {
			var that = this;

			var oView = this.getView();
			oEmployeeDialog.open();

			// set form properties
			oEmployeeDialog.setTitle("Create Employee");
			oView.byId("EmpId").setEditable(true);
			oView.byId("SaveEdit").setVisible(false);
			oView.byId("SaveCreate").setVisible(true);

			// clear values of controls
			oView.byId("EmpId").setValue("");
			oView.byId("EmpName").setValue("");
			oView.byId("EmpAddr").setValue("");

			oView.byId("SaveCreate").attachPress(function() {
				// commit creation
				that.createEmployee();

				// close dialog
				if (oEmployeeDialog) {
					oEmployeeDialog.close();
				}
			});
		},

		onEdit: function() {
			var that = this;
			var oView = this.getView();

			// Set binding
			if (sCurrentPath) {
				oEmployeeDialog.bindElement(sCurrentPath);
			} else {
				sap.m.MessageToast.show("No employee was selected.");
				return;
			}
			oEmployeeDialog.open();

			oEmployeeDialog.setTitle("Edit Employee");
			oView.byId("EmpId").setEditable(false);
			oView.byId("SaveEdit").setVisible(true);
			oView.byId("SaveCreate").setVisible(false);

			oView.byId("SaveEdit").attachPress(function() {
				that.editEmployee();

				// close dialog
				if (oEmployeeDialog) {
					oEmployeeDialog.close();
				}
			});
		},

		onDelete: function() {
			var that = this;

			if (!sCurrentPath) {
				sap.m.MessageToast.show("Now employee was selected.");
				return;
			}

			// Build dialog
			var oDeleteDialog = new sap.m.Dialog();
			oDeleteDialog.setTitle("Delete Employee");
			oDeleteDialog.addContent(
				new sap.m.Label({
					text: "Are you sure to delete Employee " + sCurrentEmp + "?"
				})
			);

			oDeleteDialog.addButton(
				new sap.m.Button({
					text: "Confirm",
					press: function() {
						that.deleteEmployee();
						oDeleteDialog.close();
					}
				})
			);

			oDeleteDialog.open();
		},

		createEmployee: function() {
			var oView = this.getView();

			var oNewEntry = {
				EmpId: oView.byId("EmpId").getValue(),
				EmpName: oView.byId("EmpName").getValue(),
				EmpAddr: oView.byId("EmpAddr").getValue()
			};

			OData.request({
					requestUri: sServiceUrl + "EmployeeCollection",
					method: "GET",
					headers: {
						"X-Requested-With": "XMLHttpRequest",
						"Content-Type": "application/atom+xml",
						"DataServiceVersion": "2.0",
						"X-CSRF-Token": "Fetch"
					}
				},

				function(data, response) {
					var oHeaders = {
						"x-csrf-token": response.headers["x-csrf-token"],
						"Accept": "application/json"
					};

					OData.request({
							requestUri: sServiceUrl + "EmployeeCollection",
							method: "POST",
							headers: oHeaders,
							data: oNewEntry
						},
						// success
						function(oData, oRequest) {
							sap.m.MessageToast.show("Employee Created Successfully");
							oEmployeeModel.refresh(true);
						},
						// error
						function(oError) {
							sap.m.MessageToast.show("Employee Creation Failed");
						});
				},

				function(err) {
					var request = err.request;
					var response = err.response;
					sap.m.MessageToast.show("Error in Get -- Request " + request + " Response " + response);
				});
		},

		editEmployee: function() {
			var oView = this.getView();
			
			var oChangedData = {
				EmpId: oView.byId("EmpId").getValue(),
				EmpName: oView.byId("EmpName").getValue(),
				EmpAddr: oView.byId("EmpAddr").getValue()
			};

			OData.request({
					requestUri: sServiceUrl + sCurrentPath.substr(1),
					method: "GET",
					headers: {
						"X-Requested-With": "XMLHttpRequest",
						"Content-Type": "application/atom+xml",
						"DataServiceVersion": "2.0",
						"X-CSRF-Token": "Fetch"
					}
				},

				function(data, response) {
					var oHeaders = {
						"x-csrf-token": response.headers["x-csrf-token"],
						"Accept": "application/json"
					};

					OData.request({
							requestUri: sServiceUrl + sCurrentPath.substr(1),
							method: "PUT",
							headers: oHeaders,
							data: oChangedData
						},
						// success
						function(oData, oRequest) {
							sap.m.MessageToast.show("Employee updated Successfully");
							oEmployeeModel.refresh(true);
						},
						// error
						function(oError) {
							sap.m.MessageToast.show("Employee update Failed");
						});
				},

				function(err) {
					var request = err.request;
					var response = err.response;
					sap.m.MessageToast.show("Error in Get -- Request " + request + " Response " + response);
				});
		},

		deleteEmployee: function() {
			var oView = this.getView();
			var oEntry = {
				EmpId: oView.byId("EmpId").getValue()
			};

			OData.request({
					requestUri: sServiceUrl + sCurrentPath.substr(1),
					method: "GET",
					headers: {
						"X-Requested-With": "XMLHttpRequest",
						"Content-Type": "application/atom+xml",
						"DataServiceVersion": "2.0",
						"X-CSRF-Token": "Fetch"
					}
				},

				function(data, response) {
					var oHeaders = {
						"x-csrf-token": response.headers["x-csrf-token"],
						"Accept": "application/json"
					};

					OData.request({
							requestUri: sServiceUrl + sCurrentPath.substr(1),
							method: "DELETE",
							headers: oHeaders,
							data: oEntry
						},
						// success
						function(oData, oRequest) {
							sap.m.MessageToast.show("Employee deleted Successfully");
							window.location.reload(true);
						},
						// error
						function(oError) {
							sap.m.MessageToast.show("Employee deletion Failed");
						});
				},

				function(err) {
					var request = err.request;
					var response = err.response;
					sap.m.MessageToast.show("Error in Get -- Request " + request + " Response " + response);
				});
		},

		onItemPress: function(evt) {
			var context = evt.getSource().getBindingContext();
			sCurrentPath = context.getPath();
			sCurrentEmp = context.getProperty("EmpId");
		}

	});

});