/*
@module javascript

@class Function

#Summary
The Function.prototype property represents the Function prototype object.

#Description
Function objects inherit from Function.prototype.  Function.prototype cannot be modified.
*/


/*
@property {Number} length

#Summary
The length property specifies the number of arguments expected by the function.

#Description
length is a property of a function object, and indicates how many arguments the function expects, i.e. the number of formal parameters. This number does not include the rest parameter. By contrast, arguments.length is local to a function and provides the number of arguments actually passed to the function.

Data property of the Function constructor

The Function constructor is itself a Function object. It's length data property has a value of 1. The property attributes are: Writable: false, Enumerable: false, Configurable: true.

Property of the Function prototype object

The length property of the Function prototype object has a value of 0.

#Examples
	console.log ( Function.length ); //1

	console.log( (function ()        {}).length ); //0
	console.log( (function (a)       {}).length ); //1
	console.log( (function (a, b)    {}).length ); //2 etc. 
	console.log( (function (...args) {}).length ); //0, rest parameter is no

*/


/*
@property {FunctionPrototype} prototype
#Summary
The Function.prototype property represents the Function prototype object.

#Description
Function objects inherit from Function.prototype.  Function.prototype cannot be modified.
*/



/*
@method apply

The apply() method calls a function with a given this value and arguments provided as an array (or an array-like object).

Note: While the syntax of this function is almost identical to that of call(), the fundamental difference is that call() accepts an argument list, while apply() accepts a single array of arguments.
#Syntax
	fun.apply(thisArg, [argsArray])
#Description
You can assign a different this object when calling an existing function. this refers to the current object, the calling object. With apply, you can write a method once and then inherit it in another object, without having to rewrite the method for the new object.

apply is very similar to call(), except for the type of arguments it supports. You can use an arguments array instead of a named set of parameters. With apply, you can use an array literal, for example, fun.apply(this, ['eat', 'bananas']), or an Array object, for example, fun.apply(this, new Array('eat', 'bananas')).

You can also use arguments for the argsArray parameter. arguments is a local variable of a function. It can be used for all unspecified arguments of the called object. Thus, you do not have to know the arguments of the called object when you use the apply method. You can use arguments to pass all the arguments to the called object. The called object is then responsible for handling the arguments.

Since ECMAScript 5th Edition you can also use any kind of object which is array-like, so in practice this means it's going to have a property length and integer properties in the range [0...length). As an example you can now use a NodeList or a own custom object like {'length': 2, '0': 'eat', '1': 'bananas'}.

Note: Most browsers, including Chrome 14 and Internet Explorer 9, still do not accept array-like objects and will throw an exception.
#Examples
Using apply to chain constructors

You can use apply to chain constructors for an object, similar to Java. In the following example we will create a global Function method called construct, which will make you able to use an array-like object with a constructor instead of an arguments list.

	Function.prototype.construct = function (aArgs) {
	    var fConstructor = this, fNewConstr = function () { fConstructor.apply(this, aArgs); };
	    fNewConstr.prototype = fConstructor.prototype;
	    return new fNewConstr();
	};

Example usage:

	function MyConstructor () {
	    for (var nProp = 0; nProp < arguments.length; nProp++) {
	        this["property" + nProp] = arguments[nProp];
	    }
	}

	var myArray = [4, "Hello world!", false];
	var myInstance = MyConstructor.construct(myArray);

	alert(myInstance.property1); // alerts "Hello world!"
	alert(myInstance instanceof MyConstructor); // alerts "true"
	alert(myInstance.constructor); // alerts "MyConstructor"

Note: This non-native Function.construct method will not work with some native constructors (like Date, for example). In these cases you have to use the Function.bind method (for example, imagine to have an array like the following, to be used with Date constructor: [2012, 11, 4]; in this case you have to write something like: new (Function.prototype.bind.apply(Date, [null].concat([2012, 11, 4])))() – anyhow this is not the best way to do things and probably should not be used in any production environment).
Using apply and built-in functions

Clever usage of apply allows you to use built-ins functions for some tasks that otherwise probably would have been written by looping over the array values. As an example here we are going to use Math.max/Math.min to find out the maximum/minimum value in an array.

	//min/max number in an array 
	var numbers = [5, 6, 2, 3, 7];

	//using Math.min/Math.max apply 
	var max = Math.max.apply(null, numbers); // This about equal to Math.max(numbers[0], ...) or Math.max(5, 6, ..) 
	var min = Math.min.apply(null, numbers);

	/ vs. simple loop based algorithm 
	max = -Infinity, min = +Infinity;

	for (var i = 0; i < numbers.length; i++) {
	  if (numbers[i] > max)
	    max = numbers[i];
	  if (numbers[i] < min) 
	    min = numbers[i];
	}

But beware: in using apply this way, you run the risk of exceeding the JavaScript engine's argument length limit. The consequences of applying a function with too many arguments (think more than tens of thousands of arguments) vary across engines (JavaScriptCore has hard-coded argument limit of 65536), because the limit (indeed even the nature of any excessively-large-stack behavior) is unspecified. Some engines will throw an exception. More perniciously, others will arbitrarily limit the number of arguments actually passed to the applied function. (To illustrate this latter case: if such an engine had a limit of four arguments [actual limits are of course significantly higher], it would be as if the arguments 5, 6, 2, 3 had been passed to apply in the examples above, rather than the full array.) If your value array might grow into the tens of thousands, use a hybrid strategy: apply your function to chunks of the array at a time:

	function minOfArray(arr) {
	  var min = Infinity;
	  var QUANTUM = 32768;

	  for (var i = 0, len = arr.length; i < len; i += QUANTUM) {
	    var submin = Math.min.apply(null, arr.slice(i, Math.min(i + QUANTUM, len)));
	    min = Math.min(submin, min);
	  }

	  return min;
	}

	var min = minOfArray([5, 6, 2, 3, 7]);
Using apply in "monkey-patching"

Apply can be the best way to monkey-patch a builtin function of Firefox, or JS libraries. Given someobject.foo function, you can modify the function in a somewhat hacky way, like so:

	var originalfoo = someobject.foo;
	someobject.foo = function() {
	  //Do stuff before calling function
	  console.log(arguments);
	  //Call the function as it would have been called normally:
	  originalfoo.apply(this,arguments);
	  //Run stuff after, here.
	}

This method is especially handy where you want to debug events, or interface with something that has no API like the various .on([event]... events, such as those usable on the Devtools Inspector).


@param {Object}thisArg The value of this provided for the call to fun. Note that this may not be the actual value seen by the method: if the method is a function in non-strict mode code, null and undefined will be replaced with the global object, and primitive values will be boxed.
@param {Array} argsArray An array-like object, specifying the arguments with which fun should be called, or null or undefined if no arguments should be provided to the function. Starting with ECMAScript 5 these arguments can be a generic array-like object instead of an array. See below for browser compatibility information.

@returns the result of evaluating this function with given context and parameters
*/







