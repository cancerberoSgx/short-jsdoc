/*@module Backbone

@class Backbone.History

*History* serves as a global router (per frame) to handle hashchange events or pushState, match the appropriate route, and trigger callbacks. You shouldn't ever have to create one of these yourself since Backbone.history already contains one.

*pushState support* exists on a purely opt-in basis in Backbone. Older browsers that don't support pushState will continue to use hash-based URL fragments, and if a hash URL is visited by a pushState-capable browser, it will be transparently upgraded to the true URL. Note that using real URLs requires your web server to be able to correctly render those pages, so back-end changes are required as well. For example, if you have a route of /documents/100, your web server must be able to serve that page, if the browser visits that URL directly. For full search-engine crawlability, it's best to have the server generate the complete HTML for the page ... but if it's a web application, just rendering the same content you would have for the root URL, and filling in the rest with Backbone Views and JavaScript works fine.


@method start

When all of your Routers have been created, and all of the routes are set up properly, call Backbone.history.start() to begin monitoring hashchange events, and dispatching routes. Subsequent calls to Backbone.history.start() will throw an error, and Backbone.History.started is a boolean value indicating whether it has already been called.

To indicate that you'd like to use HTML5 pushState support in your application, use Backbone.history.start({pushState: true}). If you'd like to use pushState, but have browsers that don't support it natively use full page refreshes instead, you can add {hashChange: false} to the options.

If your application is not being served from the root url / of your domain, be sure to tell History where the root really is, as an option: Backbone.history.start({pushState: true, root: "/public/search/"})

When called, if a route succeeds with a match for the current URL, Backbone.history.start() returns true. If no defined route matches the current URL, it returns false.

If the server has already rendered the entire page, and you don't want the initial route to trigger when starting History, pass silent: true.

Because hash-based history in Internet Explorer relies on an <iframe>, be sure to only call start() after the DOM is ready.

	$(function(){
	  new WorkspaceRouter();
	  new HelpPaneRouter();
	  Backbone.history.start({pushState: true});
	});

@param {Object} options

*/