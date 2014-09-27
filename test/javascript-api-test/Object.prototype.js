/*

@module javascript 



@class ObjectPrototype

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

