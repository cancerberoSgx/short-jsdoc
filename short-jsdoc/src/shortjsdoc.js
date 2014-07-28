/*
parser for type expressions like Map<String,Array<Apple>> created in this site http://pegjs.majda.cz/online using the following source:

//Map<Strign,Array<String>>

start
  = EXPR

EXPR
  = name:NAME "<" list:(LIST_OF_NAMES)+ ">" {return '{name: '+name+',params:['+list.join(',')+']}'; }

NAME
  = name:[a-zA-z1-9_]+ {return '\''+name.join('')+'\''; }

LIST_OF_NAMES
  = expr:EXPR / name:NAME [,]* {
  if(typeof name !== 'undefined'){
  return name; 
  }
}  

*/
(function(GLOBAL) {
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

        peg$startRuleFunctions = { start: peg$parsestart },
        peg$startRuleFunction  = peg$parsestart,

        peg$c0 = peg$FAILED,
        peg$c1 = "<",
        peg$c2 = { type: "literal", value: "<", description: "\"<\"" },
        peg$c3 = [],
        peg$c4 = ">",
        peg$c5 = { type: "literal", value: ">", description: "\">\"" },
        peg$c6 = function(name, list) {return '{name: '+name+',params:['+list.join(',')+']}'; },
        peg$c7 = /^[a-zA-z1-9_]/,
        peg$c8 = { type: "class", value: "[a-zA-z1-9_]", description: "[a-zA-z1-9_]" },
        peg$c9 = function(name) {return '\''+name.join('')+'\''; },
        peg$c10 = /^[,]/,
        peg$c11 = { type: "class", value: "[,]", description: "[,]" },
        peg$c12 = function(name) {
          if(typeof name !== 'undefined'){
          return name; 
          }
        },

        peg$currPos          = 0,
        peg$reportedPos      = 0,
        peg$cachedPos        = 0,
        peg$cachedPosDetails = { line: 1, column: 1, seenCR: false },
        peg$maxFailPos       = 0,
        peg$maxFailExpected  = [],
        peg$silentFails      = 0,

        peg$result;

    if ("startRule" in options) {
      if (!(options.startRule in peg$startRuleFunctions)) {
        throw new Error("Can't start parsing from rule \"" + options.startRule + "\".");
      }

      peg$startRuleFunction = peg$startRuleFunctions[options.startRule];
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

    function peg$parsestart() {
      var s0;

      s0 = peg$parseEXPR();

      return s0;
    }

    function peg$parseEXPR() {
      var s0, s1, s2, s3, s4;

      s0 = peg$currPos;
      s1 = peg$parseNAME();
      if (s1 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 60) {
          s2 = peg$c1;
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c2); }
        }
        if (s2 !== peg$FAILED) {
          s3 = [];
          s4 = peg$parseLIST_OF_NAMES();
          if (s4 !== peg$FAILED) {
            while (s4 !== peg$FAILED) {
              s3.push(s4);
              s4 = peg$parseLIST_OF_NAMES();
            }
          } else {
            s3 = peg$c0;
          }
          if (s3 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 62) {
              s4 = peg$c4;
              peg$currPos++;
            } else {
              s4 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c5); }
            }
            if (s4 !== peg$FAILED) {
              peg$reportedPos = s0;
              s1 = peg$c6(s1, s3);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parseNAME() {
      var s0, s1, s2;

      s0 = peg$currPos;
      s1 = [];
      if (peg$c7.test(input.charAt(peg$currPos))) {
        s2 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s2 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c8); }
      }
      if (s2 !== peg$FAILED) {
        while (s2 !== peg$FAILED) {
          s1.push(s2);
          if (peg$c7.test(input.charAt(peg$currPos))) {
            s2 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s2 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c8); }
          }
        }
      } else {
        s1 = peg$c0;
      }
      if (s1 !== peg$FAILED) {
        peg$reportedPos = s0;
        s1 = peg$c9(s1);
      }
      s0 = s1;

      return s0;
    }

    function peg$parseLIST_OF_NAMES() {
      var s0, s1, s2, s3;

      s0 = peg$parseEXPR();
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        s1 = peg$parseNAME();
        if (s1 !== peg$FAILED) {
          s2 = [];
          if (peg$c10.test(input.charAt(peg$currPos))) {
            s3 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c11); }
          }
          while (s3 !== peg$FAILED) {
            s2.push(s3);
            if (peg$c10.test(input.charAt(peg$currPos))) {
              s3 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s3 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c11); }
            }
          }
          if (s2 !== peg$FAILED) {
            peg$reportedPos = s0;
            s1 = peg$c12(s1);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      }

      return s0;
    }

    peg$result = peg$startRuleFunction();

    if (peg$result !== peg$FAILED && peg$currPos === input.length) {
      return peg$result;
    } else {
      if (peg$result !== peg$FAILED && peg$currPos < input.length) {
        peg$fail({ type: "end", description: "end of input" });
      }

      throw peg$buildException(null, peg$maxFailExpected, peg$maxFailPos);
    }
  }

  GLOBAL.ShortJsDocTypeParser = {
    SyntaxError: SyntaxError,
    parse:       parse
  };
})(this);;/*jshint laxcomma:true, evil:true*/

