// @module shortjsdoc.plugin @class JsDocMaker
var JsDocMaker = require('../core/class'); 
var _ = require('underscore'); 

JsDocMaker.filterByChildAnnotation = function(options)
{
	var data = options.jsdocmaker.data;
	var annotations = options.annotations || [];
	var predicate = function(node)
	{
		return annotations.indexOf(node.annotation)!=-1;
	};
	_.each(_.values(data.classes), function(c)
	{
		if(!classHasDescendant(c, predicate))
		{
			delete data.classes[c.absoluteName];
		}
	});
	_.each(_.values(data.modules), function(m)
	{
		if(!_.find(_.values(data.classes), function(c)
		{
			return c.module && c.module.name==m.name
		}))
		{
			delete data.modules[m.name]
		}
	});

	// TODO: remove module's functions

};

function classHasDescendant(c, predicate)
{
	function doChildNodes(parentNode, childName, predicate)
	{
		var found
		_.each(parentNode[childName], function(node, key)
		{
			if(!_.find(node.children, function(c){return predicate(c)}))
			{
				delete parentNode[childName][key];
			}
			else 
			{
				found = true;
			}
		});
		return found;
	}

	var hasDirectChildren = _.find(c.children, function(node){return predicate(node)});
	var hasMethods = doChildNodes(c, 'methods', predicate);
	var hasProperties = doChildNodes(c, 'properties', predicate);
	var hasEvents = doChildNodes(c, 'events', predicate)

	return hasDirectChildren || hasMethods || hasProperties || hasEvents; 
}