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
JsDocMaker.prototype.primaryAnnotationsRegexString = '((?:@class)|(?:@method)|(?:@property)|(?:@attribute)|(?:@module)|(?:@event)|(?:@constructor)|(?:@function)|(?:@filename))';

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

				// console.log('parse ', parsed.annotation)
				self.beforeParseNodePlugins.execute({node:parsed, jsdocmaker:self}); 

				//Note: the following lines is the (only) place were the 'primary annotations' (class,module,method,property) are implemented 
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
		regexp = /\s*@([\w\.\-\_]+)\s*(\{[\w<>\|, #:\(\)\.]+\}){0,1}\s*([\w\._\$]+){0,1}(.*)\s*/i; 
		result = regexp.exec(str);
	}
	else
	{
		str = JsDocMaker.stringTrim(str); 
		regexp = /\s*@([\w\.\-\_]+)\s*(\{[\w<>\|, #:\(\)\.]+\}){0,1}\s*([\w\._\$]+){0,1}([.\s\w\W]*)/gmi;
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
