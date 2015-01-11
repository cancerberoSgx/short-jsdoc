
describe("@alias", function() 
{

	it("creating shortcuts with alias", function() 
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
