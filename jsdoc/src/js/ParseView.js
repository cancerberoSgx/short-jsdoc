//@module shortjsdoc
//@class ParseView @extends AbstractView
var ParseView = AbstractView.extend({

	className: 'parse'

,	events: {
		'click [data-action="inputcode_doit"]': 'inputCodeDoit'
	}

,	template: 'parse'

,	inputCodeDoit: function()
	{
		var code = this.$('[data-type="inputcode"]').val();
		var maker = this.application.maker;
		maker.parseFile(code, 'textarea');		
		maker.postProccess();
		//console.log(JSON.stringify(maker.data));
		maker.postProccessBinding();
		this.application.refreshWithNewModel(maker.data);
		// 
	}

});