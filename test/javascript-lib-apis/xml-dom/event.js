/*
@module xml.dom

@class DOMEvent 

(from http://www.w3.org/TR/DOM-Level-2-Events/events.html#Events-Event)

The Event interface is used to provide contextual information about an event to the handler processing the event. An object which implements the Event interface is generally passed as the first parameter to an event handler. More specific context information is passed to event handlers by deriving additional interfaces from Event which contain information directly relating to the type of event they accompany. These derived interfaces are also implemented by the object passed to the event listener.


*/


/*


@property bubbles of type boolean, readonly
Used to indicate whether or not an event is a bubbling event. If the event can bubble the value is true, else the value is false.
@property cancelable of type boolean, readonly
Used to indicate whether or not an event can have its default action prevented. If the default action can be prevented the value is true, else the value is false.
@property currentTarget of type EventTarget, readonly
Used to indicate the EventTarget whose EventListeners are currently being processed. This is particularly useful during capturing and bubbling.
@property eventPhase of type unsigned short, readonly
Used to indicate which phase of event flow is currently being evaluated.
@property target of type EventTarget, readonly
Used to indicate the EventTarget to which the event was originally dispatched.
@property timeStamp of type DOMTimeStamp, readonly
Used to specify the time (in milliseconds relative to the epoch) at which the event was created. Due to the fact that some systems may not provide this information the value of timeStamp may be not available for all events. When not available, a value of 0 will be returned. Examples of epoch time are the time of the system start or 0:0:0 UTC 1st January 1970.
@property type of type DOMString, readonly
The name of the event (case-insensitive). The name must be an XML name.

@method initEvent
The initEvent method is used to initialize the value of an Event created through the DocumentEvent interface. This method may only be called before the Event has been dispatched via the dispatchEvent method, though it may be called multiple times during that phase if necessary. If called multiple times the final invocation takes precedence. If called from a subclass of Event interface only the values specified in the initEvent method are modified, all other attributes are left unchanged.
@param eventTypeArg of type DOMString
Specifies the event type. This type may be any event type currently defined in this specification or a new event type.. The string must be an XML name.
Any new event type must not begin with any upper, lower, or mixed case version of the string "DOM". This prefix is reserved for future DOM event sets. It is also strongly recommended that third parties adding their own events use their own prefix to avoid confusion and lessen the probability of conflicts with other new events.
@param canBubbleArg of type boolean
Specifies whether or not the event can bubble.
@param cancelableArg of type boolean
Specifies whether or not the event's default action can be prevented.
No Return Value
No Exceptions

@method preventDefault
If an event is cancelable, the preventDefault method is used to signify that the event is to be canceled, meaning any default action normally taken by the implementation as a result of the event will not occur. If, during any stage of event flow, the preventDefault method is called the event is canceled. Any default action associated with the event will not occur. Calling this method for a non-cancelable event has no effect. Once preventDefault has been called it will remain in effect throughout the remainder of the event's propagation. This method may be used during any stage of event flow.
No Parameters
No Return Value
No Exceptions

@method stopPropagation
The stopPropagation method is used prevent further propagation of an event during event flow. If this method is called by any EventListener the event will cease propagating through the tree. The event will complete dispatch to all listeners on the current EventTarget before event flow stops. This method may be used during any stage of event flow.
No Parameters
No Return Value
No Exceptions


*/




/*

@class DOMEventTarget


*/





/*

@class DOMMouseEvent


*/