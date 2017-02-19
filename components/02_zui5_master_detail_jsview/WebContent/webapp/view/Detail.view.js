sap.ui.jsview("webapp.view.Detail", {

	getControllerName : function() {
		return "webapp.controller.Detail";
	},

	createContent : function(oController) {
 		var oObjectHeader = new sap.m.ObjectHeader({
 			title: "{Name}",
 			number: "ID: {ID}",
 			attributes: [
 			    new sap.m.ObjectAttribute({
 			    	text: "{Address/Street}, \n{Address/City}"
 			    })
 			]
 		});
 		
 		var oDetailPage = new sap.m.Page({
 			showNavButton: true,
 			navButtonPress: [oController.onNavPress, oController],
 			title: "供应商明细",
 			content: [oObjectHeader]
 		});
 		
 		return oDetailPage;
	}

});