var ApplicationView = AbstractView.extend({

	className: "application-view"

,	template: 'application'

,	initialize: function(application) 
	{
		this.application = application;
	}

,	renderIn: function($el)
	{
		AbstractView.prototype.renderIn.apply(this, arguments); 

		this.headerView = this.headerView || new HeaderView(this.application);
		this.headerView.renderIn(this.$('[data-type="header-container"]')); 

		this.mainView = this.application.currentView; 

		this.mainView.renderIn(this.$('[data-type="main-view-container"]')); 
	}

});