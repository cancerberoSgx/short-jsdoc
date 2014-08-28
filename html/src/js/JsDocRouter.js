//@module shortjsdoc
//@class JsDocRouter @extends BackboneRouter
var JsDocRouter = Backbone.Router.extend({

	routes: {
		'class/:class': 'showClass'

	// ,	'classHierarchy/:class': 'showClass'event

	,	'module/:module': 'showModule'

	,	'method/:method': 'showMethod'
	,	'constructor/:method': 'showMethod'

	,	'property/:property': 'showProperty'
	,	'event/:event': 'showEvent'

	,	'index': 'showIndex'
	,	'modules': 'showModules'
	,	'classes': 'showClasses'

	,	'parse': 'showParse'
	// ,	'search': 'showSearch'
	}

,	initialize: function(application) 
	{
		this.application=application;
	}

	//@method showView @param {AbstractView}view @param {String} resourceName
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

	//@method showModule  @param {String} moduleName
,	showModule: function(moduleName) 
	{
		var view = new ModuleView(this.application, moduleName);
		this.showView(view); 
	}

	//@method showClass  @param {String} className
,	showClass: function(className) 
	{ 
		var view = new ClassView(this.application, className);
		this.showView(view); 
	}

	//@method showMethod  @param {String} method
,	showMethod: function(method)
	{
		var view = new MethodView(this.application, method);
		this.showView(view); 
	}

	//@method showProperty  @param {String} property
,	showProperty: function(property)
	{
		var view = new PropertyView(this.application, property);
		this.showView(view); 
	}

	//@method showEvent  @param {String} event
,	showEvent: function(event)
	{
		var view = new PropertyView(this.application, event, true);
		this.showView(view); 
	}

	//@method showModules
,	showModules: function()
	{
		var view = new AbstractView(this.application);
		view.template = 'modules';
		this.showView(view);
	}
	
	//@method showClasses
,	showClasses: function()
	{
		var view = new AbstractView(this.application);
		view.template = 'classes';
		this.showView(view);
	}
	
	//@method showIndex
,	showIndex: function() 
	{
		var view = new IndexView(this.application);
		this.application.showView(view); 
	}

	//@method showParse
,	showParse: function() 
	{
		var view = new ParseView(this.application);
		this.application.showView(view); 
	}

});
