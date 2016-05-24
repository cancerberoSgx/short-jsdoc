//@module shortjsdoc.html
//@class IndexView @extends AbstractView
var IndexView = AbstractView.extend({

	className: 'index'

,	template: 'index'

,	initialize: function(application, options)
	{
		var self = this; 
		this.application = application;
		this.options = options || {}; 
		this.options.private = this.options.private ? parseInt(this.options.private, 10) : 0;

		this.modules = this.application.data.modules;
		if(this.options.private)
		{
			this.modules = _.filter(this.modules, function(m)
			{
				return self.isModulePublic(m);
			});
		}

		this.classes = this.application.data.classes;
		if(this.options.private)
		{
			this.classes = _.filter(this.classes, function(c)
			{
				return self.isClassPublic(c);
			});
		}
	}

});





