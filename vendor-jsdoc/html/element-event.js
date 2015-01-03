/*@module html 


@class HTMLElement @extends XMLNode

#Events 

Taken from http://www.w3schools.com/tags/ref_eventattributes.asp

HTML 4 added the ability to let events trigger actions in a browser, like starting a JavaScript when a user clicks on an element.





@event onafterprint		Script to be run after the document is printed

@event onbeforeprint	Script to be run before the document is printed. Note: this is a Window Event Attribute, triggered for the window object (applies to the <body> tag). Compatible with HTML5

@event onbeforeunload		Script to be run when the document is about to be unloaded. Note: this is a Window Event Attribute, triggered for the window object (applies to the <body> tag). Compatible with HTML5

@event onerror		Script to be run when an error occur. Note: this is a Window Event Attribute, triggered for the window object (applies to the <body> tag). Compatible with HTML5

@event onhashchange		Script to be run when there has been changes to the anchor part of the a URL. Note: this is a Window Event Attribute, triggered for the window object (applies to the <body> tag). Compatible with HTML5

@event onload		Fires after the page is finished loading. Note: this is a Window Event Attribute, triggered for the window object (applies to the <body> tag). Compatible with HTML5

@event onmessage		Script to be run when the message is triggered. Note: this is a Window Event Attribute, triggered for the window object (applies to the <body> tag). Compatible with HTML5

@event onoffline		Script to be run when the browser starts to work offline. Note: this is a Window Event Attribute, triggered for the window object (applies to the <body> tag). Compatible with HTML5

@event ononline		Script to be run when the browser starts to work online. Note: this is a Window Event Attribute, triggered for the window object (applies to the <body> tag). Compatible with HTML5

@event onpagehide		Script to be run when a user navigates away from a page. Note: this is a Window Event Attribute, triggered for the window object (applies to the <body> tag). Compatible with HTML5

@event onpageshow		Script to be run when a user navigates to a page. Note: this is a Window Event Attribute, triggered for the window object (applies to the <body> tag). Compatible with HTML5

@event onpopstate		Script to be run when the window's history changes. Note: this is a Window Event Attribute, triggered for the window object (applies to the <body> tag). Compatible with HTML5

@event onresize		Fires when the browser window is resized. Note: this is a Window Event Attribute, triggered for the window object (applies to the <body> tag). Compatible with HTML5

@event onstorage		Script to be run when a Web Storage area is updated. Note: this is a Window Event Attribute, triggered for the window object (applies to the <body> tag). Compatible with HTML5

@event onunload		Fires once a page has unloaded (or the browser window has been closed). Note: this is a Window Event Attribute, triggered for the window object (applies to the <body> tag). Compatible with HTML5







@event onblur	Fires the moment that the element loses focus. Note: this is a Form Event, triggered by actions inside a HTML form (applies to almost all HTML elements, but is most used in form elements)
@event onchange	Fires the moment when the value of the element is changed. Note: this is a Form Event, triggered by actions inside a HTML form (applies to almost all HTML elements, but is most used in form elements)
@event oncontextmenu		Script to be run when a context menu is triggered. Note: this is a Form Event, triggered by actions inside a HTML form (applies to almost all HTML elements, but is most used in form elements)
@event onfocus		Fires the moment when the element gets focus. Note: this is a Form Event, triggered by actions inside a HTML form (applies to almost all HTML elements, but is most used in form elements)
@event oninput		Script to be run when an element gets user input. Note: this is a Form Event, triggered by actions inside a HTML form (applies to almost all HTML elements, but is most used in form elements)
@event oninvalid		Script to be run when an element is invalid. Note: this is a Form Event, triggered by actions inside a HTML form (applies to almost all HTML elements, but is most used in form elements)
@event onreset		Fires when the Reset button in a form is clicked. Note: this is a Form Event, triggered by actions inside a HTML form (applies to almost all HTML elements, but is most used in form elements)
@event onsearch		Fires when the user writes something in a search field (for <input="search">). Note: this is a Form Event, triggered by actions inside a HTML form (applies to almost all HTML elements, but is most used in form elements)
@event onselect		Fires after some text has been selected in an element. Note: this is a Form Event, triggered by actions inside a HTML form (applies to almost all HTML elements, but is most used in form elements)
@event onsubmit	script	Fires when a form is submitted. Note: this is a Form Event, triggered by actions inside a HTML form (applies to almost all HTML elements, but is most used in form elements)






@event onkeydown		Fires when a user is pressing a key. This is a Keyboard Event
@event onkeypress		Fires when a user presses a key. This is a Keyboard Event
@event onkeyup		Fires when a user releases a key. This is a Keyboard Event








@event onclick	script	Fires on a mouse click on the element. Note: This is a Mouse Event, triggered by a mouse, or similar user actions
@event ondblclick	script	Fires on a mouse double-click on the element. Note: This is a Mouse Event, triggered by a mouse, or similar user actions
@event ondrag	script	Script to be run when an element is dragged. Note: This is a Mouse Event, triggered by a mouse, or similar user actions
@event ondragend	script	Script to be run at the end of a drag operation. Note: This is a Mouse Event, triggered by a mouse, or similar user actions
@event ondragenter	script	Script to be run when an element has been dragged to a valid drop target. Note: This is a Mouse Event, triggered by a mouse, or similar user actions
@event ondragleave	script	Script to be run when an element leaves a valid drop target. Note: This is a Mouse Event, triggered by a mouse, or similar user actions
@event ondragover	script	Script to be run when an element is being dragged over a valid drop target. Note: This is a Mouse Event, triggered by a mouse, or similar user actions
@event ondragstart	script	Script to be run at the start of a drag operation. Note: This is a Mouse Event, triggered by a mouse, or similar user actions
@event ondrop	script	Script to be run when dragged element is being dropped. Note: This is a Mouse Event, triggered by a mouse, or similar user actions
@event onmousedown	script	Fires when a mouse button is pressed down on an element. Note: This is a Mouse Event, triggered by a mouse, or similar user actions
@event onmousemove	script	Fires when the mouse pointer is moving while it is over an element. Note: This is a Mouse Event, triggered by a mouse, or similar user actions
@event onmouseout	script	Fires when the mouse pointer moves out of an element. Note: This is a Mouse Event, triggered by a mouse, or similar user actions
@event onmouseover	script	Fires when the mouse pointer moves over an element. Note: This is a Mouse Event, triggered by a mouse, or similar user actions
@event onmouseup	script	Fires when a mouse button is released over an element. Note: This is a Mouse Event, triggered by a mouse, or similar user actions
@event onmousewheel	script	Deprecated. Use the onwheel attribute instead. Note: This is a Mouse Event, triggered by a mouse, or similar user actions
@event onscroll	script	Script to be run when an element's scrollbar is being scrolled. Note: This is a Mouse Event, triggered by a mouse, or similar user actions
@event onwheel	script	Fires when the mouse wheel rolls up or down over an element. Note: This is a Mouse Event, triggered by a mouse, or similar user actions

*/





