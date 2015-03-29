//@module shortjsdoc.html
//@class ClassView @extends AbstractView

var ClassView = AbstractView.extend({

	className: 'class-view'

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

		// calculate properties, events and attributes inheritance information
		this.properties = this.jsdoc.properties;
		if(this.options.inherited)
		{
			this.properties = _(_(this.properties).clone()).extend(this.jsdoc.inherited.properties); 
		}
		this.events = this.jsdoc.events;
		if(this.options.inherited)
		{
			this.events = _(_(this.events).clone()).extend(this.jsdoc.inherited.events); 
		}
		this.attributes = this.jsdoc.attributes;
		if(this.options.inherited)
		{
			this.attributes = _(_(this.attributes).clone()).extend(this.jsdoc.inherited.attributes); 
			console.log('seba2', this.attributes )
		}

		this.hierarchy = this.computeHierarchy();
		this.knownSubclasses = this.computeKnownSubclasses();
	}

,	computeHierarchy: function()
	{
		var hierarchy = [];
		var c = this.jsdoc;
		do 
		{
			hierarchy.push(c);// = [c].concat(hierarchy);
			if(c.extends.absoluteName===c.absoluteName)
			{
				break;
			}
		}
		while( (c = c.extends) ); 
		return hierarchy;
	}

,	computeKnownSubclasses: function()
	{
		var self = this;
		var knownSubclasses = [];
		_(this.application.data.classes).each(function(c)
		{
			if(c.extends.absoluteName === self.jsdoc.absoluteName)
			{
				knownSubclasses.push(c); 
			}
		}); 
		return knownSubclasses; 
	}

});