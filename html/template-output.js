this["shortjsdoc"] = this["shortjsdoc"] || {};

this["shortjsdoc"]["application"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '  <div class="container">\r\n\t<div data-type="header-container"></div>\r\n\t<div data-type="main-view-container" class="main-view-container"></div>\r\n</div>';

}
return __p
};

this["shortjsdoc"]["book"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 
var self = this;
var data = this.application.data; 
data.projectMetadata = data.projectMetadata || {}; 
;
__p += '\r\n\r\n\r\n<div class="pull-right">&nbsp;&nbsp;<a href="' +
((__t = ( this.makeLink('book', false, {private: this.options.private ? 0 : 1}) )) == null ? '' : __t) +
'">\r\n' +
((__t = ( this.options.private ? 'Show' : 'Hide' )) == null ? '' : __t) +
' private classes</a></div> \r\n\r\n\r\n<h1>' +
((__t = ( data.projectMetadata.name + ' API Reference')) == null ? '' : __t) +
'</h2>\r\n<p><strong>' +
((__t = ( 'Version ' + data.projectMetadata.version )) == null ? '' : __t) +
'</strong></p>\r\n<p>' +
((__t = ( data.projectMetadata.description )) == null ? '' : __t) +
'</p>\r\n\r\n\r\n' +
((__t = ( data.projectMetadata.name && this.application.templates['project-metadata'].apply(this, arguments) )) == null ? '' : __t) +
'\r\n\r\n\r\n<h1>Index</h1>\r\n\r\n<ul class="index-modules">\r\n';
 _.each(self.modules, function(module) { ;
__p += '\r\n\r\n\t<li><a href="#module-' +
((__t = ( module.name)) == null ? '' : __t) +
'">Module ' +
((__t = ( module.name)) == null ? '' : __t) +
'</a>\r\n\t\t<ul class="index-modules-classes">\r\n\t\t\t';
 var moduleClasses = self.getModuleClasses(module.name, self.application.data); 
			_(moduleClasses).each(function(c) { ;
__p += '\r\n\t\t\t\t<li><a class=\'class-name\' href="#class-' +
((__t = ( c.absoluteName)) == null ? '' : __t) +
'">' +
((__t = ( c.annotation)) == null ? '' : __t) +
' ' +
((__t = ( c.name )) == null ? '' : __t) +
'</a></li>\r\n\t\t\t';
 }); ;
__p += '\r\n\t\t</ul>\r\n\t</li>\r\n';
 });
__p += '\r\n\r\n</ul>\r\n\r\n\r\n\r\n';
 _.each(self.modules, function(module) { ;
__p += '\r\n<br/><br/><br/>\r\n<div class="book-module">\r\n\t<h1 id="module-' +
((__t = ( module.name )) == null ? '' : __t) +
'">Module ' +
((__t = ( module.name)) == null ? '' : __t) +
'</h1>\r\n\t<p>' +
((__t = ( self.getTextHtml(module) )) == null ? '' : __t) +
' </p>\r\n\r\n\t';
 var moduleClasses = self.getModuleClasses(module.name, self.application.data); 
	_(moduleClasses).each(function(c) { ;
__p += '\r\n\t\t<br/><br/>\r\n\t\t<div class="book-class" id="class-' +
((__t = ( c.absoluteName )) == null ? '' : __t) +
'" data-class="' +
((__t = ( c.absoluteName)) == null ? '' : __t) +
'"></div>\r\n\t';
 }); ;
__p += '\r\n</div>\r\n';
 });
__p += '\r\n\r\n';

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
__p += '\r\n\r\n<div class="row class-header">\r\n\t<div class="col-md-4">\r\n\t\t<h2 class="class-title">' +
((__t = ( this.isInterface?'Interface':'Class')) == null ? '' : __t) +
' ' +
((__t = ( this.makeLink(this.jsdoc, true) )) == null ? '' : __t) +
'</h2>\r\n\t</div>\r\n\t<div class="col-md-4">\t\t\r\n\t\t';
 if (this.jsdoc.extends && this.jsdoc.absoluteName != this.jsdoc.extends.absoluteName && !(this.isInterface && this.jsdoc.extends.name==='Object')) { ;
__p += '\r\n\t\t<h3 class="class-extends-title">Extends ' +
((__t = ( this.printTypeAsString(this.jsdoc.extends))) == null ? '' : __t) +
'</h3>\r\n\t\t';
 } ;
__p += '\r\n\t</div>\r\n\t<div class="col-md-4">\r\n\t\t<h3 class="class-module-title">Module ' +
((__t = ( this.makeLink(this.jsdoc.module, true) )) == null ? '' : __t) +
'</h3>\r\n\t</div>\r\n</div>\r\n\r\n\r\n';
 if(!self.options.dontShowOptions) { ;
__p += '\r\n<div class="pull-right">&nbsp;&nbsp;<a href="' +
((__t = ( this.makeLink(this.jsdoc, false, {private: this.options.private ? 0 : 1}) )) == null ? '' : __t) +
'">\r\n' +
((__t = ( this.options.private ? 'Show' : 'Hide' )) == null ? '' : __t) +
' private properties</a></div> \r\n\r\n<div class="pull-right">&nbsp;&nbsp;<a href="' +
((__t = ( this.makeLink(this.jsdoc, false, {inherited: this.options.inherited ? 0 : 1}) )) == null ? '' : __t) +
'">\r\n' +
((__t = ( this.options.inherited ? 'Hide' : 'Show' )) == null ? '' : __t) +
' inherited properties</a></div>\r\n\r\n<div class="pull-right">&nbsp;&nbsp;<a href="' +
((__t = ( this.makeLink(this.jsdoc, false, {text: this.options.text ? 0 : 1}) )) == null ? '' : __t) +
'">\r\n' +
((__t = ( this.options.text ? 'Hide' : 'Show' )) == null ? '' : __t) +
' partial text</a></div>\r\n';
 } /* if(!self.options.dontShowOptions) */;
__p += '\r\n\r\n\r\n';
 if(this.jsdoc.implements&&this.jsdoc.implements.length) { ;
__p += '\r\n<div class="row"><br/>\r\n<div class="col-md-12">Implements: <ul>\r\n';
 _.each(this.jsdoc.implements, function(interface){;
__p += '\r\n\t<li>' +
((__t = ( self.makeLink(interface, true, {text: self.options.text ? 0 : 1}) )) == null ? '' : __t) +
'</li>\r\n';
 });;
__p += '\r\n</ul>\r\n</div>\r\n</div>\r\n';
 };
__p += '\r\n\r\n\r\n<div class="row">\r\n\r\n\r\n';
 if(!self.options.dontShowSidebar) {;
__p += '\r\n\t<div class="col-md-5">\r\n\r\n\r\n\r\n\t\t';
 if(this.jsdoc.constructors && this.jsdoc.constructors.length) { ;
__p += '\r\n\t\t<h3 class=\'methods\'>Constructors</h3>\r\n\t\t<ul>\r\n\t\t';

		_(this.jsdoc.constructors).each(function(method) { ;
__p += '\r\n\t\t' +
((__t = ( self.printMethod(method) )) == null ? '' : __t) +
'\r\n\t\t\t<li class="constructor">\r\n\t\t\t\t';
 if(method.params && method.params.length) { ;
__p += '\r\n\t\t\t\tParameters:\r\n\t\t\t\t<ol class="params">\r\n\t\t\t\t\t';
 _(method.params).each(function(param){ ;
__p += '\r\n\t\t\t\t\t<li class="param">\r\n\t\t\t\t\t\t<span class="param-name">' +
((__t = ( param.name )) == null ? '' : __t) +
'</span>\r\n\t\t\t\t\t\t<span class="param-type">' +
((__t = ( self.printTypeAsString(param.type) )) == null ? '' : __t) +
'</span> \r\n\t\t\t\t\t</li>\r\n\t\t\t\t\t';
 }); ;
__p += '\r\n\t\t\t\t</ol>\r\n\t\t\t\t';
 } ;
__p += '\r\n\t\t\t</li>\r\n\t\t';
 }); ;
__p += '\r\n\t\t</ul>\r\n\t\t';
 } ;
__p += '\r\n\r\n\r\n\r\n\r\n\t\t';
 if(this.properties && _(this.properties).keys().length) { ;
__p += '\r\n\t\t<h3 class=\'properties\'>Properties</h3>\r\n\t\t<ul>\r\n\t\t';
 
		var self = this; 
		_(this.properties).each(function(p) { 
			var inherited = !JsDocMaker.classOwnsProperty(self.jsdoc, p); 
			//TODO: perform this in the view or plugin
			
			var inheritedByName = p.absoluteName.substring(0, p.absoluteName.lastIndexOf('.'));
			var inheritedBy = self.application.data.classes[inheritedByName] || {};
			
			;
__p += '\r\n\t\t\t<li class="property ' +
((__t = ( inherited ? 'inherited' : '' )) == null ? '' : __t) +
'">\r\n\t\t\t\t<a class=\'property-name\' href="#property/' +
((__t = ( p.absoluteName )) == null ? '' : __t) +
'">' +
((__t = ( p.name )) == null ? '' : __t) +
'</a>\r\n\t\t\t\t<span class="property-type">' +
((__t = ( self.printTypeAsString(p.type) )) == null ? '' : __t) +
'</span> \r\n\t\t\t\t' +
((__t = ( !inherited ? '' : ('(inherited by ' + self.printTypeAsString(inheritedBy) + ')') )) == null ? '' : __t) +
'\r\n\t\t\t\t';
 if (self.options.text) {;
__p += ' <span class="partial-text">' +
((__t = ( self.makePartialText(p))) == null ? '' : __t) +
'</span>';
 };
__p += '\r\n\t\t\t</li>\r\n\t\t';
 }); ;
__p += '\r\n\t\t</ul>\r\n\t\t';
 } ;
__p += '\r\n\r\n\r\n\t\t';
 if(this.attributes && _(this.attributes).keys().length) { ;
__p += '\r\n\t\t<h3 class=\'attributes\'>attributes</h3>\r\n\t\t<ul>\r\n\t\t';
 
		var self = this; 
		_(this.attributes).each(function(p) { 
			var inherited = !JsDocMaker.classOwnsProperty(self.jsdoc, p); 
			//TODO: perform this in the view or plugin
			
			var inheritedByName = p.absoluteName.substring(0, p.absoluteName.lastIndexOf('.'));
			var inheritedBy = self.application.data.classes[inheritedByName] || {};
			
			;
__p += '\r\n\t\t\t<li class="attribute ' +
((__t = ( inherited ? 'inherited' : '' )) == null ? '' : __t) +
'">\r\n\t\t\t\t<a class=\'attribute-name\' href="#attribute/' +
((__t = ( p.absoluteName )) == null ? '' : __t) +
'">' +
((__t = ( p.name )) == null ? '' : __t) +
'</a>\r\n\t\t\t\t<span class="attribute-type">' +
((__t = ( self.printTypeAsString(p.type) )) == null ? '' : __t) +
'</span> \r\n\t\t\t\t' +
((__t = ( !inherited ? '' : ('(inherited by ' + self.printTypeAsString(inheritedBy) + ')') )) == null ? '' : __t) +
'\r\n\t\t\t\t';
 if (self.options.text) {;
__p += ' <span class="partial-text">' +
((__t = ( self.makePartialText(p))) == null ? '' : __t) +
'</span>';
 };
__p += '\r\n\t\t\t</li>\r\n\t\t';
 }); ;
__p += '\r\n\t\t</ul>\r\n\t\t';
 } ;
__p += '\r\n\r\n\t\t';
 if(this.events_ && _(this.events_).keys().length) {;
__p += '\r\n\t\t<h3 class=\'events\'>Events</h3>\r\n\t\t<ul>\r\n\t\t';
 
		var self = this; 
		_(this.events_).each(function(p) { 
			var inherited = !JsDocMaker.classOwnsProperty(self.jsdoc, p); 
			//TODO: perform this in the view or plugin
			
			var inheritedByName = p.absoluteName.substring(0, p.absoluteName.lastIndexOf('.'));
			var inheritedBy = self.application.data.classes[inheritedByName] || {};
			
			;
__p += '\r\n\t\t\t<li class="event ' +
((__t = ( inherited ? 'inherited' : '' )) == null ? '' : __t) +
'">\r\n\t\t\t\t<a class=\'event-name\' href="#event/' +
((__t = ( p.absoluteName )) == null ? '' : __t) +
'">' +
((__t = ( p.name )) == null ? '' : __t) +
'</a>\r\n\t\t\t\t<span class="event-type">' +
((__t = ( self.printTypeAsString(p.type) )) == null ? '' : __t) +
'</span> \r\n\t\t\t\t' +
((__t = ( !inherited ? '' : ('(inherited by ' + self.printTypeAsString(inheritedBy) + ')') )) == null ? '' : __t) +
'\r\n\t\t\t\t';
 if (self.options.text) {;
__p += ' <span class="partial-text">' +
((__t = ( self.makePartialText(p))) == null ? '' : __t) +
'</span>';
 };
__p += '\r\n\t\t\t</li>\r\n\t\t';
 }); ;
__p += '\r\n\t\t</ul>\r\n\t\t';
 } ;
__p += '\r\n\r\n\r\n\r\n\r\n\t\t';
 if(this.methods && _(this.methods).keys().length) { ;
__p += '\r\n\t\t<h3 class=\'methods\'>Methods</h3>\r\n\t\t<ul>\r\n\t\t';

		_(this.methods).each(function(method) { 
			var inherited = !JsDocMaker.classOwnsProperty(self.jsdoc, method); 			
			var inheritedByName = method.absoluteName.substring(0, method.absoluteName.lastIndexOf('.'));
			var inheritedBy = self.application.data.classes[inheritedByName] || {};
		;
__p += '\r\n\r\n\t\t\t<li class="method ' +
((__t = ( inherited ? 'inherited' : '' )) == null ? '' : __t) +
'">\r\n\r\n\t\t\t\t<!-- method name -->\r\n\t\t\t\t<span class="method-name">' +
((__t = ( self.makeLink(method, true))) == null ? '' : __t) +
'</span>\r\n\r\n\r\n\t\t\t\t<!-- method params  -->\r\n\t\t\t\t<span class="method-param-decorator">(</span>\r\n\t\t\t\t';
 if(method.params && method.params.length) { ;
__p += '\r\n\t\t\t\t<ol class="params">\r\n\t\t\t\t\t';
 
					for(var paramIndex = 0; paramIndex < method.params.length; paramIndex++) {
						var param = method.params[paramIndex];
					;
__p += '\r\n\t\t\t\t\t<li class="param">\r\n\t\t\t\t\t\t<span class="param-type">' +
((__t = ( self.printTypeAsString(param.type) )) == null ? '' : __t) +
'</span> \r\n\t\t\t\t\t\t<span class="param-name">' +
((__t = ( param.name )) == null ? '' : __t) +
'</span>\r\n\t\t\t\t\t\t';
 if(paramIndex < method.params.length-1) { ;
__p += '\r\n\t\t\t\t\t\t<span class="method-param-decorator">,</span>\r\n\t\t\t\t\t\t';
 } ;
__p += '\r\n\t\t\t\t\t</li>\r\n\t\t\t\t\t';
 } ;
__p += '\r\n\t\t\t\t</ol>\r\n\t\t\t\t';
 } ;
__p += '\r\n\t\t\t\t<span class="method-param-decorator">)&nbsp;:&nbsp;</span>\r\n\r\n\r\n\t\t\t\t<!-- method return type -->\r\n\t\t\t\t';
 if(method.returns && (method.returns.type || method.returns.text)) {;
__p += '\r\n\t\t\t\t<span class="method-return">' +
((__t = ( self.printTypeAsString(method.returns.type) )) == null ? '' : __t) +
'</span>\r\n\t\t\t\t<!-- <span class="returns-text">' +
((__t = ( method.returns.text || '')) == null ? '' : __t) +
'</span> -->\r\n\t\t\t\t';
 } else {;
__p += '\r\n\t\t\t\tvoid\r\n\t\t\t\t';
 } ;
__p += '\r\n\r\n\r\n\t\t\t\t<!-- method inherited by  -->\r\n\t\t\t\t' +
((__t = ( !inherited ? '' : ('(inherited by ' + self.printTypeAsString(inheritedBy) + ')') )) == null ? '' : __t) +
'\r\n\r\n\t\t\t\t\r\n\r\n\t\t\t\t<!-- TODO: do throw here ?  -->\r\n\t\t\t\t\r\n\t\t\t\t<!-- method description -->\r\n\t\t\t\t';
 if (self.options.text) {;
__p += ' <span class="partial-text">' +
((__t = ( self.makePartialText(method))) == null ? '' : __t) +
'</span>';
 };
__p += '\r\n\t\t\t</li>\r\n\t\t';
 }); ;
__p += '\r\n\t\t</ul>\r\n\t\t';
 } ;
__p += '\r\n\r\n\r\n\r\n\r\n\r\n\t</div>\r\n\r\n\r\n';
 } /*if(!self.options.dontShowSidebar)*/ ;
__p += '\r\n\r\n\r\n\t<div class="' +
((__t = ( self.options.dontShowSidebar ? 'col-md-12' : 'col-md-7' )) == null ? '' : __t) +
'">\r\n\r\n\t\t';
 if(this.hierarchy && this.hierarchy.length>2) {;
__p += '\r\n\t\t<div class="class-hierarchy">\r\n\t\t<h3>Class Hierarchy</h3>\r\n\t\t<ul>\r\n\t\t';
 _(_(this.hierarchy).reverse()).each(function(c){ ;
__p += '\r\n\t\t\t<li>&gt;&nbsp;<a href="' +
((__t = ( self.makeLink(c))) == null ? '' : __t) +
'">' +
((__t = ( c.name )) == null ? '' : __t) +
'</a></li>\r\n\t\t';
 }); ;
__p += '\r\n\t\t</ul>\r\n\t\t</div>\r\n\t\t';
};
__p += '\r\n\r\n\t\t';
 if(this.knownSubclasses && this.knownSubclasses.length) {;
__p += '\r\n\t\t<div class="known-subclasses">\r\n\t\t<h3>Known ' +
((__t = ( self.isInterface ? 'sub-interfaces' : 'sub-classes')) == null ? '' : __t) +
'</h3>\r\n\t\t<ul class="known-subclasses-list">\t\r\n\t\t';
 _(this.knownSubclasses).each(function(c){ ;
__p += '\r\n\t\t\t<li>' +
((__t = ( self.makeLink(c, true))) == null ? '' : __t) +
'</li>\r\n\t\t';
 }); ;
__p += '\r\n\t\t</ul>\r\n\t\t</div>\r\n\t\t';
};
__p += '\r\n\r\n\r\n\t\t';
 if(!self.options.dontShowOptions) { ;
__p += '\r\n\t\t<p><a href="#search?keywords=' +
((__t = ( this.jsdoc.absoluteName)) == null ? '' : __t) +
'&propsReferencingType=1">Search Class Usage</a></p>\r\n\t\t';
 } ;
__p += ' \r\n\t\t\r\n\t\t';
 var summary_text = this.jsdoc.textHtml || self.getTextHtml(this.jsdoc.text) || this.jsdoc.text || ''; ;
__p += '\r\n\r\n\r\n\r\n\r\n\t\t';
 if(summary_text) {;
__p += '\r\n\t\t<h3>Summary</h3>\r\n\t\t\r\n\t\t<div class="class-text">\r\n\t\t' +
((__t = ( summary_text )) == null ? '' : __t) +
'\r\n\t\t</div>\r\n\t\t';
 } ;
__p += '\r\n\r\n\r\n\r\n\t\t';
 if(this.inlineProperties) {;
__p += '\r\n\t\t<div class="inline-class-properties">\r\n\r\n\t\t';
 if(_(this.properties).keys().length) { ;
__p += '\r\n\t\t<h3>Properties</h3>\r\n\t\t<div data-type="inline-properties" class="inline-properties"></div>\r\n\t\t';
 } ;
__p += '\r\n\r\n\t\t';
 if(_(this.attributes).keys().length) { ;
__p += '\r\n\t\t<h3>Attributes</h3>\r\n\t\t<div data-type="inline-attributes" class="inline-attributes"></div>\r\n\t\t';
 } ;
__p += '\r\n\r\n\t\t';
 if(_(this.events_).keys().length) { ;
__p += '\r\n\t\t<h3>Events</h3>\r\n\t\t<div data-type="inline-events" class="inline-events"></div>\r\n\t\t';
 } ;
__p += '\r\n\r\n\t\t';
 if(_(this.methods).keys().length) { ;
__p += '\r\n\t\t<h3>Methods</h3>\r\n\t\t<div data-type="inline-methods" class="inline-methods"></div>\r\n\t\t';
 } ;
__p += '\r\n\r\n\t\t</div>\r\n\t\t';
 } ;
__p += '\r\n\r\n\r\n\r\n\t\t';
 if(!self.options.dontShowSources) {;
__p += '\r\n\t\t<button class="btn btn-info" data-type="sources-collapse">Show/Hide Sources</button>\r\n\t\t<div data-type="sources" id="class-sources"></div>\r\n\t\t';
};
__p += '\r\n\r\n\t</div>\r\n</div>\r\n';

}
return __p
};

