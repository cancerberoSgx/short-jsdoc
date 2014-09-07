#About

##Online HTML5 project demo. 

[Online Example Demo](http://cancerberosgx.github.io/short-jsdoc/html)

#Features

##Short

If you want you can define a whole method signature in one line like this:

    //@method add adds a new line @param {Line} line @return {OrderLineCollection} support method chaining
    OrderLineCollection.prototype.add = function(line){...}

##Flexible comment syntax

Support all comment types, like /* /** // 

##Simple annotation syntax

Simple annotation syntax based in a unique pattern @annotation {Type} name text. 

Also use the concept of primary annotations @module, @class, @method, @property that contains secondary annotations like @extends @returns @static

## Heavy type support

Heavy support for Types - they are optional but it is important for getting a navigable API. Support Type Generic syntax. and multiple types.

## Rich output

The parser generates a json file with all jsdoc meta data that can be consumed and shared easily.

Then there is an html5 single page application default implementation that shows this output in a very rich way and easy to customize. The jsdoc text support plain text, html or markdown. 

## Extendable

The parser read the sources and generate a Abstract Syntax Tree (AST) of ALL the @annotations. THEN it is 'beautified' with shortcuts for properties and methods. But the original AST with ALL the annotations is there for those who want to define its own semantics and annotations.

## Browser and nodejs

100% usable both in nodejs or in the browser.

# Syntax
[Some syntax notes](https://github.com/cancerberoSgx/short-jsdoc/blob/master/SYNTAX.md)

## License
short-jsdoc is open sourced under the [MIT License](https://github.com/cancerberoSgx/short-jsdoc/blob/master/LICENSE). 




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
    # or do both:
    node src/shortjsdoc.js test/test-project/ html/src/js > html/data.json



## Motivation

Often in the JavaScript world, jsdocs comments are added as-a-feature in an existing source that already is commented. This project try to target those who in general just need to add some @annotations to an existing js sources to define some OO model. Annotations supported are @module @class @property @method @param @method @extend @return @static @private

This project's core is a JavaScript code parser that will extract jsdoc AST-like data from code comments. It is heavily inspired on Java's and emphasis on types, this is type binding and support type generics syntax

    // like in @returns {Array<Apple>} all the fruits of this tree

The other important part of the project is an html5 application that shows this information in a navigable and responsive site.

At last there is a little nodejs tool for the end-user to extract its code jsdocs and generate this html5 application showing it.




# Heavy type support
Heavy support for Types - they are optional but it is important for getting a navigable API. Features: 
 * customizable native types (by default pointing to mozilla site)
 * generics syntax support - Array is not as descriptive as Array<Object<String,Apple>>. Generics are optional but there and are based on javadocs and have a flexible syntax.

    //@class Farmer a human that harvest food @extends Human 
    //@method harvest @param {Object<String,Resource>} resources the resources to be harvested b the farmer, by id. 
    //@return {Object<String,Food>} the harvested food units.
    Farmer.prototype.harvest = function(resources){...}

Also multiple types syntax is supported. In a non typed language like javascript, often, method signatures support different kind of parameter types. For example, a method's parameter can be a String or an HTMLElement or a jQuery object. This type of syntax is supported using the '|' character like this:

    @method @html
    @param {String|HTMLElement|jQuery|Array<String>} el

That would be interpreted as 'param method can be any of String, HTMLElement, jQuery object or an Array of strings'. Notice that generics and multiple types syntax can be mixed arbitrarily.

# Extendable

The parser read the sources and generate a Abstract Syntax Tree (AST) of ALL the @annotations. THEN it is 'beautified' with shortcuts for properties and methods. But the AST is there for those who want to define its own semantics and annotations. For example, you want to use your own custom annotation, let's say, @versionfoo to indicate you method's, classes', properties etc version you could do something like the following (ready to run) test

    // the code to be parsed - note that it contains some custom @versionfoo annotations
    var code = 
        '//@module office @versionfoo 3.2' + '\n' + 
        '//@class Computer' + '\n' +
        '//you can do excel here' + '\n' +
        '//@versionfoo 1.2' + '\n' +
        '//@method putmusic @param {Object<String,Array<Song>>} songs' + '\n' + 
        '//@versionfoo 1.0' + '\n' +
        '';

    //instantiate the parser and parse
    var maker = new JsDocMaker();
    maker.parseFile(code); 
    maker.postProccess();
    maker.postProccessBinding();    
    var jsdoc = maker.data;

    // we define a function to visit each AST node - we will search for a children @versionfoo and if any set as a property
    var astVisitor = function(node)
    {
        var versionfoo = _(node.children||[]).find(function(child)
        {
            return child.annotation === 'versionfoo'; 
        });
        if(versionfoo && versionfoo.name)
        {
            node.versionfoo = versionfoo.name; 
        }
    }; 
    maker.recurseAST(astVisitor); 
    expect(jsdoc.modules.office.versionfoo).toBe('3.2');

After this we can easily access the @versionfoo of any node like for example, the following expression:

    jsdoc.modules.office.versionfoo === '3.2'

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
