var JsDocMaker = typeof _ === 'undefined' ? require('../../src/jsdocmaker/main.js') : JsDocMaker; 
var _ = typeof _ === 'undefined' ? require('underscore') : _; 


describe("issues - will fail - we will try to fix them", function() 
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
		maker.parseFile(code); 
		maker.postProccess();
		maker.postProccessBinding();

		var Mercury = maker.data.classes['issues.Mercury'];

		//this is OK the method is OK
		expect(Mercury.methods.method1.absoluteName).toBe('issues.Mercury.method1');

		//this is error - the param is not defined
		expect(Mercury.params).toBeDefined();
	});

	beforeEach(function() 
	{
		
	});

	it("cannot add a custom modifier - it is not well parsed - it parses only the first two but not the third", function() 
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

		//registering a new modifier
		JsDocMaker.MODIFIERS.push('myownmodifier');

		maker.parseFile(code, 'textarea'); 
		maker.postProccess();
		maker.postProccessBinding();
		jsdoc = maker.data;

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
