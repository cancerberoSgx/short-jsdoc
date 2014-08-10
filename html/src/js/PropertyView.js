var PropertyView = AbstractView.extend({

	className: "property-view"

,	template: 'property'

,	initialize: function(application, propertyName) 
	{
		this.application = application;
		var a = propertyName.split('.');
		var className = a[0] + '.' + a[1]; 
		var class_ = this.application.data.classes[className];
		var propertySimpleName = a[2];
		this.jsdoc = class_.properties[propertySimpleName]; 
		if(!this.jsdoc)
		{
			this.resourceNotFound = true;
			return;
		}

		this.jsdoc.textHtml = this.getTextHtml(this.jsdoc);		
	}

,	afterRender: function()
	{
		this.renderSource(this.jsdoc, this.$('[data-type="sources"]')); 
	}
});

