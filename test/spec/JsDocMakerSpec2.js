var JsDocMaker = typeof _ === 'undefined' ? require('../../src/jsdocmaker/main.js') : JsDocMaker; 
var _ = typeof _ === 'undefined' ? require('underscore') : _; 

describe("can bind @function as types", function() 
{
	it('@implement and @interface', function() 
	{
		var code = 
			'//@module functionAsTypesModule\n'+
			'//@function F1 @param {Array<Number>} sortNumbers @return {Array<Number>}\n'+

			'//@class C1\n'+
			'//@method m1 @param {F1} fn @param {Boolean} opacity\n'+
			'';
		maker = new JsDocMaker();
		maker.parseFile(code, 'textarea');
		maker.postProccess();
		maker.postProccessBinding();
		jsdoc = maker.data;
		
		var paramType = jsdoc.classes['functionAsTypesModule.C1'].methods.m1.params[0].type
		expect(paramType.absoluteName).toBe('functionAsTypesModule.F1')
		expect(paramType.annotation).toBe('function')
	});

})