/*

@event oncopy	script	Fires when the user copies the content of an element. Note: this is a Clipboard Event
@event oncut	script	Fires when the user cuts the content of an element. Note: this is a Clipboard Event
@event onpaste	script	Fires when the user pastes some content in an element. Note: this is a Clipboard Event
*/




/*

@event onabort	script	Script to be run on abort. Note: this is a Media Event. Compatible with HTML5. triggered by medias like videos, images and audio (applies to all HTML elements, but is most common in media elements, like <audio>, <embed>, <img>, <object>, and <video>). 
@event oncanplay	script	Script to be run when a file is ready to start playing (when it has buffered enough to begin). Note: this is a Media Event. Compatible with HTML5. triggered by medias like videos, images and audio (applies to all HTML elements, but is most common in media elements, like <audio>, <embed>, <img>, <object>, and <video>). 
@event oncanplaythrough	script	Script to be run when a file can be played all the way to the end without pausing for buffering. Note: this is a Media Event. Compatible with HTML5. triggered by medias like videos, images and audio (applies to all HTML elements, but is most common in media elements, like <audio>, <embed>, <img>, <object>, and <video>). 
@event oncuechange	script	Script to be run when the cue changes in a <track> element. Note: this is a Media Event. Compatible with HTML5. triggered by medias like videos, images and audio (applies to all HTML elements, but is most common in media elements, like <audio>, <embed>, <img>, <object>, and <video>). 
@event ondurationchange	script	Script to be run when the length of the media changes. Note: this is a Media Event. Compatible with HTML5. triggered by medias like videos, images and audio (applies to all HTML elements, but is most common in media elements, like <audio>, <embed>, <img>, <object>, and <video>). 
@event onemptied	script	Script to be run when something bad happens and the file is suddenly unavailable (like unexpectedly disconnects). Note: this is a Media Event. Compatible with HTML5. triggered by medias like videos, images and audio (applies to all HTML elements, but is most common in media elements, like <audio>, <embed>, <img>, <object>, and <video>). 
@event onended	script	Script to be run when the media has reach the end (a useful event for messages like "thanks for listening"). Note: this is a Media Event. Compatible with HTML5. triggered by medias like videos, images and audio (applies to all HTML elements, but is most common in media elements, like <audio>, <embed>, <img>, <object>, and <video>). 
@event onerror	script	Script to be run when an error occurs when the file is being loaded. Note: this is a Media Event. Compatible with HTML5. triggered by medias like videos, images and audio (applies to all HTML elements, but is most common in media elements, like <audio>, <embed>, <img>, <object>, and <video>). 
@event onloadeddata	script	Script to be run when media data is loaded. Note: this is a Media Event. Compatible with HTML5. triggered by medias like videos, images and audio (applies to all HTML elements, but is most common in media elements, like <audio>, <embed>, <img>, <object>, and <video>). 
@event onloadedmetadata	script	Script to be run when meta data (like dimensions and duration) are loaded. Note: this is a Media Event. Compatible with HTML5. triggered by medias like videos, images and audio (applies to all HTML elements, but is most common in media elements, like <audio>, <embed>, <img>, <object>, and <video>). 
@event onloadstart	script	Script to be run just as the file begins to load before anything is actually loaded. Note: this is a Media Event. Compatible with HTML5. triggered by medias like videos, images and audio (applies to all HTML elements, but is most common in media elements, like <audio>, <embed>, <img>, <object>, and <video>). 
@event onpause	script	Script to be run when the media is paused either by the user or programmatically. Note: this is a Media Event. Compatible with HTML5. triggered by medias like videos, images and audio (applies to all HTML elements, but is most common in media elements, like <audio>, <embed>, <img>, <object>, and <video>). 
@event onplay	script	Script to be run when the media is ready to start playing. Note: this is a Media Event. Compatible with HTML5. triggered by medias like videos, images and audio (applies to all HTML elements, but is most common in media elements, like <audio>, <embed>, <img>, <object>, and <video>). 
@event onplaying	script	Script to be run when the media actually has started playing. Note: this is a Media Event. Compatible with HTML5. triggered by medias like videos, images and audio (applies to all HTML elements, but is most common in media elements, like <audio>, <embed>, <img>, <object>, and <video>). 
@event onprogress	script	Script to be run when the browser is in the process of getting the media data. Note: this is a Media Event. Compatible with HTML5. triggered by medias like videos, images and audio (applies to all HTML elements, but is most common in media elements, like <audio>, <embed>, <img>, <object>, and <video>). 
@event onratechange	script	Script to be run each time the playback rate changes (like when a user switches to a slow motion or fast forward mode). Note: this is a Media Event. Compatible with HTML5. triggered by medias like videos, images and audio (applies to all HTML elements, but is most common in media elements, like <audio>, <embed>, <img>, <object>, and <video>). 
@event onseeked	script	Script to be run when the seeking attribute is set to false indicating that seeking has ended. Note: this is a Media Event. Compatible with HTML5. triggered by medias like videos, images and audio (applies to all HTML elements, but is most common in media elements, like <audio>, <embed>, <img>, <object>, and <video>). 
@event onseeking	script	Script to be run when the seeking attribute is set to true indicating that seeking is active. Note: this is a Media Event. Compatible with HTML5. triggered by medias like videos, images and audio (applies to all HTML elements, but is most common in media elements, like <audio>, <embed>, <img>, <object>, and <video>). 
@event onstalled	script	Script to be run when the browser is unable to fetch the media data for whatever reason. Note: this is a Media Event. Compatible with HTML5. triggered by medias like videos, images and audio (applies to all HTML elements, but is most common in media elements, like <audio>, <embed>, <img>, <object>, and <video>). 
@event onsuspend	script	Script to be run when fetching the media data is stopped before it is completely loaded for whatever reason. Note: this is a Media Event. Compatible with HTML5. triggered by medias like videos, images and audio (applies to all HTML elements, but is most common in media elements, like <audio>, <embed>, <img>, <object>, and <video>). 
@event ontimeupdate	script	Script to be run when the playing position has changed (like when the user fast forwards to a different point in the media). Note: this is a Media Event. Compatible with HTML5. triggered by medias like videos, images and audio (applies to all HTML elements, but is most common in media elements, like <audio>, <embed>, <img>, <object>, and <video>). 
@event onvolumechange	script	Script to be run each time the volume is changed which (includes setting the volume to "mute"). Note: this is a Media Event. Compatible with HTML5. triggered by medias like videos, images and audio (applies to all HTML elements, but is most common in media elements, like <audio>, <embed>, <img>, <object>, and <video>). 
@event onwaiting	script	Script to be run when the media has paused but is expected to resume (like when the media pauses to buffer more data). Note: this is a Media Event. Compatible with HTML5. triggered by medias like videos, images and audio (applies to all HTML elements, but is most common in media elements, like <audio>, <embed>, <img>, <object>, and <video>). 


*/



/*

@event onerror	script	Fires when an error occurs while loading an external file. This is a Misc type Event. Comatible with HTML5. 
@event onshow	script	Fires when a <menu> element is shown as a context menu. This is a Misc type Event. Comatible with HTML5. 
@event ontoggle	script	Fires when the user opens or closes the <details> element. This is a Misc type Event. Comatible with HTML5. 
