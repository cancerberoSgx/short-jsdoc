function parseCode (code)
{
	jsindentator.setStyle(jsindentator.styles.jsdocgenerator1);
	var result = jsindentator.main(code, {});
	if(result instanceof Error) 
	{
		expect('ERROR: Given javascript couldn\'t be parsed!, reason: '+result).toBe(false); 
	}
	var jsdoc = jsindentator.styles.jsdocgenerator1.jsdocClasses; 
	return jsdoc;
}; 

describe("JsDocMaker", function() 
{

	describe("Basic jsdoc parser", function() 
	{
		var jsdoc; 

		beforeEach(function() 
		{
			ns.styles.jsdocgenerator1.jsMakerInstance.data=null; //reset the parser
	 		jsdoc = parseCode(
				'//@class Apple @extend Fruit @module livingThings\n'+
				'/*@method beEatenBy apples have this privilege @param {Mouth} mouth the mouth to be used @param {Int} amount */'
			); 
			console.log('seba', jsdoc.classes['livingThings.Apple'].methods.beEatenBy.absoluteName)
		});

		it("classes and modules", function() 
		{
			expect(jsdoc.modules.livingThings).toBeDefined();
			var Apple = jsdoc.classes['livingThings.Apple']; 
			expect(Apple).toBeDefined();

			expect(Apple.module).toBe('livingThings');
			expect(Apple.extends).toBe('Fruit');
			expect(Apple.absoluteName).toBe('livingThings.Apple');
		});

		it("methods", function() 
		{
			var Apple = jsdoc.classes['livingThings.Apple']; 
			expect(Apple.methods.beEatenBy).toBeDefined();
			expect(Apple.methods.beEatenBy.absoluteName).toBe('livingThings.Apple.beEatenBy');
			debugger;
		});			

		it("method's params", function() 
		{
			var Apple = jsdoc.classes['livingThings.Apple']; 
			expect(Apple.methods.beEatenBy.params.length).toBe(2);
			expect(Apple.methods.beEatenBy.params[0].name).toBe('mouth');
			expect(Apple.methods.beEatenBy.params[0].type).toBe('{Mouth}');
			expect(Apple.methods.beEatenBy.params[0].text).toBe('the mouth to be used');		

			expect(Apple.methods.beEatenBy.params[1].name).toBe('amount');
			expect(Apple.methods.beEatenBy.params[1].type).toBe('{Int}');
		});
	});

});




