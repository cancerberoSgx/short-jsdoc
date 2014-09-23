# shortjsdoc tutorial

This document try to tech how to create API documentation using jsdoc syntax like (shortjsdoc format). From scratch - just for totally newcomers.

#What is jsdoc

The idea of jsdoc is to define an API like documentation by putting meanful comments in our JavaScript sources. We use the Object Oriented Paradigm for writing the documentation, this is we describe modules, classes, methods and properties. We use @annotation syntax (like in javadoc). 

The idea is to write this comments along side your code in the place you define the thing. For example, in the following fragment we declare a class with a method and a property. 

    /*
    @class View @extends BaseObject
    @method render @param {HTMLElement} parent @return {View}
    @property {HTMLElement} el
    */
    View.prototype.render = function(){...}; 

In this comment we are stating the following: 

    we declare the class View that extends from class BaseObject
    we declare a method render() of the class View (last declared) that accepts a parameter named parent and of type HTMLElement and returns an object of type View. 
    At last declare a property named el of the class View (last declared) that is of type HTMLElement

You may think the jsdoc tool will read @annotations from your comments, from the top to the bottom, no matter the comment type, format or spacing. You declare @modules that contain @classes that contains @methods and @properties. 

The tool will read an entire project folder files recursively so each file must be self-containable and no assumption about file order can be made. 

At last the tool will generate a JSON object with all this information - that you may call the jsdoc AST.

#General Annotation Syntax

A general annotation syntax is accepted:

    @annotation {Type} name some text, yes all the rest to the next annotation will be the text of this entity. 

Type, name and text are optional. The tool will read these annotations and forma very general AST. 

Then it is a supported particular syntax for doing Object Oriented that we call short-jsdoc.

#short-jsdoc Syntax

OK so this is a general tool for one side, but in another side it supports a simple concrete syntax for writing OO called short-jsdoc. 

We support @module that contains @class that contains @method @property @event @constructor. @constructor and @method support @param lists. 

The @class is the central concept and can @extend from another class (single inheritance). Then the class contains some children like @param @return @property and others that may accept a {type} for indicating the expected object type in the signature. Specifying types make your documentation navigable. 

Also some second-level annotations like @extend @static @final @private that are associated to some class member. 

##Types

short-jsdoc does ironically support a very rich type syntax. Inspired on javadoc supports generics and multiples. For example, indicating that a method return an array of products:

    @return {Array<Product>}

Another example indicate that the param el may be an String or an HTMLElement:
    
    @param {HTMLElement|String} el 

Types are optional but using them makes your API navigable (easy to learn). 

# Respect the syntax!

The most common mistake is perhaps not respecting the simple annotation syntax when using multiple @annotations. Take for example

    @class Apple @extends @Fruit Apples are fruits that grows in the forest tiles. 

this is incorrect because the Apple text, this is 'are fruits that grows in the forest tiles.' it will be ignored. The right ways would be : 

    @class Apple Apples are fruits that grows in the forest tiles. @extends @Fruit

Then you just know there are major @annotatios like @module @class @method @param @property that will contain other minor like @extend @static etc.

#Example 1

We hope the syntax is clear enough to be learn by reading it:

    @module Login

    @class LoginView @extends View
    @method prepare @param {String} user @param {String} psswd
    @property {HTMLElement} psswdInput

    @class LoginModel @extends @Model
    @method getTotalAmount @return {Number} the total lorem ipsum. 

