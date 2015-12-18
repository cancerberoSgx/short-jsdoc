//@module shortjsdoc.html
//@class PropertyView @extends AbstractView
var PropertyView = AbstractView.extend({

	className: 'property-view'

,	template: 'property'

,	initialize: function(application, propertyName, propertyType) 
	{
		this.application = application;

		var propertyLabelsDic = {
			event: 'Event', property: 'Property', attribute: 'Attribute'
		};

		this.propertyLabel = propertyLabelsDic[propertyType]; 

		var className = this.getClassName(propertyName);
		
		var propertySimpleName = this.getSimpleName(propertyName);

		var class_ = this.application.data.classes[className];		
		this.ownerModule = class_.module.name;

		var propertyPropNamesDic = {
			event: 'events', property: 'properties', attribute: 'attributes'
		};

		this.jsdoc = class_[propertyPropNamesDic[propertyType]][propertySimpleName];

		if(!this.jsdoc)
		{
			this.resourceNotFound = true;
			return;
		}

		this.jsdoc.textHtml = this.getTextHtml(this.jsdoc);		
	}


});

