/*
@module shortjsdoc.plugin.text-marks

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




var classPlugin = {

	name: 'text-marks-plugins'

,	execute: function(options)
	{
		var currentClass, self=this;
		options.jsdocmaker.recurseAST(function(node)
		{
			if(node.annotation==='class')
			{
				currentClass = node;
			}
			_(node.textMarks).each(function(mark, key)
			{
				if(mark.binding)
				{
					return;
				}
				if(mark.name==='class')
				{
					mark.binding = self.bindClass(mark, currentClass, options.jsdocmaker) || {error:'NAME_NOT_FOUND'};
				}
				if(mark.name==='module')
				{
					mark.binding = self.bindModule(mark, currentClass, options.jsdocmaker);
				}
				if(mark.name==='method')
				{
					mark.binding = self.bindMethod(mark, currentClass, options.jsdocmaker);
				}
			}); 
		});
	}

,	bindMethod:function(mark, currentClass, maker)
	{
		var binded;
		if(currentClass && currentClass.methods[mark.arg])
		{
			binded = currentClass.methods[mark.arg]; 
		}
		else
		{
			//the assume absolute method name
			var className = mark.arg.substring(0,mark.arg.lastIndexOf('.')); 
			var c = maker.data.classes[className] || {methods: {}};
			var methodName = mark.arg.substring(mark.arg.lastIndexOf('.')+1, mark.arg.length);
			binded = c.methods[methodName]
		}
		return binded;
	} 

,	bindClass: function(mark, currentClass, maker)
	{
		var self=this
		,	binded = maker.parseSingleTypeString(mark.arg, currentClass);
		if(_(binded).isArray() && binded.length)
		{
			binded = binded[0]; 
		}
		if(!binded || binded.error === 'NAME_NOT_FOUND')
		{
			binded = self.findClass(mark.arg, maker); 			
		}
		return binded;
	}

,	findClass: function(name, maker)
	{
		var binded;
		_(maker.data.classes).each(function(c, absoluteName)
		{
			if(absoluteName === name)
			{
				binded = c;
			}
		}); 
		return binded;
	}

,	bindModule: function(mark, currentClass, maker)
	{
		var binded;
		_(maker.data.modules).each(function(m, module_name)
		{
			if(module_name === mark.arg)
			{
				binded = m;
			}
		}); 
		return binded;
	}
}

JsDocMaker.prototype.afterTypeBindingPlugins.add(classPlugin); 




