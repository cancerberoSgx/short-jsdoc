var ClassView = AbstractView.extend({

	className: "class-view"

,	template: 'class'

,	initialize: function(application, className) 
	{
		this.application = application;
		this.jsdoc = this.application.data.classes[className]; 
		if(!this.jsdoc)
		{
			this.resourceNotFound = true;
		}
	}

});