//@module shortjsdoc.html
//@class JsDocRouter @extends Backbone.Router
var JsDocRouter = Backbone.Router.extend({

	routes: {
		'class/:class': 'showClass'
	,	'class/:class?:options': 'showClass'

	,	'module/:module': 'showModule'

	,	'method/:method': 'showMethod'
	,	'constructor/:method': 'showMethod'
	,	'function/:method': 'showMethod'

	,	'property/:property': 'showProperty'
	,	'event/:event': 'showEvent'
	,	'attribute/:attribute': 'showAttribute'

	,	'index': 'showIndex'
	,	'modules': 'showModules'
	,	'classes': 'showClasses'

	,	'parse': 'showParse'

	,	'tree': 'showTree'
	,	'hierarchyTree': 'showHierarchyTree'

	,	'file/:file': 'showFile'
	,	'file/:file?:options': 'showFile'

	,	'search': 'doSearch'
	,	'search/:options': 'doSearch'

	,	'dependencies/:options': 'showDependencies'
	,	'dependencies': 'showDependencies'
	}

,	initialize: function(application) 
	{
		this.application=application;
	}

	//@method showView @param {AbstractView}view @param {String} resourceName
,	showView: function(view, resourceName)
	{
		if(view.resourceNotFound)
		{
			resourceName = resourceName||Backbone.history.fragment;
			this.application.showErrorView('Resource ' + resourceName + ' not found!'); 
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

	//method parseOptions @return {Object<String,String>}
,	parseOptions: function(options)
	{
		var params = {};
		_(options.split('&')).each(function(p)
		{
			var a = p.split('='); 
			if (a.length >= 2)
			{
				params[a[0]] = a[1]; 
			}
		}); 
		return params;
	}

	//@method showClass  @param {String} className
,	showClass: function(className, options) 
	{
		options = options || '';
		var params = this.parseOptions(options);		
		var view = new ClassView(this.application, className, params);
		this.showView(view); 
	}

	//@method showMethod Responsible of showing Methods, Constructors and Functions @param {String} method
,	showMethod: function(method)
	{
		var view = new MethodView(this.application, method);
		this.showView(view); 
	}


	//@method showProperty  @param {String} property
,	showProperty: function(property)
	{
		var view = new PropertyView(this.application, property, 'property');
		this.showView(view); 
	}
	//@method showEvent  @param {String} event
,	showEvent: function(event)
	{
		var view = new PropertyView(this.application, event, 'event');
		this.showView(view); 
	}
	//@method showAttribute  @param {String} attribute
,	showAttribute: function(attribute)
	{
		var view = new PropertyView(this.application, attribute, 'attribute');
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

	//@method search  @param {String} options
,	doSearch: function(optionsStr)
	{
		var options = this.parseOptions(optionsStr||''); 
		var view = new SearchView(this.application, options);
		this.showView(view); 
	}

	//@method showDependencies  @param {String} options
,	showDependencies: function(optionsStr)
	{
		var options = this.parseOptions(optionsStr||''); 
		var view = new DependenciesView(this.application, options);
		this.showView(view); 
	}

	//@method showIndex
,	showIndex: function() 
	{
		var view = new IndexView(this.application);
		this.application.showView(view); 
	}

	//@method showTree
,	showTree: function()
	{		
		var view = new TreeView(this.application);
		this.application.showView(view); 
	}

	//@method showHierarchyTree
,	showHierarchyTree: function()
	{		
		var view = new HierarchyTreeView(this.application);
		this.application.showView(view); 
	}	

	//@method showParse
,	showParse: function() 
	{
		var view = new ParseView(this.application);
		this.application.showView(view); 
	}

	//@method showFile  @param {String} file
,	showFile: function(file, options) 
	{
		options = options || '';
		var params = this.parseOptions(options);		
		var view = new FileView(this.application, file, params);
		this.showView(view); 
	}

});
