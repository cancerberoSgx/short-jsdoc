
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

	it("classes with all accepted chars referred from complex objects", function() 
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