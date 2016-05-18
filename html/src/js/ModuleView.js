//@module shortjsdoc.html
//@class ModuleView @extends AbstractView
var ModuleView = AbstractView.extend({

	className: 'module'

,	template: 'module'

,	initialize: function(application, moduleName, options) 
	{
		var self = this;
		this.application = application;
		this.jsdoc = this.application.data.modules[moduleName]; 
		this.classes = _( _(this.application.data.classes).values() ).filter(function(c)
		{
			return c.module.name === moduleName; 
		}); 

		this.options = options || {}
		this.options.private = this.options.private ? parseInt(this.options.private, 10) : 0;

		console.log(this.options.private)
		if(this.options.private)
		{
			this.classes = _.filter(this.classes, function(c)
			{
				return self.isClassPublic(c)
			});
		}

		this.jsdoc.textHtml = this.getTextHtml(this.jsdoc);	
	}

});