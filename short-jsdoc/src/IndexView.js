var IndexView = AbstractView.extend({

	// tagName: "div"
	className: "index-view"
// ,	events: {}

,	template: 'index'

,	initialize: function(application) {    
		this.application = application;
	}

,	render: function() {
		// var template = shortjsdoc.index; 
		// var html = template.apply(this, [this.application.data]); 
		// this.$el.html(html); 
	}

});