this["shortjsdoc"]["classes"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<h3><a href="#classes">Classes and interfaces</a></h3>\r\n\r\n<ul class="classes-list">\r\n';
 
	_(this.classes).each(function(c) { ;
__p += '\r\n\t<li><a href="#class/' +
((__t = ( c.absoluteName )) == null ? '' : __t) +
'" class="' +
((__t = ( c.annotation )) == null ? '' : __t) +
'">' +
((__t = ( c.name )) == null ? '' : __t) +
'</a></li>\r\n';
 }); ;
__p += '\r\n</ul>\r\n';

}
return __p
};

this["shortjsdoc"]["dependencies"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<p><input data-type="includeNativeClasses" type="checkbox" ' +
((__t = ( this.options.includeNativeClasses ? 'checked' : '')) == null ? '' : __t) +
'></input>\r\n\t' +
((__t = ( this.options.includeNativeClasses ? 'Include' : 'Don\'t include' )) == null ? '' : __t) +
' native classes</a></p>\r\n\r\n<p><input data-type="includeExtends" type="checkbox" ' +
((__t = ( this.options.includeExtends ? 'checked' : '')) == null ? '' : __t) +
'></input>\r\n\t' +
((__t = ( this.options.includeExtends ? 'Include' : 'Don\'t include' )) == null ? '' : __t) +
' inheritance</a></p>\r\n\r\n<p>The following is a graph showing dependencies between classes. A class A depends on a class B if any A property or method references the type B or contains an explicit dependency declaration to B using \'@depends class B\' : </p>\r\n\r\n<div class="loading-message">Calculating, please stand by...</div>\r\n\r\n<div data-type="dependency-graph"></div>';

}
return __p
};

