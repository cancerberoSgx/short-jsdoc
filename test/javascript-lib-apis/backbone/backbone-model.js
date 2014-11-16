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
*/

