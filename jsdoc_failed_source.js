

//@filename {Foo} fileName src/jsdocmaker/core/binding.js

// @module shortjsdoc @class JsDocMaker
var JsDocMaker = require('./class'); 
var _ = require('underscore'); 

// BINDING / post processing

//@class TypeBinding a datatype with an association between types names in source code and parsed class nodes. 
//It support generic types (recursive)
//@property {TypeBinding} type
//@property {Array<TypeBinding>} params - the generic types params array. For example the params for {Map<String,Apple>} is [StringBynding]
//@property {Object<String,TypeBinding>} properties - the properties literal object declaration binding, {a:A,b:B}
//@property {String} nativeTypeUrl the url for native type only


//@class JsDocMaker
//@method parseTypeString public, do a type binding @return {TypeBinding} the object binding to the original r
//eferenced AST node. Or null in case the given type cannot be parsed
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
	// console.log('parseTypeString', ret)
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
					self.error('Invalid Custom Type: '+typeString, ', baseClass: ', (baseClass && baseClass.absoluteName)); 
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
				self.error('Invalid Type: '+typeString, ', baseClass: ', (baseClass && baseClass.absoluteName)); 
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
				self.error('Invalid Type: '+typeString, ', baseClass: ', (baseClass && baseClass.absoluteName)); 
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
	var c = null
	,	out = typeObject
	,	self = this;

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



var PluginContainer = require('./plugin'); 



//POST PROCESSING

// @property {PluginContainer} beforeBindClassPlugins these plugins accept an object like 
// {name:name,baseClass:JsDocASTNode,jsdocmaker:JsDocMaker} and perform some modification to passed node:parsed instance.
// This is done just before a class name is binding to an actual AST class node.
JsDocMaker.prototype.beforeBindClassPlugins = new PluginContainer(); 

// @property {PluginContainer} afterBindClassPlugins these plugins accept an object like 
// {name:name,baseClass:JsDocASTNode,jsdocmaker:JsDocMaker} and perform some modification to passed node:parsed instance.
// This is done just after a class name is binding to an actual AST class node.
JsDocMaker.prototype.afterBindClassPlugins = new PluginContainer(); 



//@method bindClass @param {String}name @param {Object} baseClass
//TODO: using a internal map this could be done faster
JsDocMaker.prototype.bindClass = function(name, baseClass)
{
	var context = {
		name:name
	,	baseClass: baseClass
	,	jsdocmaker: this
	}; 

	this.beforeBindClassPlugins.execute(context); 

	// beforeBindClassPlugins have the oportunity of changing the context
	name = context.name || name;
	baseClass = context.baseClass || baseClass;

	var moduleName = baseClass.annotation === 'module' ? baseClass.name : baseClass.module.name; 
	
	//search all classes that matches the name
	var classesWithName = _(_(this.data.classes).values()).filter(function(c)
	{
		return c.name===name;//JsDocMaker.stringEndsWith(c.name, name); 
	});
	//search classes of the module
	var moduleClasses = _(classesWithName).filter(function(c)
	{
		return JsDocMaker.startsWith(c.module.name, moduleName); 
	}); 

	//TODO: performance - classesWithName could be compauted only if moduleClasses is empty

	var c = moduleClasses.length ? moduleClasses[0] : classesWithName[0]; 

	if(!c)
	{
		//then it could be a function
		var fns = []
		_.each(this.data.modules, function(module)
		{
			_.each(module.functions, function(fn)
			{
				if(fn.name===name)
				{
					fns.push(fn)
				}
			})
		});
		if(fns.length)
		{
			c = fns[0]
		}
	}

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
		c = o;		
	}

	this.afterBindClassPlugins.execute({name:name, binded: c, baseClass: baseClass, jsdocmaker: this});

	return c;

}; 

// @method simpleName @param {String} name @return {String}
JsDocMaker.prototype.simpleName = function(name, prefix)
{
	if(prefix && name.indexOf(prefix) === 0)
	{
		return name.substring(prefix.length + 1, name.length);
	}
	else
	{	
		var a = name.split(JsDocMaker.ABSOLUTE_NAME_SEPARATOR);
		return a[a.length - 1]; 	
	}
}; 








//@filename {Foo} fileName src/jsdocmaker/core/class.js

// @module shortjsdoc @class JsDocMaker
// Main jsdoc parser utility. It accepts a valid js source code String and returns a JavaScript object with a jsdoc AST, this is an object
// with classes and modules array that users can use to easily access jsdocs information, for example, parsed.classes.Apple.methods.getColor
// use the parseFile method for this! This will return the AST, if you want to perform more enrichment and type binding, then use 
// postProccess and postProccessBinding methods after.

/* jshint evil:true*/

var _ = require('underscore'); 

var JsDocMaker = function(options)
{	
	//@property {Object<String,String>} customNativeTypes name to url map that the user can modify to register new native types b givin its url.
	this.customNativeTypes = this.customNativeTypes || {};
	this.annotationRegexp = /(\s+@\w+)/gi;
	this.typeParsers = {};
	this.inputSource = [];
	this.options = options || {};

	if(this.initializePluginContainers)
	{
		this.initializePluginContainers();
	}
}; 

// @property {String} DEFAULT_CLASS @static
JsDocMaker.DEFAULT_CLASS = 'Object'; 

// @property {String} DEFAULT_MODULE @static
JsDocMaker.DEFAULT_MODULE = '__DefaultModule'; 

// @property {String} ABSOLUTE_NAME_SEPARATOR @static
JsDocMaker.ABSOLUTE_NAME_SEPARATOR = '.'; 

// @property {String} MULTIPLE_TEXT_SEPARATOR @static
JsDocMaker.MULTIPLE_TEXT_SEPARATOR = '\n\n'; 

//expose
if(typeof(window) !== 'undefined')
{
	window.JsDocMaker = JsDocMaker; 
}


//@method require perform an intelligent require n browser&nodejs, needed for esprima. Ugly :(
JsDocMaker.require = function(name)
{
	return (typeof(window) != 'undefined' && window[name]) ? window[name] : require(name);
}; 

module.exports = JsDocMaker; 

//@filename {Foo} fileName src/jsdocmaker/core/main.js

'strict mode'; 

var JsDocMaker = require('./class'); 

require('./util'); 

require('./parse'); 

require('./preprocess'); 

require('./type-parsing'); 

require('./postprocess'); 

require('./binding'); 


module.exports = JsDocMaker;

//@filename {Foo} fileName src/jsdocmaker/core/parse.js

/*
@module shortjsdoc 

@class JsDocMaker.Data
@property {Object<String, JsDocASTNode>} methods
@property {Object<JsDocASTNode>} classes
@property {Array<JsDocASTNode>} classes

@class JsDocASTNode all the jsdoc parsed information is stored as nodes one containing others. modules contains classes, @class contains methods and @method contains @param and @returns


@class JsDocMaker

#Parsing and processing 

The first thing done with source code is parsing its comments to extract general information about annotations. This implies

 * parse the sources with exprima and work with the comments array.
 * preprocess the comments array for normalization before start parsing them. Call preprocessing plugins. 
 * iterate the comments text and split using PRIMARY annotations

##Primary annotations
For representing some logic of JSDOC like 'a class contains methods that contains parameters' we have the concept of PRIMARY ANNOTATIONS. 
*These are @class @module @method @property*

These are the concepts that contains the stuff. All the other annotations are children of one primary annotation. For example @return, @param, @extend, @static are SECOND LEVEL ANNOTATIONS
and are always children of one primary annotation.

But this is the only logic contained in the core parsing. Then a general AST, using this primary container names logic, is returned. 

ALL declared annotations will be outputed (unless a plugin remove something)

*/


var JsDocMaker = require('./class'); 
var PluginContainer = require('./plugin'); 
var esprima = JsDocMaker.require('esprima');
var _ = require('underscore'); 


// @property {PluginContainer} allCommentPreprocessorPlugins these plugins accept an object like 
// {node:parsed:jsdocmaker:self} and perform some modification to esprima comment node - 
// this is the FIRST stage of the parser. This is the same as commentPreprocessorPlugins but all comments nodes are passed for those plugins that need some context about the comments. 
JsDocMaker.prototype.allCommentPreprocessorPlugins = new PluginContainer(); 

