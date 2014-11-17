//@module shortjsdoc
//@class PropertyView @extends AbstractView
var PropertyView = AbstractView.extend({

	className: "property-view"

,	template: 'property'

,	initialize: function(application, propertyName, isEvent) 
	{
		this.application = application;
		this.isEvent = isEvent;
		// var a = propertyName.split('.');
		// var className = a[0] + '.' + a[1]; 
		var className = propertyName.substring(0, propertyName.lastIndexOf('.')); 
		var class_ = this.application.data.classes[className];
		// var propertySimpleName = a[2];
		var propertySimpleName = propertyName.substring(propertyName.lastIndexOf('.')+1, propertyName.length); 
		this.jsdoc = isEvent ? class_.events[propertySimpleName] : class_.properties[propertySimpleName];
		if(!this.jsdoc)
		{
			this.resourceNotFound = true;
			return;
		}

		this.jsdoc.textHtml = this.getTextHtml(this.jsdoc);		
	}


});

