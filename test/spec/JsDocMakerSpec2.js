

	describe("support custom type parsers", function() 
	{			
		describe("same", function() 
		{
			it("example1: we define the custom type syntax {#lemmon(prop1)} that returns a relevant type object", function() 
			{
				var code = 
					'//@module customTypeParsers' + '\n' +	
					'/*@class Vanilla some text ' + '\n' +	
					'@method method1' + '\n' +	
					'@return {#lemmon(acid,lazy,green)} */' + '\n' +
					''; 

				var maker = new JsDocMaker();

				var customTypeParser = {
					name: 'lemmon'
				,	parse: function(s)
					{
						return {
							name: 'Object'
						,	lemmonProperties: s.split(',')
						}; 
					}
				};
				maker.registerTypeParser(customTypeParser); 

				//then do the parsing
				maker.parseFile(code); 
				maker.postProccess();
				maker.postProccessBinding();
				var jsdoc = maker.data;

				var Vanilla = jsdoc.classes['customTypeParsers.Vanilla'];
				var return1 = Vanilla.methods.method1.returns.type; 
				expect(return1.lemmonProperties[0]).toBe('acid'); 
				expect(return1.lemmonProperties[1]).toBe('lazy'); 
				expect(return1.lemmonProperties[2]).toBe('green'); 
				expect(return1.name).toBe('Object'); 
			});
		});

	});
