describe("JsDocMaker", function() 
{
	describe("Basic jsdoc parser", function() 
	{
		var jsdoc, maker, Apple, Lion, Lemon; 

		beforeEach(function() 
		{
			var code = 
				'//@class Lemon'+'\n'+
				'//this is a no module class'+'\n'+
				'//@constructor the Lemon public constructor signature @param {Color} color'+'\n'+
				'//?@method tricky this comment should be ignored b the parser because it starts with the special prefix ?'+'\n'+
				'//@method glow'+'\n'+

				'//@module livingThings'+'\n'+
				
				'//@class Apple @extend Fruit '+'\n'+
				'/*@method beEatenBy apples have this privilege @param {Mouth} mouth the mouth to be used @param {Int} amount @return {String} the bla*/' + '\n' +
				'//@property {Color} color the main color of this fruit'+'\n'+
				'//@class Lion the lion class is on living things'+'\n'+
				'//@event angry triggered when the lion gets angry'+'\n'+
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
			expect(Apple.properties.color.text).toBe('the main color of this fruit');
		});	

		it("events", function() 
		{
			expect(Lion.events.angry.name).toBe('angry');
			expect(Lion.events.angry.text).toBe('triggered when the lion gets angry');
		});	

		it("should ignore comments starting with '?' character", function() 
		{
			expect(Lemon.methods.glow.name).toBe('glow');
			expect(Lemon.methods.tricky).toBe(undefined); 
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
				'//@module livingThings2' + '\n' +
				'//@class Animal ' + '\n' +
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



	describe("Block comments shouln't remove the indentation chars", function() 
	{
		var jsdoc, maker, Apple, Lion, Lemon; 

		beforeEach(function() 
		{
			var code = 
				'/*'+'\n'+
				'@class Apple'+'\n'+
				'This is a comment that includes'+'\n'+
				'new lines and'+'\n'+
				'	some'+'\n'+
				'		indentation'+'\n'+
				''+'\n'+
				''+'\n'+
				'	var a = {a:1};'+'\n'+

				'@extends Vegetable'+'\n'+
				'*/'+'\n'+

				'/*@method beEatenBy apples have this privilege @param {Mouth} mouth the mouth to be used @param {Int} amount @return {String} the bla*/' + '\n' +	
				'';
			maker = new JsDocMaker();
			maker.parseFile(code, 'textarea');
			maker.postProccess();
			maker.postProccessBinding();
			jsdoc = maker.data;
		});

		it("init", function() 
		{
			Apple = jsdoc.classes['__DefaultModule.Apple']; 
			expect(Apple).toBeDefined();
			expect(Apple.text.indexOf('\n\tsome')>0).toBe(true);
			expect(Apple.text.indexOf('\n\t\tindentation')>0).toBe(true); 
			expect(Apple.text.indexOf('\n\n\tvar a = {a:1};')>0).toBe(true); 
			
		});
	});

	describe("lineCommentSeparator configurable property", function() 
	{
		var jsdoc, maker, C1; 

		beforeEach(function() 
		{
			var code = 
				'//@module m1'+'\n'+
				'//@class C1'+'\n'+
				'//Some C1 class text'+'\n'+
				'//Some other C1 class text'+'\n'+
				'';
			maker = new JsDocMaker();
			maker.lineCommentSeparator = '888898888';
			maker.parseFile(code, 'file1');
			maker.postProccess();
			maker.postProccessBinding();
			jsdoc = maker.data;
		});

		it("user can replace the strings between adjacent Line Comments", function() 
		{
			C1 = jsdoc.classes['m1.C1']; 
			expect(C1.text).toBe("888898888 Some C1 class text 888898888 Some other C1 class text");
		});
	});

	describe("module and class names can contain chars . and _", function() 
	{
		var jsdoc, maker, C1; 

		beforeEach(function() 
		{
			var code = 
				'//@module org.sgx.myprogram1'+'\n'+
				'//some tetx for this module'+'\n'+
				'//@class Program1'+'\n'+
				'//Some Program1 class text'+'\n'+
				'//@class Program1.Layout some other text'+'\n'+

				'//@module other_module this module name is separated with _'+'\n'+
				'//@class My_Program some other _ text @extends Program1.Layout'+'\n'+
				'';
			maker = new JsDocMaker();
			maker.parseFile(code, 'file1');
			maker.postProccess();
			maker.postProccessBinding();
			jsdoc = maker.data;
		});

		it(". should be able to be used in class and module names", function() 
		{
			var module = jsdoc.modules['org.sgx.myprogram1'];
			expect(module.name).toBe('org.sgx.myprogram1');
			expect(module.text).toBe('some tetx for this module');

			var Program1 = jsdoc.classes['org.sgx.myprogram1.Program1'];
			expect(Program1.name).toBe('Program1');
			expect(Program1.text).toBe('Some Program1 class text');

			var Program1Layout = jsdoc.classes['org.sgx.myprogram1.Program1.Layout'];
			expect(Program1Layout.name).toBe('Program1.Layout');
			expect(Program1Layout.text).toBe('some other text');
		});

		it("_ should be able to be used in class and module names", function() 
		{
			var other_module = jsdoc.modules.other_module;
			expect(other_module.name).toBe('other_module');
			expect(other_module.text).toBe('this module name is separated with _');

			var My_Program = jsdoc.classes['other_module.My_Program']; 
			expect(My_Program.name).toBe('My_Program');
			expect(My_Program.text).toBe('some other _ text');
			expect(My_Program.extends.absoluteName).toBe('org.sgx.myprogram1.Program1.Layout');
		});
	});


});

