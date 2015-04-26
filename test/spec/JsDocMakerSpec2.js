
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