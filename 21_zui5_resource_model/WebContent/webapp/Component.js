sap.ui.define([
        "sap/ui/core/UIComponent",
        "sap/ui/model/json/JSONModel",
        "sap/ui/model/resource/ResourceModel"
    ], 
		
	function(UIComponent, JSONModel, ResourceModel){
		return UIComponent.extend("webapp.Component", {	
			// meta-data
			metadata: {
				"rootView": "webapp.view.App",
				"config": {
					"serviceUrl": "service/data.json",
					"i18nBundle": "webapp.i18n.i18n"
				}
			},
			
			// initialization
			init: function(){				
				UIComponent.prototype.init.apply(this, arguments);
				
				var mConfig = this.getMetadata().getConfig();
				
				// resource bundle
				var oResourceModel = new ResourceModel({
					bundleName: mConfig.i18nBundle
				});
				this.setModel(oResourceModel, "i18n");				

				// application data
				var oModel = new JSONModel(mConfig.serviceUrl);
				this.setModel(oModel);
			},
			
			createContent: function() {					
				// root view
				var oRootView = UIComponent.prototype.createContent.apply(this, arguments);
				oApp = oRootView.byId("app");
				
				return oRootView;				
			}
		});
    }
);