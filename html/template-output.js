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
'</h3>\n\t</div>\n</div>\n\n<div class="pull-right">&nbsp;&nbsp;<a href="' +
((__t = ( this.makeLink(this.jsdoc) )) == null ? '' : __t) +
'?noprivate=' +
((__t = ( this.options.noprivate ? 0 : 1 )) == null ? '' : __t) +
'">' +
((__t = ( this.options.noprivate ? 'Hide' : 'Show' )) == null ? '' : __t) +
' private properties</a></div>\n\n<div class="pull-right">&nbsp;&nbsp;<a href="' +
((__t = ( this.makeLink(this.jsdoc) )) == null ? '' : __t) +
'?inherited=' +
((__t = ( this.options.inherited ? 0 : 1 )) == null ? '' : __t) +
'">' +
((__t = ( this.options.inherited ? 'Hide' : 'Show' )) == null ? '' : __t) +
' inherited properties</a></div>\n\n<div class="pull-right">&nbsp;&nbsp;<a href="' +
((__t = ( this.makeLink(this.jsdoc) )) == null ? '' : __t) +
'?text=' +
((__t = ( this.options.text ? 0 : 1 )) == null ? '' : __t) +
'">' +
((__t = ( this.options.text ? 'Hide' : 'Show' )) == null ? '' : __t) +
' partial text</a></div>\n\n\n<!-- <h3>Summary</h3> -->\n';
 var template = this.application.templates.classSummary;;
__p += '\n' +
((__t = ( template.apply(this, arguments) )) == null ? '' : __t) +
'\n\n<div class="row">\n\n\t<div class="col-md-5">\n\n\n\n\t\t';
 if(this.jsdoc.constructors && this.jsdoc.constructors.length) { ;
__p += '\n\t\t<h3 class=\'methods\'>Constructors</h3>\n\t\t<ul>\n\t\t';

		_(this.jsdoc.constructors).each(function(method) { ;
__p += '\n\t\t' +
((__t = ( self.printMethod(method) )) == null ? '' : __t) +
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
'\n\t\t\t\t';
 if (self.options.text) {;
__p += ' <span class="partial-text">' +
((__t = ( self.makePartialText(p))) == null ? '' : __t) +
'</span>';
 };
__p += '\n\t\t\t</li>\n\t\t';
 }); ;
__p += '\n\t\t</ul>\n\t\t';
 } ;
__p += '\n\n\n\t\t';
 if(this.attributes && _(this.attributes).keys().length) { ;
__p += '\n\t\t<h3 class=\'attributes\'>attributes</h3>\n\t\t<ul>\n\t\t';
 
		var self = this; 
		_(this.attributes).each(function(p) { 
			var inherited = !JsDocMaker.classOwnsProperty(self.jsdoc, p); 
			//TODO: perform this in the view or plugin
			
			var inheritedByName = p.absoluteName.substring(0, p.absoluteName.lastIndexOf('.'));
			var inheritedBy = self.application.data.classes[inheritedByName] || {};
			
			;
__p += '\n\t\t\t<li class="attribute ' +
((__t = ( inherited ? 'inherited' : '' )) == null ? '' : __t) +
'">\n\t\t\t\t<a class=\'attribute-name\' href="#attribute/' +
((__t = ( p.absoluteName )) == null ? '' : __t) +
'">' +
((__t = ( p.name )) == null ? '' : __t) +
'</a>\n\t\t\t\t<span class="attribute-type">' +
((__t = ( self.printTypeAsString(p.type) )) == null ? '' : __t) +
'</span> \n\t\t\t\t' +
((__t = ( !inherited ? '' : ('(inherited by ' + self.printTypeAsString(inheritedBy) + ')') )) == null ? '' : __t) +
'\n\t\t\t\t';
 if (self.options.text) {;
__p += ' <span class="partial-text">' +
((__t = ( self.makePartialText(p))) == null ? '' : __t) +
'</span>';
 };
__p += '\n\t\t\t</li>\n\t\t';
 }); ;
__p += '\n\t\t</ul>\n\t\t';
 } ;
