var JsDocMaker = typeof _ === 'undefined' ? require('../../src/jsdocmaker/main.js') : JsDocMaker; 
var _ = typeof _ === 'undefined' ? require('underscore') : _; 


describe("filter by child annotation", function() 
{
	it('fJsDocMaker.filterByChildAnnotation should remove classes that dont have a descendant child with given annotation', function() 
		// use case - I have a large project full of comments - but I want to mark somehow a public API with a custom child annotation like 
		// @ public or @ publicapi so we can filter a fragment of a full jsdoc for a particular api / layer / etc
	{
		var code = 
			'//@module big-module\n'+
			'//@function F1 @param {Array<Number>} sortNumbers @return {Array<Number>}\n'+
			'//@function F2 @param {Array<Number>} sortNumbers @return {Array<Number>}\n'+

			'//@class C1\n'+
			'//@method m1 @param {F1} fn @param {Boolean} opacity\n'+


			'//@class Annotated\n'+
			'//@method m1 @param {F1} fn @param {Boolean} opacity\n'+
			'//@publicapi\n'+
			'//@method m2 @param {F2} fn @param {Boolean} ehll\n'+
			'//@notpulicapi\n'+


			'//@class Annotated2\n'+
			'//@property p1\n'+
			'//@publicapi\n'+

			'//@property p2\n'+

			'//@interface IComponent'+
			'//@method do @publicapi'+

			'//@class C3 blabla @extends Annotated2 @publicapi'+
			'//@method notMarked'+


			'//@class C4 blabla @extends Annotated2 @anotherannotation'+
			'//@method notMarked'+


			'//@module m2'+
			'//@class C4'+
			'';
		
		var maker = new JsDocMaker();
		maker.parseFile(code, 'textarea');
		maker.postProccess();
		maker.postProccessBinding();

		JsDocMaker.filterByChildAnnotation({jsdocmaker: maker, annotations: ['publicapi']})
		
		var jsdoc = maker.data

		expect(!!jsdoc.classes['big-module.C3']).toBe(true)
		expect(!!jsdoc.classes['big-module.C4']).toBe(false)

		expect(!!jsdoc.classes['big-module.C1']).toBe(false)
		expect(!!jsdoc.classes['big-module.Annotated']).toBe(true)
		expect(!!_.find(jsdoc.classes['big-module.Annotated'].methods, (p)=>p.name=='m1')).toBe(true)
		expect(!!_.find(jsdoc.classes['big-module.Annotated'].methods, (p)=>p.name=='m2')).toBe(false)
		expect(!!jsdoc.classes['big-module.Annotated2']).toBe(true)
		expect(!!_.find(jsdoc.classes['big-module.Annotated2'].properties, (p)=>p.name=='p1')).toBe(true)
		expect(!!_.find(jsdoc.classes['big-module.Annotated2'].properties, (p)=>p.name=='p2')).toBe(false)
		expect(!!jsdoc.classes['big-module.IComponent']).toBe(true)
		expect(!!jsdoc.modules.m2).toBe(false)
		expect(!!jsdoc.classes['m1.C4']).toBe(false)
	});

})
