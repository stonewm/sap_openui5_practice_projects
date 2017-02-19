sap.ui.define([
        "sap/ui/core/UIComponent",
        "sap/ui/model/json/JSONModel"
    ], 
		
	function(UIComponent, JSONModel){
		return UIComponent.extend("webapp.Component", {	
			// meta-data
			metadata: {
				"rootView": "webapp.view.App",
				"config": {
					"serviceUrl": "webapp/service/data.json"
				}
			},
			
			createContent: function() {
				// application data
				var oModel = new JSONModel(this.getMetadata().getConfig().serviceUrl);
				this.setModel(oModel);
				
				// root view
				var oRootView = UIComponent.prototype.createContent.apply(this, arguments);
				
				// application
				oApp = oRootView.byId("app");
				
				return oRootView;				
			}
		});
    }

);