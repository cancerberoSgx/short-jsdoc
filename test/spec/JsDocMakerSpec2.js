

	describe("inherited mthods and properties", function() 
	{
		var jsdoc, maker; 

		beforeEach(function() 
		{
			var code = 

				'//@module vehicles' + '\n' +

				'//@class Vehicle' + '\n' +
				'//@method move all vehicles move. Subclasses must override this. @param {Vector2D} direction @param {Nmber}' + '\n' +

				'//@class Car @extends Vehicle' + '\n' +
				'//@method balance @param {String} eficiency' + '\n' +

				'//@class VMW @extends Car' + '\n' +
				'//@method deployAirbag' + '\n' +

				'//@class MotorBike @extends Vehicle' + '\n' +
				'//@method doTheWilly' + '\n' +
				'';
			maker = new JsDocMaker();

			maker.parseFile(code, 'genericstest1'); 
			maker.postProccess();
			maker.postProccessBinding();
			maker.postProccessInherited(); // <-- important - explicitlyask the framework to calculate inherited methods&properties
			
			jsdoc = maker.data;
		});

		it("inherited methods", function() 
		{
			var Car = jsdoc.classes['vehicles.Car'];
			expect(Car.inherited.methods.move.absoluteName).toBe('vehicles.Vehicle.move'); 
			expect(Car.inherited.methods.move.ownerClass).toBe('vehicles.Vehicle'); 
			expect(Car.inherited.methods.move.text).toBe('all vehicles move. Subclasses must override this.'); 

			var VMW = jsdoc.classes['vehicles.VMW'];
			expect(VMW.inherited.methods.move.absoluteName).toBe('vehicles.Vehicle.move'); 
			expect(VMW.inherited.methods.move.ownerClass).toBe('vehicles.Vehicle'); 
			expect(VMW.inherited.methods.move.text).toBe('all vehicles move. Subclasses must override this.'); 
			expect(VMW.inherited.methods.balance.absoluteName).toBe('vehicles.Car.balance'); 
			expect(VMW.inherited.methods.balance.params[0].type.name).toBe('String'); 
		});
	});

