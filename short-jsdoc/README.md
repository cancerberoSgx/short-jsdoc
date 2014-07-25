## About the Project
jsdoc tools like yuidocs or jsdocs are disliked by some JavaScript programmers because they require long comment formats using /** */ and strict syntax. For example in Yui Doc yoiu have to add endlines to the comments to work, for example ```/**@class Apple*/``` doesn't work. 

Many JavaScripters like their code clean - self explained - so long jsdocs comments go against this. 

This project, short-jsdoc target this problem by supporting a syntax based on jsdocs but much more flexible and simple to use in javascript. 

The typical scenario would be the following. Imagine that you have a big project with classes and methods already well commented using line comments like this:

{{{
//says hi to the passed user bla bla bla.
sayHi: function(user){}
}}}

In this situation migrating to jsdocs will imply changing the comments to ```/** */``` syntax and in general cut+paste the existent documentation sentences to the right location. 

Wouldn't be best if jsdocs annotations could be just written to those existent comments?

## Files
This project includes the following files from js-indentator (maintained in that other project):

libs/js-indentator/*.js

## Project Origins

Thanks to the project js-indentator I'm now able to parse and define my own jsdocs rules. The js-indentator example jsdocgenerator1 was designed with these ideas originally and is working well and simple.What is missed from that is getting the output class information json and rendering all that in a nice html5 application. This is what this project try to do.

This project maintains its own js-indentator implementation JsDocMaker. 



## TODO: ideas
 * asd
 * search for class, modules, methods, methods that return or accept a type. subclasses of..., classes overriding a method... 
 * class hierarc in classview
 * support generic types a la Java:  @return {Array<Person>} the persons in this city @return {Object<String, Person>} persons by name map
 * TODO (syntax): - if you don't put @module in your @class then it will be assigned to last declared module. but @class can declare @module in itself. It is not the same for @method and @class ownership. and the reason is that in general this try to be file agnostic and few classes tend to be declared in a single file and several methods tend to be declared in a single file. 

