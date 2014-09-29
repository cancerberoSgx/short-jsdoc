/*
@module javascript

@class Object
Adapted from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object

#Description
The Object constructor creates an object wrapper for the given value. If the value is null or undefined, it will create and return an empty object, otherwise, it will return an object of a Type that corresponds to the given value. If the value is an object already, it will return the value.

When called in a non-constructor context, Object behaves identically to new Object().

#Object instances and Object prototype object
All objects in JavaScript are descended from Object; all objects inherit methods and properties from Object.prototype, although they may be overridden. For example, other constructors' prototypes override the constructor property and provide their own toString methods. Changes to the Object prototype object are propagated to all objects unless the properties and methods subject to those changes are overridden further along the prototype chain.

#Examples
##Example: Using Object given undefined and null types

The following examples store an empty Object object in o:

	var o = new Object();
	var o = new Object(undefined);
	var o = new Object(null);
##Example: Using Object to create Boolean objects

The following examples store Boolean objects in o:

	// equivalent to o = new Boolean(true);
	var o = new Object(true);
	// equivalent to o = new Boolean(false);
	var o = new Object(Boolean());


@property {ObjectPrototype} prototype

@static 

*/

/*
@constructor bla bla

	// Object initialiser or literal 
	{ [ nameValuePair1 [, nameValuePair2 [, ...nameValuePairN] ] ] }  
	// Called as a constructor 
	new Object( [ value ] )

@param nameValuePair1,nameValuePair2,...nameValuePairN Pairs of names (strings) and values (any value) where the name is separated from the value by a colon.
@param value Any value.
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











/*
@method create

#Summary
The Object.create() method creates a new object with the specified prototype object and properties.

#Syntax
	Object.create(proto[, propertiesObject])

#Examples

##Example: Classical inheritance with Object.create

Below is an example of how to use Object.create to achieve classical inheritance. This is for single inheritance, which is all that Javascript supports.

	// Shape - superclass
	function Shape() {
	  this.x = 0;
	  this.y = 0;
	}

	// superclass method
	Shape.prototype.move = function(x, y) {
	  this.x += x;
	  this.y += y;
	  console.info('Shape moved.');
	};

	// Rectangle - subclass
	function Rectangle() {
	  Shape.call(this); // call super constructor.
	}

	// subclass extends superclass
	Rectangle.prototype = Object.create(Shape.prototype);
	Rectangle.prototype.constructor = Rectangle;

	var rect = new Rectangle();

	rect instanceof Rectangle; // true
	rect instanceof Shape; // true

	rect.move(1, 1); // Outputs, 'Shape moved.'
	If you wish to inherit from multiple objects, then mixins are a possibility.

	function MyClass() {
	  SuperClass.call(this);
	  OtherSuperClass.call(this);
	}

	MyClass.prototype = Object.create(SuperClass.prototype); // inherit
	mixin(MyClass.prototype, OtherSuperClass.prototype); // mixin

	MyClass.prototype.myMethod = function() {
	  // do a thing
	};

The mixin function would copy the functions from the superclass prototype to the subclass prototype, the mixin function needs to be supplied by the user. An example of a mixin like function would be jQuery.extend.

##Example: Using propertiesObject argument with Object.create

	var o;

	// create an object with null as prototype
	o = Object.create(null);


	o = {};
	// is equivalent to:
	o = Object.create(Object.prototype);


	// Example where we create an object with a couple of sample properties.
	// (Note that the second parameter maps keys to *property descriptors*.)
	o = Object.create(Object.prototype, {
	  // foo is a regular 'value property'
	  foo: { writable: true, configurable: true, value: 'hello' },
	  // bar is a getter-and-setter (accessor) property
	  bar: {
	    configurable: false,
	    get: function() { return 10; },
	    set: function(value) { console.log('Setting `o.bar` to', value); }
	  }
	});


	function Constructor() {}
	o = new Constructor();
	// is equivalent to:
	o = Object.create(Constructor.prototype);
	// Of course, if there is actual initialization code in the
	// Constructor function, the Object.create cannot reflect it


	// create a new object whose prototype is a new, empty object
	// and a adding single property 'p', with value 42
	o = Object.create({}, { p: { value: 42 } });

	// by default properties ARE NOT writable, enumerable or configurable:
	o.p = 24;
	o.p;
	// 42

	o.q = 12;
	for (var prop in o) {
	  console.log(prop);
	}
	// 'q'

	delete o.p;
	// false

	// to specify an ES3 property
	o2 = Object.create({}, {
	  p: {
	    value: 42,
	    writable: true,
	    enumerable: true,
	    configurable: true
	  }
	});

##Polyfill
This polyfill covers the main use case which is creating a new object for which the prototype has been chosen but doesn't take the second argument into account.

	if (typeof Object.create != 'function') {
	  Object.create = (function() {
	    var Object = function() {};
	    return function (prototype) {
	      if (arguments.length > 1) {
	        throw Error('Second argument not supported');
	      }
	      if (typeof prototype != 'object') {
	        throw TypeError('Argument must be an object');
	      }
	      Object.prototype = prototype;
	      var result = new Object();
	      Object.prototype = null;
	      return result;
	    };
	  })();
	}

@static

@param {Object} proto The object which should be the prototype of the newly-created object.

@param {Object} propertiesObject If specified and not undefined, an object whose enumerable own properties (that is, those properties defined upon itself and not enumerable properties along its prototype chain) specify property descriptors to be added to the newly-created object, with the corresponding property names. These properties correspond to the second argument of Object.defineProperties(). @optional

@throws Throws a TypeError exception if the proto parameter isn't null or an object.

*/








