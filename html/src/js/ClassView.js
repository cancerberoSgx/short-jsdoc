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
	}

,	computeHierarchy: function()
	{
		var hierarchy = [];
		var c = this.jsdoc;
		do 
		{
			hierarchy = [c].concat(hierarchy);
			if(c.name===this.jsdoc.name)
			{
				break;
			}
		}
		while( (c = c.extends) ); 
		return hierarchy;
	}

,	afterRender: function()
	{
		this.renderSource(this.jsdoc, this.$('[data-type="sources"]')); 
	}
});