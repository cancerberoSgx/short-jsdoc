// this file add methods to Abstract Application for dealing with types and html markup. 
// @class AbstractView

_(AbstractView.prototype).extend({

	//@method printTag
	printTag: function(text, classAttribute, tag) {
		tag = tag || 'span'; 
		classAttribute = classAttribute ||'';
		if(text)
		{
			return '<'+tag+ (classAttribute?(' class="'+classAttribute+'"'):'') +'>'+text+'</'+tag+'>'; 
		}
		return '';
	}

	//@method simpleName @param {String}name
,	simpleName: function(name)
	{
		return this.application.maker.simpleName(name);
	}

	//@method makeLink @param {boolean} htmlAnchors will output anchor elements html
,	makeLink: function(node, htmlAnchors)
	{
		var s = htmlAnchors?'<a href="':'';
		if(node.annotation==='method')
		{			
			s += '#method/' + node.absoluteName; 
		}
		else if(node.annotation==='class')
		{
			s += '#class/' + node.absoluteName; 
		}
		else if(node.annotation==='module')
		{
			s += '#module/' + node.name; 
		}

		s += htmlAnchors?('">'+node.name+'</a>'):'';
		return s;
	}
	//@method printType @param {Object}context
,	printType: function(context)
	{
		var self = this;
		var href = context.type.nativeTypeUrl || '#class/'+context.type.absoluteName; 
		context.buffer.push('<a href="'+href+'">'+context.type.name+'</a>');

		if(context.type.params) 
		{ 
			context.buffer.push('&lt;');
			for (var i = 0; i < (context.type.params||[]).length; i++) 
			{
				var param = context.type.params[i]; 
				self.printType({ //recurse!
					type:param
				,	buffer: context.buffer
				});
				if(i < context.type.params.length - 1)
				{
					context.buffer.push(','); 
				}
			}
			context.buffer.push('>'); 
		} 
	}

	//@method printTypeAsString @param {String} type @return {String}
,	printTypeAsString: function(type)
	{
		var buffer = [];
		var context = {type: type, typeTemplate: this.printType, buffer: buffer}; 
		this.printType(context); 
		var typeOutput = buffer.join(''); 
		return typeOutput; 
	}

	//@method getTextHtml depends on lib/marked/
,	getTextHtml: function(node)
	{
		if(!node || !node.text)
		{
			return '';
		}
		var text = node.text
		,	type = this.application.textFormat
		,	html = _(node.children).find(function(c){return c.annotation==='html'; })
		,	markdown = _(node.children).find(function(c){return c.annotation==='markdown'; });
		
		if(html)
		{
			type = 'html'; 
		}
		if(markdown)
		{
			type = 'markdown'; 
		}

		if(type === 'markdown')
		{
			return marked(text); 
		}
		else
		{
			return text; 
		}
	}

,	renderSource: function(jsdoc, $container)
	{
		var view = new SourcesView(this.application, jsdoc); 
		view.renderIn($container); 
		// this.application.templates.sources.apply(this, arguments)	
	}
});