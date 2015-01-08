(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){


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
	typeString = typeString.replace(/\s+/gi, '');
	var ret = this.parseSingleTypeString(typeString, baseClass); 
	if(ret && ret.length===1)
	{
		return ret[0]; 
	}
	else
	{	
		return ret;	
	}	
}; 

// @method parseSingleTypeString @param {String} typeStr
JsDocMaker.prototype.parseSingleTypeString = function(typeStr, baseClass)
{
	var a = typeStr.split('|'), ret = [], self = this;

	_(a).each(function(typeString)
	{
	
		// is this a custom type, like #custom(1,2) ? 

		var regex = /^#(\w+)\(([^\()]+)\)/
		,	customType = regex.exec(typeString)
		,	type_binded = null
		,	type = null;

		if(customType && customType.length === 3)
		{
			var parserName = customType[1];
			var parserInput = customType[2]; 
			var parser = self.typeParsers[parserName]; 
			if(parser)
			{
				try 
				{
					var parsed = parser.parse(parserInput, baseClass);
					if(parsed)
					{
						// TODO bind type ? 
						//BIG PROBLEM HERE - this code executes at parsing time and here we are binding - do this binding in a post processing ast
						//TODO probably all this code should be moved to postprocessing ast phase and here we only dump the original type string.
						type_binded = self.bindParsedType(parsed, baseClass); 
						ret.push(type_binded); 
					}
				}
				catch(ex)
				{
					self.error('Invalid Custom Type: '+typeString, ', baseClass: ', JSON.stringify(baseClass)); 
				}				
			}
		}

		//it is a literal object type, like {a:String,b:Number}? 

		else if(typeString.indexOf(':')!==-1 && typeString.indexOf('#')===-1 ) //and is not a custom type #cus
		{
			type = null; 
			try
			{
				var props = JsDocMaker.parseType(typeString);
				type = {name: 'Object', properties: props}; 
				type_binded = self.bindParsedType(type, baseClass);
				ret.push(type_binded); 
			}
			catch(ex)
			{
				self.error('Invalid Type: '+typeString, ', baseClass: ', JSON.stringify(baseClass)); 
			}	
		}


		// it is a generic type like Array<String> ? 

		else if(typeString.indexOf('<')!==-1)
		{
			type = null;
			try
			{
				type = JsDocMaker.parseType(typeString);
				type_binded = self.bindParsedType(type, baseClass);
				ret.push(type_binded); 
			}
			catch(ex)
			{
				self.error('Invalid Type: '+typeString, ', baseClass: ', JSON.stringify(baseClass)); 
			}	
		}

		else
		{	
			ret.push(self.bindClass(typeString, baseClass));	
		}
	}) ; 

	return ret;
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

		//recurse on params for generic types like M<T,K>!
		if(out.params)
		{			
			var new_params = [];

			c = this.bindClass(typeObject.name, baseClass); 

			_(out.params).each(function(param)
			{
				var new_param = self.bindParsedType(param, baseClass);
				new_params.push(new_param);
			}); 
			out.params = new_params;	
		}

		//recurse on properties for literal object type like name:String,config:Config
		if(out.properties)
		{
			var new_properties = {};
			_(out.properties).each(function(value, name)
			{
				var new_property = self.bindParsedType(value, baseClass);
				new_properties[name] = new_property; 
			}); 
			out.properties = new_properties;	
		}
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

	//TODO: performance - classesWithName could be compauted only if moduleClasses is empty

	var c = moduleClasses.length ? moduleClasses[0] : classesWithName[0]; 

	if(!c)
	{
		//TODO: look at native types
		var nativeType = this.getNativeTypeUrl ? this.getNativeTypeUrl(name) : null;
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

// @method simpleName @param {String} name @return {String}
JsDocMaker.prototype.simpleName = function(name)
{
	var a = name.split(JsDocMaker.ABSOLUTE_NAME_SEPARATOR);
	return a[a.length-1]; 
}; 







},{}],2:[function(require,module,exports){
// @class JsDocMaker
// Main jsdoc parser utility. It accepts a valid js source code String and returns a JavaScript object with a jsdoc AST, this is an object
// with classes and modules array that users can use to easily access jsdocs information, for example, parsed.classes.Apple.methods.getColor
// use the parseFile method for this! This will return the AST, if you want to perform more enrichment and type binding, then use 
// postProccess and postProccessBinding methods after.

var JsDocMaker = function(options)
{	
	//@property {Object<String,String>} customNativeTypes name to url map that the user can modify to register new native types b givin its url.
	this.customNativeTypes = this.customNativeTypes || {};
	this.annotationRegexp = /(\s+@\w+)/gi;
	this.typeParsers = {};
	this.inputSource = [];
	this.options = options || {};
}; 

JsDocMaker.DEFAULT_CLASS = 'Object'; 
JsDocMaker.DEFAULT_MODULE = '__DefaultModule'; 
JsDocMaker.ABSOLUTE_NAME_SEPARATOR = '.'; 
JsDocMaker.MULTIPLE_TEXT_SEPARATOR = '\n\n'; 

//expose
/* jshint evil:true*/
if(typeof(window) !== 'undefined')
{
	window.JsDocMaker = JsDocMaker; 
}
},{}],3:[function(require,module,exports){
'strict mode'; 

var JsDocMaker = require('./class'); 

require('./util'); 

require('./parse'); 

require('./preprocess'); 

require('./postprocess'); 

require('./binding'); 
require('./type-parsing'); 

module.exports = JsDocMaker;
},{"./binding":1,"./class":2,"./parse":4,"./postprocess":5,"./preprocess":6,"./type-parsing":7,"./util":8}],4:[function(require,module,exports){

//PARSING AND PREPROCESSING

//@property {Array<Function>}commentPreprocessors
JsDocMaker.prototype.commentPreprocessors = []; 

//@method jsdoc the public method to parse all the added files with addFile. @return {Object} the parsed object @param {String} source . Optional
JsDocMaker.prototype.jsdoc = function(source)
{
	//@property {Array<String>} all the input added included @filename annotations
	source = source || this.inputSource.join('');
	this.data = this.data || {}; 
	this.data.source = source;

	// @property {EsprimaSyntax} the Sprima Syntax object of the current pased file.	
	this.syntax = esprima.parse(source, {
		raw: true
	,	range: true
	,	comment: true		
	});

	this.parse(this.syntax.comments);

	return this.data;
}; 

//@method parseFile a public method for parsing a single file. Note if you want to parse more than one file please use addFile() and the jsdoc() 
//@return {Object} the parsed object @param {String} source @param {String} filename
JsDocMaker.prototype.parseFile = function(source, fileName)
{
	this.addFile(source, fileName); 
	return this.jsdoc(); 
}; 

//@method addFile @param {String}source the source code of the file @param  {String} the file name
JsDocMaker.prototype.addFile = function(source, fileName)
{
	this.inputSource.push('\n\n//@filename {Foo} fileName ' + fileName+'\n\n');
	this.inputSource.push(source);
}; 

//@property {String} ignoreCommentPrefix
JsDocMaker.prototype.ignoreCommentPrefix = '?';

//@method parse	@return {Array} array of class description - with methods, and methods containing params. 
JsDocMaker.prototype.parse = function(comments)
{
	var self = this
	,	currentClass = null
	,	currentMethod = null
	,	currentModule = null
	,	currentFile = null;

	this.comments = comments;
	this.data = this.data || {}; 
	this.data.classes = this.data.classes || {}; 
	this.data.modules = this.data.modules || {}; 
	this.data.filenames = this.data.filenames || {}; 

	_(this.commentPreprocessors).each(function(preprocessor)
	{
		preprocessor.apply(self, [self]); 
	});

	_(this.comments).each(function(node)
	{
		var regex = /((?:@class)|(?:@method)|(?:@property)|(?:@method)|(?:@module)|(?:@event)|(?:@constructor)|(?:@filename))/gi; 
		var a = JsDocMaker.splitAndPreserve(node.value || '', regex); 
		a = _(a).filter(function(v)  //delete empties and trim
		{
			return JsDocMaker.stringTrim(v);
		});
		
		_(a).each(function(value)
		{
			var parsed_array = self.parseUnit(value, node);
			_(parsed_array).each(function(parsed)
			{
				parsed.commentRange = node.range;
				parsed.file = currentFile;

				delete parsed.theRestString; 

				//Note: here is the (only) place were the 'primary tags' are implemented 
				//We get primary tags like class,module,method,property and form the first primary AST (a module contains classes which contain methods and properties)
				//All the other annotations are treated as secondary, this means they will be assigned as childresn to the last primary annotation.

				if(parsed.annotation === 'class') 
				{
					//allow classes without modules - asignated to a defulat module
					if (!currentModule)
					{
						currentModule = {name: JsDocMaker.DEFAULT_MODULE};
					}

					parsed.module = currentModule; 
					parsed.absoluteName = currentModule.name + JsDocMaker.ABSOLUTE_NAME_SEPARATOR + parsed.name;

					//if the class was already defined we want to preserve all the definitions texts
					if(self.data.classes[parsed.absoluteName])
					{
						if(self.data.classes[parsed.absoluteName].text !== parsed.text)
						{
							self.data.classes[parsed.absoluteName].text += JsDocMaker.MULTIPLE_TEXT_SEPARATOR + parsed.text; 
						}
						currentClass = self.data.classes[parsed.absoluteName]; 
					}
					else
					{						
						self.data.classes[parsed.absoluteName] = parsed; 
						delete self.data.classes[parsed.name];
						currentClass = parsed; 
					}
				}

				if(parsed.annotation === 'filename') 
				{
					currentFile = parsed; 
					currentFile.fileName = parsed.text; 
				}

				else if(parsed.annotation === 'module')
				{	
					currentModule = parsed;

					//if the module was already defined we want to preserve all the definitions texts
					if(self.data.modules[currentModule.name])
					{
						if(self.data.modules[currentModule.name].text !== currentModule.text)
						{
							self.data.modules[currentModule.name].text += JsDocMaker.MULTIPLE_TEXT_SEPARATOR + currentModule.text; 
						}
					}
					else
					{
						self.data.modules[currentModule.name] = currentModule; 
					}
				}

				//the rest are all children of class : 

				//? we treat @method as equivalent as @constructor
				else if (parsed.annotation === 'method' && currentClass)
				{
					currentClass.methods = currentClass.methods || {};
					currentClass.methods[parsed.name] = parsed;
					currentMethod = parsed;
				}
				else if(parsed.annotation === 'constructor' && currentClass)
				{
					currentClass.constructors = currentClass.constructors || [];
					currentClass.constructors.push(parsed); 
					currentMethod = parsed; 
				}

				//? @property and @event are treated similarly
				else if(parsed.annotation === 'property' && currentClass)
				{
					currentClass.properties = currentClass.properties || {};
					currentClass.properties[parsed.name] = parsed;
				}
				else if(parsed.annotation === 'event' && currentClass)
				{
					currentClass.events = currentClass.events || {};
					currentClass.events[parsed.name] = parsed;
				}

				//? @param is children of @method
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

//@method parseUnitSimple @param {String} str @param {ASTSprimaNode} comment
JsDocMaker.prototype.parseUnitSimple = function(str, comment) 
{	
	if(!str)
	{
		return null;
	}
	var result;
	var regexp = null; 

	if(comment.type==='Line')
	{
		str = JsDocMaker.stringFullTrim(str); 
		regexp = /\s*@(\w+)\s*(\{[\w<>\|, #:\(\)\.]+\}){0,1}\s*([\w\._\$]+){0,1}(.*)\s*/i; 
		result = regexp.exec(str);
	}
	else
	{
		str = JsDocMaker.stringTrim(str); 
		regexp = /\s*@(\w+)\s*(\{[\w<>\|, #:\(\)\.]+\}){0,1}\s*([\w\._\$]+){0,1}([.\s\w\W]*)/gmi;
		//TODO: I have to put this regexp inline here - if not the second time I call exec on the instance it won't match. This is because the 'g' modifier.
		result = regexp.exec(str); 
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

},{}],5:[function(require,module,exports){


//POST PROCESSING


//@property {Array<Function>}postProccessors
JsDocMaker.prototype.postProccessors = []; 

// @method postProccess so the data is already parsed but we want to normalize some 
// children like @extend and @ module to be properties of the unit instead children.
// Also we enforce explicit  parent reference, this is a class must reference its 
// parent module and a method muest reference its parent class. Also related to this 
// is the fullname property that will return an unique full name in the format 
// '$MODULE.$CLASS.$METHOD'. We assume that a module contains unique named classes and 
// that classes contain unique named properties and methods. 
JsDocMaker.prototype.postProccess = function()
{
	var self = this;

	// set params and throws of constructors
	_(self.data.classes).each(function(c)
	{
		_(c.constructors).each(function(co){
			co.params = _(co.children||[]).filter(function(child)
			{
				return child.annotation === 'param'; 
			});

			co.throws = _(co.children||[]).filter(function(child)
			{
				return child.annotation === 'throw' || child.annotation === 'throws'; 
			});
		}); 
	}); 
}; 


//@method postProccessBinding precondion: call postProccess() first. We separated the post proccessing in two because we shouln't do JSON.stringify() after we bind types because of recursive loops. 
JsDocMaker.prototype.postProccessBinding = function()
{
	if(this.literalObjectInstall)
	{
		this.literalObjectInstall(); 
	}
	var self = this;
	
	//at this points we have all our modules and classes - now we normalize extend, methods and params and also do the type binding. 
	_(self.data.classes).each(function(c)
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
			c.children = _(c.children).without(extend);	//TODO: why we would want to do this? - remove this line
		}


		//setup methods & constructors

		var methods = _(c.methods).clone() || {};
		if(c.constructors) 
        {
            for (var i = 0; i < c.constructors.length; i++) 
            {
                var cname = 'constructor ' + i;
                methods[cname] = c.constructors[i]; //using invalid method name
                c.constructors[i].name = i+'';
            }
        }

		_(methods).each(function(method)
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

			//method throws property
			var throw$ = _(method.children||[]).filter(function(child)
			{
				// child.text = JsDocMaker.stringTrim(child.text||''); 
				return child.annotation === 'throw' || child.annotation === 'throws'; 
			}); 
			method.throws = throw$; 
			// method.ownerClass = c.absoluteName;				
			// method.absoluteName = c.absoluteName + JsDocMaker.ABSOLUTE_NAME_SEPARATOR + method.name; 
			_(method.throws).each(function(t)
			{
				//because @throws doesn't have a name it breaks our simple grammar, so we merge the name with its text.
				t.text = (t.name ? t.name+' ' : '') + (t.text||''); 
				if(_(t.type).isString())
				{
					t.typeOriginalString = t.type; 
					t.type = self.parseTypeString(t.type, c) || t.type;						
				}
			}); 

			//method.returns property
			var returns = _(method.children||[]).filter(function(child)
			{
				child.text = JsDocMaker.stringTrim(child.text||''); 
				return child.annotation === 'returns' || child.annotation === 'return'; 
			}); 
			method.returns = returns.length ? returns[0] : {name:'',type:''};

			//because @returns doesn't have a name it breaks our simple grammar, so we merge the name with its text.
			method.returns.text = (method.returns.name ? method.returns.name+' ' : '') + (method.returns.text||''); 

			if(_(method.returns.type).isString())
			{
				method.returns.type = self.parseTypeString(method.returns.type, c) || method.returns.type;						
			}

			if(self.installModifiers)
			{
				self.installModifiers(method); 
			}
		});

		//setup properties
		var propertySetup = function(prop)
		{
			prop.ownerClass = c.absoluteName;
			prop.absoluteName = c.absoluteName + JsDocMaker.ABSOLUTE_NAME_SEPARATOR + prop.name; 
			if(self.installModifiers)
			{
				self.installModifiers(prop); 
			}
			if(_(prop.type).isString())
			{
				prop.type = self.parseTypeString(prop.type, c) || prop.type;
			}	
		}; 
		_(c.properties).each(propertySetup);
		_(c.events).each(propertySetup);
	});
};

},{}],6:[function(require,module,exports){

//COMMENT PREPROCESSORS

//@method preprocessComments do an initial preprocesing on the comments erasing those marked to be ignored, and fixing its text to support alternative syntax.
JsDocMaker.prototype.preprocessComments = function()
{
	//we do the parsing block by block,
	for (var i = 0; i < this.comments.length; i++) 
	{
		var node = this.comments[i]; 
		node.value = node.value || ''; 

		// fix styled comment blocks with '*' as new line prefix
		if(node.type === 'Block')
		{
			// Note: syntax /** - not necesary to implement
			node.value = node.value.replace(/\n \*/gi, '\n');
		}

		// remove comments that starts with ignoreCommentPrefix
		if(JsDocMaker.startsWith(JsDocMaker.stringTrim(node.value), this.ignoreCommentPrefix))
		{
			//if \n * is detected it is fixed to not count the decorative '*'
			this.comments.splice(i, 1); //remove this node
		}
	}
}; 
//install it as comment preprocessor plugin!
JsDocMaker.prototype.commentPreprocessors.push(JsDocMaker.prototype.preprocessComments); 


//@method fixUnamedAnnotations - our regexp format expect an anotation with a name. So for enabling unamed annotations we do this dirty fix, this is add a name to 
//precondition
JsDocMaker.prototype.fixUnamedAnnotations = function()
{
	_(this.comments).each(function(node)
	{
		if(node.value)
		{
			node.value = node.value.replace(/@constructor/gi, '@constructor n'); 
			// node.value = node.value.replace(/@throw/gi, '@throws n'); 
			// node.value = node.value.replace(/@throws/gi, '@throws n'); 
			node.value = node.value.replace(/(@\w+)\s*$/gi, '$1 dummy ');
			node.value = node.value.replace(/(@\w+)\s+(@\w+)/gi, '$1 dummy $2');
		}
	});
};
//install it as comment preprocessor plugin!
JsDocMaker.prototype.commentPreprocessors.push(JsDocMaker.prototype.fixUnamedAnnotations); 


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

		var sss = JsDocMaker.stringFullTrim(this.data.source.substring(c.range[1], next.range[0])); 
		if (c.type==='Line' && next.type==='Line' && !sss)
		{
			c.value += ' ' + this.lineCommentSeparator + ' ' + next.value; 
			c.range[1] = next.range[1]; 
			this.comments.splice(i+1, 1); 
		}
		else
		{
			i++;
		}
	}
}; 

//install it as comment preprocessor plugin!
JsDocMaker.prototype.commentPreprocessors.push(JsDocMaker.prototype.unifyLineComments); 

},{}],7:[function(require,module,exports){
var shortjsdocParseLiteralObject = require('../objectTypeParser/parser.js');

//TYPE PARSING

//@method parseType parse a type string like 'Map<String,Array<Apple>>' or 'String' and return an object like {name: 'Map',params:['String',{name: 'Array',params:['Apple']}]}. This is the default type parser. 
//It depends on type parser file typeParser.js @static
JsDocMaker.parseType = function(s)
{
	var parsed, ss;
	if(s.indexOf(':')!==-1)
	{
		ss = '{'+s+'}'; 
		parsed = JsDocMaker.parseLiteralObjectType(ss);
	}
	else
	{
		ss ='{name:'+s+'}'; 
		parsed = JsDocMaker.parseLiteralObjectType(ss);
		parsed = parsed.name; 
	}	
	return parsed;
}; 

// @method parse a object literal type string like '' @return {Object} the parsed object @static
JsDocMaker.parseLiteralObjectType = function(s)
{
	var parsed = shortjsdocParseLiteralObject.parse(s);	
	var obj = eval('(' + parsed + ')'); 
	return obj;
}; 

JsDocMaker.prototype.registerTypeParser = function(typeParser)
{
	this.typeParsers = this.typeParsers || {};
	this.typeParsers[typeParser.name] = typeParser; 
}; 


},{"../objectTypeParser/parser.js":10}],8:[function(require,module,exports){


// STATIC UTILITIES

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

//@mmethod error @param {String}msg
JsDocMaker.prototype.error = function(msg)
{
	console.error('Error detected: ' + msg); 
	throw msg;
}; 



},{}],9:[function(require,module,exports){
'strict mode'; 

var JsDocMaker = require('./core/main'); 

require('./plugin/main.js'); 

module.export = JsDocMaker;

},{"./core/main":3,"./plugin/main.js":13}],10:[function(require,module,exports){
/*

This is a syntax definition compiled to JavaScript that parses an expression like 

  {name:String,colors:Map<String,Array<String>>}

How to work with this file ? open the following syntax into http://pegjs.org/online. 
Then make sure it returns the parse() function in the global 'shortjsdocParseLiteralObject'


start
  = "{" exprs:(EXPR)+ [,]* "}" {return '{' + exprs.join(',') + '}'; }

EXPR
  = name:NAME ":" value:(VALUE) [,]* {return name + ':' + value; }

VALUE
  = type:TYPE / name:NAME [,]* {if(typeof name !== 'undefined'){return name;}}

TYPE
  = name:NAME "<" list:(LIST_OF_NAMES)+ ">" {return '{name: '+ name +',params:['+list.join(',')+']}'; }

NAME
  = name:[a-zA-z1-9_.]+ {return '\''+name.join('')+'\''; }

LIST_OF_NAMES
  = type:TYPE / name:NAME [,]* {
  if(typeof name !== 'undefined'){
  return name; 
  }
}

*/
module.exports = (function() {
  /*
   * Generated by PEG.js 0.8.0.
   *
   * http://pegjs.majda.cz/
   */

  function peg$subclass(child, parent) {
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor();
  }

  function SyntaxError(message, expected, found, offset, line, column) {
    this.message  = message;
    this.expected = expected;
    this.found    = found;
    this.offset   = offset;
    this.line     = line;
    this.column   = column;

    this.name     = "SyntaxError";
  }

  peg$subclass(SyntaxError, Error);

  function parse(input) {
    var options = arguments.length > 1 ? arguments[1] : {},

        peg$FAILED = {},

        peg$startRuleIndices = { start: 0 },
        peg$startRuleIndex   = 0,

        peg$consts = [
          peg$FAILED,
          "{",
          { type: "literal", value: "{", description: "\"{\"" },
          [],
          /^[,]/,
          { type: "class", value: "[,]", description: "[,]" },
          "}",
          { type: "literal", value: "}", description: "\"}\"" },
          function(exprs) {return '{' + exprs.join(',') + '}'; },
          ":",
          { type: "literal", value: ":", description: "\":\"" },
          function(name, value) {return name + ':' + value; },
          function(name) {if(typeof name !== 'undefined'){return name;}},
          "<",
          { type: "literal", value: "<", description: "\"<\"" },
          ">",
          { type: "literal", value: ">", description: "\">\"" },
          function(name, list) {return '{name: '+ name +',params:['+list.join(',')+']}'; },
          /^[a-zA-z1-9_.]/,
          { type: "class", value: "[a-zA-z1-9_.]", description: "[a-zA-z1-9_.]" },
          function(name) {return '\''+name.join('')+'\''; },
          function(name) {
            if(typeof name !== 'undefined'){
            return name; 
            }
          }
        ],

        peg$bytecode = [
          peg$decode("!.!\"\"2!3\"+o$ #7!+&$,#&7!\"\"\"  +V% #0$\"\"1!3%,)&0$\"\"1!3%\"+8%.&\"\"2&3'+(%4$6($!\"%$$#  $##  $\"#  \"#  "),
          peg$decode("!7$+a$.)\"\"2)3*+Q%7\"+G% #0$\"\"1!3%,)&0$\"\"1!3%\"+)%4$6+$\"#!%$$#  $##  $\"#  \"#  "),
          peg$decode("7#*Q \"!7$+F$ #0$\"\"1!3%,)&0$\"\"1!3%\"+(%4\"6,\"!!%$\"#  \"#  "),
          peg$decode("!7$+b$.-\"\"2-3.+R% #7%+&$,#&7%\"\"\"  +9%./\"\"2/30+)%4$61$\"#!%$$#  $##  $\"#  \"#  "),
          peg$decode("! #02\"\"1!33+,$,)&02\"\"1!33\"\"\"  +' 4!64!! %"),
          peg$decode("7#*Q \"!7$+F$ #0$\"\"1!3%,)&0$\"\"1!3%\"+(%4\"65\"!!%$\"#  \"#  ")
        ],

        peg$currPos          = 0,
        peg$reportedPos      = 0,
        peg$cachedPos        = 0,
        peg$cachedPosDetails = { line: 1, column: 1, seenCR: false },
        peg$maxFailPos       = 0,
        peg$maxFailExpected  = [],
        peg$silentFails      = 0,

        peg$result;

    if ("startRule" in options) {
      if (!(options.startRule in peg$startRuleIndices)) {
        throw new Error("Can't start parsing from rule \"" + options.startRule + "\".");
      }

      peg$startRuleIndex = peg$startRuleIndices[options.startRule];
    }

    function text() {
      return input.substring(peg$reportedPos, peg$currPos);
    }

    function offset() {
      return peg$reportedPos;
    }

    function line() {
      return peg$computePosDetails(peg$reportedPos).line;
    }

    function column() {
      return peg$computePosDetails(peg$reportedPos).column;
    }

    function expected(description) {
      throw peg$buildException(
        null,
        [{ type: "other", description: description }],
        peg$reportedPos
      );
    }

    function error(message) {
      throw peg$buildException(message, null, peg$reportedPos);
    }

    function peg$computePosDetails(pos) {
      function advance(details, startPos, endPos) {
        var p, ch;

        for (p = startPos; p < endPos; p++) {
          ch = input.charAt(p);
          if (ch === "\n") {
            if (!details.seenCR) { details.line++; }
            details.column = 1;
            details.seenCR = false;
          } else if (ch === "\r" || ch === "\u2028" || ch === "\u2029") {
            details.line++;
            details.column = 1;
            details.seenCR = true;
          } else {
            details.column++;
            details.seenCR = false;
          }
        }
      }

      if (peg$cachedPos !== pos) {
        if (peg$cachedPos > pos) {
          peg$cachedPos = 0;
          peg$cachedPosDetails = { line: 1, column: 1, seenCR: false };
        }
        advance(peg$cachedPosDetails, peg$cachedPos, pos);
        peg$cachedPos = pos;
      }

      return peg$cachedPosDetails;
    }

    function peg$fail(expected) {
      if (peg$currPos < peg$maxFailPos) { return; }

      if (peg$currPos > peg$maxFailPos) {
        peg$maxFailPos = peg$currPos;
        peg$maxFailExpected = [];
      }

      peg$maxFailExpected.push(expected);
    }

    function peg$buildException(message, expected, pos) {
      function cleanupExpected(expected) {
        var i = 1;

        expected.sort(function(a, b) {
          if (a.description < b.description) {
            return -1;
          } else if (a.description > b.description) {
            return 1;
          } else {
            return 0;
          }
        });

        while (i < expected.length) {
          if (expected[i - 1] === expected[i]) {
            expected.splice(i, 1);
          } else {
            i++;
          }
        }
      }

      function buildMessage(expected, found) {
        function stringEscape(s) {
          function hex(ch) { return ch.charCodeAt(0).toString(16).toUpperCase(); }

          return s
            .replace(/\\/g,   '\\\\')
            .replace(/"/g,    '\\"')
            .replace(/\x08/g, '\\b')
            .replace(/\t/g,   '\\t')
            .replace(/\n/g,   '\\n')
            .replace(/\f/g,   '\\f')
            .replace(/\r/g,   '\\r')
            .replace(/[\x00-\x07\x0B\x0E\x0F]/g, function(ch) { return '\\x0' + hex(ch); })
            .replace(/[\x10-\x1F\x80-\xFF]/g,    function(ch) { return '\\x'  + hex(ch); })
            .replace(/[\u0180-\u0FFF]/g,         function(ch) { return '\\u0' + hex(ch); })
            .replace(/[\u1080-\uFFFF]/g,         function(ch) { return '\\u'  + hex(ch); });
        }

        var expectedDescs = new Array(expected.length),
            expectedDesc, foundDesc, i;

        for (i = 0; i < expected.length; i++) {
          expectedDescs[i] = expected[i].description;
        }

        expectedDesc = expected.length > 1
          ? expectedDescs.slice(0, -1).join(", ")
              + " or "
              + expectedDescs[expected.length - 1]
          : expectedDescs[0];

        foundDesc = found ? "\"" + stringEscape(found) + "\"" : "end of input";

        return "Expected " + expectedDesc + " but " + foundDesc + " found.";
      }

      var posDetails = peg$computePosDetails(pos),
          found      = pos < input.length ? input.charAt(pos) : null;

      if (expected !== null) {
        cleanupExpected(expected);
      }

      return new SyntaxError(
        message !== null ? message : buildMessage(expected, found),
        expected,
        found,
        pos,
        posDetails.line,
        posDetails.column
      );
    }

    function peg$decode(s) {
      var bc = new Array(s.length), i;

      for (i = 0; i < s.length; i++) {
        bc[i] = s.charCodeAt(i) - 32;
      }

      return bc;
    }

    function peg$parseRule(index) {
      var bc    = peg$bytecode[index],
          ip    = 0,
          ips   = [],
          end   = bc.length,
          ends  = [],
          stack = [],
          params, i;

      function protect(object) {
        return Object.prototype.toString.apply(object) === "[object Array]" ? [] : object;
      }

      while (true) {
        while (ip < end) {
          switch (bc[ip]) {
            case 0:
              stack.push(protect(peg$consts[bc[ip + 1]]));
              ip += 2;
              break;

            case 1:
              stack.push(peg$currPos);
              ip++;
              break;

            case 2:
              stack.pop();
              ip++;
              break;

            case 3:
              peg$currPos = stack.pop();
              ip++;
              break;

            case 4:
              stack.length -= bc[ip + 1];
              ip += 2;
              break;

            case 5:
              stack.splice(-2, 1);
              ip++;
              break;

            case 6:
              stack[stack.length - 2].push(stack.pop());
              ip++;
              break;

            case 7:
              stack.push(stack.splice(stack.length - bc[ip + 1], bc[ip + 1]));
              ip += 2;
              break;

            case 8:
              stack.pop();
              stack.push(input.substring(stack[stack.length - 1], peg$currPos));
              ip++;
              break;

            case 9:
              ends.push(end);
              ips.push(ip + 3 + bc[ip + 1] + bc[ip + 2]);

              if (stack[stack.length - 1]) {
                end = ip + 3 + bc[ip + 1];
                ip += 3;
              } else {
                end = ip + 3 + bc[ip + 1] + bc[ip + 2];
                ip += 3 + bc[ip + 1];
              }

              break;

            case 10:
              ends.push(end);
              ips.push(ip + 3 + bc[ip + 1] + bc[ip + 2]);

              if (stack[stack.length - 1] === peg$FAILED) {
                end = ip + 3 + bc[ip + 1];
                ip += 3;
              } else {
                end = ip + 3 + bc[ip + 1] + bc[ip + 2];
                ip += 3 + bc[ip + 1];
              }

              break;

            case 11:
              ends.push(end);
              ips.push(ip + 3 + bc[ip + 1] + bc[ip + 2]);

              if (stack[stack.length - 1] !== peg$FAILED) {
                end = ip + 3 + bc[ip + 1];
                ip += 3;
              } else {
                end = ip + 3 + bc[ip + 1] + bc[ip + 2];
                ip += 3 + bc[ip + 1];
              }

              break;

            case 12:
              if (stack[stack.length - 1] !== peg$FAILED) {
                ends.push(end);
                ips.push(ip);

                end = ip + 2 + bc[ip + 1];
                ip += 2;
              } else {
                ip += 2 + bc[ip + 1];
              }

              break;

            case 13:
              ends.push(end);
              ips.push(ip + 3 + bc[ip + 1] + bc[ip + 2]);

              if (input.length > peg$currPos) {
                end = ip + 3 + bc[ip + 1];
                ip += 3;
              } else {
                end = ip + 3 + bc[ip + 1] + bc[ip + 2];
                ip += 3 + bc[ip + 1];
              }

              break;

            case 14:
              ends.push(end);
              ips.push(ip + 4 + bc[ip + 2] + bc[ip + 3]);

              if (input.substr(peg$currPos, peg$consts[bc[ip + 1]].length) === peg$consts[bc[ip + 1]]) {
                end = ip + 4 + bc[ip + 2];
                ip += 4;
              } else {
                end = ip + 4 + bc[ip + 2] + bc[ip + 3];
                ip += 4 + bc[ip + 2];
              }

              break;

            case 15:
              ends.push(end);
              ips.push(ip + 4 + bc[ip + 2] + bc[ip + 3]);

              if (input.substr(peg$currPos, peg$consts[bc[ip + 1]].length).toLowerCase() === peg$consts[bc[ip + 1]]) {
                end = ip + 4 + bc[ip + 2];
                ip += 4;
              } else {
                end = ip + 4 + bc[ip + 2] + bc[ip + 3];
                ip += 4 + bc[ip + 2];
              }

              break;

            case 16:
              ends.push(end);
              ips.push(ip + 4 + bc[ip + 2] + bc[ip + 3]);

              if (peg$consts[bc[ip + 1]].test(input.charAt(peg$currPos))) {
                end = ip + 4 + bc[ip + 2];
                ip += 4;
              } else {
                end = ip + 4 + bc[ip + 2] + bc[ip + 3];
                ip += 4 + bc[ip + 2];
              }

              break;

            case 17:
              stack.push(input.substr(peg$currPos, bc[ip + 1]));
              peg$currPos += bc[ip + 1];
              ip += 2;
              break;

            case 18:
              stack.push(peg$consts[bc[ip + 1]]);
              peg$currPos += peg$consts[bc[ip + 1]].length;
              ip += 2;
              break;

            case 19:
              stack.push(peg$FAILED);
              if (peg$silentFails === 0) {
                peg$fail(peg$consts[bc[ip + 1]]);
              }
              ip += 2;
              break;

            case 20:
              peg$reportedPos = stack[stack.length - 1 - bc[ip + 1]];
              ip += 2;
              break;

            case 21:
              peg$reportedPos = peg$currPos;
              ip++;
              break;

            case 22:
              params = bc.slice(ip + 4, ip + 4 + bc[ip + 3]);
              for (i = 0; i < bc[ip + 3]; i++) {
                params[i] = stack[stack.length - 1 - params[i]];
              }

              stack.splice(
                stack.length - bc[ip + 2],
                bc[ip + 2],
                peg$consts[bc[ip + 1]].apply(null, params)
              );

              ip += 4 + bc[ip + 3];
              break;

            case 23:
              stack.push(peg$parseRule(bc[ip + 1]));
              ip += 2;
              break;

            case 24:
              peg$silentFails++;
              ip++;
              break;

            case 25:
              peg$silentFails--;
              ip++;
              break;

            default:
              throw new Error("Invalid opcode: " + bc[ip] + ".");
          }
        }

        if (ends.length > 0) {
          end = ends.pop();
          ip = ips.pop();
        } else {
          break;
        }
      }

      return stack[0];
    }

    peg$result = peg$parseRule(peg$startRuleIndex);

    if (peg$result !== peg$FAILED && peg$currPos === input.length) {
      return peg$result;
    } else {
      if (peg$result !== peg$FAILED && peg$currPos < input.length) {
        peg$fail({ type: "end", description: "end of input" });
      }

      throw peg$buildException(null, peg$maxFailExpected, peg$maxFailPos);
    }
  }

  return {
    SyntaxError: SyntaxError,
    parse:       parse
  };
})();
},{}],11:[function(require,module,exports){

// INHERITED methods&properties postproccessing. Optional

//@method postProccessInherited calculates inherited methods&properties and put it in class'properties inheritedMethods and inheritedProperties
JsDocMaker.prototype.postProccessInherited = function()
{
	var self = this;
	_(self.data.classes).each(function(c)
	{
		c.inherited	= c.inherited || {}; 
		var inheritedData = {}; 

		c.inherited.methods = c.inherited.methods || {};
		self.extractInherited(c, c.extends, 'method', inheritedData);
		_(c.inherited.methods).extend(inheritedData); 

		inheritedData = {}; 
		c.inherited.properties = c.inherited.properties || {};
		self.extractInherited(c, c.extends, 'property', inheritedData);
		_(c.inherited.properties).extend(inheritedData); 

		inheritedData = {}; 
		c.inherited.events = c.inherited.events || {};
		self.extractInherited(c, c.extends, 'event', inheritedData);
		_(c.inherited.events).extend(inheritedData); 
	});
};

//@method extractInherited @param baseClass @param c @param what @para data
JsDocMaker.prototype.extractInherited = function(baseClass, c, what, data)
{
	var self = this;
	if(!c || c.nativeTypeUrl)
	{
		return;
	}
	what = what || 'method'; 
	if(what === 'method')
	{		
		_(c.methods).each(function(method, name)
		{
			baseClass.methods = baseClass.methods || {};
			if(!baseClass.methods[name])
			{
				data[name] = method;
				// TODO: here we can act and clone the inherited nodes and add more info about the owner
				// data[name].inherited = true; 
				// data[name].inheritedFrom = c; 
			}
		});
	}
	else if(what === 'property')
	{
		_(c.properties).each(function(p, name)
		{
			baseClass.properties = baseClass.properties || {};
			if(!baseClass.properties[name])
			{
				data[name] = p;
				// TODO: here we can act and clone the inherited nodes and add more info about the owner
				// data[name].inherited = true; 
				// data[name].inheritedFrom = c; 
			}
		});
	}
	else if(what === 'event')
	{
		_(c.events).each(function(p, name)
		{
			baseClass.events = baseClass.events || {};
			if(!baseClass.events[name])
			{
				data[name] = p;
				// TODO: here we can act and clone the inherited nodes and add more info about the owner	
				// data[name].inherited = true; 
				// data[name].inheritedFrom = c; 
			}
		});
	}

	if(c.extends && c !== c.extends) //recurse!
	{
		self.extractInherited(baseClass, c.extends, what, data);
	}
};

//@method isClassOwner utility method for knowing if a property is defined in given class or is inherithed
//@static @param aClass @param prop
JsDocMaker.classOwnsProperty = function(aClass, prop)
{
	var result = prop.absoluteName && aClass.absoluteName && prop.absoluteName.indexOf(aClass.absoluteName) === 0; 
	return result;
}; 

},{}],12:[function(require,module,exports){
// this should be commented
// it is an exmaple of a plugin that parse literal types like @param {#obj({p1:P1,p2:P2,...})} param1

// CUSTOM TPE PLUGIN literalObjectParse - requires literalObjectParser.js - it adds support 
// for the custom type syntax #obj({p1:P1,p2:P2,...})to express literal objects
// syntax: {#obj(prop1:String,prop2:Array<Apple>)}
// DEPRECATED - turn it into a unit test showing an  example of plugin 
// @method literalObjectParse
JsDocMaker.prototype.literalObjectParse = function(s, baseClass)
{
	var parsed = null
	,	self=this
	,	properties = {};
	try
	{
		var result  = JsDocMaker.parseLiteralObjectType('{' + s + '}');
		_(result).each(function(value, key)
		{
			var valueBinded = self.bindParsedType(value, baseClass);
			properties[key] = valueBinded; 
		}); 
	}
	catch(ex)
	{
		JsDocMaker.prototype.error('Failed to parse literal object ' + s);
		throw ex;
	}
	return {
		name: 'Object'
	,	properties: properties
	,	propertiesOriginal: parsed
	}; 
};

JsDocMaker.prototype.literalObjectInstall = function()
{	
	this.typeParsers = this.typeParsers || {}; 
	var parser = {
		name: 'obj'
	,	parse: _(this.literalObjectParse).bind(this)
	};
	this.registerTypeParser(parser); 
}; 


},{}],13:[function(require,module,exports){
'strict mode'; 

var JsDocMaker = require('../core/main.js'); 

require('./native-types.js'); 
require('./modifiers.js'); 
require('./inherited.js');
require('./util.js');
require('./literal-object.js');

module.exports = JsDocMaker; 
},{"../core/main.js":3,"./inherited.js":11,"./literal-object.js":12,"./modifiers.js":14,"./native-types.js":15,"./util.js":16}],14:[function(require,module,exports){

//MODIFIERS postproccessing- like static, private, final. Optional module

//@property {Array<String>}MODIFIERS @static
JsDocMaker.MODIFIERS = ['static', 'private', 'final', 'deprecated', 'experimental', 'optional', 'abstract']; 
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

},{}],15:[function(require,module,exports){

// NATIVE TYPES LINKING / post processing. Optional

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

},{}],16:[function(require,module,exports){

//@method recurseAST An utility method that can be used in extensions to visit all the ast nodes with given function 
//@param {Function} fn
JsDocMaker.prototype.recurseAST = function(fn)
{
	var self = this;
	_(self.data.classes).each(function(c)
	{
		_(c.methods).each(function(m)
		{
			fn.apply(m, [m]); 
			//TODO: params
		}); 

		_(c.properties).each(function(p)
		{
			fn.apply(p, [p]); 
		}); 
		//TODO: events
	});
	_(self.data.modules).each(function(m)
	{
		fn.apply(m, [m]); 
	});
}; 


},{}]},{},[9]);
