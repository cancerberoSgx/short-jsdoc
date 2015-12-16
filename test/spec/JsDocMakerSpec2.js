var JsDocMaker = typeof _ === 'undefined' ? require('../../src/jsdocmaker/main.js') : JsDocMaker; 
var _ = typeof _ === 'undefined' ? require('underscore') : _; 

describe("@function", function() 
{

	it("a module can contain functions", function() 
	{
		var jsdoc, maker; 
		var code = 
			'/*' + '\n' +
			'@module a ' + 
			'@function f1 @param {C} f11 @return {C} f1r' + 
			'@class A @method m sl @param mp1 @return {mr1}' + 
			'@function f2 @param f21 @return f2r' + 
			'@class C @class B @extends A' + '\n' +
			'@function f3 @param f31 @return f3r' +
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
	});

});