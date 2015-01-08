var JsDocMaker = require('./class'); 
var esprima = JsDocMaker.require('esprima');
var _ = require('underscore'); 

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