/*
@method defineProperties

#Summary
The Object.defineProperties() method defines new or modifies existing properties directly on an object, returning the object.

#Syntax
	Object.defineProperties(obj, props)

#Description
Object.defineProperties, in essence, defines all properties corresponding to the enumerable own properties of props on the object obj object.

#Example

	Object.defineProperties(obj, {
	  "property1": {
	    value: true,
	    writable: true
	  },
	  "property2": {
	    value: "Hello",
	    writable: false
	  }
	  // etc. etc.
	});


# Polyfill

Assuming a pristine execution environment with all names and properties referring to their initial values, Object.defineProperties is almost completely equivalent (note the comment in isCallable) to the following reimplementation in JavaScript:

	function defineProperties(obj, properties) {
	  function convertToDescriptor(desc) {
	    function hasProperty(obj, prop) {
	      return Object.prototype.hasOwnProperty.call(obj, prop);
	    }

	    function isCallable(v) {
	      // NB: modify as necessary if other values than functions are callable.
	      return typeof v === "function";
	    }

	    if (typeof desc !== "object" || desc === null)
	      throw new TypeError("bad desc");

	    var d = {};

	    if (hasProperty(desc, "enumerable"))
	      d.enumerable = !!obj.enumerable;
	    if (hasProperty(desc, "configurable"))
	      d.configurable = !!obj.configurable;
	    if (hasProperty(desc, "value"))
	      d.value = obj.value;
	    if (hasProperty(desc, "writable"))
	      d.writable = !!desc.writable;
	    if (hasProperty(desc, "get")) {
	      var g = desc.get;

	      if (!isCallable(g) && typeof g !== "undefined")
	        throw new TypeError("bad get");
	      d.get = g;
	    }
	    if (hasProperty(desc, "set")) {
	      var s = desc.set;
	      if (!isCallable(s) && typeof s !== "undefined")
	        throw new TypeError("bad set");
	      d.set = s;
	    }

	    if (("get" in d || "set" in d) && ("value" in d || "writable" in d))
	      throw new TypeError("identity-confused descriptor");

	    return d;
	  }

	  if (typeof obj !== "object" || obj === null)
	    throw new TypeError("bad obj");

	  properties = Object(properties);

	  var keys = Object.keys(properties);
	  var descs = [];

	  for (var i = 0; i < keys.length; i++)
	    descs.push([keys[i], convertToDescriptor(properties[keys[i]])]);

	  for (var i = 0; i < descs.length; i++)
	    Object.defineProperty(obj, descs[i][0], descs[i][1]);

	  return obj;
	} 


@static 

@param {Object} obj The object on which to define or modify properties.
@param {Object} props An object whose own enumerable properties constitute descriptors for the properties to be defined or modified.


*/











