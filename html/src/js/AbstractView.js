//@module shortjsdoc.html
//@class AbstractView @extend Backbone.View @module shortjsdoc

var AbstractView = Backbone.View.extend({

	tagName: 'div'

,	initialize: function(application) 
	{
		this.application = application;
	}

	//@method renderIn renders this view in given parent element @param {jQuery} $parent
,	renderIn: function($parent)
	{
		var template = _.isFunction(this.template) ? this.template : this.application.templates[this.template];
		// if(template)
		// {			
			var html = template.apply(this, []); 
			this.$el.html(html);
			$parent.append(this.$el); 
		// }
		this.afterRender();
		return this;
	}
	

	//@method render implemented to comply with Backbone View contract
,	render: function()
	{
		return this.renderIn(jQuery(this.el)); 
	}

,	afterRender: function()
	{
		this.renderSource(); 
	}

,	setTitle: function(t)
	{
		// var self = this;
		this.title = t;
		setTimeout(function()
		{
			document.title = t; 
		}, 200);
	}

	//sources stuff

,	renderSource_: function(jsdoc, $container)
	{
		if(!jsdoc.commentRange)
		{
			return ; //this view doesn't have a related jsdoc - don't need this feature.
		}
		var view = new SourcesView(this.application, jsdoc); 
		view.fileNameUrl = encodeURIComponent(this.jsdoc.fileName); 
		// this.jsdoc.fileName.replace(/[\\\/]/g, '_'); 
		view.renderIn($container); 
	} 

,	renderSource: function()
	{
		if(!this.jsdoc)
		{
			return;
		}

		this.renderSource_(this.jsdoc, this.$('[data-type="sources"]')); 
		this.$('pre code').addClass('prettyprint'); 
		if(typeof prettyPrint !== 'undefined') 
		{
			prettyPrint('pre code');
		}
	}
});

