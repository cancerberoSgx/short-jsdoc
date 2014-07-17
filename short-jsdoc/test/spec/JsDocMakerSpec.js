describe("JsDocMaker", function() {
	// var player;
	// var song;

	beforeEach(function() {
		// player = new Player();
		// song = new Song();
	});

	it("should be able to parse some javascript code", function() {

		var code = '//@class Apple @extend Fruit @module livingThings'; 
		jsindentator.setStyle(jsindentator.styles.jsdocgenerator1);
		var result = jsindentator.main(code, {});
		if(result instanceof Error) 
		{
			fail('ERROR: Given javascript couldn\'t be parsed!, reason: '+result); 
			// alert('ERROR: Given javascript couldn\'t be parsed!, reason: '+result); 
			// return;
		}
		var jsdoc = jsindentator.styles.jsdocgenerator1.jsdocClasses; 
		expect(_(jsdoc.classes).keys().length).toBe(1); 
		expect(_(jsdoc.modules).keys().length).toBe(1); 
		expect(jsdoc.classes['Apple']).toBeDefined(); 
		expect(jsdoc.classes['Apple'].module).toBe('livingThings');     

	});

});

