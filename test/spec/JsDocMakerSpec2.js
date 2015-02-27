
describe("text marks", function() 
{

it("using @?something arguments inside text to create named marks inside.", function() 
{
	var jsdoc, maker; 
	var code = 
		'//@module fruits bla bla ' + '\n' +
		'//@class Banana bla bla bla' + '\n' +
		'//@method paint ble balskdj laks' + '\n' +
		'//@module trees' + '\n' +
		'//@class  Bananero' + '\n' +
		'//@method strange this methods do the strange thing what is related \n'+
		'//with @?ref fruits.Banana and @?foo fruits.Banana.paint because of the destiny' + '\n' +
		'';

	maker = new JsDocMaker();
	maker.addFile(code, 'name.js');
	jsdoc = maker.jsdoc();
	// maker.postProccess();
	// maker.postProccessBinding();

	var strange = jsdoc.classes['trees.Bananero'].methods.strange;
	expect(strange.text).toBe('this methods do the strange thing what is related with _shortjsdoc_textmarkplugin_1 and _shortjsdoc_textmarkplugin_2 because of the destiny'); 
	expect(strange.textMarks._shortjsdoc_textmarkplugin_1.name).toBe('ref');
	expect(strange.textMarks._shortjsdoc_textmarkplugin_1.arg).toBe('fruits.Banana');
	expect(strange.textMarks._shortjsdoc_textmarkplugin_2.arg).toBe('fruits.Banana.paint');
	expect(strange.textMarks._shortjsdoc_textmarkplugin_2.name).toBe('foo');
});

});
