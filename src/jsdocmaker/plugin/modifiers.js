// @module shortjsdoc @class JsDocMaker
var JsDocMaker = require('../core/class'); 
var _ = require('underscore'); 

//MODIFIERS postproccessing- like static, private, final. Optional module

//@property {Array<String>}MODIFIERS @static
JsDocMaker.MODIFIERS = ['static', 'private', 'final', 'deprecated', 'experimental', 'optional', 'abstract']; 
//@method installModifiers sets the property modifiers to the node according its children
JsDocMaker.prototype.installModifiers = function(node)
{
	node.modifiers = node.modifiers || []; 
	_(node.children).each(function(child)
	{
		if(_(JsDocMaker.MODIFIERS).contains(child.annotation))
		{
			node.modifiers.push(child.annotation); 
		}
	});
}; 
 