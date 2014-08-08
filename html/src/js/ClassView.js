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
			return;
		}
		this.hierarchy = this.computeHierarchy();
		debugger;
	}

,	computeHierarchy: function()
	{
		var hierarchy = [];
		var c = this.jsdoc;
		do 
		{
			hierarchy = [c].concat(hierarchy);
			debugger;
			if(c.extends && c.extends.name===JsDocMaker.DEFAULT_CLASS)
			{
				break;
			}
		}
		while( (c = c.extends) ); 
		return hierarchy;
	}

});