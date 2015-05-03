// @module shortjsdoc.plugin.dependencies 
/*
#dependencies plugin

this is not technically a plugin because we don't want to make the cmd line tool slower and is a not 
important feature. It should be executed by hand in the user agent.

*/


var JsDocMaker = require('../core/class'); 
var _ = require('underscore'); 

var Tool = function(maker, config)
{
	this.maker = maker;
	this.config = config || {}; 
}; 
_(Tool.prototype).extend({
	calculateClassDependencies: function()
	{
		var self = this
		,	currentClass
		// ,	currentModule
		,	fn = function(node)
			{
				// if(node.annotation==='module')
				// {
				// 	currentModule = node; 
				// }
				if(node.annotation==='class')
				{
					currentClass = node;
					currentClass.dependencies = currentClass.dependencies || {}; 
					currentClass.dependencies.classes = currentClass.dependencies.classes || {}; 
					if(self.config.includeExtends && currentClass.extends && 
						!_(self.config.ignoreClasses).contains(currentClass.extends.absoluteName))
					{
						currentClass.dependencies.classes[currentClass.extends.absoluteName] = currentClass.extends; 
					}
				}
				var deps = _(node.children).filter(function(c)
				{ 
					return c.annotation==='depends'; 
				});
			
				if(deps && deps.length)
				{	
					_(deps).each(function(dep)
					{
						if(dep.name==='class')
						{
							var c = self.maker.findClassByName(dep.text);
							if(!c)
							{
								console.log('warning dependency class not found: '+dep.text); 
								return;
							}

							if(_(self.config.ignoreClasses).contains(c.absoluteName))
							{
								return;
							}
							node.dependencies = node.dependencies || {}; 
							node.dependencies.classes = node.dependencies.classes || {}; 
							node.dependencies.classes[c.absoluteName] = c; 
							if(currentClass)
							{
								currentClass.dependencies.classes[c.absoluteName] = c; 
							}
						}
						// else if(dep.name==='module') //TODO
						// { }
						// else //TOOD: make class to be the default and use name instead of text
						// { }
					}); 
				}
			}
		,	fn_type = function(type, ownerNode)
			{
				if(!currentClass || _(self.config.ignoreClasses).contains(type.absoluteName))
				{
					return; 
				}

				//when iterating types, we automatically add the type as class dependency to the currentClass
				if(type.absoluteName !== currentClass.absoluteName && 
					!_(self.config.ignoreClasses).contains(type.absoluteName))
				{
					currentClass.dependencies.classes[type.absoluteName] = type; 	
				}
			};
		this.maker.recurseAST(fn, fn_type); 
	}
});

JsDocMaker.prototype.tools = JsDocMaker.tools || {}; 
JsDocMaker.prototype.tools.DependencyTool = Tool; 

JsDocMaker.prototype.findClassByName = function(className, data)
{
	data = data || this.data;
	var c = _(data.classes).find(function(c)
	{
		return c.absoluteName===className; 
	});
	if(!c)
	{
		c = _(data.classes).find(function(c)
		{
			return c.name===className; 
		});
	}
	return c; 
}; 