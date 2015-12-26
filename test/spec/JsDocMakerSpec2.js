var JsDocMaker = typeof _ === 'undefined' ? require('../../src/jsdocmaker/main.js') : JsDocMaker; 
var _ = typeof _ === 'undefined' ? require('underscore') : _; 

describe("@mtadata annotation", function() 
{

	it("@the ast metadata say how concepts should be named for third party tools like the html app or other any metadata needed", function() 
	{
		var jsdoc, maker; 
		var code =
			'//@metadata class.name My Chapter' + '\n' +
			'//@module m' + '\n' +
			'//@class c' + '\n' +
			'';

		maker = new JsDocMaker();		
		maker.addFile(code, 'name.js');

		jsdoc = maker.jsdoc();
		maker.postProccess();
		maker.postProccessBinding();

		expect(jsdoc.metadata['class.name']==='My Chapter').toBe(true)
		// console.log(jsdoc.metadata)
	});
});