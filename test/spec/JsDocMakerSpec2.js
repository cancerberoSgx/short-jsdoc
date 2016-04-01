var JsDocMaker = typeof _ === 'undefined' ? require('../../src/jsdocmaker/main.js') : JsDocMaker; 
var _ = typeof _ === 'undefined' ? require('underscore') : _; 

describe("marks in text from different places issue", function() 
{

	it("issue: text marks from different files are broken", function() 
	{
		var jsdoc, maker; 

		maker = new JsDocMaker();		
		maker.addFile(
			'//@module shared' + '\n' +

			'//@classTarget' + '\n' +

			'//@class shared1' + '\n' +
			'//Text from file1 - @?class Target -' + '\n' +
			'', 'file1.js'
		);
		maker.addFile(
			'//@module shared' + '\n' +
			'//@class shared1' + '\n' +
			'//Text from file2 - @?class Target -' + '\n' +
			'', 'file2.js'
		);

		jsdoc = maker.jsdoc();
		maker.postProccess();
		maker.postProccessBinding();

		
		console.log(jsdoc.classes['shared.shared1'])
	});
});