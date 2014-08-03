# About short-jsdoc syntax

#Syntax Mission

 The major missions of this new syntax are 1) be able to write jsdoc more flexible and shorter, in any source comment with minimal space. 2) easy to add to existing js comment. 3) be simpler with less and simpler concepts. 

Concepts supported @class @method @param @property @module @extend 

Syntax reduction
we define a Simple unit syntax that all annotations match and this is - 

    @annotation {Type} name some_description_text

{Type} is optional and also some_description_text. 

So ALL units are parsed using this same pattern. Major Units like @class

 - jsdoc annotations can now appear on any kind of comment. For this to make sense, before the parser runs, adjacent Line comments (//) are unified into one. This means that adjacent Line comments will be treated as a single comment block. This means that you cannot define more than one Major Unit
 - 
Rule 2 - There are three Major Unit annotations: @class, @method and @property. Major annotations 

# Syntax Unit

short-jsdoc is inspired on jsdoc standards but it is not compatible with those. Defines a total new syntax. 

The central concept in these docs is the Unit. A unit has the form: 

    @annotation {Type} name some text

So what happens is, each comment block is splitted using Major Units. a major unit can contain minor units. For example @param is contained in a @method. @static is contained in a @property, etc. In out case @class and @method are the major units, but this is configurable. 

# jsdoc AST Parser and type binding

short-jsdoc is in fact a machine of transforming javascript code comments with anntations in a JavaScript object which can be easily use to access this information. We call this object the 'jsdoc AST'. Example, parsing the following JavaScript code will result in the following jsdoc AST. 

Input JavaScript code:

    //@class Apple @extend Fruit @module livingThings
    /*@method beEatenBy apples have this privilege @param {Mouth} mouth the mouth to be used @param {Int} amount */
    //@property {Color} color the main color of this fruit

the short-jsdoc tool will generate a living JavaScript object jsdoc that we call the 'jsdoc AST', we can easily use to navigate through the jsdoc AST using for example the following expressions:

    var Apple = jsdoc.classes['livingThings.Apple'];
    var mouthMethods = Apple.methods.beEatenBy.params[0].type.methods

Notice how easily we navigate throught the jsdoc AST. Notice how in the expression jsdoc.classes['livingThings.Apple'] we selected a class using its absolute name 'livingThings.Apple' (remember that you can create classes with equals names but belonging to different modules). 

And then in the expression  Apple.methods.beEatenBy.params[0].type we access a param's type, this is the @Mouth class 'jsdoc ast' node directly and then navigate to the Mouth's methods. The binding is just that, a graph between all the jsdoc data, using the {Type} for navigating.

So Types have special importance on short-jsdoc. Types are supported in @property, @param and in @method@return

# Type binding with generics

short-jsdoc was designed with special interest on exploiting AST navigation using Types so Types are designed to support Generic Classes 'a la java'. This way the writer can be much more expresive. JavaScripters may not know what Generic types are. I try to explain with the following. Think on an Array instance, it's useful to know something is 'an array', but more useful is to know that it's 'an array of Apples'. 

Array<Apples> is more than Array
    


