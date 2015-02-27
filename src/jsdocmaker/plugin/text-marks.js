/*
@module shortjsdoc.plugin.text-marks

#text-marks

this is a meta plugin that allow to define marks inside a text. markings like @?foo something will be replaced with 
a unique string key and evaluate functions and store the result in the AST under the node 'textMarks' property.

Other concrete plugins then can expose a certain functionality, for example

@module client 
@class MyClass The attributes of this class are given and well explained the server service that poblate this 
model with JSON @?see server.MyService.Attributes

##History

This tool born with the neccesity of java's @see. We consider using templates (underscore,handlebars) but discarded because we cannot introduce any new 
reserved characters or complexity. An approach with template would allow also to call a function. 

But finally the idea of markins is more compatible and enrich the AST and don't add a postprocessing that complicate the syntax. 

##Implementation notes

Why @?see and not @see ? Because @see will break the simple syntax @annotation name text. We don't want to break 
the basic syntax even if we would easily do w a preprocessing plugin replacing @see with a no annotation mark. 
*/

// console.log('seba!!!!'); 

var JsDocMaker = require('../core/class'); 
var _ = require('underscore'); 

//@class TextMarksAfterParseNodePlugin @extends JsDocMakerPlugin a plugin executed at afterParseNodePlugin that implements the text-marks feature. 
var textMarksAfterParseNodePlugin = {

	name: 'text-marks'

,	execute: function(options)
	{
		var node = options.node
		,	self = this;

		if(!node.text)
		{
			return;
		}

		var regex = /@\?([a-zA-Z0-9_\.]+) ([a-zA-Z0-9_\.]+)/g; 
		node.text = node.text.replace(regex, function(all, name, arg)
		{
			node.textMarks = node.textMarks || {}; 
			var mark = _.uniqueId('_shortjsdoc_textmarkplugin_');
			node.textMarks[mark] = {name:name,arg:arg}; 
			return mark; 
		}); 
	}
}; 

JsDocMaker.prototype.beforeParseNodePlugins.add(textMarksAfterParseNodePlugin); 
