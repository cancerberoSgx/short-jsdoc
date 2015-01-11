// @module shortjsdoc @class JsDocMaker
var JsDocMaker = require('../core/class'); 
var _ = require('underscore'); 

//@method recurseAST An utility method that can be used in extensions to visit all the ast nodes and types of the AST recursively. Children are visited first. JsDocMaker.recurseAST can be used for visiting nodes through AST. The same for Types, this is visiting all subtypes of a complex type. 
//@param {Function} fn a visitor for all the nodes
//@param {Function} fn_type a visitor for all the nodes' types
JsDocMaker.prototype.recurseAST = function(fn, fn_type)
{
	var self = this;
	_(self.data.classes).each(function(c)
	{
		if(!c)
		{
			return;
		}
		_(c.methods).each(function(m)
		{
			fn.apply(m, [m]); 
			_(m.params).each(function(p)
			{
				fn.apply(p, [p]); 
				JsDocMaker.recurseType(p.type, fn_type); 
			}); 
			if(m.returns)
			{
				fn.apply(m.returns, [m.returns]);
				JsDocMaker.recurseType(m.returns.type, fn_type); 
			}
			// TODO: throws
		}); 

		_(c.properties).each(function(p)
		{
			fn.apply(p, [p]);
			JsDocMaker.recurseType(p.type, fn_type);
		}); 
		if(c.extends)
		{
			fn.apply(c.extends, [c.extends]);
			JsDocMaker.recurseType(c.extends.type, fn_type);
		}
		//TODO: events
	});
	_(self.data.modules).each(function(m)
	{
		fn.apply(m, [m]); 
	});
}; 

//will recurse the type AST - children first.
JsDocMaker.recurseType = function(type, fn)
{
	if(!type || !fn)
	{
		return;
	}
	if(_(type).isArray())
	{
		_(type).each(function(t)
		{
			JsDocMaker.recurseType(t, fn); 
		}); 
	}
	_(type.properties).each(function(prop)
	{
		JsDocMaker.recurseType(prop, fn); 
	}); 
	_(type.params).each(function(param)
	{
		JsDocMaker.recurseType(param, fn); 
	}); 

	fn(type); 
}; 