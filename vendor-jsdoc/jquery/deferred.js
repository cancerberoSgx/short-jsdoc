/*
@module jquery

@class jQueryDeferred

The Deferred object, introduced in jQuery 1.5, is a chainable utility object created by calling the jQuery.Deferred() method. It can register multiple callbacks into callback queues, invoke callback queues, and relay the success or failure state of any synchronous or asynchronous function.

The Deferred object is chainable, similar to the way a jQuery object is chainable, but it has its own methods. After creating a Deferred object, you can use any of the methods below by either chaining directly from the object creation or saving the object in a variable and invoking one or more methods on that variable.

*/

/*
@constructor jQuery.Deferred

##Description

A constructor function that returns a chainable utility object with methods to register multiple callbacks into callback queues, invoke callback queues, and relay the success or failure state of any synchronous or asynchronous function.

The jQuery.Deferred method can be passed an optional function, which is called just before the constructor returns and is passed the constructed deferred object as both the this object and as the first argument to the function. The called function can attach callbacks using deferred.then(), for example.

A Deferred object starts in the pending state. Any callbacks added to the object with deferred.then(), deferred.always(), deferred.done(), or deferred.fail() are queued to be executed later. Calling deferred.resolve() or deferred.resolveWith() transitions the Deferred into the resolved state and immediately executes any doneCallbacks that are set. Calling deferred.reject() or deferred.rejectWith() transitions the Deferred into the rejected state and immediately executes any failCallbacks that are set. Once the object has entered the resolved or rejected state, it stays in that state. Callbacks can still be added to the resolved or rejected Deferred — they will execute immediately.

##Enhanced Callbacks with jQuery Deferred

In JavaScript it is common to invoke functions that optionally accept callbacks that are called within that function. For example, in versions prior to jQuery 1.5, asynchronous processes such as jQuery.ajax() accept callbacks to be invoked some time in the near-future upon success, error, and completion of the ajax request.

jQuery.Deferred() introduces several enhancements to the way callbacks are managed and invoked. In particular, jQuery.Deferred() provides flexible ways to provide multiple callbacks, and these callbacks can be invoked regardless of whether the original callback dispatch has already occurred. jQuery Deferred is based on the CommonJS Promises/A design.

One model for understanding Deferred is to think of it as a chain-aware function wrapper. The deferred.then(), deferred.always(), deferred.done(), and deferred.fail() methods specify the functions to be called and the deferred.resolve(args) or deferred.reject(args) methods "call" the functions with the arguments you supply. Once the Deferred has been resolved or rejected it stays in that state; a second call to deferred.resolve(), for example, is ignored. If more functions are added by deferred.then(), for example, after the Deferred is resolved, they are called immediately with the arguments previously provided.

In most cases where a jQuery API call returns a Deferred or Promise-compatible object, such as jQuery.ajax() or jQuery.when(), you will only want to use the deferred.then(), deferred.done(), and deferred.fail() methods to add callbacks to the Deferred's queues. The internals of the API call or code that created the Deferred will invoke deferred.resolve() or deferred.reject() on the deferred at some point, causing the appropriate callbacks to run.


@param {Function}beforeStart Optional
Type: Function( Deferred deferred )
A function that is called just before the constructor returns.
The jQuery.Deferred() constructor creates a new Deferred object. The new operator is optional.

*/





/*
@method always

Usage:
	deferred.always( alwaysCallbacks [, alwaysCallbacks ] )

Description: Add handlers to be called when the Deferred object is either resolved or rejected.

The argument can be either a single function or an array of functions. When the Deferred is resolved or rejected, the alwaysCallbacks are called. Since deferred.always() returns the Deferred object, other methods of the Deferred object can be chained to this one, including additional .always() methods. When the Deferred is resolved or rejected, callbacks are executed in the order they were added, using the arguments provided to the resolve, reject, resolveWith or rejectWith method calls. For more information, see the documentation for Deferred object.

Example:
Since the jQuery.get() method returns a jqXHR object, which is derived from a Deferred object, we can attach a callback for both success and error using the deferred.always() method.

	$.get( "test.php" ).always(function() {
	  alert( "$.get completed with success or error callback arguments" );
	})

@param {Function|Array<Function>} alwaysCallbacks A function, or array of functions, that is called when the Deferred is resolved or rejected.

*/