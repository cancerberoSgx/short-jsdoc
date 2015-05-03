//@module shortjsdoc.html
//@class IndexView display the full AST @extends AbstractView
var DependenciesView = AbstractView.extend({

	className: 'dependencies'

,	template: 'dependencies'

,	events: {
		'click [data-type="includeExtends"]': 'includeExtends'
	,	'click [data-type="includeNativeClasses"]': 'includeNativeClasses'
	}

,	initialize: function(application, options)
	{
		this.application = application; 
		this.options = options || {}; 
		this.options.includeExtends = this.options.includeExtends && this.options.includeExtends!=='0'; 
		this.options.includeNativeClasses = this.options.includeNativeClasses && this.options.includeNativeClasses!=='0'; 

		this.ignoreClasses = this.options.includeNativeClasses ? [] : [
			'javascript.String'
		,	'javascript.Object'
		,	'javascript.Function'
		,	'javascript.Any'
		,	'javascript.Number'
		,	'javascript.Boolean'
		,	'javascript.Array'
		]; 
	}

,	renderIn: function()
	{
		var self = this; 
		AbstractView.prototype.renderIn.apply(this, arguments); 

		toast(
			'lib/vis/dist/vis.min.js'
		,	'lib/vis/dist/vis.min.css'
		,	function()
			{
				self.doTheGraph();
			}
		); 
	} 

	//TODO repeated code
,	includeExtends: function()
	{
		var checked = this.$('[data-type="includeExtends"]').is(':checked');		
		var options = this.getOptionsFromHash();
		options.includeExtends = checked ? '1' : '0';
		var url = 'dependencies?' + this.optionsToString(options); 
		Backbone.history.navigate(url, {trigger: true}); 
	}

	//TODO repeated code
,	includeNativeClasses: function()
	{
		var checked = this.$('[data-type="includeNativeClasses"]').is(':checked');		
		var options = this.getOptionsFromHash();
		options.includeNativeClasses = checked ? '1' : '0';
		var url = 'dependencies?' + this.optionsToString(options); 
		Backbone.history.navigate(url, {trigger: true}); 
	}

,	doTheGraph: function()
	{
		this.$('.loading-message').show();
		var toolConfig = {
				ignoreClasses: this.ignoreClasses
			,	includeExtends: this.options.includeExtends
			}
		,	tool = new this.application.maker.tools.DependencyTool(this.application.maker, toolConfig); 

		tool.calculateClassDependencies();

		// this.application.maker.calculateClassDependencies();
		var self = this, nodes = [], edges = []; 

		var counter = 1, nodeIds = {};
		_(this.application.data.classes).each(function(c)
		{
			var node = {id: counter, label: c.name}; 
			nodes.push(node); 
			nodeIds[c.absoluteName] = node; 
			counter++; 
		}); 
		_(this.application.data.classes).each(function(c)
		{
			_(c.dependencies.classes).each(function(dep)
			{
				// debugger;
				if(nodeIds[c.absoluteName] && nodeIds[dep.absoluteName])
				{				
					edges.push({
						from: nodeIds[c.absoluteName].id
						, to: nodeIds[dep.absoluteName].id
					}); 	
				}
			}); 
		}); 

		// create a vis network graph
		var container = this.$('[data-type="dependency-graph"]').get(0); 
		var data = {
			nodes: nodes,
			edges: edges
		};

		var options = {
			nodes: {
				shape: 'box'
			}
		,	edges: {
				style: 'arrow'
			}
		};

		var network = new vis.Network(container, data, options);

		this.$('.loading-message').hide();
	}

});





