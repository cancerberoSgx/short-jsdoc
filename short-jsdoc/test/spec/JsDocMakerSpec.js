describe("JsDocMaker", function() {

	// beforeEach(function() {	});

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
	}

	it("should be able to parse some javascript code", function() 
	{
		var jsdoc = parseCode(
			'//@class Apple @extend Fruit @module livingThings\n'+
			'/*@method beEatenBy apples have this privilege @param {Mouth} mouth the mouth to be used @param {Int} amount */'
		); 

		expect(jsdoc.modules.livingThings).toBeDefined();
		expect(jsdoc.classes.Apple).toBeDefined();

		expect(jsdoc.classes.Apple.module).toBe('livingThings');
		expect(jsdoc.classes.Apple.extends).toBe('Fruit');

		expect(jsdoc.classes.Apple.methods.beEatenBy).toBeDefined();
		expect(jsdoc.classes.Apple.methods.beEatenBy.params.length).toBe(2);
		expect(jsdoc.classes.Apple.methods.beEatenBy.params[0].name).toBe('mouth');
		expect(jsdoc.classes.Apple.methods.beEatenBy.params[0].type).toBe('{Mouth}');
		expect(jsdoc.classes.Apple.methods.beEatenBy.params[0].text).toBe('the mouth to be used');		

		expect(jsdoc.classes.Apple.methods.beEatenBy.params[1].name).toBe('amount');
		expect(jsdoc.classes.Apple.methods.beEatenBy.params[1].type).toBe('{Int}');
	});



});




