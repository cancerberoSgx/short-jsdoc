this["shortjsdoc"] = this["shortjsdoc"] || {};

this["shortjsdoc"]["class"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 var className = this.jsdoc.name; ;
__p += '\n<h2 class="class-title">Class <a class="class-title" href="class/' +
((__t = ( className)) == null ? '' : __t) +
'">' +
((__t = ( className )) == null ? '' : __t) +
'</a></h2>\n\n<p class="class-text">' +
((__t = ( this.jsdoc.text )) == null ? '' : __t) +
'</p>\n\n<h3>Methods</h3>\n<ul>\n';
 _(this.jsdoc.methods).each(function(method, methodName) { ;
__p += '\n\t<li>\n\t\t<a href="method/' +
((__t = ( methodName )) == null ? '' : __t) +
'">Method ' +
((__t = ( methodName )) == null ? '' : __t) +
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
__p += '\n\t<li><a href="module/' +
((__t = ( moduleName )) == null ? '' : __t) +
'">' +
((__t = ( moduleName )) == null ? '' : __t) +
'</a></li>\n';
 }); ;
__p += '\n</ul>\n\n<h3>Classes</h3>\n\n<ul>\n';
 _(data.classes).each(function(classBody, className) { ;
__p += '\n\t<li><a href="#class/' +
((__t = ( className )) == null ? '' : __t) +
'">' +
((__t = ( className )) == null ? '' : __t) +
'</a></li>\n';
 }); ;
__p += '\n</ul>\n';

}
return __p
};