this["shortjsdoc"]["file"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<h2>File ' +
((__t = ( this.jsdoc.fileName)) == null ? '' : __t) +
'</h2>\r\n<button data-action="donwload">Download</button>\r\n<pre class="prettyprint linenums">\r\n' +
((__t = ( this.fileContent )) == null ? '' : __t) +
'\r\n</pre>';

}
return __p
};

this["shortjsdoc"]["header"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 var metadata = this.application.data.projectMetadata; ;
__p += '\r\n<header class="main-header">\r\n<div class="row">\r\n\r\n\r\n<!-- <span class="col-lg-12 col-md-12 col-sm-12 col-xs-12"> -->\r\n<span class="col-sm-5 col-xs-12">\r\n\t<span class="dropdown">\r\n\t\t<button class="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown">\r\n\t\t' +
((__t = ( (metadata && metadata.name) ||  'short-jsdoc demo' )) == null ? '' : __t) +
'\r\n\t\t<span class="caret"></span>\r\n\t\t</button>\r\n\t\t<ul class="dropdown-menu" role="menu" aria-labelledby="dropdownMenu1">\r\n\t\t\t\r\n\t\t\t<li role="presentation"><a role="menuitem" href="#index">Index</a></li>\r\n\r\n\t\t\t<li role="presentation"><a role="menuitem" href="#book">Book view (for printing it all)</a></li>\r\n\r\n\t\t\t<li role="presentation"><a role="menuitem" href="#tree">Full Abstract Syntax Tree</a></li>\t\r\n\r\n\t\t\t<li role="presentation"><a role="menuitem" href="#hierarchyTree">Class Hierarchy Tree</a></li>\t\r\n\r\n\t\t\t<li role="presentation"><a role="menuitem" href="#search?keywords=Array&propsReferencingType=1">Search type references</a></li>\r\n\r\n\t\t\t<li role="presentation"><a role="menuitem" href="#dependencies">Class Dependencies Graph</a></li>\t\r\n\r\n\t\t\t<li role="presentation"><a role="menuitem" href="#parse">Parse your code !</a></li>\r\n\r\n\t\t\t<li role="presentation" class="divider"></li>\r\n\r\n\t\t\t<li role="presentation"><a role="menuitem" href="https://github.com/cancerberoSgx/short-jsdoc">short-jsdoc home page</a></li>\r\n\t\t\t<li role="presentation"><a role="menuitem" href="../test/SpecRunner.html">Run short-jsdoc Specs</a></li>\r\n\r\n\t\t</ul>.\r\n\t\t\r\n\t</span>\t\t\r\n</span>\r\n\r\n<!-- <span class="col-lg-12 col-md-12 col-sm-12 col-xs-12"> -->\r\n<span class="col-sm-7 col-xs-12">\r\n\t<span class="main-search pull-right">\r\n\t<a role="menuitem" href="#index">Index</a>\r\n\t\tSearch <input class="typeahead1">\r\n\t</span>\t\t\r\n</span>\r\n\r\n\r\n</div>\r\n</header>';

}
return __p
};

