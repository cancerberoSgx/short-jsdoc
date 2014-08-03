var ModuleView = AbstractView.extend({

	className: "module"

,	template: 'module'

,	initialize: function(application, moduleName) 
	{
		this.application = application;
		this.jsdoc = this.application.data.modules[moduleName]; 
		this.classes = _( _(this.application.data.classes).values() ).filter(function(c){
			return c.module.name === moduleName; 
		}); 
	}

});