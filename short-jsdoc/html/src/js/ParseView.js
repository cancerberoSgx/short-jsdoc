var ParseView = AbstractView.extend({

	className: "parse"

,	events: {
		'click [data-action="inputcode_doit"]': 'inputCodeDoit'
	}

,	template: 'parse'

,	inputCodeDoit: function()
	{
		var code = this.$('[data-type="inputcode"]').val();

		jsindentator.setStyle(jsindentator.styles.jsdocgenerator1);

		var result = jsindentator.main(code, {});
		if(result instanceof Error) 
		{
			alert('ERROR: Given javascript couldn\'t be parsed!, reason: '+result); 
			return;
		}
		
		this.application.refreshWithNewModel(jsindentator.styles.jsdocgenerator1.jsdocClasses);
	}

});