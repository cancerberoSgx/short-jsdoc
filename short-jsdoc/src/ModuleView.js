var ModuleView = AbstractView.extend({

	// tagName: "div"
,	className: "module-view"
// ,	events: {}

,	template: 'module'

,	initialize: function(application, moduleName) 
	{
		this.application = application;
		// this.moduleName = moduleName;
		this.jsdoc = this.application.data.modules[moduleName]; 
	}

,	render: function() {
	}

});