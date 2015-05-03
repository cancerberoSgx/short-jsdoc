/*@module html

@class HTMLEvent
(https://developer.mozilla.org/en-US/docs/Web/API/Event)

The Event interface represents any event of the DOM. It contains common properties and methods to any event.



@constructor Creates an Event object.



@property {Boolean} bubbles 
A boolean indicating whether the event bubbles up through the DOM or not.
@readOnly




@property {Boolean} cancelable 
A boolean indicating whether the event is cancelable.
@readOnly




@property {HTMLElement} currentTarget

Identifies the current target for the event, as the event traverses the DOM. It always refers to the element the event handler has been attached to as opposed to event.target which identifies the element on which the event occurred.

##Example

event.currentTarget is interesting to use when attaching the same event handler to several elements.

	function hide(e){
	  e.currentTarget.style.visibility = "hidden";
	  // When this function is used as an event handler: this === e.currentTarget
	}

	var ps = document.getElementsByTagName('p');

	for(var i = 0; i < ps.length; i++){
	  ps[i].addEventListener('click', hide, false);
	}

	// click around and make paragraphs disappear

##Browser compatibility
On Internet Explorer 6 through 8, the event model is different. Event listeners are attached with the non-standard element.attachEvent method. In this model, there is no equivalent to event.currentTarget and this is the global object. One solution to emulate the event.currentTarget feature is to wrap your handler in a function calling the handler using Function.prototype.call with the element as a first argument. This way, this will be the expected value.




@property {Boolean} defaultPrevented Indicates whether or not event.preventDefault() has been called on the event.







@property {Number} eventPhase

##Summary

Indicates which phase of the event flow is currently being evaluated.

##Syntax

	var phase = event.eventPhase;
	
Returns an integer value which specifies the current evaluation phase of the event flow; possible values are listed in Event phase constants.

##Event phase constants

These values describe which phase the event flow is currently being evaluated.

	Constant	Value	Description
	Event.NONE	0	No event is being processed at this time.
	Event.CAPTURING_PHASE	1	The event is being propagated through the target's ancestor objects. This process starts with the Window, then Document, then the HTMLHtmlElement, and so on through the elements until the target's parent is reached. Event listeners registered for capture mode when EventTarget.addEventListener() was called are triggered during this phase.
	Event.AT_TARGET	2	The event has arrived at the event's target. Event listeners registered for this phase are called at this time. If Event.bubbles is true, processing the event is finished after this phase is complete.
	Event.BUBBLING_PHASE	3	The event is propagating back up through the target's ancestors in reverse order, starting with the parent, and eventually reaching the containing Window. This is known as bubbling, and occurs only if Event.bubbles is true. Event listeners registered for this phase are triggered during this process.
	For more details, see section 3.1, Event dispatch and DOM event flow, of the DOM Level 3 Events specification.

##Example

	<!DOCTYPE html>
	<html>
	<head> <title>Event Propagation</title>
	  <style type="text/css">
	    div { margin: 20px; padding: 4px; border: thin black solid; }
	    #divInfo { margin: 18px; padding: 8px; background-color:white; font-size:80%; }
	  </style>
	</head>
	<body>
	  <h4>Event Propagation Chain</h4>
	  <ul>
	    <li>Click 'd1'</li>
	    <li>Analyse event propagation chain</li>
	    <li>Click next div and repeat the experience</li>
	    <li>Change Capturing mode</li>
	    <li>Repeat the experience</li>
	  </ul>
	  <input type="checkbox" id="chCapture" /> Use Capturing
	  <div id="d1">d1
	    <div id="d2">d2
	      <div id="d3">d3
	        <div id="d4">d4</div>
	      </div>
	    </div>
	  </div>
	  <div id="divInfo"></div>
	  <script>
	    var
	      clear = false,
	      divInfo = null,
	      divs = null,
	      useCapture = false;
	  window.onload = function ()
	  {
	    divInfo = document.getElementById("divInfo");
	    divs = document.getElementsByTagName('div');
	    chCapture = document.getElementById("chCapture");
	    chCapture.onclick = function ()
	    {
	      RemoveListeners();
	      AddListeners();
	    }
	    Clear();
	    AddListeners();
	  }
	  function RemoveListeners()
	  {
	    for (var i = 0; i < divs.length; i++)
	    {
	      var d = divs[i];
	      if (d.id != "divInfo")
	      {
	        d.removeEventListener("click", OnDivClick, true);
	        d.removeEventListener("click", OnDivClick, false);
	      }
	    }
	  }
	  function AddListeners()
	  {
	    for (var i = 0; i < divs.length; i++)
	    {
	      var d = divs[i];
	      if (d.id != "divInfo")
	      {
	        d.addEventListener("click", OnDivClick, false);
	        if (chCapture.checked)
	          d.addEventListener("click", OnDivClick, true);
	        d.onmousemove = function () { clear = true; };
	      }
	    }
	  }
	  function OnDivClick(e)
	  {
	    if (clear)
	    {
	      Clear();
	      clear = false;
	    }

	    if (e.eventPhase == 2)
	      e.currentTarget.style.backgroundColor = 'red';
	   
	    var level =
	        e.eventPhase == 0 ? "none" :
	        e.eventPhase == 1 ? "capturing" :
	        e.eventPhase == 2 ? "target" :
	        e.eventPhase == 3 ? "bubbling" : "error";
	    divInfo.innerHTML += e.currentTarget.id + "; eventPhase: " + level + "<br/>";
	  }
	  function Clear()
	  {
	    for (var i = 0; i < divs.length; i++)
	    {
	      if (divs[i].id != "divInfo")
	        divs[i].style.backgroundColor = (i & 1) ? "#f6eedb" : "#cceeff";
	    }
	    divInfo.innerHTML = '';
	  }
	  </script>
	</body>
	</html>







@property {HTMLElement} target A reference to the target to which the event was originally dispatched.

@property {Date} timeStamp The time that the event was created.

@property {String} type The name of the event (case-insensitive).

@property {Boolean} isTrusted Indicates whether or not the event was initiated by the browser (after a user click for instance) or by a script (using an event creation method, like event.initEvent)








@method preventDefault
##Summary
Cancels the event if it is cancelable, without stopping further propagation of the event.

##Syntax

	event.preventDefault();

##Example

Toggling a checkbox is the default action of clicking on a checkbox. This example demonstrates how to prevent that from happening:

	<!DOCTYPE html>
	<html>
	<head>
	<title>preventDefault example</title>

	<script>
	function stopDefAction(evt) {
	    evt.preventDefault();
	}
	    
	document.getElementById('my-checkbox').addEventListener(
	    'click', stopDefAction, false
	);
	</script>
	</head>

	<body>

	<p>Please click on the checkbox control.</p>

	<form>
	    <input type="checkbox" id="my-checkbox" />
	    <label for="my-checkbox">Checkbox</label>
	</form>

	</body>
	</html>

You can see preventDefault in action here.

The following example demonstrates how invalid text input can be stopped from reaching the input field with preventDefault().

	<!DOCTYPE html>
	<html>
	<head>
	<title>preventDefault example</title>

	<script>
	function Init () {
	    var myTextbox = document.getElementById('my-textbox');
	    myTextbox.addEventListener( 'keypress', checkName, false );
	}

	function checkName(evt) {
	    var charCode = evt.charCode;
	    if (charCode != 0) {
	        if (charCode < 97 || charCode > 122) {
	            evt.preventDefault();
	            alert(
	                "Please use lowercase letters only."
	                + "\n" + "charCode: " + charCode + "\n"
	            );
	        }
	    }
	}
	</script> 
	</head> 
	<body onload="Init ()"> 
	    <p>Please enter your name using lowercase letters only.</p> 
	    <form> 
	        <input type="text" id="my-textbox" /> 
	    </form> 
	</body> 
	</html>

##Notes
Calling preventDefault during any stage of event flow cancels the event, meaning that any default action normally taken by the implementation as a result of the event will not occur.

Note: As of Gecko 6.0, calling preventDefault() causes the event.defaultPrevented property's value to become true.
You can use event.cancelable to check if the event is cancelable. Calling preventDefault for a non-cancelable event has no effect.

preventDefault doesn't stop further propagation of the event through the DOM. event.stopPropagation should be used for that.








@method stopImmediatePropagation

Prevents other listeners of the same event from being called.For this particular event, no other listener will be called. Neither those attached on the same element, nor those attached on elements which will be traversed later (in capture phase, for instance)

##Syntax
	
	event.stopImmediatePropagation();

##Notes

If several listeners are attached to the same element for the same event type, they are called in order in which they have been added. If during one such call, event.stopImmediatePropagation() is called, no remaining listeners will be called.






@method stopPropagation
Prevents further propagation of the current event.

##Syntax

	event.stopPropagation();

##Example

See Example 5: Event Propagation in the Examples chapter for a more detailed example of this method and event propagation in the DOM.

##Notes

See the DOM specification for the explanation of event flow. (The DOM Level 3 Events draft has an illustration.)

preventDefault is a complementary method that can be used to prevent the default action of the event from happening.











@class HTMLMouseEvent

(form https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent)


@extends DOMEvent


*/