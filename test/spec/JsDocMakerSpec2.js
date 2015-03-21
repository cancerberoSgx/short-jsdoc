
describe("escape-at", function() 
{

	it("escape @ using @@ in text", function() 
	{
		var jsdoc, maker; 
		var code = 
			'/*@module mymodule this module text contains some "at" characters ' + 
			'one: @@, two: @@@@, three @@@@@@, four: @@@@@@@@' + '\n' +
			'@class C @@ @@@@ @@@@@@ @@@@@@@@' + '\n' +
			'@property C @@ @@@@ @@@@@@ @@@@@@@@' + '\n' +
			'@method m @@thisisnotanannotation' + '\n' +
			'*/';

		maker = new JsDocMaker();
		maker.addFile(code, 'name.js');
		jsdoc = maker.jsdoc();
		maker.postProccess();
		maker.postProccessBinding();

		expect(jsdoc.modules['mymodule'].text).toBe('this module text contains some "at" characters one: @, two: @@, three @@@, four: @@@@'); 
		expect(jsdoc.classes['mymodule.C'].text).toBe('@ @@ @@@ @@@@'); 
		expect(jsdoc.classes['mymodule.C'].methods.m.text).toBe('@thisisnotanannotation'); 
		expect(jsdoc.classes['mymodule.C'].properties.C.text).toBe('@ @@ @@@ @@@@'); 
	});

});