



	describe("type binding & generics", function() 
	{
		var jsdoc, maker; 

		beforeEach(function() 
		{
			var code = 
				'//@module livingThings2' + '\n' +
				'//@class Animal ' + '\n' +
				'//@method run @param {int} amount in kilometers @final @static @myownmodifier' + '\n' + 
				'//@class Monkey @extend Animal @module livingThings2' + '\n' +
				'//@method eat way of feeding' + '\n' +
				'//@param {Int} amount' + '\n' +
				'//@param {Food} food what is eaten' + '\n' +
				'//@return {Energy} the total energy generated afte rthe proccess' + '\n' +
				''; 
			maker = new JsDocMaker();

			debugger;
			//registering a new modifier
			JsDocMaker.MODIFIERS.push('myownmodifier');

			maker.parseFile(code, 'textarea'); 
			maker.postProccess();
			maker.postProccessBinding();
			jsdoc = maker.data;
		});

		it("should be able to parse some javascript code", function() 
		{
			expect(jsdoc.modules.livingThings2).toBeDefined();
			var Monkey = jsdoc.classes['livingThings2.Monkey']; 
			expect(Monkey).toBeDefined();
			expect(Monkey.absoluteName).toBe('livingThings2.Monkey');
			expect(Monkey.name).toBe('Monkey');

			expect(Monkey.extends.name).toBe('Animal');
			expect(Monkey.extends.absoluteName).toBe('livingThings2.Animal');
			expect(Monkey.extends.name).toBe('Animal');
			expect(Monkey.extends.methods.run.params.length).toBe(1);
			expect(_(Monkey.extends.methods.run.modifiers).contains('final')).toBe(true);
			expect(_(Monkey.extends.methods.run.modifiers).contains('static')).toBe(true);	
		});

		it("I can register my own modifiers before parsing", function() 
		{
			var Animal = jsdoc.classes['livingThings2.Animal'];
			debugger;
			expect(_(Animal.methods.run.modifiers).contains('myownmodifier')).toBe(true);			
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

