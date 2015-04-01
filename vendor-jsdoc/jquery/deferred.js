/*
@module jquery

@class jQuery.Deferred

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

Add handlers to be called when the Deferred object is either resolved or rejected.

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







/*
@method done

Description: Add handlers to be called when the Deferred object is resolved.

The deferred.done() method accepts one or more arguments, all of which can be either a single function or an array of functions. When the Deferred is resolved, the doneCallbacks are called. Callbacks are executed in the order they were added. Since deferred.done() returns the deferred object, other methods of the deferred object can be chained to this one, including additional .done() methods. When the Deferred is resolved, doneCallbacks are executed using the arguments provided to the resolve or resolveWith method call in the order they were added. For more information, see the documentation for Deferred object.

Example: Since the jQuery.get method returns a jqXHR object, which is derived from a Deferred object, we can attach a success callback using the .done() method.

	$.get( "test.php" ).done(function() {
		alert( "$.get succeeded" );
	});

@param {Function|Array<Function>} doneCallbacks A function, or array of functions, that are called when the Deferred is resolved. 
Optional additional functions, or arrays of functions, that are called when the Deferred is resolved.

*/

/*
@method fail
Description: Add handlers to be called when the Deferred object is rejected.

Example: Since the jQuery.get method returns a jqXHR object, which is derived from a Deferred, you can attach a success and failure callback using the deferred.done() and deferred.fail() methods.

	$.get( "test.php" )
	.done(function() {
		alert( "$.get succeeded" );
	})
	.fail(function() {
		alert( "$.get failed!" );
	});

@param {Function|Array<Function>} failCallbacks A function, or array of functions, that are called when the Deferred is rejected. 
Optional additional functions, or arrays of functions, that are called when the Deferred is rejected.
The deferred.fail() method accepts one or more arguments, all of which can be either a single function or an array of functions. When the Deferred is rejected, the failCallbacks are called. Callbacks are executed in the order they were added. Since deferred.fail() returns the deferred object, other methods of the deferred object can be chained to this one, including additional deferred.fail() methods. The failCallbacks are executed using the arguments provided to the deferred.reject() or deferred.rejectWith() method call in the order they were added. For more information, see the documentation for Deferred object.

*/





/*

@method notify
Call the progressCallbacks on a Deferred object with the given args.

Normally, only the creator of a Deferred should call this method; you can prevent other code from changing the Deferred's state or reporting status by returning a restricted Promise object through deferred.promise().

When deferred.notify is called, any progressCallbacks added by deferred.then or deferred.progress are called. Callbacks are executed in the order they were added. Each callback is passed the args from the .notify(). Any calls to .notify() after a Deferred is resolved or rejected (or any progressCallbacks added after that) are ignored. For more information, see the documentation for Deferred object.

@param args Optional arguments that are passed to the progressCallbacks.

*/


/*
@method notifyWith

Call the progressCallbacks on a Deferred object with the given context and args.

Normally, only the creator of a Deferred should call this method; you can prevent other code from changing the Deferred's state or reporting status by returning a restricted Promise object through deferred.promise().

When deferred.notifyWith is called, any progressCallbacks added by deferred.then or deferred.progress are called. Callbacks are executed in the order they were added. Each callback is passed the args from the .notifyWith(). Any calls to .notifyWith() after a Deferred is resolved or rejected (or any progressCallbacks added after that) are ignored. For more information, see the documentation for Deferred object.

@param context {Object} Context passed to the progressCallbacks as the this object.
@param {Array} args An optional array of arguments that are passed to the progressCallbacks.

*/




/*
@method progress

Add handlers to be called when the Deferred object generates progress notifications.
The deferred.progress() method accepts one or more arguments, all of which can be either a single function or an array of functions. When the Deferred generates progress notifications by calling notify or notifyWith, the progressCallbacks are called. Since deferred.progress() returns the Deferred object, other methods of the Deferred object can be chained to this one. When the Deferred is resolved or rejected, progress callbacks will no longer be called, with the exception that any progressCallbacks added after the Deferred enters the resolved or rejected state are executed immediately when they are added, using the arguments that were passed to the .notify() or notifyWith() call. For more information, see the documentation for jQuery.Deferred().

@param {Function|Array<Function>} progressCallbacks
A function, or array of functions, to be called when the Deferred generates progress notifications.
@param {Function|Array<Function>}  progressCallbacks
Optional additional function, or array of functions, to be called when the Deferred generates progress notifications.

*/





