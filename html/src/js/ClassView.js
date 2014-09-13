//@module shortjsdoc
//@class ClassView @extends AbstractView

var ClassView = AbstractView.extend({

	className: "class-view"

,	template: 'class'

,	initialize: function(application, className, options) 
	{
		this.application = application;
		this.jsdoc = this.application.data.classes[className]; 
		if(!this.jsdoc)
		{
			this.resourceNotFound = true;
			return;
		}

		this.jsdoc.textHtml = this.getTextHtml(this.jsdoc);	

		this.options = options || {};
		this.options.inherited = this.options.inherited ? parseInt(this.options.inherited, 10) : 0;

		this.methods = this.jsdoc.methods;
		if(this.options.inherited)
		{
			this.methods = _(_(this.methods).clone()).extend(this.jsdoc.inherited.methods); 
		}

		this.properties = this.jsdoc.properties;
		if(this.options.inherited)
		{
			this.properties = _(_(this.properties).clone()).extend(this.jsdoc.inherited.properties); 
		}

		// this.hierarchy = this.computeHierarchy();
	}
/*
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
*/
,	afterRender: function()
	{
		this.renderSource(this.jsdoc, this.$('[data-type="sources"]')); 
	}
});