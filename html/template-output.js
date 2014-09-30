this["shortjsdoc"] = this["shortjsdoc"] || {};

this["shortjsdoc"]["application"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="container">\n\t<div data-type="header-container"></div>\n\t<div data-type="main-view-container" class="main-view-container"></div>\n</div>';

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
__p += '\n\n<div class="row class-header">\n\t<div class="col-md-4">\n\t\t<h2 class="class-title">Class ' +
((__t = ( this.makeLink(this.jsdoc, true) )) == null ? '' : __t) +
'</h2>\n\t</div>\n\t<div class="col-md-4">\t\t\n\t\t';
 if (this.jsdoc.extends && this.jsdoc.absoluteName != this.jsdoc.extends.absoluteName) { ;
__p += '\n\t\t<h3 class="class-extends-title">Extends ' +
((__t = ( this.printTypeAsString(this.jsdoc.extends))) == null ? '' : __t) +
'</h3>\n\t\t';
 } ;
__p += '\n\t</div>\n\t<div class="col-md-4">\n\t\t<h3 class="class-module-title">Module ' +
((__t = ( this.makeLink(this.jsdoc.module, true) )) == null ? '' : __t) +
'</h3>\n\t</div>\n</div>\n\n\n<div class="pull-right"><a href="' +
((__t = ( this.makeLink(this.jsdoc) )) == null ? '' : __t) +
'?inherited=' +
((__t = ( this.options.inherited ? 0 : 1 )) == null ? '' : __t) +
'">' +
((__t = ( this.options.inherited ? 'Hide' : 'Show' )) == null ? '' : __t) +
' inherited properties</a></div>\n\n\n\n<h3>Class Summary</h3>\n';
 var template = this.application.templates.classSummary;;
__p += '\n' +
((__t = ( template.apply(this, arguments) )) == null ? '' : __t) +
'\n\n<div class="row">\n\n\t<div class="col-md-5">\n\n\n\n\t\t';
 if(this.jsdoc.constructors && this.jsdoc.constructors.length) { ;
__p += '\n\t\t<h3 class=\'methods\'>Constructors</h3>\n\t\t<ul>\n\t\t';

		_(this.jsdoc.constructors).each(function(method) { ;
__p += '\n\t\t' +
((__t = ( self.printMethod(method))) == null ? '' : __t) +
'\n\t\t\t<li class="constructor">\n\t\t\t\t';
 if(method.params && method.params.length) { ;
__p += '\n\t\t\t\tParameters:\n\t\t\t\t<ol class="params">\n\t\t\t\t\t';
 _(method.params).each(function(param){ ;
__p += '\n\t\t\t\t\t<li class="param">\n\t\t\t\t\t\t<span class="param-name">' +
((__t = ( param.name )) == null ? '' : __t) +
'</span>\n\t\t\t\t\t\t<span class="param-type">' +
((__t = ( self.printTypeAsString(param.type) )) == null ? '' : __t) +
'</span> \n\t\t\t\t\t</li>\n\t\t\t\t\t';
 }); ;
__p += '\n\t\t\t\t</ol>\n\t\t\t\t';
 } ;
__p += '\n\t\t\t</li>\n\t\t';
 }); ;
__p += '\n\t\t</ul>\n\t\t';
 } ;
__p += '\n\n\n\n\n\t\t';
 if(this.properties && _(this.properties).keys().length) { ;
__p += '\n\t\t<h3 class=\'properties\'>Properties</h3>\n\t\t<ul>\n\t\t';
 
		var self = this; 
		_(this.properties).each(function(p) { 
			var inherited = !JsDocMaker.classOwnsProperty(self.jsdoc, p); 
			//TODO: perform this in the view or plugin
			
			var inheritedByName = p.absoluteName.substring(0, p.absoluteName.lastIndexOf('.'));
			var inheritedBy = self.application.data.classes[inheritedByName] || {};
			
			;
__p += '\n\t\t\t<li class="property ' +
((__t = ( inherited ? 'inherited' : '' )) == null ? '' : __t) +
'">\n\t\t\t\t<a class=\'property-name\' href="#property/' +
((__t = ( p.absoluteName )) == null ? '' : __t) +
'">' +
((__t = ( p.name )) == null ? '' : __t) +
'</a>\n\t\t\t\t<span class="property-type">' +
((__t = ( self.printTypeAsString(p.type) )) == null ? '' : __t) +
'</span> \n\t\t\t\t' +
((__t = ( !inherited ? '' : ('(inherited by ' + self.printTypeAsString(inheritedBy) + ')') )) == null ? '' : __t) +
'\n\t\t\t</li>\n\t\t';
 }); ;
__p += '\n\t\t</ul>\n\t\t';
 } ;
__p += '\n\n\n\n\n\n\t\t';
 if(this.methods && _(this.methods).keys().length) { ;
__p += '\n\t\t<h3 class=\'methods\'>Methods</h3>\n\t\t<ul>\n\t\t';

		_(this.methods).each(function(method) { 
			var inherited = !JsDocMaker.classOwnsProperty(self.jsdoc, method); 
		;
__p += '\n\n\t\t\t<li class="method ' +
((__t = ( inherited ? 'inherited' : '' )) == null ? '' : __t) +
'">\n\t\t\t\t' +
((__t = ( self.makeLink(method, true))) == null ? '' : __t) +
'\n\t\t\t\t';
 if(method.params && method.params.length) { ;
__p += '\n\t\t\t\tParameters: \n\t\t\t\t<ol class="params">\n\t\t\t\t\t';
 _(method.params).each(function(param){ ;
__p += '\n\t\t\t\t\t<li class="param">\n\t\t\t\t\t\t<span class="param-name">' +
((__t = ( param.name )) == null ? '' : __t) +
'</span>: \n\t\t\t\t\t\t<span class="param-type">' +
((__t = ( self.printTypeAsString(param.type) )) == null ? '' : __t) +
'</span> \n\t\t\t\t\t</li>\n\t\t\t\t\t';
 }); ;
__p += '\n\t\t\t\t</ol>\n\t\t\t\t';
 } ;
__p += '\n\n\t\t\t\t<!-- TODO: do throw here ?  -->\n\n\t\t\t\t';
 if(method.returns && (method.returns.type || method.returns.text)) {;
__p += '\n\t\t\t\tReturns: ' +
((__t = ( self.printTypeAsString(method.returns.type) )) == null ? '' : __t) +
'\t\n\t\t\t\t<!-- <span class="returns-text">' +
((__t = ( method.returns.text || '')) == null ? '' : __t) +
'</span> -->\n\t\t\t\t';
 } ;
__p += '\n\t\t\t</li>\n\t\t';
 }); ;
__p += '\n\t\t</ul>\n\t\t';
 } ;
__p += '\n\n\n\n\n\t\t';
 if(this.jsdoc.events && _(this.jsdoc.events).keys().length) { ;
__p += '\n\t\t<h3 class=\'events\'>Events</h3>\n\t\t<ul>\n\t\t';
 
		var self = this; 
		_(this.jsdoc.events).each(function(p) { ;
__p += '\n\t\t\t<li class="event">\n\t\t\t\t<a class=\'event-name\' href="#event/' +
((__t = ( p.absoluteName )) == null ? '' : __t) +
'">' +
((__t = ( p.name )) == null ? '' : __t) +
'</a>\n\t\t\t</li>\n\t\t';
 }); ;
__p += '\n\t\t</ul>\n\t\t';
 } ;
__p += '\n\n\n\t</div>\n\n\t<div class="col-md-7">\n\n\t\t<div class="class-text">\n\t\t' +
((__t = ( this.jsdoc.textHtml || self.getTextHtml(this.jsdoc.text) || this.jsdoc.text || '' )) == null ? '' : __t) +
'\n\t\t</div>\n\n\t\t<div data-type="sources"></div>\n\n\t</div>\n</div>\n';

}
return __p
};

