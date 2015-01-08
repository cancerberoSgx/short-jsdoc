

//POST PROCESSING


//@property {Array<Function>}postProccessors
JsDocMaker.prototype.postProccessors = []; 

// @method postProccess so the data is already parsed but we want to normalize some 
// children like @extend and @ module to be properties of the unit instead children.
// Also we enforce explicit  parent reference, this is a class must reference its 
// parent module and a method muest reference its parent class. Also related to this 
// is the fullname property that will return an unique full name in the format 
// '$MODULE.$CLASS.$METHOD'. We assume that a module contains unique named classes and 
// that classes contain unique named properties and methods. 
JsDocMaker.prototype.postProccess = function()
{
	var self = this;

	// set params and throws of constructors
	_(self.data.classes).each(function(c)
	{
		_(c.constructors).each(function(co){
			co.params = _(co.children||[]).filter(function(child)
			{
				return child.annotation === 'param'; 
			});

			co.throws = _(co.children||[]).filter(function(child)
			{
				return child.annotation === 'throw' || child.annotation === 'throws'; 
			});
		}); 
	}); 
}; 


//@method postProccessBinding precondion: call postProccess() first. We separated the post proccessing in two because we shouln't do JSON.stringify() after we bind types because of recursive loops. 
JsDocMaker.prototype.postProccessBinding = function()
{
	if(this.literalObjectInstall)
	{
		this.literalObjectInstall(); 
	}
	var self = this;
	
	//at this points we have all our modules and classes - now we normalize extend, methods and params and also do the type binding. 
	_(self.data.classes).each(function(c)
	{
		//class.extends property
		var extend = _(c.children||[]).find(function(child)
		{
			return child.annotation === 'extend' || child.annotation === 'extends'; 
		}); 

		if(!extend) // All classes must extend something
		{
			extend = c.extends = (self.bindClass(JsDocMaker.DEFAULT_CLASS, c) || {error: 'NAME_NOT_FOUND', name: JsDocMaker.DEFAULT_CLASS});
		}
		else 
		{
			c.extends = self.bindClass(extend.name, c);
			c.children = _(c.children).without(extend);	//TODO: why we would want to do this? - remove this line
		}


		//setup methods & constructors

		var methods = _(c.methods).clone() || {};
		if(c.constructors) 
        {
            for (var i = 0; i < c.constructors.length; i++) 
            {
                var cname = 'constructor ' + i;
                methods[cname] = c.constructors[i]; //using invalid method name
                c.constructors[i].name = i+'';
            }
        }

		_(methods).each(function(method)
		{
			//method.param property
			var params = _(method.children||[]).filter(function(child)
			{
				child.text = JsDocMaker.stringTrim(child.text||''); 
				return child.annotation === 'param'; 
			}); 
			method.params = params; 

			method.ownerClass = c.absoluteName;				
			method.absoluteName = c.absoluteName + JsDocMaker.ABSOLUTE_NAME_SEPARATOR + method.name; 

			_(method.params).each(function(param)
			{
				if(_(param.type).isString())
				{
					param.typeOriginalString = param.type; 
					param.type = self.parseTypeString(param.type, c) || param.type;						
				}
			}); 

			//method throws property
			var throw$ = _(method.children||[]).filter(function(child)
			{
				// child.text = JsDocMaker.stringTrim(child.text||''); 
				return child.annotation === 'throw' || child.annotation === 'throws'; 
			}); 
			method.throws = throw$; 
			// method.ownerClass = c.absoluteName;				
			// method.absoluteName = c.absoluteName + JsDocMaker.ABSOLUTE_NAME_SEPARATOR + method.name; 
			_(method.throws).each(function(t)
			{
				//because @throws doesn't have a name it breaks our simple grammar, so we merge the name with its text.
				t.text = (t.name ? t.name+' ' : '') + (t.text||''); 
				if(_(t.type).isString())
				{
					t.typeOriginalString = t.type; 
					t.type = self.parseTypeString(t.type, c) || t.type;						
				}
			}); 

			//method.returns property
			var returns = _(method.children||[]).filter(function(child)
			{
				child.text = JsDocMaker.stringTrim(child.text||''); 
				return child.annotation === 'returns' || child.annotation === 'return'; 
			}); 
			method.returns = returns.length ? returns[0] : {name:'',type:''};

			//because @returns doesn't have a name it breaks our simple grammar, so we merge the name with its text.
			method.returns.text = (method.returns.name ? method.returns.name+' ' : '') + (method.returns.text||''); 

			if(_(method.returns.type).isString())
			{
				method.returns.type = self.parseTypeString(method.returns.type, c) || method.returns.type;						
			}

			if(self.installModifiers)
			{
				self.installModifiers(method); 
			}
		});

		//setup properties
		var propertySetup = function(prop)
		{
			prop.ownerClass = c.absoluteName;
			prop.absoluteName = c.absoluteName + JsDocMaker.ABSOLUTE_NAME_SEPARATOR + prop.name; 
			if(self.installModifiers)
			{
				self.installModifiers(prop); 
			}
			if(_(prop.type).isString())
			{
				prop.type = self.parseTypeString(prop.type, c) || prop.type;
			}	
		}; 
		_(c.properties).each(propertySetup);
		_(c.events).each(propertySetup);
	});
};