/*
@method defineProperty

#Summary
The Object.defineProperty() method defines a new property directly on an object, or modifies an existing property on an object, and returns the object.

#Syntax
Object.defineProperty(obj, prop, descriptor)

#Description
This method allows precise addition to or modification of a property on an object. Normal property addition through assignment creates properties which show up during property enumeration (for...in loop or Object.keys method), whose values may be changed, and which may be deleted. This method allows these extra details to be changed from their defaults.

Property descriptors present in objects come in two main flavors: data descriptors and accessor descriptors. A data descriptor is a property that has a value, which may or may not be writable. An accessor descriptor is a property described by a getter-setter pair of functions. A descriptor must be one of these two flavors; it cannot be both.

Both data and accessor descriptors are objects. They share the following optional keys:

###configurable
true if and only if the type of this property descriptor may be changed and if the property may be deleted from the corresponding object.
Defaults to false.

###enumerable
true if and only if this property shows up during enumeration of the properties on the corresponding object.
Defaults to false.
A data descriptor also has the following optional keys:

###value
The value associated with the property. Can be any valid JavaScript value (number, object, function, etc).
Defaults to undefined.
writable
true if and only if the value associated with the property may be changed with an assignment operator.
Defaults to false.
An accessor descriptor also has the following optional keys:

###get
A function which serves as a getter for the property, or undefined if there is no getter. The function return will be used as the value of property.
Defaults to undefined.

###set
A function which serves as a setter for the property, or undefined if there is no setter. The function will receive as only argument the new value being assigned to the property.
Defaults to undefined.
Bear in mind that these options are not necessarily own properties so, if inherited, will be considered too. In order to ensure these defaults are preserved you might freeze the Object.prototype upfront, specify all options explicitly, or point to null as __proto__ property.

	// using __proto__
	Object.defineProperty(obj, 'key', {
	  __proto__: null, // no inherited properties
	  value: 'static'  // not enumerable
	                   // not configurable
	                   // not writable
	                   // as defaults
	});

	// being explicit
	Object.defineProperty(obj, 'key', {
	  enumerable: false,
	  configurable: false,
	  writable: false,
	  value: 'static'
	});

	// recycling same object
	function withValue(value) {
	  var d = withValue.d || (
	    withValue.d = {
	      enumerable: false,
	      writable: false,
	      configurable: false,
	      value: null
	    }
	  );
	  d.value = value;
	  return d;
	}
	// ... and ...
	Object.defineProperty(obj, 'key', withValue('static'));

	// if freeze is available, prevents the code to add
	// value, get, set, enumerable, writable, configurable
	// to the Object prototype
	(Object.freeze || Object)(Object.prototype);

#Examples

If you want to see how to use the Object.defineProperty method with a binary-flags-like syntax, see additional examples.

##Example: Creating a property

When the property specified doesn't exist in the object, Object.defineProperty() creates a new property as described. Fields may be omitted from the descriptor, and default values for those fields are imputed. All of the Boolean-valued fields default to false. The value, get, and set fields default to undefined. A property which is defined without get/set/value/writable is called “generic” and is “typed” as a data descriptor.

	var o = {}; // Creates a new object

	// Example of an object property added with defineProperty with a data property descriptor
	Object.defineProperty(o, 'a', {
	  value: 37,
	  writable: true,
	  enumerable: true,
	  configurable: true
	});
	// 'a' property exists in the o object and its value is 37

	// Example of an object property added with defineProperty with an accessor property descriptor
	var bValue = 38;
	Object.defineProperty(o, 'b', {
	  get: function() { return bValue; },
	  set: function(newValue) { bValue = newValue; },
	  enumerable: true,
	  configurable: true
	});
	o.b; // 38
	// 'b' property exists in the o object and its value is 38
	// The value of o.b is now always identical to bValue, unless o.b is redefined

	// You cannot try to mix both:
	Object.defineProperty(o, 'conflict', {
	  value: 0x9f91102,
	  get: function() { return 0xdeadbeef; }
	});
	// throws a TypeError: value appears only in data descriptors, get appears only in accessor descriptors

##Example: Modifying a property

When the property already exists, Object.defineProperty() attempts to modify the property according to the values in the descriptor and the object's current configuration. If the old descriptor had its configurable attribute set to false (the property is said to be “non-configurable”), then no attribute besides writable can be changed. In that case, it is also not possible to switch back and forth between the data and accessor property types.

If a property is non-configurable, its writable attribute can only be changed to false.

A TypeError is thrown when attempts are made to change non-configurable property attributes (besides the writable attribute) unless the current and new values are the same.

##Writable attribute

When the writable property attribute is set to false, the property is said to be “non-writable”. It cannot be reassigned.

	var o = {}; // Creates a new object

	Object.defineProperty(o, 'a', {
	  value: 37,
	  writable: false
	});

	console.log(o.a); // logs 37
	o.a = 25; // No error thrown (it would throw in strict mode, even if the value had been the same)
	console.log(o.a); // logs 37. The assignment didn't work.

As seen in the example, trying to write into the non-writable property doesn't change it but doesn't throw an error either.

##Enumerable attribute

The enumerable property attribute defines whether the property shows up in a for...in loop and Object.keys() or not.

	var o = {};
	Object.defineProperty(o, 'a', { value: 1, enumerable: true });
	Object.defineProperty(o, 'b', { value: 2, enumerable: false });
	Object.defineProperty(o, 'c', { value: 3 }); // enumerable defaults to false
	o.d = 4; // enumerable defaults to true when creating a property by setting it

	for (var i in o) {
	  console.log(i);
	}
	// logs 'a' and 'd' (in undefined order)

	Object.keys(o); // ['a', 'd']

	o.propertyIsEnumerable('a'); // true
	o.propertyIsEnumerable('b'); // false
	o.propertyIsEnumerable('c'); // false
	Configurable attribute

	The configurable attribute controls at the same time whether the property can be deleted from the object and whether its attributes (other than writable) can be changed.

	var o = {};
	Object.defineProperty(o, 'a', {
	  get: function() { return 1; },
	  configurable: false
	});

	Object.defineProperty(o, 'a', { configurable: true }); // throws a TypeError
	Object.defineProperty(o, 'a', { enumerable: true }); // throws a TypeError
	Object.defineProperty(o, 'a', { set: function() {} }); // throws a TypeError (set was undefined previously)
	Object.defineProperty(o, 'a', { get: function() { return 1; } }); // throws a TypeError (even though the new get does exactly the same thing)
	Object.defineProperty(o, 'a', { value: 12 }); // throws a TypeError

	console.log(o.a); // logs 1
	delete o.a; // Nothing happens
	console.log(o.a); // logs 1


If the configurable attribute of o.a had been true, none of the errors would be thrown and the property would be deleted at the end.

##Example: Adding properties and default values

It's important to consider the way default values of attributes are applied. There is often a difference between simply using dot notation to assign a value and using Object.defineProperty(), as shown in the example below.

	var o = {};

	o.a = 1;
	// is equivalent to:
	Object.defineProperty(o, 'a', {
	  value: 1,
	  writable: true,
	  configurable: true,
	  enumerable: true
	});


	// On the other hand,
	Object.defineProperty(o, 'a', { value: 1 });
	// is equivalent to:
	Object.defineProperty(o, 'a', {
	  value: 1,
	  writable: false,
	  configurable: false,
	  enumerable: false
	});


##Example: Custom Setters and Getters

Example below shows how to implement a self-archiving object. When temperature property is set, the archive array gets a log entry.

	function Archiver() {
	  var temperature = null;
	  var archive = [];

	  Object.defineProperty(this, 'temperature', {
	    get: function() {
	      console.log('get!');
	      return temperature;
	    },
	    set: function(value) {
	      temperature = value;
	      archive.push({ val: temperature });
	    }
	  });

	  this.getArchive = function() { return archive; };
	}

	var arc = new Archiver();
	arc.temperature; // 'get!'
	arc.temperature = 11;
	arc.temperature = 13;
	arc.getArchive(); // [{ val: 11 }, { val: 13 }]	


@static
@param {Object} obj The object on which to define the property.
@param {String} prop The name of the property to be defined or modified.
@param {Object} descriptor The descriptor for the property being defined or modified.

*/










