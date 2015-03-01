//@module shortjsdoc.html
//@class HeaderView @extends AbstractView
var HeaderView = AbstractView.extend({

	className: 'header-view'

,	template: 'header'

,	initialize: function(application) 
	{
		this.application = application;
	}
	
,	renderIn: function()
	{
		AbstractView.prototype.renderIn.apply(this, arguments); 
		this.installTypeAhead();
	}

,	installTypeAhead: function()
	{
		this.classes = this.application.data.classes;
		this.modules = this.application.data.modules;

		this.typeahead = $('.main-header .typeahead1').typeahead({
			hint: true,
			highlight: true,
			minLength: 1
		},	{
			name: 'jsdoc',
			displayKey: 'value',
			source: this.substringMatcher(),
			templates: {
				empty: '<div class="empty-message">Sorry, nothing found.</div>'
			,	suggestion: this.application.templates.typeaheadSuggestion
			}
		});

		var self = this;
		this.typeahead.on('typeahead:selected', function()
		{
			self.handleSearchSelection.apply(self, arguments);
		});

		if(jQuery(window).width()<400)
		{
			jQuery('.tt-dropdown-menu').css({width: jQuery(window).width()+'px'}); 
		}
		
	}

,	handleSearchSelection: function(event, object, dataset)
	{
		var href = this.makeLink(object.node);
		Backbone.history.navigate(href, {trigger: true}); 
	}

,	search: function(q)
	{
		var self=this,matches = []

		// regex used to determine if a string contains the substring `q`
		,	substrRegex = new RegExp(q, 'i');

		// iterate through the pool of strings and for any string that
		// contains the substring `q`, add it to the `matches` array
		_(self.classes).each(function (c)
		{
			if (substrRegex.test(c.name)) 
			{
				matches.push({ value: c.name, node: c });
			}
			_(c.methods).each(function (m)
			{
				if (substrRegex.test(m.name)) 
				{
					matches.push({ value: m.name, node: m });
				}
				
			}); 
		}); 

		_(self.modules).each(function (m)
		{
			if (substrRegex.test(m.name)) 
			{
				matches.push({ value: m.name, node: m });
			}
		}); 

		return matches;
	}

,	substringMatcher: function() 
	{
		var self = this;
		return function findMatches(q, cb) 
		{
			var matches;
			// an array that will be populated with substring matches
			matches = self.search(q);			
			cb(matches);
		};
	}

});
