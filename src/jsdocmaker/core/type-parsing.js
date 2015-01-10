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

