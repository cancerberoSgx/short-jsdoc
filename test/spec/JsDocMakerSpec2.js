

	describe("issues", function() 
	{	
		it("using different comment syntax for method and param", function() 
		{
			var code = 
				'//@module issues' + '\n' +	
				'/*@class Mercury some text ' + '\n' +	
				'@method method1' + '\n' +	
				'@return {Array} some text*/' + '\n' +
				'//@param {String} param1 some text' + '\n' +	
				''; 

			var maker = new JsDocMaker();

			//then do the parsing
			maker.parseFile(code); 
			maker.postProccess();
			maker.postProccessBinding();
			var jsdoc = maker.data;

			var Mercury = jsdoc.classes['issues.Mercury'];

			//this is OK the method is OK
			expect(Mercury.methods.method1.absoluteName).toBe('issues.Mercury.method1');

			//this is error - the param is not defined
			expect(Mercury.params).toBeDefined();
		});
	});





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

