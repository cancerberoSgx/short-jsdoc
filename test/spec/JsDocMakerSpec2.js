var JsDocMaker = typeof _ === 'undefined' ? require('../../src/jsdocmaker/main.js') : JsDocMaker; 
var _ = typeof _ === 'undefined' ? require('underscore') : _; 

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

		expect(!!_.find(jsdoc.modules, function(m){return m.name==='javascript'})).toBe(true)
		expect(!!_.find(jsdoc.modules, function(m){return m.name==='m'})).toBe(true)
		expect(!!_.find(jsdoc.modules, function(m){return m.name==='sass'})).toBe(true)

		expect(!!jsdoc.classes['javascript.c0']).toBe(true)
		expect(!!jsdoc.classes['sass.c1']).toBe(true)
		expect(!!jsdoc.classes['m.c']).toBe(true)
		// console.log(jsdoc.modules)
	});
});