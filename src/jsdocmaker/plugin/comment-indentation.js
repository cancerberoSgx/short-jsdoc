/*
@module shortjsdoc.plugin.comment.indentation 
#Comment indentation plugin
Takes care of respecting the original indentation of block comments. 
It will erase the initial spaces of each line according to the comment indentation.
*/

var JsDocMaker = require('../core/class'); 
var _ = require('underscore'); 


//@class commentIndentationPlugin @extends JsDocMakerPlugin a plugin executed at beforeParseNodePlugins. 
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

			var a = options.node.text.split('\n'), output = [];;
			_(a).each(function(line)
			{
				var repl = line.replace(new RegExp('^'+prefix), ''); 
				// console.log(line, repl); 
				output.push(repl);
			}); 

			// TODO we are ssumming files have unix end to line. we should pre process all commments first. 
			options.node.text = output.join('\n');//replaceAll('\n' + options.node.text, prefix, ''); 
		}	
	}
}
JsDocMaker.prototype.afterParseNodePlugins.add(commentIndentationPlugin); 


// function escapeRegExp(string) 
// {
//     return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
// }
// function replaceAll(string, find, replace) 
// {
// 	var r = new RegExp(escapeRegExp(find), 'g');
// 	debugger;
// 	console.log(r)
// 	return string.replace(r, replace);
// }
