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

				// 增加 sort item
				var aColumnHeaders = this._getColumnHeaders();
				oDialog.destroySortItems();
				for (var i = 0; i < aColumnHeaders.length; i++) {
					oDialog.addSortItem(new sap.m.ViewSettingsItem({
						key: aColumnHeaders[i].key,
						text: aColumnHeaders[i].text
					}));
				}

				// 增加 filter items
				var aSupplierCities = this._getCities();
				var aFilterItems = [];

				for (var i = 0; i < aSupplierCities.length; i++) {
					aFilterItems.push(
						new sap.m.ViewSettingsItem({
							text: aSupplierCities[i],
							key: "City"
						})
					);
				}

				oDialog.destroyFilterItems();
				oDialog.addFilterItem(new sap.m.ViewSettingsFilterItem({
					key: "Filter_by_City",
					text: "城市",
					items: aFilterItems
				}));

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
			}, // end of onConfirm

			_getColumnHeaders: function () {
				var aColumnHeaders = [];
				var aColumns = this.getView().byId("idTable").getColumns();

				for (var i = 0; i < aColumns.length; i++) {
					var sColumnID = aColumns[i].sId;
					var sHeaderText = aColumns[i].getHeader().getText();
					// ID 中包含 view 的信息，分解得到字段的 id
					var aID = sColumnID.split('--');
					aColumnHeaders.push({
						key: aID[1],
						text: sHeaderText
					});
				}

				return aColumnHeaders;
			},   // end of _getColumnHeaders

			//-----------------------------------------------
			// 从 OData 数据服务获取供应商的城市，并且消除重复项
			//-----------------------------------------------
			_getCities: function () {
				var aCities = [];
				//var uniqueCities = [];

				// 使用 JSON model 
				var sServiceUrl = "http://services.odata.org/V3/Northwind/Northwind.svc/Suppliers";
				var oJSONModel = new JSONModel();
				oJSONModel.loadData(sServiceUrl, null, false, "GET", false, false, null);
				var oData = oJSONModel.getProperty("/value");

				// 获取城市并且消除重复项
				if (oData instanceof Array) {
					$.each(oData, function (i, element) {
						if ($.inArray(element.City, aCities) === -1) {
							aCities.push(element.City);
						}
					});
				}

				return aCities.sort();
			}
		});
	});