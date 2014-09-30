/* 
@module javascript

@class String

#Summary
The String global object is a constructor for strings, or a sequence of characters.

#Syntax
String literals take the forms:

	'string text' "string text" "中文 español English हिन्दी العربية português বাংলা русский 日本語 ਪੰਜਾਬੀ 한국어"

Beside regular, printable characters, special characters can be encoded using escape notation:

	Code	Output
	\0	the NUL character
	\'	single quote
	\"	double quote
	\\	backslash
	\n	new line
	\r	carriage return
	\v	vertical tab
	\t	tab
	\b	backspace
	\f	form feed
	\uXXXX	unicode codepoint
	\xXX	the Latin-1 character

Or, using the String global object directly:

	String(thing) new String(thing)

#Description
Strings are useful for holding data that can be represented in text form. Some of the most-used operations on strings are to check their length, to build and concatenate them using the + and += string operators, checking for the existence or location of substrings with the indexOf method, or extracting substrings with the substring method.

##Character access

There are two ways to access an individual character in a string. The first is the charAt method:

	return 'cat'.charAt(1); // returns "a"

The other way (introduced in ECMAScript 5) is to treat the string as an array-like object, where individual characters correspond to a numerical index:

	return 'cat'[1]; // returns "a"

For character access using bracket notation, attempting to delete or assign a value to these properties will not succeed. The properties involved are neither writable nor configurable. (See Object.defineProperty for more information.)

##Comparing strings

C developers have the strcmp() function for comparing strings. In JavaScript, you just use the less-than and greater-than operators:

	var a = "a";
	var b = "b";
	if (a < b) // true
	  print(a + " is less than " + b);
	else if (a > b)
	  print(a + " is greater than " + b);
	else
	  print(a + " and " + b + " are equal.");

A similar result can be achieved using the localeCompare method inherited by String instances.

##Distinction between string primitives and String objects

Note that JavaScript distinguishes between String objects and primitive string values. (The same is true of Boolean and Numbers.)

String literals (denoted by double or single quotes) and strings returned from String calls in a non-constructor context (i.e., without using the new keyword) are primitive strings. JavaScript automatically converts primitives to String objects, so that it's possible to use String object methods for primitive strings. In contexts where a method is to be invoked on a primitive string or a property lookup occurs, JavaScript will automatically wrap the string primitive and call the method or perform the property lookup.

	var s_prim = "foo";
	var s_obj = new String(s_prim);

	console.log(typeof s_prim); // Logs "string"
	console.log(typeof s_obj);  // Logs "object"
	String primitives and String objects also give different results when using eval. Primitives passed to eval are treated as source code; String objects are treated as all other objects are, by returning the object. For example:

	s1 = "2 + 2";               // creates a string primitive
	s2 = new String("2 + 2");   // creates a String object
	console.log(eval(s1));      // returns the number 4
	console.log(eval(s2));      // returns the string "2 + 2"

For these reasons, code may break when it encounters String objects when it expects a primitive string instead, although generally authors need not worry about the distinction.

A String object can always be converted to its primitive counterpart with the valueOf method.

	console.log(eval(s2.valueOf())); // returns the number 4

Note: For another possible approach to strings in JavaScript, please read the article about StringView – a C-like representation of strings based on typed arrays.


#String generic methods
The String instance methods are also available in Firefox as of JavaScript 1.6 (though not part of the ECMAScript standard) on the String object for applying String methods to any object:

	var num = 15;
	alert(String.replace(num, /5/, '2'));

Generics are also available on Array methods.

The following is a shim to provide support to non-supporting browsers:

	//globals define
	// Assumes all supplied String instance methods already present
	// (one may use shims for these if not available)
	(function () {
	    'use strict';

	    var i,
	        // We could also build the array of methods with the following, but the
	        //   getOwnPropertyNames() method is non-shimable:
	        // Object.getOwnPropertyNames(String).filter(function (methodName)
	        //  {return typeof String[methodName] === 'function'});
	        methods = [
	            'quote', 'substring', 'toLowerCase', 'toUpperCase', 'charAt',
	            'charCodeAt', 'indexOf', 'lastIndexOf', 'startsWith', 'endsWith',
	            'trim', 'trimLeft', 'trimRight', 'toLocaleLowerCase',
	            'toLocaleUpperCase', 'localeCompare', 'match', 'search',
	            'replace', 'split', 'substr', 'concat', 'slice'
	        ],
	        methodCount = methods.length,
	        assignStringGeneric = function (methodName) {
	            var method = String.prototype[methodName];
	            String[methodName] = function (arg1) {
	                return method.apply(arg1, Array.prototype.slice.call(arguments, 1));
	            };
	        };

	    for (i = 0; i < methodCount; i++) {
	        assignStringGeneric(methods[i]);
	    }
	}());

#Examples
##String conversion

It's possible to use String as a "safer" toString alternative, as although it still normally calls the underlying toString, it also works for null and undefined. For example:

	var outputStrings = [];
	for (let i = 0, n = inputValues.length; i < n; ++i) {
	  outputStrings.push(String(inputValues[i]));
	}

*/






