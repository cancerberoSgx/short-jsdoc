// @module shortjsdoc @class JsDocMaker
var JsDocMaker = require('../core/class'); 
var _ = require('underscore'); 

//@method recurseAST An utility method that can be used in extensions to visit all the ast nodes with given function 
//@param {Function} fn
JsDocMaker.prototype.recurseAST = function(fn)
{
	var self = this;
	_(self.data.classes).each(function(c)
	{
		_(c.methods).each(function(m)
		{
			fn.apply(m, [m]); 
			//TODO: params
		}); 

		_(c.properties).each(function(p)
		{
			fn.apply(p, [p]); 
		}); 
		//TODO: events
	});
	_(self.data.modules).each(function(m)
	{
		fn.apply(m, [m]); 
	});
}; 

