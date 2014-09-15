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
});

