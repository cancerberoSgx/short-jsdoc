



	describe("method throw exception", function() 
	{
		var jsdoc, maker; 

		beforeEach(function() 
		{
			var code = 
				'//@module throwtest1' + '\n' +
				'//@class CompilerException special exception for compiler errors @extends IOException ' + '\n' +
				'//@param {Number} error_line @param {String} error_msg' + '\n' +
				'//@class IOException throwed when an IO error occurs @extends Error ' + '\n' +
				'//@class Thrower ' + '\n' +
				'//@method method1 @param {String} p some text' + '\n' + 
				'//@throws {IOException} if a IO error occurs' + '\n' + 
				'//@throws {CompilerException} if a compiler error error occurs' + '\n' + 

				
				''; 
			maker = new JsDocMaker();
			maker.parseFile(code, 'textarea'); 
			maker.postProccess();
			maker.postProccessBinding();
			jsdoc = maker.data;
		});

		it("@throws nodes have a type and text", function() 
		{
			var method1 = jsdoc.classes['throwtest1.Thrower'].methods.method1;

			expect(method1.throws[0].type.name).toBe('IOException'); 
			expect(method1.throws[0].text).toBe('if a IO error occurs'); 
			expect(method1.throws[0].type.text).toBe('throwed when an IO error occurs'); 
			expect(method1.throws[0].type.extends.name).toBe('Error'); 

			expect(method1.throws[1].type.name).toBe('CompilerException'); 
			expect(method1.throws[1].text).toBe('if a compiler error error occurs'); 
			expect(method1.throws[1].type.text).toBe('special exception for compiler errors'); 
			expect(method1.throws[1].type.extends.name).toBe('IOException'); 
		});

	});




	// describe("issues", function() 
	// {	
	// 	it("using different comment syntax for method and param", function() 
	// 	{
	// 		var code = 
	// 			'//@module issues' + '\n' +	
	// 			'/*@class Mercury some text ' + '\n' +	
	// 			'@method method1' + '\n' +	
	// 			'@return {Array} some text*/' + '\n' +
	// 			'//@param {String} param1 some text' + '\n' +	
	// 			''; 

	// 		var maker = new JsDocMaker();

	// 		//then do the parsing
	// 		maker.parseFile(code); 
	// 		maker.postProccess();
	// 		maker.postProccessBinding();
	// 		var jsdoc = maker.data;

	// 		var Mercury = jsdoc.classes['issues.Mercury'];

	// 		//this is OK the method is OK
	// 		expect(Mercury.methods.method1.absoluteName).toBe('issues.Mercury.method1');

	// 		//this is error - the param is not defined
	// 		expect(Mercury.params).toBeDefined();
	// 	});
	// });





// describe("support a literal object custom type implementation that is read from the text so we can use reserved characters {}''", function() 
// {	
// 	it("example2: let the user define its literalwe define the custom type syntax {#lemmon(prop1)} that returns a relevant type object", function() 
// 	{
// 		var code = 
// 			'//@module customTypeParsers2' + '\n' +	
// 			'/*@class Vanilla2 some text ' + '\n' +	
// 			'@method method1' + '\n' +	
// 			'@return {#rea()} {name:"Object",properties:...} */' + '\n' +
// 			''; 

// 		var maker = new JsDocMaker();
// 		maker.literalObjectInstall();

// 		//then do the parsing
// 		maker.parseFile(code); 
// 		maker.postProccess();
// 		maker.postProccessBinding();
// 		var jsdoc = maker.data;

// 		var Vanilla = jsdoc.classes['customTypeParsers2.Vanilla2'];
// 		var returns = Vanilla.methods.method1.returns; 
// 		expect(returns.type.name).toBe('Object');
// 		expect(returns.type.objectProperties.prop.name).toBe('Type');
// 		expect(returns.type.objectProperties.prop2.name).toBe('Type2');
// 	});
// });




// this is a real life tool. A problem of short-jsdoc current impl is that using reserved characters may break your jsdoc. 
// For example imagine you want to define a custom type syntax that contains the characters '{' '}' - that will break 
// the regexp that matches the annotation. 
// this can be solved b defining an extension consisting in a comment preprocessor and a AST postprocessor. 
// the preprocessor replace escaped characters like '\{' with unique keys that doesn't break the regexp. 
// then after the code is parsed an AST postprocessor wil fix all the output text
// blablabal better idea use the text for read the type definition.

