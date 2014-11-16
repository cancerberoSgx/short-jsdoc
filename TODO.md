# TODO: ideas

 * cmd line should accept a package.json file as an input for getting project meta-information

 * IDEA: in src/libs-jsdoc with folders like javascript/mozilla jQuery/ Backbone/. Thes folders contains .js files with short jsdoc OO for each library and they can be optionally imported when processing a project.  


 * define a syntax and support varargs - like {num1, ..., numN}


 * expand the module view to show the full module documentation - for example: http://lunrjs.com/docs/#lunr


 * inherited fields should have the information from which class is inherited - this can be done easy using the name - done manually in the html app.

 * @link preprocessed comment that is replaced by html or mardown link at preprocessing.

 * idea: prove how extendable is short-jsdoc    
 * literal object syntax with types: @return {name: String, colors: Array<Color>}. 


 * ISSUE: parser fail to parse more than two modifiers like these @final @static @myownmodifier - see issues spec.js


 * more gneeral idea: be able to register type-parser plugins, for example @param {#obj(name:String,colors:Array<Color>)} a - so this is a custom type parser - the user must also provide a function that returns the type object, like return {name: 'Object', objectProperties: {name: {name:'String'}, colors: {name:Array,params: {...}}}}


 * ISSUE: Resource not found page should have the header.

 * ISSUE: doing the following will fail parsing the param:
 /*@method1 blabla
 @returns {T} blabla*/
 //@param {R} param1

 * ISSUE: names with $

 * make jsdoc for javascript objects liek with methods, etc and offer the possibility to use that information jsdocs instead links to the nativemozilla document like now. This gives the possibility to really see all js attributes inherited from js api.

 * generics typeparser doesn't accept type names with . or _ - he typeparser has the fault

 * support multiple inheritance.

 * configurable option boolean showSources
 
 * if an extension loop occurs a maximun call stack size exceeded exception ocurrs. Detect this more friendly.
 
 * Log not found types.
 
 * search for class, modules, methods, methods that return or accept a type. subclasses of..., classes overriding a method... be able to find the classes that uses a certain class in a property or parameter or return type...
 
 * class hierarchy in classview

 * support name alias - for example map the name Map to match Object.

 * support types like {String|HTMLElement|jQuery}

 * support two types of format for returns types, @return and @method {ReturnType} methodName

 * when navigating to class/ it will show the classes view. same for modules .index.html shoulod print those with links

 * TODO: let the user mark some comment block somehow to let the parser to ignore it.

 * issue seems to be failing wen text contains underscore template code: //@method renderTemplate renders underscore templates using a ShopperState context. 

    // Example: state.renderTemplate("hello <%= get('item').get('_price')%>")

 * issue, this text doesnt work:
     //@class A
     //Some text for class A





##done:

thigs moved here after solving - instead erasing it.

 * support comments like /** and in those remove ** prefix
 
 * support the beauty /* * * * */ multiline block comments like eclipse's. Remove the first aster after a line.
 * support throw/throws
 * ISSUE: in the followin gorder doesn't work (return not shown) @throws {EquationError} @returns {Solution}  - - tip is I add a text after {EquationError} some text then it worls. tip: in the other order it works - this is right (but not desired) because returns is a second level and throws is first level. try to put return as a first level and see if it works




##self-documentable

idea - new project - a self documentable - the idea is that you only put @annotation without types or text and extract the information from javascript nodes. For example the following code

    //@method speak
    var f = function(param, index) {...}

will generate the following AST tree:

    {name:'ClassX',methods: [{name:speak,params:[{name:param},{name:index}]},..]}

@method,@constructor: function(){} - so we can extract basic param information from there. 
This may be of help to those who doesn't want to mantain api docs but only want to define a basic API that will link to the sources.
the idea is that the parser look in the javascript ast for the next function declaration and extract parameter information from there
1) associate javascript nodes with @annotations. for example @method and @constructor are FunctionDefinitions and 