// @property {PluginContainer} commentPreprocessorPlugins these plugins accept an object like 
// {node:parsed:jsdocmaker:self} and perform some modification to esprima comment node - this is the FIRST stage of the parser
JsDocMaker.prototype.commentPreprocessorPlugins = new PluginContainer(); 

// @property {PluginContainer} beforeParseNodePlugins these plugins accept an object like 
// {node:parsed:jsdocmaker:self} and perform some modification to passed node:parsed instance.
// This is done just before the first parsing is done on the first AST node. Only primary nodes are visited!
JsDocMaker.prototype.beforeParseNodePlugins = new PluginContainer(); 

// @property {PluginContainer} parsePreprocessors these plugins accept an object like 
// {node:parsed:jsdocmaker:self} and perform some modification to passed node:parsed instance.
// This is done just after the first parsing is done on the first AST node. Only primary nodes are visited!
JsDocMaker.prototype.afterParseNodePlugins = new PluginContainer();

// @property {PluginContainer} afterParseUnitSimplePlugins these plugins accept an object like 
// {node:parsed:jsdocmaker:self} and perform some modification to passed node:parsed instance.
// This is done after an unit is parsed - this will iterated all nodes as units .The first node object is formed at this stage. 
JsDocMaker.prototype.afterParseUnitSimplePlugins = new PluginContainer();

// @property {String}primaryAnnotationsRegexString
JsDocMaker.prototype.primaryAnnotationsRegexString = '((?:@class)|(?:@method)|(?:@property)|(?:@attribute)|(?:@module)|(?:@event)|(?:@constructor)|(?:@function)|(?:@interface)|(?:@filename))';