__p += '\n\n\n\n\t\t';
 if(this.events && _(this.events).keys().length) {;
__p += '\n\t\t<h3 class=\'events\'>Events</h3>\n\t\t<ul>\n\t\t';
 
		var self = this; 
		_(this.events).each(function(p) { 
			var inherited = !JsDocMaker.classOwnsProperty(self.jsdoc, p); 
			//TODO: perform this in the view or plugin
			
			var inheritedByName = p.absoluteName.substring(0, p.absoluteName.lastIndexOf('.'));
			var inheritedBy = self.application.data.classes[inheritedByName] || {};
			
			;
__p += '\n\t\t\t<li class="event ' +
((__t = ( inherited ? 'inherited' : '' )) == null ? '' : __t) +
'">\n\t\t\t\t<a class=\'event-name\' href="#event/' +
((__t = ( p.absoluteName )) == null ? '' : __t) +
'">' +
((__t = ( p.name )) == null ? '' : __t) +
'</a>\n\t\t\t\t<span class="event-type">' +
((__t = ( self.printTypeAsString(p.type) )) == null ? '' : __t) +
'</span> \n\t\t\t\t' +
((__t = ( !inherited ? '' : ('(inherited by ' + self.printTypeAsString(inheritedBy) + ')') )) == null ? '' : __t) +
'\n\t\t\t\t';
 if (self.options.text) {;
__p += ' <span class="partial-text">' +
((__t = ( self.makePartialText(p))) == null ? '' : __t) +
'</span>';
 };
__p += '\n\t\t\t</li>\n\t\t';
 }); ;
__p += '\n\t\t</ul>\n\t\t';
 } ;
__p += '\n\n\n\n\n\t\t';
 if(this.methods && _(this.methods).keys().length) { ;
__p += '\n\t\t<h3 class=\'methods\'>Methods</h3>\n\t\t<ul>\n\t\t';

		_(this.methods).each(function(method) { 
			var inherited = !JsDocMaker.classOwnsProperty(self.jsdoc, method); 			
			var inheritedByName = method.absoluteName.substring(0, method.absoluteName.lastIndexOf('.'));
			var inheritedBy = self.application.data.classes[inheritedByName] || {};
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
'</span> \n\t\t\t\t\t\t' +
((__t = ( !inherited ? '' : ('(inherited by ' + self.printTypeAsString(inheritedBy) + ')') )) == null ? '' : __t) +
'\n\t\t\t\t\t</li>\n\t\t\t\t\t';
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
__p += '\n\n\t\t\t\t';
 if (self.options.text) {;
__p += ' <span class="partial-text">' +
((__t = ( self.makePartialText(method))) == null ? '' : __t) +
'</span>';
 };
__p += '\n\t\t\t</li>\n\t\t';
 }); ;
__p += '\n\t\t</ul>\n\t\t';
 } ;
__p += '\n\n\n\n\n\n\t</div>\n\n\t<div class="col-md-7">\n\n\t\t';
 if(this.hierarchy && this.hierarchy.length>2) {;
__p += '\n\t\t<div class="class-hierarchy">\n\t\t<h3>Class Hierarchy</h3>\n\t\t<ul>\n\t\t';
 _(_(this.hierarchy).reverse()).each(function(c){ ;
__p += '\n\t\t\t<li>&gt;&nbsp;<a href="' +
((__t = ( self.makeLink(c))) == null ? '' : __t) +
'">' +
((__t = ( c.name )) == null ? '' : __t) +
'</a></li>\n\t\t';
 }); ;
__p += '\n\t\t</ul>\n\t\t</div>\n\t\t';
};
__p += '\n\n\t\t';
 if(this.knownSubclasses && this.knownSubclasses.length) {;
__p += '\n\t\t<!-- <button data-toggle="collapse" data-tagrget=".known-subclasses-list">collapse</button> -->\n\t\t<div class="known-subclasses">\n\t\t<h3>Known Subclasses</h3>\n\t\t<ul class="known-subclasses-list">\t\n\t\t';
 _(this.knownSubclasses).each(function(c){ ;
__p += '\n\t\t\t<li><a href="' +
((__t = ( self.makeLink(c))) == null ? '' : __t) +
'">' +
((__t = ( c.name )) == null ? '' : __t) +
'</a></li>\n\t\t';
 }); ;
__p += '\n\t\t</ul>\n\t\t</div>\n\t\t';
};
__p += '\n\n\t\t<p><a href="#search?keywords=' +
((__t = ( this.jsdoc.absoluteName)) == null ? '' : __t) +
'&propsReferencingType=1">Search Class Usage</a></p>\n\t\t\n\t\t';
 var summary_text = this.jsdoc.textHtml || self.getTextHtml(this.jsdoc.text) || this.jsdoc.text || ''; ;
