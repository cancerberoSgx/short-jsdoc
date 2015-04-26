//@module shortjsdoc.html
//@class SearchView @extends AbstractView

var SearchView = AbstractView.extend({

	className: 'search-view'

,	template: 'search'

,	events: {
		'click [data-action="search"]': 'searchActionHandler'
	}

,	initialize: function(application, options) 
	{
		this.application = application;
		this.jsdoc = this.application.data;

		var self = this;
		// @property {SearchView.Query} query;
		this.query = options; 
		this.search(function(results)
		{
			// @property {Array<SearchView.Result>} results
			self.results = results;
			// debugger;
			self.render();
		});
	}

,	formToJson: function(form)
	{
		var s = jQuery(form).serialize(); 
		var a = s.split('&')
		var obj = {};
		_(a).each(function(b)
		{
			var c = b.split('=');
			obj[c[0]] = c[1]; 
		}); 
		return obj;
	}

,	searchActionHandler: function(e)
	{
		var options = this.$('[data-type="search-form"]').serialize();
		Backbone.history.navigate('search?'+options, {trigger: true});//, {replace: true}); 
		// var query = this.formToJson(this.$('[data-type="search-form"]'));
		// var results = this.doSearch(query);
		e.preventDefault();
	}

,	search: function(cb)
	{
		if(!this.query.keywords)
		{
			return;
		}

		var self = this, results = {}
		,	keywordsCompare = self.query.keywords.toLowerCase()
		,	nodeVisitor = function(node){}; 

		var typeVisitor = function(type, ownerNode)
		{
			var typeName = type.absoluteName ? type.absoluteName : type.name; 

			if(!typeName || ! ownerNode)
			{
				return;
			}

			var typeName = typeName.toLowerCase();
			if(typeName && typeName.indexOf(keywordsCompare) !== -1)
			{
				var label, url, ownerNodeId;
				if(ownerNode.annotation==='param')
				{
					ownerNodeId = ownerNode.parentNode.absoluteName + '.' + ownerNode.name;
					label = 'parameter \'' + ownerNode.name + '\' of method \'' + 
						ownerNode.parentNode.absoluteName + '\''; 
					url = self.makeLink(ownerNode.parentNode);
				}
				else
				{
					ownerNodeId = ownerNode.absoluteName;
					label = ownerNode.annotation /*+ ' ' + ownerNode.name + ' of ' + 
						ownerNode.annotation */ + ' \'' + ownerNode.absoluteName + '\''; 	
					url = self.makeLink(ownerNode);
				}
				results[ownerNodeId] = {
					label: label
				,	url: url
				}
			}
		}; 

		var endCallback = function()
		{
			var nodeVisitorArray =[];
			_(results).each(function(val)
			{
				nodeVisitorArray.push(val)
			}); 
			cb(nodeVisitorArray); 
		}

		this.application.maker.recurseAST(nodeVisitor, typeVisitor, endCallback); 

	}

});

// @class SearchView.Query @property {String} keywords 
// @property {Boolean} types will list method and properties that reference given type 
// @property {String} match can be 'contains', 'exactly', 'regexp' - default: 'contains'