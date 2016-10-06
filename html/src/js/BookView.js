//@module shortjsdoc.html
//@class BookView @extends AbstractView
var BookView = AbstractView.extend({

	className: 'book'

,	template: 'book'

,	initialize: function(application, options)
	{
		var self = this; 
		this.application = application;
		this.options = options || {}; 
		this.options.private = this.options.private ? parseInt(this.options.private, 10) : 0;

		this.modules = [];
		_.each(this.application.data.modules, function(m){self.modules.push(m);});
		this.modules = this.modules.sort(function(m1, m2){return m1.name < m2.name ? 0 : 1;});

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
		this.title = this.application.data.projectMetadata.name;
	}

,	afterRender: function()
	{
		var self = this;
		this.$('[data-class]').each(function()
		{
			var $el = jQuery(this)
			, className = $el.data('class');
			var view = new ClassView(self.application, className, self.options);
			_.extend(view.options, {
				dontShowSources: true
			,	dontShowSidebar: true
			,	dontShowOptions: true
			}); 
			if(view.resourceNotFound)
			{
				$el.append('Class ' + className + ' not found!');
			}
			else
			{
				view.renderIn($el);
			}
		});
	}

});

/*
@module justjstest

@function resolveAndHit 

This is just a sample global function. 

Functions belong to a module - they have the same importance as classes. 

A function signature is just the same as a method. 

@param{Array<Promise>} promises 
@param {Boolean} required
@return {Array<Number>} lorem ipsum
*/