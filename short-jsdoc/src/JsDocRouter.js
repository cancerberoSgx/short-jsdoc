var JsDocRouter = Backbone.Router.extend({

	routes: {
		"class/:class": "showClass"
	,	"module/:module": "showModule"
	,	"index": "showIndex"
	}

,	initialize: function(application) 
	{
		this.application=application;
	}

,	showClass: function(className) 
	{
		var view = new ClassView(this.application, className);
		this.application.showView(view); 
	}

,	showModule: function(module) {

	}
	
,	showIndex: function() 
	{
		var view = new IndexView(this.application);
		this.application.showView(view); 
	}

});
