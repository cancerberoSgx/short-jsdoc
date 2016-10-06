var JsDocMaker = typeof _ === 'undefined' ? require('../../src/jsdocmaker/main.js') : JsDocMaker; 
var _ = typeof _ === 'undefined' ? require('underscore') : _; 

describe("marks in text from different places issue", function() 
{

	it("issue: text marks from different files are broken", function() 
	{
		var jsdoc, maker; 

		maker = new JsDocMaker();		
		maker.addFile(
			'//@module multiinher' + '\n' +

			'//@class Foo1' + '\n' +
			'//@class Foo2' + '\n' +
			'//@class Foo3' + '\n' +
			'//@extends Foo1' + '\n' +
			'//@extends Foo2' + '\n' +

			'', 'file1.js'
		);
		// maker.addFile(
		// 	'//@module shared' + '\n' +
		// 	'//@class shared1' + '\n' +
		// 	'//Text from file2 - @?class Target -' + '\n' +
		// 	'', 'file2.js'
		// );

		jsdoc = maker.jsdoc();
		maker.postProccess();
		maker.postProccessBinding();

		debugger;
		
		console.log(jsdoc.classes['shared.shared1'])
	});
});