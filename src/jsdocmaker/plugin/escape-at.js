var _ = require('underscore'); 
var JsDocMaker = require('../core/class'); 
var PluginContainer = require('../core/plugin'); 

require('./recurse-plugin-containers');

var key, keyRegexp; 

var pluginBefore = {
	name: 'escape-at'
,	priority: 2
,	execute: function(options)
	{
		var node = options.node;
		if(!key)
		{
			// debugger;
			key = 'escape_at_'+_.uniqueId();
			keyRegexp = new RegExp(key, 'g'); 
		}

		node.value = (node.value||'').replace(/@@/g, key); 
	}
}; 
JsDocMaker.prototype.commentPreprocessorPlugins.add(pluginBefore);


var pluginAfter = {
	name: 'escape-at'
,	execute: function(node) 
	{
		node.text = (node.text||'').replace(keyRegexp, '@'); 
	}
}; 
JsDocMaker.prototype.afterTypeBindingRecurseASTPlugins.add(pluginAfter);





// old impl
// var plugin = {
// 	name: 'escape-at'
// ,	execute: function(node)
// 	{
// 		// debugger;
// 		node.text = (node.text||'').replace(/@@/g, '@'); 
// 	}
// }; 
// // debugger;
// JsDocMaker.prototype.afterTypeBindingRecurseASTPlugins.add(plugin);
//JsDocMaker.prototype.commentPreprocessorPlugins.add(plugin);

