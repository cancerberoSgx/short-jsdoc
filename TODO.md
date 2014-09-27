
# TODO: ideas

 * cmd line should accept a package.json file as an input for getting project meta-information
 * inherited fields should have the information from which class is inherited
 * @link preprocessed comment that is replaced by html or mardown link at preprocessing.
 * literal object syntax with types: @return {name: String, colors: Array<Color>}. 
 * more gneeral idea: be able to register type-parser plugins, for example @param {#obj(name:String,colors:Array<Color>)} a - so this is a custom type parser - the user must also provide a function that returns the type object, like return {name: 'Object', objectProperties: {name: {name:'String'}, colors: {name:Array,params: {...}}}}
 * ISSUE: Resource not found page should have the header.
 * ISSUE: doing the following will fail parsing the param:
 /*@method1 blabla
 @returns {T} blabla*/
 //@param {R} param1
 * ISSUE: names with $
 * make jsdoc for javascript objects liek with methods, etc and offer the possibility to use that information jsdocs instead links to the nativemozilla document like now. This gives the possibility to really see all js attributes inherited from js api.
 * generics typeparser doesn't accept type names with . or _
 * support multiple inheritance.
 * configurable option boolean showSources
 * if an extension loop occurs a maximun call stack size exceeded exception ocurrs. Detect this more friendly.
 * Log not found types.
 * search for class, modules, methods, methods that return or accept a type. subclasses of..., classes overriding a method... be able to find the classes that uses a certain class in a property or parameter or return type...
 * class hierarchy in classview
 * support comments like /** and in those remove ** prefix
 * support the beauty /* * * * */ multiline block comments like eclipse's. Remove the first aster after a line.
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
