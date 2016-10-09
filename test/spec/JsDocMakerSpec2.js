var JsDocMaker = typeof _ === 'undefined' ? require('../../src/jsdocmaker/main.js') : JsDocMaker; 
var _ = typeof _ === 'undefined' ? require('underscore') : _; 

describe("@interface and @implements", function() 
{
	it('@implement and @interface', function() 
	{
		var code = 
			// '// @alias annotation interface class\n' + 
			// '/* @alias annotation interface class \n */' + 
			'//@module interfacetest2\n'+
			'//@interface Interface1 this is interface 1 @method superInter @return {Number} '+'\n'+
			'//@interface Interface2 @extends Interface1 '+'\n'+
			'//@interface Interface3 '+'\n'+
			'/*@method inter2Method foo bar and apples have this privilege @param {Mouth} mouth the mouth to be used \n'+
			'@param {Int} amount @return {String} the bla*/' + '\n' +
			'//@class SomeConcrete2 hello this is a concrete class implementing multiple interfaces  \n'+
			'//@implements Interface1 @implements Interface3\n'+
			'';
		maker = new JsDocMaker();
		maker.parseFile(code, 'textarea');
		maker.postProccess();
		maker.postProccessBinding();
		jsdoc = maker.data;
		
		var SomeConcrete2 = jsdoc.classes['interfacetest2.SomeConcrete2']
		// console.log(jsdoc, SomeConcrete2)
		expect(SomeConcrete2.implements.length).toBe(2);
		expect(_.find(SomeConcrete2.implements, function(i){return i.absoluteName==='interfacetest2.Interface1'}).methods.superInter.returns.type.name).toBe('Number');
	});

})