//this is a js-indentator implementation for extracting jsdocs information 
//extract comments and use the postRender method to only dump jsdoc related information

(function(GLOBAL) 
{

//@class jsDocMaker
//@constructor JsDocMaker
var JsDocMaker = GLOBAL.JsDocMaker = function()
{
	this.annotationRegexp = /(\s+@\w+)/gi;
}; 



//PARSING AND PREPROCESSING

//@method parseFile @return {Object} the parsed object @param {String} source @param {String} filename
JsDocMaker.prototype.parseFile = function(source, fileName)
{
	//@property {Object<String,Object>} parsedFiles
	this.parsedFiles = this.parsedFiles || {}; 

	this.syntax = esprima.parse(source, {
		raw: true
	,	range: true
	,	comment: true		
	});
	var parsed = this.parse(this.syntax.comments, fileName);

	this.parsedFiles[source] = {
		syntax: this.syntax
	,	parsed: parsed
	}; 

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
		var regex = /((?:@class)|(?:@method))/gi; 
		var a = self.splitAndPreserve(node.value || '', regex); 
		a = _(a).filter(function(v)  //delete empties and trim
		{
			return JsDocMaker.stringFullTrim(v);
		});
		
		_(a).each(function(value)
		{
			//TODO: let the user mark some comment block somehow to let the parser to ignore it.			
			var parsed_array = self.parseUnit(value);
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
				else if(parsed.annotation==='property' && currentClass)
				{
					currentClass.properties = currentClass.properties || {};
					currentClass.properties[parsed.name] = parsed;
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
};

// @method {Unit} parseUnit parse a simple substring like '@annotation {Type} a text' into an object {annotation, type, text} object.
// syntax: @method {String} methodName blabla @return {Number} blabla @param {Object} p1 blabla
JsDocMaker.prototype.parseUnitRegexp = /\s*@(\w+)\s*(\{[\w<>,]+\}){0,1}\s*([\w]+){0,1}(.*)\s*/; 
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
	str = JsDocMaker.stringFullTrim(str); 
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
	,	text: JsDocMaker.stringFullTrim(text||'')
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
		else //all classes must have a module 
		{
			c.module = {name: JsDocMaker.DEFAULT_MODULE}; //sg
		}

		c.absoluteName = c.module.name + JsDocMaker.ABSOLUTE_NAME_SEPARATOR+c.name; //sg		

		self.data.classes[c.absoluteName] = c; 
		delete self.data.classes[c.name];
	}); 
}; 

//@method postProccessBinding precondion: call postProccess() first. We separated the post proccessing in two because we shouln't do JSON.stringify() after we bind types because of recursive loops. 
JsDocMaker.prototype.postProccessBinding = function()
{
	var self = this;
	//at this points we have all our modules and classes - now we normalize extend, methods and params and also do the type binding. 
	_(self.data.classes).each(function(c, name)
	{
		//set class.extends property
		var extend = _(c.children||[]).find(function(child)
		{
			return child.annotation === 'extend' || child.annotation === 'extends'; 
		}); 
		if(extend)
		{
			c.extends = self.bindClass(extend.name, c);
			c.children = _(c.children).without(extend);
		}
		else // All classes must extend something
		{
			c.extends = {error: 'NAME_NOT_FOUND', name: JsDocMaker.DEFAULT_CLASS}; 
		}

		//setup methods
		_(c.methods).each(function(method, name)
		{
			// param property
			var params = _(method.children||[]).filter(function(child)
			{
				child.text = JsDocMaker.stringFullTrim(child.text||''); 
				return child.annotation === 'param'; 
			}); 
			method.params = params; 

			method.ownerClass = c.absoluteName;
			method.absoluteName = c.absoluteName + JsDocMaker.ABSOLUTE_NAME_SEPARATOR + method.name; 

			_(method.params).each(function(param)
			{
				if(_(param.type).isString())
				{
					param.type = self.parseTypeString(param.type, c) || param.type;						
				}					
			}); 

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



	//TODO : support generics w complex anidation like in Map<String,Array<Apple>>

	if(typeString.indexOf('<')!==-1)
	{
		var type = null;
		try
		{

			console.log('this.bindParsedType')

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
		return JsDocMaker.stringEndsWith(c.name, name); 
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
		var nativeType = JsDocMaker.getNativeTypeUrl(name);
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

//@method getNativeTypeUrl @static @returns an url if given name match a native types or undefined otherwise
JsDocMaker.getNativeTypeUrl = function(name)
{
	if(_(JsDocMaker.NATIVE_TYPES).contains(name))
	{
		return 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/' + name;
	}
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
;// nodejs command line utility for generating the .json definition scanning a given source folder or file. 
//depends on src/JsDocMaker.js

var fs = require('fs')
,	path = require('path')
// ,	process = require('process')
,	esprima = require('esprima')
,	_ = require('underscore'); 


var JsDocMaker = this.JsDocMaker;
var ShortJsDocTypeParser = this.ShortJsDocTypeParser; 

var ShortJsDoc = function()
{
	this.maker = new JsDocMaker();
}; 

ShortJsDoc.prototype.error = function (m)
{
	console.log(m + '\nUSAGE:\n\tnode short'); 
	process.exit(1);
}; 


ShortJsDoc.prototype.main = function main()
{
	if(process.argv.length < 3)
	{
		error('more parameters required'); 
	}
	var inputDir = process.argv[2]; 

	this.sources = this.buildSources(inputDir); 
	this.parsedSources = this.parseSources();

	var jsdoc = this.maker.data;

	this.maker.postProccess();
	// this.maker.postProccessBinding();
	
	console.log(JSON.stringify(jsdoc)); 
}; 

ShortJsDoc.prototype.parseSources = function()
{
	for (file in this.sources) 
	{
		this.maker.parseFile(this.sources[file], file);
		// console.log('MAKER', this.maker.data)
	}
};

ShortJsDoc.prototype.buildSources = function buildSources(inputDir)
{	
	var map = {};
	ShortJsDoc.folderWalk(inputDir, function(error, file)
	{
		if(!error && file && JsDocMaker.stringEndsWith(file, '.js'))
		{			
			var src = fs.readFileSync(file, 'utf8'); 
			map[file] = src; 
		}
	}); 
	return map;
}; 

// test
/*
var code = 
	'//@class Machine @module office' + '\n' +
	'//@method calculate @param {Object<String,Array<Number>>} environment @final @static' + '\n' + 
	'//@property {Array<Eye>} eye' + '\n' +
	'//@class Eye a reutilizable eye @module office' + '\n' +
	''; 
var maker = new JsDocMaker();
maker.parseFile(code, 'genericstest1'); 
// maker.postProccess();
// maker.postProccessBinding();
// jsdoc = maker.data;

console.log(JSON.stringify(maker.data)); 
*/



//UTILITIES
// General function for walking a folder recusively and sync
ShortJsDoc.folderWalk = function (dir, action) {
	// Assert that it's a function
	if (typeof action !== "function")
		action = function (error, file) { };

	// Read the directory

	var list = fs.readdirSync(dir);
	// fs.readdir(dir, function (err, list) {

	// Return the error if something went wrong
	// if (err)
	// return action(err);

	// For every file in the list
	list.forEach(function (file) {
		// Full path of that file
		var path = dir + "/" + file;
		// Get the file's stats
		var stat = fs.statSync(path); 
		// fs.stat(path, function (err, stat) {
		// console.log(stat);
		// If the file is a directory
		if (stat && stat.isDirectory())
			// Dive into the directory
			ShortJsDoc.folderWalk(path, action);
		else
			// Call the action
			action(null, path);
		// });
	});
	// });
};





var tool = new ShortJsDoc();
tool.main();


/*
var loadJavaScript = function(file)
{
  var src = fs.readFileSync(path.join(__dirname, file),'utf8'); 
  eval(src); 
  console.log(path.join(__dirname, file)); 
};
loadJavaScript('../src/typeParser.js');
loadJavaScript('../src/JsDocMaker.js'); 
*/
