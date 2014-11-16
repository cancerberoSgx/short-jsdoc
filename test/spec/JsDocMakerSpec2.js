

describe("talking about the same class in different places", function() 
{
	var jsdoc, maker; 

	beforeEach(function() 
	{
		var code = 
			'//@module mymodule' + '\n' +

			'//@class MyClass some text for myclass' + '\n' +
			'var MyClass = function(){}' + '\n' +

			'//@method m1 blabalbal @param p1 @param p2' + '\n' +
			'MyClass.prototype.m1 = function(p1, p2){};' + '\n' +

			'//@class OtherClass some text for the other class' + '\n' +
			'var MyClass = function(){}' + '\n' +

			'//@method m3 blabalbal @param a @param b' + '\n' +
			'MyClass.prototype.m3 = function(a, b){};' + '\n' +

			'//@class MyClass' + '\n' +
			'//@method m2 blabalbal @param c @param d' + '\n' +
			'MyClass.prototype.m2 = function(c, d){};' + '\n' +
			''; 

		maker = new JsDocMaker();
		maker.parseFile(code, 'textarea'); 
		maker.postProccess();
		maker.postProccessBinding();
		jsdoc = maker.data;
	});

	it("Two definitions of the same module or class should preserve all the texts", function() 
	{
		var MyClass = jsdoc.classes['mymodule.MyClass']; 
		debugger;
	});

});