/*
@module shortjsdoc.plugin.comment.indentation 
#Comment indentation plugin
Takes care of respecting the original indentation of block comments. 
It will erase the initial spaces of each line according to the comment indentation.
*/

var JsDocMaker = require('../core/class'); 
var _ = require('underscore'); 


//@class AliasBeforeParseNodePlugin @extends JsDocMakerPlugin a plugin executed at beforeParseNodePlugins. 
var commentIndentationPlugin = {

	name: 'commentIndentation'

,	execute: function(options)
	{
		if(!options.node.text)
		{
			return;
		}
		var fileSource = options.jsdocmaker.data.files[options.currentFile.fileName]
		var beforeCommentText = options.jsdocmaker.data.source.substring(0, options.node.commentRange[0]); 

		var result = /([ \t]+)$/.exec(beforeCommentText)
		,	prefix = 0;
		if(result && result.length) 
		{
			prefix = result[0];

			// TODO we are ssumming files have unix end to line. we should pre process all commments first. 
			options.node.text = replaceAll('\n' + options.node.text, prefix, '\n'); 
		}	
	}
}
JsDocMaker.prototype.afterParseNodePlugins.add(commentIndentationPlugin); 


function escapeRegExp(string) {
    return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}
function replaceAll(string, find, replace) {
  return string.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}
