/*

@module Backbone
@class Backbone.Collection

Collections are ordered sets of models. You can bind "change" events to be notified when any model in the collection has been modified, listen for "add" and "remove" events, fetch the collection from the server, and use a full suite of Underscore.js methods.

Any event that is triggered on a model in a collection will also be triggered on the collection directly, for convenience. This allows you to listen for changes to specific attributes in any model in a collection, for example: documents.on("change:selected", ...)



@method extend
To create a Collection class of your own, extend Backbone.Collection, providing instance properties, as well as optional classProperties to be attached directly to the collection's constructor function.

@param {Object} properties
@param {Object} classProperties Optional
*/


/* @method model 
Override this property to specify the model class that the collection contains. If defined, you can pass raw attributes objects (and arrays) to add, create, and reset, and the attributes will be converted into a model of the proper type.

	var Library = Backbone.Collection.extend({
	  model: Book
	});
A collection can also contain polymorphic models by overriding this property with a constructor that returns a model.

	var Library = Backbone.Collection.extend({

	  model: function(attrs, options) {
	    if (condition) {
	      return new PublicDocument(attrs, options);
	    } else {
	      return new PrivateDocument(attrs, options);
	    }
	  }
	});
@param {Object}attrs
@param {Object} options

*/



/*
@constructor

When creating a Collection, you may choose to pass in the initial array of models. The collection's comparator may be included as an option. Passing false as the comparator option will prevent sorting. If you define an initialize function, it will be invoked when the collection is created. There are a couple of options that, if provided, are attached to the collection directly: model and comparator.

	var tabs = new TabSet([tab1, tab2, tab3]);
	var spaces = new Backbone.Collection([], {
	  model: Space
	});

@param {Array} models optional
@param {Object} options optional

*/


/*
@property {Array} models
Raw access to the JavaScript array of models inside of the collection. Usually you'll want to use get, at, or the Underscore methods to access model objects, but occasionally a direct reference to the array is desired.
*/


/*@method toJSON
Return an array containing the attributes hash of each model (via toJSON) in the collection. This can be used to serialize and persist the collection as a whole. The name of this method is a bit confusing, because it conforms to JavaScript's JSON API.

	var collection = new Backbone.Collection([
	  {name: "Tim", age: 5},
	  {name: "Ida", age: 26},
	  {name: "Rob", age: 55}
	]);

	alert(JSON.stringify(collection));

@returns {Array}

*/

/*
@method sync
synccollection.sync(method, collection, [options]) 
Uses Backbone.sync to persist the state of a collection to the server. Can be overridden for custom behavior.


@param {String} method
@param {Backbone.Collection} collection
@param {Object} options optional

*/