/*
@method freeze

#Summary
The Object.freeze() method freezes an object: that is, prevents new properties from being added to it; prevents existing properties from being removed; and prevents existing properties, or their enumerability, configurability, or writability, from being changed. In essence the object is made effectively immutable. The method returns the object being frozen.

#Syntax
Object.freeze(obj)

#Description
Nothing can be added to or removed from the properties set of a frozen object. Any attempt to do so will fail, either silently or by throwing a TypeError exception (most commonly, but not exclusively, when in strict mode).

Values cannot be changed for data properties. Accessor properties (getters and setters) work the same (and still give the illusion that you are changing the value). Note that values that are objects can still be modified, unless they are also frozen.

#Examples
	var obj = {
	  prop: function() {},
	  foo: 'bar'
	};

	// New properties may be added, existing properties may be changed or removed
	obj.foo = 'baz';
	obj.lumpy = 'woof';
	delete obj.prop;

	var o = Object.freeze(obj);

	assert(Object.isFrozen(obj) === true);

	// Now any changes will fail
	obj.foo = 'quux'; // silently does nothing
	obj.quaxxor = 'the friendly duck'; // silently doesn't add the property

	// ...and in strict mode such attempts will throw TypeErrors
	function fail(){
	  'use strict';
	  obj.foo = 'sparky'; // throws a TypeError
	  delete obj.quaxxor; // throws a TypeError
	  obj.sparky = 'arf'; // throws a TypeError
	}

	fail();

	// Attempted changes through Object.defineProperty will also throw
	Object.defineProperty(obj, 'ohai', { value: 17 }); // throws a TypeError
	Object.defineProperty(obj, 'foo', { value: 'eit' }); // throws a TypeError
	The following example shows that object values in a frozen object can be mutated (freeze is shallow).

	obj = {
	  internal: {}
	};

	Object.freeze(obj);
	obj.internal.a = 'aValue';

	obj.internal.a // 'aValue'

	// To make obj fully immutable, freeze each object in obj.
	// To do so, we use this function.

	function deepFreeze(o) {
	  var prop, propKey;
	  Object.freeze(o); // First freeze the object.
	  for (propKey in o) {
	    prop = o[propKey];
	    if (!o.hasOwnProperty(propKey) || !(typeof prop === 'object') || Object.isFrozen(prop)) {
	      // If the object is on the prototype, not an object, or is already frozen,
	      // skip it. Note that this might leave an unfrozen reference somewhere in the
	      // object if there is an already frozen object containing an unfrozen object.
	      continue;
	    }

	    deepFreeze(prop); // Recursively call deepFreeze.
	  }
	}

	obj2 = {
	  internal: {}
	};

	deepFreeze(obj2);
	obj2.internal.a = 'anotherValue';
	obj2.internal.a; // undefined


@static

@param obj The object to freeze.

*/










/*
@method getOwnPropertyDescriptor

#Summary
The Object.getOwnPropertyDescriptor() method returns a property descriptor for an own property (that is, one directly present on an object, not present by dint of being along an object's prototype chain) of a given object.

#Syntax
	Object.getOwnPropertyDescriptor(obj, prop)

#Description
This method permits examination of the precise description of a property. A property in JavaScript consists of a string-valued name and a property descriptor. Further information about property descriptor types and their attributes can be found in Object.defineProperty().

A property descriptor is a record with some of the following attributes:

###value
The value associated with the property (data descriptors only).
###writable
true if and only if the value associated with the property may be changed (data descriptors only).
###get
A function which serves as a getter for the property, or undefined if there is no getter (accessor descriptors only).
###set
A function which serves as a setter for the property, or undefined if there is no setter (accessor descriptors only).
###configurable
true if and only if the type of this property descriptor may be changed and if the property may be deleted from the corresponding object.
###enumerable
true if and only if this property shows up during enumeration of the properties on the corresponding object.

#Examples

	var o, d;

	o = { get foo() { return 17; } };
	d = Object.getOwnPropertyDescriptor(o, 'foo');
	// d is { configurable: true, enumerable: true, get: , set: undefined }

	o = { bar: 42 };
	d = Object.getOwnPropertyDescriptor(o, 'bar');
	// d is { configurable: true, enumerable: true, value: 42, writable: true }

	o = {};
	Object.defineProperty(o, 'baz', { value: 8675309, writable: false, enumerable: false });
	d = Object.getOwnPropertyDescriptor(o, 'baz');
	// d is { value: 8675309, writable: false, enumerable: false, configurable: false }


@static 
@param {Object}obj The object in which to look for the property.
@param {String}prop The name of the property whose description is to be retrieved.
@returns A property descriptor of the given property if it exists on the object, undefined otherwise.
*/










/*
@method getOwnPropertyNames

#Summary
The Object.getOwnPropertyNames() method returns an array of all properties (enumerable or not) found directly upon a given object.

#Syntax
Object.getOwnPropertyNames(obj)

#Description
Object.getOwnPropertyNames returns an array whose elements are strings corresponding to the enumerable and non-enumerable properties found directly upon obj. The ordering of the enumerable properties in the array is consistent with the ordering exposed by a for...in loop (or by Object.keys) over the properties of the object. The ordering of the non-enumerable properties in the array, and among the enumerable properties, is not defined.

#Examples
##Example: Using getOwnPropertyNames

	var arr = ['a', 'b', 'c'];
	print(Object.getOwnPropertyNames(arr).sort()); // prints '0,1,2,length'

	// Array-like object
	var obj = { 0: 'a', 1: 'b', 2: 'c' };
	print(Object.getOwnPropertyNames(obj).sort()); // prints '0,1,2'

	// Printing property names and values using Array.forEach
	Object.getOwnPropertyNames(obj).forEach(function(val, idx, array) {
	  print(val + ' -> ' + obj[val]);
	});
	// prints
	// 0 -> a
	// 1 -> b
	// 2 -> c

	// non-enumerable property
	var my_obj = Object.create({}, { getFoo: { value: function() { return this.foo; }, enumerable: false } });
	my_obj.foo = 1;

	print(Object.getOwnPropertyNames(my_obj).sort()); // prints 'foo,getFoo'

If you want only the enumerable properties, see Object.keys() or use a for...in loop (although note that this will return enumerable properties not found directly upon that object but also along the prototype chain for the object unless the latter is filtered with hasOwnProperty()).

Items on the prototype chain are not listed:

	function ParentClass() {}
	ParentClass.prototype.inheritedMethod = function() {};

	function ChildClass() {
	  this.prop = 5;
	  this.method = function() {};
	}
	ChildClass.prototype = new ParentClass;
	ChildClass.prototype.prototypeMethod = function() {};

	alert(
	  Object.getOwnPropertyNames(
	    new ChildClass() // ['prop', 'method']
	  )
	);

##Example: Get Non-Enumerable Only

This uses the Array.prototype.filter() function to remove the enumerable keys (obtained with Object.keys()) from a list of all keys (obtained with Object.getOwnPropertyNames) leaving only the non-enumerable keys.

	var target = myObject;
	var enum_and_nonenum = Object.getOwnPropertyNames(target);
	var enum_only = Object.keys(target);
	var nonenum_only = enum_and_nonenum.filter(function(key) {
	  var indexInEnum = enum_only.indexOf(key);
	  if (indexInEnum == -1) {
	    // not found in enum_only keys mean the key is non-enumerable,
	    // so return true so we keep this in the filter
	    return true;
	  } else {
	    return false;
	  }
	});

	console.log(nonenum_only);

@static
@param {Object} obj The object whose enumerable and non-enumerable own properties are to be returned.

*/










