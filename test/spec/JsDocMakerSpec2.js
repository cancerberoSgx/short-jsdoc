

describe("support several types of block comments", function() 
{
		
	describe("block commments with style", function() 
	{
		it("/** style blocks", function() 
		{
			var code = 
				'//@module stuff2' + '\n' +	
				'/**@class Sky\n * some text\n * and another line\n */' + '\n'; 

			var maker = new JsDocMaker();
			maker.parseFile(code); 
			maker.postProccess();
			maker.postProccessBinding();
			var jsdoc = maker.data;

			var Sky = jsdoc.classes['stuff2.Sky'];
			expect(Sky.text).toBe(' some text\n and another line');
		});
	});

});


