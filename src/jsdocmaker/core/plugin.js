// @module shortjsdoc.plugin
var JsDocMaker = require('./class')
,	_ = require('underscore'); 

// @class PluginContainer a plugin container can be used for installing plugins and then processing 
// some action with all of them, executing them in sequence.
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
}; 

// @method execute @param {Object} @param {Any} input options @return {Any}
PluginContainer.prototype.execute = function(options, input)
{
	var result = null;
	_(this.plugins).each(function(plugin)
	{
		result = plugin.execute(options, result);
	}); 
	return result; 
}; 

// TODO: priority


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





// @class JsDocMakerPlugin
// @property {String} name
// @method execute execute this plugin @param{Object}options @param {Any}result 
// @returns{Any} result possible enriched by the plugin in the chain

module.exports = PluginContainer;