/*
@method isExtensible
#Summary
The Object.isExtensible() method determines if an object is extensible (whether it can have new properties added to it).

#Syntax
	Object.isExtensible(obj)

#Description
Objects are extensible by default: they can have new properties added to them, and (in engines that support __proto__  their __proto__ property) can be modified. An object can be marked as non-extensible using Object.preventExtensions(), Object.seal(), or Object.freeze().

#Examples
	// New objects are extensible.
	var empty = {};
	assert(Object.isExtensible(empty) === true);

	// ...but that can be changed.
	Object.preventExtensions(empty);
	assert(Object.isExtensible(empty) === false);

	// Sealed objects are by definition non-extensible.
	var sealed = Object.seal({});
	assert(Object.isExtensible(sealed) === false);

	// Frozen objects are also by definition non-extensible.
	var frozen = Object.freeze({});
	assert(Object.isExtensible(frozen) === false);
	Notes
	In ES5, if the argument to this method is not an object (a primitive), then it will cause a TypeError. In ES6, a non-object argument will be treated as if it was a non-extensible ordinary object, simply return false.

	> Object.isExtensible(1)
	TypeError: 1 is not an object // ES5 code

	> Object.isExtensible(1)
	false                

@static 

@param {Object} obj The object which should be checked.
@return {boolean}
*/




/*
@method isFrozen

#Summary
The Object.isFrozen() determines if an object is frozen.

#Syntax
	Object.isFrozen(obj)

#Description
An object is frozen if and only if it is not extensible, all its properties are non-configurable, and all its data properties (that is, properties which are not accessor properties with getter or setter components) are non-writable.

#Examples
	// A new object is extensible, so it is not frozen.
	assert(Object.isFrozen({}) === false);

	// An empty object which is not extensible is vacuously frozen.
	var vacuouslyFrozen = Object.preventExtensions({});
	assert(Object.isFrozen(vacuouslyFrozen) === true);

	// A new object with one property is also extensible, ergo not frozen.
	var oneProp = { p: 42 };
	assert(Object.isFrozen(oneProp) === false);

	// Preventing extensions to the object still doesn't make it frozen,
	// because the property is still configurable (and writable).
	Object.preventExtensions(oneProp);
	assert(Object.isFrozen(oneProp) === false);

	// ...but then deleting that property makes the object vacuously frozen.
	delete oneProp.p;
	assert(Object.isFrozen(oneProp) === true);

	// A non-extensible object with a non-writable but still configurable property is not frozen.
	var nonWritable = { e: 'plep' };
	Object.preventExtensions(nonWritable);
	Object.defineProperty(nonWritable, 'e', { writable: false }); // make non-writable
	assert(Object.isFrozen(nonWritable) === false);

	// Changing that property to non-configurable then makes the object frozen.
	Object.defineProperty(nonWritable, 'e', { configurable: false }); // make non-configurable
	assert(Object.isFrozen(nonWritable) === true);

	// A non-extensible object with a non-configurable but still writable property also isn't frozen.
	var nonConfigurable = { release: 'the kraken!' };
	Object.preventExtensions(nonConfigurable);
	Object.defineProperty(nonConfigurable, 'release', { configurable: false });
	assert(Object.isFrozen(nonConfigurable) === false);

	// Changing that property to non-writable then makes the object frozen.
	Object.defineProperty(nonConfigurable, 'release', { writable: false });
	assert(Object.isFrozen(nonConfigurable) === true);

	// A non-extensible object with a configurable accessor property isn't frozen.
	var accessor = { get food() { return 'yum'; } };
	Object.preventExtensions(accessor);
	assert(Object.isFrozen(accessor) === false);

	// ...but make that property non-configurable and it becomes frozen.
	Object.defineProperty(accessor, 'food', { configurable: false });
	assert(Object.isFrozen(accessor) === true);

	// But the easiest way for an object to be frozen is if Object.freeze has been called on it.
	var frozen = { 1: 81 };
	assert(Object.isFrozen(frozen) === false);
	Object.freeze(frozen);
	assert(Object.isFrozen(frozen) === true);

	// By definition, a frozen object is non-extensible.
	assert(Object.isExtensible(frozen) === false);

	// Also by definition, a frozen object is sealed.
	assert(Object.isSealed(frozen) === true);

#Notes
In ES5, if the argument to this method is not an object (a primitive), then it will cause a TypeError. In ES6, a non-object argument will be treated as if it was a frozen ordinary object, simply return true.

	> Object.isFrozen(1)
	TypeError: 1 is not an object // ES5 code

	> Object.isFrozen(1)
	true                          // ES6 code


@static
@param {Object}obj The object which should be checked.
@returns boolean
*/





