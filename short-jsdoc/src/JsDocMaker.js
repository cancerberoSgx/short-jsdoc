/*jshint laxcomma:true*/

//this is a js-indentator implementation for extracting jsdocs information 
//extract comments and use the postRender method to only dump jsdoc related information

(function(GLOBAL) {

	//@class jsDocMaker
	//@constructor JsDocMaker
	var JsDocMaker = GLOBAL.JsDocMaker = function()
	{
		this.annotationRegexp = /(\s+@\w+)/gi;
		// this.classAnnotationRegexp = /(\s+@class)/gi;
		// this.methodAnnotationRegexp = /(\s+@method)/gi;
		// this.propertyAnnotationRegexp = /(\s+@property)/gi;
	}; 



	//PARSING AND PREPROCESSING

	JsDocMaker.prototype.parseFile = function(source, fileName)
	{
		this.syntax = esprima.parse(source, {
			raw: true
		,	range: true
		,	comment: true		
		});
		return this.parse(this.syntax.comments, fileName);
	}; 


	//@method parse	@return {Array} array of class description - with methods, and methods containing params. 
	JsDocMaker.prototype.parse = function(comments, fileName)
	{
		this.comments = comments;
		this.data = this.data || {}; 
		this.data.classes = this.data.classes || {}; 
		this.data.modules = this.data.modules || {}; 

		//we do the parsing block by block, firstunify adjacents line comments in 1	
		this.unifyLineComments();

		var self = this;
		var classes = this.data.classes; 
		var currentClass = null, currentMethod = null, currentModule = null;

		_(this.comments).each(function(node)
		{
			// var a = (node.value || '').split(/((?:@class)|(?:@method)|(?:@param))/gi);
			// var regex = /((?:@class)|(?:@method)|(?:@param))/gi; 
			var regex = /((?:@class)|(?:@method))/gi; 
			var a = self.splitAndPreserve(node.value || '', regex); 
			a = _(a).filter(function(v){return stringFullTrim(v);}); //delete empties and trim
			
			_(a).each(function(value)
			{
				//TODO: let the user mark some comment block somehow to let the parser to ignore it.			
				var parsed_array = self.parseUnit(value); 
				// console.log('PARSED UNIT', parsed_array)
				_(parsed_array).each(function(parsed)
				{
					parsed.fileName = fileName;
					delete parsed.theRestString; 

					if(parsed.annotation==='class')
					{
						if(!classes[parsed.name])
						{
							classes[parsed.name] = parsed; 
						}
						if(currentModule)
						{
							parsed.module = currentModule.name; 
						}
						currentClass = classes[parsed.name]; 
					}
					else if(parsed.annotation==='method' && currentClass)
					{
						currentClass.methods = currentClass.methods || {};
						currentClass.methods[parsed.name] = parsed;
						currentMethod = parsed;
					}
					else if(parsed.annotation==='param' && currentClass)
					{
						if(!currentMethod)
						{
							// debugger;
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
		this.postProccess();
	};

	// @method {Unit} parseUnit parse a simple substring like '@annotation {Type} a text' into an object {annotation, type, text} object.
	// syntax: @method {String} methodName blabla @return {Number} blabla @param {Object} p1 blabla
	JsDocMaker.prototype.parseUnitRegexp = /\s*@(\w+)\s*(\{\w+\}){0,1}\s*(\w+){0,1}(.*)\s*/; 
	JsDocMaker.prototype.parseUnit = function(str)
	{
		// TODO: split str into major units and then do the parsing
		var parsed = this.parseUnitSimple(str); 
		if(!parsed)
		{
			return null;
		}
		var ret = [parsed];
		if(parsed.theRestString)
		{
			var s = parsed.theRestString; 
			var child;
			while((child = this.parseUnitSimple(s)))
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
				/*
				if(child.annotation === 'module' || child.annotation === 'extends'|| child.annotation === 'extend')
				{
					delete child.text; 
					delete child.theRestString; 
				}*/
				s = child.theRestString; 
			}
		}
		return ret; 
	}; 

	JsDocMaker.prototype.parseUnitSimple = function(str) 
	{	
		if(!str)
		{
			return null;
		}
		str = stringFullTrim(str); 
		var result = this.parseUnitRegexp.exec(str);
		if(!result || result.length<4)
		{
			return null;  //TODO: notify error?
		}
		var text = result[4] || '';
			
		var splitted = this.splitAndPreserve(text, this.annotationRegexp) || [''];  
		text = splitted[0]; 
		splitted.splice(0,1); 
		return {
			annotation: result[1]
		,	type: result[2]
		,	name: result[3]
		,	text: text
		,	theRestString: splitted.join('')
		};
	}; 

	// @method unifyLineComments unify adjacents Line comment nodes into one in the ns.syntax.coments generated after visiting. 
	JsDocMaker.prototype.unifyLineComments = function()
	{
		var i = 0;
		while(i < this.comments.length - 1)
		{
			var c = this.comments[i]
			,	next = this.comments[i+1]; 
			if(c.type==='Line' && next.type==='Line')
			{
				c.value += ' ' + next.value; 
				this.comments.splice(i+1, 1); 
			}
			i++;
		}
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
			else //all classes must have a module 
			{
				c.module = {name: JsDocMaker.DEFAULT_MODULE}; //sg
			}

			c.absoluteName = c.module.name + JsDocMaker.ABSOLUTE_NAME_SEPARATOR+c.name; //sg		

			self.data.classes[c.absoluteName] = c; 
			delete self.data.classes[c.name];
		}); 


		_(self.data.classes).each(function(c, name)
		{
			// set class.extends property
			var extend = _(c.children||[]).find(function(child)
			{
				return child.annotation === 'extend' || child.annotation === 'extends'; 
			}); 
			if(extend)
			{
				// c.extends = self.resolveAbsoluteClassName(extend.name, c); 
				c.extends = self.bindClass(extend.name, c);
				c.children = _(c.children).without(extend);
			}
			else // All classes must extend something
			{
				c.extends = {error: 'NAME_NOT_FOUND', name: JsDocMaker.DEFAULT_CLASS}; 
			}

			_(c.methods).each(function(method, name)
			{
				// param property
				var params = _(method.children||[]).filter(function(child)
				{
					child.text = stringFullTrim(child.text||''); 
					return child.annotation === 'param'; 
				}); 
				method.params = params; 

				method.ownerClass = c.absoluteName;
				method.absoluteName = c.absoluteName+JsDocMaker.ABSOLUTE_NAME_SEPARATOR+method.name; 
			});
		});
		

	//resolve type binding - each object containing a type will be added with TypeBinding property
	}; 






	// BINDING
	//@method byndType 
	
	//@return {TypeBinding} 

	//@class TypeBinding a datatype with an association between types names in source code and parsed class nodes. 
	//It support generic types (recursive)
	//@property {TypeBinding} type
	//@property {Array<TypeBinding>} params - the generic types params array. For example the params for {Map<String,Apple>} is [StringBynding]
	//@property {String} nativeTypeUrl - if this is a native type - this 


	//@class JsDocMaker
	//@method
	//TODO: using a internal map this could be done faster
	JsDocMaker.prototype.bindClass = function(name, baseClass)
	{
		//search all classes that matches the name
		var classesWithName = _(_(this.data.classes).values()).filter(function(c)
		{
			return endsWith(c.name, name); 
		});
		//search classes of the module
		var moduleClasses = _(classesWithName).filter(function(c)
		{
			return startsWith(c.module.name, baseClass.module.name); 
		}); 

		var c = moduleClasses.length ? moduleClasses[0] : classesWithName[0]; 
		if(!c)
		{
			return {error: 'NAME_NOT_FOUND', name: name}; 
		}
		else
		{
			return c;
		}
	}; 
	//@method resolveAbsoluteClassName 
	//@param {String} name
	//@param {Object} baseClass the parsed base class object from where to start looking for.
	// @return {String}an absolute class name starting searching from passing baseClass module and then globally and then matching nativetypes.
	JsDocMaker.prototype.resolveAbsoluteClassName = function(name, baseClass)
	{
		return name; 
	}; 

	// @method simpleName @param {String} name @return {String}
	JsDocMaker.prototype.simpleName = function(name)
	{
		var a = name.split(JsDocMaker.ABSOLUTE_NAME_SEPARATOR);
		return a[a.length-1]; 
	}; 

	// NATIVE TYPES LINKING

	// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String
	JsDocMaker.NATIVE_TYPES = ['String', 'Object', 'Array', 'Date', 'Regex']; 
	JsDocMaker.prototype.getNativeTypeUrl = function(name)
	{
		return 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/' + name; 
	}; 



	//MODIFIERS - like static, private, final
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
	JsDocMaker.prototype.splitAndPreserve = function(string, replace)
	{
		var marker = '_%_%_';
		var splitted = string.replace(replace, marker+'$1');
		if(splitted.length<2)
		{
			return null; //TODO: notify error?
		}
		splitted = splitted.split(marker);
		return splitted; 
	}; 
	
	JsDocMaker.prototype.error = function(msg)
	{
		console.error('Error detected: ' + msg); 
		throw msg;
	}; 

	var stringFullTrim = function(s)
	{
		return s.replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g,'').replace(/\s+/g,' ');
	};

	var endsWith = function(str, suffix) 
	{
		return str.indexOf(suffix, str.length - suffix.length) !== -1;
	}; 

	var startsWith = function(s, prefix)
	{
		return s.indexOf(prefix)===0;
	}; 








	// INSTALL AS A PLUGIN IN JS-INDENTATOR
/*
	var maker = new JsDocMaker();

	var ns = jsindentator;
	if(!ns.styles) ns.styles={}; 
	var impl = ns.styles.jsdocgenerator1 = {};
	_.extend(impl, ns.styles.clean);//we extend from a base class that support all the language so we do a full ast iteration. 
	_.extend(impl, {
		postRender: function()
		{
			maker.parse(ns.syntax.comments, 'singleFile.js');
			impl.jsdocClasses = maker.data; 
			
console.log(JSON.stringify(impl.jsdocClasses));
		}
	}); 
	ns.styles.jsdocgenerator1.jsMakerInstance = maker;
*/

})(this);
