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
