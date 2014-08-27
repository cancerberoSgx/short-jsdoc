this["shortjsdoc"] = this["shortjsdoc"] || {};

this["shortjsdoc"]["application"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="container">\n\t<div data-type="header-container"></div>\n\t<div data-type="main-view-container"></div>\n</div>';

}
return __p
};

this["shortjsdoc"]["class"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 
var self = this; 
;
__p += '\n\n<h2 class="class-title">Class ' +
((__t = ( this.makeLink(this.jsdoc, true) )) == null ? '' : __t) +
'</h2>\n\n<h3 class="class-module-title">Module ' +
((__t = ( this.makeLink(this.jsdoc.module, true) )) == null ? '' : __t) +
'</h3>\n\n';
 if (this.jsdoc.extends) { ;
__p += '\n<h3 class="class-extends-title">Extends ' +
((__t = ( this.printTypeAsString(this.jsdoc.extends))) == null ? '' : __t) +
'</h3>\n';
 } ;
__p += '\n\n<p class="class-text">' +
((__t = ( this.jsdoc.textHtml || this.jsdoc.text || '' )) == null ? '' : __t) +
'</p>\n\n<h3 class=\'methods\'>Constructors</h3>\n<ul>\n';

_(this.jsdoc.constructors).each(function(method) { ;
__p += '\n' +
((__t = ( self.printMethod(method))) == null ? '' : __t) +
'\n\t<li class="constructor">\n\t\t<!-- TODO: make link and constructor router -->\n\t\t<!-- ' +
((__t = ( self.makeLink(method, true))) == null ? '' : __t) +
'  -->\n\t\t';
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
__p += '\n\t</li>\n';
 }); ;
__p += '\n</ul>\n\n\n<h3 class=\'properties\'>Properties</h3>\n<ul>\n';
 
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
__p += '\n</ul>\n\n<h3 class=\'methods\'>Methods</h3>\n<ul>\n';

_(this.jsdoc.methods).each(function(method) { ;
__p += '\n\t<li class="method">\n\t\t' +
((__t = ( self.makeLink(method, true))) == null ? '' : __t) +
'\n\t\t';
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
__p += '\n\n\t\t<h4 class="returns-title">Returns ' +
((__t = ( self.printTypeAsString(method.returns.type) )) == null ? '' : __t) +
'</h4>\n\t\t<div class="returns-text">' +
((__t = ( method.returns.text || '')) == null ? '' : __t) +
'</div>\n\t</li>\n';
 }); ;
__p += '\n</ul>\n\n\n<h3 class=\'events\'>Events</h3>\n<ul>\n';
 
var self = this; 
_(this.jsdoc.events).each(function(p) { ;
__p += '\n\t<li class="event">\n\t\t<a class=\'event-name\' href="#event/' +
((__t = ( p.absoluteName )) == null ? '' : __t) +
'">' +
((__t = ( p.name )) == null ? '' : __t) +
'</a>\n\t</li>\n';
 }); ;
__p += '\n</ul>\n\n\n<div data-type="sources"></div>';

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
__p += '<header class="main-header">\n\t<div class="row">\n\n\t\t<!-- <span class="col-lg-12 col-md-12 col-sm-12 col-xs-12"> -->\n\t\t<span class="col-sm-5 col-xs-12">\n\t\t\t<span class="dropdown">\n\t\t\t\t<button class="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown">\n\t\t\t\tshort-jsdoc demo\n\t\t\t\t<span class="caret"></span>\n\t\t\t\t</button>\n\t\t\t\t<ul class="dropdown-menu" role="menu" aria-labelledby="dropdownMenu1">\n\t\t\t\t\t<li role="presentation"><a role="menuitem" tabindex="-1" href="#index">Index</a></li>\n\t\t\t\t\t<li role="presentation" class="divider"></li>\n\t\t\t\t\t<li role="presentation"><a role="menuitem" tabindex="-1" href="https://github.com/cancerberoSgx/short-jsdoc">short-jsdoc home page</a></li>\n\t\t\t\t</ul>.\n\t\t\t\t\n\t\t\t</span>\t\t\n\t\t</span>\n\n\t\t<!-- <span class="col-lg-12 col-md-12 col-sm-12 col-xs-12"> -->\n\t\t<span class="col-sm-7 col-xs-12">\n\t\t\t<span class="main-search pull-right">\n\t\t\t<a role="menuitem" tabindex="-1" href="#index">Index</a>\n\t\t\t\tSearch <input class="typeahead1">\n\t\t\t</span>\t\t\n\t\t</span>\n\n\n\t</div>\n\n</header>';

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

 if(this.isConstructor){;
__p += '\n<h2>Constructor</h2>\n';
 } else {;
__p += '\n<h2>Method&nbsp;<a href="' +
((__t = ( this.makeLink(this.jsdoc) )) == null ? '' : __t) +
'">' +
((__t = ( this.jsdoc.name)) == null ? '' : __t) +
'</a></h2>\n';
 } ;
__p += '\n\n\n<h3>Of class <a href="#class/' +
((__t = ( this.jsdoc.ownerClass )) == null ? '' : __t) +
'">\n\t' +
((__t = ( this.simpleName(this.jsdoc.ownerClass) )) == null ? '' : __t) +
'</a>\n</h3>\n\n';
 if (this.jsdoc.text) { ;
__p += '\n<div class="method-text">\n\t' +
((__t = ( this.jsdoc.textHtml )) == null ? '' : __t) +
'\n</div>\n';
 } ;
__p += '\n\n<h3>Parameters</h3>\n\n<ul>\n';
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
 if(!this.isConstructor){;
__p += '\n\t';
 if (this.jsdoc.returns) { ;
__p += '\n\t\t<h3 class="returns-title">Returns</h3>\n\t\t' +
((__t = ( self.printTypeAsString(this.jsdoc.returns.type) )) == null ? '' : __t) +
'\n\n\t\t';
 if(this.jsdoc.returns.text){ ;
__p += '\n\t\t\t<p class="returns-text">' +
((__t = ( this.jsdoc.returns.text)) == null ? '' : __t) +
'</p>\n\t\t';
 } ;
__p += '\n\n\t';
 };
__p += '\n';
 };
__p += '\n\n\n<div data-type="sources"></div>';

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

this["shortjsdoc"]["property"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<h2>' +
((__t = ( this.isEvent ? 'Event' : 'Property' )) == null ? '' : __t) +
'&nbsp;<a href="' +
((__t = ( this.makeLink(this.jsdoc) )) == null ? '' : __t) +
'">' +
((__t = ( this.jsdoc.name)) == null ? '' : __t) +
'</a></h2>\n\n<h3>Of class <a href="#class/' +
((__t = ( this.jsdoc.ownerClass )) == null ? '' : __t) +
'">\n\t' +
((__t = ( this.simpleName(this.jsdoc.ownerClass) )) == null ? '' : __t) +
'</a>\n</h3>\n\n';
 if (this.jsdoc.text) { ;
__p += '\n<div class="method-text">\n\t' +
((__t = ( this.jsdoc.textHtml )) == null ? '' : __t) +
'\n</div>\n';
 } ;
__p += '\n\n\n<h3 class="returns-type">Type</h3>\n' +
((__t = ( this.printTypeAsString(this.jsdoc.type) )) == null ? '' : __t) +
'\n\n\n<div data-type="sources"></div>';

}
return __p
};

this["shortjsdoc"]["sources"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<h3>Sources <button data-type="goto-source" class="btn btn-link ">goto def</button></h3>\n\n<pre class="prettyprint linenums">' +
__e( this.sourceSubset ) +
'</pre>';

}
return __p
};