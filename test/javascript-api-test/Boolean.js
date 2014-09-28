/*
@module javascript
@class Boolean

#Summary
The Boolean object is an object wrapper for a boolean value.

#Constructor
	new Boolean(value)

#Description
The value passed as the first parameter is converted to a boolean value, if necessary. If value is omitted or is 0, -0, null, false, NaN, undefined, or the empty string (""), the object has an initial value of false. All other values, including any object or the string "false", create an object with an initial value of true.

Do not confuse the primitive Boolean values true and false with the true and false values of the Boolean object.

Any object whose value is not undefined or null, including a Boolean object whose value is false, evaluates to true when passed to a conditional statement. For example, the condition in the following if statement evaluates to true:

	x = new Boolean(false);
	if (x) {
	  // . . . this code is executed
	}
	This behavior does not apply to Boolean primitives. For example, the condition in the following if statement evaluates to false:

	x = false;
	if (x) {
	  // . . . this code is not executed
	}
Do not use a Boolean object to convert a non-boolean value to a boolean value. Instead, use Boolean as a function to perform this task:

	x = Boolean(expression);     // preferred
	x = new Boolean(expression); // don't use
	If you specify any object, including a Boolean object whose value is false, as the initial value of a Boolean object, the new Boolean object has a value of true.

	myFalse = new Boolean(false);   // initial value of false
	g = new Boolean(myFalse);       // initial value of true
	myString = new String("Hello"); // string object
	s = new Boolean(myString);      // initial value of true
	Do not use a Boolean object in place of a Boolean primitive.

#Properties
For properties available on Boolean instances, see Properties of Boolean instances.

Boolean.length
Length property whose value is 1.
Boolean.prototype
Represents the prototype for the Boolean constructor.
#Properties inherited from Function:
arity, caller, constructor, length, name
##Methods
For methods available on Boolean instances, see Methods of Boolean instances.

The global Boolean object contains no methods of its own, however, it does inherit some methods through the prototype chain:

#Methods inherited from Function:
apply, call, toSource, toString

#Boolean instances
All Boolean instances inherit from Boolean.prototype. As with all constructors, the prototype object dictates instances' inherited properties and methods.

#Properties

Boolean.prototype.constructor
Returns the function that created an instance's prototype. This is the Boolean function by default.
Properties inherited from Object:
__parent__, __proto__
#Methods

Boolean.prototype.toSource() 
Returns a string containing the source of the Boolean object; you can use this string to create an equivalent object. Overrides the Object.prototype.toSource() method.
Boolean.prototype.toString()
Returns a string of either "true" or "false" depending upon the value of the object. Overrides the Object.prototype.toString() method.
Boolean.prototype.valueOf()
Returns the primitive value of the Boolean object. Overrides the Object.prototype.valueOf() method.


#Examples
Creating Boolean objects with an initial value of false

	var bNoParam = new Boolean();
	var bZero = new Boolean(0);
	var bNull = new Boolean(null);
	var bEmptyString = new Boolean("");
	var bfalse = new Boolean(false);
	Creating Boolean objects with an initial value of true

	var btrue = new Boolean(true);
	var btrueString = new Boolean("true");
	var bfalseString = new Boolean("false");
	var bSuLin = new Boolean("Su Lin");


*/


/*
@method valueOf
#Summary
The valueOf() method returns the primitive value of a Boolean object.

#Syntax
	bool.valueOf()

#Description
The valueOf method of Boolean returns the primitive value of a Boolean object or literal Boolean as a Boolean data type.

This method is usually called internally by JavaScript and not explicitly in code.

#Examples
##Example: Using valueOf

	x = new Boolean();
	myVar = x.valueOf()      // assigns false to myVar
*/