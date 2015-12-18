var JsDocMaker = typeof _ === 'undefined' ? require('../../src/jsdocmaker/main.js') : JsDocMaker; 
var _ = typeof _ === 'undefined' ? require('underscore') : _; 

describe("@function", function() 
{

	it("a module can contain functions", function() 
	{
		var jsdoc, maker; 
		var code =

			'//@module m1' + '\n' + 
			'//#title 1' + '\n' +
			'//This is a paragraph 1l slkdjf lskdjflkdf' + '\n' +
			'//paragraph 1 still continue lksjdflskdjlf' + '\n' +
			'//' + '\n' +
			'//this is pargaraph 2 lskdjf lsk flk sjldf' + '\n' +
			'//still paragraph 2lsdkjf lksjdlf skjldf' + '\n' +
			'';

		maker = new JsDocMaker();		
		maker.addFile(code, 'name.js');

		jsdoc = maker.jsdoc();
		maker.postProccess();
		maker.postProccessBinding();

		// expect(jsdoc.classes['a.Apple'].methods['beEatenBy'].params).toBe(3)

		console.log(jsdoc.modules['m1'].text)
	});

});