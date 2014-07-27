describe("JsDocMaker", function() 
{

	describe("Basic jsdoc parser", function() 
	{
		var jsdoc, maker; 

		beforeEach(function() 
		{
			var code = '//@class Apple @extend Fruit @module livingThings'+'\n'+
				'/*@method beEatenBy apples have this privilege @param {Mouth} mouth the mouth to be used @param {Int} amount */' + '\n' +
				'//@property {Color} color the main color of this fruit'+'\n'+
				'';
			maker = new JsDocMaker();
			maker.parseFile(code, 'textarea');
			maker.postProccess();
			maker.postProccessBinding();
			jsdoc = maker.data;
		});

		it("classes and modules", function() 
		{
			expect(jsdoc.modules.livingThings).toBeDefined();
			var Apple = jsdoc.classes['livingThings.Apple']; 
			expect(Apple).toBeDefined();

			expect(Apple.module.name).toBe('livingThings');
			expect(Apple.absoluteName).toBe('livingThings.Apple');

			//extends is not binded because we never declared the parent class
			expect(Apple.extends.name).toBe('Fruit');
			expect(Apple.extends.error).toBe('NAME_NOT_FOUND');
		});

		it("methods", function() 
		{
			var Apple = jsdoc.classes['livingThings.Apple']; 
			expect(Apple.methods.beEatenBy).toBeDefined();
			expect(Apple.methods.beEatenBy.absoluteName).toBe('livingThings.Apple.beEatenBy');
		});

		it("properties", function() 
		{
			var Apple = jsdoc.classes['livingThings.Apple']; 
			expect(Apple.properties.color.name).toBe('color');
			expect(Apple.properties.color.type.name).toBe('Color');
		});		

		it("method's params", function() 
		{
			var Apple = jsdoc.classes['livingThings.Apple']; 
			
			expect(Apple.methods.beEatenBy.params.length).toBe(2);
			expect(Apple.methods.beEatenBy.params[0].name).toBe('mouth');
			expect(Apple.methods.beEatenBy.params[0].type.name).toBe('Mouth');
			expect(Apple.methods.beEatenBy.params[0].type.error).toBe('NAME_NOT_FOUND'); //because it was never declared
			expect(Apple.methods.beEatenBy.params[0].text).toBe('the mouth to be used');		

			expect(Apple.methods.beEatenBy.params[1].name).toBe('amount');
			expect(Apple.methods.beEatenBy.params[1].type.name).toBe('Int');
		});
	});



	describe("extends binds the types", function() 
	{
		var jsdoc, maker; 

		beforeEach(function() 
		{
			var code = 
				'//@class Animal @module livingThings2' + '\n' +
				'//@method run @param {int} amount in kilometers @final and @static' + '\n' + //TODO: i need to add an 'and' word here for not breaking th regexp.
				'//@class Monkey @extend Animal @module livingThings2' + '\n' +
				'//@method eat way of feeding' + '\n' +
				'//@param {Int} amount' + '\n' +
				'//@param {Food} food what is eaten' + '\n' +
				'//@return {Energy} the total energy generated afte rthe proccess' + '\n' +
				''; 
			maker = new JsDocMaker();
			maker.parseFile(code, 'textarea'); 
			maker.postProccess();
			maker.postProccessBinding();
			jsdoc = maker.data;
		});

		it("should be able to parse some javascript code", function() 
		{
			expect(jsdoc.modules.livingThings2).toBeDefined();
			var Monkey = jsdoc.classes['livingThings2.Monkey']; 
			expect(Monkey).toBeDefined();
			expect(Monkey.absoluteName).toBe('livingThings2.Monkey');
			expect(Monkey.name).toBe('Monkey');

			expect(Monkey.extends.name).toBe('Animal');
			expect(Monkey.extends.absoluteName).toBe('livingThings2.Animal');
			expect(Monkey.extends.name).toBe('Animal');
			expect(Monkey.extends.methods.run.params.length).toBe(1);
			expect(_(Monkey.extends.methods.run.modifiers).contains('final')).toBe(true);
			expect(_(Monkey.extends.methods.run.modifiers).contains('static')).toBe(true);
			
		});


		it("parseType", function() 
		{
			var parsed = JsDocMaker.parseType('Map<String,Array<Apple>>'); 
			expect(parsed.name).toBe('Map'); 
			expect(parsed.params[0]).toBe('String'); 
			expect(parsed.params[1].name).toBe('Array'); 
			expect(parsed.params[1].params[0]).toBe('Apple'); 
		}); 


	});




});






		// if(!text)
		// {
		// 	return;
		// }
		// // 
		// // while ( (result = regex.exec(text)) ) {

		// var name, params;
		// if(text.indexOf('<') !== -1)
		// {
		// 	name = text.substring(0, text.indexOf('<')); 
		// 	params = text.substring(text.indexOf('<'), text.length); 
		// }
		// else
		// {
		// 	name = 	text;
		// }
		// node.name=name;
		
		// if(params)
		// {
		// 	var b = /<(\w+)>/gi.exec(params)
		// 	console.log(params, b)
		// 	// params = params.split(',')

		// }
		// console.log(name, params); 



		// if(params)
		// {

		// }
		// var a = text.split('<'); 
		// console.log(a)
		// if(!a || !a.length)
		// {
		// 	return;
		// }
		// node.name = a[0];
		// var paramString = a.length>1 ? a[1] : undefined;
		// if(!paramString||paramString.length<2)
		// {
		// 	return;
		// }
		// paramString = paramString.substring(0,paramString.length-1); 

// console.log(node.name, paramString); 
		// JsDocMaker.parseTypeText(paramString); 
		// var params = 
		// debugger;

		// while ( (result = regex.exec(text)) )
		// {
		// 	var paramsPart = result[0].split('<'); 
		// 	if(result.length === 2) //don't have params
		// 	{

		// 	}
		// 	else if(result.length === 3) //have params
		// 	{

		// 	}

		// 	console.log(result.length, result); 
		// 	// if(result.length<2)
		// 	// {
		// 	// 	break;
		// 	// }
		// 	// text = result[1]; //text.replace(/<([\w]+)>/gi, '$1');
		// }