//@module shortjsdoc
// this file add methods to Abstract Application for dealing with types and html markup. 
// @class AbstractView @extends BackboneView

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
		// if (!node || !node.type) // no type for this node. This isn't undefined ! This means we just simply doesn't have the information.
		// {
		//	return '';
		// }
		var s = htmlAnchors?'<a href="':'';
		if(node.annotation==='method')
		{
			s += '#method/' + node.absoluteName; 
		}
		else if(node.annotation==='constructor')
		{			
			s += '#constructor/' + node.absoluteName; 
		}
		else if(node.annotation==='property')
		{
			s += '#property/' + node.absoluteName; 
		}
		else if(node.annotation==='event')
		{
			s += '#event/' + node.absoluteName; 
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
		if(!context || !context.type)
		{
			return ''; 
		}
		var self = this;
		var href = context.type.nativeTypeUrl || '#class/'+context.type.absoluteName; 
		var htmlText = context.type.name; 
		// htmlText += (context.type.nativeTypeUrl ? '<span class="external-label">(external)</span>' : '');
		// htmlText += (context.type.nativeTypeUrl ? '<span class="glyphicon glyphicon-star"></span>' : '');
		var aclass = (context.type.nativeTypeUrl ? ' type external ' : ' type ');
		var iconHtml = context.type.nativeTypeUrl ? '<span class="glyphicon glyphicon-share"></span>' : ''; 

		context.buffer.push('<a class="'+aclass+'" href="'+href+'">'+iconHtml+htmlText+'</a>');

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
,	printSingleTypeAsString: function(type)
	{
		var buffer = [];
		var context = {type: type, typeTemplate: this.printType, buffer: buffer}; 
		this.printType(context); 
		var typeOutput = buffer.join(''); 
		return typeOutput; 
	}
,	printTypeAsString: function(type)
	{
		var self = this;
		if(_(type).isArray())
		{
			var a = [];
			_(type).each(function(t)
			{
				a.push(self.printSingleTypeAsString(t));
			}); 
			return a.join('<span class="type-separator">or</span>'); 
		}
		else
		{
			return this.printSingleTypeAsString(type); 
		}
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

	//@method printMethod
,	printMethod: function(m)
	{
		var isConstructor = m.annotation==='constructor'; 
		var s = '<span class="method">';
		var methodName = isConstructor ? this.simpleName(m.ownerClass) : m.name;
		if(!isConstructor && m.returns)
		{
			s += this.printTypeAsString(m.returns) + '&nbsp;'; 
		}

		s += '<a href="' + this.makeLink(m) + '">' + methodName + '</a>'; 

		return s + '</span>';
	}

,	renderSource_: function(jsdoc, $container)
	{
		var view = new SourcesView(this.application, jsdoc); 
		view.renderIn($container); 
	}


,	renderSource: function()
	{
		if(!this.jsdoc)
		{
			return;
		}
		this.renderSource_(this.jsdoc, this.$('[data-type="sources"]')); 
		this.$('pre code').addClass('prettyprint'); 
		if(typeof prettyPrint !== 'undefined') 
		{
			prettyPrint('pre code');
		}
	}

	
,	getInherited: function(c, what)
	{
		var data = {};
		if(what==='method')
		{
			data = _(c.methods).clone();
			_(data).extend(c.inherited.methods || {});
		}
		return data;
	}
});