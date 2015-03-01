
describe("text marks", function() 
{

it("using @?something arguments inside text to create named marks inside.", function() 
{
	var jsdoc, maker; 
	var code = 
		'//@module fruits bla bla ' + '\n' +
		'//@class Banana bla bla bla' + '\n' +
		'//@property {Array<String>} flavor bla bla bla' + '\n' +
		'//@event afterSomething bla bla bla' + '\n' +
		'//@class Pineapple bla bla bla' + '\n' +
		'//@method paint ble balskdj laks @param {String} color' + '\n' +
		'//@module trees' + '\n' +
		'//@class  Bananero' + '\n' +
		'//@method strange this methods do the strange thing what is related \n'+
		'//with @?class fruits.Banana and @?class Pineapple because of the destiny' + '\n' +
		'//also @?module fruits is related to this problem and of cource @?method fruits.Pineapple.paint method references are allowed' + '\n' +
		'//@param {String} param2 any tags can also contain @?event fruits.Banana.afterSomething text marks. Events and properties like @?property fruits.Banana.flavor can be contained' + '\n' +
		'//@param {String} p3 this one contain a @?ref trees.Bananero to a class and a @?ref trees.Bananero.strange to a method.\n'+
		'//@return {Array} we want to try @?link "[This link](http://google.com/)" to see what\'s done \n'+
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

	expect(strange.textMarks._shortjsdoc_textmarkplugin_4.binding.annotation).toBe('method'); 
	expect(strange.textMarks._shortjsdoc_textmarkplugin_4.binding.absoluteName).toBe('fruits.Pineapple.paint'); 
	expect(strange.textMarks._shortjsdoc_textmarkplugin_4.binding.params[0].name).toBe('color'); 
	expect(strange.textMarks._shortjsdoc_textmarkplugin_4.binding.params[0].type.name).toBe('String'); 

	var strangeParam = strange.params[0]; 
	expect(strangeParam.textMarks._shortjsdoc_textmarkplugin_5.binding.annotation).toBe('event'); 
	expect(strangeParam.textMarks._shortjsdoc_textmarkplugin_6.binding.annotation).toBe('property'); 

	strangeParam = strange.params[1]; 
	expect(strangeParam.textMarks._shortjsdoc_textmarkplugin_7.binding.annotation).toBe('class'); 
	expect(strangeParam.textMarks._shortjsdoc_textmarkplugin_7.binding.absoluteName).toBe('trees.Bananero'); 
	expect(strangeParam.textMarks._shortjsdoc_textmarkplugin_7.binding.methods.strange.returns.type.name).toBe('Array'); 
	expect(strangeParam.textMarks._shortjsdoc_textmarkplugin_8.binding.annotation).toBe('method');

	expect(strange.returns.textMarks._shortjsdoc_textmarkplugin_9.linkLabel).toBe('This link'); 
	expect(strange.returns.textMarks._shortjsdoc_textmarkplugin_9.linkUrl).toBe('http://google.com/'); 
	
});

});