__p += '\n\n\t\t';
 if(summary_text) {;
__p += '\n\t\t<h3>Summary</h3>\n\t\t\n\t\t<div class="class-text">\n\t\t' +
((__t = ( summary_text )) == null ? '' : __t) +
'\n\t\t</div>\n\t\t';
 } ;
__p += '\n\n\t\t<div data-type="sources"></div>\n\n\t</div>\n</div>\n';

}
return __p
};

this["shortjsdoc"]["classSummary"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<!-- <span class="class-summary-extends">class ' +
((__t = ( this.makeLink(this.jsdoc, true) )) == null ? '' : __t) +
'\n';
 if (this.jsdoc.extends) { ;
__p += '\n\t<span class="class-summary-extends"><span class=" ">extends ' +
((__t = ( this.printTypeAsString(this.jsdoc.extends))) == null ? '' : __t) +
'</span>\n\t';
 } ;
__p += ':\n<ul>\n\t -->\n</ul>\n</span>\n\n';

}
return __p
};

this["shortjsdoc"]["classes"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 var data = this.application.data; ;
__p += '\n\n<h3><a href="#classes">Classes</a></h3>\n\n\n<ul>\n';
 _(data.classes).each(function(c) { ;
__p += '\n\t<li><a href="#class/' +
((__t = ( c.absoluteName )) == null ? '' : __t) +
'">' +
((__t = ( c.name )) == null ? '' : __t) +
'</a></li>\n';
 }); ;
__p += '\n</ul>\n';

}
return __p
};

this["shortjsdoc"]["dependencies"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<p><input data-type="includeNativeClasses" type="checkbox" ' +
((__t = ( this.options.includeNativeClasses ? 'checked' : '')) == null ? '' : __t) +
'></input>\n\t' +
((__t = ( this.options.includeNativeClasses ? 'Include' : 'Don\'t include' )) == null ? '' : __t) +
' native classes</a></p>\n\n<p><input data-type="includeExtends" type="checkbox" ' +
((__t = ( this.options.includeExtends ? 'checked' : '')) == null ? '' : __t) +
'></input>\n\t' +
((__t = ( this.options.includeExtends ? 'Include' : 'Don\'t include' )) == null ? '' : __t) +
' inheritance</a></p>\n\n<p>The following is a graph showing dependencies between classes. A class A depends on a class B if any A property or method references the type B or contains an explicit dependency declaration to B using \'@depends class B\' : </p>\n\n<div class="loading-message">Calculating, please stand by...</div>\n\n<div data-type="dependency-graph"></div>';

}
return __p
};

this["shortjsdoc"]["file"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<h2>File ' +
((__t = ( this.jsdoc.fileName)) == null ? '' : __t) +
'</h2>\n<button data-action="donwload">Download</button>\n<pre class="prettyprint linenums">\n' +
((__t = ( this.fileContent )) == null ? '' : __t) +
'\n</pre>';

}
return __p
};

this["shortjsdoc"]["header"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 var metadata = this.application.data.projectMetadata; ;
__p += '\n<header class="main-header">\n<div class="row">\n\n\n<!-- <span class="col-lg-12 col-md-12 col-sm-12 col-xs-12"> -->\n<span class="col-sm-5 col-xs-12">\n\t<span class="dropdown">\n\t\t<button class="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown">\n\t\t' +
((__t = ( (metadata && metadata.name) ||  'short-jsdoc demo' )) == null ? '' : __t) +
'\n\t\t<span class="caret"></span>\n\t\t</button>\n\t\t<ul class="dropdown-menu" role="menu" aria-labelledby="dropdownMenu1">\n\t\t\t\n\t\t\t<li role="presentation"><a role="menuitem" href="#index">Index</a></li>\n\n\t\t\t<li role="presentation"><a role="menuitem" href="#tree">Full Abstract Syntax Tree</a></li>\t\n\n\t\t\t<li role="presentation"><a role="menuitem" href="#hierarchyTree">Class Hierarchy Tree</a></li>\t\n\n\t\t\t<li role="presentation"><a role="menuitem" href="#search?keywords=Array&propsReferencingType=1">Search type references</a></li>\n\n\t\t\t<li role="presentation"><a role="menuitem" href="#dependencies">Class Dependencies Graph</a></li>\t\n\n\t\t\t<li role="presentation"><a role="menuitem" href="#parse">Parse your code !</a></li>\n\n\t\t\t<li role="presentation" class="divider"></li>\n\n\t\t\t<li role="presentation"><a role="menuitem" href="https://github.com/cancerberoSgx/short-jsdoc">short-jsdoc home page</a></li>\n\t\t\t<li role="presentation"><a role="menuitem" href="../test/SpecRunner.html">Run short-jsdoc Specs</a></li>\n\n\t\t</ul>.\n\t\t\n\t</span>\t\t\n</span>\n\n<!-- <span class="col-lg-12 col-md-12 col-sm-12 col-xs-12"> -->\n<span class="col-sm-7 col-xs-12">\n\t<span class="main-search pull-right">\n\t<a role="menuitem" href="#index">Index</a>\n\t\tSearch <input class="typeahead1">\n\t</span>\t\t\n</span>\n\n\n</div>\n</header>';

}
return __p
};