/*
@method bind

#Summary
The bind() method creates a new function that, when called, has its this keyword set to the provided value, with a given sequence of arguments preceding any provided when the new function is called.

#Syntax
	fun.bind(thisArg[, arg1[, arg2[, ...]]])

#Description
The bind() function creates a new function (a bound function) with the same function body (internal call property in ECMAScript 5 terms) as the function it is being called on (the bound function's target function) with the this value bound to the first argument of bind(), which cannot be overridden. bind() also accepts leading default arguments to provide to the target function when the bound function is called. A bound function may also be constructed using the new operator: doing so acts as though the target function had instead been constructed. The provided this value is ignored, while prepended arguments are provided to the emulated function.

#Examples
Creating a bound function

The simplest use of bind() is to make a function that, no matter how it is called, is called with a particular this value. A common mistake for new JavaScript programmers is to extract a method from an object, then to later call that function and expect it to use the original object as its this (e.g. by using that method in callback-based code). Without special care, however, the original object is usually lost. Creating a bound function from the function, using the original object, neatly solves this problem:

	this.x = 9; 
	var module = {
	  x: 81,
	  getX: function() { return this.x; }
	};

	module.getX(); // 81

	var getX = module.getX;
	getX(); // 9, because in this case, "this" refers to the global object

	// create a new function with 'this' bound to module
	var boundGetX = getX.bind(module);
	boundGetX(); // 81

##Partial Functions

The next simplest use of bind() is to make a function with pre-specified initial arguments. These arguments (if any) follow the provided this value and are then inserted at the start of the arguments passed to the target function, followed by the arguments passed to the bound function, whenever the bound function is called.

	function list() {
	  return Array.prototype.slice.call(arguments);
	}

	var list1 = list(1, 2, 3); // [1, 2, 3]

	//  Create a function with a preset leading argument
	var leadingThirtysevenList = list.bind(undefined, 37);

	var list2 = leadingThirtysevenList(); // [37]
	var list3 = leadingThirtysevenList(1, 2, 3); // [37, 1, 2, 3]

##With setTimeout

By default within window.setTimeout(), the this keyword will be set to the window (or global) object. When working with class methods that require this to refer to class instances, you may explicitly bind this to the callback function, in order to maintain the instance.

	function LateBloomer() {
	  this.petalCount = Math.ceil( Math.random() * 12 ) + 1;
	}

	// declare bloom after a delay of 1 second
	LateBloomer.prototype.bloom = function() {
	  window.setTimeout( this.declare.bind( this ), 1000 );
	};

	LateBloomer.prototype.declare = function() {
	  console.log('I am a beautiful flower with ' + 
	    this.petalCount + ' petals!');
	};

##Bound functions used as constructors

Warning: This section demonstrates JavaScript capabilities and documents some edge cases of the bind() method. The methods shown below are not the best way to do things and probably should not be used in any production environment.
Bound functions are automatically suitable for use with the new operator to construct new instances created by the target function. When a bound function is used to construct a value, the provided this is ignored. However, provided arguments are still prepended to the constructor call:

	function Point(x, y) {
	  this.x = x;
	  this.y = y;
	}

	Point.prototype.toString = function() { 
	  return this.x + "," + this.y; 
	};

	var p = new Point(1, 2);
	p.toString(); // "1,2"


	var emptyObj = {};
	var YAxisPoint = Point.bind(emptyObj, 0);
	// not supported in the polyfill below, works fine with native bind:
	var YAxisPoint = Point.bind(null,0 );

	var axisPoint = new YAxisPoint(5);
	axisPoint.toString(); //  "0,5"

	axisPoint instanceof Point; // true
	axisPoint instanceof YAxisPoint; // true
	new Point(17, 42) instanceof YAxisPoint; // false
Note that you need do nothing special to create a bound function for use with new. The corollary is that you need do nothing special to create a bound function to be called plainly, even if you would rather require the bound function to only be called using new.

	// Example can be run directly in your JavaScript console
	// ...continuing from above

	// Can still be called as a normal function 
	// (although usually this is undesired)
	YAxisPoint(13);

	emptyObj.x + "," + emptyObj.y;
	// >  "0,13"
If you wish to support use of a bound function only using new, or only by calling it, the target function must enforce that restriction.

##Creating shortcuts

bind() is also helpful in cases where you want to create a shortcut to a function which requires a specific this value.

Take Array.prototype.slice, for example, which you want to use for converting an array-like object to a real array. You could create a shortcut like this:

	var slice = Array.prototype.slice;

	// ...

	slice.call(arguments);
	With bind(), this can be simplified. In the following piece of code, slice is a bound function to the call() function of Function.prototype, with the this value set to the slice() function of Array.prototype. This means that additional call() calls can be eliminated:

	// same as "slice" in the previous example
	var unboundSlice = Array.prototype.slice;
	var slice = Function.prototype.call.bind(unboundSlice);

	// ...

	slice(arguments);
#Polyfill
The bind function is a recent addition to ECMA-262, 5th edition; as such it may not be present in all browsers. You can partially work around this by inserting the following code at the beginning of your scripts, allowing use of much of the functionality of bind() in implementations that do not natively support it.

	if (!Function.prototype.bind) {
	  Function.prototype.bind = function (oThis) {
	    if (typeof this !== "function") {
	      // closest thing possible to the ECMAScript 5
	      // internal IsCallable function
	      throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
	    }

	    var aArgs = Array.prototype.slice.call(arguments, 1), 
	        fToBind = this, 
	        fNOP = function () {},
	        fBound = function () {
	          return fToBind.apply(this instanceof fNOP && oThis
	                 ? this
	                 : oThis,
	                 aArgs.concat(Array.prototype.slice.call(arguments)));
	        };

	    fNOP.prototype = this.prototype;
	    fBound.prototype = new fNOP();

	    return fBound;
	  };
	}

Some of the many differences (there may well be others, as this list does not seriously attempt to be exhaustive) between this algorithm and the specified algorithm are:

The partial implementation relies Array.prototype.slice, Array.prototype.concat, Function.prototype.call and Function.prototype.apply, built-in methods to have their original values.
The partial implementation creates functions that do not have immutable "poison pill" caller and arguments properties that throw a TypeError upon get, set, or deletion. (This could be added if the implementation supports Object.defineProperty, or partially implemented [without throw-on-delete behavior] if the implementation supports the __defineGetter__ and __defineSetter__ extensions.)
The partial implementation creates functions that have a prototype property. (Proper bound functions have none.)
The partial implementation creates bound functions whose length property does not agree with that mandated by ECMA-262: it creates functions with length 0, while a full implementation, depending on the length of the target function and the number of pre-specified arguments, may return a non-zero length.
If you choose to use this partial implementation, you must not rely on those cases where behavior deviates from ECMA-262, 5th edition! With some care, however (and perhaps with additional modification to suit specific needs), this partial implementation may be a reasonable bridge to the time when bind() is widely implemented according to the specification.

@param thisArg The value to be passed as the this parameter to the target function when the bound function is called. The value is ignored if the bound function is constructed using the new operator.
@param args Arguments to prepend to arguments provided to the bound function when invoking the target function.

*/






