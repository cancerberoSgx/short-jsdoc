//@module shortjsdoc.html
//@class IndexView display the full AST @extends AbstractView
var AbstractTreeView = AbstractView.extend({


	expandAll: function()
	{
		var self = this;
		this.$('.tree [data-tree-node]').each(function()
		{			
			self.treeView.expandNode($(this));
		}); 
	}

,	collapseAll: function()
	{
		var self = this;
		this.$('.tree > ul > .tree-node > [data-tree-node]').each(function()
		{			
			self.treeView.collapseNode($(this));
		}); 
	}


});








//TreeWidget - reusable GUI component
(function(){



/** 
TreeWidget - bootstrap based TreeView. Usage: 
<pre>var model = {children: [
	{label: '1',  children: [
		{label: '1.1', type: 'apple', children: []}
	]}
,   {label: '2', children: [
		{label: '2.1', type: 'orange', children: []}
	]}
]};
var widget = new TreeWidget(model);
widget.render('#mytree');
widget.onNodeEvent('click', function(nodeModel){
	alert(nodeModel.label+' was clicked')
})
</pre> 
@class TreeWidget
@author Sebastián Gurin
*/

if(window.TreeWidget) {
	return;
}

// @constructor @param {Object} rootNode
var TreeWidget = function(rootNode) {
	//@property {TreeNode} rootNode
	this.rootNode = rootNode;

}; 

/*
@property {Object}TreeWidget.cssOptions configurable css options
@static
*/
TreeWidget.cssOptions = {
	hoverChildren: false
,   hoverColor: 'red'
}; 



/*
@method render
@param {HTMLElement} parent HtmlElement - optional if passed the tree will be created and appended to it
@return {String} the html markup of the tree ready to be append() or html()
*/
TreeWidget.prototype.render = function(parent) 
{
	this.parentEl = parent;
	return this._renderTree(this.rootNode, parent); 
}; 
TreeWidget.prototype._renderTree = function(tree, parent) 
{
	var self = this, html = this.renderNode({node: tree, renderNode: this.renderNode, isRoot: true});
	if(parent) 
	{    
		jQuery(parent).empty().append(html);    
	}
	//TODO: use less global selectors
	$('.tree li:has(ul)').addClass('parent_li').find(' > span').attr('title', 'Collapse this branch');
	$('.tree li.parent_li > span').on('click', function (e) 
	{
		var children = $(this).parent('li.parent_li').find(' > ul > li');
		if (children.is(":visible")) {
			self.collapseNode($(this));			
		} else {
			self.expandNode($(this));
		}
		e.stopPropagation();
	});
	return html; 
}; 

TreeWidget.prototype.collapseNode = function($node)
{
	var children = $node.parent('li.parent_li').find(' > ul > li');
	children.hide('fast');
	// glyphicon glyphicon-minus
	$node.attr('title', 'Expand this branch').find(' > i').addClass('glyphicon-plus-sign').removeClass('glyphicon-minus-sign');
	// $node.attr('title', 'Expand this branch').find(' > i').addClass('icon-plus-sign').removeClass('icon-minus-sign');
}; 
TreeWidget.prototype.expandNode = function($node)
{
	var children = $node.parent('li.parent_li').find(' > ul > li');
	children.show('fast');
	// $node.attr('title', 'Collapse this branch').find(' > i').addClass('icon-minus-sign').removeClass('icon-plus-sign');
	$node.attr('title', 'Collapse this branch').find(' > i').addClass('glyphicon-minus-sign').removeClass('glyphicon-plus-sign');
}; 

/*@method onNodeEvent. Usage example: 
	treeWidget.onNodeEvent =('click', function(node, event){...}); 
@method onNodeEvent @param {String} eventType @param {Function} fn
*/
TreeWidget.prototype.onNodeEvent = function(eventType, fn) {	
	jQuery(this.parentEl).on(eventType, 'li > span', function()
	{ //event delegation		
		var nodeId = parseInt($(this).data('tree-node-id')); 
		fn && fn(this, nodeId); 
	}); 
}; 
 

window.TreeWidget = TreeWidget;




TreeWidget.treeNodeTemplate = 
'<% var isRoot = isRoot || false; %>'+
'<% if(isRoot) { %>'+
'<div class="tree">'+
'<% } else { %>'+
'<li class="tree-node tree-node-type-<%= node.type %>">'+
	'<span data-tree-node data-tree-node-id="<%= node.tree_node_id %>">'+
		'<i class="glyphicon glyphicon-minus-sign"></i>'+
		'<%= node.label%>'+
	'</span>'+
'<% } %>'+
	'<% if(node.children) { %>'+
	'<ul>'+
	'<% _(node.children).each(function(child){ %>'+
		'<%= renderNode({node:child, isRoot: false, renderNode: renderNode}) %>'+
	'<% }) %>'+
	'</ul>'+
	'<% } %>'+
'<%= isRoot ? \'</div>\' : \'</li>\' %>';

TreeWidget.prototype.renderNode = _(TreeWidget.treeNodeTemplate).template();

// TreeWidget.CSS = 
// '<style type=\"text/css\">\n'+
// '.tree {\n'+
// '    min-height:20px;\n'+
// '    padding:19px;\n'+
// '    margin-bottom:20px;\n'+
// '    background-color:#fbfbfb;\n'+
// '    border:1px solid #999;\n'+
// '    -webkit-border-radius:4px;\n'+
// '    -moz-border-radius:4px;\n'+
// '    border-radius:4px;\n'+
// '    -webkit-box-shadow:inset 0 1px 1px rgba(0, 0, 0, 0.05);\n'+
// '    -moz-box-shadow:inset 0 1px 1px rgba(0, 0, 0, 0.05);\n'+
// '    box-shadow:inset 0 1px 1px rgba(0, 0, 0, 0.05)\n'+
// '}\n'+
// '.tree li {\n'+
// '    list-style-type:none;\n'+
// '    margin:0;\n'+
// '    padding:10px 5px 0 5px;\n'+
// '    position:relative\n'+
// '}\n'+
// '.tree li::before, .tree li::after {\n'+
// '    content:\'\';\n'+
// '    left:-20px;\n'+
// '    position:absolute;\n'+
// '    right:auto\n'+
// '}\n'+
// '.tree li::before {\n'+
// '    border-left:1px solid #999;\n'+
// '    bottom:50px;\n'+
// '    height:100%;\n'+
// '    top:0;\n'+
// '    width:1px\n'+
// '}\n'+
// '.tree li::after {\n'+
// '    border-top:1px solid #999;\n'+
// '    height:20px;\n'+
// '    top:25px;\n'+
// '    width:25px\n'+
// '}\n'+
// '.tree li span {\n'+
// '    -moz-border-radius:5px;\n'+
// '    -webkit-border-radius:5px;\n'+
// '    border:1px solid #999;\n'+
// '    border-radius:5px;\n'+
// '    display:inline-block;\n'+
// '    padding:3px 8px;\n'+
// '    text-decoration:none\n'+
// '}\n'+
// '.tree li.parent_li>span {\n'+
// '    cursor:pointer\n'+
// '}\n'+
// '.tree>ul>li::before, .tree>ul>li::after {\n'+
// '    border:0\n'+
// '}\n'+
// '.tree li:last-child::before {\n'+
// '    height:30px\n'+
// '}\n'+
// '.tree li.parent_li>span:hover' + 
// 	(TreeWidget.cssOptions.hoverChildren ? ', .tree li.parent_li>span:hover+ul li span ' : '') + 
// 	'{\n'+
// '    background:'+TreeWidget.cssOptions.hoverColor+';\n'+
// '    border:1px solid #94a0b4;\n'+
// '    color:#000\n'+
// '}\n'+
// '</style>'; 

// //install style (only once per DOM)
// jQuery(document.body).append(TreeWidget.CSS); 


})();


//now an example: 
// var model = {children: [
//     {label: '1',  children: [
//         {label: '1.1', id: '2234412', children: []}
//     ]}
// ,   {label: '2', children: [
//         {label: '2.1', children: []}
//     ]}
// ]};
// var widget = new TreeWidget(model);
// widget.render('#mytree');




/** 
@class TreeNode
*/
/**
@property label
@type String
*/
/**
@property tree_node_id
@type String
*/
/**
@property label
@type String
*/
/**
@property parentNode
@type TreeNode
*/