describe("type parsers", function() 
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

		it("parseLiteralObjectType", function() 
		{
			var parsed = JsDocMaker.parseLiteralObjectType('{prop1:Map<String,Array<Apple>>,prop2:String}'); 
			expect(parsed.prop1.name).toBe('Map'); 
			expect(parsed.prop1.params[0]).toBe('String'); 
			expect(parsed.prop1.params[1].name).toBe('Array'); 
			expect(parsed.prop1.params[1].params[0]).toBe('Apple'); 
			expect(parsed.prop2).toBe('String'); //no type object, just the string
		}); 
	});

});

