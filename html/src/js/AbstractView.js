var AbstractView = Backbone.View.extend({

	tagName: "div"

,	initialize: function(application) 
	{
		this.application = application;
		// this.resourceNotFound = false;
	}

,	printTag: function(text, classAttribute, tag) {
		tag = tag || 'span'; 
		classAttribute = classAttribute ||'';
		if(text)
		{
			return '<'+tag+ (classAttribute?(' class="'+classAttribute+'"'):'') +'>'+text+'</'+tag+'>'; 
		}
		return '';
	}

,	simpleName: function(name)
	{
		return this.application.maker.simpleName(name);
	}

,	makeLink: function(node)
	{
		if(node.annotation==='method')
		{
			return '#method/' + node.absoluteName; 
		}
		else if(node.annotation==='class')
		{
			// if(node.)
			debugger;
			return '#class/' + node.absoluteName; 
		}
		else if(node.annotation==='module')
		{
			return '#module/' + node.name; 
		}
	}
	
,	printType: function(context)
	{
		var self = this;
		var href = context.type.nativeTypeUrl || '#class/'+context.type.absoluteName; 
		context.buffer.push('<a href="'+href+'">'+context.type.name+'</a>');

		if(context.type.params) 
		{ 
			context.buffer.push('&lt;');

			for (var i = 0; i < (context.type.params||[]).length; i++) {
				var param = context.type.params[i]; 
				self.printType({ //recurse!
					type:param
				,	buffer: context.buffer
				});
				if(i<context.type.params.length-1)
				{
					context.buffer.push(','); 
				}
			}
			context.buffer.push('>'); 
		} 
	}

,	printTypeAsString: function(type)
	{
		var buffer = [];
		var context = {type: type, typeTemplate: this.printType, buffer: buffer}; 
		this.printType(context); 
		var typeOutput = buffer.join(''); 
		return typeOutput; 
	}
});