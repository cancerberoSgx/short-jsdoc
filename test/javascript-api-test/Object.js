/*
@module javascript

@class Object
Adapted from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object

@property {ObjectPrototype} prototype
@static 

*/







//?weird use of shortjsdoc. The following is a copy&paste of Object.prototype.js. Since Object extends ObjectPrototype but ObjectPrototype extends Object - circular extension dependency. Error!
/*

@module javascript 



Adapted from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/prototype

The Object.prototype property represents the Object prototype object.

All objects in JavaScript are descended from Object; all objects inherit methods and properties from Object.prototype, although they may be overridden (except an Object with a null prototype, i.e. Object.create(null)). For example, other constructors' prototypes override the constructor property and provide their own toString() methods. Changes to the Object prototype object are propagated to all objects unless the properties and methods subject to those changes are overridden further along the prototype chain.

*/



/*



@property {Function} constructor Specifies the function that creates an object's prototype.

##Summary
Returns a reference to the Object function that created the instance's prototype. Note that the value of this property is a reference to the function itself, not a string containing the function's name. The value is only read-only for primitive values such as 1, true and "test".

##Description

All objects inherit a constructor property from their prototype:

	var o = {};
	o.constructor === Object; // true

	var a = [];
	a.constructor === Array; // true

	var n = new Number(3);
	n.constructor === Number; // true

##Examples

###Example: Displaying the constructor of an object

The following example creates a prototype, Tree, and an object of that type, theTree. The example then displays the constructor property for the object theTree.

	function Tree(name) {
	  this.name = name;
	}

	var theTree = new Tree('Redwood');
	console.log('theTree.constructor is ' + theTree.constructor);
	This example displays the following output:

	theTree.constructor is function Tree(name) {
	  this.name = name;
	}

###Example: Changing the constructor of an object

The following example shows how to modify constructor value of generic objects. Only true, 1 and "test" will not be affected as they have read-only native constructors. This example shows that it is not always safe to rely on the constructor property of an object.

	function Type () {}

	var types = [
	  new Array(),
	  [],
	  new Boolean(),
	  true,             // remains unchanged
	  new Date(),
	  new Error(),
	  new Function(),
	  function () {},
	  Math,
	  new Number(),
	  1,                // remains unchanged
	  new Object(),
	  {},
	  new RegExp(),
	  /(?:)/,
	  new String(),
	  'test'            // remains unchanged
	];
	for (var i = 0; i < types.length; i++) {
	  types[i].constructor = Type;
	  types[i] = [types[i].constructor, types[i] instanceof Type, types[i].toString()];
	}
	console.log(types.join('\n'));
	This example displays the following output:

	function Type() {},false,
	function Type() {},false,
	function Type() {},false,false
	function Boolean() {
	    [native code]
	},false,true
	function Type() {},false,Mon Sep 01 2014 16:03:49 GMT+0600
	function Type() {},false,Error
	function Type() {},false,function anonymous() {

	}
	function Type() {},false,function () {}
	function Type() {},false,[object Math]
	function Type() {},false,0
	function Number() {
	    [native code]
	},false,1
	function Type() {},false,[object Object]
	function Type() {},false,[object Object]
	function Type() {},false,/(?:)/
	function Type() {},false,/(?:)/
	function Type() {},false,
	function String() {
	    [native code]
	},false,тест

*/







/*
@property {Object} __proto__ 
Points to the object which was used as prototype when the object was instantiated.

@property {Function} __noSuchMethod__ 
Allows a function to be defined that will be executed when an undefined object member is called as a method.
*/





/*
@method __defineGetter__()  
Associates a function with a property that, when accessed, executes that function and returns its return value.
*/











