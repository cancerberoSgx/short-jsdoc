

describe("inherited mthods and properties", function() 
{
		
	describe("multiple types", function() 
	{
		it("user can use recurseAST to install a visitor for doing its own post processing", function() 
		{

			var code = 
				'//@module cssutils' + '\n' +	
				'//@class CSSExtractor' + '\n' +
				'//@method extract @param {String|HTMLElement|jQuery|Array<HTMLElement>|Object<String,Array<String>>} el @return {Object}' + '\n' + 
				'';
			var maker = new JsDocMaker();
			maker.parseFile(code); 
			maker.postProccess();
			maker.postProccessBinding();
			var jsdoc = maker.data;

			var type = jsdoc.classes['cssutils.CSSExtractor'].methods.extract.params[0].type; 
			expect(_(type).isArray()).toBe(true); 
			expect(type.length).toBe(5); 
			expect(type[0].name).toBe('String');
			expect(_(type[0].nativeTypeUrl).isString()).toBe(true); 

			expect(type[1].name).toBe('HTMLElement');
			expect(type[2].name).toBe('jQuery');

			expect(type[3].name).toBe('Array');
			expect(_(type[3].nativeTypeUrl).isString()).toBe(true); 
			expect(type[3].params.length).toBe(1);
			expect(type[3].params[0].name).toBe('HTMLElement');


			expect(type[4].name).toBe('Object');
			expect(type[4].params.length).toBe(2);
			expect(type[4].params[0].name).toBe('String');
			expect(type[4].params[1].name).toBe('Array');
			expect(type[4].params[1].params[0].name).toBe('String');
		
		});
	});
});


