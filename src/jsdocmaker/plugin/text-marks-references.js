/*
@module shortjsdoc.plugin.text-marks-references

It is based on text-marks plugin to give support to @?class @?method @?module @?property @?event and @?ref  text marks. 

They will be binded to referenced nodes. The @?ref can bind anything passed as absolute name but it is less performant. 

Also it contains the implementation for @?link

*/

var JsDocMaker = require('../core/class'); 
var _ = require('underscore'); 

var textMarksReferencesPlugin = {

	name: 'text-marks-references'

,	execute: function(options)
	{
		var currentClass
		,	self = this
		,	classMemberNameDic = {
				method: 'methods'
			,	property: 'properties'
			,	event: 'events'
			}; 

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
				if(mark.name==='link')
				{
					var linkRegex = /\[([^\]]+)\]\(([^\)]+)\)/g; 
					var result = linkRegex.exec(mark.arg); 
					if(result && result.length >= 3)
					{
						mark.linkLabel = result[1]; 
						mark.linkUrl = result[2]; 
					}
				}
				else if(mark.name==='class')
				{
					mark.binding = self.bindClass(mark, currentClass, options.jsdocmaker) || {annotation: 'class', name: mark.name, error:'NAME_NOT_FOUND'};
				}
				else if(mark.name==='module')
				{
					mark.binding = self.bindModule(mark, currentClass, options.jsdocmaker) || {annotation: 'module', name: mark.name, error:'NAME_NOT_FOUND'};
				}
				else if(mark.name==='method' || mark.name==='property' || mark.name==='event')
				{
					mark.binding = self.bindClassMember(mark, currentClass, options.jsdocmaker, [classMemberNameDic[mark.name]]) || {annotation: mark.name, name: mark.name, error:'NAME_NOT_FOUND'};
				}
				else if(mark.name==='ref')
				{
					mark.binding = self.bindModule(mark, currentClass, options.jsdocmaker); 
					if(!mark.binding)
					{
						mark.binding = self.bindClass(mark, currentClass, options.jsdocmaker); 
					}
					if(!mark.binding)
					{
						mark.binding = self.bindClassMember(mark, currentClass, options.jsdocmaker, [classMemberNameDic['method'], classMemberNameDic['property'], classMemberNameDic['event']]) || {annotation: mark.name, name: mark.name, error:'NAME_NOT_FOUND'}; 
					}
				}
			}); 
		});
	}

	//@method bindClassMember binds a method, property or event using the marking  @param {String} what can be method, property, event
,	bindClassMember:function(mark, currentClass, maker, what)
	{
		var binded;
		if(currentClass)
		{
			_(what).each(function(member)
			{
				if(currentClass[member] && currentClass[member][mark.arg])
				{
					binded = currentClass[member][mark.arg];
				}
			});
		}
		if(!binded)
		{
			//the assume absolute method name
			var className = mark.arg.substring(0, mark.arg.lastIndexOf('.')); 
			var c = maker.data.classes[className]; 
			if(!c)
			{
				return;//return {name: '', error: 'NAME_NOT_FOUND'}; // this is probably an error on the text don't do anything.
			}
			_(what).each(function(member)
			{
				if(!binded)
				{
					if(c[member])
					{
						var simpleName = mark.arg.substring(mark.arg.lastIndexOf('.') + 1, mark.arg.length);
						binded = c[member][simpleName];
					}					
				}
			}); 		
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

JsDocMaker.prototype.afterTypeBindingPlugins.add(textMarksReferencesPlugin); 