this["shortjsdoc"]["hierarchytree"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 var data = this.application.data; ;
__p += '\n\n' +
((__t = ( data.projectMetadata && this.application.templates['project-metadata'].apply(this, arguments) )) == null ? '' : __t) +
'\n\n<h2>Class Hierarchy Tree</h2>\n\n<button data-action="expand-all">Expand all</button>\n\n<button data-action="collapse-all">Collapse all</button>\n\n<div class="the-tree"></div>\n';

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
((__t = ( data.projectMetadata && this.application.templates['project-metadata'].apply(this, arguments) )) == null ? '' : __t) +
'\n\n<p>Take a look at the <a href="#tree">Full Abstract Syntax Tree (AST) View</a></p>\n<p>Or to the <a href="#hierarchyTree">Full Class Hierarchy tree</a></p>\n\n' +
((__t = ( this.application.templates['modules'].apply(this, arguments) )) == null ? '' : __t) +
'\n\n' +
((__t = ( this.application.templates['classes'].apply(this, arguments) )) == null ? '' : __t) +
'\n\n\n\n\n';

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
 } else if(!this.isFunction) { ;
__p += '\n\t\t\t<h2>Method&nbsp;<a href="' +
((__t = ( this.makeLink(this.jsdoc) )) == null ? '' : __t) +
'">' +
((__t = ( this.jsdoc.name)) == null ? '' : __t) +
'</a></h2>\n\t\t\t';
 } else { ;
__p += '\n\t\t\t<h2>Function&nbsp;<a href="' +
((__t = ( this.makeLink(this.jsdoc) )) == null ? '' : __t) +
'">' +
((__t = ( this.jsdoc.name)) == null ? '' : __t) +
'</a></h2>\n\t\t\t';
 };
__p += '\n\t\t</h2>\n\t</div>\n\t<div class="col-md-4">\n\t\t';
 if(!this.isFunction){;
__p += '\n\t\t<h3>Of class <a href="#class/' +
((__t = ( this.jsdoc.ownerClass )) == null ? '' : __t) +
'">\n\t\t\t' +
((__t = ( this.simpleName(this.jsdoc.ownerClass, this.ownerModule) )) == null ? '' : __t) +
'</a>\n\t\t</h3>\n\t\t';
 } ;
__p += '\n\t</div>\n\n\t<div class="col-md-4">\n\t\t<h3 class="class-module-title">Of Module ' +
((__t = ( this.makeLink(this.ownerClass ? this.ownerClass.module : this.ownerModule, true) )) == null ? '' : __t) +
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
'\n\t\t</div>\n\t\t';
 } ;
__p += '\n\t\t\n\t\t<div data-type="sources"></div>\n\t</div>\n</div>\n\n\n';

}
return __p
};

