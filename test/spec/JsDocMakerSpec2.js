// var JsDocMaker = typeof _ === 'undefined' ? require('../../src/jsdocmaker/main.js') : JsDocMaker; 
// var _ = typeof _ === 'undefined' ? require('underscore') : _; 

// describe("can bind @function as types", function() 
// {
// 	it('filter by child annotation', function() 
// 		// use case - I have a large project full of comments - but I want to mark somehow a public API with a custom child annotation like 
// 		// @ public or @ publicapi so we can filter a fragment of a full jsdoc for a particular api / layer / etc
// 	{
// 		var code = 
// 			'//@module functionAsTypesModule\n'+
// 			'//@function F1 @param {Array<Number>} sortNumbers @return {Array<Number>}\n'+

// 			'//@class C1\n'+
// 			'//@method m1 @param {F1} fn @param {Boolean} opacity\n'+


// 			'//@class Annotated\n'+
// 			'//@method m1 @param {F1} fn @param {Boolean} opacity\n'+
// 			'//@publicapi\n'+
// 			'';
// 		var maker = new JsDocMaker();
// 		JsDocMaker.filterByChildAnnotation({})
// 		// maker.setConfig('filter-by-child-annotations', ['publicapi'])
		
// 		maker.parseFile(code, 'textarea');
// 		maker.postProccess();
// 		maker.postProccessBinding();
// 		jsdoc = maker.data;
		
// 		var paramType = jsdoc.classes['functionAsTypesModule.C1'].methods.m1.params[0].type
// 		expect(paramType.absoluteName).toBe('functionAsTypesModule.F1')
// 		expect(paramType.annotation).toBe('function')
// 	});

// })