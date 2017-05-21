sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(Controller) {
	"use strict";

	var oModel;
	var sCurrentPath;
	var sCurrentEmp; // cureent employee
	var oEmployeeDialog;

	return Controller.extend("zui5_odata_sap_backend_crud.controller.App", {

		onInit: function() {
			oModel = this.getOwnerComponent().getModel();
			oModel.setUseBatch(false);
			this.getView().setModel(oModel);

			oEmployeeDialog = this.buildEmpDialog();
		},

		// Build employee dialog
		// If not exists, create an instance, otherwise, just get it.
		buildEmpDialog: function() {
			var oView = this.getView();

			// Open dialog
			var oEmpDialog = oView.byId("employeeDialog");
			if (!oEmpDialog) {
				oEmpDialog = sap.ui.xmlfragment(oView.getId(),
					"zui5_odata_sap_backend_crud.view.EmployeeDialog");
				
				oView.addDependent(oEmpDialog);

				// Attach press event for CancelButton
				var oCancelButton = oView.byId("CancelButton");
				oCancelButton.attachPress(function() {
					oEmpDialog.close();
				});
			}

			return oEmpDialog;
		},


		// onCreate event
		onCreate: function() {
			var oView = this.getView();
			oEmployeeDialog.open();
			oEmployeeDialog.setTitle("Create Employee");
			oView.byId("EmpId").setEditable(true);
			oView.byId("SaveEdit").setVisible(false);
			oView.byId("SaveCreate").setVisible(true);

			// clear
			oView.byId("EmpId").setValue("");
			oView.byId("EmpName").setValue("");
			oView.byId("EmpAddr").setValue("");

			// commit save operation
			oView.byId("SaveCreate").attachPress(function() {

				oModel.createEntry("/EmployeeCollection", {
					properties: {
						"Mandt": "100",
						"EmpId": oView.byId("EmpId").getValue(),
						"EmpName": oView.byId("EmpName").getValue(),
						"EmpAddr": oView.byId("EmpAddr").getValue()
					}
				});

				oModel.submitChanges();
				sap.m.MessageToast.show("Created Successfully.");

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
			oEmployeeDialog.open();

			oEmployeeDialog.setTitle("Edit Employee");
			oView.byId("EmpId").setEditable(false);
			oView.byId("SaveEdit").setVisible(true);
			oView.byId("SaveCreate").setVisible(false);

			// Attach save event
			oView.byId("SaveEdit").attachPress(function() {

				// changes
				var oChanges = {
					"EmpName": oView.byId("EmpName").getValue(),
					"EmpAddr": oView.byId("EmpAddr").getValue()
				};

				oModel.setProperty(sCurrentPath + "/EmpName", oChanges.EmpName);
				oModel.setProperty(sCurrentPath + "/EmpAddr", oChanges.EmpAddr);

				if (oModel.hasPendingChanges()) {
					oModel.submitChanges();
					sap.m.MessageToast.show("Changes were saved successfully.");
				}
				
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

			oEmployeeDialog.bindElement(sCurrentPath);
		}
	});
});