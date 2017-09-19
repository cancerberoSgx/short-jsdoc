var JsDocMaker = typeof _ === 'undefined' ? require('../../src/jsdocmaker/main.js') : JsDocMaker; 
var _ = typeof _ === 'undefined' ? require('underscore') : _; 

describe("filter by child annotation", function() 
{
	it('fJsDocMaker.filterByChildAnnotation should remove classes that dont have a descendant child with given annotation', function() 
		// use case - I have a large project full of comments - but I want to mark somehow a public API with a custom child annotation like 
		// @ public or @ publicapi so we can filter a fragment of a full jsdoc for a particular api / layer / etc
	{
		var code = 
			'//@module functionAsTypesModule\n'+
			'//@function F1 @param {Array<Number>} sortNumbers @return {Array<Number>}\n'+
			'//@function F2 @param {Array<Number>} sortNumbers @return {Array<Number>}\n'+

			'//@class C1\n'+
			'//@method m1 @param {F1} fn @param {Boolean} opacity\n'+


			'//@class Annotated\n'+
			'//@method m1 @param {F1} fn @param {Boolean} opacity\n'+
			'//@publicapi\n'+


			'//@class Annotated2\n'+
			'//@property p1\n'+
			'//@publicapi\n'+

			'//@property p2\n'+

			'//@interface IComponent'+
			'//@method do @publicapi'+

			'//@module m2'+
			'//@class C4'+
			'';
		
		var maker = new JsDocMaker();
		maker.parseFile(code, 'textarea');
		maker.postProccess();
		maker.postProccessBinding();

		JsDocMaker.filterByChildAnnotation({jsdocmaker: maker, annotations: ['publicapi']})
		
		var jsdoc = maker.data

		console.log(jsdoc)
		expect(!!jsdoc.classes['functionAsTypesModule.C1']).toBe(false)
		expect(!!jsdoc.classes['functionAsTypesModule.Annotated']).toBe(true)
		expect(!!jsdoc.classes['functionAsTypesModule.Annotated2']).toBe(true)
		expect(!!_.find(jsdoc.classes['functionAsTypesModule.Annotated2'].properties, (p)=>p.name=='p1')).toBe(true)
		expect(!!_.find(jsdoc.classes['functionAsTypesModule.Annotated2'].properties, (p)=>p.name=='p2')).toBe(false)
		expect(!!jsdoc.classes['functionAsTypesModule.IComponent']).toBe(true)
		expect(!!jsdoc.modules.m2).toBe(false)
	});

})