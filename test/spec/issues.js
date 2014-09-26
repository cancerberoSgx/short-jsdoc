
describe("issues - will fail - we will try to fix them", function() 
{	
	it("using different comment syntax for method and param", function() 
	{
		var code = 
			'//@module issues' + '\n' +	
			'/*@class Mercury some text ' + '\n' +	
			'@method method1' + '\n' +	
			'@return {Array} some text*/' + '\n' +
			'//@param {String} param1 some text' + '\n' +	
			''; 

		var maker = new JsDocMaker();
		maker.parseFile(code); 
		maker.postProccess();
		maker.postProccessBinding();

		var Mercury = maker.data.classes['issues.Mercury'];

		//this is OK the method is OK
		expect(Mercury.methods.method1.absoluteName).toBe('issues.Mercury.method1');

		//this is error - the param is not defined
		expect(Mercury.params).toBeDefined();
	});
});
