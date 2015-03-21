// @module shortjsdoc.plugin
var JsDocMaker = require('./class')
,	_ = require('underscore'); 

// @class PluginContainer a plugin container can be used for installing plugins and then processing 
// some action with all of them, executing them in sequence.
// A plugin is basically a function that acts on some data - state
// Registered plugins are executed secuentially. plugin execution arguments can be modified so next-to-execute plugin can 
// consume new information - same with return value.
var PluginContainer = function()
{
	this.plugins = [];
};

//expose
JsDocMaker.PluginContainer = PluginContainer; 

//@method add @param {JsDocMakerPlugin} plugin
PluginContainer.prototype.add = function(plugin)
{
	this.plugins.push(plugin); 
	this.priorized = null;//clean priorized cache
}; 

//TODO: remove(plugin)

// @method execute @param {Object} @param {Any} input options @return {Any}
PluginContainer.prototype.execute = function(options, input)
{
	var result = null;
	this.visitPlugins(function(plugin)
	{
		result = plugin.execute(options, result);
	}); 
	return result; 
}; 

//@method visitPlugins visit children plugins respecting priority @param {Function} visitor
PluginContainer.prototype.visitPlugins = function(visitor)
{
	// @property {Array<Array<Plugin>>} priorized array of priorities - each priority index contains the plugins with that priority
	var priorized = this.priorized;// = (this.priorized || [1]); //priority calculations cache

	if(!priorized)
	{
		priorized = this.priorized = []; 
		for (var i = 0; i < PluginContainer.MAX_PRIORITY; i++) 
		{
			priorized[i] = []; 
		};
		_(this.plugins).each(function(plugin)
		{
			// visitor(plugin); 
			var p = plugin.priority || PluginContainer.DEFAULT_PRIORITY; // priority zero is invalid and it is treated as default
			// priorized[p] = priorized[p] || []; 
			priorized[p].push(plugin); 
		}); 
	}

	for (var i = 1; i < priorized.length; i++) 
	{
		var p = priorized[i]; 
		for (var j = 0; j < p.length; j++) 
		{
			visitor(p[j]);
		};
	};
}; 

PluginContainer.DEFAULT_PRIORITY = 6; 
PluginContainer.MAX_PRIORITY = 10; 

// TODO: priority



// @class JsDocMakerPlugin
// @property {String} name
// @method execute execute this plugin @param{Object}options @param {Any}result 
// @returns{Any} result possible enriched by the plugin in the chain

module.exports = PluginContainer;






//@method globalPlugins @static
// JsDocMaker.registerGlobalPlugin = function(pluginContainerName, plugin)
// {
// 	JsDocMaker.prototype.plugins = JsDocMaker.prototype.plugins || {};
// 	JsDocMaker.globalPlugins[pluginContainerName] = JsDocMaker.globalPlugins[pluginContainerName] || {}; 
// }; 
// //@method initializePluginContainers called in the constructor - will install all static plugins registered with JsDocMaker.registerGlobalPlugin
// JsDocMaker.prototype.initializePluginContainers = function()
// {
// }



