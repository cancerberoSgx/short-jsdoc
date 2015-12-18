var JsDocMaker = typeof _ === 'undefined' ? require('../../src/jsdocmaker/main.js') : JsDocMaker; 
var _ = typeof _ === 'undefined' ? require('underscore') : _; 

describe("@function", function() 
{

	it("a module can contain functions", function() 
	{
		var jsdoc, maker; 
		var code = 
			'/*' + '\n' +
			'@module Module.With.Dots' + '\n' +  			
			'@class Class.With.Dots @extend OtherClass.With.Dots '+'\n'+
			'@method beEatenBy apples have this privilege' + '\n' +
			'@return {String} bla bla' + '\n' +
			'@thows {Error} bla bla' + '\n' +
			'@param {Number} p1 bla bla' + '\n' +
			'*/' + '\n' +
			'';

		maker = new JsDocMaker();		
		maker.addFile(code, 'name.js');

		jsdoc = maker.jsdoc();
		maker.postProccess();
		maker.postProccessBinding();

		// expect(jsdoc.classes['a.Apple'].methods['beEatenBy'].params).toBe(3)

		console.log(jsdoc.classes['Module.With.Dots.Class.With.Dots'])
	});

});