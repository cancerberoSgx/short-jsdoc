[![Build Status](https://travis-ci.org/cancerberoSgx/short-jsdoc.png?branch=master)](https://travis-ci.org/cancerberoSgx/short-jsdoc)

[Guide](http://cancerberosgx.github.io/short-jsdoc/doc/guide/index.html#)

#Online HTML5 project demo.  

[Online Example Demo](http://cancerberosgx.github.io/short-jsdoc/html)

[Unit Tests - Descriptions](http://cancerberosgx.github.io/short-jsdoc/test/SpecRunner.html)

[This own project jsdocs](http://cancerberosgx.github.io/short-jsdoc/jsdoc)


# Command line 

Install it globally with this command: 

    sudo npm install -g short-jsdoc

then use it like this:

     node bin/short-jsdoc-cli.js --input src --output foo --vendor backbone

# nodejs API

    var ShortJsDoc = require('short-jsdoc');
    ShortJsDoc.make({
        input: ['./src/folder1', './src/folder2', './src/folder3/file.js']
    ,   output: 'jsdoc'
    ,   projectMetadata: './package.json'
    ,   vendor: ['javascript', 'html', 'backbonejs', 'jquery', 'xml-dom']
    }); 


#Options

 * *input*:  comma separated folders form where consume .js files. Example: --input src/model,third/base
 * *output*: the output folder which will be generated with a ready to use html document
 * *projectMetadata*: path to a package.json like file that describe the source project
 * *vendor*: a comma separated list of vendor names - which jsdoc will also be included. See folder vendor-jsdoc to see which are supported. 
 * *jsonOutput* don't write a project to file system, just dump the output json in stdout



#Features

##Short

If you want you can define a whole method signature in one line like this:

    //@method add adds a new tool @param {Array<Tool>} tools @return {Promise} solved when all ends
    ToolCollection.prototype.add = function(tool){...}

##Flexible comment syntax and rich text input

Support all comment types, like /* /** // . 

Also the jsdoc text can be written in in plain text, html or markdown. This means you are free to choose to be minimalistic (writing single-line comments) or very exhaustive and styled (writing multiple paragraph html or mardown text), or what is best, do both things and choose where to put the big texts !

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

## Rich, generic and reusable output

The parser generates a json file with all jsdoc meta data that can be consumed and shared easily. By default a a nice html5 single page application is delivered that shows generated jsdocs in a very rich way and easy to customize. Also you can distribute the folder with the jsdocs and others can just open the local html file in the browser without running a server for easy reading.

## License

short-jsdoc is open sourced under the [MIT License](https://github.com/cancerberoSgx/short-jsdoc/blob/master/LICENSE). 

Do what you need with this project, if you can, contribute you enhancements back :)


# Running development web demo

If you want to taste this project then you should do it in a development environment: First, install grunt (only one time)

    sudo npm install -g grunt

then we can invoke grunt from command line and debug the apps in the browser

    grunt run
    firefox http://localhost:8080/html/index-dev.html

Or execute the Unit tests - located in folder /test/spec/ : http://localhost:8080/test/SpecRunner.html

## Interesting commands

    cd short-jsdoc

Generates the test-project json data:

    node src/shortjsdoc.js --input test/test-project/,vendor-jsdoc/ --project-metadata ./test/test-project/package.json > html/data.json

Generates the front end js application jsdocs itself:

    node src/shortjsdoc.js--input html/src/ --project-metadata ./package.json > html/data.json 

Or do both and add javascript API and js library APIs:

    node src/shortjsdoc.js --input "test/test-project/,html/src/,vendor-jsdoc/javascript" --project-metadata ./test/test-project/package.json > html/data.json

generate shortjsdoc documentation: 

    node generate-apidocs.js

full rebuild and recreate
    
    rm html/data.json; node src/shortjsdoc.js --input "test/test-project/,html/src/,vendor-jsdoc/javascript" --project-metadata ./test/test-project/package.json > html/data.json

Generate and run a full distro from github:

    git clone https://github.com/cancerberoSgx/short-jsdoc.git
    cd short-jsdoc
    npm install
    grunt run
    firefox http://localhost:8080/html/index-dev.html


#Unit test

Run unit tests in the browser: 

    grunt run
    firefox http://localhost:8080/test/SpecRunner.html

Run unit tests in node:

    node node_modules/jasmine/bin/jasmine.js


#Motivation notes
[These are some notes about my initial motivation when started the project](https://github.com/cancerberoSgx/short-jsdoc/blob/master/doc/MOTIVATION.md)

# TODO
[TODO file](https://github.com/cancerberoSgx/short-jsdoc/blob/master/TODO.md) is a very important file at this 'current age' of the project.

# Dependencies 

The parser depends on esprima and underscore and browserify to run in the browser. Can run on the browser or nodejs. For extracting jsdocs from project in filesystem then you need nodejs.

The html5 web application is built with underscore, jquery, bootstrap and backbone,.
