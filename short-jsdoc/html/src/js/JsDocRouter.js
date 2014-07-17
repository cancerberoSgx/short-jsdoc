var JsDocRouter = Backbone.Router.extend({

	routes: {
		"class/:class": "showClass"
	,	"module/:module": "showModule"
	,	"method/:method": "showMethod"
	// ,	'actions/:action': 'doAction'
	,	"index": "showIndex"
	,	"parse": "showParse"
	,	"search": "showSearch"
	}

,	initialize: function(application) 
	{
		this.application=application;
	}

,	showView: function(view, resourceName)
	{
		resourceName = resourceName||'Resource'; 
		if(view.resourceNotFound)
		{
			this.application.showErrorView(resourceName+' '+resourceName+' not found!'); 
		}
		else
		{
			this.application.showView(view); 
		}
	}

,	showModule: function(moduleName) 
	{
		var view = new ModuleView(this.application, moduleName);
		this.showView(view); 
	}
	
,	showClass: function(className) 
	{ 
		var view = new ClassView(this.application, className);
		this.showView(view); 
	}

,	showMethod: function(method)
	{
		var view = new MethodView(this.application, method);
		this.showView(view); 
	}
	
,	showIndex: function() 
	{
		var view = new IndexView(this.application);
		this.application.showView(view); 
	}

,	showParse: function() 
	{
		var view = new ParseView(this.application);
		this.application.showView(view); 
	}

,	showSearch: function() 
	{
		var view = new ParseView(this.application);
		this.application.showView(view); 
	}
});
