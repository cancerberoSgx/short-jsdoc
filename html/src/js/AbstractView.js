//@class AbstractView @extend Backbone.View @module shortjsdoc

var AbstractView = Backbone.View.extend({

	tagName: "div"

,	initialize: function(application) 
	{
		this.application = application;
		// this.resourceNotFound = false;
	}
});