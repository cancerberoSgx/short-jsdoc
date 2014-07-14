/*jshint laxcomma:true*/

//this is a js-indentator implementation for extracting jsdocs information 
//extract comments and use the postRender method to only dump jsdoc related information

(function() {

	//http://stackoverflow.com/questions/498970/how-do-i-trim-a-string-in-javascript
	var stringFullTrim = function(s){return s.replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g,'').replace(/\s+/g,' ');};


	//@class jsDocMaker
	//@constructor JsDocMaker
	var JsDocMaker = function()
	{
		this.annotationRegexp = /(\s+@\w+)/gi;
		this.classAnnotationRegexp = /(\s+@class)/gi;
		this.methodAnnotationRegexp = /(\s+@method)/gi;
		this.propertyAnnotationRegexp = /(\s+@property)/gi;
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
			//TODO: let the user mark some comment block somehow to let the parser to ignore it.
			var parsed_array = self.parseUnit(node.value); 
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
					currentMethod.params = currentMethod.params || {};
					currentMethod.params[parsed.name] = parsed; 
				}	
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
				// if(child.annotation === 'module' || child.annotation === 'extends'|| child.annotation === 'extend')
				// {
				// 	delete child.text; 
				// 	delete child.theRestString; 
				// }
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

	//@method postProccess so the data is already parsed but we want to normalize some children like @extend and @module to be properties of the unit instead children.
	JsDocMaker.prototype.postProccess = function()
	{
		var self = this;
		_(self.data.classes).each(function(c, name)
		{
			var module = _(c.children||[]).find(function(child)
			{
				return child.annotation === 'module'; 
			}); 

			if (module)
			{
				c.module = module.name; 
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

			//similar for @extend
			var extend = _(c.children||[]).find(function(child)
			{
				return child.annotation === 'extend' || child.annotation === 'extends'; 
			}); 
			if(extend)
			{
				c.extends = extend.name; 
				c.children = _(c.children).without(extend);
			}
		}); 
	}; 

	JsDocMaker.prototype.error = function(msg)
	{
		console.error('Error detected: ' + msg); 
		throw msg;
	}; 
	var maker = new JsDocMaker();


	// now, create a js-indentator installable !!
	var ns = jsindentator;
	if(!ns.styles) ns.styles={}; 
	var impl = ns.styles.jsdocgenerator1 = {};
	_.extend(impl, ns.styles.clean);//we extends from a base that support all the language so we do a full ast iteration. 
	_.extend(impl, {
		postRender: function()
		{
			maker.parse(ns.syntax.comments, 'singleFile.js');
			impl.jsdocClasses = maker.data; 
		}
	}); 

})();
