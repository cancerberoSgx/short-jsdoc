
describe("respect original comment indentation", function() 
{

	it("that", function() 
	{
		var jsdoc, maker; 
		var code = 
			'\t\t\t/*' + '\n' +
			'\t\t\t@module a' + '\n' +
			'\t\t\tSome text here' + '\n' +
			'\t\t\t\tfunction f(){' + '\n' +
			'\t\t\t\t\tvar a = [ ' + '\n' +
			'\t\t\t\t\t\t1.2' + '\n' +
			'\t\t\t\t\t,\t1.3' + '\n' +
			'\t\t\t\t\t,\t1.4' + '\n' +
			'\t\t\t\t\t};  ' + '\n' +
			'\t\t\t\t}' + '\n' +
			'\t\t\t*/ ' + '\n' +
			'';

		maker = new JsDocMaker();
		
		
		maker.addFile(code, 'name.js');


		jsdoc = maker.jsdoc();
		maker.postProccess();
		maker.postProccessBinding();

		expect(jsdoc.modules['a'].text).toBe('Some text here\n	function f(){\n		var a = [ \n			1.2\n		,	1.3\n		,	1.4\n		};  \n	}'); 

	});

});