/*
@method call

#Summary
The call() method calls a function with a given this value and arguments provided individually.

NOTE: While the syntax of this function is almost identical to that of apply(), the fundamental difference is that call() accepts an argument list, while apply() accepts a single array of arguments.
#Syntax
	fun.call(thisArg[, arg1[, arg2[, ...]]])

#Description
You can assign a different this object when calling an existing function. this refers to the current object, the calling object.

With call, you can write a method once and then inherit it in another object, without having to rewrite the method for the new object.

#Examples
##Using call to chain constructors for an object

You can use call to chain constructors for an object, similar to Java. In the following example, the constructor for the Product object is defined with two parameters, name and price. Two other functions Food and Toy invoke Product passing this and name and price. Product initializes the properties name and price, both specialized functions define the category.

	function Product(name, price) {
	  this.name = name;
	  this.price = price;

	  if (price < 0) {
	    throw RangeError('Cannot create product ' +
	                      this.name + ' with a negative price');
	  }

	  return this;
	}

	function Food(name, price) {
	  Product.call(this, name, price);
	  this.category = 'food';
	}

	Food.prototype = Object.create(Product.prototype);

	function Toy(name, price) {
	  Product.call(this, name, price);
	  this.category = 'toy';
	}

	Toy.prototype = Object.create(Product.prototype);

	var cheese = new Food('feta', 5);
	var fun = new Toy('robot', 40);
 
##Using call to invoke an anonymous function

In this purely constructed example, we create anonymous function and use call to invoke it on every object in an array. The main purpose of the anonymous function here is to add a print function to every object, which is able to print the right index of the object in the array. Passing the object as this value was not strictly necessary, but is done for explanatory purpose.

	var animals = [
	  {species: 'Lion', name: 'King'},
	  {species: 'Whale', name: 'Fail'}
	];

	for (var i = 0; i < animals.length; i++) {
	  (function (i) { 
	    this.print = function () { 
	      console.log('#' + i  + ' ' + this.species 
	                  + ': ' + this.name); 
	    } 
	    this.print();
	  }).call(animals[i], i);
	}


@param thisArg The value of this provided for the call to fun. Note that this may not be the actual value seen by the method: if the method is a function in non-strict mode code, null and undefined will be replaced with the global object, and primitive values will be boxed.
@param arg1,arg2,... Arguments for the object.

*/




/*
@method toString
#Summary
The toString() method returns a string representing the source code of the function.

#Syntax
	function.toString(indentation)
#Description
The Function object overrides the toString method inherited from Object; it does not inherit Object.prototype.toString. For Function objects, the toString method returns a string representation of the object in the form of a function declaration. That is, toString decompiles the function, and the string returned includes the function keyword, the argument list, curly braces, and the source of the function body.

JavaScript calls the toString method automatically when a Function is to be represented as a text value, e.g. when a function is concatenated with a string.

@return {String}
*/