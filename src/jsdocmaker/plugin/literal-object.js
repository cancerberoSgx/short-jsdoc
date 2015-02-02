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

