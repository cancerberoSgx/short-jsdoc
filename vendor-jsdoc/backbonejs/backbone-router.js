/*
@module Backbone
@class Backbone.Router

Web applications often provide linkable, bookmarkable, shareable URLs for important locations in the app. Until recently, hash fragments (#page) were used to provide these permalinks, but with the arrival of the History API, it's now possible to use standard URLs (/page). Backbone.Router provides methods for routing client-side pages, and connecting them to actions and events. For browsers which don't yet support the History API, the Router handles graceful fallback and transparent translation to the fragment version of the URL.

During page load, after your application has finished creating all of its routers, be sure to call Backbone.history.start(), or Backbone.history.start({pushState: true}) to route the initial URL.

*/



/*
@method extend 

Get started by creating a custom router class. Define actions that are triggered when certain URL fragments are matched, and provide a routes hash that pairs routes to actions. Note that you'll want to avoid using a leading slash in your route definitions:

	var Workspace = Backbone.Router.extend({

	  routes: {
	    "help":                 "help",    // #help
	    "search/:query":        "search",  // #search/kiwis
	    "search/:query/p:page": "search"   // #search/kiwis/p7
	  },

	  help: function() {
	    ...
	  },

	  search: function(query, page) {
	    ...
	  }

	});

@param {Object} properties
@param {Object} classProperties Optional
@static
*/

/*

@property {Object<String,String>}routes

The routes hash maps URLs with parameters to functions on your router (or just direct function definitions, if you prefer), similar to the View's events hash. Routes can contain parameter parts, :param, which match a single URL component between slashes; and splat parts *splat, which can match any number of URL components. Part of a route can be made optional by surrounding it in parentheses (/:optional).

For example, a route of "search/:query/p:page" will match a fragment of #search/obama/p2, passing "obama" and "2" to the action.

A route of "file/*path" will match #file/nested/folder/file.txt, passing "nested/folder/file.txt" to the action.

A route of "docs/:section(/:subsection)" will match #docs/faq and #docs/faq/installing, passing "faq" to the action in the first case, and passing "faq" and "installing" to the action in the second.

Trailing slashes are treated as part of the URL, and (correctly) treated as a unique route when accessed. docs and docs/ will fire different callbacks. If you can't avoid generating both types of URLs, you can define a "docs(/)" matcher to capture both cases.

When the visitor presses the back button, or enters a URL, and a particular route is matched, the name of the action will be fired as an event, so that other objects can listen to the router, and be notified. In the following example, visiting #help/uploading will fire a route:help event from the router.

	routes: {
	  "help/:page":         "help",
	  "download/*path":     "download",
	  "folder/:name":       "openFolder",
	  "folder/:name-:mode": "openFolder"
	}
	router.on("route:help", function(page) {
	  ...
	});

*/


/*@constructor
When creating a new router, you may pass its routes hash directly as an option, if you choose. All options will also be passed to your initialize function, if defined.
@param {Object}options Optional
*/



/*
@method route

Manually create a route for the router, The route argument may be a routing string or regular expression. Each matching capture from the route or regular expression will be passed as an argument to the callback. The name argument will be triggered as a "route:name" event whenever the route is matched. If the callback argument is omitted router[name] will be used instead. Routes added later may override previously declared routes.

	initialize: function(options) {

	  // Matches #page/10, passing "10"
	  this.route("page/:number", "page", function(number){ ... });

	  // Matches /117-a/b/c/open, passing "117-a/b/c" to this.open
	  this.route(/^(.*?)\/open$/, "open");

	},

	open: function(id) { ... }

@param {String}route
@param {String } name
@param {Function} handler Optional
*/




/*
@method navigate
Whenever you reach a point in your application that you'd like to save as a URL, call navigate in order to update the URL. If you wish to also call the route function, set the trigger option to true. To update the URL without creating an entry in the browser's history, set the replace option to true.

	openPage: function(pageNumber) {
	  this.document.pages.at(pageNumber).open();
	  this.navigate("page/" + pageNumber);
	}

# Or ...

	app.navigate("help/troubleshooting", {trigger: true});

Or ...

	app.navigate("help/troubleshooting", {trigger: true, replace: true});

@param {String} fragment
@param {Object}options Optional
*/


/*
@method execute

This method is called internally within the router, whenever a route matches and its corresponding callback is about to be executed. Override it to perform custom parsing or wrapping of your routes, for example, to parse query strings before handing them to your route callback, like so:

	var Router = Backbone.Router.extend({
	  execute: function(callback, args) {
	    args.push(parseQueryString(args.pop()));
	    if (callback) callback.apply(this, args);
	  }
	});

@param {Function} callback
@param {Any} args
*/