## Motivation

Often in the JavaScript world, jsdocs comments are added as-a-feature in an existing source that already is commented. This project try to target those who in general just need to add some @annotations to an existing js sources to define some OO model. Annotations supported are @module @class @property @method @param @method @extend @return @static @private

This project's core is a JavaScript code parser that will extract jsdoc AST-like data from code comments. It is heavily inspired on Java's and emphasis on types, this is type binding and support type generics syntax

    // like in @returns {Array<Apple>} all the fruits of this tree

The other important part of the project is an html5 application that shows this information in a navigable and responsive site.

At last there is a little nodejs tool for the end-user to extract its code jsdocs and generate this html5 application showing it.







# Motivation

## Motivation 1: short simple and flexible jsdoc syntax

jsdoc tools like yuidocs or jsdocs are disliked by some JavaScript programmers because they require long comment formats using /\*\* \*/ and strict syntax. For example in Yui Doc yoiu have to add endlines to the comments to work, for example /\*\* @class Apple\*/ doesn't work. 

Many JavaScripters like their code clean - self explained - so long jsdocs comments go against this. 

This project, short-jsdoc target this problem by supporting a syntax based on jsdocs but much more flexible and simple to use in javascript. 

The typical scenario would be the following. Imagine that you have a big project with classes and methods already well commented using line comments like this:

    //says hi to the passed user bla bla bla.
    sayHi: function(user){}


In this situation migrating to jsdocs will imply changing the comments to /\*\* \*/ syntax and in general cut+paste the existent documentation sentences to the right location. 

Wouldn't be best if jsdocs annotations could be just written to those existent comments - using any comment format the same of the project's? The truth is that in JavaScript world jsdocs comments are added as-a-feature in an existing source that already is commented. So short-jsdoc try to target those who in general just need to add some @annotations to an existing js source to define some OO model. 

## Motivation 2: define and implement a simple AST for comment annotations. 

# Files
This project includes the following files

html/ folder for a generic html5 application for displaying a project jsdocs. Based on jquery,backbone,underscore and bootstrap3

/src/JsDocMaker.js - the main engine that is based on sprima and underscore. It will parse some source code and generate a json object with class information. For example, the html5 application will consume this data.

/src/shortjsdoc.js - a nodejs based application to use in the desktop - just pass it a folder and it will generate a ready to use html5 application and json data showing the project classes.

The js-indentator example jsdocgenerator1 was designed with these ideas originally and is working well and simple.
