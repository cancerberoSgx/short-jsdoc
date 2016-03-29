#Changelist

##0.1.1 
 * added to npm.org. 
 * better nodejs api

##0.1.2
 * Fix classes with dots references from complex objects

##0.1.3
 * splitted docs in multiple doc/*.md files
 * add support to multiple file loading using addFile() and jsdoc() methods. This is the default way of including multiple file projects. Unit test.
 * Added support to @filename annotation. 
 * object literal type fully support {a:Array<String>}
 * added browserify and refactored in the parser in several files. Remoed hardcoded file names from gruntfile.

##0.1.4
 * @module @exports
 * @alias for classes.
 * JsDocMaker.recurseAST visit nodes and types of the AST - children first
 * issue - injection, the html class view has this bug Class TerranObject Extends Object{prototype: prototype} - types are printing wrong.

##0.1.5
 * renamed vendor BackboneModel to Backbone.Model , same for Backbone.View, Backbone.Router, etc
 * fixed shortjsdoc to allow passing the metadata right - i.e. dontMinifyOutout now works when calling from outside main()
 * fix error in alias when using app - alias metainfo now persisted on the ast

##0.1.6
 * comment-indentation plugin to preserve original comment indentation. 
 * UI TreeView index initial contrib. 
 * text marks plugin
 * text marks concrete plugins @?class @?module, @?method, @?event, @?property @?ref . Show these correctly in the html app.
 * per file parsing - source view has link to the file sources implemented in FileView
 * tree view better decorated
 * treeview with color syntax and download button
 * text mark @?link to write output-independent links
 * improved typeahead results
 
##0.1.7
 * @attribute support - just like @property and @event - 'attributes' AST prop 
 * html5 app supports attribute, and inherited attributes and events

##0.1.8
 * inherited events and inherited attributes
 * json2jsdoc tool
 * PluginContainer priority implementation
 * escape-at plugin : escape @ from text by using @@
 * recurse-plugin-containers (abstract) plugin 
 * fixed issue with respect-comment-indentation plugin
 * search by type page - /search page introduced.
 * known subclasses in class view
 * search class usage in class view
 * show properties partial text in class view

##0.1.9
 * html application runs without server - just open the local html. for pure json output pass --json-output argument
 * @depends class OtherClass - dependencies plugin/tool - must be run manually - not executed automatically since we don't want to make the tool slow. Also implemented a view in the html app to show the class dependency graph using visjs

##0.2.0
 * fix issue with embedded index.html

##0.2.1
 * fix big issue with later declared children

##0.2.2
 * @function support as @module child and html app also
 * fix 'of class' value in method and property views 
 * markdown in Line comments 
 * remove '*' from package.json dependency versions
 * custom annotation names can contain characters '.', '-', '_'
 * improved resource not found page in html app
 * @alias annotation
 
##0.2.3
 * removed the functionality that removed the starting ' * ' prefix from each line of block comments since that breaks markdown lists. 
 * added an option in the UI to only show the class public properties - public properties are marked with a @public child annotation.

##0.2.4
 * fixed html ui makeLink to preserve current hash options