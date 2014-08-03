var MethodView = AbstractView.extend({

	className: "method-view"

,	template: 'method'

,	initialize: function(application, methodName) 
	{
		this.application = application;
		var a = methodName.split('.');
		var className = a[0] + '.' + a[1]; 
		var class_ = this.application.data.classes[className];
		var methodSimpleName = a[2];
		this.jsdoc = class_.methods[methodSimpleName]; 
		if(!this.jsdoc)
		{
			this.resourceNotFound = true;
		}
	}


});

