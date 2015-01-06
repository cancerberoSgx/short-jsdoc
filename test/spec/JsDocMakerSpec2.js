

describe("parsing multiple files using addFile and jsdoc()", function() 
{
	var jsdoc, maker; 

	beforeEach(function() 
	{
		var files = {
			'code1.js':
				'//@module mymodule' + '\n' +
				'//@class Easy easy named class' + '\n' +
				'//@method getState @returns {Car}' + '\n' +
				''
		,	'/opt/lamp/code2.js':
			'//@module mymodule2' + '\n' +
			'//@class Easy2 easy named class' + '\n' +
			'//@method getState2 @returns {Car2}' + '\n' +
			''
		}; 

		maker = new JsDocMaker();

		_(files).each(function(value, name)
		{
			maker.addFile(value, name);
		}); 

		jsdoc = maker.jsdoc();
	});

	it("classes with all accepted chars referred from complex objects", function() 
	{
		var m = jsdoc.classes['mymodule.Easy'].methods.getState;
		expect(jsdoc.classes['mymodule.Easy'].file.fileName).toBe('code1.js'); 
		expect(jsdoc.classes['mymodule2.Easy2'].methods.getState2.file.fileName).toBe('/opt/lamp/code2.js'); 
	});

});