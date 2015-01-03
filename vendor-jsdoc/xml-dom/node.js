/*
@module xml.dom

@class XMLNode

(from http://www.w3schools.com/dom/dom_node.asp)

XML DOM - The Node Object

The Node object represents a single node in the document tree.

A node can be an element node, an attribute node, a text node, or any other of the node types explained in the Node Types chapter.

Notice that while all objects inherits the Node properties / methods for dealing with parents and children, not all objects can have parents or children. For example, Text nodes may not have children, and adding children to such nodes results in a DOM error.

*/



/*

@property {Object} attributes	A NamedNodeMap containing the attributes of this node (if it is an Element)
@property {String} baseURI	Returns the absolute base URI of a node



@property {XMLNodeList} childNodes	Returns a NodeList of child nodes for a node

##Definition and Usage
The childNodes property returns a NodeList of child nodes for the specified node.

Tip: You can use the length property to determine the number of child nodes, then you can loop through all child nodes and extract the info you want.

##Browser Support
Internet Explorer Firefox Opera Google Chrome Safari

The childNodes property is supported in all major browsers.

##Return Value:	
A NodeList object representing a collection of nodes
DOM Version	Core Level 1

##Example
The following code fragment loads "books.xml" into xmlDoc using loadXMLDoc() and displays the child nodes of the XML document:

	xmlDoc = loadXMLDoc("books.xml");

	x = xmlDoc.childNodes;
	for (i=0; i<x.length; i++)
	  {
	  document.write("Nodename: " + x[i].nodeName);
	  document.write(" (nodetype: " + x[i].nodeType + ")<br>");
	  }

Output IE:

	Nodename: xml (nodetype: 7)
	Nodename: #comment (nodetype: 8)
	Nodename: bookstore (nodetype: 1)

Output Firefox, Opera, Chrome, and Safari :

	Nodename: #comment (nodetype: 8)
	Nodename: bookstore (nodetype: 1)












@property firstChild	Returns the first child of a node
@property lastChild	Returns the last child of a node
@property localName	Returns the local part of the name of a node
@property namespaceURI	Returns the namespace URI of a node
@property nextSibling	Returns the node immediately following a node
@property nodeName	Returns the name of a node, depending on its type
@property nodeType	Returns the type of a node
@property nodeValue	Sets or returns the value of a node, depending on its type
@property ownerDocument	Returns the root element (document object) for a node
@property parentNode	Returns the parent node of a node
@property prefix	Sets or returns the namespace prefix of a node
@property previousSibling	Returns the node immediately before a node
@property textContent	Sets or returns the textual content of a node and its descendants

*/




/*

@method appendChild	Appends a new child node to the end of the list of children of a node
@method cloneNode	Clones a node
@method compareDocumentPosition	Compares the placement of two nodes in the DOM hierarchy (document)
@method getFeature(feature,version)	Returns a DOM object which implements the specialized APIs of the specified feature and version
@method getUserData(key)	Returns the object associated to a key on a this node. The object must first have been set to this node by calling setUserData with the same key
@method hasAttributes	Returns true if the specified node has any attributes, otherwise false
@method hasChildNodes	Returns true if the specified node has any child nodes, otherwise false
@method insertBefore	Inserts a new child node before an existing child node
@method isDefaultNamespace(URI)	Returns whether the specified namespaceURI is the default
@method isEqualNode	Tests whether two nodes are equal
@method isSameNode	Tests whether the two nodes are the same node
@method isSupported	Tests whether the DOM implementation supports a specific feature and that the feature is supported by the specified node
@method lookupNamespaceURI	Returns the namespace URI associated with a given prefix
@method lookupPrefix	Returns the prefix associated with a given namespace URI
@method normalize	Puts all Text nodes underneath a node (including attribute nodes) into a "normal" form where only structure (e.g., elements, comments, processing instructions, CDATA sections, and entity references) separates Text nodes, i.e., there are neither adjacent Text nodes nor empty Text nodes
@method removeChild	Removes a specified child node from the current node
@method replaceChild	Replaces a child node with a new node
@method setUserData(key,data,handler)	Associates an object to a key on a node
*/

