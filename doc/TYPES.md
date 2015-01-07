# Shortjsdoc types support guide

Shortjsdoc has heavy support for Types - they are optional but it is important for getting a navigable API. Among others it support Generic types, multiple types, object literals and custom type definitions, example: 

    // generic types, using < >
    // @param {Array<String>} names 

    // multiple types, using |
    //@param {HTMLElement|String|jQuery} element

    

##Types Generics

Heavy support for Types - they are optional but it is important for getting a navigable API. Features: 
 * customizable native types (by default pointing to mozilla site)
 * generics syntax support - Array is not as descriptive as Array<Object<String,Apple>>. Generics are optional but there and are based on javadocs and have a flexible syntax.

    //@class Farmer a human that harvest food @extends Human 
    //@method harvest @param {Object<String,Resource>} resources the resources to be harvested b the farmer, by id. 
    //@return {Object<String,Food>} the harvested food units.
    Farmer.prototype.harvest = function(resources){...}

##Multiple types

Also multiple types syntax is supported. In a non typed language like javascript, often, method signatures support different kind of parameter types. For example, a method's parameter can be a String or an HTMLElement or a jQuery object. This type of syntax is supported using the '|' character like this:

    @method @html
    @param {String|HTMLElement|jQuery|Array<String>} el

That would be interpreted as 'param method can be any of String, HTMLElement, jQuery object or an Array of strings'. Notice that generics and multiple types syntax can be mixed arbitrarily.

##Object Literal types definition

Another type supported is a literal description of an object properties. Support you want to describe a JSON Object returned or consumed  by one of your methods or classes but you don't want to define a whole new Class for this. Instead you could do something like this:

    @method getState @returns {name:String,colors:Array<Color>,car:Car}

This means that the method getState returns an Object with properties name of type String, colors of type Array and car of type Car. 

Object literal types definition like this support arbitrary use of generics but it is not recursive ad it does not support multiple types with |, not yet. 