this["shortjsdoc"]["module"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 
var self = this;
;
__p += '\n\n<h2 class="module-title">Module ' +
((__t = ( this.jsdoc.name)) == null ? '' : __t) +
'</h2>\n\n';
 if (this.jsdoc.text) { ;
__p += '\n<div class="method-text">\n\t' +
((__t = ( this.jsdoc.textHtml )) == null ? '' : __t) +
'\n</div>\n';
 };
__p += '\n\n<h3>Classes</h3>\n\n<ul class="classes">\n';
 _(this.classes).each(function(c) { ;
__p += '\n\t<li>\n\t\t<a class="module-class-name"href="#class/' +
((__t = ( c.absoluteName )) == null ? '' : __t) +
'">' +
((__t = ( c.name )) == null ? '' : __t) +
'</a>\t\t\n\n\t\t<ul class="module-class-properties-list">\n\t\t';
 _(c.methods).each(function(m){ ;
__p += '\n\t\t\t<li><a href="' +
((__t = ( self.makeLink(m))) == null ? '' : __t) +
'">' +
((__t = ( m.name)) == null ? '' : __t) +
'(), </a>\n\t\t';
}) ;
__p += '\n\t\t';
 _(c.properties).each(function(m){ ;
__p += '\n\t\t\t<li><a href="' +
((__t = ( self.makeLink(m))) == null ? '' : __t) +
'">' +
((__t = ( m.name)) == null ? '' : __t) +
', </a>\n\t\t';
}) ;
__p += '\n\t\t</ul>\n\t\t';
 _(c.attributes).each(function(m){ ;
__p += '\n\t\t\t<li><a href="' +
((__t = ( self.makeLink(m))) == null ? '' : __t) +
'">' +
((__t = ( m.name)) == null ? '' : __t) +
', </a>\n\t\t';
}) ;
__p += '\n\t\t</ul>\n\t</li>\n';
 }); ;
__p += '\n</ul>\n\n\n<h3>Functions</h3>\n<ul class="Functions">\n';
 _(this.jsdoc.functions).each(function(c) { ;
__p += '\n\t<li>\n\t\t<a class="module-function-name"href="#function/' +
((__t = ( c.absoluteName )) == null ? '' : __t) +
'">' +
((__t = ( c.name )) == null ? '' : __t) +
'</a>\t\t\n\n\t</li>\n';
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
__p += '<div class="modules">\n\n<h3><a href="#modules">Modules</a></h3>\n\n';
 var data = this.application.data; 
var self = this; ;
__p += '\n<ul class="modules-list">\n';
 _(data.modules).each(function(moduleBody, moduleName) { ;
__p += '\n\t<li class="modules-module"><a class=\'module-name\' href="#module/' +
((__t = ( moduleName )) == null ? '' : __t) +
'">' +
((__t = ( moduleName )) == null ? '' : __t) +
'</a>\n\t\t<ul class="modules-classes-list">\n\t\t';
 
		/* TODO: make a view */
		var moduleClasses = self.getModuleClasses(moduleName, self.application.data); 
		_(moduleClasses).each(function(c) { ;
__p += '\n\t\t\t<li class="modules-class"><a class=\'class-name\' href="#class/' +
((__t = ( c.absoluteName )) == null ? '' : __t) +
'">' +
((__t = ( c.name )) == null ? '' : __t) +
'</a>, </li>\n\t\t';
 }); ;
__p += '\n\t\t</ul>\n\t</li>\n';
 }); ;
__p += '\n</ul>\n\n</div>';

}
return __p
};

this["shortjsdoc"]["parse"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<h2>Parse your code online!</h2>\n<p>Please paste your commeted code in the following area and it will be loaded automatically. </p>\n<textarea data-type="inputcode">\n//@module life @class Living Any living thing\n//@class Tree A tree is a living thing that contains some leafs and grow. \n//@extends Living \nfunction Tree(){}\n/**@method growLeaf makes the given leaf to gro a little more. @param {Leaf} leaf*/\nTree.prototype.growLeaf = function(leaf){}\n/*@class Apple a sweet fruit @module Life @extend Fruit grows in trees and can be eaten @module Life */ \nfunction Apple(){}\n//@module Mineral @class Stone \n//@method doShadow @param {Rectangle} shadowSize @return {Shadow} the new Shadow\n//@class Shadow @module Ideal\n//@class Good @module Ideal\n</textarea>\n<input type="checkbox" data-action="clean" >Clean previous data ?</input>\n<button data-action="inputcode_doit">do it</button>\n';

}
return __p
};

