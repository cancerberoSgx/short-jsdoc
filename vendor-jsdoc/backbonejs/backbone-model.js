/*
@module Backbone
@class Backbone.Model 


Models are the heart of any JavaScript application, containing the interactive data as well as a large part of the logic surrounding it: conversions, validations, computed properties, and access control. You extend Backbone.Model with your domain-specific methods, and Model provides a basic set of functionality for managing changes.

The following is a contrived example, but it demonstrates defining a model with a custom method, setting an attribute, and firing an event keyed to changes in that specific attribute. After running this code once, sidebar will be available in your browser's console, so you can play around with it.

	var Sidebar = Backbone.Model.extend({
	  promptColor: function() {
	    var cssColor = prompt("Please enter a CSS color:");
	    this.set({color: cssColor});
	  }
	});

	window.sidebar = new Sidebar;

	sidebar.on('change:color', function(model, color) {
	  $('#sidebar').css({background: color});
	});

	sidebar.set({color: 'white'});

	sidebar.promptColor();

@extends Backbone.Events

*/




/*
@method extend

To create a Model class of your own, you extend Backbone.Model and provide instance properties, as well as optional classProperties to be attached directly to the constructor function.

extend correctly sets up the prototype chain, so subclasses created with extend can be further extended and subclassed as far as you like.

	var Note = Backbone.Model.extend({

	  initialize: function() { ... },

	  author: function() { ... },

	  coordinates: function() { ... },

	  allowedToEdit: function(account) {
	    return true;
	  }

	});

	var PrivateNote = Note.extend({

	  allowedToEdit: function(account) {
	    return account.owns(this);
	  }

	});

#super

Brief aside on super: JavaScript does not provide a simple way to call super — the function of the same name defined higher on the prototype chain. If you override a core function like set, or save, and you want to invoke the parent object's implementation, you'll have to explicitly call it, along these lines:

	var Note = Backbone.Model.extend({
	  set: function(attributes, options) {
	    Backbone.Model.prototype.set.apply(this, arguments);
	    ...
	  }
	});



@static
@param {Object} properties
@param {Object} classProperties
*/



/*
@method initialize

Use like this:

	new Model([attributes], [options]) 

When creating an instance of a model, you can pass in the initial values of the attributes, which will be set on the model. If you define an initialize function, it will be invoked when the model is created.

	new Book({
	  title: "One Thousand and One Nights",
	  author: "Scheherazade"
	});
In rare cases, if you're looking to get fancy, you may want to override constructor, which allows you to replace the actual constructor function for your model.

	var Library = Backbone.Model.extend({
	  constructor: function() {
	    this.books = new Books();
	    Backbone.Model.apply(this, arguments);
	  },
	  parse: function(data, options) {
	    this.books.reset(data.books);
	    return data.library;
	  }
	});
If you pass a {collection: ...} as the options, the model gains a collection property that will be used to indicate which collection the model belongs to, and is used to help compute the model's url. The model.collection property is normally created automatically when you first add a model to a collection. Note that the reverse is not true, as passing this option to the constructor will not automatically add the model to the collection. Useful, sometimes.

If {parse: true} is passed as an option, the attributes will first be converted by parse before being set on the model.

*/



/*@method get
Get the current value of an attribute from the model. For example: note.get("title")
@param {String} name the property name to get
@returns {Any} the value of the property
*/




/*
@method set

Set a hash of attributes (one or many) on the model. If any of the attributes change the model's state, a "change" event will be triggered on the model. Change events for specific attributes are also triggered, and you can bind to those as well, for example: change:title, and change:content. You may also pass individual keys and values.

	note.set({title: "March 20", content: "In his eyes she eclipses..."});

	book.set("title", "A Scandal in Bohemia");

@param {String} name
@param {Any} value
@param {Object} options Optional
*/




/*
@method escape

Similar to get, but returns the HTML-escaped version of a model's attribute. If you're interpolating data from the model into HTML, using escape to retrieve attributes will prevent XSS attacks.

	var hacker = new Backbone.Model({
	  name: "<script>alert('xss')</script>"
	});

	alert(hacker.escape('name'));
*/


/*
@method has
Returns true if the attribute is set to a non-null or non-undefined value.

	if (note.has("title")) {
	  ...
	}

@param {String} name
*/


/*
@method unset
Remove an attribute by deleting it from the internal attributes hash. Fires a "change" event unless silent is passed as an option.
@param {String}attribute
@param {Object} options Optional
*/




/*
@method clear

Removes all attributes from the model, including the id attribute. Fires a "change" event unless silent is passed as an option.

@param {Object} options Optional
*/


/*
@property {String} id 

A special property of models, the id is an arbitrary string (integer id or UUID). If you set the id in the attributes hash, it will be copied onto the model as a direct property. Models can be retrieved by id from collections, and the id is used to generate model URLs by default.
*/



