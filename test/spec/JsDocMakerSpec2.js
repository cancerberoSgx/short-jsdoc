
describe("text marks", function() 
{

it("using @?something arguments inside text to create named marks inside.", function() 
{
	var jsdoc, maker; 
	var code = 
		'//@module fruits bla bla ' + '\n' +
		'//@class Banana bla bla bla' + '\n' +
		'//@class Pineapple bla bla bla' + '\n' +
		'//@method paint ble balskdj laks @param {String} color' + '\n' +
		'//@module trees' + '\n' +
		'//@class  Bananero' + '\n' +
		'//@method strange this methods do the strange thing what is related \n'+
		'//with @?class fruits.Banana and @?class Pineapple because of the destiny' + '\n' +
		'//also @?module fruits is related to this problem and of cource @?method fruits.Pineapple.paint method references are allowed' + '\n' +
		'';

	maker = new JsDocMaker();
	maker.addFile(code, 'name.js');
	jsdoc = maker.jsdoc();

	var strange = jsdoc.classes['trees.Bananero'].methods.strange;
	expect(strange.text).toBe('this methods do the strange thing what is related with _shortjsdoc_textmarkplugin_1 and _shortjsdoc_textmarkplugin_2 because of the destiny also _shortjsdoc_textmarkplugin_3 is related to this problem and of cource _shortjsdoc_textmarkplugin_4 method references are allowed'); 
	
	expect(strange.textMarks._shortjsdoc_textmarkplugin_1.name).toBe('class');
	expect(strange.textMarks._shortjsdoc_textmarkplugin_1.arg).toBe('fruits.Banana');

	expect(strange.textMarks._shortjsdoc_textmarkplugin_2.name).toBe('class');
	expect(strange.textMarks._shortjsdoc_textmarkplugin_2.arg).toBe('Pineapple');

	expect(strange.textMarks._shortjsdoc_textmarkplugin_3.name).toBe('module');
	expect(strange.textMarks._shortjsdoc_textmarkplugin_3.arg).toBe('fruits');

	expect(strange.textMarks._shortjsdoc_textmarkplugin_4.name).toBe('method');
	expect(strange.textMarks._shortjsdoc_textmarkplugin_4.arg).toBe('fruits.Pineapple.paint');

	maker.postProccess();
	maker.postProccessBinding();

	expect(strange.textMarks._shortjsdoc_textmarkplugin_1.binding.absoluteName).toBe('fruits.Banana');
	expect(strange.textMarks._shortjsdoc_textmarkplugin_1.binding.annotation).toBe('class');
	expect(strange.textMarks._shortjsdoc_textmarkplugin_2.binding.methods.paint.params[0].name).toBe('color');
	expect(strange.textMarks._shortjsdoc_textmarkplugin_3.binding.name).toBe('fruits');

	expect(strange.textMarks._shortjsdoc_textmarkplugin_4.binding.annotation).toBe('method')
	expect(strange.textMarks._shortjsdoc_textmarkplugin_4.binding.absoluteName).toBe('fruits.Pineapple.paint')
	expect(strange.textMarks._shortjsdoc_textmarkplugin_4.binding.params[0].name).toBe('color')
	expect(strange.textMarks._shortjsdoc_textmarkplugin_4.binding.params[0].type.name).toBe('String')
    
});

});