this["shortjsdoc"]["hierarchytree"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 var data = this.application.data; ;
__p += '\r\n\r\n' +
((__t = ( data.projectMetadata && this.application.templates['project-metadata'].apply(this, arguments) )) == null ? '' : __t) +
'\r\n\r\n<h2>Class Hierarchy Tree</h2>\r\n\r\n<button data-action="expand-all">Expand all</button>\r\n\r\n<button data-action="collapse-all">Collapse all</button>\r\n\r\n<div class="the-tree"></div>\r\n';

}
return __p
};

this["shortjsdoc"]["index"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 var data = this.application.data; ;
__p += '\r\n\r\n' +
((__t = ( data.projectMetadata && this.application.templates['project-metadata'].apply(this, arguments) )) == null ? '' : __t) +
'\r\n\r\n<div class="pull-right">&nbsp;&nbsp;<a href="' +
((__t = ( this.makeLink('index', false, {private: this.options.private ? 0 : 1}) )) == null ? '' : __t) +
'">\r\n' +
((__t = ( this.options.private ? 'Show' : 'Hide' )) == null ? '' : __t) +
' private classes</a></div> \r\n\r\n<p>Take a look at the <a href="#tree">Full Abstract Syntax Tree (AST) View</a></p>\r\n<p>Or to the <a href="#hierarchyTree">Full Class Hierarchy tree</a></p>\r\n\r\n' +
((__t = ( this.application.templates['modules'].apply(this, arguments) )) == null ? '' : __t) +
'\r\n\r\n' +
((__t = ( this.application.templates['classes'].apply(this, arguments) )) == null ? '' : __t) +
'\r\n\r\n\r\n\r\n\r\n';

}
return __p
};

