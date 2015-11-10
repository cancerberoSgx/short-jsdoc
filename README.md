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

# Syntax

[Some syntax notes](https://github.com/cancerberoSgx/short-jsdoc/blob/master/doc/SYNTAX.md)

## License

short-jsdoc is open sourced under the [MIT License](https://github.com/cancerberoSgx/short-jsdoc/blob/master/LICENSE). 

Do what you need with this project, if you can, contribute you enhancements back :)




# Installing 

    cd short-jsdoc
    npm install

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

More detailed explanation: What just happened is we first parsed some source folders into a data.json file and. The html application just reads this file and renders all its information in a rich web application.

Feel free to put-copy this full project in your apidocs forlder. And of course feel free to modify to your needs. It is self contained and includes jQuery, bootstrap, underscorejs and backbonejs. In general you will be modifying the markup located in html/src/templates and the styles (very little included and writen in less).

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

    node src/shortjsdoc.js --input test/test-project/ --project-metadata ./test/test-project/package.json > html/data.json

Generates the front end js application jsdocs itself:

    node src/shortjsdoc.js--input html/src/ --project-metadata ./package.json > html/data.json 

Or do both and add javascript API and js library APIs:

    node src/shortjsdoc.js --input "test/test-project/,html/src/,vendor-jsdoc/javascript" --project-metadata ./test/test-project/package.json > html/data.json

generate shortjsdoc documentation: 

    node generate-apidocs.js

full rebuild and recreate

    grunt compile; rm  html/data.json; node src/shortjsdoc.js --input "test/test-project/,html/src/,vendor-jsdoc/javascript" --project-metadata ./test/test-project/package.json > html/data.json

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
