# TODOs and ideas 

(an important file in this early project stage - growing more and more everyday - try to keep updated.)

Listed from more important to less important - kind of:



 * support globs in nodejs API

 * remove asterix from package.json dependency versions

 * escape @ in text
 
 * markdown in Line comments 

 * (performance) include the source only of files that contain annotations

 * implement js syntax check per file instead of the whole file. if a file doesn't compile then don't include it and warn the user


 * configurables primary annotations : 

    _(tool.primaryAnnotations).extend({
        'object': {doesntContain: ['property','event','method']}
    })
    
(we use doesntContain because by default, we want that any 'strange' annotation to be children of the previous primary annotation.) 

all primary annotation rules (class, module,method, property) should be defined using this hooking api. so the jsdoc rules for this are defined in a readable json. 



 * (performance small) file by file change in shortjsdoc.js really make things slow, let pass a --single-file argument to do things in a single file (much more quick)
 

 * (feature - big) print java code, w links. define the Perspective concept - the current impl is a textual perspective and it is default. java shouold be another perspective. and also the treeview. Example url: /

 * app/UI : sources should be collapsed by defuault because it contaiminates visuals. 

 * in some plugins like comment indentator we are ssumming files have unix end to line. we should pre process all commments first. 

 * annotation names dont support mayus, i.e. @memberOf Apple wont work

 * @module @module.foo @module.bar - then , in the app module contains all the classes of @moule.foo and @module.bar - fix this in the ModuleView class

 * when navigating do scroll to top automatically

 * I as a user want to support custom name regex, for example I want to be able to write annotation names with characters like []

 * @param {Array<String>|Array<Apple>} is printing wrong - first is array of array of string


 * ISSUE: Literal objects can contain other types like generics, but not viceversa, for example generics cannot contain literal types because they will break the syntax: this is ok: @param {cars:Array<Car>} - but this is wrong: @param {Array<{name:String}>} - syntax is broken - this should work @param {#obj(name:String)>}

 * html app : show known subclases in the clasview
 
 * list properties in html app alphabetically or at least have that option.
 
 * detect overriden methods and add a link to the overriden in the text

 * IMPORTANT by default, delete the property  theRestOfTheString that is dumping in the data.json  to minimize its size

 * alias not working in generic types. i.e. this works: {a}, this works: {a|n} this also seems to work: {a<o>} but this doesn't : {a<o<s,n>>}
 
 * remove parseyourowncode,spec runner,etc from html application since this is particular of shortjsdoc. put it on readme.md or other app
 
 * include events @properties in the typeahead search
 
 * browserify the html application js

 * support the node application to define module automatically using input folder structure. 

 * define a syntax and support varargs - like {num1, ..., numN}

 * move src/shortjsdoc.js to src/node/shortjsdoc.js and let src/shortjsdoc only contains the main() call.
 
 * @extends won't work with repeated class names. allow to pass an absolute name or log a warning.

 * @reference an entity like class/module/property/method y absolute name using @reference annotatino in another part of the code. can have a child @reference .THen it will have a references property showing locations in the code where that is used. for example
    //@module m @class c @property p1
    ....
    //@reference m.c.p1

 * (very ambitious) - make a nodejs api
 
 * //TODO: test if we can get correct source comment location relative to the @filename. all nodes should have it- we have the file name but we need information about string fragment of the file of the particular comment

 * IDEA: vendor-jsdoc - define package.json for each so we can do dependency - html requre xml.... ALSO mark those jsdoc from vendor as VENDOR in a AST node property
 

 *  in the data.json, if empty text or theRestString are empty, don't dump it so file is shorter.

 * generic types params types are not binded, this is, for @property {Array<Apple>}, property.params[1].type is undefined. 
 
 * expand the module view to show the full module documentation - for example: http://lunrjs.com/docs/#lunr

 * @link preprocessed comment that is replaced by html or mardown link at preprocessing.

 
 * There is no class / module composite support. Classes inside classes and submodules. There is no way of expressing 'module myapp contains module view that contains module home. Only artificially by naming convention, this is @module myapp @module myapp.view @module myapp.view.home

 * use zepto instead jquery in html app
 
 * more gneeral idea: be able to register type-parser plugins, for example @param {#obj(name:String,colors:Array<Color>)} a - so this is a custom type parser - the user must also provide a function that returns the type object, like return {name: 'Object', objectProperties: {name: {name:'String'}, colors: {name:Array,params: {...}}}}


 * generics typeparser doesn't accept type names with . or _ - he typeparser has the fault

 * support multiple inheritance.

 * configurable option boolean showSources

 * Some secondary features of jsdocmaker like installModifiers, NATIVE_TYPES, should be if(full plugins and be optional. i.e. don't do installModifiers){} in core code.

 * native types declaration: @declareNativeClass QuickSort http://foo.bar.org/external-api/QuickSort.html

 * @function primary
 
 * if an extension loop occurs a maximun call stack size exceeded exception ocurrs. Detect this more friendly.
 
 * Log not found types.
 
 * search for class, modules, methods, methods that return or accept a type. subclasses of..., classes overriding a method... be able to find the classes that uses a certain class in a property or parameter or return type...
 
 * class hierarchy in classview
 
 * crazy idea - store native types pages : at build time capture native types html and attach into generated docs and change links that point to those.


 * if no modules are declared that's OK and the html app whoulld show all the classes instead modules.
 
 * in the part of currentView, module etc of parsing put another plugin/hook container so we can take some action to modify the nodes in that current{View,Module,etc} context

 * support types like {String|HTMLElement|jQuery}

 * support two types of format for returns types, @return and @method {ReturnType} methodName

 * when navigating to class/ it will show the classes view. same for modules .index.html shoulod print those with links

 * TODO: let the user mark some comment block somehow to let the parser to ignore it.




#ISSUES

From most important to less:


 * issue: html app inherited props: only the super class inherited props are shown but not super-super class... also inherited classes should be grouped.

 * ISSUE: parser fail to parse more than two modifiers like these @final @static @myownmodifier - see issues spec.js

 * ISSUE: Resource not found page should have the header.

 * ISSUE: doing the following will fail parsing the param:
 /*@method1 blabla
 @returns {T} blabla*/
 //@param {R} param1

 * ISSUE: names with $

 * issue seems to be failing wen text contains underscore template code: //@method renderTemplate renders underscore templates using a ShopperState context.  

    // Example: state.renderTemplate("hello <%= get('item').get('_price')%>")

 * issue, this text doesnt work:
     //@class A
     //Some text for class A

 * issue the following nodejs doesn't work:

    var ShortJsDoc = require('./src/shortjsdoc.js'); 
    ShortJsDoc.make({
        inputDirs: ['./src/JsDocMaker.js']
    ,   output: 'jsdoc2'
    }); 
    ShortJsDoc.make({
        inputDirs: ['./html']
    ,   output: 'jsdochtml'
    }); 






##DONES - 

thigs moved here after solving - instead erasing it.

 * support comments like /** and in those remove ** prefix
 * project metainformaton from package.json file 
 * support the beauty /* * * * */ multiline block comments like eclipse's. Remove the first aster after a line.
 * support throw/throws
 * ISSUE: in the followin gorder doesn't work (return not shown) @throws {EquationError} @returns {Solution}  - - tip is I add a text after {EquationError} some text then it worls. tip: in the other order it works - this is right (but not desired) because returns is a second level and throws is first level. try to put return as a first level and see if it works
 * module can now contain dots
 * lasses can now defined in different texts, even it text.
 * IDEA: in src/libs-jsdoc with folders like javascript/mozilla jQuery/ Backbone/. Thes folders contains .js files with short jsdoc OO for each library and they can be optionally imported when processing a project.  
 * inherited fields should have the information from which class is inherited - this can be done easy using the name - done manually in the html app.
 * literal object syntax with types: @return {name: String, colors: Array<Color>}.
 * divide JsDocMaker in several files core, preprocessing, postprocessing, biding, etc.
 * @module foo bla bla bla @exports {ParserException:Error,parse:Function} bla bla bla
 * support name alias - for example map the name Map to match Object. as an example show how to make shortkuts like Arr<Obj> or even a<o>. The classes Arr o a won't be generated in the output. Both will be replaced with Array, for this @alias class Arr Array
    @alias method get_apples getApples
that means that when a method named 'get_apples' is found in the jsdoc, the name will be replaced with 'getApples'. Other example:
    @alias class Backbone.View BackboneView
Backbone.View references will be renamed to BackboneView. Take in account that in the output Backbone.View won't exists - only BackboneView

 * plugin idea - post propcessing - : @module mod1 bla bla @exports {AClass} bla bla
 * Support annotation alias, example
    @alias annotation task class
now you can use @task and it will be replaced to @module !

 * issue - injection, the html class view has this bug Class TerranObject
Extends Object{prototype: prototype} - types are printing wrong.

 * IMPORTANTE : @alias not working in ns app

 * make jsdoc for javascript objects liek with methods, etc and offer the possibility to use that information jsdocs instead links to the nativemozilla document like now. This gives the possibility to really see all js attributes inherited from js api.  <---- this is done  and going tasks to document some known apis like javascript, html/xml dom, jqueyr, backbone, etc


 * inherited events and inherited attributes

 --- Dones will be continued in Changelist.md



#Project configuration 

this is a MUST. 

1)cmd line should accept porject configuration json object containing project's meta information. 
2)user should be be able to put this config in a .shortjsdocrc file in any folder with a config for that folder's files. Try to follow package.json syntax.
Example:

    {
        "name": "short-jsdoc"
    ,   "version": "0.1.0"
    ,   "description": "short and simple jsdoc Object Oriented syntax format and implementation"
    ,   "author": "Sebastián Gurin"

    ,   "showSources": true
    }

A big question here is : should we use package.json for looking at project dependencies?



##self-documentable crazy idea

idea - new project - a self documentable - the idea is that you only put @annotation without types or text and extract the information from javascript nodes. For example the following code

    //@method speak
    var f = function(param, index) {...}

will generate the following AST tree:

    {name:'ClassX',methods: [{name:speak,params:[{name:param},{name:index}]},..]}

@method,@constructor: function(){} - so we can extract basic param information from there. 
This may be of help to those who doesn't want to mantain api docs but only want to define a basic API that will link to the sources.
the idea is that the parser look in the javascript ast for the next function declaration and extract parameter information from there
1) associate javascript nodes with @annotations. for example @method and @constructor are FunctionDefinitions and 