this["shortjsdoc"]["method"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 var self = this;;
__p += '\r\n\r\n\r\n\r\n<div class="row method-header">\r\n\t<div class="' +
((__t = ( this.asChildView ? 'col-md-12' : 'col-md-4')) == null ? '' : __t) +
'">\r\n\t\t<div class="method-title">\r\n\t\t\t';
 if(this.isConstructor){ ;
__p += '\r\n\t\t\t<h3>Constructor</h3>\r\n\t\t\t';
 } else if(!this.isFunction) { ;
__p += '\r\n\t\t\t<h3>Method&nbsp;<a href="' +
((__t = ( this.makeLink(this.jsdoc) )) == null ? '' : __t) +
'">' +
((__t = ( this.jsdoc.name)) == null ? '' : __t) +
'</a></h3>\r\n\t\t\t';
 } else { ;
__p += '\r\n\t\t\t<h3>Function&nbsp;<a href="' +
((__t = ( this.makeLink(this.jsdoc) )) == null ? '' : __t) +
'">' +
((__t = ( this.jsdoc.name)) == null ? '' : __t) +
'</a></h3>\r\n\t\t\t';
 };
__p += '\r\n\t\t</div>\r\n\r\n\t\t';
 if (this.jsdoc.text) { ;
__p += '\r\n\t\t<div class="method-text">\r\n\t\t\t' +
((__t = ( this.jsdoc.textHtml )) == null ? '' : __t) +
'\r\n\t\t</div>\r\n\t\t';
 } ;
__p += '\r\n\t</div>\r\n\t';
 if(!this.asChildView) {;
__p += '\r\n\t<div class="col-md-4">\r\n\t\t';
 if(!this.isFunction){;
__p += '\r\n\t\t<h3>Of class <a href="#class/' +
((__t = ( this.jsdoc.ownerClass )) == null ? '' : __t) +
'">\r\n\t\t\t' +
((__t = ( this.simpleName(this.jsdoc.ownerClass, this.ownerModule) )) == null ? '' : __t) +
'</a>\r\n\t\t</h3>\r\n\t\t';
 } ;
__p += '\r\n\t</div>\r\n\r\n\t<div class="col-md-4">\r\n\t\t<h3 class="class-module-title">Of Module ' +
((__t = ( this.makeLink(this.ownerClass ? this.ownerClass.module : this.ownerModule, true) )) == null ? '' : __t) +
'</h3>\r\n\t</div>\r\n\t';
 };
__p += '\r\n</div>\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n<div class="row">\r\n\t<div class="' +
((__t = ( this.asChildView ? 'col-md-12' : 'col-md-4' )) == null ? '' : __t) +
'">\r\n\r\n\t\t';
 if( this.jsdoc.params.length ) { ;
__p += '\r\n\t\t<h3>Parameters</h3>\r\n\t\t';
 } ;
__p += '\r\n\r\n\t\t<ul class="parameter-list">\r\n\t\t';
 _(this.jsdoc.params).each(function(param) { ;
__p += '\r\n\t\t\t<li>\r\n\t\t\t\t' +
((__t = ( param.name)) == null ? '' : __t) +
': ' +
((__t = ( self.printTypeAsString(param.type) )) == null ? '' : __t) +
'\r\n\t\t\t\t<span class="param-text">' +
((__t = ( self.getTextHtml(param) )) == null ? '' : __t) +
'</span>\r\n\t\t\t</li>\r\n\r\n\t\t';
 }); ;
__p += '\r\n\t\t</ul>\r\n\r\n\r\n\r\n\t\t';
 if(!this.isConstructor) { ;
__p += '\r\n\t\t\t';
if (this.jsdoc.returns && (this.jsdoc.returns.type || this.jsdoc.returns.text) ) { ;
__p += '\r\n\t\t\t\t<h3 class="returns-title">Returns</h3>\r\n\t\t\t\t' +
((__t = ( self.printTypeAsString(this.jsdoc.returns.type) )) == null ? '' : __t) +
'\r\n\r\n\t\t\t\t';
 if(this.jsdoc.returns.text){ ;
__p += '\r\n\t\t\t\t\t<span class="returns-text">' +
((__t = ( self.getTextHtml(this.jsdoc.returns) )) == null ? '' : __t) +
'</span>\r\n\t\t\t\t';
 } ;
__p += '\r\n\r\n\t\t\t';
 };
__p += '\r\n\t\t';
 };
__p += '\r\n\r\n\r\n\r\n\r\n\t\t';
 if(this.jsdoc.throws && this.jsdoc.throws.length) { ;
__p += '\r\n\r\n\t\t<h3>Throws</h3>\r\n\r\n\t\t<ul class="throws-list">\r\n\t\t';
 _(this.jsdoc.throws).each(function(t) { ;
__p += '\r\n\t\t\t<li>\r\n\t\t\t\t' +
((__t = ( self.printTypeAsString(t.type) )) == null ? '' : __t) +
'\r\n\t\t\t\t<span class="param-text">' +
((__t = ( self.getTextHtml(t) )) == null ? '' : __t) +
'</span>\r\n\t\t\t</li>\r\n\t\t';
 }); ;
__p += '\r\n\t\t</ul>\r\n\r\n\t\t';
 } ;
__p += '\r\n\t</div>\r\n\r\n\r\n\r\n\t\r\n\t<div class="' +
((__t = ( this.asChildView ? 'col-md-12' : 'col-md-8' )) == null ? '' : __t) +
'">\r\n\t\t\r\n\t\t\r\n\t';
 if(!this.asChildView) {;
__p += '<div data-type="sources"></div>';
 };
__p += '\r\n\t</div>\r\n\t\r\n</div>\r\n\r\n\r\n';

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
__p += '\r\n\r\n<h2 class="module-title">Module ' +
((__t = ( this.jsdoc.name)) == null ? '' : __t) +
'</h2>\r\n\r\n<div class="pull-right">&nbsp;&nbsp;<a href="' +
((__t = ( this.makeLink(this.jsdoc, false, {private: this.options.private ? 0 : 1}) )) == null ? '' : __t) +
'">\r\n' +
((__t = ( this.options.private ? 'Show' : 'Hide' )) == null ? '' : __t) +
' private classes</a></div> \r\n\r\n';
 if (this.jsdoc.text) { ;
__p += '\r\n<div class="method-text">\r\n\t' +
((__t = ( this.jsdoc.textHtml )) == null ? '' : __t) +
'\r\n</div>\r\n';
 };
__p += '\r\n\r\n<h3>Classes</h3>\r\n\r\n<ul class="classes">\r\n';
 _(this.classes).each(function(c) { ;
__p += '\r\n\t<li>\r\n\t\t<a class="module-class-name"href="#class/' +
((__t = ( c.absoluteName )) == null ? '' : __t) +
'">' +
((__t = ( c.name )) == null ? '' : __t) +
'</a>\t\t\r\n\r\n\t\t<ul class="module-class-properties-list">\r\n\t\t';
 _(c.methods).each(function(m){ ;
__p += '\r\n\t\t\t<li><a href="' +
((__t = ( self.makeLink(m))) == null ? '' : __t) +
'">' +
((__t = ( m.name)) == null ? '' : __t) +
'(), </a>\r\n\t\t';
}) ;
__p += '\r\n\t\t';
 _(c.properties).each(function(m){ ;
__p += '\r\n\t\t\t<li><a href="' +
((__t = ( self.makeLink(m))) == null ? '' : __t) +
'">' +
((__t = ( m.name)) == null ? '' : __t) +
', </a>\r\n\t\t';
}) ;
__p += '\r\n\t\t</ul>\r\n\t\t';
 _(c.attributes).each(function(m){ ;
__p += '\r\n\t\t\t<li><a href="' +
((__t = ( self.makeLink(m))) == null ? '' : __t) +
'">' +
((__t = ( m.name)) == null ? '' : __t) +
', </a>\r\n\t\t';
}) ;
__p += '\r\n\t\t</ul>\r\n\t</li>\r\n';
 }); ;
__p += '\r\n</ul>\r\n\r\n<h3>Interfaces</h3>\r\n\r\n<ul class="interfaces">\r\n';
 _(this.interfaces).each(function(c) { ;
__p += '\r\n\t<li>\r\n\t\t<a class="module-class-name"href="#class/' +
((__t = ( c.absoluteName )) == null ? '' : __t) +
'">' +
((__t = ( c.name )) == null ? '' : __t) +
'</a>\t\t\r\n\r\n\t\t<ul class="module-class-properties-list">\r\n\t\t';
 _(c.methods).each(function(m){ ;
__p += '\r\n\t\t\t<li><a href="' +
((__t = ( self.makeLink(m))) == null ? '' : __t) +
'">' +
((__t = ( m.name)) == null ? '' : __t) +
'(), </a>\r\n\t\t';
}) ;
__p += '\r\n\t\t';
 _(c.properties).each(function(m){ ;
__p += '\r\n\t\t\t<li><a href="' +
((__t = ( self.makeLink(m))) == null ? '' : __t) +
'">' +
((__t = ( m.name)) == null ? '' : __t) +
', </a>\r\n\t\t';
}) ;
__p += '\r\n\t\t</ul>\r\n\t\t';
 _(c.attributes).each(function(m){ ;
__p += '\r\n\t\t\t<li><a href="' +
((__t = ( self.makeLink(m))) == null ? '' : __t) +
'">' +
((__t = ( m.name)) == null ? '' : __t) +
', </a>\r\n\t\t';
}) ;
__p += '\r\n\t\t</ul>\r\n\t</li>\r\n';
 }); ;
__p += '\r\n</ul>\r\n\r\n<h3>Functions</h3>\r\n<ul class="Functions">\r\n';
 _(this.jsdoc.functions).each(function(c) { ;
__p += '\r\n\t<li>\r\n\t\t<a class="module-function-name"href="#function/' +
((__t = ( c.absoluteName )) == null ? '' : __t) +
'">' +
((__t = ( c.name )) == null ? '' : __t) +
'</a>\t\t\r\n\r\n\t</li>\r\n';
 }); ;
__p += '\r\n</ul>';

}
return __p
};

