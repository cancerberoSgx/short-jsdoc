this["shortjsdoc"] = this["shortjsdoc"] || {};

this["shortjsdoc"]["class"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 
var self = this; 
;
__p += '\n\n<h2 class="class-title">Class <a class="class-title" href="class/' +
((__t = ( this.jsdoc.name)) == null ? '' : __t) +
'">' +
((__t = ( this.jsdoc.name )) == null ? '' : __t) +
'</a></h2>\n\n<h3 class="class-module-title">Module \n\t' +
((__t = ( this.makeLink(this.jsdoc.module) )) == null ? '' : __t) +
'\n\t<a href="#module/' +
((__t = ( this.jsdoc.module.name)) == null ? '' : __t) +
'">' +
((__t = ( this.jsdoc.module.name)) == null ? '' : __t) +
'</a></h3>\n\n';
 if (this.jsdoc.extends) { ;
__p += '\n<h3 class="class-extends-title">Extends ' +
((__t = ( this.printTypeAsString(this.jsdoc.extends))) == null ? '' : __t) +
'</h3>\n';
 } ;
__p += '\n\n<p class="class-text">' +
((__t = ( this.jsdoc.text )) == null ? '' : __t) +
'</p>\n\n<h3 class=\'methods\'>Methods</h3>\n<ul>\n';
 
//var orderedMethods = this.jsdoc.methods
_(this.jsdoc.methods).each(function(method) { ;
__p += '\n\t<li class="method">\n\t\t<a class=\'method-name\' href="#method/' +
((__t = ( method.absoluteName )) == null ? '' : __t) +
'">Method ' +
((__t = ( method.name )) == null ? '' : __t) +
'</a>\n\t\t';
 if(method.params) { ;
__p += '\n\t\t<h4 class="params-title">Parameters</h4>\n\t\t<ol class="params">\n\t\t\t';
 _(method.params).each(function(param){ ;
__p += '\n\t\t\t<li class="param">\n\t\t\t\t<span class="param-name">' +
((__t = ( param.name )) == null ? '' : __t) +
'</span>\n\t\t\t\t<span class="param-type">' +
((__t = ( self.printTypeAsString(param.type) )) == null ? '' : __t) +
'</span> \n\t\t\t</li>\n\t\t\t';
 }); ;
__p += '\n\t\t</ol>\n\t\t';
 } ;
__p += '\n\n\t</li>\n';
 }); ;
__p += '\n</ul>\n\n\n\n<h3 class=\'methods\'>Properties</h3>\n<ul>\n';
 
var self = this; 
_(this.jsdoc.properties).each(function(p) { ;
__p += '\n\t<li class="property">\n\t\t<a class=\'property-name\' href="#property/' +
((__t = ( p.absoluteName )) == null ? '' : __t) +
'">' +
((__t = ( p.name )) == null ? '' : __t) +
'</a>\n\t\t<span class="property-type">' +
((__t = ( self.printTypeAsString(p.type) )) == null ? '' : __t) +
'</span> \n\t</li>\n';
 }); ;
__p += '\n</ul>\n';

}
return __p
};

this["shortjsdoc"]["classes"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 var data = this.application.data; ;
__p += '\n\n<h3><a href="#classes">Classes</a></h3>\n<ul>\n';
 _(data.classes).each(function(c) { ;
__p += '\n\t<li><a href="#class/' +
((__t = ( c.absoluteName )) == null ? '' : __t) +
'">' +
((__t = ( c.name )) == null ? '' : __t) +
'</a></li>\n';
 }); ;
__p += '\n</ul>';

}
return __p
};

this["shortjsdoc"]["header"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<header class="main-header container-fluid">\n\n\t<span class="col-lg-4 col-md-4 col-sm-4 col-xs-12">\n\n\t\t<span class="dropdown">\n\t\t\t<button class="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown">\n\t\t\tshort-jsdoc demo\n\t\t\t<span class="caret"></span>\n\t\t\t</button>\n\t\t\t<ul class="dropdown-menu" role="menu" aria-labelledby="dropdownMenu1">\n\t\t\t\t<li role="presentation"><a role="menuitem" tabindex="-1" href="#index">Index</a></li>\n\t\t\t\t<li role="presentation" class="divider"></li>\n\t\t\t\t<li role="presentation"><a role="menuitem" tabindex="-1" href="https://github.com/cancerberoSgx/short-jsdoc">short-jsdoc home page</a></li>\n\t\t\t</ul>\n\t\t</span>\t\t\n\t</span>\n\n\t<span class="col-lg-8 col-md-8 col-sm-8 col-xs-12">\n\t\t<span class="main-search pull-right">\n\t\t\tSearch <input class="typeahead1">\n\t\t</span>\t\t\n\t</span>\n\n</header>';

}
return __p
};

this["shortjsdoc"]["index"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 var data = this.application.data; ;
__p += '\n\n' +
((__t = ( this.application.templates['modules'].apply(this, arguments) )) == null ? '' : __t) +
'\n\n\n' +
((__t = ( this.application.templates['classes'].apply(this, arguments) )) == null ? '' : __t) +
'\n\n<p><a href="#parse"><b>Parse</b> your own code! --></a></p>\n\n<p>(devel)<a href="../test/SpecRunner.html">Specs</a></p> ';

}
return __p
};

this["shortjsdoc"]["method"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<h2>Method <a href="' +
((__t = ( this.makeLink(this.jsdoc) )) == null ? '' : __t) +
'">' +
((__t = ( this.jsdoc.name)) == null ? '' : __t) +
'</a></h2>\n\n<h3>Of class <a href="#class/' +
((__t = ( this.jsdoc.ownerClass )) == null ? '' : __t) +
'">' +
((__t = ( this.simpleName(this.jsdoc.ownerClass) )) == null ? '' : __t) +
'</a></h3>\n<h3>Parameters</h3>\n\n<ul>\n';
 var self = this, buffer = [];
_(this.jsdoc.params).each(function(param){
;
__p += '\n\t<li>\n\t\tname: ' +
((__t = ( param.name)) == null ? '' : __t) +
', type: ' +
((__t = ( self.printTypeAsString(param.type) )) == null ? '' : __t) +
'\n\t\t<span class="param-text">' +
((__t = ( param.text )) == null ? '' : __t) +
'</span>\n\t</li>\n\n';
 }); ;
__p += '\n</ul>\n\n';
 if (this.jsdoc.returns) { ;
__p += '\n<h3 class="returns-title">Returns</h3>\n' +
((__t = ( self.printTypeAsString(this.jsdoc.returns.type) )) == null ? '' : __t) +
'\n';
 if(this.jsdoc.returns.text){ ;
__p += '\n<p class="returns-text">' +
((__t = ( this.jsdoc.returns.text)) == null ? '' : __t) +
'</p>\n';
 } ;
__p += '\n';
 };


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

this["shortjsdoc"]["modules"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<h3><a href="#modules">Modules</a></h3>\n\n';
 var data = this.application.data; ;
__p += '\n<ul>\n';
 _(data.modules).each(function(moduleBody, moduleName) { ;
__p += '\n\t<li><a href="#module/' +
((__t = ( moduleName )) == null ? '' : __t) +
'">' +
((__t = ( moduleName )) == null ? '' : __t) +
'</a></li>\n';
 }); ;
__p += '\n</ul>\n';

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