/*
@property {Number} length

#Summary
The length property represents the length of a string.

#Syntax

	str.length

#Description

This property returns the number of code units in the string. UTF-16, the string format used by JavaScript, uses a single 16-bit code unit to represent the most common characters, but needs to use two code units for less commonly-used characters, so it's possible for the value returned by length to not match the actual number of characters in the string.

For an empty string, length is 0.

The static property String.length returns the value 1.

#Examples

	var x = "Mozilla";
	var empty = "";

	console.log("Mozilla is " + x.length + " code units long");
	// "Mozilla is 7 code units long" 

	console.log("The empty string is has a length of " + empty.length);
	 // "The empty string is has a length of 0" 

*/




/*
@method fromCharCode

#Summary
The static String.fromCharCode() method returns a string created by using the specified sequence of Unicode values.

#Syntax
String.fromCharCode(num1, ..., numN)
#Description
This method returns a string and not a String object.

Because fromCharCode is a static method of String, you always use it as String.fromCharCode(), rather than as a method of a String object you created.

#Examples
Example: Using fromCharCode

The following example returns the string "ABC".

	String.fromCharCode(65,66,67)

#Getting it to work with higher values
Although most common Unicode values can be represented with one 16-bit number (as expected early on during JavaScript standardization) and fromCharCode() can be used to return a single character for the most common values (i.e., UCS-2 values which are the subset of UTF-16 with the most common characters), in order to deal with ALL legal Unicode values (up to 21 bits), fromCharCode() alone is inadequate. Since the higher code point characters use two (lower value) "surrogate" numbers to form a single character, String.fromCodePoint() (part of the ES6 draft) can be used to return such a pair and thus adequately represent these higher valued characters.

@return {String}  returns a string created by using the specified sequence of Unicode values.}

@param p1,...pn A sequence of numbers that are Unicode values

*/







