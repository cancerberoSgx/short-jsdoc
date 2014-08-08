describe("typeParser", function() 
{
	describe("Basic", function() 
	{

		it("parseType", function() 
		{
			var parsed = JsDocMaker.parseType('Map<String,Array<Apple>>'); 
			expect(parsed.name).toBe('Map'); 
			expect(parsed.params[0]).toBe('String'); 
			expect(parsed.params[1].name).toBe('Array'); 
			expect(parsed.params[1].params[0]).toBe('Apple'); 
		}); 

	});

});

