var MethodView = AbstractView.extend({

	className: "method-view"

,	template: 'method'

,	initialize: function(application, methodName) 
	{
		this.application = application;
		var a = methodName.split('.');
		var className = a[0] + '.' + a[1]; 
		this.jsdoc = this.application.data.classes[className].methods.methodName; 
		if(!this.jsdoc)
		{
			this.resourceNotFound = true;
		}
	}

});