this["shortjsdoc"]["modules"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class="modules">\r\n\r\n<h3><a href="#modules">Modules</a></h3>\r\n\r\n';
 
var self = this; ;
__p += '\r\n<ul class="modules-list">\r\n';
 _(this.modules).each(function(m) { ;
__p += '\r\n\t<li class="modules-module"><a class=\'module-name\' href="#module/' +
((__t = ( m.name )) == null ? '' : __t) +
'">' +
((__t = ( m.name )) == null ? '' : __t) +
'</a>\r\n\t\t<ul class="modules-classes-list">\r\n\t\t';
 
		/* TODO: make a view */
		var moduleClasses = self.getModuleClasses(m.name, self.application.data); 
		_(moduleClasses).each(function(c) { ;
__p += '\r\n\t\t\t<li class="modules-class"><a class=\'class-name ' +
((__t = ( c.annotation)) == null ? '' : __t) +
'\' href="#class/' +
((__t = ( c.absoluteName )) == null ? '' : __t) +
'">' +
((__t = ( c.name )) == null ? '' : __t) +
'</a>, </li>\r\n\t\t';
 }); ;
__p += '\r\n\t\t</ul>\r\n\t</li>\r\n';
 }); ;
__p += '\r\n</ul>\r\n\r\n</div>';

}
return __p
};

