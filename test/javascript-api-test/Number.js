/*
@module javascript
@class Number

#Summary
The Number JavaScript object is a wrapper object allowing you to work with numerical values. A Number object is created using the Number() constructor.

#Constructor
	new Number(value);

#Description
The primary uses for the Number object are:

If the argument cannot be converted into a number, it returns NaN.
In a non-constructor context (i.e., without the new operator, Number can be used to perform a type conversion.


#Examples
##Example: Using the Number object to assign values to numeric variables

The following example uses the Number object's properties to assign values to several numeric variables:

	var biggestNum = Number.MAX_VALUE;
	var smallestNum = Number.MIN_VALUE;
	var infiniteNum = Number.POSITIVE_INFINITY;
	var negInfiniteNum = Number.NEGATIVE_INFINITY;
	var notANum = Number.NaN;
##Example: Integer range for Number

The following example shows minimum and maximum integer values that can be represented as Number object (for details, refer to EcmaScript standard, chapter 8.5 The Number Type):

	var biggestInt = 9007199254740992;
	var smallestInt = -9007199254740992;

When parsing data that has been serialized to JSON, integer values falling out of this range can be expected to become corrupted when JSON parser coerces them to Number type. Using String instead is a possible workaround.

##Example: Using Number to convert a Date object

The following example converts the Date object to a numerical value using Number as a function:

	var d = new Date("December 17, 1995 03:24:00");
	print(Number(d));

This displays "819199440000".

*/

/*
@constructor Number
@param {Any}value The numeric value of the object being created.
*/






/*
@property {Number} MAX_VALUE

#Summary
The Number.MAX_VALUE property represents the maximum numeric value representable in JavaScript.

#Description
The MAX_VALUE property has a value of approximately 1.79E+308. Values larger than MAX_VALUE are represented as "Infinity".

Because MAX_VALUE is a static property of Number, you always use it as Number.MAX_VALUE, rather than as a property of a Number object you created.

#Examples
##Example: Using MAX_VALUE

	The following code multiplies two numeric values. If the result is less than or equal to MAX_VALUE, the func1 function is called; otherwise, the func2 function is called.

	if (num1 * num2 <= Number.MAX_VALUE) {
	   func1();
	} else {
	   func2();
	}

@static

*/



/*
@property {Number} MIN_VALUE

#Summary
The Number.MIN_VALUE property represents the smallest positive numeric value representable in JavaScript.

#Description
The MIN_VALUE property is the number closest to 0, not the most negative number, that JavaScript can represent.

MIN_VALUE has a value of approximately 5e-324. Values smaller than MIN_VALUE ("underflow values") are converted to 0.

Because MIN_VALUE is a static property of Number, you always use it as Number.MIN_VALUE, rather than as a property of a Number object you created.

#Examples
##Example: Using MIN_VALUE

The following code divides two numeric values. If the result is greater than or equal to MIN_VALUE, the func1 function is called; otherwise, the func2 function is called.

	if (num1 / num2 >= Number.MIN_VALUE) {
	    func1();
	} else {
	    func2();
	}

@static
*/




/*
@property {Number}NEGATIVE_INFINITY

#Summary
The Number.NEGATIVE_INFINITY property represents the negative Infinity value.

You do not have to create a Number object to access this static property (use Number.NEGATIVE_INFINITY).

#Description
The value of Number.NEGATIVE_INFINITY is the same as the negative value of the global object's Infinity property.

This value behaves slightly differently than mathematical infinity:

* Any positive value, including POSITIVE_INFINITY, multiplied by NEGATIVE_INFINITY is NEGATIVE_INFINITY.
* Any negative value, including NEGATIVE_INFINITY, multiplied by NEGATIVE_INFINITY is POSITIVE_INFINITY.
* Zero multiplied by NEGATIVE_INFINITY is NaN.
* NaN multiplied by NEGATIVE_INFINITY is NaN.
* NEGATIVE_INFINITY, divided by any negative value except NEGATIVE_INFINITY, is POSITIVE_INFINITY.
* NEGATIVE_INFINITY, divided by any positive value except POSITIVE_INFINITY, is NEGATIVE_INFINITY.
* NEGATIVE_INFINITY, divided by either NEGATIVE_INFINITY or POSITIVE_INFINITY, is NaN.
* Any number divided by NEGATIVE_INFINITY is zero.

You might use the Number.NEGATIVE_INFINITY property to indicate an error condition that returns a finite number in case of success. Note, however, that isFinite would be more appropriate in such a case.

#Example
In the following example, the variable smallNumber is assigned a value that is smaller than the minimum value. When the if statement executes, smallNumber has the value "-Infinity", so smallNumber is set to a more manageable value before continuing.

	var smallNumber = (-Number.MAX_VALUE) * 2

	if (smallNumber == Number.NEGATIVE_INFINITY) {
	 smallNumber = returnFinite();
	}

@static
*/



/*
@property {Number} NaN
#Summary
The Number.NaN property represents Not-A-Number. Equivalent of NaN.

You do not have to create a Number object to access this static property (use Number.NaN).
@static
*/



/*
@property {Number}POSITIVE_INFINITY

#Summary
The Number.POSITIVE_INFINITY property represents the positive Infinity value.

You do not have to create a Number object to access this static property (use Number.POSITIVE_INFINITY).

#Description
The value of Number.POSITIVE_INFINITY is the same as the value of the global object's Infinity property.

This value behaves slightly differently than mathematical infinity:

* Any positive value, including POSITIVE_INFINITY, multiplied by POSITIVE_INFINITY is POSITIVE_INFINITY.
* Any negative value, including NEGATIVE_INFINITY, multiplied by POSITIVE_INFINITY is NEGATIVE_INFINITY.
* Zero multiplied by POSITIVE_INFINITY is NaN.
* NaN multiplied by POSITIVE_INFINITY is NaN.
* POSITIVE_INFINITY, divided by any negative value except NEGATIVE_INFINITY, is NEGATIVE_INFINITY.
* POSITIVE_INFINITY, divided by any positive value except POSITIVE_INFINITY, is POSITIVE_INFINITY.
* POSITIVE_INFINITY, divided by either NEGATIVE_INFINITY or POSITIVE_INFINITY, is NaN.
* Any number divided by POSITIVE_INFINITY is Zero.
* You might use the Number.POSITIVE_INFINITY property to indicate an error condition that returns a finite number in case of success. Note, however, that isFinite would be more appropriate in such a case.

#Example
In the following example, the variable bigNumber is assigned a value that is larger than the maximum value. When the if statement executes, bigNumber has the value "Infinity", so bigNumber is set to a more manageable value before continuing.

	var bigNumber = Number.MAX_VALUE * 2
	if (bigNumber == Number.POSITIVE_INFINITY) {
	 bigNumber = returnFinite();
	}

@static 
*/