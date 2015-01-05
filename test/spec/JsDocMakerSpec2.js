

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