/*
@method promise

Return a Deferred's Promise object.

The deferred.promise() method allows an asynchronous function to prevent other code from interfering with the progress or status of its internal request. The Promise exposes only the Deferred methods needed to attach additional handlers or determine the state (then, done, fail, always, pipe, progress, and state), but not ones that change the state (resolve, reject, notify, resolveWith, rejectWith, and notifyWith).

If target is provided, deferred.promise() will attach the methods onto it and then return this object rather than create a new one. This can be useful to attach the Promise behavior to an object that already exists.

If you are creating a Deferred, keep a reference to the Deferred so that it can be resolved or rejected at some point. Return only the Promise object via deferred.promise() so other code can register callbacks or inspect the current state.

For more information, see the documentation for Deferred object.

Examples: Example: Create a Deferred and set two timer-based functions to either resolve or reject the Deferred after a random interval. Whichever one fires first "wins" and will call one of the callbacks. The second timeout has no effect since the Deferred is already complete (in a resolved or rejected state) from the first timeout action. Also set a timer-based progress notification function, and call a progress handler that adds "working..." to the document body.

	function asyncEvent() {
	  var dfd = jQuery.Deferred();
	 
	  // Resolve after a random interval
	  setTimeout(function() {
	    dfd.resolve( "hurray" );
	  }, Math.floor( 400 + Math.random() * 2000 ) );
	 
	  // Reject after a random interval
	  setTimeout(function() {
	    dfd.reject( "sorry" );
	  }, Math.floor( 400 + Math.random() * 2000 ) );
	 
	  // Show a "working..." message every half-second
	  setTimeout(function working() {
	    if ( dfd.state() === "pending" ) {
	      dfd.notify( "working... " );
	      setTimeout( working, 500 );
	    }
	  }, 1 );
	 
	  // Return the Promise so caller can't change the Deferred
	  return dfd.promise();
	}
	 
	// Attach a done, fail, and progress handler for the asyncEvent
	$.when( asyncEvent() ).then(
	  function( status ) {
	    alert( status + ", things are going well" );
	  },
	  function( status ) {
	    alert( status + ", you fail this time" );
	  },
	  function( status ) {
	    $( "body" ).append( status );
	  }
	);

Example: Use the target argument to promote an existing object to a Promise:

	// Existing object
	var obj = {
	    hello: function( name ) {
	      alert( "Hello " + name );
	    }
	  },
	  // Create a Deferred
	  defer = $.Deferred();
	 
	// Set object as a promise
	defer.promise( obj );
	 
	// Resolve the deferred
	defer.resolve( "John" );
	 
	// Use the object as a Promise
	obj.done(function( name ) {
	  obj.hello( name ); // Will alert "Hello John"
	}).hello( "Karl" ); // Will alert "Hello Karl"



@param {Object}target
Object onto which the promise methods have to be attached
@return {jQuery.Deferred} Return a Deferred's Promise object.
*/



/*
@method reject
Reject a Deferred object and call any failCallbacks with the given args.

Normally, only the creator of a Deferred should call this method; you can prevent other code from changing the Deferred's state by returning a restricted Promise object through deferred.promise().

When the Deferred is rejected, any failCallbacks added by deferred.then() or deferred.fail() are called. Callbacks are executed in the order they were added. Each callback is passed the args from the deferred.reject() call. Any failCallbacks added after the Deferred enters the rejected state are executed immediately when they are added, using the arguments that were passed to the deferred.reject() call. For more information, see the documentation for jQuery.Deferred().

@param {Any} args Optional arguments that are passed to the failCallbacks.

*/