# About short-jsdoc syntax

short-jsdoc is inspired on jsdoc standards but it is not compatible with those. The major missions of this new syntax are 1) be able to write jsdoc more flexible and shorter, in any source comment with minimal space. 2) easy to add to existing js comment. 3) be simpler with less and simpler concepts. 

Concepts supported @class @method @param @property @module @extend 

Syntax reduction
we define a Simple unit syntax that all annotations match and this is - 

```@annotation {Type} name some_description_text```

{Type} is optional and also ```some_description_text```. 

So ALL units are parsed using this same pattern. Major Units like @class

 - jsdoc annotations can now appear on any kind of comment. For this to make sense, before the parser runs, adjacent Line comments (//) are unified into one. This means that adjacent Line comments will be treated as a single comment block. This means that you cannot define more than one Major Unit
 - 
Rule 2 - There are three Major Unit annotations: @class, @method and @property. Major annotations 
