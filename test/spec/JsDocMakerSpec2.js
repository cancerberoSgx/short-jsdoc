

	describe("support a literal object custom type implementation", function() 
	{	
		it("example1: we define the custom type syntax {#lemmon(prop1)} that returns a relevant type object", function() 
		{
			var code = 
				'//@module customTypeParsers2' + '\n' +	
				'/*@class Vanilla2 some text ' + '\n' +	
				'@method method1' + '\n' +	
				'@return {#obj(prop:Type,prop2:Type2)} */' + '\n' +
				''; 

			var maker = new JsDocMaker();
			maker.literalObjectInstall();

			//then do the parsing
			maker.parseFile(code); 
			maker.postProccess();
			maker.postProccessBinding();
			var jsdoc = maker.data;

			var Vanilla = jsdoc.classes['customTypeParsers2.Vanilla2'];
			var returns = Vanilla.methods.method1.returns; 
			expect(returns.type.name).toBe('Object');
			expect(returns.type.objectProperties.prop.name).toBe('Type');
			expect(returns.type.objectProperties.prop2.name).toBe('Type2');
		});
	});
