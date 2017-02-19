sap.ui.define([
        "sap/ui/core/UIComponent",
        "sap/ui/model/json/JSONModel"
    ], 
		
	function(UIComponent, JSONModel){
		return UIComponent.extend("webapp.Component", {			
			createContent: function() {
				UIComponent.prototype.createContent.apply(this, arguments);
				
				// load application data
				var oModel = new sap.ui.model.json.JSONModel();
				oModel.loadData("webapp/model/data.json");
				this.setModel(oModel);
				
				// app view(root view)
				var oAppView = sap.ui.view("appView", {
					type: sap.ui.core.mvc.ViewType.XML,
					viewName: "webapp.view.App"
				})
				
				oApp = oAppView.byId("app");
				return oAppView;				
			}
		});
    }

);