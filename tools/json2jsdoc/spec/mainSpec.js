var json2jsdoc = require('../src'); 
var _ = require('underscore'); 


describe("json2jsdoc", function() 
{

it("json string", function(done) 
{
	var config = {
		json: '{"name":"Seba","car":{"branch":"fiat"},"roles":["admin","dev"],"fruits":[{"color":123222,"name":"banana"}]}'
	,	mainType: 'Person'
	,	callback: function(output)
		{
			expect(output.indexOf('/* @class Person @property {String} name @property {Person_car} car @class Person_car @property {String} branch @class Person_car @property {Array<String>} roles @property {Array<Array<String>>} fruits */')!==-1).toBe(true); 
			// console.log('output\n', output)
			done();
		}
	,	linesToText: function(lines){return '/* ' + lines.join(' ') + ' */';}
	}; 
	json2jsdoc.main(config);
	// expect(strange.returns.textMarks._shortjsdoc_textmarkplugin_9.linkUrl).toBe('http://google.com/'); 
	
});

it("request", function(done) 
{
	json2jsdoc.main({
		resource: 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22nome%2C%20ak%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys'
		// http: 'http://www.google.com'
	,	mainType: 'WeatherQuery'
	,	callback: function(output)
		{
			// expect(output.indexOf('/* @class Person @property {String} name @property {Person_car} car @class Person_car @property {String} branch @class Person_car @property {Array<String>} roles @property {Array<Array<String>>} fruits */')!==-1).toBe(true); 
			console.log('output\n', output)
			done();
		}
	// ,	linesToText: function(lines){return '/* ' + lines.join(' ') + ' */';}
	});
	
}, 20000); //big timeout for this one

});
