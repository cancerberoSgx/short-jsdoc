//@module shortjsdoc.html
//@class HierarchyTreeView display the full AST @extends AbstractView
var HierarchyTreeView = AbstractTreeView.extend({

	className: 'hierarchy-tree'

,	template: 'hierarchytree'

,	events: {
		'click [data-action="show-tree"]': 'showTree'
	,	'click [data-action="expand-all"]': 'expandAll'
	,	'click [data-action="collapse-all"]': 'collapseAll'
	}

,	renderIn: function()
	{
		AbstractView.prototype.renderIn.apply(this, arguments); 

		var rootNode = this.application.data.classes['javascript.Object'];
		if(!rootNode)
		{
			rootNode = {name:'Object'}; 
		}

		var a = this.classesExtendsFrom(rootNode);

		this.treeModel = this.buildTreeModel(rootNode);
		this.treeModel = {label: 'Something', children: [this.treeModel]}; // add an extra level so root class also appears

		this.treeView = new TreeWidget(this.treeModel);
		this.treeView.render('.the-tree');
		this.treeView.onNodeEvent('click', function(nodeModel)
		{
			alert(nodeModel.label+' was clicked'); 
		}); 

	}
	// @method classesExtendsFrom search for classes extending from given type. It taks in consideration native object type and normal types. 
	// @param {ASTNode} type @return {Array<ASTNode>}
,	classesExtendsFrom: function(type)
	{
		var a = [];
		_(this.application.data.classes).each(function(c)
		{
			if(!c.extends || !type){}
			else if(c.extends.absoluteName )
			{
				if(c.extends.absoluteName === type.absoluteName && c.absoluteName !== c.extends.absoluteName)
				{
					a.push(c); 
				}
			}
			else if(c.extends.name && c.name !== c.extends.name)
			{
				if(c.extends.name === type.name)
				{
					a.push(c); 
				}
			}
		}); 
		return a;
	}
	//@method buildTreeModel @return {children:Array,label:String} @param {ASTNode} node 
,	buildTreeModel: function(node)
	{
		if(!node) return [];
		var model = {
			children: []
		,	label: '<a href="' + this.makeLink(node) + '">' + (node.absoluteName || node.name) + '</a>'
		}
		,	self = this
		,	classesExtendsFrom = self.classesExtendsFrom(node); 

		_(classesExtendsFrom).each(function(c)
		{
			model.children.push(self.buildTreeModel(c)); 
		}); 

		return model;
	}

});