JsDocMaker.prototype.isPrimaryAnnotation = function(s)
{
	if(s.indexOf('@')!==0)
	{
		s = '@' + s; 
	}
	return new RegExp('^'+this.primaryAnnotationsRegexString, 'g').test(s);
}


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
	this.data.files = this.data.files || {}; 

	self.allCommentPreprocessorPlugins.execute({node: self.comments, jsdocMaker: self}); 

	_(self.comments).each(function(node)
	{
		self.commentPreprocessorPlugins.execute({node: node, jsdocMaker: self}); 

		//because is global we must instantiate this regex each time
		var regex = new RegExp(self.primaryAnnotationsRegexString, 'gi');

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
				parsed.fileName = (currentFile && currentFile.fileName) ? currentFile.fileName : undefined;

				delete parsed.theRestString; 
				
				self.beforeParseNodePlugins.execute({node:parsed, jsdocmaker:self}); 

				//Note: the following lines is the (only) place were the 'primary annotations' (class,module,method,property) are implemented 
				//We get primary tags like class,module,method,property and form the first primary AST (a module contains classes which contain methods and properties)
				//All the other annotations are treated as secondary, this means they will be assigned as childresn to the last primary annotation.

				if(parsed.annotation === 'class'||parsed.annotation === 'interface') 
				{
					//allow classes without modules - asignated to a defulat module
					if (!currentModule)
					{
						currentModule = {name: JsDocMaker.DEFAULT_MODULE};
					}

					parsed.module = currentModule; 
					parsed.absoluteName = currentModule.name + JsDocMaker.ABSOLUTE_NAME_SEPARATOR + parsed.name;

					//if the class was already defined we want to preserve all the definitions children and texts 
					if(self.data.classes[parsed.absoluteName])
					{
						//preserve text
						if(self.data.classes[parsed.absoluteName].text !== parsed.text)
						{
							self.data.classes[parsed.absoluteName].text += JsDocMaker.MULTIPLE_TEXT_SEPARATOR + parsed.text; 
						}

						// preserve children
						self.data.classes[parsed.absoluteName].children = self.data.classes[parsed.absoluteName].children || [];
						_(parsed.children).each(function(classPreservedChild)
						{
							var originalChild = _(self.data.classes[parsed.absoluteName].cihldren).find(function(c2)
							{
								return c2.annotation===classPreservedChild.annotation; 
							}); 
							if(!originalChild)
							{
								self.data.classes[parsed.absoluteName].children.push(classPreservedChild); 
							}
						});

						
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
					delete parsed.text;
					self.data.files[currentFile.fileName] = currentFile;
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


				else if(parsed.annotation === 'function' && currentModule)
				{
					currentModule.functions = currentModule.functions || [];
					currentModule.functions.push(parsed); 
					currentMethod = parsed; // heads up - so future @params and @returns are assigned to this function
				}

				//? @property and @event and @attribute are treated similarly
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
				else if(parsed.annotation === 'attribute' && currentClass)
				{
					currentClass.attributes = currentClass.attributes || {};
					currentClass.attributes[parsed.name] = parsed;
				}

				self.afterParseNodePlugins.execute({
					node: parsed
				,	jsdocmaker: self
					//add loop context information to plugins
				,	currentClass: currentClass
				,	currentMethod: currentMethod
				,	currentModule: currentModule
				,	currentFile: currentFile
				});
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

	// HEADS UP - TODO: the fgollowing two regex definitions must be identical in the content but not perhasin the endings/begginigns / globals
	// if you fix one you must also fix the other
	if(comment.type==='Line')
	{
		str = JsDocMaker.stringFullTrim(str); 
		regexp = /\s*@([\w\.\-\_]+)\s*(\{[\w<>\|, #:\(\)\.]+\}){0,1}\s*([\w:\-\._\$]+){0,1}(.*)\s*/i; 
		result = regexp.exec(str);
	}
	else
	{
		str = JsDocMaker.stringTrim(str); 
		regexp = /\s*@([\w\.\-\_]+)\s*(\{[\w<>\|, #:\(\)\.]+\}){0,1}\s*([\w:\-\._\$]+){0,1}([.\s\w\W]*)/gmi;
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
	//@property {String} lineCommentSeparator used to separate each Line comment type text
	this.lineCommentSeparator = this.lineCommentSeparator || '\n';
	text = text.replace(new RegExp(this.lineCommentSeparatorMark, 'g'), this.lineCommentSeparator);
	text = JsDocMaker.stringTrim(text||'')
	splitted.splice(0,1); 
	var ret = {
		annotation: result[1]
	,	type: result[2]
	,	name: result[3]
	,	text: text
	,	theRestString: JsDocMaker.stringTrim(splitted.join(''))
	};

	this.afterParseUnitSimplePlugins.execute({node:ret, jsdocmaker:this}); 

	return ret;
}; 



// at last we want to document the output ast data that the parser returns:

// @property {JsDocMaker.Data} data the main data on which the parser and plugins will be working on. This is the resulting AST of jsdoc.


//@filename {Foo} fileName src/jsdocmaker/core/plugin.js

// @module shortjsdoc.plugin
var JsDocMaker = require('./class')
,	_ = require('underscore'); 

// @class PluginContainer a plugin container can be used for installing plugins and then processing 
// some action with all of them, executing them in sequence.
// A plugin is basically a function that acts on some data - state
// Registered plugins are executed secuentially. plugin execution arguments can be modified so next-to-execute plugin can 
// consume new information - same with return value.
var PluginContainer = function()
{
	this.plugins = [];
};

//expose
JsDocMaker.PluginContainer = PluginContainer; 

//@method add @param {JsDocMakerPlugin} plugin
PluginContainer.prototype.add = function(plugin)
{
	this.plugins.push(plugin); 
	this.priorized = null;//clean priorized cache
}; 

//TODO: remove(plugin)

// @method execute @param {Object} @param {Any} input options @return {Any}
PluginContainer.prototype.execute = function(options, input)
{
	var result = null;
	this.visitPlugins(function(plugin)
	{
		result = plugin.execute(options, result);
	}); 
	return result; 
}; 

//@method visitPlugins visit children plugins respecting priority @param {Function} visitor
PluginContainer.prototype.visitPlugins = function(visitor)
{
	// @property {Array<Array<Plugin>>} priorized array of priorities - each priority index contains the plugins with that priority
	var priorized = this.priorized;// = (this.priorized || [1]); //priority calculations cache

	if(!priorized)
	{
		priorized = this.priorized = []; 
		for (var i = 0; i < PluginContainer.MAX_PRIORITY; i++) 
		{
			priorized[i] = []; 
		};
		_(this.plugins).each(function(plugin)
		{
			// visitor(plugin); 
			var p = plugin.priority || PluginContainer.DEFAULT_PRIORITY; // priority zero is invalid and it is treated as default
			// priorized[p] = priorized[p] || []; 
			priorized[p].push(plugin); 
		}); 
	}

	for (var i = 1; i < priorized.length; i++) 
	{
		var p = priorized[i]; 
		for (var j = 0; j < p.length; j++) 
		{
			visitor(p[j]);
		};
	};
}; 

PluginContainer.DEFAULT_PRIORITY = 6; 
PluginContainer.MAX_PRIORITY = 10; 

// TODO: priority



// @class JsDocMakerPlugin
// @property {String} name
// @method execute execute this plugin @param{Object}options @param {Any}result 
// @returns{Any} result possible enriched by the plugin in the chain

module.exports = PluginContainer;






//@method globalPlugins @static
// JsDocMaker.registerGlobalPlugin = function(pluginContainerName, plugin)
// {
// 	JsDocMaker.prototype.plugins = JsDocMaker.prototype.plugins || {};
// 	JsDocMaker.globalPlugins[pluginContainerName] = JsDocMaker.globalPlugins[pluginContainerName] || {}; 
// }; 
// //@method initializePluginContainers called in the constructor - will install all static plugins registered with JsDocMaker.registerGlobalPlugin
// JsDocMaker.prototype.initializePluginContainers = function()
// {
// }





//@filename {Foo} fileName src/jsdocmaker/core/postprocess.js

// @module shortjsdoc @class JsDocMaker
var JsDocMaker = require('./class'); 
var _ = require('underscore'); 
var PluginContainer = require('./plugin'); 

//POST PROCESSING

// @property {PluginContainer} beforeTypeBindingPlugins these plugins accept an object like 
// {node:parsed:jsdocmaker:self} and perform some modification to passed node:parsed instance.
// This is done just before doing the type binding.
JsDocMaker.prototype.beforeTypeBindingPlugins = new PluginContainer(); 

// @property {PluginContainer} afterTypeBindingPlugins these plugins accept an object like 
// {node:parsed:jsdocmaker:self} and perform some modification to passed node:parsed instance.
// This is done just after doing the type binding.
JsDocMaker.prototype.afterTypeBindingPlugins = new PluginContainer(); 

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
		_(c.constructors).each(function(co)
		{
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

	_(self.data.modules).each(function(m)
	{
		self.beforeTypeBindingPlugins.execute({node: m, jsdocmaker: self});
		self._postProccessBinding_methodSetup(m.functions, m, true);
	});
	
	//at this points we have all our modules and classes - now we normalize extend, methods and params and also do the type binding. 
	_(self.data.classes).each(function(c)
	{
		self.beforeTypeBindingPlugins.execute({node: c, jsdocmaker: self});
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

		var implement = _(c.children||[]).filter(function(child)
		{
			return child.annotation === 'implement' || child.annotation === 'implements'; 
		}) || []; 
		if(!implement.length) // All classes must implement something
		{
			implement = c.implements = []//[(self.bindClass(JsDocMaker.DEFAULT_CLASS, c) || {error: 'NAME_NOT_FOUND', name: JsDocMaker.DEFAULT_CLASS})];
		}
		else 
		{
			c.implements = c.implements || [];
			_.each(implement, function(i)
			{
				c.implements.push(self.bindClass(i.name, c));
				c.children = _(c.children).without(i);	//TODO: why we would want to do this? - remove this line
			})
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

		self._postProccessBinding_methodSetup(methods, c);		

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

			self.beforeTypeBindingPlugins.execute({node: prop, jsdocmaker: self});
		}; 
		_(c.properties).each(propertySetup);
		_(c.events).each(propertySetup);
		_(c.attributes).each(propertySetup);		
	});

	self.afterTypeBindingPlugins.execute({jsdocmaker: self});
};

JsDocMaker.prototype._postProccessBinding_methodSetup = function(methods, c, isFunction)
{
	var self = this;
	c = c || {}; 
	_(methods).each(function(method)
	{
		self.beforeTypeBindingPlugins.execute({node: method, jsdocmaker: self});
		//method.param property
		var params = _(method.children||[]).filter(function(child)
		{
			child.text = JsDocMaker.stringTrim(child.text||''); 
			return child.annotation === 'param'; 
		}); 
		method.params = params; 

		var absoluteName = c.absoluteName || c.name || '';
		if(!isFunction)
		{
			method.ownerClass = absoluteName;	
		}
		else
		{
			method.ownerModule = absoluteName;
		}		
		method.absoluteName = absoluteName + JsDocMaker.ABSOLUTE_NAME_SEPARATOR + method.name; 

		_(method.params).each(function(param)
		{
			self.beforeTypeBindingPlugins.execute({node: param, jsdocmaker: self});

			if(_(param.type).isString())
			{
				param.typeOriginalString = param.type; 
				param.type = self.parseTypeString(param.type, c) || param.type;						
			}
		}); 

		//method throws property
		var throw$ = _(method.children||[]).filter(function(child)
		{
			return child.annotation === 'throw' || child.annotation === 'throws'; 
		}); 
		method.throws = throw$; 
		_(method.throws).each(function(t)
		{
			self.beforeTypeBindingPlugins.execute({node: t, jsdocmaker: self});

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
			self.beforeTypeBindingPlugins.execute({node: child, jsdocmaker: self});
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
};

//@filename {Foo} fileName src/jsdocmaker/core/preprocess.js

/* @module shortjsdoc

#Comment Preprocessors

The core of comment preprocessing is done ba couple of plugins executed at allCommentPreprocessorPlugins and 
ingeneral normalizes the comments text, delete non relevant comments, unify line comments into a single one, etc

*/
var JsDocMaker = require('./class'); 
var _ = require('underscore'); 

//COMMENT PREPROCESSORS

//@class PreprocessCommentsPlugin1 @extends JsDocMakerPlugin  this plugin is registered in JsDocMaker.prototype.allCommentPreprocessorPlugins plugin container
// and do an initial preprocesing on the comments erasing those marked comments to be ignored, and fixing its text to support alternative syntax.
var preprocessCommentsPlugin1 = {
	name: 'preprocessCommentsPlugin1'
,	execute: function(options)
	{
		var comments = options.node;
		//we do the parsing block by block,
		for (var i = 0; i < comments.length; i++) 
		{
			var node = comments[i];//options.node; 
			node.value = node.value || ''; 

			// fix styled comment blocks with '*' as new line prefix
			// if(node.type === 'Block')
			// {
			// 	// Note: syntax /** - not necesary to implement
			// 	debugger
			// 	node.value = node.value.replace(/\n \*/gi, '\n');
			// }

			// remove comments that starts with ignoreCommentPrefix
			if(JsDocMaker.startsWith(JsDocMaker.stringTrim(node.value), options.jsdocMaker.ignoreCommentPrefix))
			{
				//if \n * is detected it is fixed to not count the decorative '*'
				comments.splice(i, 1); //remove this node
			}
		}
	}
} ; 

//install it as comment preprocessor plugin!
JsDocMaker.prototype.allCommentPreprocessorPlugins.add(preprocessCommentsPlugin1);//.push(JsDocMaker.prototype.preprocessComments); 


//@class FixUnamedAnnotationsPlugin @extends JsDocMakerPlugin This plugin is installed at JsDocMaker.prototype.commentPreprocessorPlugins and and solves the following problem: 
//Our regexp format expect an anotation with a name. So for enabling unamed annotations we do this dirty fix, this is add a name to precondition
var fixUnamedAnnotationsPlugin = {
	name: 'fixUnamedAnnotationsPlugin'
,	priority: 3
,	execute: function(options)
	{
		var node = options.node;
		if(node.value)
		{
			node.value = node.value.replace(/@constructor/gi, '@constructor n'); 
			node.value = node.value.replace(/(@\w+)\s*$/gi, '$1 dummy ');
			node.value = node.value.replace(/(@\w+)\s+(@\w+)/gi, '$1 dummy $2');
		}
	}
}; 
//install it as comment preprocessor plugin!
JsDocMaker.prototype.commentPreprocessorPlugins.add(fixUnamedAnnotationsPlugin); 

//@class UnifyLineCommentsPlugin @extends JsDocMakerPlugin this is a very important plugin for normalize our js input Line comments 
// It is executed at JsDocMaker.prototype.allCommentPreprocessorPlugins
var unifyLineCommentsPlugin = {
	name: 'unifyLineCommentsPlugin'
,	execute: function(options)
	{
		var i = 0
		,	comments = options.node
		,	jsdocMaker = options.jsdocMaker; 
	
		jsdocMaker.lineCommentSeparatorMark = '_lineCommentSeparatorMark_';
		while(i < comments.length - 1)
		{
			var c = comments[i]
			,	next = comments[i+1]; 

			var sss = JsDocMaker.stringFullTrim(options.jsdocMaker.data.source.substring(c.range[1], next.range[0])); 
			if (c.type==='Line' && next.type==='Line' && !sss)
			{
				c.value += ' ' + jsdocMaker.lineCommentSeparatorMark + ' ' + next.value; 
				c.range[1] = next.range[1]; 
				comments.splice(i+1, 1); 
			}
			else
			{
				i++;
			}
		}
	}
}; 
JsDocMaker.prototype.allCommentPreprocessorPlugins.add(unifyLineCommentsPlugin); 



//@filename {Foo} fileName src/jsdocmaker/core/type-parsing.js

/* jshint evil:true */
// @module shortjsdoc @class JsDocMaker
var JsDocMaker = require('./class'); 
var shortjsdocParseLiteralObject = require('../objectTypeParser/parser.js');
var _ = require('underscore'); 

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



//@filename {Foo} fileName src/jsdocmaker/core/util.js

// @module shortjsdoc @class JsDocMaker
var JsDocMaker = require('./class'); 
var _ = require('underscore'); 

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

//@method error @param {String}msg
JsDocMaker.prototype.error = function(msg)
{
	console.error('Error detected: ' + msg); 
	// throw msg;
}; 


// JsDocMaker.getChildren = function(node, compareProperties)
// {
// 	var a = []
// }; 
// JsDocMaker.getAChildren = function(node, compareProperties)
// {
// 	var c = JsDocMaker.getChildren(node, compareProperties);
// 	return (c && c.length) ? return c[0] : null;
// }; 

//@filename {Foo} fileName src/jsdocmaker/main.js

var JsDocMaker = require('./core/main'); 

require('./plugin/main.js'); 

module.exports = JsDocMaker;

//@filename {Foo} fileName src/jsdocmaker/objectTypeParser/parser.js

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

//@filename {Foo} fileName src/jsdocmaker/plugin/alias.js

// @module shortjsdoc.plugin.alias 
/*
#Alias plugin

this plugin allow to define an alias for annotations and classes. This means we can add name 
alias to annotations or classes. Alias can override previous defined ones. 

##Class alias

Class alias can be used to shortcut class names, like 

	@alias class A Array
	@alias class O Object
	@alias class S String
	@alias class N Number
	@alias class B Boolean

Or just use the shortcut

	@alias class A Array O Object S String

After this I just can write my types like this:

	@property {config:O<S,N>,tools:A<Tool>} complex

Note that these plugins perform two tasks using two different plugins: 
1) replace aliases initial annotation with original ones on parsing - the plugin runs on beforeParseNodePlugins
2) but also perform the aliasing on type binding. This is done on beforeBindClassPlugins

IMPORTANT. alias to complex types are not supported, only alias to simple types. The following is WRONG: @alias class MySuper Array<Leg>

##annotation alias
@alias annotation task method

##Implementation notes

at preprocessing the alias meta information will be stored in the AST under the 'alias' property. 
Then this information will be consumed at binding time in the second plugin

*/


var JsDocMaker = require('../core/class'); 
var _ = require('underscore'); 

//@class AliasBeforeParseNodePlugin @extends JsDocMakerPlugin a plugin executed at afterParseUnitSimplePlugins. Responsible of TODO 
var aliasBeforeParseNodePlugin = {

	name: 'alias'

,	execute: function(options)
	{
		var node = options.node
		,	context = options.jsdocmaker.data
		,	self = this;

		context.alias = context.alias || {}; 


		var aliasList = []; //its a list because node can have many alias children inside. alias is a second-level AST node
			
		if (node.annotation=='alias')
		{			
			aliasList = [node];
		}
		else 
		{
			aliasList = _(node.children).select(function(c)
			{
				return c.annotation=='alias';
			});
		}

		_(aliasList).each(function(alias)
		{
			self.parseAlias(alias, context, true); 
		}); 

		//TODO: remove the alias node from comments array ? 
		
	}

	//@method parseAlias @return {JSDocASTNode} the enhanced node with property *alias* enhanced
	//@param {JSDocASTNode} alias @param {JsDocMaker} context @param {Boolean} install  @return {Array<JSDocASTNode>} contained in the annotation text.
,	parseAlias: function(alias, context, install)
	{
		if(!alias)
		{
			return;
		}
		var a = alias.text.split(/\s+/)
		,	parsed = [];
		for (var i = 0; i < a.length; i+=2) 
		{
			var o = {type: alias.name, name: a[i], target: a[i+1]};
			parsed.push(o); 
			if(install)
			{
				context.alias[o.name] = o;

			}
		}
		return parsed;
	}
}; 



JsDocMaker.prototype.afterParseUnitSimplePlugins.add(aliasBeforeParseNodePlugin); 

//@class AliasBeforeBindClassPlugin @extends JsDocMakerPlugin a plugin executed at afterParseUnitSimplePlugins. Responsible of TODO 
var aliasBeforeBindClassPlugin = {
	name: 'aliasAfterTypeBindingPlugin'

	//@param {name:name, baseClass: baseClass, jsdocmaker: this} context  this plugin has the change of chainging the context.
,	execute: function(context)
	{
		context.jsdocmaker.data.alias = context.jsdocmaker.data.alias || {}; 
		var alias = context.jsdocmaker.data.alias[context.name]; 

		if(alias)
		{
			context.name = alias.target; //alias only sypport targetting single types!
		}
	}
}; 

JsDocMaker.prototype.beforeBindClassPlugins.add(aliasBeforeBindClassPlugin); 

//@class annotationAliasPlugin @extends JsDocMakerPlugin a plugin executed at commentPreprocessorPlugins. Responsible of TODO 
var annotationAliasPlugin = {
	execute: function(options)
	{
		var alias = {}
		var regex = /@alias\s+annotation\s+([\w\-_\.]+)\s+([\w\-_\.]+)/gi; //TODO: the core should provide this regex
		options.node.value.replace(regex, function(s, newName, targetName)
		{
			alias[newName] = targetName;
		});
		_.each(alias, function(targetName, newName)
		{
			var newNameRegex = new RegExp('@'+newName, 'gi');
			options.node.value = options.node.value.replace(newNameRegex, '@'+targetName);
		});
	}
}
JsDocMaker.prototype.commentPreprocessorPlugins.add(annotationAliasPlugin);


//@filename {Foo} fileName src/jsdocmaker/plugin/comment-indentation.js

/*
@module shortjsdoc.plugin.comment.indentation 
#Comment indentation plugin
Takes care of respecting the original indentation of block comments. 
It will erase the initial spaces of each line according to the comment indentation.
*/

var JsDocMaker = require('../core/class'); 
var _ = require('underscore'); 


//@class commentIndentationPlugin @extends JsDocMakerPlugin a plugin executed at beforeParseNodePlugins. 
var commentIndentationPlugin = {

	name: 'commentIndentation'

,	execute: function(options)
	{
		if(!options.node.text)
		{
			return;
		}
		var fileSource = options.jsdocmaker.data.files[options.currentFile.fileName]
		var beforeCommentText = options.jsdocmaker.data.source.substring(0, options.node.commentRange[0]); 

		var result = /([ \t]+)$/.exec(beforeCommentText)
		,	prefix = 0;
		if(result && result.length) 
		{
			prefix = result[0];

			var a = options.node.text.split('\n'), output = [];;
			_(a).each(function(line)
			{
				var repl = line.replace(new RegExp('^'+prefix), ''); 
				// console.log(line, repl); 
				output.push(repl);
			}); 

			// TODO we are ssumming files have unix end to line. we should pre process all commments first. 
			options.node.text = output.join('\n');//replaceAll('\n' + options.node.text, prefix, ''); 
		}	
	}
}
JsDocMaker.prototype.afterParseNodePlugins.add(commentIndentationPlugin); 


// function escapeRegExp(string) 
// {
//     return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
// }
// function replaceAll(string, find, replace) 
// {
// 	var r = new RegExp(escapeRegExp(find), 'g');
// 	debugger;
// 	console.log(r)
// 	return string.replace(r, replace);
// }


//@filename {Foo} fileName src/jsdocmaker/plugin/dependencies.js

// @module shortjsdoc.plugin.dependencies 
/*
#dependencies plugin

this is not technically a plugin because we don't want to make the cmd line tool slower and is a not 
important feature. It should be executed by hand in the user agent.

*/


var JsDocMaker = require('../core/class'); 
var _ = require('underscore'); 

var Tool = function(maker, config)
{
	this.maker = maker;
	this.config = config || {}; 
}; 
_(Tool.prototype).extend({
	calculateClassDependencies: function()
	{
		var self = this
		,	currentClass
		// ,	currentModule
		,	fn = function(node)
			{
				// if(node.annotation==='module')
				// {
				// 	currentModule = node; 
				// }
				if(node.annotation==='class')
				{
					currentClass = node;
					currentClass.dependencies = currentClass.dependencies || {}; 
					currentClass.dependencies.classes = currentClass.dependencies.classes || {}; 
					if(self.config.includeExtends && currentClass.extends && 
						!_(self.config.ignoreClasses).contains(currentClass.extends.absoluteName))
					{
						currentClass.dependencies.classes[currentClass.extends.absoluteName] = currentClass.extends; 
					}
				}
				var deps = _(node.children).filter(function(c)
				{ 
					return c.annotation==='depends'; 
				});
			
				if(deps && deps.length)
				{	
					_(deps).each(function(dep)
					{
						if(dep.name==='class')
						{
							var c = self.maker.findClassByName(dep.text);
							if(!c)
							{
								console.log('warning dependency class not found: '+dep.text); 
								return;
							}

							if(_(self.config.ignoreClasses).contains(c.absoluteName))
							{
								return;
							}
							node.dependencies = node.dependencies || {}; 
							node.dependencies.classes = node.dependencies.classes || {}; 
							node.dependencies.classes[c.absoluteName] = c; 
							if(currentClass)
							{
								currentClass.dependencies.classes[c.absoluteName] = c; 
							}
						}
						// else if(dep.name==='module') //TODO
						// { }
						// else //TOOD: make class to be the default and use name instead of text
						// { }
					}); 
				}
			}
		,	fn_type = function(type, ownerNode)
			{
				if(!currentClass || _(self.config.ignoreClasses).contains(type.absoluteName))
				{
					return; 
				}

				//when iterating types, we automatically add the type as class dependency to the currentClass
				if(type.absoluteName !== currentClass.absoluteName && 
					!_(self.config.ignoreClasses).contains(type.absoluteName))
				{
					currentClass.dependencies.classes[type.absoluteName] = type; 	
				}
			};
		this.maker.recurseAST(fn, fn_type); 
	}
});

JsDocMaker.prototype.tools = JsDocMaker.tools || {}; 
JsDocMaker.prototype.tools.DependencyTool = Tool; 

JsDocMaker.prototype.findClassByName = function(className, data)
{
	data = data || this.data;
	var c = _(data.classes).find(function(c)
	{
		return c.absoluteName===className; 
	});
	if(!c)
	{
		c = _(data.classes).find(function(c)
		{
			return c.name===className; 
		});
	}
	return c; 
}; 

//@filename {Foo} fileName src/jsdocmaker/plugin/escape-at.js

var _ = require('underscore'); 
var JsDocMaker = require('../core/class'); 
var PluginContainer = require('../core/plugin'); 

require('./recurse-plugin-containers');

var key, keyRegexp; 

var pluginBefore = {
	name: 'escape-at'
,	priority: 2
,	execute: function(options)
	{
		var node = options.node;
		if(!key)
		{
			// debugger;
			key = 'escape_at_'+_.uniqueId();
			keyRegexp = new RegExp(key, 'g'); 
		}

		node.value = (node.value||'').replace(/@@/g, key); 
	}
}; 
JsDocMaker.prototype.commentPreprocessorPlugins.add(pluginBefore);


var pluginAfter = {
	name: 'escape-at'
,	execute: function(node) 
	{
		node.text = (node.text||'').replace(keyRegexp, '@'); 
	}
}; 
JsDocMaker.prototype.afterTypeBindingRecurseASTPlugins.add(pluginAfter);





// old impl
// var plugin = {
// 	name: 'escape-at'
// ,	execute: function(node)
// 	{
// 		// debugger;
// 		node.text = (node.text||'').replace(/@@/g, '@'); 
// 	}
// }; 
// // debugger;
// JsDocMaker.prototype.afterTypeBindingRecurseASTPlugins.add(plugin);
//JsDocMaker.prototype.commentPreprocessorPlugins.add(plugin);



//@filename {Foo} fileName src/jsdocmaker/plugin/inherited.js

// @module shortjsdoc.plugin @class JsDocMaker
var JsDocMaker = require('../core/class'); 
var _ = require('underscore'); 

// TODO : turn this into a normal plugin - right now it is mixing itself in JsDocMaker
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

		inheritedData = {}; 
		c.inherited.attributes = c.inherited.attributes || {};
		self.extractInherited(c, c.extends, 'attribute', inheritedData);
		_(c.inherited.attributes).extend(inheritedData); 
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

	else if(what === 'attribute')
	{
		_(c.attributes).each(function(p, name)
		{
			baseClass.attributes = baseClass.attributes || {};
			if(!baseClass.attributes[name])
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


//@filename {Foo} fileName src/jsdocmaker/plugin/literal-object.js

// @module shortjsdoc @class JsDocMaker
var JsDocMaker = require('../core/class'); 
var _ = require('underscore'); 

//
// it is an exmaple of a plugin that parse literal types like @param {#obj({p1:P1,p2:P2,...})} param1

// CUSTOM TPE PLUGIN literalObjectParse - requires literalObjectParser.js - it adds support 
// for the custom type syntax #obj({p1:P1,p2:P2,...})to express literal objects
// syntax: {#obj(prop1:String,prop2:Array<Apple>)}
// DEPRECATED - turn it into a unit test showing an  example of plugin making. this file will be delete.
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



//@filename {Foo} fileName src/jsdocmaker/plugin/main.js

'strict mode'; 

var JsDocMaker = require('../core/main.js'); 

require('./native-types.js'); 
require('./modifiers.js'); 
require('./inherited.js');
require('./util.js');
require('./literal-object.js');
require('./module-exports.js');
require('./alias.js');
// require('./metadata.js');
require('./comment-indentation.js');

require('./text-marks.js');
require('./text-marks-references.js');

require('./recurse-plugin-containers.js');
require('./escape-at.js');

//tools
require('./dependencies.js'); //TODO: review, this probably makes compilation slower. 

module.exports = JsDocMaker; 

//@filename {Foo} fileName src/jsdocmaker/plugin/modifiers.js

// @module shortjsdoc @class JsDocMaker
var JsDocMaker = require('../core/class'); 
var _ = require('underscore'); 

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
 

//@filename {Foo} fileName src/jsdocmaker/plugin/module-exports.js

/* @module shortjsdoc.plugin.module-export

#@module @exports
the module AST will contain a property exports pointing to a type that can be complex. Example:

	@module module1 blabla
	@class MyTool1
	@exports {version:String,Tool:MyTool1}
*/

var JsDocMaker = require('../core/class'); 
var _ = require('underscore'); 

//@class ModuleExportsPlugin @extends JsDocMakerPlugin
var plugin_beforeTypeBinding = {
	name: '@module @exports - beforeTypeBinding'
,	execute: function(options)
	{
		var node = options.node
		,	jsdocMaker = options.jsdocmaker; 
		if(node.annotation!='module')
		{
			return;
		}
		var exports = _(node.children).select(function(child)
		{
			return child.annotation=='exports';
		}) || null;

		if(exports && exports.length)
		{
			exports = exports[0]; 
			node.exports = exports;
			//name is part of the text
			exports.text = exports.name + ' ' + exports.text; 

			//type binding
			var parsedType = jsdocMaker.parseTypeString(node.exports.type, node);
			node.exports.typeString = node.exports.type;
			node.exports.type = parsedType;
		}
	}
}; 
  
JsDocMaker.prototype.beforeTypeBindingPlugins.add(plugin_beforeTypeBinding); 

//@filename {Foo} fileName src/jsdocmaker/plugin/native-types.js

// @module shortjsdoc @class JsDocMaker
var JsDocMaker = require('../core/class'); 
var _ = require('underscore'); 

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


//@filename {Foo} fileName src/jsdocmaker/plugin/recurse-plugin-containers.js

// @module recurse-plugin-containers - a plugin to be used by concrete plugins to iterate on all 
// nodes after some interesting stages. by calling recurseAST. 
// The objective is that other concrete plugins register here and so the AST recursion is made 
// ONCE instead of using recurseAST in each of them.


var JsDocMaker = require('../core/class'); 
var PluginContainer = require('../core/plugin'); 
require('./util'); 
var _ = require('underscore'); 

// @class AfterTypeBindingRecurseASTPluginContainer it is both a plugin and a plugin container @extends PluginContainer
var AfterTypeBindingRecurseASTPluginContainer = function()
{
	return PluginContainer.apply(this, arguments); 
};
AfterTypeBindingRecurseASTPluginContainer.prototype = _({}).extend(PluginContainer.prototype);
_(AfterTypeBindingRecurseASTPluginContainer.prototype).extend(
{
	name: 'AfterTypeBindingRecurseASTPluginContainer'

	// for each AST node all child plugins will be executed - the objective is to recurse the ast only once.
,	execute: function(options)
	{
		// debugger;
		//TODO: this logic doesn't respect priority - don't copy and paste this logic here - define a cisitor method in super
		var result = null, self = this;
		options.jsdocmaker.recurseAST(function(node)
		{
			_(self.plugins).each(function(plugin) 
			{
				result = plugin.execute(node, plugin);
			}); 
		}); 
		return result; 
	}
}); 


var plugin = new AfterTypeBindingRecurseASTPluginContainer();

//@module shortjsdoc @class JsDocMaker @property {AfterTypeBindingRecurseASTPluginContainer} afterTypeBindingRecurseASTPlugins
JsDocMaker.prototype.afterTypeBindingRecurseASTPlugins = plugin; 

JsDocMaker.prototype.afterTypeBindingPlugins.add(plugin); 

//@filename {Foo} fileName src/jsdocmaker/plugin/text-marks-references.js

/*
@module shortjsdoc.plugin.text-marks-references

It is based on text-marks plugin to give support to @?class @?method @?module @?property @?event and @?ref  text marks. 

They will be binded to referenced nodes. The @?ref can bind anything passed as absolute name but it is less performant. 

Also it contains the implementation for @?link

*/

var JsDocMaker = require('../core/class'); 
var _ = require('underscore'); 

var textMarksReferencesPlugin = {

	name: 'text-marks-references'

,	execute: function(options)
	{
		var currentClass
		,	self = this
		,	classMemberNameDic = {
				method: 'methods'
			,	property: 'properties'
			,	event: 'events'
			}; 

		options.jsdocmaker.recurseAST(function(node)
		{
			if(node.annotation==='class')
			{
				currentClass = node;
			}
			_(node.textMarks).each(function(mark, key)
			{
				if(mark.binding)
				{
					return;
				}
				if(mark.name==='link')
				{
					var linkRegex = /\[([^\]]+)\]\(([^\)]+)\)/g; 
					var result = linkRegex.exec(mark.arg); 
					if(result && result.length >= 3)
					{
						mark.linkLabel = result[1]; 
						mark.linkUrl = result[2]; 
					}
				}
				else if(mark.name==='class')
				{
					mark.binding = self.bindClass(mark, currentClass, options.jsdocmaker) || {annotation: 'class', name: mark.name, error:'NAME_NOT_FOUND'};
				}
				else if(mark.name==='module')
				{
					mark.binding = self.bindModule(mark, currentClass, options.jsdocmaker) || {annotation: 'module', name: mark.name, error:'NAME_NOT_FOUND'};
				}
				else if(mark.name==='method' || mark.name==='property' || mark.name==='event')
				{
					mark.binding = self.bindClassMember(mark, currentClass, options.jsdocmaker, [classMemberNameDic[mark.name]]) || {annotation: mark.name, name: mark.name, error:'NAME_NOT_FOUND'};
				}
				else if(mark.name==='ref')
				{
					mark.binding = self.bindModule(mark, currentClass, options.jsdocmaker); 
					if(!mark.binding)
					{
						mark.binding = self.bindClass(mark, currentClass, options.jsdocmaker); 
					}
					if(!mark.binding)
					{
						mark.binding = self.bindClassMember(mark, currentClass, options.jsdocmaker, [classMemberNameDic['method'], classMemberNameDic['property'], classMemberNameDic['event']]) || {annotation: mark.name, name: mark.name, error:'NAME_NOT_FOUND'}; 
					}
				}
			}); 
		});
	}

	//@method bindClassMember binds a method, property or event using the marking  @param {String} what can be method, property, event
,	bindClassMember:function(mark, currentClass, maker, what)
	{
		var binded;
		if(currentClass)
		{
			_(what).each(function(member)
			{
				if(currentClass[member] && currentClass[member][mark.arg])
				{
					binded = currentClass[member][mark.arg];
				}
			});
		}
		if(!binded)
		{
			//the assume absolute method name
			var className = mark.arg.substring(0, mark.arg.lastIndexOf('.')); 
			var c = maker.data.classes[className]; 
			if(!c)
			{
				return;//return {name: '', error: 'NAME_NOT_FOUND'}; // this is probably an error on the text don't do anything.
			}
			_(what).each(function(member)
			{
				if(!binded)
				{
					if(c[member])
					{
						var simpleName = mark.arg.substring(mark.arg.lastIndexOf('.') + 1, mark.arg.length);
						binded = c[member][simpleName];
					}					
				}
			}); 		
		}
		return binded;
	} 

,	bindClass: function(mark, currentClass, maker)
	{
		var self=this
		,	binded = maker.parseSingleTypeString(mark.arg, currentClass);
		if(_(binded).isArray() && binded.length)
		{
			binded = binded[0]; 
		}
		if(!binded || binded.error === 'NAME_NOT_FOUND')
		{
			binded = self.findClass(mark.arg, maker); 			
		}
		return binded;
	}

,	findClass: function(name, maker)
	{
		var binded;
		_(maker.data.classes).each(function(c, absoluteName)
		{
			if(absoluteName === name)
			{
				binded = c;
			}
		}); 
		return binded;
	}

,	bindModule: function(mark, currentClass, maker)
	{
		var binded;
		_(maker.data.modules).each(function(m, module_name)
		{
			if(module_name === mark.arg)
			{
				binded = m;
			}
		}); 
		return binded;
	}
}

JsDocMaker.prototype.afterTypeBindingPlugins.add(textMarksReferencesPlugin); 






//@filename {Foo} fileName src/jsdocmaker/plugin/text-marks.js

/*
@module shortjsdoc.plugin.text-marks

TODO: markings should be done 100% on post processing. 

this is a meta plugin that allow to define marks inside a text. markings like @?foo something will be replaced with 
a unique string key and evaluate functions and store the result in the AST under the node 'textMarks' property.

Other concrete plugins then can expose a certain functionality, for example

@module client 
@class MyClass The attributes of this class are given and well explained the server service that poblate this 
model with JSON @?see server.MyService.Attributes

##History

This tool born with the neccesity of java's @see. We consider using templates (underscore,handlebars) but discarded because we cannot introduce any new 
reserved characters or complexity. An approach with template would allow also to call a function. 

But finally the idea of markins is more compatible and enrich the AST and don't add a postprocessing that complicate the syntax. 

##Implementation notes

Why @?see and not @see ? Because @see will break the simple syntax @annotation name text. We don't want to break 
the basic syntax even if we would easily do w a preprocessing plugin replacing @see with a no annotation mark. 
*/

var JsDocMaker = require('../core/class'); 
var _ = require('underscore'); 

//@class TextMarksAfterParseNodePlugin @extends JsDocMakerPlugin a plugin executed at afterParseNodePlugin that implements the text-marks feature. 
var textMarksAfterParseNodePlugin = {

	name: 'text-marks'

,	execute: function(options)
	{
		var node = options.node
		,	self = this;

		node.text = node.text || ''; 

		var replaceHandler = function(all, name, arg)
		{
			node.textMarks = node.textMarks || {}; 
			var mark = options.jsdocmaker.getUnique('_shortjsdoc_textmarkplugin_');
			node.textMarks[mark] = {name:name, arg:arg}; 
			return mark; 
		}; 

		// first expressions like this: @?link "[This is a link](http://google.com)"
		// TODO: remove the link functionality since the user can use markdowns or html's
		// var regex = /@\?([a-zA-Z0-9_\.]+)\s+"([^"]+)"/g; 
		// node.text = node.text.replace(regex, replaceHandler); 

		// and then expressions like this: @?ref foo.bar.Class.method2
		regex = /@\?([a-zA-Z0-9_\.]+)\s+([^\s]+)/g; 
		// console.log(regex.exec(node.text))
		node.text = node.text.replace(regex, replaceHandler); 
	}
}; 
	
JsDocMaker.prototype.beforeTypeBindingPlugins.add(textMarksAfterParseNodePlugin); 





// afterTypeBindingPlugins



//@filename {Foo} fileName src/jsdocmaker/plugin/util.js

//TODO: move this file to core/recurseAST.js
//@module shortjsdoc @class JsDocMaker
var JsDocMaker = require('../core/class'); 
var _ = require('underscore'); 

//@method recurseAST An utility method that can be used in extensions to visit all the ast nodes and types of the AST recursively. Children are visited first. JsDocMaker.recurseAST can be used for visiting nodes through AST. The same for Types, this is visiting all subtypes of a complex type. 
//@param {Function} fn a visitor for all the nodes
//@param {Function} fn_type a visitor for all the nodes' types
JsDocMaker.prototype.recurseAST = function(fn, fn_type, fn_end)
{
	var self = this;
	_(self.data.classes).each(function(c)
	{
		self.recurseASTClass(c, fn, fn_type); 
	});
	_(self.data.modules).each(function(m)
	{
		fn.apply(m, [m]); 
	});
	fn_end && fn_end();
}; 

JsDocMaker.prototype.recurseASTClass = function(c, fn, fn_type)
{
	if(!c)
	{
		return;
	}
	fn.apply(c, [c]);
	_(c.methods).each(function(m)
	{
		fn.apply(m, [m]); 
		_(m.params).each(function(p)
		{
			p.parentNode=m;
			fn.apply(p, [p]); 
			JsDocMaker.recurseType(p.type, fn_type, p); 
		}); 
		if(m.returns)
		{
			m.returns.parentNode=m;
			fn.apply(m.returns, [m.returns]);
			JsDocMaker.recurseType(m.returns.type, fn_type, m); 
		}
		_(m.throws).each(function(t)
		{
			fn.apply(t, [t]); 
			JsDocMaker.recurseType(t.type, fn_type, t); 
		}); 
	}); 

	_(c.properties).each(function(p)
	{
		fn.apply(p, [p]);
		JsDocMaker.recurseType(p.type, fn_type, p);
	}); 
	_(c.events).each(function(p)
	{
		fn.apply(p, [p]);
		JsDocMaker.recurseType(p.type, fn_type, p);
	}); 
	_(c.attributes).each(function(p)
	{
		fn.apply(p, [p]);
		JsDocMaker.recurseType(p.type, fn_type, p);
	});
	if (c.extends)
	{
		fn.apply(c.extends, [c.extends]);
		JsDocMaker.recurseType(c.extends.type, fn_type, c);
	}
}
// @method recurseType will recurse the type AST - children first. 
// @param {ASTNode} type a class node @param {Function}fn @param {ASTNode} ownerNode @static 
JsDocMaker.recurseType = function(type, fn, ownerNode)
{
	if(!type || !fn)
	{
		return;
	}
	if(_(type).isArray())
	{
		_(type).each(function(t)
		{
			JsDocMaker.recurseType(t, fn, ownerNode); 
		}); 
	}
	else if(!type.annotation || type.annotation !== 'class')
	{
		_(type.properties).each(function(prop)
		{
			JsDocMaker.recurseType(prop, fn, ownerNode); 
		}); 
		_(type.params).each(function(param)
		{
			JsDocMaker.recurseType(param, fn, ownerNode); 
		}); 		
	}


	// console.log('recurseType', type.name, ownerNode.absoluteName|| ownerNode.name)
	fn(type, ownerNode); 
}; 


JsDocMaker.prototype.getUnique = function(prefix)
{
	this.counter = this.counter || 0;
	prefix = prefix || ''; 
	this.counter++;
	return prefix + this.counter;
}

//@filename {Foo} fileName src/shortjsdoc.js

#!/usr/bin/env node

/* @module shortjsdoc.node
nodejs command line utility for generating the .json definition scanning a given source folder or file. 

Depends on src/JsDocMaker.js

*IMPORTANT* don't use console.log here since the output is dumped to stdout 
*/
var fs = require('fs')
,	path = require('path')
,	esprima = require('esprima')
,	_ = require('underscore')
,	argv = require('yargs').argv
,	JsDocMaker = require('./jsdocmaker/main.js'); 

 
//@class ShortJsDoc main class for running jsdocmaker using node through the command line.
var ShortJsDoc = function()
{
	this.maker = new JsDocMaker();
	this.projectMetadata = {jsdoc: {}};
	this.sources = {};
}; 

ShortJsDoc.make = function(options)
{
	return (new ShortJsDoc()).jsdoc(options); 
}; 

_(ShortJsDoc.prototype).extend({

	//@method error dumps an error @param {String} m
	error: function (m)
	{
		console.log(m + '\nUSAGE:\n\tnode src/shortjsdoc.js home/my-js-project/ home/another-js-project/ ... > html/data.json'); 
		process.exit(1);
	}

	//@method main do the job when invoked from command line like this: node src/shortjsdoc.js test/test-project/ > html/data.json
,	main: function main()
	{
		if(!ShortJsDoc.isValidMainCall())
		{
			this.error('more parameters required'); 
		} 

		var inputDirs = argv.input.split(','); 

		// var projectMetadata = {};
		if(argv.projectMetadata)
		{
			this.projectMetadata = this.tryToParseJsonFile(argv.projectMetadata) || {};
		}

		var jsdoc = this.execute({
			inputDirs: inputDirs
		,	projectMetadata: this.projectMetadata
		});

		this.projectMetadata.jsdoc = this.projectMetadata.jsdoc || {}; 

		this.projectMetadata.jsdoc.dontMinifyOutput = argv.dontMinifyOutput || this.projectMetadata.jsdoc.dontMinifyOutput;

		var jsonData = this.dumpJSON(jsdoc); 
		if(argv.jsonOuput)
		{			
			console.log(jsonData);
		}
		else
		{
			console.log('window.__shortjsdoc_data = ' + jsonData);
		} 
	}

	// @method tryToParseJsonFile @param {String} path
,	tryToParseJsonFile: function(path)
	{
		try
		{
			var s = fs.readFileSync(path); 
			return JSON.parse(s); 
		}
		catch(ex)
		{
			return null;
		}
	}

	//@method execute MAIN method to parse the parsed folder's javascript files recursively and return the AST of the jsdoc. 
	//@param {JsDocOptions}options meta information about the project like title, url, license, etc. Hsa the same format as package.json file
	//@return {Object} the jsdoc AST object of all the parsed files. 
,	execute: function(options)
	{
		var self=this; 

		this.computeVendorDirs(options);

		_(options.inputDirs).each(function(inputDir)
		{
			_(self.sources).extend(self.buildSources(inputDir)); 
		}); 

		this.parsedSources = null;
		
		try
		{
			parsedSources = this.parseSources();
		}
		catch (ex)
		{
			// will print the javascript syntax error detected in the sources. we parse only valid js!
			console.error('There is JavaScript syntax error in your source. It cannot be parsed'); 
			//TODO: file and line number and string

			console.error('Failing code fragment: \n', this.maker.data.source.substring(ex.index - 50, ex.index + 50)); 

			fs.writeFileSync('jsdoc_failed_source.js', this.maker.data.source);
			console.log('\n * Dumped file that fails at jsdoc_failed_source.js * \n');
			
			console.error(ex); 
			throw ex;
		}

		var jsdoc = this.maker.data;

		this.projectMetadata = jsdoc.projectMetadata = options.projectMetadata || {name: 'Untitled Project'};

		this.maker.postProccess();
		
		return jsdoc;
	}

	//@method computeVendorDirs @param {JsDocOptions} options
,	computeVendorDirs: function(options)	
	{
		_(options.vendor).each(function(vendorName)
		{
			var f = path.join(ShortJsDoc.getThisFolder(), 'vendor-jsdoc', vendorName); 
			var stats = null;
			try
			{
				stats = fs.statSync(f);
			}
			catch(ex)
			{
				// console.log(ex)
				//TODO: log vendor name nor found?
			}
			if(stats && (stats.isDirectory() || stats.isFile()))
			{			
				options.inputDirs.push(f);
			}
		});
	}

	//@method jsdoc public method meant to be called from user projects build-time code. It will perform all the job of soing the parse and generating a full html output project ready to be used. 
	//@param {JsDocOptions}options meta information about the project like title, url, license, etc. Hsa the same format as package.json file
,	jsdoc: function(options)
	{
		//copy html folder
		try
		{
			var del = require('del').sync; 
			del(options.output); 
		}
		catch(ex)
		{
			
		}
		var htmlFolder = ShortJsDoc.getHtmlFolder();
		ShortJsDoc.copyRecursiveSync(htmlFolder, options.output); 

		//generate the data.json file
		var jsdoc = this.execute(options); 
		var f = path.join(options.output, 'data.json'); 
		var output = this.dumpJSON(jsdoc);

		if(!options.jsonOuput)
		{			
			output = 'window.__shortjsdoc_data = ' + output;
		}

		fs.writeFileSync(f, output); 
	} 

	// @method dumpJSON dump to json string the full ast. configurable through this.projectMetadata.jsdoc.dontMinifyOutput
,	dumpJSON: function(jsdoc) 
	{
		if(this.projectMetadata.jsdoc && this.projectMetadata.jsdoc.dontMinifyOutput)
		{		
			return JSON.stringify(jsdoc, null, 4); // dump the output indented:
		}
		else
		{
			return JSON.stringify(jsdoc); // dump the output minified:
		}
	}

	//@method parseSources
,	parseSources: function()
	{
		var buffer = [], self = this; 

		_(this.sources).each(function(val, file)
		{
			self.maker.addFile(val, file); 
		}); 
		this.maker.jsdoc();
	}

	//@method __parseSourcesFastVersion this was the previous implementation without file separation support. Nevertheless we 
	// let this uncommented and unused because parsing separate files introduced a significant parsing duration (parformance). 
	// TODO. let the user performa a --fast-parsing not supporting files but much faster just for fast jsdoc writting..
,	__parseSourcesFastVersion: function()
	{
		var buffer = [], self = this; 

		_(this.sources).each(function(val, file)
		{
			maker.addFile(value, name);
			buffer.push(val);
		}); 
		this.maker.parseFile(buffer.join('\n\n'), 'ALL.js');
	}

	//@method buildSources parse all files in passed folders and returns the parsed results in t
	//@param Array<String> inputDir @returns {Object} the parsed jsdoc AST object of all passed folders
,	buildSources: function buildSources(inputDir)
	{	
		var map = {}
		,	self = this;
		if(!inputDir)
		{
			console.log('ERROR invalid null input directory'); 
			return;
		}
		if(!fs.statSync(inputDir).isDirectory())
		{
			self.readSource(inputDir, map);
		}
		else
		{			
			ShortJsDoc.folderWalk(inputDir, function(error, file)
			{
				if(!error && file && JsDocMaker.stringEndsWith(file, '.js'))
				{			
					self.readSource(file, map);
				}
			}); 
		}
		return map;
	}

	//@method readSource @param file @param map
,	readSource: function(file, map)
	{
		var src = fs.readFileSync(file, 'utf8'); 
		map[file] = src; 
	}

});

//@method isValidMainCall @static
ShortJsDoc.isValidMainCall = function()
{
	// var argNumber = process.argv[0].indexOf('node')===-1 ? 1 : 2; 
	// return process.argv.length >= argNumber + 1; 
	return argv.input && argv.input.split(',').length;
}; 

//@method getHtmlFolder @return {String} this module's html folder path @static
ShortJsDoc.getHtmlFolder = function()
{
	var f = ShortJsDoc.getThisFolder();
	return path.join(f, 'html');
}; 
//@method getThisFolder @return {String} this module's folder path @static
ShortJsDoc.getThisFolder = function()
{
	var f = module.filename; 
	f = f.substring(0, f.length - path.join('src','shortjsdoc.js').length);
	return f;
}; 



//UTILITIES

// @method folderWalk General function for walking a folder recusively and sync @static 
ShortJsDoc.folderWalk = function (dir, action) 
{
	// console.log('folderwalk', dir)
	if (typeof action !== "function")
	{
		action = function (error, file) { };
	}	

	var list = fs.readdirSync(dir);

	list.forEach(function (file) 
	{
		var sep = JsDocMaker.stringEndsWith(dir, '/') ? '' : '/'; 
		var path =  dir + sep + file;
		var stat = fs.statSync(path); 
		if (stat && stat.isDirectory())
		{
			ShortJsDoc.folderWalk(path, action);
		}			
		else
		{
			action(null, path);
		}
	});
};

// @method copyRecursiveSync copy directories recursively just like cp -r @static
// @param {String} src The path to the thing to copy.
// @param {String} dest The path to the new copy. 
ShortJsDoc.copyRecursiveSync = function(src, dest) 
{
	var exists = fs.existsSync(src);
	var stats = exists && fs.statSync(src);
	var isDirectory = exists && stats.isDirectory();
	if (exists && isDirectory) 
	{
		fs.mkdirSync(dest);
		fs.readdirSync(src).forEach(function(childItemName) 
		{
			ShortJsDoc.copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
		});
	} 
	else 
	{
		fs.linkSync(src, dest);
	}
};



if(ShortJsDoc.isValidMainCall())
{	
	var tool = new ShortJsDoc();
	tool.main();	
} 

ShortJsDoc.JsDocMaker = JsDocMaker;

module.exports = ShortJsDoc;



// @class JsDocOptions
// @property {String} output output folder
// @property {Array<String>} inputDirs the source code folders that will be parsed recursively.
// @property {Array<String>} vendor include the jsdoc of libraries supported by short-jsdoc (see vendor-jsdoc folder). Example: vendor: ['javascript', 'html']

