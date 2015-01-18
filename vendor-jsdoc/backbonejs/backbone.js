/*
@module Backbone

#About
Backbone.js gives structure to web applications by providing models with key-value binding and custom events, collections with a rich API of enumerable functions, views with declarative event handling, and connects it all to your existing API over a RESTful JSON interface.

The project is hosted on GitHub, and the annotated source code is available, as well as an online test suite, an example application, a list of tutorials and a long list of real-world projects that use Backbone. Backbone is available for use under the MIT software license.

You can report bugs and discuss features on the GitHub issues page, on Freenode IRC in the #documentcloud channel, post questions to the Google Group, add pages to the wiki or send tweets to @documentcloud.

Backbone is an open-source component of DocumentCloud.

#Dependencies
Backbone's only hard dependency is Underscore.js ( >= 1.5.0). For RESTful persistence, history support via Backbone.Router and DOM manipulation with Backbone.View, include jQuery, and json2.js for older Internet Explorer support. (Mimics of the Underscore and jQuery APIs, such as Lo-Dash and Zepto, will also tend to work, with varying degrees of compatibility.)

#Introduction

When working on a web application that involves a lot of JavaScript, one of the first things you learn is to stop tying your data to the DOM. It's all too easy to create JavaScript applications that end up as tangled piles of jQuery selectors and callbacks, all trying frantically to keep data in sync between the HTML UI, your JavaScript logic, and the database on your server. For rich client-side applications, a more structured approach is often helpful.

With Backbone, you represent your data as Models, which can be created, validated, destroyed, and saved to the server. Whenever a UI action causes an attribute of a model to change, the model triggers a "change" event; all the Views that display the model's state can be notified of the change, so that they are able to respond accordingly, re-rendering themselves with the new information. In a finished Backbone app, you don't have to write the glue code that looks into the DOM to find an element with a specific id, and update the HTML manually — when the model changes, the views simply update themselves.

Philosophically, Backbone is an attempt to discover the minimal set of data-structuring (models and collections) and user interface (views and URLs) primitives that are generally useful when building web applications with JavaScript. In an ecosystem where overarching, decides-everything-for-you frameworks are commonplace, and many libraries require your site to be reorganized to suit their look, feel, and default behavior — Backbone should continue to be a tool that gives you the freedom to design the full experience of your web application.

If you're new here, and aren't yet quite sure what Backbone is for, start by browsing the list of Backbone-based projects.



@class Backbone




@method sync 

Backbone.sync is the function that Backbone calls every time it attempts to read or save a model to the server. By default, it uses jQuery.ajax to make a RESTful JSON request and returns a jqXHR. You can override it in order to use a different persistence strategy, such as WebSockets, XML transport, or Local Storage.

The method signature of Backbone.sync is sync(method, model, [options])

method – the CRUD method ("create", "read", "update", or "delete")
model – the model to be saved (or collection to be read)
options – success and error callbacks, and all other jQuery request options
With the default implementation, when Backbone.sync sends up a request to save a model, its attributes will be passed, serialized as JSON, and sent in the HTTP body with content-type application/json. When returning a JSON response, send down the attributes of the model that have been changed by the server, and need to be updated on the client. When responding to a "read" request from a collection (Collection#fetch), send down an array of model attribute objects.

Whenever a model or collection begins a sync with the server, a "request" event is emitted. If the request completes successfully you'll get a "sync" event, and an "error" event if not.

The sync function may be overriden globally as Backbone.sync, or at a finer-grained level, by adding a sync function to a Backbone collection or to an individual model.

The default sync handler maps CRUD to REST like so:

create → POST   /collection
read → GET   /collection[/id]
update → PUT   /collection/id
patch → PATCH   /collection/id
delete → DELETE   /collection/id
As an example, a Rails handler responding to an "update" call from Backbone might look like this: (In real code, never use update_attributes blindly, and always whitelist the attributes you allow to be changed.)

	def update
	  account = Account.find params[:id]
	  account.update_attributes params
	  render :json => account
	end
One more tip for integrating Rails versions prior to 3.1 is to disable the default namespacing for to_json calls on models by setting ActiveRecord::Base.include_root_in_json = false

@param {String}method
@param {Backbone.Model} model
@param {Object} options optional
@static




@method ajax 
If you want to use a custom AJAX function, or your endpoint doesn't support the jQuery.ajax API and you need to tweak things, you can do so by setting Backbone.ajax.
@param request
@static





@property {boolean} emulateHTTPBackbone 
If you want to work with a legacy web server that doesn't support Backbone's default REST/HTTP approach, you may choose to turn on Backbone.emulateHTTP. Setting this option will fake PUT, PATCH and DELETE requests with a HTTP POST, setting the X-HTTP-Method-Override header with the true method. If emulateJSON is also on, the true method will be passed as an additional _method parameter.

	Backbone.emulateHTTP = true;

	model.save();  // POST to "/collection/id", with "_method=PUT" + header.

@static




@property {boolean}emulateJSON
If you're working with a legacy web server that can't handle requests encoded as application/json, setting Backbone.emulateJSON = true; will cause the JSON to be serialized under a model parameter, and the request to be made with a application/x-www-form-urlencoded MIME type, as if from an HTML form.

@static

*/


/*
@method noConflict
	var backbone = Backbone.noConflict(); 
	
Returns the Backbone object back to its original value. You can use the return value of Backbone.noConflict() to keep a local reference to Backbone. Useful for embedding Backbone on third-party websites, where you don't want to clobber the existing Backbone.

	var localBackbone = Backbone.noConflict();
	var model = localBackbone.Model.extend(...);


@property{jQuery}$

If you have multiple copies of jQuery on the page, or simply want to tell Backbone to use a particular object as its DOM / Ajax library, this is the property for you. If you're loading Backbone with CommonJS (e.g. node, component, or browserify) you must set this property manually.

	var Backbone.$ = require('jquery');

*/