this["shortjsdoc"] = this["shortjsdoc"] || {};

this["shortjsdoc"]["class"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '\n<h2 class="class-title">Class <a class="class-title" href="class/' +
((__t = ( this.jsdoc.name)) == null ? '' : __t) +
'">' +
((__t = ( this.jsdoc.name )) == null ? '' : __t) +
'</a></h2>\n\n';
 if (this.jsdoc.extends) { ;
__p += '\n<h3>Extends <a href="#class/' +
((__t = ( this.jsdoc.extends)) == null ? '' : __t) +
'">' +
((__t = ( this.jsdoc.extends)) == null ? '' : __t) +
'</a></h3>\n';
 } ;
__p += '\n\n<p class="class-text">' +
((__t = ( this.jsdoc.text )) == null ? '' : __t) +
'</p>\n\n<h3 class=\'methods\'>Methods</h3>\n<ul>\n';
 _(this.jsdoc.methods).each(function(method) { ;
__p += '\n\t<li class="method">\n\t\t<a class=\'method-name\' href="#method/' +
((__t = ( method.absoluteName )) == null ? '' : __t) +
'">Method ' +
((__t = ( method.name )) == null ? '' : __t) +
'</a>\n\t\t\n\t</li>\n';
 }); ;
__p += '\n</ul>\n\n' +
((__t = ( JSON.stringify(this.jsdoc) )) == null ? '' : __t);

}
return __p
};

this["shortjsdoc"]["index"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 var data = this.application.data; ;
__p += '\n<h3>Modules</h3>\n\n<ul>\n';
 _(data.modules).each(function(moduleBody, moduleName) { ;
__p += '\n\t<li><a href="#module/' +
((__t = ( moduleName )) == null ? '' : __t) +
'">' +
((__t = ( moduleName )) == null ? '' : __t) +
'</a></li>\n';
 }); ;
__p += '\n</ul>\n\n<h3>Classes</h3>\n\n<ul>\n';
 _(data.classes).each(function(c) { ;
__p += '\n\t<li><a href="#class/' +
((__t = ( c.absoluteName )) == null ? '' : __t) +
'">' +
((__t = ( c.name )) == null ? '' : __t) +
'</a></li>\n';
 }); ;
__p += '\n</ul>\n\n<a href="#parse"><b>Parse</b> your own code! --></a>\n\n\n\n<p>(devel)<a href="../test/SpecRunner.html">Specs</a></p>';

}
return __p
};

this["shortjsdoc"]["method"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<h2>Method <a href="#method/' +
((__t = ( this.jsdoc.absoluteName)) == null ? '' : __t) +
'">' +
((__t = ( this.jsdoc.name)) == null ? '' : __t) +
'</a></h2>\n\n<h3>Of class <a href="#class/' +
((__t = ( this.jsdoc.ownerClass )) == null ? '' : __t) +
'">' +
((__t = ( this.simpleName(this.jsdoc.ownerClass) )) == null ? '' : __t) +
'</a></h3>\n<h3>Parameters</h3>\n<ul>\n';
 _(this.jsdoc.params).each(function(param){ ;
__p += '\n<li>name: ' +
((__t = ( param.name)) == null ? '' : __t) +
', type: ' +
((__t = ( param.type)) == null ? '' : __t) +
'</li>\n\n';
 }); ;
__p += '\n</ul>';

}
return __p
};

this["shortjsdoc"]["module"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<h2 class="module-title">Module ' +
((__t = ( this.jsdoc.name)) == null ? '' : __t) +
'</h2>\n\n<h3>Classes</h3>\n\n<ul class="classes">\n';
 _(this.classes).each(function(c) { ;
__p += '\n\t<li>\n\t\t<a href="#class/' +
((__t = ( c.absoluteName )) == null ? '' : __t) +
'">' +
((__t = ( c.name )) == null ? '' : __t) +
'</a>\t\t\n\t</li>\n';
 }); ;
__p += '\n</ul>';

}
return __p
};

this["shortjsdoc"]["parse"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<h2>Parse your code online!</h2>\n<p>Please paste your commeted code in the following area and it will be loaded automatically. </p>\n<textarea data-type="inputcode">\n//@class Living Any living thing. @module Life. \n//@class Tree A tree is a living thing that contains some leafs and grow. \n//@extends Living @module Life \nfunction Tree(){}\n/**@method growLeaf makes the given leaf to gro a little more. @param {Leaf} leaf*/\nTree.prototype.growLeaf = function(leaf){}\n/*@class Apple a sweet fruit @module Life @extend Fruit grows in trees and can be eaten @module Life */ \nfunction Apple(){}\n\n//@class Rock @module Mineral\n//@method doShadow @param {Rectangle} shadowSize @return {Shadow} the new Shadow\n\n//@class Shadow @module Ideal\n//@class Good @module Ideal\n</textarea>\n<button data-action="inputcode_doit">do it</button>\n';

}
return __p
};