/*
@method charAt


#Summary
The charAt() method returns the specified character from a string.

#Syntax
	str.charAt(index)
#Description
Characters in a string are indexed from left to right. The index of the first character is 0, and the index of the last character in a string called stringName is stringName.length - 1. If the index you supply is out of range, JavaScript returns an empty string.

#Examples
##Example: Displaying characters at different locations in a string

The following example displays characters at different locations in the string "Brave new world":

	var anyString = "Brave new world";

	console.log("The character at index 0   is '" + anyString.charAt(0)   + "'");
	console.log("The character at index 1   is '" + anyString.charAt(1)   + "'");
	console.log("The character at index 2   is '" + anyString.charAt(2)   + "'");
	console.log("The character at index 3   is '" + anyString.charAt(3)   + "'");
	console.log("The character at index 4   is '" + anyString.charAt(4)   + "'");
	console.log("The character at index 999 is '" + anyString.charAt(999) + "'");

These lines display the following:

	The character at index 0 is 'B'
	The character at index 1 is 'r'
	The character at index 2 is 'a'
	The character at index 3 is 'v'
	The character at index 4 is 'e'
	The character at index 999 is ''

##Example: Getting whole characters

The following provides a means of ensuring that going through a string loop always provides a whole character, even if the string contains characters that are not in the Basic Multi-lingual Plane.

	var str = 'A \uD87E\uDC04 Z'; // We could also use a non-BMP character directly
	for (var i=0, chr; i < str.length; i++) {
	  if ((chr = getWholeChar(str, i)) === false) {
	    continue;
	  } // Adapt this line at the top of each loop, passing in the whole string and
	    // the current iteration and returning a variable to represent the 
	    // individual character

	  alert(chr);
	}

	function getWholeChar (str, i) {
	  var code = str.charCodeAt(i);     
	 
	  if (isNaN(code)) {
	    return ''; // Position not found
	  }
	  if (code < 0xD800 || code > 0xDFFF) {
	    return str.charAt(i);
	  }

	  // High surrogate (could change last hex to 0xDB7F to treat high private
	  // surrogates as single characters)
	  if (0xD800 <= code && code <= 0xDBFF) { 
	    if (str.length <= (i+1))  {
	      throw 'High surrogate without following low surrogate';
	    }
	    var next = str.charCodeAt(i+1);
	      if (0xDC00 > next || next > 0xDFFF) {
	        throw 'High surrogate without following low surrogate';
	      }
	      return str.charAt(i)+str.charAt(i+1);
	  }
	  // Low surrogate (0xDC00 <= code && code <= 0xDFFF)
	  if (i === 0) {
	    throw 'Low surrogate without preceding high surrogate';
	  }
	  var prev = str.charCodeAt(i-1);
	  
	  // (could change last hex to 0xDB7F to treat high private
	  // surrogates as single characters)
	  if (0xD800 > prev || prev > 0xDBFF) { 
	    throw 'Low surrogate without preceding high surrogate';
	  }
	  // We can pass over low surrogates now as the second component
	  // in a pair which we have already processed
	  return false; 
	}

In an exclusive JavaScript 1.7+ environment (such as Firefox) which allows destructured assignment, the following is a more succinct and somewhat more flexible alternative in that it does incrementing for an incrementing variable automatically (if the character warrants it in being a surrogate pair).

	var str = 'A\uD87E\uDC04Z'; // We could also use a non-BMP character directly
	for (var i=0, chr; i < str.length; i++) {
	  [chr, i] = getWholeCharAndI(str, i);
	  // Adapt this line at the top of each loop, passing in the whole string and
	  // the current iteration and returning an array with the individual character
	  // and 'i' value (only changed if a surrogate pair)

	  alert(chr);
	}

	function getWholeCharAndI (str, i) {
	  var code = str.charCodeAt(i);

	  if (isNaN(code)) {
	    return ''; // Position not found
	  }
	  if (code < 0xD800 || code > 0xDFFF) {
	    return [str.charAt(i), i]; // Normal character, keeping 'i' the same
	  }

	  // High surrogate (could change last hex to 0xDB7F to treat high private 
	  // surrogates as single characters)
	  if (0xD800 <= code && code <= 0xDBFF) { 
	    if (str.length <= (i+1))  {
	      throw 'High surrogate without following low surrogate';
	    }
	    var next = str.charCodeAt(i+1);
	      if (0xDC00 > next || next > 0xDFFF) {
	        throw 'High surrogate without following low surrogate';
	      }
	      return [str.charAt(i)+str.charAt(i+1), i+1];
	  }
	  // Low surrogate (0xDC00 <= code && code <= 0xDFFF)
	  if (i === 0) {
	    throw 'Low surrogate without preceding high surrogate';
	  }
	  var prev = str.charCodeAt(i-1);

	  // (could change last hex to 0xDB7F to treat high private surrogates
	  // as single characters)
	  if (0xD800 > prev || prev > 0xDBFF) { 
	    throw 'Low surrogate without preceding high surrogate';
	  }
	  // Return the next character instead (and increment)
	  return [str.charAt(i+1), i+1]; 
	}


##Example: Fixing charAt to support non-Basic-Multilingual-Plane (BMP) characters

While the example above may be more frequently useful for those wishing to support non-BMP characters (since it does not require the caller to know where any non-BMP character might appear), in the event that one does wish, in choosing a character by index, to treat the surrogate pairs within a string as the single characters they represent, one can use the following:

	function fixedCharAt (str, idx) {
	  var ret = '';
	  str += '';
	  var end = str.length;

	  var surrogatePairs = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;
	  while ((surrogatePairs.exec(str)) != null) {
	    var li = surrogatePairs.lastIndex;
	    if (li - 2 < idx) {
	      idx++;
	    } else {
	      break;
	    }
	  }

	  if (idx >= end || idx < 0) {
	    return '';
	  }

	  ret += str.charAt(idx);

	  if (/[\uD800-\uDBFF]/.test(ret) && /[\uDC00-\uDFFF]/.test(str.charAt(idx+1))) {
	    // Go one further, since one of the "characters" is part of a surrogate pair
	    ret += str.charAt(idx+1); 
	  }
	  return ret;
	}


@param {Number} index An integer between 0 and 1-less-than the length of the string.
@return {String} the specified character from a string.

*/