/*
@method isSealed

#Summary
The Object.isSealed() method determines if an object is sealed.

#Syntax
	Object.isSealed(obj)
#Description
Returns true if the object is sealed, otherwise false. An object is sealed if it is not extensible and if all its properties are non-configurable and therefore not removable (but not necessarily non-writable).

#Examples
	// Objects aren't sealed by default.
	var empty = {};
	assert(Object.isSealed(empty) === false);

	// If you make an empty object non-extensible, it is vacuously sealed.
	Object.preventExtensions(empty);
	assert(Object.isSealed(empty) === true);

	// The same is not true of a non-empty object, unless its properties are all non-configurable.
	var hasProp = { fee: 'fie foe fum' };
	Object.preventExtensions(hasProp);
	assert(Object.isSealed(hasProp) === false);

	// But make them all non-configurable and the object becomes sealed.
	Object.defineProperty(hasProp, 'fee', { configurable: false });
	assert(Object.isSealed(hasProp) === true);

	// The easiest way to seal an object, of course, is Object.seal.
	var sealed = {};
	Object.seal(sealed);
	assert(Object.isSealed(sealed) === true);

	// A sealed object is, by definition, non-extensible.
	assert(Object.isExtensible(sealed) === false);

	// A sealed object might be frozen, but it doesn't have to be.
	assert(Object.isFrozen(sealed) === true); // all properties also non-writable

	var s2 = Object.seal({ p: 3 });
	assert(Object.isFrozen(s2) === false); // 'p' is still writable

	var s3 = Object.seal({ get p() { return 0; } });
	assert(Object.isFrozen(s3) === true); // only configurability matters for accessor properties

#Notes
	In ES5, if the argument to this method is not an object (a primitive), then it will cause a TypeError. In ES6, a non-object argument will be treated as if it was a sealed ordinary object, simply return true.

	> Object.isSealed(1)
	TypeError: 1 is not an object // ES5 code

	> Object.isSealed(1)
	true                          // ES6 code


@static
@param {Object} obj The object which should be checked.
@returns {boolean}
*/







/*
@method keys
#Summary
The Object.keys() method returns an array of a given object's own enumerable properties, in the same order as that provided by a for...in loop (the difference being that a for-in loop enumerates properties in the prototype chain as well).

#Syntax
	Object.keys(obj)

#Examples
	var arr = ['a', 'b', 'c'];
	console.log(Object.keys(arr)); // console: ['0', '1', '2']

	// array like object
	var obj = { 0: 'a', 1: 'b', 2: 'c' };
	console.log(Object.keys(obj)); // console: ['0', '1', '2']

	// array like object with random key ordering
	var an_obj = { 100: 'a', 2: 'b', 7: 'c' };
	console.log(Object.keys(an_obj)); // console: ['2', '7', '100']

	// getFoo is property which isn't enumerable
	var my_obj = Object.create({}, { getFoo: { value: function() { return this.foo; } } });
	my_obj.foo = 1;

	console.log(Object.keys(my_obj)); // console: ['foo']
If you want all properties, even not enumerables, see Object.getOwnPropertyNames().

#Polyfill
To add compatible Object.keys support in older environments that do not natively support it, copy the following snippet:

	// From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
	if (!Object.keys) {
	  Object.keys = (function() {
	    'use strict';
	    var hasOwnProperty = Object.prototype.hasOwnProperty,
	        hasDontEnumBug = !({ toString: null }).propertyIsEnumerable('toString'),
	        dontEnums = [
	          'toString',
	          'toLocaleString',
	          'valueOf',
	          'hasOwnProperty',
	          'isPrototypeOf',
	          'propertyIsEnumerable',
	          'constructor'
	        ],
	        dontEnumsLength = dontEnums.length;

	    return function(obj) {
	      if (typeof obj !== 'object' && (typeof obj !== 'function' || obj === null)) {
	        throw new TypeError('Object.keys called on non-object');
	      }

	      var result = [], prop, i;

	      for (prop in obj) {
	        if (hasOwnProperty.call(obj, prop)) {
	          result.push(prop);
	        }
	      }

	      if (hasDontEnumBug) {
	        for (i = 0; i < dontEnumsLength; i++) {
	          if (hasOwnProperty.call(obj, dontEnums[i])) {
	            result.push(dontEnums[i]);
	          }
	        }
	      }
	      return result;
	    };
	  }());
	}
Please note that the above code includes non-enumerable keys in IE7 (and maybe IE8), when passing in an object from a different window.

For a simple browser polyfill, see Javascript - Object.keys Browser Compatibility.

@static
@param {Object} obj The object whose enumerable own properties are to be returned.
@returns {Array<String>} method returns an array of a given object's own enumerable properties, in the same order as that provided by a for...in loop (the difference being that a for-in loop enumerates properties in the prototype chain as well).

*/








/*
@method preventExtensions

#Summary
The Object.preventExtensions() method prevents new properties from ever being added to an object (i.e. prevents future extensions to the object).

#Syntax
	Object.preventExtensions(obj)

#Description
An object is extensible if new properties can be added to it. Object.preventExtensions() marks an object as no longer extensible, so that it will never have properties beyond the ones it had at the time it was marked as non-extensible. Note that the properties of a non-extensible object, in general, may still be deleted. Attempting to add new properties to a non-extensible object will fail, either silently or by throwing a TypeError (most commonly, but not exclusively, when in strict mode).

Object.preventExtensions() only prevents addition of own properties. Properties can still be added to the object prototype. However, calling Object.preventExtensions() on an object will also prevent extensions on its __proto__  property.

If there is a way to turn an extensible object to a non-extensible one, there is no way to do the opposite in ECMAScript 5.

#Examples
	// Object.preventExtensions returns the object being made non-extensible.
	var obj = {};
	var obj2 = Object.preventExtensions(obj);
	assert(obj === obj2);

	// Objects are extensible by default.
	var empty = {};
	assert(Object.isExtensible(empty) === true);

	// ...but that can be changed.
	Object.preventExtensions(empty);
	assert(Object.isExtensible(empty) === false);

	// Object.defineProperty throws when adding a new property to a non-extensible object.
	var nonExtensible = { removable: true };
	Object.preventExtensions(nonExtensible);
	Object.defineProperty(nonExtensible, 'new', { value: 8675309 }); // throws a TypeError

	// In strict mode, attempting to add new properties to a non-extensible object throws a TypeError.
	function fail() {
	  'use strict';
	  nonExtensible.newProperty = 'FAIL'; // throws a TypeError
	}
	fail();

	// EXTENSION (only works in engines supporting __proto__
	// (which is deprecated. Use Object.getPrototypeOf instead)):
	// A non-extensible object's prototype is immutable.
	var fixed = Object.preventExtensions({});
	fixed.__proto__ = { oh: 'hai' }; // throws a TypeError

#Notes
In ES5, if the argument to this method is not an object (a primitive), then it will cause a TypeError. In ES6, a non-object argument will be treated as if it was a non-extensible ordinary object, simply return it.

	> Object.preventExtensions(1)
	TypeError: 1 is not an object // ES5 code

	> Object.preventExtensions(1)
	1                             // ES6 code

@static
@param {Object}obj The object which should be made non-extensible.

*/







