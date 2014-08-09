describe("JsDocMaker", function() 
{
	describe("Basic jsdoc parser", function() 
	{
		var jsdoc, maker, Apple, Lion, Lemon; 

		beforeEach(function() 
		{
			var code = 
				'//@class Lemon'+'\n'+
				'//@class Apple @extend Fruit @module livingThings'+'\n'+
				'/*@method beEatenBy apples have this privilege @param {Mouth} mouth the mouth to be used @param {Int} amount @return {String} the bla*/' + '\n' +
				'//@property {Color} color the main color of this fruit'+'\n'+
				'//@class Lion the lion class is on living things'+'\n'+
				'';
			maker = new JsDocMaker();
			maker.parseFile(code, 'textarea');
			maker.postProccess();
			maker.postProccessBinding();
			jsdoc = maker.data;
		});

		it("init", function() 
		{
			Apple = jsdoc.classes['livingThings.Apple']; 
			expect(Apple).toBeDefined();
			
			Lion = jsdoc.classes['livingThings.Lion']; 
			expect(Lion).toBeDefined();

			Lemon = jsdoc.classes['__DefaultModule.Lemon']; 
			expect(Lemon).toBeDefined();
		});

		it("classes and modules", function() 
		{
			expect(Lemon.extends.name).toBe('Object');

			expect(jsdoc.modules.livingThings).toBeDefined();

			expect(Apple.module.name).toBe('livingThings');
			expect(Apple.absoluteName).toBe('livingThings.Apple');

			//extends is not binded because we never declared the parent class
			expect(Apple.extends.name).toBe('Fruit');
			expect(Apple.extends.error).toBe('NAME_NOT_FOUND');

			expect(Lion.module.name).toBe('livingThings'); 
		});

		it("methods", function() 
		{
			expect(Apple.methods.beEatenBy).toBeDefined();
			expect(Apple.methods.beEatenBy.absoluteName).toBe('livingThings.Apple.beEatenBy');
		});

		it("properties", function() 
		{
			expect(Apple.properties.color.name).toBe('color');
			expect(Apple.properties.color.type.name).toBe('Color');
		});		

		it("method's params", function() 
		{
			expect(Apple.methods.beEatenBy.params.length).toBe(2);
			expect(Apple.methods.beEatenBy.params[0].name).toBe('mouth');
			expect(Apple.methods.beEatenBy.params[0].type.name).toBe('Mouth');
			expect(Apple.methods.beEatenBy.params[0].type.error).toBe('NAME_NOT_FOUND'); //because it was never declared
			expect(Apple.methods.beEatenBy.params[0].text).toBe('the mouth to be used');		

			expect(Apple.methods.beEatenBy.params[1].name).toBe('amount');
			expect(Apple.methods.beEatenBy.params[1].type.name).toBe('Int');
		});

		it("method's return", function() 
		{
			expect(Apple.methods.beEatenBy.returns.type.name).toBe('String');
			expect(Apple.methods.beEatenBy.returns.text).toBe('the bla');
		});
	});



	describe("type binding & generics", function() 
	{
		var jsdoc, maker; 

		beforeEach(function() 
		{
			var code = 
				'//@class Animal @module livingThings2' + '\n' +
				'//@method run @param {int} amount in kilometers @final @static' + '\n' + 
				'//@class Monkey @extend Animal @module livingThings2' + '\n' +
				'//@method eat way of feeding' + '\n' +
				'//@param {Int} amount' + '\n' +
				'//@param {Food} food what is eaten' + '\n' +
				'//@return {Energy} the total energy generated afte rthe proccess' + '\n' +
				''; 
			maker = new JsDocMaker();
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
	});


	describe("custom native types", function() 
	{
		var jsdoc, maker; 

		beforeEach(function() 
		{
			var code = 
				'//@class Machine @module office' + '\n' +
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
			var param1 = Machine.methods.calculate.params[0].type.params[1].params[0];
			expect(param1.name).toBe('HomeFinance');
			expect(param1.nativeTypeUrl).toBe('http://mylang.com/api/HomeFinance');
			var param2 = Machine.properties.eye.type; 
			expect(param2.name).toBe('Bag');
			expect(param2.nativeTypeUrl).toBe('http://mylang.com/api/Bag');
		});
	});

});

