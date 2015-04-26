//TODO: move this file to core/recurseAST.js
//@module shortjsdoc @class JsDocMaker
var JsDocMaker = require('../core/class'); 
var _ = require('underscore'); 

//@method recurseAST An utility method that can be used in extensions to visit all the ast nodes and types of the AST recursively. Children are visited first. JsDocMaker.recurseAST can be used for visiting nodes through AST. The same for Types, this is visiting all subtypes of a complex type. 
//@param {Function} fn a visitor for all the nodes
//@param {Function} fn_type a visitor for all the nodes' types
JsDocMaker.prototype.recurseAST = function(fn, fn_type, fn_end)
{
	var self = this;
	_(self.data.classes).each(function(c)
	{
		self.recurseASTClass(c, fn, fn_type); 
	});
	_(self.data.modules).each(function(m)
	{
		fn.apply(m, [m]); 
	});
	fn_end && fn_end();
}; 

JsDocMaker.prototype.recurseASTClass = function(c, fn, fn_type)
{
	if(!c)
	{
		return;
	}
	fn.apply(c, [c]);
	_(c.methods).each(function(m)
	{
		fn.apply(m, [m]); 
		_(m.params).each(function(p)
		{
			p.parentNode=m;
			fn.apply(p, [p]); 
			JsDocMaker.recurseType(p.type, fn_type, p); 
		}); 
		if(m.returns)
		{
			m.returns.parentNode=m;
			fn.apply(m.returns, [m.returns]);
			JsDocMaker.recurseType(m.returns.type, fn_type, m); 
		}
		_(m.throws).each(function(t)
		{
			fn.apply(t, [t]); 
			JsDocMaker.recurseType(t.type, fn_type, t); 
		}); 
	}); 

	_(c.properties).each(function(p)
	{
		fn.apply(p, [p]);
		JsDocMaker.recurseType(p.type, fn_type, p);
	}); 
	_(c.events).each(function(p)
	{
		fn.apply(p, [p]);
		JsDocMaker.recurseType(p.type, fn_type, p);
	}); 
	_(c.attributes).each(function(p)
	{
		fn.apply(p, [p]);
		JsDocMaker.recurseType(p.type, fn_type, p);
	});
	if (c.extends)
	{
		fn.apply(c.extends, [c.extends]);
		JsDocMaker.recurseType(c.extends.type, fn_type, c);
	}
}
// @method recurseType will recurse the type AST - children first. 
// @param {ASTNode} type a class node @param {Function}fn @param {ASTNode} ownerNode @static 
JsDocMaker.recurseType = function(type, fn, ownerNode)
{
	if(!type || !fn)
	{
		return;
	}
	if(_(type).isArray())
	{
		_(type).each(function(t)
		{
			JsDocMaker.recurseType(t, fn, ownerNode); 
		}); 
	}
	else if(!type.annotation || type.annotation !== 'class')
	{
		_(type.properties).each(function(prop)
		{
			JsDocMaker.recurseType(prop, fn, ownerNode); 
		}); 
		_(type.params).each(function(param)
		{
			JsDocMaker.recurseType(param, fn, ownerNode); 
		}); 		
	}


	// console.log('recurseType', type.name, ownerNode.absoluteName|| ownerNode.name)
	fn(type, ownerNode); 
}; 


JsDocMaker.prototype.getUnique = function(prefix)
{
	this.counter = this.counter || 0;
	prefix = prefix || ''; 
	this.counter++;
	return prefix + this.counter;
}