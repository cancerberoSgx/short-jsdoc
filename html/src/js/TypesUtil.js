// @module shortjsdoc.html
// this file add methods to Abstract Application for dealing with types and html markup. 
// @class AbstractView @extends Backbone.View
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
,	simpleName: function(name, prefix)
	{
		return this.application.maker.simpleName(name, prefix);
	}

	//@method makeLink @param {boolean} htmlAnchors will output anchor elements html
,	makeLink: function(node, htmlAnchors)
	{
		var className = node.annotation + '-name'; 
		var s = htmlAnchors ? ('<a class="' + className + '" href="') : '';

		var href = '';
		if(node.annotation==='method')
		{
			href += '#method/' + node.absoluteName; 
		}
		else if(node.annotation==='constructor')
		{			
			href += '#constructor/' + node.absoluteName; 
		}
		else if(node.annotation==='function')
		{			
			href += '#function/' + node.absoluteName; 
		}
		else if(node.annotation==='property')
		{
			href += '#property/' + node.absoluteName; 
		}
		else if(node.annotation==='event')
		{
			href += '#event/' + node.absoluteName; 
		}
		else if(node.annotation==='class')
		{
			href += '#class/' + node.absoluteName; 
		}
		else if(node.annotation==='module')
		{
			href += '#module/' + node.name; 
		}
		else
		{
			return '';
		}

		//preserve current params
		var search = location.hash.indexOf('?')===-1 ? '' : location.hash.split('?')[1];
		href += search ? ('?' + search) : '';

		s += href + (htmlAnchors?('">'+node.name+'</a>'):'');

		return s;
	}

,	printLiteralObjectType: function(context)
	{

		var self = this;
		var buf = []; 
		context.buffer.push(this.printType(context.type, true));
		var has_only_proto = _(context.type.properties).keys().length===1 && context.type.properties.prototype; 
		if(has_only_proto) //dirty hack to resolve incompatibility between literal types and Object class inherited props
		{
			return;
		}
		if(context.type.name==='Object')
		{
			context.buffer.push('{')
			_(context.type.properties).each(function(value, key)
			{
				buf.push(key + ': ' + self.printSingleTypeAsString(value, true));				
			}); 
		}
		context.buffer.push(buf.join(', '));
		if(context.type.name==='Object')
		{
			context.buffer.push('}'); 
		}
	}
	
	// @method printType prints a type as html support generic. This is really a html template function
	// @param {Object}context  @return {String} the type html
,	printType: function(context, ignoreLiteralObject)
	{
		if(!context || !context.type)
		{
			return ''; 
		}

		var self = this;
		var href = context.type.nativeTypeUrl || '#class/'+context.type.absoluteName; 
		var htmlText = context.type.name; 
		var aclass = (context.type.nativeTypeUrl ? ' type external ' : ' type ');
		var iconHtml = context.type.nativeTypeUrl ? '<span class="glyphicon glyphicon-share"></span>' : ''; 

		context.buffer.push('<a class="'+aclass+'" href="'+href+'">'+iconHtml+htmlText+'</a>');

		if(context.type.properties && !ignoreLiteralObject)
		{
			this.printLiteralObjectType(context); 
		}

		else if(context.type.params) 
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

	//@method printSingleTypeAsString this is the public method for printing a type - supports any type @param {String} type @return {String}  @return {String} the type html
,	printSingleTypeAsString: function(type, dontRecurse)
	{
		var buffer = [];
		var context = {type: type, typeTemplate: this.printType, buffer: buffer}; 

		this.printType(context); 
		var typeOutput = buffer.join(''); 
		return typeOutput; 
	}
	
	//@method printTypeAsString @param {Array<Type>|Type} type @return {String} the type html
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
	//@method getTextHtml depends on lib/marked/ - all texts should be printed using this method
,	getTextHtml: function(node)
	{
		if(!node || !node.text)
		{
			return '';
		}
		if(node.text_html_app)
		{
			return node.text_html_app; 
		}

		var self2 = this //TODO invitigate why I need self2 and self always binds to other thing than this...
		,	text = node.text
		,	type = this.application.textFormat || 'markdown'
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

		// perform text marks replacement.
		_(node.textMarks).each(function(mark, markId)
		{
			if(mark.name === 'link')
			{
				if(type === 'markdown')
				{
					text = text.replace(markId, '['+mark.linkLabel+']('+mark.linkUrl+')'); 
				}
				else
				{					
					text = text.replace(markId, '< href="mark.linkUrl" class="text-mark-link">'+mark.linkLabel+'</a>'); 
				}
			}
			else if(mark.binding)
			{
				text = text.replace(markId, self2.makeLink(mark.binding, true)); 
			}
		}); 

		if(type === 'markdown')
		{
			text = marked(text); 
		}

		node.text_html_app = text;
		return text; 
		
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
	
,	getClassName: function(absoluteName)
	{
		return absoluteName.substring(0, absoluteName.lastIndexOf('.'));
	}

,	getSimpleName: function(absoluteName)
	{
		return absoluteName.substring(absoluteName.lastIndexOf('.')+1, absoluteName.length); 
	}

,	getModuleClasses: function(moduleName, data)
	{
		var a = [];
		_(data.classes).each(function(c)
		{
			if(c.absoluteName.indexOf(moduleName)===0)
			{
				a.push(c); 
			}
		});
		return a;
	}


	// TODO: move the following to misc utility class 

	//@method parseOptions @return {Object<String,String>}
,	parseOptions: function(options, propSep, valueSep)
	{
		propSep = propSep || '&'; 
		valueSep = valueSep || '='; 
		if(!options)
		{
			return {}; 
		}
		var params = {};
		_(options.split(propSep)).each(function(p)
		{
			var a = p.split(valueSep); 
			if (a.length >= 2)
			{
				params[a[0]] = a[1]; 
				if(!a[1] || a[1]==='0' || a[1]==='false')
				{
					params[a[0]] = false;
				}
			}
		}); 
		return params;
	}

,	getOptionsFromHash: function(hash)
	{
		hash = hash || window.location.hash;
		var options = hash.split('?');
		options = options.length<2 ? '' : options[1]; 
		return this.parseOptions(options);
	}

,	setOptionsToHash: function(hash, newOptions)
	{		
		hash = hash || window.location.hash;
		var options = hash.split('?');
		options = options.length<2 ? '' : options[1]; 
		options = this.parseOptions(options); 
		_(options).extend(newOptions);
		return hash.split('?')[0] + '?' + this.optionsToString(options); 
	}

,	optionsToString: function(options, propSep, valueSep)
	{
		propSep = propSep || '&'; 
		valueSep = valueSep || '='; 
		var a = []; 
		_(options).each(function(value, key)
		{
			a.push(key + valueSep + value); 
		}); 
		return a.join(propSep); 
	}



});