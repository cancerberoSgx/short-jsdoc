var JsDocMaker = require('./class'); 
var _ = require('underscore'); 

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