this["shortjsdoc"]["parse"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<h2>Parse your code online!</h2>\r\n<p>Please paste your commeted code in the following area and it will be loaded automatically. </p>\r\n<textarea data-type="inputcode">\r\n//@module life @class Living Any living thing\r\n//@class Tree A tree is a living thing that contains some leafs and grow. \r\n//@extends Living \r\nfunction Tree(){}\r\n/**@method growLeaf makes the given leaf to gro a little more. @param {Leaf} leaf*/\r\nTree.prototype.growLeaf = function(leaf){}\r\n/*@class Apple a sweet fruit @module Life @extend Fruit grows in trees and can be eaten @module Life */ \r\nfunction Apple(){}\r\n//@module Mineral @class Stone \r\n//@method doShadow @param {Rectangle} shadowSize @return {Shadow} the new Shadow\r\n//@class Shadow @module Ideal\r\n//@class Good @module Ideal\r\n</textarea>\r\n<input type="checkbox" data-action="clean" >Clean previous data ?</input>\r\n<button data-action="inputcode_doit">do it</button>\r\n';

}
return __p
};

this["shortjsdoc"]["project-metadata"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 var metaData = this.application.data.projectMetadata; ;
__p += '\r\n\r\n<p>Project ' +
((__t = ( metaData.name)) == null ? '' : __t) +
' contains #' +
((__t = ( _(this.application.data.modules).keys().length )) == null ? '' : __t) +
' modules and #' +
((__t = ( _(this.application.data.classes).keys().length )) == null ? '' : __t) +
' classes.</p>\r\n\r\n<dl class="dl-horizontal">\r\n\t';
 _(metaData).each(function(value, name) { 
		if(_(['name', 'description', 'author', 'license', 'version']).contains(name)) { ;
__p += '\r\n\t<dt class="metadata-name">' +
((__t = ( name)) == null ? '' : __t) +
'</dt><dd class="metadata-value">' +
((__t = ( _(value).isString() ? value : JSON.stringify(value))) == null ? '' : __t) +
'</dd>\r\n\t';
 } } ); ;
__p += '\r\n</dl>\r\n';

}
return __p
};

