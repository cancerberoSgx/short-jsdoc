// @module shortjsdoc.plugin.alias 
/*
#Alias plugin

this plugin allow to define an alias for annotations and classes. This means we can add name 
alias to annotations or classes. Alias can override previous defined ones. 

##Class alias

Class alias can be used to shortcut class names, like 

	@alias class A Array
	@alias class O Object
	@alias class S String
	@alias class N Number
	@alias class B Boolean

Or just use the shortcut

	@alias class A Array O Object S String

After this I just can write my types like this:

	@property {config:O<S,N>,tools:A<Tool>} complex

Note that these plugins perform two tasks using two different plugins: 
1) replace aliases initial annotation with original ones on parsing - the plugin runs on beforeParseNodePlugins
2) but also perform the aliasing on type binding. This is done on beforeBindClassPlugins

IMPORTANT. alias to complex types are not supported, only alias to simple types. The following is WRONG: @alias class MySuper Array<Leg>

##annotation alias
@alias annotation task method

*/


var JsDocMaker = require('../core/class'); 
var _ = require('underscore'); 

//@class AliasBeforeParseNodePlugin @extends JsDocMakerPlugin a plugin executed at beforeParseNodePlugins. 
var aliasBeforeParseNodePlugin = {

	name: 'alias'

,	execute: function(options)
	{
		var node = options.node
		,	context = options.jsdocmaker
		,	self = this;

		context.aliasClassDict = context.aliasClassDict || {}; 

		var aliasList = []; //its a list because node can have many alias children inside. @alias is a second-level AST node
			
		if (node.annotation=='alias')
		{			
			aliasList = [node];
		}
		else 
		{
			aliasList = _(node.children).select(function(c)
			{
				return c.annotation=='alias';
			}); 
		}

		_(aliasList).each(function(alias)
		{
			self.parseAlias(alias, context, true); 
		}); 

		//then check for other annotations for @alias annotation TODO
		// if(context.aliasClassDict[node.annotation])

		//TODO: remove the alias node from comments array

		// console.log	('\n\n', context.aliasClassDict, '\n\n')
	}

	//@method parseAlias @return {JSDocASTNode} the enhanced node with property *alias* enhanced
	//@param {JSDocASTNode} alias @param {JsDocMaker} context @param {Boolean} install  @return {Array<JSDocASTNode>} contained in the annotation text.
,	parseAlias: function(alias, context, install)
	{
		if(!alias)
		{
			return;
		}
		var a = alias.text.split(/\s+/)
		,	parsed = [];
		for (var i = 0; i < a.length; i+=2) 
		{
			var o = {name: a[i], target: a[i+1]};
			parsed.push(o); 
			// debugger;
			if(install)
			{
				context.aliasClassDict[o.name] = o;
			}
		}
		return parsed;
	}

}; 

JsDocMaker.prototype.beforeParseNodePlugins.add(aliasBeforeParseNodePlugin); 


//@class AliasBeforeBindClassPlugin @extends JsDocMakerPlugin a plugin executed at beforeBindClass 
var aliasBeforeBindClassPlugin = {
	name: 'aliasAfterTypeBindingPlugin'

	//@param {name:name, baseClass: baseClass, jsdocmaker: this} context  this plugin has the change of chainging the context.
,	execute: function(context)
	{
		context.jsdocmaker.aliasClassDict = context.jsdocmaker.aliasClassDict || {}; 
		// if(!context.jsdocmaker.aliasClassDict){debugger}
		var alias = context.jsdocmaker.aliasClassDict[context.name]; 
		if(alias)
		{
			context.name = alias.target; //alias only sypport targetting single types!
		}
	}
}; 

JsDocMaker.prototype.beforeBindClassPlugins.add(aliasBeforeBindClassPlugin); 