/*
@property {String} idAttribute
A model's unique identifier is stored under the id attribute. If you're directly communicating with a backend (CouchDB, MongoDB) that uses a different unique key, you may set a Model's idAttribute to transparently map from that key to id.

	var Meal = Backbone.Model.extend({
	  idAttribute: "_id"
	});

	var cake = new Meal({ _id: 1, name: "Cake" });
	alert("Cake id: " + cake.id);
*/



/*
@property {String} cid 

A special property of models, the cid or client id is a unique identifier automatically assigned to all models when they're first created. Client ids are handy when the model has not yet been saved to the server, and does not yet have its eventual true id, but already needs to be visible in the UI.
*/



/*@property {Object}attributes
The attributes property is the internal hash containing the model's state — usually (but not necessarily) a form of the JSON object representing the model data on the server. It's often a straightforward serialization of a row from the database, but it could also be client-side computed state.

Please use set to update the attributes instead of modifying them directly. If you'd like to retrieve and munge a copy of the model's attributes, use _.clone(model.attributes) instead.

Due to the fact that Events accepts space separated lists of events, attribute names should not include spaces.
*/





/*
@property{Object}changed
The changed property is the internal hash containing all the attributes that have changed since the last set. Please do not update changed directly since its state is internally maintained by set. A copy of changed can be acquired from changedAttributes.
*/



/*
@property{Object}defaults
The defaults hash (or function) can be used to specify the default attributes for your model. When creating an instance of the model, any unspecified attributes will be set to their default value.

	var Meal = Backbone.Model.extend({
	  defaults: {
	    "appetizer":  "caesar salad",
	    "entree":     "ravioli",
	    "dessert":    "cheesecake"
	  }
	});

	alert("Dessert will be " + (new Meal).get('dessert'));
Remember that in JavaScript, objects are passed by reference, so if you include an object as a default value, it will be shared among all instances. Instead, define defaults as a function.
*/







/*
@method toJSON 
Return a shallow copy of the model's attributes for JSON stringification. This can be used for persistence, serialization, or for augmentation before being sent to the server. The name of this method is a bit confusing, as it doesn't actually return a JSON string — but I'm afraid that it's the way that the JavaScript API for JSON.stringify works.

	var artist = new Backbone.Model({
	  firstName: "Wassily",
	  lastName: "Kandinsky"
	});

	artist.set({birthday: "December 16, 1866"});

	alert(JSON.stringify(artist));

@param {Object} options Optional
@return {String}
*/




/*
@method sync
Uses Backbone.sync to persist the state of a model to the server. Can be overridden for custom behavior.
@param {String} method
@param {Backbone.Model} model
@param {Object} options Optional
@static
*/




/*
@method fetch

Resets the model's state from the server by delegating to Backbone.sync. Returns a jqXHR. Useful if the model has never been populated with data, or if you'd like to ensure that you have the latest server state. A "change" event will be triggered if the server's state differs from the current attributes. Accepts success and error callbacks in the options hash, which are both passed (model, response, options) as arguments.

	// Poll every 10 seconds to keep the channel model up-to-date.
	setInterval(function() {
	  channel.fetch();
	}, 10000);

@param {Object} options Optional
*/




/*
@method save

Save a model to your database (or alternative persistence layer), by delegating to Backbone.sync. Returns a jqXHR if validation is successful and false otherwise. The attributes hash (as in set) should contain the attributes you'd like to change — keys that aren't mentioned won't be altered — but, a complete representation of the resource will be sent to the server. As with set, you may pass individual keys and values instead of a hash. If the model has a validate method, and validation fails, the model will not be saved. If the model isNew, the save will be a "create" (HTTP POST), if the model already exists on the server, the save will be an "update" (HTTP PUT).

If instead, you'd only like the changed attributes to be sent to the server, call model.save(attrs, {patch: true}). You'll get an HTTP PATCH request to the server with just the passed-in attributes.

Calling save with new attributes will cause a "change" event immediately, a "request" event as the Ajax request begins to go to the server, and a "sync" event after the server has acknowledged the successful change. Pass {wait: true} if you'd like to wait for the server before setting the new attributes on the model.

In the following example, notice how our overridden version of Backbone.sync receives a "create" request the first time the model is saved and an "update" request the second time.

	Backbone.sync = function(method, model) {
	  alert(method + ": " + JSON.stringify(model));
	  model.set('id', 1);
	};

	var book = new Backbone.Model({
	  title: "The Rough Riders",
	  author: "Theodore Roosevelt"
	});

	book.save();

	book.save({author: "Teddy"});

save accepts success and error callbacks in the options hash, which will be passed the arguments (model, response, options). If a server-side validation fails, return a non-200 HTTP response code, along with an error response in text or JSON.

	book.save("author", "F.D.R.", {error: function(){ ... }});

@param {Object} attributes optional
@param {Object} options optional

*/





