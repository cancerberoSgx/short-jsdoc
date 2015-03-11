var _ = require('underscore'); 

// TODO: move to json2jsdoc.js 
// @class Tool
var Class = function(){}
//@method main @param {ToolMainConfig}config @throws SyntaxError
Class.prototype.main = function(config)
{
	//@class ToolMainConfig
	//@property {String} json the json string to parse
	//@property {String} mainType the name of the class name for the root json object represent. This will be the pefix of all other subclasses defined.
	//@property {Function} linesToText transformation between array of annotations to a valid javascript comment, by default something like function(lines){return '/*\n' + lines.join('\n') + '\n*/';}
	//@class Tool
	//@property {Object}parsed
	this.parsed = JSON.parse(config.json) || {};
	var buffer = []; 

	this.visit({
		node:this.parsed
	,	buffer: buffer
	,	prefix: config.mainType || 'UnnamedClass'
	}); 

	config.linesToText = config.linesToText || function(lines){return '/*\n' + lines.join('\n') + '\n*/';}; 
	
	return config.linesToText(buffer);

}; 
//@method visit @param {ToolVisitConfig} node
Class.prototype.visit = function(config)
{
	var node = config.node
	// ,	buffer = config.buffer
	,	prefix = config.prefix
	,	self = this;

	// console.log('visit ', config)
	if(_(node).isArray())
	{
		if(node.length)
		{			
			var childVisitConfig = {
				buffer: []
			,	propName: 'unammedprop' //doesnt matter
			,	node: node[0]
			}; 
			self.visit(childVisitConfig); 
			var childTypeName = 'Any'; 
			if(childVisitConfig.buffer[0].indexOf('@class') !== -1)
			{
				childTypeName = config.lastClass || 'UnnamedClass'; 
			}
			if(childVisitConfig.buffer[0].indexOf('@property') !== -1)
			{
				childTypeName = config.lastPropertyTypeName || 'UnnamedProperty'; 
			}
			var typeName = childTypeName ? ('Array<'+childTypeName+'>') : 'Array';
			config.lastPropertyTypeName = typeName;
			config.buffer.push('@property {'+typeName+'} ' + config.propName); 
		}
		else
		{
			config.buffer.push('@property {Array} ' + config.propName); 
			config.lastPropertyTypeName = 'Array';
		}
	}

	else if(_(node).isObject())
	{
		var originalClass = prefix+'';
		config.buffer.push('@class ' + prefix); 
		// @class ToolVisitConfig 
		// @property {Array<String>} buffer
		var childVisitConfig = {buffer: []}; 
		_(node).each(function(propValue, propName)
		{
			_(childVisitConfig).extend({
				prefix: prefix+'_'+propName	//@property {String} prefix		
			,	node: propValue //@property {Any} node
			,	propName: propName //@property {Any} node
			});
			self.visit(childVisitConfig); 
		}); 

		//we visited the properties using a second buffer and now we dump it to the real buffer.
		_(childVisitConfig.buffer).each(function(s)
		{
			config.buffer.push(s);
		});	

		//and then come back talking about the original class
		config.buffer.push('@class ' + originalClass);
	}
	 
	else
	{
		var type = 'undefined';
		if (_(node).isString())
		{
			type = 'String'; 
		}
		else if (_(node).isNumber())
		{
			type = 'Number'; 
		}
		else if (_(node).isBoolean())
		{
			type = 'Boolean'; 
		}
		config.lastPropertyTypeName = type;
		config.buffer.push('@property {' + type + '} ' + config.propName); 
		//TODO: check config.propName undefined
	}
}; 


// TODO move to main.js
var main = function(config)
{
	if(_(config).isString())
	{
		config = {
			json: config
		}; 
	}
	var tool = new Class();
	return tool.main(config);
}; 

module.exports = {main:main, Class: Class};