/*
@method hasOwnProperty
##Summary
The hasOwnProperty() method returns a boolean indicating whether the object has the specified property.

##Syntax
obj.hasOwnProperty(prop)

##Examples
###Example: Using hasOwnProperty to test for a property's existence

The following example determines whether the o object contains a property named prop:

	o = new Object();
	o.prop = 'exists';

	function changeO() {
	  o.newprop = o.prop;
	  delete o.prop;
	}

	o.hasOwnProperty('prop');   // returns true
	changeO();
	o.hasOwnProperty('prop');   // returns false

###Example: Direct versus inherited properties

The following example differentiates between direct properties and properties inherited through the prototype chain:

	o = new Object();
	o.prop = 'exists';
	o.hasOwnProperty('prop');             // returns true
	o.hasOwnProperty('toString');         // returns false
	o.hasOwnProperty('hasOwnProperty');   // returns false

##Example: Iterating over the properties of an object

The following example shows how to iterate over the properties of an object without executing on inherit properties. Note that the for..in loop is already only iterating enumerable items, so one should not assume based on the lack of non-enumerable properties shown in the loop that hasOwnProperty itself is confined strictly to enumerable items (as with Object.getOwnPropertyNames()).

	var buz = {
	    fog: 'stack'
	};

	for (var name in buz) {
	    if (buz.hasOwnProperty(name)) {
	        alert("this is fog (" + name + ") for sure. Value: " + buz[name]);
	    }
	    else {
	        alert(name); // toString or something else
	    }
	}

###Example: hasOwnProperty as a property

JavaScript does not protect the property name hasOwnProperty; thus, if the possibility exists that an object might have a property with this name, it is necessary to use an external hasOwnProperty to get correct results:

	var foo = {
	    hasOwnProperty: function() {
	        return false;
	    },
	    bar: 'Here be dragons'
	};

	foo.hasOwnProperty('bar'); // always returns false

	// Use another Object's hasOwnProperty and call it with 'this' set to foo
	({}).hasOwnProperty.call(foo, 'bar'); // true

	// It's also possible to use the hasOwnProperty property from the Object property for this purpose
	Object.prototype.hasOwnProperty.call(foo, 'bar'); // true

Note that in the last case there are no newly created objects.

@param param The name of the property to test.

*/








/*
@method isPrototypeOf
##Summary
The isPrototypeOf() method tests for an object in another object's prototype chain.

	Note: isPrototypeOf differs from the instanceof operator. In the expression "object instanceof AFunction", the object prototype chain is checked against AFunction.prototype, not against AFunction itself.

The isPrototypeOf method allows you to check whether or not an object exists within another object's prototype chain.

For example, consider the following prototype chain:

	function Fee() {
	  // . . .
	}

	function Fi() {
	  // . . .
	}
	Fi.prototype = new Fee();

	function Fo() {
	  // . . .
	}
	Fo.prototype = new Fi();

	function Fum() {
	  // . . .
	}
	Fum.prototype = new Fo();

Later on down the road, if you instantiate Fum and need to check if Fi's prototype exists within the Fum prototype chain, you could do this:

	var fum = new Fum();
	. . .
	
	if (Fi.prototype.isPrototypeOf(fum)) {
	  // do something safe
	}
This, along with the instanceof operator particularly comes in handy if you have code that can only function when dealing with objects descended from a specific prototype chain, e.g., to guarantee that certain methods or properties will be present on that object.


@param {Object} obj the object whose prototype chain will be searched
*/





