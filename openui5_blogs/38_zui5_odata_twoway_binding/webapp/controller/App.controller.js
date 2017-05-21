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

			var oEmpDialog = oView.byId("employeeDialog");
			if (!oEmpDialog) {
				oEmpDialog = sap.ui.xmlfragment(oView.getId(),
					"zui5_odata_sap_backend_crud.view.EmployeeDialog");
				
				// Use addDepedent() to make sure that oEmpDialog
				// has the same lifecycle as oView
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
			oEmployeeDialog.setTitle("Create Employee");
			oEmployeeDialog.open();

			var oView = this.getView();
			oView.byId("EmpId").setEditable(true);
			oView.byId("SaveEdit").setVisible(false);
			oView.byId("SaveCreate").setVisible(true);

			oEmployeeDialog.unbindElement();
			var oContext = oModel.createEntry("/EmployeeCollection", {
				properties: {
					"Mandt": "100"
				}
			});
			oEmployeeDialog.setBindingContext(oContext);

			// commit save operation
			oView.byId("SaveCreate").attachPress(function() {
				if (oView.byId("EmpId").getValue()) {
					oModel.submitChanges();
					sap.m.MessageToast.show("Created Successfully.");

					// close dialog
					if (oEmployeeDialog) {
						oEmployeeDialog.close();
					}
				} else {
					sap.m.MessageToast.show("Employee Id cannot be blank.");
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
			oEmployeeDialog.bindElement(sCurrentPath);
			oEmployeeDialog.setTitle("Edit Employee");
			oEmployeeDialog.open();

			oView.byId("EmpId").setEditable(false);
			oView.byId("SaveEdit").setVisible(true);
			oView.byId("SaveCreate").setVisible(false);

			// Attach save event
			oView.byId("SaveEdit").attachPress(function() {

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

		// Item press event for ColumnListItem
		onItemPress: function(evt) {
			var oContext = evt.getSource().getBindingContext();
			sCurrentPath = oContext.getPath();
			sCurrentEmp = oContext.getProperty("EmpId");
		}
	});
});