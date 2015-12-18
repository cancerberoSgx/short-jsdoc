// @module shortjsdoc.html
// @class MethodView Responsible of showing Methods, Constructors and Functions 
// @extends AbstractView
var MethodView = AbstractView.extend({

	className: 'method-view'

,	template: 'method'

,	initialize: function(application, methodName) 
	{
		this.application = application;
		if(Backbone.history.fragment.indexOf('method')===0 || Backbone.history.fragment.indexOf('constructor')===0)
		{
			var className = this.getClassName(methodName);
			var methodSimpleName = this.getSimpleName(methodName);

			var class_ = this.application.data.classes[className];
			this.ownerModule = class_.module.name;

			//is a method or constructor
			if(!isNaN(parseInt(methodSimpleName, 10)))
			{
				this.jsdoc = class_.constructors[parseInt(methodSimpleName, 10)]; 
				this.isConstructor = true;
			}
			else
			{			
				this.jsdoc = class_.methods[methodSimpleName]; 
				this.isConstructor = false;
			}
			if(!this.jsdoc)
			{
				this.resourceNotFound = true;
				return;
			}

			this.jsdoc.textHtml = this.getTextHtml(this.jsdoc);
			this.ownerClass = this.application.data.classes[this.jsdoc.ownerClass]; 

		}
		else if(Backbone.history.fragment.indexOf('function')===0)
		{
			//is a function
			var moduleName = methodName.split('.')[0]
			this.ownerModule = this.application.data.modules[moduleName]
			var f = _.find(this.ownerModule.functions, function(f){return f.absoluteName===methodName})
			this.jsdoc = f;
			if(!this.jsdoc)
			{
				this.resourceNotFound = true;
				return;
			}
			this.isFunction = true;	
		}
	}

});

