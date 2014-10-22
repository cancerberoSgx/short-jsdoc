
describe("several definitions", function() 
{
	var jsdoc, maker; 

	beforeEach(function() 
	{
		var code = 
			'//@module mymodule the first text for mymodule' + '\n' +
			'//@class MyClass some text for myclass' + '\n' +
			'//@method m1 blabalbal @param p1 @param p2' + '\n' +

			'//@module othermodule' + '\n' +
			'//@class MyClass this text is from another class' + '\n' +
			'//@class Other class this text is from another class' + '\n' +
			'//@method m1 blabalbal @param p1 @param p2' + '\n' +

			'//@module mymodule a second text for mymodule' + '\n' +
			'//@class MyClass a second text for my class' + '\n' +
			''; 

		maker = new JsDocMaker();
		maker.parseFile(code, 'textarea'); 
		maker.postProccess();
		maker.postProccessBinding();
		jsdoc = maker.data;
	});

	it("Two definitions of the same module or class should preserve all the texts", function() 
	{
		var mymodule = jsdoc.modules.mymodule; 
		expect(mymodule.text).toBe('the first text for mymodule' + JsDocMaker.MULTIPLE_TEXT_SEPARATOR + 'a second text for mymodule');

		var MyClass = jsdoc.classes['mymodule.MyClass']; 
		expect(MyClass.text).toBe('some text for myclass' + JsDocMaker.MULTIPLE_TEXT_SEPARATOR + 'a second text for my class');
	});

});