

	describe("custom native types", function() 
	{
		var jsdoc, maker; 

		beforeEach(function() 
		{
			var code = 

				'//@module office' + '\n' +	

				// '//@class Machine TODO some text documenting the machine here please' + '\n' +

				'//@class Machine' + '\n' +
				'//TODO some text documenting the machine here please' + '\n' +

				'//@method calculate @param {Object<String,Array<HomeFinance>>} finances' + '\n' + 
				'//@property {Bag<Eye>} eye' + '\n' +
				'//@class Eye a reutilizable eye' + '\n' +	
				'';
			maker = new JsDocMaker();

			//before parsing we register the custom native types Bag and HomeFinance. Just give an url.
			_(maker.customNativeTypes).extend({
				Bag: 'http://mylang.com/api/Bag'
			,	HomeFinance: 'http://mylang.com/api/HomeFinance'
			}); 

			maker.parseFile(code, 'genericstest1'); 
			maker.postProccess();
			maker.postProccessBinding();
			jsdoc = maker.data;
		});

		it("custom natives should be binded", function() 
		{
			var Machine = jsdoc.classes['office.Machine'];
			// debugger;
			expect(Machine.text).toBe('TODO some text documenting the machine here please');
			var param1 = Machine.methods.calculate.params[0].type.params[1].params[0];
			expect(param1.name).toBe('HomeFinance');
			expect(param1.nativeTypeUrl).toBe('http://mylang.com/api/HomeFinance');
			var param2 = Machine.properties.eye.type; 
			expect(param2.name).toBe('Bag');
			expect(param2.nativeTypeUrl).toBe('http://mylang.com/api/Bag');
		});
	});

