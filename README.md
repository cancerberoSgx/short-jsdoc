#About

##Online HTML5 project demo. 

[Online Example Demo](http://cancerberosgx.github.io/short-jsdoc/html)

Features: flexible comment syntax, simplycity, heavy support for Types and Types generics.

##License

short-jsdoc is open sourced under the [MIT License](https://github.com/cancerberoSgx/short-jsdoc/blob/master/LICENSE). 


## Motivation

Often in the JavaScript world, jsdocs comments are added as-a-feature in an existing source that already is commented. This project try to target those who in general just need to add some @annotations to an existing js sources to define some OO model. Annotations supported are @module @class @property @method @param @method @extend @return @static @private

This project's core is a JavaScript code parser that will extract jsdoc AST-like data from code comments. It is heavily inspired on Java's and emphasis on types, this is type binding and support type generics syntax

    // like in @returns {Array<Apple>} all the fruits of this tree

The other important part of the project is an html5 application that shows this information in a navigable and responsive site.

At last there is a little nodejs tool for the end-user to extract its code jsdocs and generate this html5 application showing it.


# Using it

## Installing 

this project neds an simple initial installation:

    cd short-jsdoc
    npm install

## Generating documentation for a project in filesystem

    cd short-jsdoc
    node src/shortjsdoc.js /home/my-js-project/ > html/data.json
    cp html /home/my-js-project/apidocs

This will generate the ready to use html application /home/my-js-project/apidocs/index.html showing your project's classes. 

More detailed explanation. What just happened is that the first command creates a data.json file with all your project js files jsdocs. The html application just reads this files and renders all its information in a navigable page. 

Feel free to put-copy this full project in your apidocs forlder. And of course feel free to modify to your needs. It is self contained and includes jQuery, bootstrap, underscorejs and backbonejs. In general you will be modifying the markup located in html/src/templates and the styles (very little included and writen in less).

If you need to debug it use grunt run like explained below.

## Running development web demo

    grunt run
    firefox http://localhost:8080/html

## Interesting commands

    # generates the test-project json data
    node src/shortjsdoc.js test/test-project/ > html/data.json
    # generates the front end js application jsdocs itself
    node src/shortjsdoc.js html/src/ > html/data.json 

#Motivation

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

# Dependencies 

The parser depends on esprima and underscore. Can run on the browser or nodejs. For extracting jsdocs from project in filesystem then you need nodejs.

The html5 web application is built with underscore, jquery, bootstrap and backbone.
