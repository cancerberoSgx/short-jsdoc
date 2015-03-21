var _ = require('underscore'); 
// var request = require('request');
var curl = require('curlrequest')

// TODO: move to json2jsdoc.js 
// @class Tool
var Class = function(){}
//@method main @param {ToolMainConfig}config @throws SyntaxError
Class.prototype.main = function(config)
{
	//@class ToolMainConfig
	//@property {Function} callback a function that is called when the job is done accepting a String parameter with the result
	//@property {String} json the json string to parse
	//@property resource {String} url or local file path to the resource containing the json we want to parse. Works if no json string is passed 
	//@property {String} mainType the name of the class name for the root json object represent. This will be the pefix of all other subclasses defined.
	//@property {Function} linesToText transformation between array of annotations to a valid javascript comment, by default something like function(lines){return '/*\n' + lines.join('\n') + '\n*/';}
	//@class Tool
	//@property {Object}parsed
	var self = this;
	if(config.json && _(config.json).isString())
	{
		self.json2jsdoc(JSON.parse(config.json) || {}, config);
	}
	else if(config.json && _(config.json).isObject())
	{	
		self.json2jsdoc(config.json, config);
	}
	else if(config.resource)
	{
		curl.request(config.resource, function (error, data) 
		{
				console.log(arguments) 
			if (!error)  //TODO error
			{
				self.json2jsdoc(JSON.parse(data) || {}, config);
				// config.callback(data);
			}
			// console.log(arguments)
		}); 
	}
}; 

Class.prototype.json2jsdoc = function(obj, config)
{
	this.parsed = obj; 
	var buffer = []; 

	this.visit({
		node: this.parsed
	,	buffer: buffer
	,	prefix: config.mainType || 'UnnamedClass'
	}); 

	config.linesToText = config.linesToText || function(lines){return '/*\n' + lines.join('\n') + '\n*/';}; 
	
	config.callback(config.linesToText(buffer));
}


//@method visit @param {ToolVisitConfig} node
Class.prototype.visit = function(config)
{
	var node = config.node
	,	prefix = config.prefix
	,	self = this;

	if(_(node).isArray())
	{
		if(node.length)
		{			
			var childVisitConfig = {
				buffer: []
			,	propName: 'unammedprop' 
			,	node: node[0]
			,	prefix: prefix
			}; 
			self.visit(childVisitConfig); 
			var childTypeName = 'Any'; 

			if(childVisitConfig.buffer[0].indexOf('@class') !== -1)
			{
				childTypeName = childVisitConfig.lastClass || 'UnnamedClass'; 
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

		config.lastClass = originalClass; 

		if(config.propName)
		{
			config.buffer.push('@property {' + prefix + '} ' + config.propName); 
		}
		config.buffer.push('@class ' + prefix); 

		// @class ToolVisitConfig 
		// @property {Array<String>} buffer
		var childVisitConfig = {buffer: [], parentClass: prefix}; 
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

		//and then return talking about the original class
		if(config.parentClass)
		{
			config.buffer.push('@class ' + originalClass);
		}
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
