/*
@class XMLElement

XML DOM - The Element Object

The Element object represents an element in an XML document. Elements may contain attributes, other elements, or text. If an element contains text, the text is represented in a text-node.

IMPORTANT! Text is always stored in text nodes. A common error in DOM processing is to navigate to an element node and expect it to contain the text. However, even the simplest element node has a text node under it. For example, in <year>2005</year>, there is an element node (year), and a text node under it, which contains the text (2005).

Because the Element object is also a Node, it inherits the Node object's properties and methods.

@extends XMLNode



@property attributes	Returns a NamedNodeMap of attributes for the element
@property baseURI	Returns the absolute base URI of the element
@property childNodes	Returns a NodeList of child nodes for the element
@property firstChild	Returns the first child of the element
@property lastChild	Returns the last child of the element
@property localName	Returns the local part of the name of the element
@property namespaceURI	Returns the namespace URI of the element
@property nextSibling	Returns the node immediately following the element
@property nodeName	Returns the name of the node, depending on its type
@property nodeType	Returns the type of the node
@property ownerDocument	Returns the root element (document object) for an element
@property parentNode	Returns the parent node of the element
@property prefix	Sets or returns the namespace prefix of the element
@property previousSibling	Returns the node immediately before the element
@property schemaTypeInfo	Returns the type information associated with the element
@property tagName	Returns the name of the element
@property textContent	Sets or returns the text content of the element and its descendants





@method appendChild()	Adds a new child node to the end of the list of children of the node
@method cloneNode()	Clones a  node
@method compareDocumentPosition()	Compares the document position of two nodes
@method getAttribute()	Returns the value of an attribute
@method getAttributeNS()	Returns the value of an attribute (with a namespace)
@method getAttributeNode()	Returns an attribute node as an Attribute object
@method getAttributeNodeNS()	Returns an attribute node (with a namespace) as an Attribute object
@method getElementsByTagName()	Returns a NodeList of matching element nodes, and their children
@method getElementsByTagNameNS()	Returns a NodeList of matching element nodes (with a namespace), and their children
@method getFeature(feature,version)	Returns a DOM object which implements the specialized APIs of the specified feature and version
@method getUserData(key)	Returns the object associated to a key on a this node. The object must first have been set to this node by calling setUserData with the same key
@method hasAttribute()	Returns whether an element has any attributes matching a specified name
@method hasAttributeNS()	Returns whether an element has any attributes matching a specified name and namespace
@method hasAttributes()	Returns whether the element has any attributes
@method hasChildNodes()	Returns whether the element has any child nodes
@method insertBefore()	Inserts a new child node before an existing child node
@method isDefaultNamespace(URI)	Returns whether the specified namespaceURI is the default
@method isEqualNode()	Checks if two nodes are equal
@method isSameNode()	Checks if two nodes are the same node
@method isSupported(feature,version)	Returns whether a specified feature is supported on the element
@method lookupNamespaceURI()	Returns the namespace URI matching a specified prefix
@method lookupPrefix()	Returns the prefix matching a specified namespace URI
@method normalize()	Puts all text nodes underneath this element (including attributes) into a "normal" form where only structure (e.g., elements, comments, processing instructions, CDATA sections, and entity references) separates Text nodes, i.e., there are neither adjacent Text nodes nor empty Text nodes
@method removeAttribute()	Removes a specified attribute
@method removeAttributeNS()	Removes a specified attribute (with a namespace)
@method removeAttributeNode()	Removes a specified attribute node
@method removeChild()	Removes a child node
@method replaceChild()	Replaces a child node
@method setUserData(key,data,handler)	Associates an object to a key on the element
@method setAttribute()	Adds a new attribute
@method setAttributeNS()	Adds a new attribute (with a namespace)
@method setAttributeNode()	Adds a new attribute node
@method setAttributeNodeNS(attrnode)	Adds a new attribute node (with a namespace)
@method setIdAttribute(name,isId)	If the isId property of the Attribute object is true, this method declares the specified attribute to be a user-determined ID attribute
@method setIdAttributeNS(uri,name,isId)	If the isId property of the Attribute object is true, this method declares the specified attribute (with a namespace) to be a user-determined ID attribute
@method setIdAttributeNode(idAttr,isId)	If the isId property of the Attribute object is true, this method declares the specified attribute to be a user-determined ID attribute

*/