/*
@method destroy

Destroys the model on the server by delegating an HTTP DELETE request to Backbone.sync. Returns a jqXHR object, or false if the model isNew. Accepts success and error callbacks in the options hash, which will be passed (model, response, options). Triggers a "destroy" event on the model, which will bubble up through any collections that contain it, a "request" event as it begins the Ajax request to the server, and a "sync" event, after the server has successfully acknowledged the model's deletion. Pass {wait: true} if you'd like to wait for the server to respond before removing the model from the collection.

	book.destroy({success: function(model, response) {
	  ...
	}});

@param {Object} options optional

*/





/*

@method validate

This method is left undefined, and you're encouraged to override it with your custom validation logic, if you have any that can be performed in JavaScript. By default validate is called before save, but can also be called before set if {validate:true} is passed. The validate method is passed the model attributes, as well as the options from set or save. If the attributes are valid, don't return anything from validate; if they are invalid, return an error of your choosing. It can be as simple as a string error message to be displayed, or a complete error object that describes the error programmatically. If validate returns an error, save will not continue, and the model attributes will not be modified on the server. Failed validations trigger an "invalid" event, and set the validationError property on the model with the value returned by this method.

	var Chapter = Backbone.Model.extend({
	  validate: function(attrs, options) {
	    if (attrs.end < attrs.start) {
	      return "can't end before it starts";
	    }
	  }
	});

	var one = new Chapter({
	  title : "Chapter One: The Beginning"
	});

	one.on("invalid", function(model, error) {
	  alert(model.get("title") + " " + error);
	});

	one.save({
	  start: 15,
	  end:   10
	});

"invalid" events are useful for providing coarse-grained error messages at the model or collection level.

@param {Object} attributes optional
@param {Object} options optional

*/


/*
@property {Error} validation
The value returned by validate during the last failed validation.


*/



/*@method isValid

Run validate to check the model state.

	var Chapter = Backbone.Model.extend({
	  validate: function(attrs, options) {
	    if (attrs.end < attrs.start) {
	      return "can't end before it starts";
	    }
	  }
	});

	var one = new Chapter({
	  title : "Chapter One: The Beginning"
	});

	one.set({
	  start: 15,
	  end:   10
	});

	if (!one.isValid()) {
	  alert(one.get("title") + " " + one.validationError);
	}

@return {boolean} true if model is valid
*/



/*@method url
Returns the relative URL where the model's resource would be located on the server. If your models are located somewhere else, override this method with the correct logic. Generates URLs of the form: "[collection.url]/[id]" by default, but you may override by specifying an explicit urlRoot if the model's collection shouldn't be taken into account.

Delegates to Collection#url to generate the URL, so make sure that you have it defined, or a urlRoot property, if all models of this class share a common root URL. A model with an id of 101, stored in a Backbone.Collection with a url of "/documents/7/notes", would have this URL: "/documents/7/notes/101"

@return {String} the relative of url for this model
*/


/*
@property {Function|String} urlRoot

Specify a urlRoot if you're using a model outside of a collection, to enable the default url function to generate URLs based on the model id. "[urlRoot]/id"
Normally, you won't need to define this. Note that urlRoot may also be a function.

	var Book = Backbone.Model.extend({urlRoot : '/books'});

	var solaris = new Book({id: "1083-lem-solaris"});

	alert(solaris.url());
*/




/*
@method parse
parse is called whenever a model's data is returned by the server, in fetch, and save. The function is passed the raw response object, and should return the attributes hash to be set on the model. The default implementation is a no-op, simply passing through the JSON response. Override this if you need to work with a preexisting API, or better namespace your responses.

If you're working with a Rails backend that has a version prior to 3.1, you'll notice that its default to_json implementation includes a model's attributes under a namespace. To disable this behavior for seamless Backbone integration, set:

	ActiveRecord::Base.include_root_in_json = false

@param {Object} response 
@param {Object} options

*/


/*
@method clone

Returns a new instance of the model with identical attributes.

*/


/*@method isNew
Has this model been saved to the server yet? If the model does not yet have an id, it is considered to be new.
@return {boolean}
*/


/*
@method hasChanged
Has the model changed since the last set? If an attribute is passed, returns true if that specific attribute has changed.

Note that this method, and the following change-related ones, are only useful during the course of a "change" event.

	book.on("change", function() {
	  if (book.hasChanged("title")) {
	    ...
	  }
	});

@param {String} attribute optional

*/


/*
@method changedAttributes
Retrieve a hash of only the model's attributes that have changed since the last set, or false if there are none. Optionally, an external attributes hash can be passed in, returning the attributes in that hash which differ from the model. This can be used to figure out which portions of a view should be updated, or what calls need to be made to sync the changes to the server.

@param {Object} attributes optional
*/


/*
@method previous
During a "change" event, this method can be used to get the previous value of a changed attribute.

	var bill = new Backbone.Model({
	  name: "Bill Smith"
	});

	bill.on("change:name", function(model, name) {
	  alert("Changed name from " + bill.previous("name") + " to " + name);
	});

	bill.set({name : "Bill Jones"});

@param {String} attribute optional
*/


/* @method previousAttributes
Return a copy of the model's previous attributes. Useful for getting a diff between versions of a model, or getting back to a valid state after an error occurs.
*/