/*
@method charCodeAt

#Summary
The charCodeAt() method returns the numeric Unicode value of the character at the given index (except for unicode codepoints > 0x10000).

#Syntax
	str.charCodeAt(index)
#Description
Unicode code points range from 0 to 1,114,111. The first 128 Unicode code points are a direct match of the ASCII character encoding. For information on Unicode, see the JavaScript Guide.

Note that charCodeAt will always return a value that is less than 65,536. This is because the higher code points are represented by a pair of (lower valued) "surrogate" pseudo-characters which are used to comprise the real character. Because of this, in order to examine or reproduce the full character for individual characters of value 65,536 and above, for such characters, it is necessary to retrieve not only charCodeAt(i), but also charCodeAt(i+1) (as if examining/reproducing a string with two letters). See example 2 and 3 below.

charCodeAt returns NaN if the given index is not greater than 0 or is greater than the length of the string.

Backward compatibilty: In historic versions (like JavaScript 1.2) the charCodeAt method returns a number indicating the ISO-Latin-1 codeset value of the character at the given index. The ISO-Latin-1 codeset ranges from 0 to 255. The first 0 to 127 are a direct match of the ASCII character set.

#Examples
##Example: Using charCodeAt

The following example returns 65, the Unicode value for A.

	"ABC".charCodeAt(0) // returns 65

#Example: Fixing charCodeAt to handle non-Basic-Multilingual-Plane characters if their presence earlier in the string is unknown

This version might be used in for loops and the like when it is unknown whether non-BMP characters exist before the specified index position.

	function fixedCharCodeAt (str, idx) {
	    // ex. fixedCharCodeAt ('\uD800\uDC00', 0); // 65536
	    // ex. fixedCharCodeAt ('\uD800\uDC00', 1); // false
	    idx = idx || 0;
	    var code = str.charCodeAt(idx);
	    var hi, low;
	    
	    // High surrogate (could change last hex to 0xDB7F to treat high
	    // private surrogates as single characters)
	    if (0xD800 <= code && code <= 0xDBFF) {
	        hi = code;
	        low = str.charCodeAt(idx+1);
	        if (isNaN(low)) {
	            throw 'High surrogate not followed by low surrogate in fixedCharCodeAt()';
	        }
	        return ((hi - 0xD800) * 0x400) + (low - 0xDC00) + 0x10000;
	    }
	    if (0xDC00 <= code && code <= 0xDFFF) { // Low surrogate
	        // We return false to allow loops to skip this iteration since should have
	        // already handled high surrogate above in the previous iteration
	        return false;
	        //hi = str.charCodeAt(idx-1);
	        //low = code;
	        //return ((hi - 0xD800) * 0x400) + (low - 0xDC00) + 0x10000;
	    }
	    return code;
	}

##Example: Fixing charCodeAt to handle non-Basic-Multilingual-Plane characters if their presence earlier in the string is known

	function knownCharCodeAt (str, idx) {
	    str += '';
	    var code,
	        end = str.length;

	    var surrogatePairs = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;
	    while ((surrogatePairs.exec(str)) != null) {
	        var li = surrogatePairs.lastIndex;
	        if (li - 2 < idx) {
	            idx++;
	        }
	        else {
	            break;
	        }
	    }

	    if (idx >= end || idx < 0) {
	        return NaN;
	    }

	    code = str.charCodeAt(idx);

	    var hi, low;
	    if (0xD800 <= code && code <= 0xDBFF) {
	        hi = code;
	        low = str.charCodeAt(idx+1);
	        // Go one further, since one of the "characters" is part of a surrogate pair
	        return ((hi - 0xD800) * 0x400) + (low - 0xDC00) + 0x10000;
	    }
	    return code;
	}


@param {Number} index
An integer greater than or equal to 0 and less than the length of the string; if it is not a number, it defaults to 0.

@returns {Number}returns the numeric Unicode value of the character at the given index (except for unicode codepoints > 0x10000).

*/





