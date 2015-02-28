#JsDoc syntax

The Shortjsdoc tool has its own jsdoc - like language and this document try to describe it. 

The following are the facts you should know for using this language:



##Object Oriented

This tool will generate an abstract syntax tree (AST) containing information about modules that contain classes that contains methods and properties, etc. This information is extracted from the @annotated comments.

## top to bottom file reading

The parser reads the comments from *top to bottom* to make the AST. For jsdoc specificly some nodes are priorized over others to form the tree. So for example when @module is found, then all the following @class in the source will belong to that module. When a @class is found then all the following @method nodes will belong to that class. 

#Auto Contenible files

Files should be *auto contenible* - you can't make any assumptions about file parsing order. This means that if you are going to talk about a method in some source code file, then you must make sure that you specify the full tree path in that file at least once:

    @module Backbone @class Backbone.View @method render now I can talk about render and Backbone.View class....




##@annotation free

You are free to include any custom @annotation to define your custom semantics. Those will be outputed in the generated AST as children of the 'parent/current' node. for example:

    @method fly ro the moon @return {Number} @released 2014-02-03




Flexible: