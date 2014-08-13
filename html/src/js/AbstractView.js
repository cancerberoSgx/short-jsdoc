//@class AbstractView @extend Backbone.View @module shortjsdoc

var AbstractView = Backbone.View.extend({

	tagName: "div"

,	initialize: function(application) 
	{
		this.application = application;
	}

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

	// @method afterRender called b the application jsut after this view is shown.
,	afterRender: function()
	{
	}
});