/*
@method concat


#Summary
The concat() method combines the text of two or more strings and returns a new string.

#Syntax
	str.concat(string2, string3[, ..., stringN])

#Description
The concat function combines the text from one or more strings and returns a new string. Changes to the text in one string do not affect the other string.

#Examples
##Example: Using concat

The following example combines strings into a new string.

	var hello = "Hello, ";
	console.log(hello.concat("Kevin", " have a nice day.")); 

	// Hello, Kevin have a nice day. 

#Performance
It is strongly recommended that assignment operators (+, +=) are used instead of the concat method. See this perfomance test.

@param string2...stringN Strings to concatenate to this string.

@return {String}
*/




/*
@method indexOf

#Summary
The indexOf() method returns the index within the calling String object of the first occurrence of the specified value, starting the search at fromIndex. Returns -1 if the value is not found.

#Syntax
	str.indexOf(searchValue[, fromIndex])
#Description
Characters in a string are indexed from left to right. The index of the first character is 0, and the index of the last character of a string called stringName is stringName.length - 1.

	"Blue Whale".indexOf("Blue");     // returns  0
	"Blue Whale".indexOf("Blute");    // returns -1
	"Blue Whale".indexOf("Whale", 0); // returns  5
	"Blue Whale".indexOf("Whale", 5); // returns  5
	"Blue Whale".indexOf("", 9);      // returns  9
	"Blue Whale".indexOf("", 10);     // returns 10
	"Blue Whale".indexOf("", 11);     // returns 10

##Case-sensitivity

The indexOf method is case sensitive. For example, the following expression returns -1:

"Blue Whale".indexOf("blue") // returns -1
##Checking occurrences

Note that '0' doesn't evaluate to true and '-1' doesn't evaluate to false. Therefore, when checking if a specific string exists within another string the correct way to check would be:

"Blue Whale".indexOf("Blue") != -1; // true
"Blue Whale".indexOf("Bloe") != -1; // false

#Examples
##Example: Using indexOf and lastIndexOf

The following example uses indexOf and lastIndexOf to locate values in the string "Brave new world".

	var anyString = "Brave new world";

	console.log("The index of the first w from the beginning is " + anyString.indexOf("w"));
	// Displays 8
	console.log("The index of the first w from the end is " + anyString.lastIndexOf("w")); 
	// Displays 10

	console.log("The index of 'new' from the beginning is " + anyString.indexOf("new"));   
	// Displays 6
	console.log("The index of 'new' from the end is " + anyString.lastIndexOf("new"));
	// Displays 6
##Example: indexOf and case-sensitivity

The following example defines two string variables. The variables contain the same string except that the second string contains uppercase letters. The first log method displays 19. But because the indexOf method is case sensitive, the string "cheddar" is not found in myCapString, so the second log method displays -1.

	var myString    = "brie, pepper jack, cheddar";
	var myCapString = "Brie, Pepper Jack, Cheddar";

	console.log('myString.indexOf("cheddar") is ' + myString.indexOf("cheddar"));    
	// Displays 19
	console.log('myCapString.indexOf("cheddar") is ' + myCapString.indexOf("cheddar")); 
	// Displays -1
##Example: Using indexOf to count occurrences of a letter in a string

The following example sets count to the number of occurrences of the letter x in the string str:

	count = 0;
	pos = str.indexOf("x");

	while ( pos != -1 ) {
	   count++;
	   pos = str.indexOf( "x",pos + 1 );
	}


@param {String} searchValue A string representing the value to search for.
@param {Number} fromIndex The location within the calling string to start the search from. It can be any integer. The default value is 0. If fromIndex < 0 the entire string is searched (same as passing 0). If fromIndex >= str.length, the method will return -1 unless searchValue is an empty string in which case str.length is returned. 
@optional
@returns {Number} the index within the calling String object of the first occurrence of the specified value, starting the search at fromIndex. Returns -1 if the value is not found.
*/