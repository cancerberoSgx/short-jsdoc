#Online HTML5 project demo.  

[Online Example Demo](http://cancerberosgx.github.io/short-jsdoc/html)

[Unit Tests - Descriptions](http://cancerberosgx.github.io/short-jsdoc/test/SpecRunner.html)

[This own project jsdocs](http://cancerberosgx.github.io/short-jsdoc/jsdoc)

#Features

##Short

If you want you can define a whole method signature in one line like this:

    //@method add adds a new tool @param {Array<Tool>} tools @return {Promise} solved when all ends
    ToolCollection.prototype.add = function(tool){...}

##Flexible comment syntax and rich text input

Support all comment types, like /* /** // . 

Also the jsdoc text can be written in in plain text, html or markdown. This means you are free to choose to be minimalistic (writing single-line comments) or very exaustive and styled (writing multiple paragraph html or mardown text), or what is best, do both things and choose where to put the big texts !

##Simple annotation syntax

Simple annotation syntax based in a unique pattern:

    @annotation {Type} name text.  

Also use the concept of primary annotations @module, @class, @method, @property that contains secondary annotations like @extends @returns @static

The mission is that you can just add @annotations to existing source comments without having to re-write them or change its format. 

##Rich Object Oriented Concepts support

short-jsdoc supports a rich set of Object oriented concepts out of the box: module, @class, @property, @method, @event, @constructor, @extend, and many more!

## Rich types support

Heavy support for Types - they are optional but it is important for getting a navigable API. Support Type Generic syntax. multiple types, object literals and custom type definitions.

Read all at [Supported Types Guide](https://github.com/cancerberoSgx/short-jsdoc/blob/master/doc/TYPES.md)

## Generic

The parser read the sources and generate a Abstract Syntax Tree (AST) of ALL the @annotations. THEN it is 'beautified' with shortcuts for properties and methods. But the original AST with ALL the annotations is there for those who want to define its own semantics and annotations. 

## Extendable

User can subscribe to interesting processing 'moments' to add its own semantics. Read all at [Complete Extensibility Guide](https://github.com/cancerberoSgx/short-jsdoc/blob/master/doc/EXTENSIBILITY-GUIDE.md)

## Browser and nodejs

Jsdoc generator is usable both in nodejs or in the browser.

## Rich output

The parser generates a json file with all jsdoc meta data that can be consumed and shared easily. By default a a nice html5 single page application is delivered that shows generated jsdocs in a very rich way and easy to customize.

# Syntax

[Some syntax notes](https://github.com/cancerberoSgx/short-jsdoc/blob/master/SYNTAX.md)

## License

short-jsdoc is open sourced under the [MIT License](https://github.com/cancerberoSgx/short-jsdoc/blob/master/LICENSE). 




# Installing 

this project neds an simple initial installation:

    cd short-jsdoc
    npm install

    #optionally - install the command line shortcut
    sudo npm link


# Using it in nodejs 

    npm install short-jsdoc --save-dev

And then from your build script you can use it like this:

    var ShortJsDoc = require('short-jsdoc');
    ShortJsDoc.make({
        inputDirs: ['./src/folder1', './src/folder2', './src/folder3/file.js']
    ,   output: 'jsdoc'
    ,   projectMetadata: './package.json'
    ,   vendor: ['javascript', 'html', 'backbonejs', 'jquery', 'xml-dom']
    }); 

That will create the folder jsdoc with the jsdoc generated from the src folder.

The optional vendor argument will make the tool to add the jsdoc of javascript reference objects like Array, Object, String, etc. Also we want to include the jsdoc of some libraries like backbonejs and jQuery.

As you can see we are passing a package.json file to extract the target project metainformation like name, version, etc.


# Using it from command line

Using node directly:

    cd short-jsdoc
    node src/shortjsdoc.js --input src/folder1 --project-metadata src/package.json > html/data.json
    cp html /home/my-js-project/apidocs

or multiple input folders: 
    
    node src/shortjsdoc.js --input "src/folder1,src/folder2" --project-metadata src/package.json > html/data.json

Using the command line shortcut (if you installed it)

    shortjsdoc --input /home/my-project1/src/js --project-metadata /home/my-project1/package.json > /home/my-project1/apidocs.json

This will generate the ready to use html application /home/my-js-project/apidocs/index.html showing your project's classes. 

More detailed explanation. What just happened is we first parsed some source folders into a data.json file and. The html application just reads this file and renders all its information in a rich web application.

Feel free to put-copy this full project in your apidocs forlder. And of course feel free to modify to your needs. It is self contained and includes jQuery, bootstrap, underscorejs and backbonejs. In general you will be modifying the markup located in html/src/templates and the styles (very little included and writen in less).

## Interesting commands

    cd short-jsdoc

Generates the test-project json data:

    node src/shortjsdoc.js --input test/test-project/ --project-metadata ./test/test-project/package.json > html/data.json

Generates the front end js application jsdocs itself:

    node src/shortjsdoc.js--input html/src/ --project-metadata ./package.json > html/data.json 

Or do both and add javascript API and js library APIs:

    node src/shortjsdoc.js --input "test/test-project/,html/src/,vendor-jsdoc/javascript" --project-metadata ./test/test-project/package.json > html/data.json

generate shortjsdoc documentation: 

    node generate-apidocs.js


If you need to debug it use grunt run like explained below.

# Running development web demo

Install grunt (only one time)

    sudo npm install -g grunt

then

    grunt run
    firefox http://localhost:8080/html



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

# Dependencies 

The parser depends on esprima and underscore. Can run on the browser or nodejs. For extracting jsdocs from project in filesystem then you need nodejs.

The html5 web application is built with underscore, jquery, bootstrap and backbone.
