
describe("beforeParseNodePlugins", function() 
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

	it("classes with all accepted chars referred from complex objects", function() 
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