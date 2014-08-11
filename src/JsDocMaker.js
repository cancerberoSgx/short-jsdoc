/*jshint laxcomma:true, evil:true*/


(function(GLOBAL) 
{

// @class JsDocMaker
// Main jsdoc parser utility. It accepts a valid js source code String and returns a JavaScript object with a jsdoc AST, this is an object
// with classes and modules array that users can use to easily access jsdocs information, for example, parsed.classes.Apple.methods.getColor
// use the parseFile method for this! This will return the AST, if you want to perform more enrichment and type binding, then use 
// postProccess and postProccessBinding methods after.
//@constructor JsDocMaker
var JsDocMaker = GLOBAL.JsDocMaker = function()
{	
	//@property {Object<String,String>} customNativeTypes name to url map that the user can modify to register new native types b givin its url.
	this.customNativeTypes = this.customNativeTypes || {};
	this.annotationRegexp = /(\s+@\w+)/gi;
	this.parseUnitRegexp = /\s*@(\w+)\s*(\{[\w<>,]+\}){0,1}\s*([\w]+){0,1}(.*)\s*/; 
}; 






//PARSING AND PREPROCESSING

//@method parseFile @return {Object} the parsed object @param {String} source @param {String} filename
JsDocMaker.prototype.parseFile = function(source, fileName)
{
	this.data = this.data || {}; 
	this.data.source = source;

	// @property {EsprimaSyntax} the Sprima Syntax object of the current pased file.	
	this.syntax = esprima.parse(source, {
		raw: true
	,	range: true
	,	comment: true		
	});

	// _(this.syntax.comments).each(function(comment) {});

	var parsed = this.parse(this.syntax.comments, fileName);

	return parsed; 
}; 


//@method parse	@return {Array} array of class description - with methods, and methods containing params. 
JsDocMaker.prototype.parse = function(comments, fileName)
{
	this.comments = comments;
	this.data = this.data || {}; 
	this.data.classes = this.data.classes || {}; 
	this.data.modules = this.data.modules || {}; 

	//we do the parsing block by block, 

	//fix annotations that don't have names 
	this.fixUnamedAnnotations();

	//unify adjacents line comments in 1
	this.unifyLineComments();

	var self = this
	,	classes = this.data.classes
	,	currentClass = null
	,	currentMethod = null
	,	currentModule = null;

	_(this.comments).each(function(node)
	{
		// var a = (node.value || '').split(/((?:@class)|(?:@method)|(?:@param))/gi);
		// var regex = /((?:@class)|(?:@method)|(?:@param))/gi; 
		var regex = /((?:@class)|(?:@method)|(?:@property)|(?:@method)|(?:@module))/gi; 
		var a = JsDocMaker.splitAndPreserve(node.value || '', regex); 
		a = _(a).filter(function(v)  //delete empties and trim
		{
			return JsDocMaker.stringTrim(v);
		});
		
		_(a).each(function(value)
		{
			//TODO: let the user mark some comment block somehow to let the parser to ignore it.			
			var parsed_array = self.parseUnit(value, node);
			_(parsed_array).each(function(parsed)
			{
				parsed.commentRange = node.range;
				parsed.fileName = fileName;

				delete parsed.theRestString; 

				if(parsed.annotation==='class') //allow classes without modules - asignated to a defulat module
				{
					if (!currentModule)
					{
						currentModule = {name: JsDocMaker.DEFAULT_MODULE};
					}
					parsed.module = currentModule; 
					parsed.absoluteName = currentModule.name + JsDocMaker.ABSOLUTE_NAME_SEPARATOR + parsed.name;

					self.data.classes[parsed.absoluteName] = parsed; 
					delete self.data.classes[parsed.name];

					currentClass = parsed; 
				}
				else if (parsed.annotation === 'method' && currentClass)
				{
					currentClass.methods = currentClass.methods || {};
					currentClass.methods[parsed.name] = parsed;
					currentMethod = parsed;
				}
				else if(parsed.annotation === 'property' && currentClass)
				{
					currentClass.properties = currentClass.properties || {};
					currentClass.properties[parsed.name] = parsed;
				}
				else if(parsed.annotation === 'event' && currentClass)
				{
					currentClass.events = currentClass.events || {};
					currentClass.properties[parsed.name] = parsed;
				}				
				else if(parsed.annotation === 'module')
				{					
					currentModule = parsed;
					self.data.modules[currentModule.name] = self.data.modules[currentModule.name] || currentModule; 
				}
				else if(parsed.annotation === 'param' && currentClass)
				{
					if(!currentMethod)
					{
						self.error('param before method: ', parsed);
					}
					else
					{						
						currentMethod.params = currentMethod.params || {};
						currentMethod.params[parsed.name] = parsed; 
					}
				}	

			}); 
		});
		
	}); 
};

// @method {Unit} parseUnit parse a simple substring like '@annotation {Type} a text' into an object {annotation, type, text} object.
// syntax: @method {String} methodName blabla @return {Number} blabla @param {Object} p1 blabla
JsDocMaker.prototype.parseUnit = function(str, comment)
{
	// TODO: split str into major units and then do the parsing
	var parsed = this.parseUnitSimple(str, comment); 
	if(!parsed)
	{
		return null;
	}
	var ret = [parsed];
	if(parsed.theRestString)
	{
		var s = parsed.theRestString; 
		var child;
		while((child = this.parseUnitSimple(s, comment)))
		{
			if(child.annotation === 'class') {
				ret.push(child); 
				parsed = child;
			}
			else
			{					
				parsed.children = parsed.children || []; 
				parsed.children.push(child); 
			}
			s = child.theRestString; 
		}
	}
	return ret; 
}; 

//@method parseUnitSimple
JsDocMaker.prototype.parseUnitSimple = function(str, comment) 
{	
	if(!str)
	{
		return null;
	}
	var result;

	if(comment.type==='Line')
	{
		str = JsDocMaker.stringFullTrim(str); 
		result = this.parseUnitRegexp.exec(str);
	}
	else
	{
		str = JsDocMaker.stringTrim(str); 
		//TODO: I have to put this regexp inline here - if not the second time I call exec on the instance it won't match :-??
		result = /\s*@(\w+)\s*(\{[\w<>,]+\}){0,1}\s*([\w]+){0,1}([.\s\w\W]*)/gmi.exec(str); 
	}
	if(!result || result.length<4)
	{
		return null;  
	}
	var text = result[4] || '';
		
	var splitted = JsDocMaker.splitAndPreserve(text, this.annotationRegexp) || [''];  
	text = splitted[0]; 
	splitted.splice(0,1); 
	var ret = {
		annotation: result[1]
	,	type: result[2]
	,	name: result[3]
	,	text: JsDocMaker.stringTrim(text||'')
	,	theRestString: JsDocMaker.stringTrim(splitted.join(''))
	};
	return ret;
}; 

// @method unifyLineComments unify adjacents Line comment nodes into one in the ns.syntax.coments generated after visiting. 
JsDocMaker.prototype.unifyLineComments = function()
{
	var i = 0;
	
	//@property {String} lineCommentSeparator used to separate each Line comment type text
	this.lineCommentSeparator = this.lineCommentSeparator || ' '; 

	while(i < this.comments.length - 1)
	{
		var c = this.comments[i]
		,	next = this.comments[i+1]; 
		if(c.type==='Line' && next.type==='Line')
		{
			c.value += ' ' + this.lineCommentSeparator + ' ' + next.value; 
			// c.value += ' ' + next.value; //this works!
			this.comments.splice(i+1, 1); 
		}
		else
		{
			i++;
		}
	}
}; 

//@method fixUnamedAnnotations - our regexp format expect an anotation with a name. So for enabling unamed annotations we do this dirty fix, this is add a name to 
//precondition
JsDocMaker.prototype.fixUnamedAnnotations = function()
{
	_(this.comments).each(function(node)
	{
		if(node.value)
		{
			node.value = node.value.replace(/(@\w+)\s*$/gi, '$1 dummy ');
			node.value = node.value.replace(/(@\w+)\s+(@\w+)/gi, '$1 dummy $2');
		}
	});
};






//POST PROCESSING



// @method postProccess so the data is already parsed but we want to normalize some 
// children like @extend and @module to be properties of the unit instead children.
// Also we enforce explicit  parent reference, this is a class must reference its 
// parent module and a method muest reference its parent class. Also related to this 
// is the fullname property that will return an unique full name in the format 
// '$MODULE.$CLASS.$METHOD'. We assume that a module contains unique named classes and 
// that classes contain unique named properties and methods. 
JsDocMaker.DEFAULT_CLASS = 'Object'; 
JsDocMaker.DEFAULT_MODULE = '__DefaultModule'; 
JsDocMaker.ABSOLUTE_NAME_SEPARATOR = '.'; 
JsDocMaker.prototype.postProccess = function()
{
	var self = this;

	// do some work for classes
	_(self.data.classes).each(function(c, name)
	{
		var module = _(c.children||[]).find(function(child)
		{
			return child.annotation === 'module'; 
		});
		if (module)
		{
			c.module = module; //sg 
			c.children = _(c.children).without(module);
			if(!self.data.modules[module.name])
			{
				self.data.modules[module.name] = module; 
			}
			else
			{
				//set the module's text to first with text found.
				self.data.modules[module.name].text = self.data.modules[module.name].text || module.text; 
			}
		}
	}); 
}; 

//@method postProccessBinding precondion: call postProccess() first. We separated the post proccessing in two because we shouln't do JSON.stringify() after we bind types because of recursive loops. 
JsDocMaker.prototype.postProccessBinding = function()
{
	var self = this;
	//at this points we have all our modules and classes - now we normalize extend, methods and params and also do the type binding. 
	_(self.data.classes).each(function(c, name)
	{
		//class.extends property
		var extend = _(c.children||[]).find(function(child)
		{
			return child.annotation === 'extend' || child.annotation === 'extends'; 
		}); 

		if(!extend) // All classes must extend something
		{
			extend = c.extends = (self.bindClass(JsDocMaker.DEFAULT_CLASS, c) || {error: 'NAME_NOT_FOUND', name: JsDocMaker.DEFAULT_CLASS});
		}
		else 
		{
			c.extends = self.bindClass(extend.name, c);
			c.children = _(c.children).without(extend);			
		}

		//setup methods
		_(c.methods).each(function(method, name)
		{
			//method.param property
			var params = _(method.children||[]).filter(function(child)
			{
				child.text = JsDocMaker.stringTrim(child.text||''); 
				return child.annotation === 'param'; 
			}); 
			method.params = params; 

			method.ownerClass = c.absoluteName;
			method.absoluteName = c.absoluteName + JsDocMaker.ABSOLUTE_NAME_SEPARATOR + method.name; 

			_(method.params).each(function(param)
			{
				if(_(param.type).isString())
				{
					param.typeOriginalString = param.type; 
					param.type = self.parseTypeString(param.type, c) || param.type;						
				}					
			}); 

			//method.returns property
			var returns = _(method.children||[]).filter(function(child)
			{
				child.text = JsDocMaker.stringTrim(child.text||''); 
				return child.annotation === 'returns' || child.annotation === 'return'; 
			}); 
			method.returns = returns.length ? returns[0] : {name:'',type:''};

			//because @returns doesn't have a name it breaks our simple grammar, so we merge the name with ts text.
			method.returns.text = method.returns.name + ' ' + method.returns.text; 

			if(_(method.returns.type).isString())
			{
				method.returns.type = self.parseTypeString(method.returns.type, c) || method.returns.type;						
			}

			self.installModifiers(method); 
		});

		//setup properties
		_(c.properties).each(function(prop, name)
		{
			prop.ownerClass = c.absoluteName;
			prop.absoluteName = c.absoluteName + JsDocMaker.ABSOLUTE_NAME_SEPARATOR + prop.name; 
			self.installModifiers(prop); 
			if(_(prop.type).isString())
			{
				prop.type = self.parseTypeString(prop.type, c) || prop.type;
			}	
		});
	});
};



// BINDING / post processing

//@class TypeBinding a datatype with an association between types names in source code and parsed class nodes. 
//It support generic types (recursive)
//@property {TypeBinding} type
//@property {Array<TypeBinding>} params - the generic types params array. For example the params for {Map<String,Apple>} is [StringBynding]
//@property {String} nativeTypeUrl - if this is a native type - this 


//@class JsDocMaker
//@method parseTypeString @return {TypeBinding} or nulll in case the given type cannot be parsed
//TODO: support multiple generics and generics anidation like in
JsDocMaker.prototype.parseTypeString = function(typeString, baseClass)
{
	if(!typeString || !baseClass)
	{
		return null;
	}
	//first remove the '{}'
	typeString = JsDocMaker.stringFullTrim(typeString); 
	var inner = /^{([^}]+)}$/.exec(typeString);
	if(!inner || inner.length<2)
	{
		return null;
	}
	typeString = inner[1]; 

	if(typeString.indexOf('<')!==-1)
	{
		var type = null;
		try
		{
			type = JsDocMaker.parseType(typeString);
			var type_binded = this.bindParsedType(type, baseClass);
			return type_binded;
		}
		catch(ex)
		{
			this.error('Invalid Type: '+typeString, ', baseClass: ', JSON.stringify(baseClass)); 
		}	
	}
	else
	{	
		return this.bindClass(typeString, baseClass);	
	}
}; 

//@method bindParsedType merges the data of JsDocMaker.parseType with bindings of current jsdoc. recursive!
//@param {Object} typeObject @param {Object} baseClass @return {Object}
JsDocMaker.prototype.bindParsedType = function(typeObject, baseClass)
{
	var c = null, out = typeObject, self=this;
	if(typeObject && _(typeObject).isString())
	{
		c = this.bindClass(typeObject, baseClass); 
		out = {name: typeObject}; 
	}
	else if(typeObject && typeObject.name)
	{
		c = this.bindClass(typeObject.name, baseClass); 
		//recurse on params!
		var new_params = [];
		_(out.params).each(function(param)
		{
			var new_param = self.bindParsedType(param, baseClass);
			new_params.push(new_param);
		}); 
		out.params = new_params;
	}
	if(c)
	{
		_(out).extend(c);
	}
	return out;
}; 

//@method bindClass @param {String}name @param {Object} baseClass
//TODO: using a internal map this could be done faster
JsDocMaker.prototype.bindClass = function(name, baseClass)
{
	//search all classes that matches the name
	var classesWithName = _(_(this.data.classes).values()).filter(function(c)
	{
		return c.name===name;//JsDocMaker.stringEndsWith(c.name, name); 
	});
	//search classes of the module
	var moduleClasses = _(classesWithName).filter(function(c)
	{
		return JsDocMaker.startsWith(c.module.name, baseClass.module.name); 
	}); 

	var c = moduleClasses.length ? moduleClasses[0] : classesWithName[0]; 
	if(!c)
	{
		//TODO: look at native types
		var nativeType = this.getNativeTypeUrl(name);
		var o = {name:name}; 
		if(nativeType)
		{
			o.nativeTypeUrl = nativeType; 
		}
		else
		{
			o.error = 'NAME_NOT_FOUND'; 
		}
		return o;		
	}
	else
	{
		return c;
	}
}; 

//@method parseType parse a type string like 'Map<String,Array<Apple>>' and return an object like {name: 'Map',params:['String',{name: 'Array',params:['Apple']}]} 
//It depends on type parser file typeParser.js @static
JsDocMaker.parseType = function(s)
{
	var parsed = ShortJsDocTypeParser.parse(s);
	var obj = eval('(' + parsed + ')'); 
	return obj; 
}; 

// @method simpleName @param {String} name @return {String}
JsDocMaker.prototype.simpleName = function(name)
{
	var a = name.split(JsDocMaker.ABSOLUTE_NAME_SEPARATOR);
	return a[a.length-1]; 
}; 






// NATIVE TYPES LINKING / post processing

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String
JsDocMaker.NATIVE_TYPES = ['String', 'Object', 'Array', 'Date', 'Regex', 'Function', 
	'Boolean', 'Error', 'TypeError', 'Number']; 

//@method getNativeTypeUrl @returns {String}an url if given name match a native types or undefined otherwise
JsDocMaker.prototype.getNativeTypeUrl = function(name)
{
	if(_(JsDocMaker.NATIVE_TYPES).contains(name))
	{
		return 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/' + name;
	}

	var customTypeUrl;
	_(this.customNativeTypes).each(function(val, key)
	{
		if(key===name)
		{
			//TODO: support wildcard like $(name) for inserting the name in the given url dynamically
			customTypeUrl = val;
		}
	});
	return customTypeUrl;
}; 





//MODIFIERS - like static, private, final

//@property {Array<String>}MODIFIERS @static
JsDocMaker.MODIFIERS = ['static', 'private', 'final']; 
//@method installModifiers sets the property modifiers to the node according its children
JsDocMaker.prototype.installModifiers = function(node)
{
	node.modifiers = node.modifiers || []; 
	_(node.children).each(function(child)
	{
		if(_(JsDocMaker.MODIFIERS).contains(child.annotation))
		{
			node.modifiers.push(child.annotation); 
		}
	});
}; 






//UTILITIES

// @method splitAndPreserve search for given regexp and split the given string but preserving the matches
// @param {Regexp} regexp must contain a capturing group (like /(\s+@\w+)/gi)
// @return {Array of string}
// @static
JsDocMaker.splitAndPreserve = function(string, replace)
{
	string = string || '';
	var marker = '_%_%_';
	var splitted = string.replace(replace, marker+'$1');
	if(splitted.length<2)
	{
		return null; //TODO: notify error?
	}
	splitted = splitted.split(marker);
	return splitted; 
}; 
//@mmethod error @param {String}msg
JsDocMaker.prototype.error = function(msg)
{
	console.error('Error detected: ' + msg); 
	throw msg;
}; 

//@method stringFullTrim @param {String} s @static
JsDocMaker.stringFullTrim = function(s)
{
	return (s||'').replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g,'').replace(/\s+/g,' ');
};
//@method stringTrim @param {String} s @static
JsDocMaker.stringTrim = function(str)
{
	var whitespace = ' \n\r\t\f\x0b\xa0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000';
	for (var i = 0; i < str.length; i++) {
		if (whitespace.indexOf(str.charAt(i)) === -1) {
			str = str.substring(i);
			break;
		}
	}
	for (i = str.length - 1; i >= 0; i--) {
		if (whitespace.indexOf(str.charAt(i)) === -1) {
			str = str.substring(0, i + 1);
			break;
		}
	}
	return whitespace.indexOf(str.charAt(0)) === -1 ? str : '';
};
//@method stringEndsWith @static
JsDocMaker.stringEndsWith = function(str, suffix) 
{
	str = str || '';
	return str.indexOf(suffix, str.length - suffix.length) !== -1;
}; 
//@method stringEndsWith @static
JsDocMaker.startsWith = function(s, prefix)
{
	s = s || '';
	return s.indexOf(prefix)===0;
}; 



})(this);
