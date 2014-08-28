//@module shortjsdoc
//@class AbstractView @extend Backbone.View @module shortjsdoc

var AbstractView = Backbone.View.extend({

	tagName: "div"

,	initialize: function(application) 
	{
		this.application = application;
	}

	//@method renderIn renders this view in given parent element @param {jQuery} $parent
,	renderIn: function($parent)
	{
		var template = this.application.templates[this.template]; 
		if(template)
		{			
			var html = template.apply(this, []); 
			this.$el.html(html);
			$parent.append(this.$el); 
		}
		this.afterRender();
	}

	// @method afterRender called b the application jsut after this view is shown. Ooverridable b subclasses for doing some post rendering like installing js widgets, or something. Do nothing b default so you extenders don't need to call super
,	afterRender: function()
	{
	}
});

