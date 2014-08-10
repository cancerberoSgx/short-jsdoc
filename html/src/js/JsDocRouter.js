var JsDocRouter = Backbone.Router.extend({

	routes: {
		'class/:class': 'showClass'
	,	'classHierarchy/:class': 'showClass'
	,	'module/:module': 'showModule'
	,	'method/:method': 'showMethod'
	,	'property/:property': 'showProperty'

	,	'index': 'showIndex'
	,	'modules': 'showModules'
	,	'classes': 'showClasses'

	,	'parse': 'showParse'
	,	'search': 'showSearch'
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

,	showProperty: function(property)
	{
		var view = new PropertyView(this.application, property);
		this.showView(view); 
	}

,	showModules: function()
	{
		var view = new AbstractView(this.application);
		view.template = 'modules';
		this.showView(view);
	}
	
,	showClasses: function()
	{
		var view = new AbstractView(this.application);
		view.template = 'classes';
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