/*
@method hasOwnProperty

#Summary
The hasOwnProperty() method returns a boolean indicating whether the object has the specified property.

#Syntax
	obj.hasOwnProperty(prop)

#Description
Every object descended from Object inherits the hasOwnProperty method. This method can be used to determine whether an object has the specified property as a direct property of that object; unlike the in operator, this method does not check down the object's prototype chain.

#Examples
##Example: Using hasOwnProperty to test for a property's existence

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
	Example: Direct versus inherited properties

	The following example differentiates between direct properties and properties inherited through the prototype chain:

	o = new Object();
	o.prop = 'exists';
	o.hasOwnProperty('prop');             // returns true
	o.hasOwnProperty('toString');         // returns false
	o.hasOwnProperty('hasOwnProperty');   // returns false
##Example: Iterating over the properties of an object

The following example shows how to iterate over the properties of an object without executing on inherit properties. Note that the for...in loop is already only iterating enumerable items, so one should not assume based on the lack of non-enumerable properties shown in the loop that hasOwnProperty itself is confined strictly to enumerable items (as with Object.getOwnPropertyNames()).

	var buz = {
	  fog: 'stack'
	};

	for (var name in buz) {
	  if (buz.hasOwnProperty(name)) {
	    alert('this is fog (' + name + ') for sure. Value: ' + buz[name]);
	  }
	  else {
	    alert(name); // toString or something else
	  }
	}
##Example: hasOwnProperty as a property

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

	// It's also possible to use the hasOwnProperty property from the Object prototype for this purpose
	Object.prototype.hasOwnProperty.call(foo, 'bar'); // true
Note that in the last case there are no newly created objects.

@static 
@param {String}prop The name of the property to test.

*/







/*
@method  isPrototypeOf


#Summary
The isPrototypeOf() method tests for an object in another object's prototype chain.

Note: isPrototypeOf differs from the instanceof operator. In the expression "object instanceof AFunction", the object prototype chain is checked against AFunction.prototype, not against AFunction itself.
#Syntax
	prototypeObj.isPrototypeOf(obj)
#Description
The isPrototypeOf method allows you to check whether or not an object exists within another object's prototype chain.

For example, consider the following prototype chain:

	function Fee() {
	  // ...
	}

	function Fi() {
	  // ...
	}
	Fi.prototype = new Fee();

	function Fo() {
	  // ...
	}
	Fo.prototype = new Fi();

	function Fum() {
	  // ...
	}
	Fum.prototype = new Fo();
Later on down the road, if you instantiate Fum and need to check if Fi's prototype exists within the Fum prototype chain, you could do this:

	var fum = new Fum();
	// ...

	if (Fi.prototype.isPrototypeOf(fum)) {
	  // do something safe
	}
This, along with the instanceof operator particularly comes in handy if you have code that can only function when dealing with objects descended from a specific prototype chain, e.g., to guarantee that certain methods or properties will be present on that object.


@static 
@param {Object} prototypeObj An object to be tested against each link in the prototype chain of the object argument.
@param {Object}object The object whose prototype chain will be searched.
@returns {boolean}
*/






/*

@method propertyIsEnumerable

#Summary
The propertyIsEnumerable() method returns a Boolean indicating whether the specified property is enumerable.
#Syntax
	obj.propertyIsEnumerable(prop)

#Description
Every object has a propertyIsEnumerable method. This method can determine whether the specified property in an object can be enumerated by a for...in loop, with the exception of properties inherited through the prototype chain. If the object does not have the specified property, this method returns false.

#Examples
##Example: A basic use of propertyIsEnumerable

The following example shows the use of propertyIsEnumerable on objects and arrays:

	var o = {};
	var a = [];
	o.prop = 'is enumerable';
	a[0] = 'is enumerable';

	o.propertyIsEnumerable('prop');   // returns true
	a.propertyIsEnumerable(0);        // returns true
##Example: User-defined versus built-in objects

The following example demonstrates the enumerability of user-defined versus built-in properties:

	var a = ['is enumerable'];

	a.propertyIsEnumerable(0);          // returns true
	a.propertyIsEnumerable('length');   // returns false

	Math.propertyIsEnumerable('random');   // returns false
	this.propertyIsEnumerable('Math');     // returns false
##Example: Direct versus inherited properties

	var a = [];
	a.propertyIsEnumerable('constructor');         // returns false

	function firstConstructor() {
	  this.property = 'is not enumerable';
	}

	firstConstructor.prototype.firstMethod = function() {};

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


@param {String}prop The name of the property to test.
@return {boolean}

*/



/*
@method toLocaleString
#Summary
The toLocaleString() method returns a string representing the object. This method is meant to be overriden by derived objects for locale-specific purposes.

#Syntax
	obj.toLocaleString();
#Description
Object's toLocaleString returns the result of calling toString().

This function is provided to give objects a generic toLocaleString method, even though not all may use it. See the list below.

Objects overriding toLocaleString

	Array: Array.prototype.toLocaleString()
	Number: Number.prototype.toLocaleString()
	Date: Date.prototype.toLocaleString()
*/



