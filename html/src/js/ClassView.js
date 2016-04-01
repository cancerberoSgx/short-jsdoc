//@module shortjsdoc.html
//@class ClassView @extends AbstractView

var ClassView = AbstractView.extend({

	className: 'class-view'

,	template: 'class'

,	initialize: function(application, className, options) 
	{
		var self = this;
		this.application = application;
		this.jsdoc = this.application.data.classes[className]; 
		if(!this.jsdoc)
		{
			this.resourceNotFound = true;
			return;
		}

		this.jsdoc.textHtml = this.getTextHtml(this.jsdoc);	

		this.options = options || {};
		this.options.inherited = this.options.inherited ? parseInt(this.options.inherited, 10) : 0;
		this.options.private = this.options.private ? parseInt(this.options.private, 10) : 0;
		this.options.text = this.options.text ? parseInt(this.options.text, 10) : 1;

		// calculate properties, events and attributes inheritance information
		this.methods = this.jsdoc.methods || {};
		this.properties = this.jsdoc.properties || {};
		this.events = this.jsdoc.events || {};
		this.attributes = this.jsdoc.attributes || {};
		
		if(this.options.inherited)
		{
			this.properties = _(_(this.properties).clone()).extend(this.jsdoc.inherited.properties); 
			this.events = _(_(this.events).clone()).extend(this.jsdoc.inherited.events); 
			this.attributes = _(_(this.attributes).clone()).extend(this.jsdoc.inherited.attributes); 
			this.methods = _(_(this.methods).clone()).extend(this.jsdoc.inherited.methods); 
		}

		//calculate properties, events and attributes respecting visibility (i.e. the user choose to see only public props)
		if(!this.options.private)
		{
			this.properties = _.filter(this.properties, this.propertyIsPublicPredicate);
			this.methods = _.filter(this.methods, this.propertyIsPublicPredicate);
			this.events = _.filter(this.events, this.propertyIsPublicPredicate);
			this.attributes = _.filter(this.attributes, this.propertyIsPublicPredicate);
		}
		this.hierarchy = this.computeHierarchy();
		this.knownSubclasses = this.computeKnownSubclasses();


		this.inlineProperties = true;  //TODO: configure / parametrize
		if(this.inlineProperties) 
		{
			this.inlineMethodViews = [];
			_(this.methods).each(function(node)
			{
				var view = new MethodView(self.application, node.absoluteName, true);
				view.render();
				self.inlineMethodViews.push(view);
			});

			this.inlinePropertyViews = [];
			_(this.properties).each(function(node)
			{
				var view = new PropertyView(self.application, node.absoluteName, 'property', true);
				view.render();
				self.inlinePropertyViews.push(view);
			});

			this.inlineEventViews = [];
			_(this.events).each(function(node)
			{
				var view = new PropertyView(self.application, node.absoluteName, 'event', true);
				view.render();
				self.inlineEventViews.push(view);
			});

			this.inlineAttributeViews = [];
			_(this.attributes).each(function(node)
			{
				var view = new PropertyView(self.application, node.absoluteName, 'attribute', true);
				view.render();
				self.inlineAttributeViews.push(view);
			});
		}
	}

,	afterRender: function()
	{
		var self = this;
		AbstractView.prototype.afterRender.apply(this, arguments);
		_.each(this.inlineMethodViews, function(v)
		{
			self.$('[data-type="inline-methods"]').append(v.$el);
		});
		_.each(this.inlinePropertyViews, function(v)
		{
			self.$('[data-type="inline-properties"]').append(v.$el);
		});
		_.each(this.inlineEventViews, function(v)
		{
			self.$('[data-type="inline-events"]').append(v.$el);
		});
		_.each(this.inlineAttributeViews, function(v)
		{
			self.$('[data-type="inline-attributes"]').append(v.$el);
		});
	}

,	propertyIsPublicPredicate: function(p)
	{
		return _.find(p.children, function(c)
		{
			return c.annotation === 'public';
		});
	}

	//@method makePartialText @param {AST} node @return {String}
,	makePartialText: function(node)
	{
		if(!node.text){return ''; }
		else
		{
			var min = Math.min(node.text.length, 100); 
			return node.text.substring(0, min) + '...'; 
		}		
	}

	//@method computeHierarchy @return {Array<ASTNode>}
,	computeHierarchy: function()
	{
		var hierarchy = [];
		var c = this.jsdoc;		
			do 
		{
			if(c && c.extends)
			{
				hierarchy.push(c);// = [c].concat(hierarchy);
				if(c.extends.absoluteName===c.absoluteName)
				{
					break;
				}

			}		
		}
		while( (c = c.extends) );	
		return hierarchy;
	}

	//@method computeKnownSubclasses @return {Array<ASTNode>}
,	computeKnownSubclasses: function()
	{
		var self = this;
		var knownSubclasses = [];
		_(this.application.data.classes).each(function(c)
		{
			if(c.extends.absoluteName === self.jsdoc.absoluteName)
			{
				knownSubclasses.push(c); 
			}
		}); 
		return knownSubclasses; 
	}

});