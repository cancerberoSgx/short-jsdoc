var HeaderView = AbstractView.extend({

	className: "header-view"

,	template: 'header'

,	initialize: function(application) 
	{
		this.application = application;
	}
,	render: function()
	{
		// this.$el = this.application.$mainHeader; 
		var template = this.application.templates[this.template]; 

		var html = template.apply(this, []); 
		this.$el.html(html);
		this.application.$mainHeader.empty().append(this.$el); 

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
			// source: substringMatcher(states)
			source: this.substringMatcher()
		});

		var self = this;
		this.typeahead.on('typeahead:selected', function()
		{
			self.handleSearchSelection.apply(self, arguments)
		});
	}

,	handleSearchSelection: function(event, object, dataset)
	{
		
	}

,	substringMatcher: function(strs) {
		var self = this;
		return function findMatches(q, cb) 
		{
			var matches, substrRegex;
			// an array that will be populated with substring matches
			matches = [];

			// regex used to determine if a string contains the substring `q`
			substrRegex = new RegExp(q, 'i');

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
					matches.push({ value: m.name, node: m });
				}); 
			}); 

			_(self.modules).each(function (m)
			{
				if (substrRegex.test(m.name)) 
				{
					matches.push({ value: m.name, node: m });
				}
			}); 

			cb(matches);
		};
	}

});