/*
@method toString

#Summary
The toString() method returns a string representing object.

#Syntax
	obj.toString()
#Description
Every object has a toString() method that is automatically called when the object is to be represented as a text value or when an object is referred to in a manner in which a string is expected. By default, the toString() method is inherited by every object descended from Object. If this method is not overridden in a custom object, toString() returns "[object type]", where type is the object type. The following code illustrates this:

	var o = new Object();
	o.toString();           // returns [object Object]
Note: Starting in JavaScript 1.8.5 toString() called on null returns [object Null], and undefined returns [object Undefined], as defined in the 5th Edition of ECMAScript and a subsequent Errata. See Using toString to detect object type.
#Examples
##Example: Overriding the default toString method

You can create a function to be called in place of the default toString() method. The toString() method takes no arguments and should return a string. The toString() method you create can be any value you want, but it will be most useful if it carries information about the object.

The following code defines the Dog object type and creates theDog, an object of type Dog:

	function Dog(name, breed, color, sex) {
	  this.name = name;
	  this.breed = breed;
	  this.color = color;
	  this.sex = sex;
	}

	theDog = new Dog('Gabby', 'Lab', 'chocolate', 'female');
If you call the toString() method on this custom object, it returns the default value inherited from Object:

	theDog.toString(); // returns [object Object]
The following code creates and assigns dogToString() to override the default toString() method. This function generates a string containing the name, breed, color, and sex of the object, in the form "property = value;".

	Dog.prototype.toString = function dogToString() {
	  var ret = 'Dog ' + this.name + ' is a ' + this.sex + ' ' + this.color + ' ' + this.breed;
	  return ret;
	}

With the preceding code in place, any time theDog is used in a string context, JavaScript automatically calls the dogToString() function, which returns the following string:

	Dog Gabby is a female chocolate Lab

##Example: Using toString() to detect object class

toString() can be used with every object and allows you to get its class. To use the Object.prototype.toString() with every object, you need to call Function.prototype.call() or Function.prototype.apply() on it, passing the object you want to inspect as the first parameter called thisArg.

	var toString = Object.prototype.toString;

	toString.call(new Date);    // [object Date]
	toString.call(new String);  // [object String]
	toString.call(Math);        // [object Math]

	// Since JavaScript 1.8.5
	toString.call(undefined);   // [object Undefined]
	toString.call(null);        // [object Null]

@return{String}returns a string representing object.
*/





/*
@method valueOf
#Summary
The valueOf() method returns the primitive value of the specified object.

#Syntax
	object.valueOf()
#Description
JavaScript calls the valueOf method to convert an object to a primitive value. You rarely need to invoke the valueOf method yourself; JavaScript automatically invokes it when encountering an object where a primitive value is expected.

By default, the valueOf method is inherited by every object descended from Object. Every built-in core object overrides this method to return an appropriate value. If an object has no primitive value, valueOf returns the object itself, which is displayed as:

	[object Object]
You can use valueOf within your own code to convert a built-in object into a primitive value. When you create a custom object, you can override Object.prototype.valueOf() to call a custom method instead of the default Object method.

##Overriding valueOf for custom objects

You can create a function to be called in place of the default valueOf method. Your function must take no arguments.

Suppose you have an object type myNumberType and you want to create a valueOf method for it. The following code assigns a user-defined function to the object's valueOf method:

	myNumberType.prototype.valueOf = function() { return customPrimitiveValue; };
With the preceding code in place, any time an object of type myNumberType is used in a context where it is to be represented as a primitive value, JavaScript automatically calls the function defined in the preceding code.

An object's valueOf method is usually invoked by JavaScript, but you can invoke it yourself as follows:

	myNumber.valueOf()
Note: Objects in string contexts convert via the toString() method, which is different from String objects converting to string primitives using valueOf. All objects have a string conversion, if only "[object type]". But many objects do not convert to number, boolean, or function.
#Examples
##Example: Using valueOf

	o = new Object();
	myVar = o.valueOf();      // [object Object]
*/




/*
@method seal
#Summary
The Object.seal() method seals an object, preventing new properties from being added to it and marking all existing properties as non-configurable. Values of present properties can still be changed as long as they are writable.

#Syntax
	Object.seal(obj)

#Description
By default, objects are extensible (new properties can be added to them). Sealing an object prevents new properties from being added and marks all existing properties as non-configurable. This has the effect of making the set of properties on the object fixed and immutable. Making all properties non-configurable also prevents them from being converted from data properties to accessor properties and vice versa, but it does not prevent the values of data properties from being changed. Attempting to delete or add properties to a sealed object, or to convert a data property to accessor or vice versa, will fail, either silently or by throwing a TypeError (most commonly, although not exclusively, when in strict mode code).

The prototype chain remains untouched. However, the __proto__  property is sealed as well.

#Examples
	var obj = {
	  prop: function() {},
	  foo: 'bar'
	};

	// New properties may be added, existing properties may be changed or removed.
	obj.foo = 'baz';
	obj.lumpy = 'woof';
	delete obj.prop;

	var o = Object.seal(obj);

	assert(o === obj);
	assert(Object.isSealed(obj) === true);

	// Changing property values on a sealed object still works.
	obj.foo = 'quux';

	// But you can't convert data properties to accessors, or vice versa.
	Object.defineProperty(obj, 'foo', { get: function() { return 'g'; } }); // throws a TypeError

	// Now any changes, other than to property values, will fail.
	obj.quaxxor = 'the friendly duck'; // silently doesn't add the property
	delete obj.foo; // silently doesn't delete the property

	// ...and in strict mode such attempts will throw TypeErrors.
	function fail() {
	  'use strict';
	  delete obj.foo; // throws a TypeError
	  obj.sparky = 'arf'; // throws a TypeError
	}
	fail();

	// Attempted additions through Object.defineProperty will also throw.
	Object.defineProperty(obj, 'ohai', { value: 17 }); // throws a TypeError
	Object.defineProperty(obj, 'foo', { value: 'eit' }); // changes existing property value

@static 

@param  obj The object which should be sealed.
*/





/*
@class Any
This is an artificial type that means 'any value is valid here'
*/