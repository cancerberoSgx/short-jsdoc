var JsDocMaker = typeof _ === 'undefined' ? require('../../src/jsdocmaker/main.js') : JsDocMaker; 
var _ = typeof _ === 'undefined' ? require('underscore') : _; 

describe("dependencies", function() 
{

	it("class extends bug", function() 
	{
		var jsdoc, maker; 
		var code = 
			'/*' + '\n' +
			'@module a @class A @class B sl kdfjslkd f @class C @class B @extends A' + '\n' +
			'*/ ' + '\n' +
			'';

		maker = new JsDocMaker();		
		maker.addFile(code, 'name.js');

		jsdoc = maker.jsdoc();
		maker.postProccess();
		maker.postProccessBinding();

		expect(jsdoc.classes['a.B'].extends.absoluteName).toBe('a.A'); 
	});

});