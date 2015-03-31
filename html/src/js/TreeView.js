//@module shortjsdoc.html
//@class IndexView display the full AST @extends AbstractView
var TreeView = AbstractTreeView.extend({

	className: 'tree'

,	template: 'tree'

,	events: {
		'click [data-action="show-tree"]': 'showTree'
	,	'click [data-action="expand-all"]': 'expandAll'
	,	'click [data-action="collapse-all"]': 'collapseAll'
	}

,	renderIn: function()
	{
		AbstractView.prototype.renderIn.apply(this, arguments); 

		// just show the tree
		this.treeModel = this.buildTreeModel(this.application.data);		
		this.treeView = new TreeWidget(this.treeModel);
		this.treeView.render('.the-tree');
		this.treeView.onNodeEvent('click', function(nodeModel)
		{
			alert(nodeModel.label+' was clicked'); 
		}); 
	}

,	buildTreeModel: function()
	{
		var model = {children: []}
		,	self = this
		,	data = this.application.data; 

		_(data.modules).each(function(m)
		{
			model.children.push(self.buildTreeModelForModule(m, data)); 
		}); 
		return model;
	}
,	buildTreeModelForModule: function(m, data)
	{
		var node = {
			children: []
		,	label: 'Module ' + this.makeLink(m, true)
		,	type: 'module'
		}
		,	self = this; 
		var classes = _(data.classes).filter(function(c){return c.module.name === m.name; }); 
		_(classes).each(function(c)
		{
			node.children.push(self.buildTreeModelForClass(c, data)); 
		}); 
		return node;
	}
,	buildTreeModelForClass: function(c, data)
	{
		var node = {
			children: []
		,	label: 'Class ' + this.makeLink(c, true)
		,	type: 'class'
		}
		,	self = this; 
		_(c.methods).each(function(m)
		{
			node.children.push(self.buildTreeModelForMethod(m, data)); 
		}); 
		_(c.properties).each(function(p)
		{
			node.children.push(self.buildTreeModelForProperty(p, data, 'Property')); 
		});  
		_(c.events).each(function(e)
		{
			node.children.push(self.buildTreeModelForProperty(e, data, 'Event')); 
		}); 
		return node;
	}

,	buildTreeModelForProperty: function(p, data, label)
	{
		var node = {
			children: []
		,	label: label + ' ' + this.makeLink(p, true)
		,	type: 'method'
		}; 
		return node;
	}

,	buildTreeModelForMethod: function(m, data)
	{
		var node = {
			children: []
		,	label: 'Method ' + this.makeLink(m, true)
		,	type: 'method'
		}
		,	self = this; 
		// if(m.returns)
		// {			
		// 	node.children.push({
		// 		children: []
		// 	,	label: 'Returns'
		// 	,	type: 'returns'
		// 	}); 	
		// }
		return node;
	}
});





