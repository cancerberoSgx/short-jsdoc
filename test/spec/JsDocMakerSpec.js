var JsDocMaker = typeof _ === 'undefined' ? require('../../src/jsdocmaker/main.js') : JsDocMaker; 
var _ = typeof _ === 'undefined' ? require('underscore') : _; 

describe("JsDocMaker", function() 
{




describe("Basic jsdoc parser", function() 
{
	var jsdoc, maker, Apple, Lion, Lemon, MyModel; 

	beforeEach(function() 
	{
		var code = 
			'//@class Lemon'+'\n'+
			'//this is a no module class'+'\n'+
			'//@constructor the Lemon public constructor signature @param {Color} color'+'\n'+
			'//@constructor another constructor for the Lemon class @param {Number} size'+'\n'+
			'//?@method tricky this comment should be ignored b the parser because it starts with the special prefix ?'+'\n'+
			'//@method glow'+'\n'+

			'//@module livingThings'+'\n'+
			
			'//@class Apple @extend Fruit '+'\n'+
			'/*@method beEatenBy apples have this privilege @param {Mouth} mouth the mouth to be used @param {Int} amount @return {String} the bla*/' + '\n' +
			'//@property {Color} color the main color of this fruit'+'\n'+
			'//@class Lion the lion class is on living things'+'\n'+
			'//@event angry triggered when the lion gets angry'+'\n'+

			'//@module model @class MyModel @extends Framework.Model'+'\n'+			
			'//@attribute {String} name this is the name of the model'+'\n'+
			'//@attribute {Apple} apple this is the apple fruit'+'\n'+
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

		MyModel = jsdoc.classes['model.MyModel']; 
		expect(MyModel).toBeDefined();
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
		expect(Apple.methods.beEatenBy.name).toBe('beEatenBy');
		expect(Apple.methods.beEatenBy.absoluteName).toBe('livingThings.Apple.beEatenBy');
	});

	it("properties", function() 
	{
		expect(Apple.properties.color.name).toBe('color');
		expect(Apple.properties.color.absoluteName).toBe('livingThings.Apple.color');
		expect(Apple.properties.color.type.name).toBe('Color');
		expect(Apple.properties.color.text).toBe('the main color of this fruit');
	});

	it("events", function() 
	{
		expect(Lion.events.angry.name).toBe('angry');
		expect(Lion.events.angry.absoluteName).toBe('livingThings.Lion.angry');
		expect(Lion.events.angry.text).toBe('triggered when the lion gets angry');
	});

	it("attributes", function() 
	{
		expect(MyModel.attributes.name.name).toBe('name');
		expect(MyModel.attributes.name.absoluteName).toBe('model.MyModel.name');
		expect(MyModel.attributes.name.text).toBe('this is the name of the model');
		expect(MyModel.attributes.name.type.name).toBe('String');
		expect(MyModel.attributes.apple.type.name).toBe('Apple');
		expect(MyModel.attributes.apple.type.absoluteName).toBe('livingThings.Apple');
	});

	it("constructors", function() 
	{
		expect(Lemon.constructors.length).toBe(2); 
		expect(Lemon.constructors[0].name).toBe('0'); 
		expect(Lemon.constructors[0].absoluteName.indexOf('Lemon.0')>0).toBe(true); 
		expect(Lemon.constructors[0].text).toBe('the Lemon public constructor signature');
		expect(Lemon.constructors[0].params[0].name).toBe('color');
		expect(Lemon.constructors[0].params[0].type.name).toBe('Color');
		expect(Lemon.constructors[1].text).toBe('another constructor for the Lemon class');
		/*'//@constructor the Lemon public constructor signature @param {Color} color'+'\n'+
		'//@constructor another constructor for the Lemon class @param {Number} size'+'\n'+*/

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


it("class extends referring later bug", function() 
{
	var jsdoc, maker; 
	var code = 
		'/*' + '\n' +
		'@module a @class A @class B sl kdfjslkd f @class C @class B @extends A' + '\n' +
		'*/ ' + '\n' +
		'';

	maker = new JsDocMaker();		
	maker.addFile(code, 'name.js');

	jsdoc = maker.jsdoc();
	maker.postProccess();
	maker.postProccessBinding();

	expect(jsdoc.classes['a.B'].extends.absoluteName).toBe('a.A'); 
});


describe("custom native types", function() 
{
	var jsdoc, maker; 

	beforeEach(function() 
	{
		var code = 
			'//@module office' + '\n' +	

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
			'//some text for this module'+'\n'+
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
		expect(module.text).toBe('some text for this module');

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





describe("inherited methods and properties", function() 
{
	var jsdoc, maker; 

	beforeEach(function() 
	{
		var code = 

			'//@module vehicles' + '\n' +

			'//@class Vehicle' + '\n' +
			'//@method move all vehicles move. Subclasses must override this. @param {Vector2D} direction @param {Nmber}' + '\n' +
			'//@property {Number} mass the mass of this Vehicle' + '\n' +				
			'//@event hit triggered whenever this vehicle hits another object' + '\n' +	

			'//@class Car @extends Vehicle' + '\n' +
			'//@method balance @param {String} eficiency' + '\n' +

			'//@class VMW @extends Car' + '\n' +
			'//@method deployAirbag' + '\n' +

			'//@class MotorBike @extends Vehicle' + '\n' +
			'//@method doTheWilly' + '\n' +
			'';
		maker = new JsDocMaker();

		maker.parseFile(code, 'genericstest1'); 
		maker.postProccess();
		maker.postProccessBinding();
		maker.postProccessInherited(); // <-- important - explicitlyask the framework to calculate inherited methods&properties
		
		jsdoc = maker.data;
	});

	it("inherited methods, properties and events. We have the method JsDocMaker.classOwnsProperty to know if a property is inherited", function() 
	{
		var Vehicle = jsdoc.classes['vehicles.Vehicle'];
		expect(Vehicle.inherited.properties.mass).not.toBeDefined();
		expect(Vehicle.events.hit.text).toBe('triggered whenever this vehicle hits another object');
		expect(Vehicle.inherited.events.hit).not.toBeDefined();

		var Car = jsdoc.classes['vehicles.Car'];
		expect(Car.inherited.methods.move.absoluteName).toBe('vehicles.Vehicle.move'); 
		expect(Car.inherited.methods.move.ownerClass).toBe('vehicles.Vehicle'); 
		expect(Car.inherited.methods.move.text).toBe('all vehicles move. Subclasses must override this.'); 
		expect(Car.inherited.balance).not.toBeDefined();			
		expect(Car.inherited.properties.mass.type.name).toBe('Number');
		expect(Car.inherited.properties.mass.text).toBe('the mass of this Vehicle');

		var VMW = jsdoc.classes['vehicles.VMW'];
		expect(VMW.inherited.methods.move.absoluteName).toBe('vehicles.Vehicle.move'); 
		expect(VMW.inherited.methods.move.ownerClass).toBe('vehicles.Vehicle'); 
		expect(VMW.inherited.methods.move.text).toBe('all vehicles move. Subclasses must override this.'); 
		expect(VMW.inherited.methods.balance.absoluteName).toBe('vehicles.Car.balance'); 
		expect(VMW.inherited.methods.balance.params[0].type.name).toBe('String'); 
		// expect(VMW.inherited.methods.balance.inheritedFrom.absoluteName).toBe('vehicles.Car'); 
		expect(VMW.inherited.properties.mass.absoluteName).toBe('vehicles.Vehicle.mass'); 
		expect(VMW.inherited.events.hit.text).toBe('triggered whenever this vehicle hits another object');
		// expect(VMW.inherited.events.hit.inheritedFrom.absoluteName).toBe('vehicles.Vehicle');
	});


	it("We have the method JsDocMaker.classOwnsProperty to know if a property is inherited", function() 
	{
		var VMW = jsdoc.classes['vehicles.VMW'];

		expect(JsDocMaker.classOwnsProperty(VMW, VMW.inherited.methods.move)).toBe(false); 
		expect(JsDocMaker.classOwnsProperty(VMW, VMW.methods.deployAirbag)).toBe(true); 

	});
});



describe("plugin utilities for recursing", function() 
{
	var jsdoc, maker; 

	
	it("JsDocMaker.recurseAST visit nodes and types of the AST - children first", function() 
	{
		var code = 
			'//@module office '+ '\n' +	
			'//@class Computer' + '\n' +
			'//@method putmusic @param {Object<String,Array<Song>>} songs' + '\n' + 
			'//@method prepareMate @param {mate:Mate,termo:Termo,heat:Array<Source>} mateConfiguration' + '\n' + 
			'';
		maker = new JsDocMaker();
		maker.parseFile(code); 
		maker.postProccess();
		maker.postProccessBinding();

		jsdoc = maker.data;

		// we define a function to visit each AST node - we will search for a children @versionfoo and if any set as a property
		var output = []; 
		var nodeVisitor = function(node)
		{
			output.push(node.name + '--');
		}; 
		var typeVisitor = function(type)
		{
			output.push(type.name + ',');
		}; 
		maker.recurseAST(nodeVisitor, typeVisitor);

		var expected = 'Computer--putmusic--songs--String,Song,Array,Object,--prepareMate--mateConfiguration--Mate,Termo,Source,Array,Object,--Object--office--'; 
		expect(output.join('')).toBe(expected); 
		
	});

	it("example 1: user can use recurseAST to install a visitor for doing its own post processing", function() 
	{

		var code = 
			'//@module office @versionfoo 3.2' + '\n' +	
			'//@class Computer' + '\n' +
			'//you can do excel here' + '\n' +
			'//@versionfoo 1.2' + '\n' +
			'//@method putmusic @param {Object<String,Array<Song>>} songs' + '\n' + 
			'//@versionfoo 1.0' + '\n' +
			'';
		maker = new JsDocMaker();
		maker.parseFile(code); 
		maker.postProccess();
		maker.postProccessBinding();

		jsdoc = maker.data;

		// we define a function to visit each AST node - we will search for a children @versionfoo and if any set as a property
		var astVisitor = function(node)
		{
			var versionfoo = _(node.children||[]).find(function(child)
			{
				return child.annotation === 'versionfoo'; 
			});
			if(versionfoo && versionfoo.name)
			{
				node.versionfoo = versionfoo.name; 
			}
		}; 
		maker.recurseAST(astVisitor); 

		expect(jsdoc.modules.office.versionfoo).toBe('3.2');
	});


	it("JsDocMaker.recurseType: recursing complex types children - for doing it ony in a single type object", function() 
	{
		var code = 
			'//@module mymodule bla bla ' + '\n' +
			'//@class C bla bla ' + '\n' +
			'//@property {S} p bla bla ' + '\n' +
			'//@property {Apple<String,Apple>} prop1  bla ' + '\n' +

			'//@property {a:String,b:Apple,c:Array<Apple<Object,Animal>>} prop2  bla ' + '\n' +
			'//@property {Array<String>|Apple|Object<String,Array<String>>} prop3  bla ' + '\n' +
			'';

		maker = new JsDocMaker();
		maker.addFile(code, 'name.js');
		jsdoc = maker.jsdoc();
		maker.postProccess();
		maker.postProccessBinding();

		var t1 = jsdoc.classes['mymodule.C'].properties.prop2.type;
		var t2 = jsdoc.classes['mymodule.C'].properties.prop3.type;

		var output = [];
		JsDocMaker.recurseType(t1, function(type)
		{
			output.push(type.name);
		}); 
		expect(output.join(',')).toBe('String,Apple,Object,Animal,Apple,Array,Object');

		output = [];
		JsDocMaker.recurseType(t2, function(type)
		{
			output.push(type.name);
		}); 
		expect(output.join(',')).toBe('String,Array,Apple,String,String,Array,Object,');
	});
});


describe("multiple types", function() 
{
	it("user can indicate multiple optional types by separating with |", function() 
	{
		var code = 
			'//@module cssutils' + '\n' +	
			'//@class CSSExtractor' + '\n' +
			'//@method extract @param {String|HTMLElement|jQuery|Array<HTMLElement>|Object<String,Array<String>>} el @return {Object}' + '\n' + 
			'';
		var maker = new JsDocMaker();
		maker.parseFile(code); 
		maker.postProccess();
		maker.postProccessBinding();
		var jsdoc = maker.data;

		var type = jsdoc.classes['cssutils.CSSExtractor'].methods.extract.params[0].type; 
		expect(_(type).isArray()).toBe(true); 
		expect(type.length).toBe(5); 
		expect(type[0].name).toBe('String');
		expect(_(type[0].nativeTypeUrl).isString()).toBe(true); 

		expect(type[1].name).toBe('HTMLElement');
		expect(type[2].name).toBe('jQuery');

		expect(type[3].name).toBe('Array');
		expect(_(type[3].nativeTypeUrl).isString()).toBe(true); 
		expect(type[3].params.length).toBe(1);
		expect(type[3].params[0].name).toBe('HTMLElement');


		expect(type[4].name).toBe('Object');
		expect(type[4].params.length).toBe(2);
		expect(type[4].params[0].name).toBe('String');
		expect(type[4].params[1].name).toBe('Array');
		expect(type[4].params[1].params[0].name).toBe('String');
	
	});
});






describe("types with spaces", function() 
{
	it("types can contain spaces", function() 
	{
		var code = 
			'//@module stuff1' + '\n' +	
			'//@class Something' + '\n' +				
			'//@property {Object<String, Array<String > >} aProperty' + '\n' +'';

		var maker = new JsDocMaker();
		maker.parseFile(code); 
		maker.postProccess();
		maker.postProccessBinding();
		var jsdoc = maker.data;

		var type = jsdoc.classes['stuff1.Something'].properties.aProperty.type;
		expect(type.name).toBe('Object'); 
		expect(type.params[0].name).toBe('String'); 
		expect(type.params[1].name).toBe('Array'); 
		expect(type.params[1].params[0].name).toBe('String'); 
	});
});








// describe("support alternative comment block syntax", function() 
// {
		
// 	describe("block commments with style", function() 
// 	{
// 		it("/** style blocks", function() 
// 		{
// 			var code = 
// 				'//@module stuff2' + '\n' +	
// 				'/**@class Sky\n * some text\n * and another line\n */' + '\n'; 

// 			var maker = new JsDocMaker();
// 			maker.parseFile(code); 
// 			maker.postProccess();
// 			maker.postProccessBinding();
// 			var jsdoc = maker.data;

// 			var Sky = jsdoc.classes['stuff2.Sky'];
// 			expect(Sky.text).toBe('some text\n and another line');
// 		});
// 	});

// });





describe("support comment preprocessor", function() 
{			
	it("for example one can install a pcomment preprocessor for adding/removing fragment to comments", function() 
	{
		var code = 
			'//@module stuff3' + '\n' +	
			'/**@class Vanilla some text @author sgx */' + '\n'; 

		var maker = new JsDocMaker();

		var plugin = {
			name: 'author replace my example'
		,	execute: function(options)
			{					
				options.node.value = options.node.value.replace(/@author\s+\w+/gi, '') + ' @author thief'; 
			}
		}; 
		maker.commentPreprocessorPlugins.add(plugin); 

		//then do the parsing
		maker.parseFile(code); 
		maker.postProccess();
		maker.postProccessBinding();
		var jsdoc = maker.data;

		var Vanilla = jsdoc.classes['stuff3.Vanilla'];
		var author = _(Vanilla.children).find(function(c){return c.annotation === 'author'; });
		expect(author.name).toBe('thief');
	});
});





describe("custom child annotation", function() 
{

	it("custom annotations will be parsed in 'children' property and can contain characters '.', '-', '_'", function() 
	{
		var jsdoc, maker; 
		var code =
			'//@module m1' + '\n' +
			'//@customAnnotation1 {Type} name text text' + '\n' +
			'//@custom-annotation2 {Type} name text text' + '\n' +
			'//@custom.Annotation3 {Type} name text text' + '\n' +
			'//@custom_Annotation4 {Type} name text text' + '\n' +
			'//' + '\n' +

			'';

		maker = new JsDocMaker();		
		maker.addFile(code, 'name.js');

		jsdoc = maker.jsdoc();
		maker.postProccess();
		maker.postProccessBinding();

		// console.log(jsdoc.modules['m1'].children)
		expect(!!_.find(jsdoc.modules['m1'].children, function(c){return c.annotation==='customAnnotation1';})).toBe(true)
		expect(!!_.find(jsdoc.modules['m1'].children, function(c){return c.annotation==='custom-annotation2';})).toBe(true)
		expect(!!_.find(jsdoc.modules['m1'].children, function(c){return c.annotation==='custom-annotation2';})).toBe(true)
		expect(!!_.find(jsdoc.modules['m1'].children, function(c){return c.annotation==='custom_Annotation4';})).toBe(true)
	});
});





describe("support custom type parsers", function() 
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

		// define and regiter a custom type syntax:
		var customTypeParser = {
			name: 'lemmon'	
		,	parse: function(s)
			{
				// variable s is the text body of the custom type for example 'acid,lazy,green'.
				// we return the following object as this type obejct implementation.
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





describe("support a literal object custom type implementation", function() 
{	
	it("the type {#obj(prop1:Type1,...)} is supported out of the box", function() 
	{
		var code = 
			'//@module customTypeParsers2' + '\n' +	
			'/*@class Vanilla2 some text ' + '\n' +	
			'@method method1' + '\n' +	
			'@return {#obj(prop:Type,prop2:Type2<Type3>)} some text*/' + '\n' +
			'//@method method2 blabla' + '\n' +	
			'//@param {#obj(id:String,objectDic:Object<String>)} param1 some text' + '\n' +	
			''; 

		var maker = new JsDocMaker();

		//then do the parsing
		maker.parseFile(code); 
		maker.postProccess();
		maker.postProccessBinding();
		var jsdoc = maker.data;

		var Vanilla = jsdoc.classes['customTypeParsers2.Vanilla2'];
		var returns = Vanilla.methods.method1.returns; 
		expect(returns.type.name).toBe('Object');
		expect(returns.type.properties.prop.name).toBe('Type');
		expect(returns.type.properties.prop2.name).toBe('Type2');
		expect(returns.type.properties.prop2.params[0].name).toBe('Type3');

		var param1 = Vanilla.methods.method2.params[0];
		expect(param1.type.name).toBe('Object'); 
		expect(param1.type.properties.id.name).toBe('String'); 
		expect(param1.type.properties.objectDic.name).toBe('Object'); 
	});
});



describe("method throw exception", function() 
{
	var jsdoc, maker; 

	beforeEach(function() 
	{
		var code = 
			'//@module throwtest1' + '\n' +
			'//@class CompilerException special exception for compiler errors @extends IOException ' + '\n' +
			// '//@param {Number} error_line @param {String} error_msg' + '\n' +
			'//@class IOException throwed when an IO error occurs @extends Error ' + '\n' +
			'//@class Thrower ' + '\n' +
			'//@method method1 @param {String} p some text' + '\n' + 
			'//@param {Number} p1 sdf sdf' + '\n' +
			'//@throws {IOException} if a IO error occurs' + '\n' + 
			'//@param {Number} p3' + '\n' +
			'//@throws {CompilerException} if a compiler error error occurs' + '\n' +
			'//@returns {SomeResult} or null in case of an error' + '\n' +
			''; 
		maker = new JsDocMaker();
		maker.parseFile(code, 'textarea'); 
		maker.postProccess();
		maker.postProccessBinding();
		jsdoc = maker.data;
	});

	it("@throws nodes have a type and text", function() 
	{
		var method1 = jsdoc.classes['throwtest1.Thrower'].methods.method1;
		expect(method1.throws[0].type.name).toBe('IOException'); 
		expect(method1.throws[0].text).toBe('if a IO error occurs'); 
		expect(method1.throws[0].type.text).toBe('throwed when an IO error occurs'); 
		expect(method1.throws[0].type.extends.name).toBe('Error'); 

		expect(method1.throws[1].type.name).toBe('CompilerException'); 
		expect(method1.throws[1].text).toBe('if a compiler error error occurs'); 
		expect(method1.throws[1].type.text).toBe('special exception for compiler errors'); 
		expect(method1.throws[1].type.extends.name).toBe('IOException'); 

		expect(method1.params[0].name).toBe('p'); 
		expect(method1.params[1].name).toBe('p1'); 
		expect(method1.params[2].name).toBe('p3'); 

		expect(method1.returns.type.name).toBe('SomeResult'); 

	});

});








describe("custom base class", function() 
{
	var jsdoc, maker; 

	beforeEach(function() 
	{
		var code = 
			'//@module custombaseclass1' + '\n' +
			'//@class Test1 blabla ' + '\n' +
			'//@class Object yes I can go crazy and make Object just a concrete common name @extends Test1 ' + '\n' +
			''; 

		JsDocMaker.DEFAULT_CLASS = 'MyDefaultClass'; 
		maker = new JsDocMaker();
		maker.parseFile(code, 'textarea'); 
		maker.postProccess();
		maker.postProccessBinding();
		jsdoc = maker.data;
	});

	it("yes now Object is no longer the default-base class", function() 
	{
		var Test1 = jsdoc.classes['custombaseclass1.Test1']; 
		expect(Test1.extends.name).toBe('MyDefaultClass'); 
	});
	it("is just a concrete class", function() 
	{
		var _Object = jsdoc.classes['custombaseclass1.Object']; 
		expect(_Object.extends.name).toBe('Test1'); 
	});

});









describe("several definitions", function() 
{
	var jsdoc, maker; 

	beforeEach(function() 
	{
		var code = 
			'//@module mymodule the first text for mymodule' + '\n' +
			'//@class MyClass some text for myclass' + '\n' +
			'//@method m1 blabalbal @param p1 @param p2' + '\n' +

			'//@module othermodule' + '\n' +
			'//@class MyClass this text is from another class' + '\n' +
			'//@class Other class this text is from another class' + '\n' +
			'//@method m1 blabalbal @param p1 @param p2' + '\n' +

			'//@module mymodule a second text for mymodule' + '\n' +
			'//@class MyClass a second text for my class' + '\n' +
			''; 

		maker = new JsDocMaker();
		maker.parseFile(code, 'textarea'); 
		maker.postProccess();
		maker.postProccessBinding();
		jsdoc = maker.data;
	});

	it("Two definitions of the same module or class should preserve all the texts", function() 
	{
		var mymodule = jsdoc.modules.mymodule; 
		expect(mymodule.text).toBe('the first text for mymodule' + JsDocMaker.MULTIPLE_TEXT_SEPARATOR + 'a second text for mymodule');

		var MyClass = jsdoc.classes['mymodule.MyClass']; 
		expect(MyClass.text).toBe('some text for myclass' + JsDocMaker.MULTIPLE_TEXT_SEPARATOR + 'a second text for my class');
	});

});





describe("talking about the same class in different places", function() 
{
	var jsdoc, maker; 

	beforeEach(function() 
	{
		var code = 
			'//@module mymodule' + '\n' +

			'//@class MyClass some text for myclass' + '\n' +
			'var MyClass = function(){}' + '\n' +

			'//@method m1 blabalbal @param p1 something in the rain @param p2 smells nasty' + '\n' +
			'MyClass.prototype.m1 = function(p1, p2){};' + '\n' +

			'//@class OtherClass some text for the other class' + '\n' +
			'var MyClass = function(){}' + '\n' +

			'//@method m3 blabalbal @param a @param b' + '\n' +
			'MyClass.prototype.m3 = function(a, b){};' + '\n' +

			'//@class MyClass' + '\n' +
			'//@method m2 bleblebel @param c @param d' + '\n' +
			'MyClass.prototype.m2 = function(c, d){};' + '\n' +
			''; 

		maker = new JsDocMaker();
		maker.parseFile(code, 'textarea'); 
		maker.postProccess();
		maker.postProccessBinding();
		jsdoc = maker.data;
	});

	it("be able to add more information to the same class later in the code", function() 
	{
		var MyClass = jsdoc.classes['mymodule.MyClass']; 
		expect(_(MyClass.methods).keys().length).toBe(2);
		expect(MyClass.methods.m1.text).toBe('blabalbal');
		expect(MyClass.methods.m2.text).toBe('bleblebel');

		expect(MyClass.methods.m1.params[0].name).toBe('p1');
		expect(MyClass.methods.m1.params[0].text).toBe('something in the rain');

		expect(MyClass.methods.m2.params[0].name).toBe('c');
		expect(MyClass.methods.m2.params[1].name).toBe('d');
	});

//TODO: the same should be for modules
});




describe("referring classes with special names", function() 
{
	var jsdoc, maker; 

	beforeEach(function() 
	{
		var code = 
			'//@module mymodule' + '\n' +

			'//@class Easy easy named class' + '\n' +

			'//@class MiniBike.Futuristic_2 a class using all allowed characters' + '\n' +
			'var MiniBikeFuturistic_2  = function(){}' + '\n' +

			'//@class MiniBike.Futuristic_3 class extending a class with strange name @extends MiniBike.Futuristic_2' + '\n' +

			'//@method foo_bar @return MiniBike.Futuristic_2' + '\n' +

			'//@property {Array<MiniBike.Futuristic_3>} something' + '\n' +
			'//@property {Array<Easy>} easy' + '\n' +
			''; 

		maker = new JsDocMaker();
		maker.parseFile(code, 'textarea'); 
		maker.postProccess();
		maker.postProccessBinding();
		jsdoc = maker.data;
	});

	it("classes with all accepted chars referred from complex objects", function() 
	{
		var C1 = jsdoc.classes['mymodule.MiniBike.Futuristic_2']; 
		var C2 = jsdoc.classes['mymodule.MiniBike.Futuristic_3']; 
		var p1 = C2.properties.something;
		var p2 = C2.properties.easy;
		expect(C1.name).toBe('MiniBike.Futuristic_2');
		expect(C1.absoluteName).toBe('mymodule.MiniBike.Futuristic_2');

		expect(C2.extends.name).toBe('MiniBike.Futuristic_2'); 
		expect(p1.type.params[0].name).toBe('MiniBike.Futuristic_3'); 
	});

});






describe("parsing multiple files using addFile and jsdoc()", function() 
{
	var jsdoc, maker; 

	beforeEach(function() 
	{
		var files = {
			'code1.js':
				'//@module mymodule' + '\n' +
				'//@class Easy easy named class' + '\n' +
				'//@method getState @returns {Car}' + '\n' +
				''
		,	'/opt/lamp/code2.js':
				'//@module mymodule2' + '\n' +
				'//@class Easy2 easy named class' + '\n' +
				'//@method getState2 @returns {Car2}' + '\n' +
				''
		}; 

		maker = new JsDocMaker();

		_(files).each(function(value, name)
		{
			maker.addFile(value, name);
		}); 

		jsdoc = maker.jsdoc();
	});

	it("parsed AST should contain references to file names and file location", function() 
	{
		var m = jsdoc.classes['mymodule.Easy'].methods.getState;
		expect(jsdoc.classes['mymodule.Easy'].fileName).toBe('code1.js'); 
		expect(jsdoc.classes['mymodule2.Easy2'].methods.getState2.fileName).toBe('/opt/lamp/code2.js'); 

		//wecaan access all the information about a file 
		var f2 = jsdoc.files[jsdoc.classes['mymodule2.Easy2'].methods.getState2.fileName];
		expect(f2.fileName).toBe('/opt/lamp/code2.js'); 

		//TODO: test if we can get correct source location.
	});

});






describe("object literal notation", function() 
{
	var jsdoc, maker; 

	beforeEach(function() 
	{
		var code = 
			'//@module mymodule' + '\n' +
			'//@class Easy easy named class' + '\n' +
			'//@method getState @returns {sname:String,soptions:EasyConfiguration,complex1:Array<Object>}' + '\n' +
			'//@property {name:String,options:EasyConfiguration} p ' + '\n' +
			'';

		maker = new JsDocMaker();
		maker.addFile(code, 'name.js');
		jsdoc = maker.jsdoc();
		maker.postProccess();
		maker.postProccessBinding();
	});
	
	it("any type support the syntax {a:A,b:B} with recursive evaluation", function() 
	{
		var t1 = jsdoc.classes['mymodule.Easy'].properties.p.type; 

		expect(t1.name).toBe('Object');
		expect(t1.properties.name.name).toBe('String');
		expect(t1.properties.options.name).toBe('EasyConfiguration');

		var t2 = jsdoc.classes['mymodule.Easy'].methods.getState.returns.type; 

		expect(t2.properties.complex1.name).toBe('Array');
		expect(t2.properties.complex1.params[0].name).toBe('Object');
	});
});





describe("@function", function() 
{

	it("a module can contain functions", function() 
	{
		var jsdoc, maker; 
		var code = 
			'/*' + '\n' +
			'@module a' + '\n' +  
			'@function f1 @param {C} f11 @return {C} f1r' +  '\n' + 
			'@class A @method m sl @param mp1 @return {mr1}' +  '\n' + 
			'@function f2 @param f21 @return f2r' +			 '\n' + 
			'@throws {A} if a IO error occurs' + '\n' +  
			'@class C @class B @extends A @method bm1 @param bmp1' + '\n' +
			'@function f3 @param f31 @return f3r' + '\n' + 
			'*/ ' + '\n' +
			'';

		maker = new JsDocMaker();		
		maker.addFile(code, 'name.js');

		jsdoc = maker.jsdoc();
		maker.postProccess();
		maker.postProccessBinding();

		expect(jsdoc.modules['a'].functions.length).toBe(3)

		var f1 = _.find(jsdoc.modules['a'].functions, function(f){return f.name==='f1'});
		expect(f1.absoluteName === 'a.f1').toBe(true);
		expect(f1.params[0].type.absoluteName === 'a.C').toBe(true);
		expect(f1.returns.type.absoluteName === 'a.C').toBe(true);


		var f2 = _.find(jsdoc.modules['a'].functions, function(f){return f.name==='f2'});
		expect(f2.throws[0].type.absoluteName === 'a.A').toBe(true)
		// console.log(f2.throws)
	});
});




describe("lie comments and markdown", function() 
{

	it("line comments must support multiple markdown paragraph by default", function() 
	{
		var jsdoc, maker; 
		var code =

			'//@module m1' + '\n' + 
			'//#title 1' + '\n' +
			'//This is a paragraph 1l slkdjf lskdjflkdf' + '\n' +
			'//paragraph 1 still continue lastwordofpara1' + '\n' +
			'//' + '\n' +
			'//firstwordofpara2 this is pargaraph 2 lskdjf lsk flk sjldf' + '\n' +
			'//still paragraph 2lsdkjf lksjdlf skjldf' + '\n' +
			'';

		maker = new JsDocMaker();		
		maker.addFile(code, 'name.js');

		jsdoc = maker.jsdoc();
		maker.postProccess();
		maker.postProccessBinding();

		expect(!!jsdoc.modules['m1'].text.match(/lastwordofpara1 \n \n firstwordofpara2/)).toBe(true)
	});

});


});






