
//@module Backbone

/*
@class Backbone.Events

Events is a module that can be mixed in to any object, giving the object the ability to bind and trigger custom named events. Events do not have to be declared before they are bound, and may take passed arguments. For example:

	var object = {};

	_.extend(object, Backbone.Events);

	object.on("alert", function(msg) {
	  alert("Triggered " + msg);
	});

	object.trigger("alert", "an event");
	
For example, to make a handy event dispatcher that can coordinate events among different areas of your application: var dispatcher = _.clone(Backbone.Events)


#Catalog of Events 
Here's the complete list of built-in Backbone events, with arguments. You're also free to trigger your own events on Models, Collections and Views as you see fit. The Backbone object itself mixes in Events, and can be used to emit any global events that your application needs.

	"add" (model, collection, options) — when a model is added to a collection.
	"remove" (model, collection, options) — when a model is removed from a collection.
	"reset" (collection, options) — when the collection's entire contents have been replaced.
	"sort" (collection, options) — when the collection has been re-sorted.
	"change" (model, options) — when a model's attributes have changed.
	"change:[attribute]" (model, value, options) — when a specific attribute has been updated.
	"destroy" (model, collection, options) — when a model is destroyed.
	"request" (model_or_collection, xhr, options) — when a model or collection has started a request to the server.
	"sync" (model_or_collection, resp, options) — when a model or collection has been successfully synced with the server.
	"error" (model_or_collection, resp, options) — when model's or collection's request to remote server has failed.
	"invalid" (model, error, options) — when a model's validation fails on the client.
	"route:[name]" (params) — Fired by the router when a specific route is matched.
	"route" (route, params) — Fired by the router when any route has been matched.
	"route" (router, route, params) — Fired by history when any route has been matched.
	"all" — this special event fires for any triggered event, passing the event name as the first argument.
Generally speaking, when calling a function that emits an event (model.set, collection.add, and so on...), if you'd like to prevent the event from being triggered, you may pass {silent: true} as an option. Note that this is rarely, perhaps even never, a good idea. Passing through a specific flag in the options for your event callback to look at, and choose to ignore, will usually work out better.

*/



/*
@method bind

Alias on

Bind a callback function to an object. The callback will be invoked whenever the event is fired. If you have a large number of different events on a page, the convention is to use colons to namespace them: "poll:start", or "change:selection". The event string may also be a space-delimited list of several events...

	book.on("change:title change:author", ...);

To supply a context value for this when the callback is invoked, pass the optional third argument: model.on('change', this.render, this)

Callbacks bound to the special "all" event will be triggered when any event occurs, and are passed the name of the event as the first argument. For example, to proxy all events from one object to another:

	proxy.on("all", function(eventName) {
	  object.trigger(eventName);
	});
All Backbone event methods also support an event map syntax, as an alternative to positional arguments:

	book.on({
	  "change:title": titleView.update,
	  "change:author": authorPane.update,
	  "destroy": bookView.remove
	});

@param {String} event
@param {Function} callback
@param {Object} context optional
*/



/*
@method off
Remove a previously-bound callback function from an object. If no context is specified, all of the versions of the callback with different contexts will be removed. If no callback is specified, all callbacks for the event will be removed. If no event is specified, callbacks for all events will be removed.

	// Removes just the `onChange` callback.
	object.off("change", onChange);

	// Removes all "change" callbacks.
	object.off("change");

	// Removes the `onChange` callback for all events.
	object.off(null, onChange);

	// Removes all callbacks for `context` for all events.
	object.off(null, null, context);

	// Removes all callbacks on `object`.
	object.off();
Note that calling model.off(), for example, will indeed remove all events on the model — including events that Backbone uses for internal bookkeeping.
*/



/*@method trigger
Trigger callbacks for the given event, or space-delimited list of events. Subsequent arguments to trigger will be passed along to the event callbacks.
*/



/*@method once
Just like on, but causes the bound callback to only fire once before being removed. Handy for saying "the next time that X happens, do this".
@param {String}event
@param {Function} callback
*/


/*
@method listenTo

Tell an object to listen to a particular event on an other object. The advantage of using this form, instead of other.on(event, callback, object), is that listenTo allows the object to keep track of the events, and they can be removed all at once later on. The callback will always be called with object as context.

	view.listenTo(model, 'change', view.render);

@param {Backbone.Events} other
@param {String} event
@param {Function} calback
*/



/*
@method stopListening

Tell an object to stop listening to events. Either call stopListening with no arguments to have the object remove all of its registered callbacks ... or be more precise by telling it to remove just the events it's listening to on a specific object, or a specific event, or just a specific callback.

	view.stopListening();

	view.stopListening(model);


@param {Backbone.Events} other optional
@param {String} event optional
@param {Function} calback optional

*/


/*@method listenToOnce
Just like listenTo, but causes the bound callback to only fire once before being removed.
*/