

describe("inherited mthods and properties", function() 
{
		

	describe("types with spacess", function() 
	{
		it("types can contain spaces", function() 
		{
			var code = 
				'//@module stuff1' + '\n' +	
				'//@class Something' + '\n' +				
				'//@property {Object<String, Array<String > >} aProperty' + '\n' +'';
			var maker = new JsDocMaker();
			maker.parseFile(code); 
			maker.postProccess();
			maker.postProccessBinding();
			var jsdoc = maker.data;

			var type = jsdoc.classes['stuff1.Something'].properties.aProperty.type;
			expect(type.name).toBe('Object'); 
			expect(type.params[0].name).toBe('String'); 
			expect(type.params[1].name).toBe('Array'); 
			expect(type.params[1].params[0].name).toBe('String'); 
		});
	});

});


