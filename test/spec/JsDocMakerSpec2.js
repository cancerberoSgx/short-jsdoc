// describe("JsDocMaker", function() 
// {
// 	describe("Block comments shouln't remove the indentation chars", function() 
// 	{
// 		var jsdoc, maker, Apple, Lion, Lemon; 

// 		beforeEach(function() 
// 		{
// 			var code = 
// 				'/*'+'\n'+
// 				'@class Apple'+'\n'+
// 				'This is a comment that includes'+'\n'+
// 				'new lines and'+'\n'+
// 				'	some'+'\n'+
// 				'		indentation'+'\n'+
// 				'@extends Vegetable'+'\n'+
// 				'*/'+'\n'+

// 				'/*@method beEatenBy apples have this privilege @param {Mouth} mouth the mouth to be used @param {Int} amount @return {String} the bla*/' + '\n' +	
// 				'';
// 			maker = new JsDocMaker();
// 			maker.parseFile(code, 'textarea');
// 			maker.postProccess();
// 			maker.postProccessBinding();
// 			jsdoc = maker.data;
// 		});

// 		it("init", function() 
// 		{
// 			Apple = jsdoc.classes['__DefaultModule.Apple']; 
// 			expect(Apple).toBeDefined();
// 			expect(Apple.text.indexOf('\tsome')>0).toBe(true); 
// 			// debugger;
			
// 		});

// 		it("classes and modules", function() 
// 		{
// 		});
// 	});


// });