this["shortjsdoc"]["property"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<h3>' +
((__t = ( this.propertyLabel )) == null ? '' : __t) +
'&nbsp;<a href="' +
((__t = ( this.makeLink(this.jsdoc) )) == null ? '' : __t) +
'">' +
((__t = ( this.jsdoc.name)) == null ? '' : __t) +
'</a></h3>\r\n\r\n';
 if(!this.asChildView) {;
__p += '\r\n<h3>Of class <a href="#class/' +
((__t = ( this.jsdoc.ownerClass )) == null ? '' : __t) +
'">\r\n\t' +
((__t = ( this.simpleName(this.jsdoc.ownerClass, this.ownerModule) )) == null ? '' : __t) +
'</a>\r\n</h3>\r\n';
 } ;
__p += '\r\n\r\n';
 if (this.jsdoc.text) { ;
__p += '\r\n<div class="method-text">\r\n\t' +
((__t = ( this.jsdoc.textHtml )) == null ? '' : __t) +
'\r\n</div>\r\n';
 } ;
__p += '\r\n\r\n';
 if(this.jsdoc.type) { ;
__p += ' \r\n<span class="property-type"><strong>Type</strong>:&nbsp;</span>\r\n' +
((__t = ( this.printTypeAsString(this.jsdoc.type) )) == null ? '' : __t) +
'\r\n';
 } ;
__p += ' \r\n\r\n';
 if(!this.asChildView) {;
__p += '\r\n<div data-type="sources"></div>\r\n';
 } ;


}
return __p
};

this["shortjsdoc"]["search"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<h2>Query:</h2>\r\n\r\n<form data-type="search-form">\r\n\t<p>Keywords: <input name="keywords" value="' +
((__t = (this.query.keywords)) == null ? '' : __t) +
'"></input></p>\r\n\t<p><input name="propsReferencingType" type="checkbox" ' +
((__t = ( this.query.propsReferencingType ? 'checked' : '' )) == null ? '' : __t) +
' value="' +
((__t = (this.query.keywords)) == null ? '' : __t) +
'"></input> properties referencing given type name</p>\r\n\t<button data-action="search">Search</button>\r\n</form>\r\n\r\n<h2>Results</h2>\r\n\r\n<p>' +
((__t = ( this.results ? '' : 'Searching... please wait.')) == null ? '' : __t) +
'</p>\r\n<ul>\r\n';
_(this.results).each(function(result) { ;
__p += '\r\n\t<li> <a href="' +
((__t = ( result.url )) == null ? '' : __t) +
'"> ' +
((__t = ( result.label )) == null ? '' : __t) +
' </a> </li>\r\n';
 }); ;
__p += '\r\n</ul>';

}
return __p
};

this["shortjsdoc"]["sources"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<h3>Sources <button data-type="goto-source" class="btn btn-link ">goto def</button></h3>\r\n<p>File <a href="#file/' +
((__t = ( this.fileNameUrl )) == null ? '' : __t) +
'">' +
((__t = ( this.jsdoc.fileName )) == null ? '' : __t) +
'</a></p>\r\n<pre class="prettyprint linenums">' +
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
__p += '\r\n\r\n' +
((__t = ( data.projectMetadata && this.application.templates['project-metadata'].apply(this, arguments) )) == null ? '' : __t) +
'\r\n\r\n<h2>Abstract Syntax Tree</h2>\r\n\r\n<p>From modules to classes and properties...</p>\r\n\r\n<button data-action="expand-all">Expand all</button>\r\n\r\n<button data-action="collapse-all">Collapse all</button>\r\n\r\n<div class="the-tree"></div>\r\n';

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
'">\r\n\t<span class="suggestion-value">' +
((__t = ( value)) == null ? '' : __t) +
'</span>&nbsp;<span class="suggestion-type suggestion-type-' +
((__t = ( node.annotation)) == null ? '' : __t) +
'">(' +
((__t = ( node.annotation)) == null ? '' : __t) +
'\r\n\t';
 if(_(['property', 'method', 'attribute', 'event']).contains(node.annotation)) {;
__p += '\r\n\tof class ' +
((__t = ( node.ownerClass)) == null ? '' : __t) +
'\r\n\t';
 };
__p += ')\r\n\t</span>\r\n</div>';

}
return __p
};