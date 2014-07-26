var ParseView = AbstractView.extend({

	className: "parse"

,	events: {
		'click [data-action="inputcode_doit"]': 'inputCodeDoit'
	}

,	template: 'parse'

,	inputCodeDoit: function()
	{
		var code = this.$('[data-type="inputcode"]').val();
		var maker = this.application.maker;
		maker.parseFile(code, 'textarea');
		this.application.refreshWithNewModel(maker.data);
	}

});