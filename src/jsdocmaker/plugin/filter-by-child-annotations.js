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
	}
	_.each(_.values(data.classes), function(c)
	{
		if(!classHasDescendant(c, predicate))
		{
			delete data.classes[c.absoluteName];
		}
	})

	_.each(_.values(data.modules), function(m)
	{
		if(!_.find(_.values(data.classes), function(c)
		{
			return c.module && c.module.name==m.name
		}))
		{
			delete data.modules[m.name]
		}
	})


	// TODO: remove module's functions

};

function classHasDescendant(c, predicate){
	var has;
	has = has || _.find(c.children, function(node){return predicate(node)});

	function doChildNodes(parentNode, childName, predicate)
	{
		parentNode[childName] = _.filter(parentNode[childName], function(node)
		{
			return _.find(node.children, function(c){return predicate(c)});
		})
		return parentNode[childName] && parentNode[childName].length;
	}

	has = has || doChildNodes(c, 'methods', predicate);
	has = has || doChildNodes(c, 'properties', predicate);
	has = has || doChildNodes(c, 'events', predicate);

	return has;
}