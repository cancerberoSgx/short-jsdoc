var AbstractView = Backbone.View.extend({

	tagName: "div"
// ,	className: "class-view"
,	events: {}

// ,	template: 'class'

,	printHTMLElement: function(text, classAttribute, tag) {
		tag = tag || 'span'; 
		classAttribute = classAttribute ||'';
		if(text)
		{
			return '<'+tag+ (classAttribute?(' class="'+classAttribute+'"'):'') +'>'+text+'</'+tag+'>'; 
		}
		return '';
	}

// ,	initialize: function(application, className) 
// 	{
// 		this.application = application;
// 		// this.className = className;
// 		this.jsdoc = this.application.data.classes[className]; 
// 	}

// ,	render: function() {
// 	}

});