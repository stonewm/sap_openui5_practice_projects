sap.ui.define(["sap/ui/core/mvc/Controller",
	"sap/ui/model/odata/v2/ODataModel",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Sorter",
	"sap/ui/model/Filter"],

	function (Controller, ODataModel, JSONModel, Sorter, Filter) {
		"use strict";

		return Controller.extend("webapp.controller.Table", {

			// -------------------------------
			// Initialization event
			// -------------------------------
			onInit: function () {
				// Application model
				var sServiceUrl = "https://cors-anywhere.herokuapp.com/"
					+ "http://services.odata.org/V3/Northwind/Northwind.svc/";
				var oModel = new ODataModel(sServiceUrl);
				oModel.setUseBatch(false);

				this.getView().setModel(oModel);
			},

			// ---------------------------------------------
			// 设置 Table 的 排序，分组和筛选
			// ---------------------------------------------
			onTableSettings: function (oEvent) {
				var oDialog = this.getView().byId("SettingsDialog");
				if (!oDialog) {
					oDialog = sap.ui.xmlfragment("webapp.view.SettingsDialog", this);
				}

				oDialog.open();
			},

			onConfirm: function (oEvent) {
				var oBinding = this.getView().byId("idTable").getBinding("items");
				var mParams = oEvent.getParameters();

				// Apply grouping
				var aSorters = [];
				if (mParams.groupItem) {
					var sGroupKey = mParams.groupItem.getKey();
					var bDescending = mParams.groupDescending;

					aSorters.push(new Sorter(sGroupKey, bDescending, true));
				}

				// Apply sorter
				if (mParams.sortItem) {
					var sSortKey = mParams.sortItem.getKey();
					var bDescending = mParams.sortDescending;
					aSorters.push(new Sorter(sSortKey, bDescending));
				}
				oBinding.sort(aSorters);

				// Apply filters
				var aFilters = [];
				if (mParams.filterItems) {
					var count = mParams.filterItems.length;
					for (var i = 0; i < count; i++) {
						var oFilterItem = mParams.filterItems[i];
						var oFilter = new Filter(oFilterItem.getKey(),
							sap.ui.model.FilterOperator.EQ, oFilterItem.getText());

						aFilters.push(oFilter);
					}
				}
				oBinding.filter(aFilters);
			} // end of onConfirm
		});
	});