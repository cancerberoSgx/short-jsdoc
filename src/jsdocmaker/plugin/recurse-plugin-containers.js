// @module recurse-plugin-containers - a plugin to be used by concrete plugins to iterate on all 
// nodes after some interesting stages. by calling recurseAST. 
// The objective is that other concrete plugins register here and so the AST recursion is made 
// ONCE instead of using recurseAST in each of them.


var JsDocMaker = require('../core/class'); 
var PluginContainer = require('../core/plugin'); 
require('./util'); 
var _ = require('underscore'); 

// @class AfterTypeBindingRecurseASTPluginContainer it is both a plugin and a plugin container @extends PluginContainer
var AfterTypeBindingRecurseASTPluginContainer = function()
{
	return PluginContainer.apply(this, arguments); 
};
AfterTypeBindingRecurseASTPluginContainer.prototype = _({}).extend(PluginContainer.prototype);
_(AfterTypeBindingRecurseASTPluginContainer.prototype).extend(
{
	name: 'AfterTypeBindingRecurseASTPluginContainer'

	// for each AST node all child plugins will be executed - the objective is to recurse the ast only once.
,	execute: function(options)
	{
		// debugger;
		//TODO: this logic doesn't respect priority - don't copy and paste this logic here - define a cisitor method in super
		var result = null, self = this;
		options.jsdocmaker.recurseAST(function(node)
		{
			_(self.plugins).each(function(plugin) 
			{
				result = plugin.execute(node, plugin);
			}); 
		}); 
		return result; 
	}
}); 


var plugin = new AfterTypeBindingRecurseASTPluginContainer();

//@module shortjsdoc @class JsDocMaker @property {AfterTypeBindingRecurseASTPluginContainer} afterTypeBindingRecurseASTPlugins
JsDocMaker.prototype.afterTypeBindingRecurseASTPlugins = plugin; 

JsDocMaker.prototype.afterTypeBindingPlugins.add(plugin); 