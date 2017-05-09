sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(Controller) {
	"use strict";

	var oModel;
	var sCurrentPath;
	var sCurrentEmp; // cureent employee

	return Controller.extend("zui5_odata_sap_backend_crud.controller.App", {

		onInit: function() {
			oModel = this.getOwnerComponent().getModel();
			oModel.setUseBatch(false);
			this.getView().setModel(oModel);
		},

		openDialog: function() {
			var oView = this.getView();

			// Open dialog
			var oEmpDialog = oView.byId("employeeDialog");
			if (!oEmpDialog) {
				oEmpDialog = sap.ui.xmlfragment(oView.getId(),
					"zui5_odata_sap_backend_crud.view.EmployeeDialog");
				oView.addDependent(oEmpDialog);
			}

			oEmpDialog.open();

			// Attach press event for CancelButton
			var oCancelButton = oView.byId("CancelButton");
			oCancelButton.attachPress(function() {
				oEmpDialog.close();
			});
		},

		// onCreate event
		onCreate: function() {
			var oView = this.getView();

			this.openDialog();
			var oEmployeeDialog = oView.byId("employeeDialog");
			oEmployeeDialog.setTitle("Create Employee");
			oView.byId("EmpId").setEditable(true);
			oView.byId("SaveEdit").setVisible(false);
			oView.byId("SaveCreate").setVisible(true);

			// clear
			oView.byId("EmpId").setValue("");
			oView.byId("EmpName").setValue("");
			oView.byId("EmpAddr").setValue("");

			// commit save
			oView.byId("SaveCreate").attachPress(function() {
				var oNewEntry = {
					"Mandt": "100",
					"EmpId": "",
					"EmpName": "",
					"EmpAddr": ""
				};

				// populate value from form
				oNewEntry.EmpId = oView.byId("EmpId").getValue();
				oNewEntry.EmpName = oView.byId("EmpName").getValue();
				oNewEntry.EmpAddr = oView.byId("EmpAddr").getValue();

				// Commit creation operation
				oModel.create("/EmployeeCollection", oNewEntry, {
					success: function() {
						sap.m.MessageToast.show("Created successfully.");
					},
					error: function(oError) {
						window.console.log("Error", oError);
					}
				});

				// close dialog
				if (oEmployeeDialog) {
					oEmployeeDialog.close();
				}
			});
		},

		onEdit: function() {
			// no employee was selected
			if (!sCurrentEmp) {
				sap.m.MessageToast.show("No Employee was selected.");
				return;
			}

			var oView = this.getView();

			this.openDialog();
			var oEmployeeDialog = oView.byId("employeeDialog");
			oEmployeeDialog.setTitle("Edit Employee");
			oView.byId("EmpId").setEditable(false);
			oView.byId("SaveEdit").setVisible(true);
			oView.byId("SaveCreate").setVisible(false);

			// populate fields
			oView.byId("EmpId").setValue(oModel.getProperty(sCurrentPath + "/EmpId"));
			oView.byId("EmpName").setValue(oModel.getProperty(sCurrentPath + "/EmpName"));
			oView.byId("EmpAddr").setValue(oModel.getProperty(sCurrentPath + "/EmpAddr"));

			// Attach save event
			oView.byId("SaveEdit").attachPress(function() {
				var oChanges = {
					"Mandt": "100",
					"EmpName": "",
					"EmpAddr": ""
				};

				// populate value from form
				oChanges.EmpName = oView.byId("EmpName").getValue();
				oChanges.EmpAddr = oView.byId("EmpAddr").getValue();

				// commit creation
				oModel.update(sCurrentPath, oChanges, {
					success: function() {
						sap.m.MessageToast.show("Changes were saved successfully.");
					},
					error: function(oError) {
						window.console.log("Error", oError);
					}
				});

				// close dialog
				if (oEmployeeDialog) {
					oEmployeeDialog.close();
				}
			});
		},

		// onDelete event
		onDelete: function() {
			var that = this;

			// no employee was selected
			if (!sCurrentEmp) {
				sap.m.MessageToast.show("No Employee was selected.");
				return;
			}

			var oDeleteDialog = new sap.m.Dialog();
			oDeleteDialog.setTitle("Deletion");

			var oText = new sap.m.Label({
				text: "Are you sure to delete employee [" + sCurrentEmp + "]?"
			});
			oDeleteDialog.addContent(oText);

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

		// deletion operation
		deleteEmployee: function() {
			oModel.remove(sCurrentPath, {
				success: function() {
					sap.m.MessageToast.show("Deletion successful.");
				},
				error: function(oError) {
					window.console.log("Error", oError);
				}
			});
		},

		onItemPress: function(evt) {
			var oContext = evt.getSource().getBindingContext();
			sCurrentPath = oContext.getPath();
			sCurrentEmp = oContext.getProperty("EmpName");
		}
	});
});