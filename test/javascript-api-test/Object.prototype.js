/*

@module javascript 



@class ObjectPrototype

Adapted from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/prototype#Properties

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