sap.ui.jsview("webapp.view.Master", {

	getControllerName : function() {
		return "webapp.controller.Master";
	},

	createContent : function(oController) {
		
		// 定义table的columns
		var aColumns = [
		    new sap.m.Column({
		    	header: new sap.m.Text({text: "ID"})
		    }),
		    new sap.m.Column({
		    	header: new sap.m.Text({text: "供应商名称"})
		    })
		];
		
 		// 定义template作为line items
		var oTemplate = new sap.m.ColumnListItem({
			type: "Navigation",
			press: [oController.onListPress, oController],
			cells: [
			    new sap.m.ObjectIdentifier({text: "{ID}"}),
			    new sap.m.ObjectIdentifier({text: "{Name}"})
			]
		});
		
		// table的toolbar
		var oHeaderToolbar = new sap.m.Toolbar({
			content: [
			    new sap.m.Title({text: "供应商数量:{/CountOfSuppliers}"})
			]
		});
		
		// table
		var oTable = new sap.m.Table({
			columns: aColumns,
			headerToolbar: oHeaderToolbar
		});
		oTable.bindItems("/Suppliers", oTemplate);
		
		// page
		var oMasterPage = new sap.m.Page({
			title: "供应商概览",
			content: [oTable]
		});
		
		return oMasterPage;
	}

});