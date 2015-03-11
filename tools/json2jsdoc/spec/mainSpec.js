var json2jsdoc = require('../src'); 
var _ = require('underscore'); 

describe("todo", function() 
{

it("todo", function() 
{
	var config = {
		json: '{"name":"Seba","car":{"branch":"fiat"},"roles":["admin","dev"]}'
	,	mainType: 'Person'
	}; 
	var output = json2jsdoc.main(config);
	console.log('output\n', output)
	// expect(strange.returns.textMarks._shortjsdoc_textmarkplugin_9.linkUrl).toBe('http://google.com/'); 
	
});

});
