// @module shortjsdoc @class JsDocMaker
var JsDocMaker = require('./class'); 
var _ = require('underscore'); 

// STATIC UTILITIES

// @method splitAndPreserve search for given regexp and split the given string but preserving the matches
// @param {Regexp} regexp must contain a capturing group (like /(\s+@\w+)/gi)
// @return {Array of string}
// @static
JsDocMaker.splitAndPreserve = function(string, replace)
{
	string = string || '';
	var marker = '_%_%_';
	var splitted = string.replace(replace, marker+'$1');
	if(splitted.length<2)
	{
		return null; //TODO: notify error?
	}
	splitted = splitted.split(marker);
	return splitted; 
}; 

//@method stringFullTrim @param {String} s @static
JsDocMaker.stringFullTrim = function(s)
{
	return (s||'').replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g,'').replace(/\s+/g,' ');
};
//@method stringTrim @param {String} s @static
JsDocMaker.stringTrim = function(str)
{
	var whitespace = ' \n\r\t\f\x0b\xa0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000';
	for (var i = 0; i < str.length; i++) {
		if (whitespace.indexOf(str.charAt(i)) === -1) {
			str = str.substring(i);
			break;
		}
	}
	for (i = str.length - 1; i >= 0; i--) {
		if (whitespace.indexOf(str.charAt(i)) === -1) {
			str = str.substring(0, i + 1);
			break;
		}
	}
	return whitespace.indexOf(str.charAt(0)) === -1 ? str : '';
};
//@method stringEndsWith @static
JsDocMaker.stringEndsWith = function(str, suffix) 
{
	str = str || '';
	return str.indexOf(suffix, str.length - suffix.length) !== -1;
}; 
//@method stringEndsWith @static
JsDocMaker.startsWith = function(s, prefix)
{
	s = s || '';
	return s.indexOf(prefix)===0;
}; 

//@method error @param {String}msg
JsDocMaker.prototype.error = function(msg)
{
	console.error('Error detected: ' + msg); 
	// throw msg;
}; 


// JsDocMaker.getChildren = function(node, compareProperties)
// {
// 	var a = []
// }; 
// JsDocMaker.getAChildren = function(node, compareProperties)
// {
// 	var c = JsDocMaker.getChildren(node, compareProperties);
// 	return (c && c.length) ? return c[0] : null;
// }; 