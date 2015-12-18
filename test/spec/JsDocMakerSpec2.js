var JsDocMaker = typeof _ === 'undefined' ? require('../../src/jsdocmaker/main.js') : JsDocMaker; 
var _ = typeof _ === 'undefined' ? require('underscore') : _; 

describe("custom child annotation", function() 
{

	it("custom annotations will be parsed in 'children' property and can contain characters '.', '-', '_'", function() 
	{
		var jsdoc, maker; 
		var code =

			// '//@alias annotation module gulp-task' + '\n' +

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