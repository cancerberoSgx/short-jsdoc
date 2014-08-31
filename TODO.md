
# TODO: ideas
 
 * cmd line tools should support multiple input folders
 * cmd line should accept a package.json file as an input for getting project meta-information
 * method and properties inherited from super classes
 * search for class, modules, methods, methods that return or accept a type. subclasses of..., classes overriding a method... be able to find the classes that uses a certain class in a property or parameter or return type...
 * 
 * class hierarchy in classview
 * support generic types a la Java:  @return {Array<Person>} the persons in this city @return {Object<String, Person>} persons by name map
 * TODO (syntax): - if you don't put @module in your @class then it will be assigned to last declared module. but @class can declare @module in itself. It is not the same for @method and @class ownership. and the reason is that in general this try to be file agnostic and few classes tend to be declared in a single file and several methods tend to be declared in a single file. 

 * support two types of format for returns types, @return and @method {ReturnType} methodName
 * when navigating to class/ it will show the classes view. same for modules .index.html shoulod print those with links
 * TODO: let the user mark some comment block somehow to let the parser to ignore it.
 * issue, this text doesnt work:
 //@class A
 //Some text for class A
