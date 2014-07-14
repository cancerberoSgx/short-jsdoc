var ClassView = AbstractView.extend({

	// tagName: "div"
	className: "class-view"
// ,	events: {}

,	template: 'class'

,	initialize: function(application, className) 
	{
		this.application = application;
		// this.className = className;
		this.jsdoc = this.application.data.classes[className]; 
	}

,	render: function() {
	}

});