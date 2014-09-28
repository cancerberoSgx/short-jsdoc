/*
@module javascript
@class Error

#Summary
The Error constructor creates an error object. Instances of Error objects are thrown when runtime errors occur. The Error object can also be used as a base objects for user-defined exceptions. See below for standard built-in error types.

#Syntax
	new Error([message[, fileName[,lineNumber]]])
#Description
Runtime errors result in new Error objects being created and thrown.

This page documents the use of the Error object itself and its use as a constructor function. For a list of properties and methods inherited by Error instances, see Error.prototype.

#Error types

Besides the generic Error constructor, there are six other core error constructors in JavaScript. For client-side exceptions, see Exception Handling Statements.

	EvalError
	Creates an instance representing an error that occurs regarding the global function eval().
	InternalError 
	Creates an instance representing an error that occurs when an internal error in the JavaScript engine is thrown. E.g. "too much recursion".
	RangeError
	Creates an instance representing an error that occurs when a numeric variable or parameter is outside of its valid range.
	ReferenceError
	Creates an instance representing an error that occurs when de-referencing an invalid reference.
	SyntaxError
	Creates an instance representing a syntax error that occurs while parsing code in eval().
	TypeError
	Creates an instance representing an error that occurs when a variable or parameter is not of a valid type.
	URIError
	Creates an instance representing an error that occurs when encodeURI() or decodeURl() are passed invalid parameters.

#Properties
Error.prototype
Allows the addition of properties to Error instances.
#Methods
The global Error object contains no methods of its own, however, it does inherit some methods through the prototype chain.

#Error instances
All Error instances and instances of non-generic errors inherit from Error.prototype. As with all constructor functions, you can use the prototype of the constructor to add properties or methods to all instances created with that constructor.

#Properties

##Standard properties

Error.prototype.constructor
Specifies the function that created an instance's prototype.
	Error.prototype.message
	Error message.
	Error.prototype.name
	Error name.


#Vendor-specific extensions

##Non-standard
This feature is non-standard and is not on a standards track. Do not use it on production sites facing the Web: it will not work for every user. There may also be large incompatibilities between implementations and the behavior may change in the future.
##Microsoft

	Error.prototype.description
	Error description. Similar to message.
	Error.prototype.number
	Error number.
##Mozilla

	Error.prototype.fileName
	Path to file that raised this error.
	Error.prototype.lineNumber
	Line number in file that raised this error.
	Error.prototype.columnNumber
	Column number in line that raised this error.
	Error.prototype.stack
	Stack trace.

#Examples
##Example: Throwing a generic error

Usually you create an Error object with the intention of raising it using the throw keyword. You can handle the error using the try...catch construct:

	try {
	  throw new Error("Whoops!");
	} catch (e) {
	  alert(e.name + ": " + e.message);
	}
	Example: Handling a specific error

	You can choose to handle only specific error types by testing the error type with the error's constructor property or, if you're writing for modern JavaScript engines, instanceof keyword:

	try {
	  foo.bar();
	} catch (e) {
	  if (e instanceof EvalError) {
	    alert(e.name + ": " + e.message);
	  } else if (e instanceof RangeError) {
	    alert(e.name + ": " + e.message);
	  }
	  // ... etc
	}
##Custom Error Types

You might want to define your own error types deriving from Error to be able to throw new MyError() and use instanceof MyError to check the kind of error in the exception handler. The common way to do this is demonstrated below.

Note that the thrown MyError will report incorrect lineNumber and fileName at least in Firefox.
See also the "What's a good way to extend Error in JavaScript?" discussion on Stackoverflow.

	// Create a new object, that prototypally inherits from the Error constructor.
	function MyError(message) {
	  this.name = "MyError";
	  this.message = message || "Default Message";
	}
	MyError.prototype = new Error();
	MyError.prototype.constructor = MyError;

	try {
	  throw new MyError();
	} catch (e) {
	  console.log(e.name);     // "MyError"
	  console.log(e.message);  // "Default Message"
	}

	try {
	  throw new MyError("custom message");
	} catch (e) {
	  console.log(e.name);     // "MyError"
	  console.log(e.message);  // "custom message"
	}

*/

/*

@constructor Boolean
@param {String} message Human-readable description of the error
@param {String} fileName The value for the fileName property on the created Error object. Defaults to the name of the file containing the code that called the Error() constructor.
@param {Number} lineNumber The value for the lineNumber property on the created Error object. Defaults to the line number containing the Error() constructor invocation.
*/



/*
@property {String} message

#Summary
The message property is a human-readable description of the error.

#Description
This property contains a brief description of the error if one is available or has been set. SpiderMonkey makes extensive use of the message property for exceptions. The message property combined with the name property is used by the Error.prototype.toString() method to create a string representation of the Error.

By default, the message property is an empty string, but this behavior can be overridden for an instance by specifying a message as the first argument to the Error constructor.

#Examples
##Example: Throwing a custom error

	var e = new Error("Could not parse input"); // e.message is "Could not parse input"
	throw e;
*/





/*
@property {String} name
#Summary
The name property represents a name for the type of error. The initial value is "Error".

#Description
By default, Error instances are given the name "Error". The name property, in addition to the message property, is used by the Error.prototype.toString() method to create a string representation of the error.

#Examples
##Example: Throwing a custom error

	var e = new Error("Malformed input"); // e.name is "Error"

	e.name = "ParseError"; 
	throw e;
	// e.toString() would return "ParseError: Malformed input"

*/




/*
@class EvalError @extends Error
The EvalError object indicates an error regarding the global eval() function.
*/

/*
@class RangeError @extends Error

The RangeError object indicates an error when a value is not in the set or range of allowed values.

A RangeError is thrown when trying to pass a number as an argument to a function that does not allow a range that includes that number. This can be encountered when to create an array of an illegal length with the Array constructor, or when passing bad values to the numeric methods Number.toExponential(), Number.toFixed() or Number.toPrecision().
*/


/*
@class ReferenceError @extends Error
#Summary
The ReferenceError object represents an error when a non-existent variable is referenced.

#Description
A ReferenceError is thrown when trying to dereference a variable that has not been declared.
*/



/*
@class SyntaxError @extends Error

#Summary
The SyntaxError object represents an error when trying to interpret syntactically invalid code.

#Description
A SyntaxError is thrown when the JavaScript engine encounters tokens or token order that does not conform to the syntax of the language when parsing code.
*/


/*
@class TypeError @extends Error
The TypeError object represents an error when a value is not of the expected type.
*/

/*
@class URIError @extends Error

The URIError object represents an error when a global URI handling function was used in a wrong way.
*/
