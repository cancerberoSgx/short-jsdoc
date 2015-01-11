/* @module shortjsdoc.plugin.module-export

#@module @exports
the module AST will contain a property exports pointing to a type that can be complex. Example:

	@module module1 blabla
	@class MyTool1
	@exports {version:String,Tool:MyTool1}
*/

var JsDocMaker = require('../core/class'); 
var _ = require('underscore'); 

//@class ModuleExportsPlugin @extends JsDocMakerPlugin
var plugin_beforeTypeBinding = {
	name: '@module @exports - beforeTypeBinding'
,	execute: function(options)
	{
		var node = options.node
		,	jsdocMaker = options.jsdocmaker; 
		if(node.annotation!='module')
		{
			return;
		}
		var exports = _(node.children).select(function(child)
		{
			return child.annotation=='exports';
		}) || null;

		if(exports && exports.length)
		{
			exports = exports[0]; 
			node.exports = exports;
			//name is part of the text
			exports.text = exports.name + ' ' + exports.text; 

			//type binding
			var parsedType = jsdocMaker.parseTypeString(node.exports.type, node);
			node.exports.typeString = node.exports.type;
			node.exports.type = parsedType;
		}
	}
}; 
  
JsDocMaker.prototype.beforeTypeBindingPlugins.add(plugin_beforeTypeBinding); 