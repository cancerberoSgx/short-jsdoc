# About short-jsdoc syntax

#Syntax Mission

 The major missions of this new syntax are 1) be able to write jsdoc more flexible and shorter, in any source comment with minimal space. 2) easy to add to existing js comment. 3) be simpler with less and simpler concepts. 

Some of the core supported concept are @class @method @param @property @constructor @event @module @extend 


# Syntax Unit

short-jsdoc is inspired on jsdoc standards but it is not compatible with those. Defines a total new syntax. 

The central concept in these docs is the Unit. A unit has the form: 

    @annotation {Type} name some text

All jsdoc annotations must match and this syntax in which {Type}, name and someDescriptionText are optional. Nevertheless some annotations are required to have a name like @method, @property or @class. 

##Comment blocks
A Block comment like /* */ is a comment block. In the case of line comments like // this tool will first group all adjacent line comments as a single block. 

## Major units and children units

Comments block are parsed one by one and each of them splitted into major units

There are three Major Unit annotations: @class, @method and @property. Major annotations contains other children annotations.

So what happens is, each comment block is splitted using Major Units. a major unit can contain then other minor units. For example @param is contained in a @method. @static is contained in a @property, etc. 

Minor/children units must appear next to the parent unit, for example this will works

    //@method eatme the text for eatme method @param {Food} food the text for the food param

but the following is wrong because it will miss the eatme method's text:

    //@method eatme @param {Food} food the text for the food param
    //the text for eatme method 


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
    


