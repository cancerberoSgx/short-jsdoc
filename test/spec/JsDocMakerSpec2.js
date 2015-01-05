

describe("@method getState @returns {name:String,colors:Array<Color>,car:Car}", function() 
{
	var jsdoc, maker; 

	beforeEach(function() 
	{
		var code = 
			'//@module mymodule' + '\n' +

			'//@class Easy easy named class' + '\n' +

			'//@method getState @returns {name:String,colors:Array<Color>,car:Car}' + '\n' +

			''; 

		maker = new JsDocMaker();
		maker.parseFile(code, 'textarea'); 
		maker.postProccess();
		maker.postProccessBinding();
		jsdoc = maker.data;
	});

	it("classes with all accepted chars referred from complex objects", function() 
	{
		debugger;
	});

});