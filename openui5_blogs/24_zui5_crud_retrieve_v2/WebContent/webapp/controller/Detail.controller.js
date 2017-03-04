sap.ui.define([
        "sap/ui/core/mvc/Controller",
        "sap/ui/core/UIComponent",
        "sap/ui/core/routing/History"
    ], 		
		
    function(Controller, UIComponent, History){
	   "use strict";
	    
	    return Controller.extend("stonewang.sapui5.demo.controller.Detail", {

	    	onInit: function(){
	    		// 模式匹配，则调用_onObjectMatched
				var oRouter = UIComponent.getRouterFor(this);
				oRouter.getRoute("detail")
					.attachPatternMatched(this._onObjectMatched, this);	
				
				// 创建一个model view, 包含两个button是否enabled的布尔值
				var oViewModel = new sap.ui.model.json.JSONModel({
					canGoPrev: false,
					canGoNext: false
				});
				
				this.getView().setModel(oViewModel, "viewModel");
				
			},
			
			onNavPress: function() {
				var oRouter = UIComponent.getRouterFor(this);
				oRouter.navTo("master",{}, true);
			},
			
			onPageUp: function(oEvent){				
				var sId = parseInt(this.sObjectID);
				sId = sId - 1;
				
				var oRouter = UIComponent.getRouterFor(this);
				var sNewRoute = encodeURIComponent("/"+sId);
				oRouter.navTo("detail", {supplierPath: sNewRoute});
			},
			
			onPageDown: function(oEvent){
				var sId = parseInt(this.sObjectID);
				sId = sId + 1;
				
				var oRouter = UIComponent.getRouterFor(this);				
				var sNewRoute = encodeURIComponent("/"+sId);
				oRouter.navTo("detail", {supplierPath: sNewRoute});
			},
			
			_onObjectMatched: function (oEvent) {		
				// 数据绑定
				var sPath 
					= decodeURIComponent(oEvent.getParameter("arguments").supplierPath);
				this.getView().bindElement({path: sPath});				
			
				this.sObjectID = sPath.substr(sPath.lastIndexOf("/")+1);
				this._updateViewModel();
			},
			
			_updateViewModel: function(oEvent){
				var oModel = this.getView().getModel();
				var that = this;
				var oViewModel = that.getView().getModel("viewModel");	
				
				var nextObjId = parseInt(that.sObjectID) + 1;
				var prevObjId = parseInt(that.sObjectID) - 1;					
			
				var bNextEnable = !!oModel.getProperty("/" + nextObjId);
				var bPrevEnable = !!oModel.getProperty("/" + prevObjId);
				
				oViewModel.setProperty("/canGoNext", bNextEnable);
				oViewModel.setProperty("/canGoPrev", bPrevEnable);
				}
			 });
	
	}
);