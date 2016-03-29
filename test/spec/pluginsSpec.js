var JsDocMaker = typeof _ === 'undefined' ? require('../../src/jsdocmaker/main.js') : JsDocMaker; 
var _ = typeof _ === 'undefined' ? require('underscore') : _; 


describe("plugins", function() 
{

describe("@module @exports {Type}", function() 
{
	var jsdoc, maker; 

	beforeEach(function() 
	{
		var code = 
			'//@module mymodule bla bla ' + '\n' +
			'//@exports {MainClass1} this is all text explaining the reason of exporting this value' + '\n' +
			'//@class MainClass1 bla bla ' + '\n' +

			'//@module mymodule2 bla bla ' + '\n' +
			'//@exports {version:String,Class:UtilityClass1} this is all text explaining the reason of exporting this value' + '\n' +
			'//@class UtilityClass1 bla bla ' + '\n' +
			'';

		maker = new JsDocMaker();
		maker.addFile(code, 'name.js');
		jsdoc = maker.jsdoc();
		maker.postProccess();
		maker.postProccessBinding();
	});

	it("@module can have @export tags that accept a type and text", function() 
	{
		var m = jsdoc.modules.mymodule;
		expect(m.exports.text).toBe('this is all text explaining the reason of exporting this value'); 
		expect(m.exports.type.absoluteName).toBe('mymodule.MainClass1'); 

		var m2 = jsdoc.modules.mymodule2;
		expect(m2.exports.type.name).toBe('Object'); 
		expect(m2.exports.type.properties.version.name).toBe('String'); 
		expect(m2.exports.type.properties.Class.absoluteName).toBe('mymodule2.UtilityClass1'); 
	});

});




describe("@alias class", function() 
{

	it("creating classes shortcuts with alias", function() 
	{
		var jsdoc, maker; 
		var code = 
			'//@module mymodule bla bla ' + '\n' +
			'//@alias class O Object' + '\n' +
			'//@alias class S String' + '\n' +
			'//@alias class A Array' + '\n' +
			'//@alias class N Number' + '\n' +
			'//@alias class Og Orange' + '\n' +

			'//@class Fruit living thing' + '\n' +
			'//@class Orange some text for orang @extend Fruit @property {O<S,N>} smell' + '\n' +

			'//@class Something' + '\n' +
			'//@property {A<S>} prop1' + '\n' +
			'//@property {Og} prop2' + '\n' +

			'';

		maker = new JsDocMaker();
		maker.addFile(code, 'name.js');
		jsdoc = maker.jsdoc();
		maker.postProccess();
		maker.postProccessBinding();

		var prop1 = jsdoc.classes['mymodule.Something'].properties.prop1;
		expect(prop1.type.name).toBe('Array');
		expect(prop1.type.params[0].name).toBe('String');

		var prop2 = jsdoc.classes['mymodule.Something'].properties.prop2;
		expect(prop2.type.name).toBe('Orange'); 
		expect(prop2.type.extends.name).toBe('Fruit'); 
	});

});



describe("@alias annotation", function() 
{

	it("@alias annotation new-name targetName can be used and annotation names can contain characters '.', '-', '_'", function() 
	{
		var jsdoc, maker; 
		var code =

			'//@alias annotation gulptask module' + '\n' +
			'//@alias annotation gulp-task module' + '\n' +
			'//@gulptask javascript compiles all the javascript files into one big file using browserify' + '\n' +
			'//@class c0' + '\n' +
			'//@gulp-task sass compile the project skin css' + '\n' +
			'//@class c1' + '\n' +
			'//@module m' + '\n' +
			'//@class c' + '\n' +
			'';

		maker = new JsDocMaker();		
		maker.addFile(code, 'name.js');

		jsdoc = maker.jsdoc();
		maker.postProccess();
		maker.postProccessBinding();

		expect(!!_.find(jsdoc.modules, function(m){return m.name==='javascript'})).toBe(true);
		expect(!!_.find(jsdoc.modules, function(m){return m.name==='m'})).toBe(true);
		expect(!!_.find(jsdoc.modules, function(m){return m.name==='sass'})).toBe(true);

		expect(!!jsdoc.classes['javascript.c0']).toBe(true);
		expect(!!jsdoc.classes['sass.c1']).toBe(true);
		expect(!!jsdoc.classes['m.c']).toBe(true);
	});
});


describe("text marks", function() 
{

it("using @?something arguments inside text to create named marks inside.", function() 
{
	var jsdoc, maker; 
	var code = 
		'//@module fruits bla bla ' + '\n' +
		'//@class Banana bla bla bla' + '\n' +
		'//@property {Array<String>} flavor bla bla bla' + '\n' +
		'//@event afterSomething bla bla bla' + '\n' +
		'//@class Pineapple bla bla bla' + '\n' +
		'//@method paint ble balskdj laks @param {String} color' + '\n' +
		'//@module trees' + '\n' +
		'//@class  Bananero' + '\n' +
		'//@method strange this methods do the strange thing what is related \n'+
		'//with @?class fruits.Banana and @?class Pineapple because of the destiny' + '\n' +
		'//also @?module fruits is related to this problem and of cource @?method fruits.Pineapple.paint method references are allowed' + '\n' +
		'//@param {String} param2 any tags can also contain @?event fruits.Banana.afterSomething text marks. Events and properties like @?property fruits.Banana.flavor can be contained' + '\n' +
		'//@param {String} p3 this one contain a @?ref trees.Bananero to a class and a @?ref trees.Bananero.strange to a method.\n'+
		'//@return {Array} we want to try @?link "[This link](http://google.com/)" to see what\'s done \n'+
		'';

	maker = new JsDocMaker();
	maker.addFile(code, 'name.js');
	jsdoc = maker.jsdoc();

	var strange = jsdoc.classes['trees.Bananero'].methods.strange;
	expect(strange.text).toBe('this methods do the strange thing what is related \n with _shortjsdoc_textmarkplugin_1 and _shortjsdoc_textmarkplugin_2 because of the destiny \n also _shortjsdoc_textmarkplugin_3 is related to this problem and of cource _shortjsdoc_textmarkplugin_4 method references are allowed'); 

	expect(strange.textMarks._shortjsdoc_textmarkplugin_1.name).toBe('class');
	expect(strange.textMarks._shortjsdoc_textmarkplugin_1.arg).toBe('fruits.Banana');

	expect(strange.textMarks._shortjsdoc_textmarkplugin_2.name).toBe('class');
	expect(strange.textMarks._shortjsdoc_textmarkplugin_2.arg).toBe('Pineapple');

	expect(strange.textMarks._shortjsdoc_textmarkplugin_3.name).toBe('module');
	expect(strange.textMarks._shortjsdoc_textmarkplugin_3.arg).toBe('fruits');

	expect(strange.textMarks._shortjsdoc_textmarkplugin_4.name).toBe('method');
	expect(strange.textMarks._shortjsdoc_textmarkplugin_4.arg).toBe('fruits.Pineapple.paint');

	maker.postProccess();
	maker.postProccessBinding();

	expect(strange.textMarks._shortjsdoc_textmarkplugin_1.binding.absoluteName).toBe('fruits.Banana');
	expect(strange.textMarks._shortjsdoc_textmarkplugin_1.binding.annotation).toBe('class');
	expect(strange.textMarks._shortjsdoc_textmarkplugin_2.binding.methods.paint.params[0].name).toBe('color');
	expect(strange.textMarks._shortjsdoc_textmarkplugin_3.binding.name).toBe('fruits');

	expect(strange.textMarks._shortjsdoc_textmarkplugin_4.binding.annotation).toBe('method'); 
	expect(strange.textMarks._shortjsdoc_textmarkplugin_4.binding.absoluteName).toBe('fruits.Pineapple.paint'); 
	expect(strange.textMarks._shortjsdoc_textmarkplugin_4.binding.params[0].name).toBe('color'); 
	expect(strange.textMarks._shortjsdoc_textmarkplugin_4.binding.params[0].type.name).toBe('String'); 

	var strangeParam = strange.params[0]; 
	expect(strangeParam.textMarks._shortjsdoc_textmarkplugin_5.binding.annotation).toBe('event'); 
	expect(strangeParam.textMarks._shortjsdoc_textmarkplugin_6.binding.annotation).toBe('property'); 

	strangeParam = strange.params[1]; 
	expect(strangeParam.textMarks._shortjsdoc_textmarkplugin_7.binding.annotation).toBe('class'); 
	expect(strangeParam.textMarks._shortjsdoc_textmarkplugin_7.binding.absoluteName).toBe('trees.Bananero'); 
	expect(strangeParam.textMarks._shortjsdoc_textmarkplugin_7.binding.methods.strange.returns.type.name).toBe('Array'); 
	expect(strangeParam.textMarks._shortjsdoc_textmarkplugin_8.binding.annotation).toBe('method');

	expect(strange.returns.textMarks._shortjsdoc_textmarkplugin_9.linkLabel).toBe('This link'); 
	expect(strange.returns.textMarks._shortjsdoc_textmarkplugin_9.linkUrl).toBe('http://google.com/'); 
	
});

});





describe("escape-at", function() 
{

	it("escape @ using @@ in text", function() 
	{
		var jsdoc, maker; 
		var code = 
			'/*@module mymodule this module text contains some "at" characters ' + 
			'one: @@, two: @@@@, three @@@@@@, four: @@@@@@@@' + '\n' +
			'@class C @@ @@@@ @@@@@@ @@@@@@@@' + '\n' +
			'@property C @@ @@@@ @@@@@@ @@@@@@@@' + '\n' +
			'@method m @@thisisnotanannotation' + '\n' +
			'*/';

		maker = new JsDocMaker();
		maker.addFile(code, 'name.js');
		jsdoc = maker.jsdoc();
		maker.postProccess();
		maker.postProccessBinding();

		expect(jsdoc.modules['mymodule'].text).toBe('this module text contains some "at" characters one: @, two: @@, three @@@, four: @@@@'); 
		expect(jsdoc.classes['mymodule.C'].text).toBe('@ @@ @@@ @@@@'); 
		expect(jsdoc.classes['mymodule.C'].methods.m.text).toBe('@thisisnotanannotation'); 
		expect(jsdoc.classes['mymodule.C'].properties.C.text).toBe('@ @@ @@@ @@@@'); 
	});

});




describe("respect original comment indentation", function() 
{

	it("that", function() 
	{
		var jsdoc, maker; 
		var code = 
			'\t\t\t/*' + '\n' +
			'\t\t\t@module a' + '\n' +
			'\t\t\tSome text here' + '\n' +
			'\t\t\t\tfunction f(){' + '\n' +
			'\t\t\t\t\tvar a = [ ' + '\n' +
			'\t\t\t\t\t\t1.2' + '\n' +
			'\t\t\t\t\t,\t1.3' + '\n' +
			'\t\t\t\t\t,\t1.4' + '\n' +
			'\t\t\t\t\t};  ' + '\n' +
			'\t\t\t\t}' + '\n' +
			'\t\t\t*/ ' + '\n' +
			'';

		maker = new JsDocMaker();
		
		
		maker.addFile(code, 'name.js');


		jsdoc = maker.jsdoc();
		maker.postProccess();
		maker.postProccessBinding();

		expect(jsdoc.modules['a'].text).toBe('Some text here\n	function f(){\n		var a = [ \n			1.2\n		,	1.3\n		,	1.4\n		};  \n	}'); 

	});

});




describe("dependencies", function() 
{

	it("class dependencies", function() 
	{
		var jsdoc, maker; 
		var code = 
			'/*' + '\n' +
			'@module a @class A @property {B} b @property {Array<C>} cs' + '\n' +
			'@depends class Foo @depends class Bar' + '\n' +			
			'@method @return {Array<D>} ds' + '\n' +
			'@module b @class Poster @depends class Marge @depends class IgnoreMeAsDependency' + '\n' +
			'@class D foo @class B bar @class C zoar @class Foo lsk djflakd @class Bar laskjd @class Marge @class IgnoreMeAsDependency' + '\n' +
			'@module c @class Animal @method eat @param {Array<Food>} food' + '\n' +
			'@class Food @property {Array<Animal>} bacteria' + '\n' +
			'*/ ' + '\n' +
			'';

		maker = new JsDocMaker();		
		maker.addFile(code, 'name.js');

		jsdoc = maker.jsdoc();
		maker.postProccess();
		maker.postProccessBinding();

		var tool = new maker.tools.DependencyTool(maker, {ignoreClasses: ['b.IgnoreMeAsDependency']}); 
		tool.calculateClassDependencies();

		expect(jsdoc.classes['a.A'].dependencies.classes['b.Foo'].name).toBe('Foo'); 
		expect(jsdoc.classes['a.A'].dependencies.classes['b.Bar'].name).toBe('Bar'); 
		expect(jsdoc.classes['b.Poster'].dependencies.classes['b.Marge'].name).toBe('Marge'); 		
		expect(jsdoc.classes['b.Poster'].dependencies.classes['b.IgnoreMeAsDependency']).toBe(undefined); 

		expect(jsdoc.classes['c.Animal'].dependencies.classes['c.Food'].name).toBe('Food'); 
		expect(jsdoc.classes['c.Food'].dependencies.classes['c.Animal'].name).toBe('Animal'); 
	});

});


// describe("@mtadata annotation", function() 
// {

// 	it("@the ast metadata say how concepts should be named for third party tools like the html app or other any metadata needed", function() 
// 	{
// 		var jsdoc, maker; 
// 		var code =
// 			'//@metadata-global class.name My Chapter' + '\n' +
// 			'//@module m' + '\n' +
// 			'//@class c' + '\n' +
// 			'//@metadata foo.var some text' + '\n' +
// 			'';

// 		maker = new JsDocMaker();		
// 		maker.addFile(code, 'name.js');

// 		jsdoc = maker.jsdoc();
// 		maker.postProccess();
// 		maker.postProccessBinding();

// 		expect(jsdoc.metadata['class.name']==='My Chapter').toBe(true)
// 		expect(jsdoc.classes['m.c'].metadata['foo.var']==='some text').toBe(true)
// 		// console.log(jsdoc.classes['m.c'].metadata)
// 	});
// });




});
