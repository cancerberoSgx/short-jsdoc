/*

@module xml.dom

@class XMLNodeList

XML DOM - The NodeList Object

The NodeList object represents an ordered list of nodes.

The nodes in the node list can be accessed through their index number (starting from 0).

The node list keeps itself up-to-date. If an element is deleted or added, in the node list or the XML document, the list is automatically updated.

Note: In a node list, the nodes are returned in the order in which they are specified in the XML document.

@property length_ Returns the number of nodes in a node list k

@method item @param {Number} i @return {XMLNode}Returns the node at the specified index in a node list 

*/