/*
@method propertyIsEnumerable
##Summary
The propertyIsEnumerable() method returns a Boolean indicating whether the specified property is enumerable.

##Description
Every object has a propertyIsEnumerable method. This method can determine whether the specified property in an object can be enumerated by a for...in loop, with the exception of properties inherited through the prototype chain. If the object does not have the specified property, this method returns false.

##Examples
###Example: A basic use of propertyIsEnumerable

The following example shows the use of propertyIsEnumerable on objects and arrays:

	var o = {};
	var a = [];
	o.prop = 'is enumerable';
	a[0] = 'is enumerable';

	o.propertyIsEnumerable('prop');   // returns true
	a.propertyIsEnumerable(0);        // returns true

###Example: User-defined versus built-in objects

The following example demonstrates the enumerability of user-defined versus built-in properties:

	var a = ['is enumerable'];

	a.propertyIsEnumerable(0);          // returns true
	a.propertyIsEnumerable('length');   // returns false

	Math.propertyIsEnumerable('random');   // returns false
	this.propertyIsEnumerable('Math');     // returns false
	Example: Direct versus inherited properties

	var a = [];
	a.propertyIsEnumerable('constructor');         // returns false

	function firstConstructor() {
	  this.property = 'is not enumerable';
	}

	firstConstructor.prototype.firstMethod = function () {};

	function secondConstructor() {
	  this.method = function method() { return 'is enumerable'; };
	}

	secondConstructor.prototype = new firstConstructor;
	secondConstructor.prototype.constructor = secondConstructor;

	var o = new secondConstructor();
	o.arbitraryProperty = 'is enumerable';

	o.propertyIsEnumerable('arbitraryProperty');   // returns true
	o.propertyIsEnumerable('method');              // returns true
	o.propertyIsEnumerable('property');            // returns false

	o.property = 'is enumerable';

	o.propertyIsEnumerable('property');            // returns true

	// These return false as they are on the prototype which 
	// propertyIsEnumerable does not consider (even though the last two
	// are iteratable with for-in)
	o.propertyIsEnumerable('prototype');   // returns false (as of JS 1.8.1/FF3.6)
	o.propertyIsEnumerable('constructor'); // returns false
	o.propertyIsEnumerable('firstMethod'); // returns false

@param prop
The name of the property to test.
*/




/*
@method toLocaleString
##Summary
The toLocaleString() method returns a string representing the object. This method is meant to be overriden by derived objects for locale-specific purposes.

##Syntax
obj.toLocaleString();
##Description
Object's toLocaleString returns the result of calling toString().

This function is provided to give objects a generic toLocaleString method, even though not all may use it. See the list below.

##Objects overriding toLocaleString

Array: Array.prototype.toLocaleString()
Number: Number.prototype.toLocaleString()
Date: Date.prototype.toLocaleString()
*/





/*
@method toString
##Summary
The toString() method returns a string representing object.

##Syntax
obj.toString()
##Description
Every object has a toString() method that is automatically called when the object is to be represented as a text value or when an object is referred to in a manner in which a string is expected. By default, the toString() method is inherited by every object descended from Object. If this method is not overridden in a custom object, toString() returns "[object type]", where type is the object type. The following code illustrates this:

var o = new Object();
o.toString();           // returns [object Object]
Starting in JavaScript 1.8.5 toString() called on null returns [object Null], and undefined returns [object Undefined], as defined in the 5th Edition of ECMAScript and a subsequent Errata. See Using toString to detect object type.
##Examples
###Overriding the default toString method

You can create a function to be called in place of the default toString() method. The toString() method takes no arguments and should return a string. The toString() method you create can be any value you want, but it will be most useful if it carries information about the object.

The following code defines the Dog object type and creates theDog, an object of type Dog:

	function Dog(name,breed,color,sex) {
	   this.name=name;
	   this.breed=breed;
	   this.color=color;
	   this.sex=sex;
	}

	theDog = new Dog("Gabby","Lab","chocolate","female");
If you call the toString() method on this custom object, it returns the default value inherited from Object:

	theDog.toString(); //returns [object Object]
	The following code creates and assigns dogToString() to override the default toString() method. This function generates a string containing the name, breed, color, and sex of the object, in the form "property = value;".

	Dog.prototype.toString = function dogToString() {
	  var ret = "Dog " + this.name + " is a " + this.sex + " " + this.color + " " + this.breed;
	  return ret;
	}
With the preceding code in place, any time theDog is used in a string context, JavaScript automatically calls the dogToString() function, which returns the following string:

Dog Gabby is a female chocolate Lab
Using toString() to detect object class

toString() can be used with every object and allows you to get its class. To use the Object.prototype.toString() with every object, you need to call Function.prototype.call() or Function.prototype.apply() on it, passing the object you want to inspect as the first parameter called thisArg.

	var toString = Object.prototype.toString;

	toString.call(new Date); // [object Date]
	toString.call(new String); // [object String]
	toString.call(Math); // [object Math]

	//Since JavaScript 1.8.5
	toString.call(undefined); // [object Undefined]
	toString.call(null); // [object Null]
*/