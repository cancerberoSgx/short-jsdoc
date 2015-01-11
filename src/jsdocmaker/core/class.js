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