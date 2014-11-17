/*
@module Backbone
@class BackboneModel 


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

@extends BackboneEvents

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
@param {BackboneModel} model
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
@method
*/