this["shortjsdoc"]["project-metadata"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 var metaData = this.application.data.projectMetadata; ;
__p += '\n\n<p>Project ' +
((__t = ( metaData.name)) == null ? '' : __t) +
' contains #' +
((__t = ( _(this.application.data.modules).keys().length )) == null ? '' : __t) +
' modules and #' +
((__t = ( _(this.application.data.classes).keys().length )) == null ? '' : __t) +
' classes.</p>\n\n<dl class="dl-horizontal">\n\t';
 _(metaData).each(function(value, name) { 
		if(_(['name', 'description', 'author', 'license', 'version']).contains(name)) { ;
__p += '\n\t<dt class="metadata-name">' +
((__t = ( name)) == null ? '' : __t) +
'</dt><dd class="metadata-value">' +
((__t = ( _(value).isString() ? value : JSON.stringify(value))) == null ? '' : __t) +
'</dd>\n\t';
 } } ); ;
__p += '\n</dl>\n';

}
return __p
};

this["shortjsdoc"]["property"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<h2>' +
((__t = ( this.propertyLabel )) == null ? '' : __t) +
'&nbsp;<a href="' +
((__t = ( this.makeLink(this.jsdoc) )) == null ? '' : __t) +
'">' +
((__t = ( this.jsdoc.name)) == null ? '' : __t) +
'</a></h2>\n\n<h3>Of class <a href="#class/' +
((__t = ( this.jsdoc.ownerClass )) == null ? '' : __t) +
'">\n\t' +
((__t = ( this.simpleName(this.jsdoc.ownerClass, this.ownerModule) )) == null ? '' : __t) +
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

this["shortjsdoc"]["search"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<h2>Query:</h2>\n\n<form data-type="search-form">\n\t<p>Keywords: <input name="keywords" value="' +
((__t = (this.query.keywords)) == null ? '' : __t) +
'"></input></p>\n\t<p><input name="propsReferencingType" type="checkbox" ' +
((__t = ( this.query.propsReferencingType ? 'checked' : '' )) == null ? '' : __t) +
' value="' +
((__t = (this.query.keywords)) == null ? '' : __t) +
'"></input> properties referencing given type name</p>\n\t<button data-action="search">Search</button>\n</form>\n\n<h2>Results</h2>\n\n<p>' +
((__t = ( this.results ? '' : 'Searching... please wait.')) == null ? '' : __t) +
'</p>\n<ul>\n';
_(this.results).each(function(result) { ;
__p += '\n\t<li> <a href="' +
((__t = ( result.url )) == null ? '' : __t) +
'"> ' +
((__t = ( result.label )) == null ? '' : __t) +
' </a> </li>\n';
 }); ;
__p += '\n</ul>';

}
return __p
};

this["shortjsdoc"]["sources"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<h3>Sources <button data-type="goto-source" class="btn btn-link ">goto def</button></h3>\n<p>File <a href="#file/' +
((__t = ( this.fileNameUrl )) == null ? '' : __t) +
'">' +
((__t = ( this.jsdoc.fileName )) == null ? '' : __t) +
'</a></p>\n<pre class="prettyprint linenums">' +
__e( this.sourceSubset ) +
'</pre>';

}
return __p
};

this["shortjsdoc"]["tree"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 var data = this.application.data; ;
__p += '\n\n' +
((__t = ( data.projectMetadata && this.application.templates['project-metadata'].apply(this, arguments) )) == null ? '' : __t) +
'\n\n<h2>Abstract Syntax Tree</h2>\n\n<p>From modules to classes and properties...</p>\n\n<button data-action="expand-all">Expand all</button>\n\n<button data-action="collapse-all">Collapse all</button>\n\n<div class="the-tree"></div>\n';

}
return __p
};

this["shortjsdoc"]["typeaheadSuggestion"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class="suggestion suggestion-' +
((__t = ( node.annotation)) == null ? '' : __t) +
'">\n\t<span class="suggestion-value">' +
((__t = ( value)) == null ? '' : __t) +
'</span>&nbsp;<span class="suggestion-type suggestion-type-' +
((__t = ( node.annotation)) == null ? '' : __t) +
'">(' +
((__t = ( node.annotation)) == null ? '' : __t) +
'\n\t';
 if(_(['property', 'method', 'attribute', 'event']).contains(node.annotation)) {;
__p += '\n\tof class ' +
((__t = ( node.ownerClass)) == null ? '' : __t) +
'\n\t';
 };
__p += ')\n\t</span>\n</div>';

}
return __p
};