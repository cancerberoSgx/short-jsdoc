/*@module xml.dom
@class XMLDocument

XML DOM - The Document Object

The Document object represents the entire XML document.

The Document object is the root of a document tree, and gives us the primary access to the document's data.

Since element nodes, text nodes, comments, processing instructions, etc. cannot exist outside the document, the Document object also contains methods to create these objects. The Node objects have a ownerDocument property which associates them with the Document where they were created.





@property async	Specifies whether downloading of an XML file should be handled asynchronously or not
@property childNodes	Returns a NodeList of child nodes for the document
@property doctype	Returns the Document Type Declaration associated with the document
@property documentElement	Returns the root node of the document
@property documentURI	Sets or returns the location of the document
@property domConfig	Returns the configuration used when normalizeDocument() is invoked
@property firstChild	Returns the first child node of the document
@property implementation	Returns the DOMImplementation object that handles this document
@property inputEncoding	Returns the encoding used for the document (when parsing)
@property lastChild	Returns the last child node of the document
@property nodeName	Returns the name of a node (depending on its type)
@property nodeType	Returns the node type of a node
@property nodeValue	Sets or returns the value of a node (depending on its type)
@property strictErrorChecking	Sets or returns whether error-checking is enforced or not
@property xmlEncoding	Returns the XML encoding of the document
@property xmlStandalone	Sets or returns whether the document is standalone
@property xmlVersion	Sets or returns the XML version of the document


@method adoptNode(sourcenode)	Adopts a node from another document to this document, and returns the adopted node
@method createAttribute(name)	Creates an attribute node with the specified name, and returns the new Attr object
@method createAttributeNS(uri,name)	Creates an attribute node with the specified name and namespace, and returns the new Attr object
@method createCDATASection()	Creates a CDATA section node
@method createComment()	Creates a comment node
@method createDocumentFragment()	Creates an empty DocumentFragment object, and returns it
@method createElement()	Creates an element node
@method createElementNS()	Creates an element node with a specified namespace
@method createEntityReference(name)	Creates an EntityReference object, and returns it
@method createProcessingInstruction(target,data)	Creates a ProcessingInstruction object, and returns it
@method createTextNode()	Creates a text node
@method getElementById(id)	Returns the element that has an ID attribute with the given value. If no such element exists, it returns null
@method getElementsByTagName()	Returns a NodeList of all elements with a specified name
@method getElementsByTagNameNS()	Returns a NodeList of all elements with a specified name and namespace
@method importNode(nodetoimport,deep)	Imports a node from another document to this document. This method creates a new copy of the source node. If the deep parameter is set to true, it imports all children of the specified node. If set to false, it imports only the node itself. This method returns the imported node
@method normalizeDocument()	 
@method renameNode()	Renames an element or attribute node



*/





/*
@class XMLDocumentType

The DocumentType object. 
Each document has a DOCTYPE attribute that whose value is either null or a DocumentType object.

The DocumentType object provides an interface to the entities defined for an XML document.

@property entities	Returns a NamedNodeMap containing the entities declared in the DTD
@property internalSubset	Returns the internal DTD as a string
@property name	Returns the name of the DTD
@property notations	Returns a NamedNodeMap containing the notations declared in	the DTD
@property systemId	Returns the system identifier of the external DTD
*/