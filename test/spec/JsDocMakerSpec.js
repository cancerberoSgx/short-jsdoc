describe("JsDocMaker", function() 
{

	describe("Basic jsdoc parser", function() 
	{
		var jsdoc, maker; 

		beforeEach(function() 
		{
			var code = 
				'//@class Apple @extend Fruit @module livingThings'+'\n'+
				'/*@method beEatenBy apples have this privilege @param {Mouth} mouth the mouth to be used @param {Int} amount */' + '\n' +
				'//@property {Color} color the main color of this fruit'+'\n'+
				'//@class Lion the lion class is on living things'+'\n'+
				'';
			maker = new JsDocMaker();
			maker.parseFile(code, 'textarea');
			maker.postProccess();
			maker.postProccessBinding();
			jsdoc = maker.data;
		});

		it("classes and modules", function() 
		{
			expect(jsdoc.modules.livingThings).toBeDefined();
			var Apple = jsdoc.classes['livingThings.Apple']; 
			expect(Apple).toBeDefined();

			expect(Apple.module.name).toBe('livingThings');
			expect(Apple.absoluteName).toBe('livingThings.Apple');

			//extends is not binded because we never declared the parent class
			expect(Apple.extends.name).toBe('Fruit');
			expect(Apple.extends.error).toBe('NAME_NOT_FOUND');

			var Lion = jsdoc.classes['livingThings.Lion']; 
			expect(Lion).toBeDefined();
			expect(Lion.module.name).toBe('livingThings'); 
		});

		it("methods", function() 
		{
			var Apple = jsdoc.classes['livingThings.Apple']; 
			expect(Apple.methods.beEatenBy).toBeDefined();
			expect(Apple.methods.beEatenBy.absoluteName).toBe('livingThings.Apple.beEatenBy');
		});

		it("properties", function() 
		{
			var Apple = jsdoc.classes['livingThings.Apple']; 
			expect(Apple.properties.color.name).toBe('color');
			expect(Apple.properties.color.type.name).toBe('Color');
		});		

		it("method's params", function() 
		{
			var Apple = jsdoc.classes['livingThings.Apple']; 
			
			expect(Apple.methods.beEatenBy.params.length).toBe(2);
			expect(Apple.methods.beEatenBy.params[0].name).toBe('mouth');
			expect(Apple.methods.beEatenBy.params[0].type.name).toBe('Mouth');
			expect(Apple.methods.beEatenBy.params[0].type.error).toBe('NAME_NOT_FOUND'); //because it was never declared
			expect(Apple.methods.beEatenBy.params[0].text).toBe('the mouth to be used');		

			expect(Apple.methods.beEatenBy.params[1].name).toBe('amount');
			expect(Apple.methods.beEatenBy.params[1].type.name).toBe('Int');
		});
	});



	describe("extends binds the types", function() 
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


		it("parseType", function() 
		{
			var parsed = JsDocMaker.parseType('Map<String,Array<Apple>>'); 
			expect(parsed.name).toBe('Map'); 
			expect(parsed.params[0]).toBe('String'); 
			expect(parsed.params[1].name).toBe('Array'); 
			expect(parsed.params[1].params[0]).toBe('Apple'); 
		}); 

	});


	describe("extends binds the types with generics", function() 
	{
		var jsdoc, maker; 

		beforeEach(function() 
		{
			var code = 
				'//@class Machine @module office' + '\n' +
				'//@method calculate @param {Object<String,Array<Number>>} environment @final @static' + '\n' + 
				'//@property {Array<Eye>} eye' + '\n' +
				'//@class Eye a reutilizable eye @module office' + '\n' +
				''; 
			maker = new JsDocMaker();
			maker.parseFile(code, 'genericstest1'); 
			maker.postProccess();
			maker.postProccessBinding();
			jsdoc = maker.data;
		});

		it("should be able to parse some javascript code", function() 
		{
			var paramType = jsdoc.classes['office.Machine'].methods.calculate.params[0].type; 
			expect(paramType.name).toBe('Object'); 
			expect(paramType.params[0].name).toBe('String'); 
			expect(paramType.params[1].name).toBe('Array'); 
			expect(paramType.params[1].params[0].name).toBe('Number'); 

			var propType = jsdoc.classes['office.Machine'].properties.eye.type;
			expect(propType.name).toBe('Array'); 
			expect(propType.nativeTypeUrl.indexOf('http')===0).toBe(true); 
			expect(propType.params[0].name).toBe('Eye'); 
			expect(propType.params[0].text).toBe('a reutilizable eye'); 
		});

	});

});

