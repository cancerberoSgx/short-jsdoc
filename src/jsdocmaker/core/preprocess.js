/* @module shortjsdoc

#Comment Preprocessors

The core of comment preprocessing is done ba couple of plugins executed at allCommentPreprocessorPlugins and 
ingeneral normalizes the comments text, delete non relevant comments, unify line comments into a single one, etc

*/
var JsDocMaker = require('./class'); 
var _ = require('underscore'); 

//COMMENT PREPROCESSORS

//@class PreprocessCommentsPlugin1 @extends JsDocMakerPlugin  this plugin is registered in JsDocMaker.prototype.allCommentPreprocessorPlugins plugin container
// and do an initial preprocesing on the comments erasing those marked comments to be ignored, and fixing its text to support alternative syntax.
var preprocessCommentsPlugin1 = {
	name: 'preprocessCommentsPlugin1'
,	execute: function(options)
	{
		var comments = options.node;
		//we do the parsing block by block,
		for (var i = 0; i < comments.length; i++) 
		{
			var node = comments[i];//options.node; 
			node.value = node.value || ''; 

			// fix styled comment blocks with '*' as new line prefix
			// if(node.type === 'Block')
			// {
			// 	// Note: syntax /** - not necesary to implement
			// 	debugger
			// 	node.value = node.value.replace(/\n \*/gi, '\n');
			// }

			// remove comments that starts with ignoreCommentPrefix
			if(JsDocMaker.startsWith(JsDocMaker.stringTrim(node.value), options.jsdocMaker.ignoreCommentPrefix))
			{
				//if \n * is detected it is fixed to not count the decorative '*'
				comments.splice(i, 1); //remove this node
			}
		}
	}
} ; 

//install it as comment preprocessor plugin!
JsDocMaker.prototype.allCommentPreprocessorPlugins.add(preprocessCommentsPlugin1);//.push(JsDocMaker.prototype.preprocessComments); 


//@class FixUnamedAnnotationsPlugin @extends JsDocMakerPlugin This plugin is installed at JsDocMaker.prototype.commentPreprocessorPlugins and and solves the following problem: 
//Our regexp format expect an anotation with a name. So for enabling unamed annotations we do this dirty fix, this is add a name to precondition
var fixUnamedAnnotationsPlugin = {
	name: 'fixUnamedAnnotationsPlugin'
,	priority: 3
,	execute: function(options)
	{
		var node = options.node;
		if(node.value)
		{
			node.value = node.value.replace(/@constructor/gi, '@constructor n'); 
			node.value = node.value.replace(/(@\w+)\s*$/gi, '$1 dummy ');
			node.value = node.value.replace(/(@\w+)\s+(@\w+)/gi, '$1 dummy $2');
		}
	}
}; 
//install it as comment preprocessor plugin!
JsDocMaker.prototype.commentPreprocessorPlugins.add(fixUnamedAnnotationsPlugin); 

//@class UnifyLineCommentsPlugin @extends JsDocMakerPlugin this is a very important plugin for normalize our js input Line comments 
// It is executed at JsDocMaker.prototype.allCommentPreprocessorPlugins
var unifyLineCommentsPlugin = {
	name: 'unifyLineCommentsPlugin'
,	execute: function(options)
	{
		var i = 0
		,	comments = options.node
		,	jsdocMaker = options.jsdocMaker; 
	
		jsdocMaker.lineCommentSeparatorMark = '_lineCommentSeparatorMark_';
		while(i < comments.length - 1)
		{
			var c = comments[i]
			,	next = comments[i+1]; 

			var sss = JsDocMaker.stringFullTrim(options.jsdocMaker.data.source.substring(c.range[1], next.range[0])); 
			if (c.type==='Line' && next.type==='Line' && !sss)
			{
				c.value += ' ' + jsdocMaker.lineCommentSeparatorMark + ' ' + next.value; 
				c.range[1] = next.range[1]; 
				comments.splice(i+1, 1); 
			}
			else
			{
				i++;
			}
		}
	}
}; 
JsDocMaker.prototype.allCommentPreprocessorPlugins.add(unifyLineCommentsPlugin); 