this["shortjsdoc"]["classSummary"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<span class="class-summary-extends">class ' +
((__t = ( this.makeLink(this.jsdoc, true) )) == null ? '' : __t) +
'\n';
 if (this.jsdoc.extends) { ;
__p += '\n\t<span class="class-summary-extends"><span class=" ">extends ' +
((__t = ( this.printTypeAsString(this.jsdoc.extends))) == null ? '' : __t) +
'</span>\n\t';
 } ;
__p += '\n';
 ;
__p += '\n<span class="class-summary-open">{</span>\n</span>\n\n';

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
'\n\n<p><a href="#parse"><b>Parse</b> your own code! --></a></p>\n\n<p>(devel)<a href="../test/SpecRunner.html">Specs</a></p> \n\n\n';

}
return __p
};

this["shortjsdoc"]["method"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 var self = this;;
__p += '\n\n\n\n<div class="row method-header">\n\t<div class="col-md-4">\n\t\t<h2 class="method-title">\n\t\t\t';
 if(this.isConstructor){ ;
__p += '\n\t\t\t<h2>Constructor</h2>\n\t\t\t';
 } else {;
__p += '\n\t\t\t<h2>Method&nbsp;<a href="' +
((__t = ( this.makeLink(this.jsdoc) )) == null ? '' : __t) +
'">' +
((__t = ( this.jsdoc.name)) == null ? '' : __t) +
'</a></h2>\n\t\t\t';
 } ;
__p += '\n\t\t</h2>\n\t</div>\n\t<div class="col-md-4">\n\t\t<h3>Of class <a href="#class/' +
((__t = ( this.jsdoc.ownerClass )) == null ? '' : __t) +
'">\n\t\t\t' +
((__t = ( this.simpleName(this.jsdoc.ownerClass) )) == null ? '' : __t) +
'</a>\n\t\t</h3>\n\t</div>\n\n\t<div class="col-md-4">\n\t\t<h3 class="class-module-title">Of Module ' +
((__t = ( this.makeLink(this.ownerClass.module, true) )) == null ? '' : __t) +
'</h3>\n\t</div>\n</div>\n\n\n\n\n\n\n\n<div class="row">\n\t<div class="col-md-4">\n\n\t\t';
 if( this.jsdoc.params.length ) { ;
__p += '\n\t\t<h3>Parameters</h3>\n\t\t';
 } ;
__p += '\n\n\t\t<ul class="parameter-list">\n\t\t';
 _(this.jsdoc.params).each(function(param) { ;
__p += '\n\t\t\t<li>\n\t\t\t\t' +
((__t = ( param.name)) == null ? '' : __t) +
': ' +
((__t = ( self.printTypeAsString(param.type) )) == null ? '' : __t) +
'\n\t\t\t\t<span class="param-text">' +
((__t = ( self.getTextHtml(param) )) == null ? '' : __t) +
'</span>\n\t\t\t</li>\n\n\t\t';
 }); ;
__p += '\n\t\t</ul>\n\n\n\n\t\t';
 if(!this.isConstructor) { ;
__p += '\n\t\t\t';
if (this.jsdoc.returns && (this.jsdoc.returns.type || this.jsdoc.returns.text) ) { ;
__p += '\n\t\t\t\t<h3 class="returns-title">Returns</h3>\n\t\t\t\t' +
((__t = ( self.printTypeAsString(this.jsdoc.returns.type) )) == null ? '' : __t) +
'\n\n\t\t\t\t';
 if(this.jsdoc.returns.text){ ;
__p += '\n\t\t\t\t\t<span class="returns-text">' +
((__t = ( self.getTextHtml(this.jsdoc.returns) )) == null ? '' : __t) +
'</span>\n\t\t\t\t';
 } ;
__p += '\n\n\t\t\t';
 };
__p += '\n\t\t';
 };
__p += '\n\n\n\n\n\t\t';
 if(this.jsdoc.throws && this.jsdoc.throws.length) { ;
__p += '\n\n\t\t<h3>Throws</h3>\n\n\t\t<ul class="throws-list">\n\t\t';
 _(this.jsdoc.throws).each(function(t) { ;
__p += '\n\t\t\t<li>\n\t\t\t\t' +
((__t = ( self.printTypeAsString(t.type) )) == null ? '' : __t) +
'\n\t\t\t\t<span class="param-text">' +
((__t = ( self.getTextHtml(t) )) == null ? '' : __t) +
'</span>\n\t\t\t</li>\n\t\t';
 }); ;
__p += '\n\t\t</ul>\n\n\t\t';
 } ;
__p += '\n\t</div>\n\n\n\n\t<div class="col-md-8">\n\t\t';
 if (this.jsdoc.text) { ;
__p += '\n\t\t<div class="method-text">\n\t\t\t' +
((__t = ( this.jsdoc.textHtml )) == null ? '' : __t) +
'\n\t\t</div>\n\n\t\t<div data-type="sources"></div>\n\t\t';
 } ;
__p += '\n\n\t</div>\n</div>\n\n\n';

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
'</h2>\n\n';
 if (this.jsdoc.text) { ;
__p += '\n<div class="method-text">\n\t' +
((__t = ( this.jsdoc.textHtml )) == null ? '' : __t) +
'\n</div>\n';
 };
__p += '\n\n<h3>Classes</h3>\n\n<ul class="classes">\n';
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