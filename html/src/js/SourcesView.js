//@module shortjsdoc.html
//@class SourcesView @extends AbstractView
var SourcesView = AbstractView.extend({

	className: 'sources'

,	template: 'sources'

,	events: {
		'click [data-type="goto-source"]': 'gotoSource'
	}

,	initialize: function(application, jsdoc)
	{
		this.application = application;
		this.jsdoc = jsdoc;
		this.allSource = this.application.maker.data.source; 

		var rangeRatio = 400;
		var rangeMin = Math.max(0, this.jsdoc.commentRange[0] - rangeRatio);
		var rangeMax = Math.min(this.allSource.length - 1, this.jsdoc.commentRange[1] + rangeRatio);
		this.sourceSubset = this.allSource.substring(rangeMin, rangeMax);
		var jsdocSource = this.allSource.substring(this.jsdoc.commentRange[0], this.jsdoc.commentRange[1]); 
		var previusSource = this.sourceSubset.substring(0, this.sourceSubset.indexOf(jsdocSource));
		var previusSourceLineCount = previusSource.split('\n').length; 

		this.jsdocLineNumber = previusSourceLineCount - 1;

		this.lineCount = jsdocSource.split('\n').length; 

		//TODO: count the lines of the comment and show all the lines - not only the first one
	}

,	afterRender: function()
	{
		if(typeof prettyPrint !== 'undefined') 
		{
			prettyPrint();
		}
	}

,	gotoSource: function()
	{
		var selector = 'ol.linenums>li'
		,	$target = jQuery(jQuery(selector).get(this.jsdocLineNumber));
		if($target.size())
		{
			jQuery(window).scrollTop($target.position().top);
			$target.addClass('selectedJsDocLine'); 
		}

		for (var i = 0; i < this.lineCount; i++) 
		{
			$target = jQuery(jQuery(selector).get(this.jsdocLineNumber+i));
			$target.addClass('selectedJsDocLine'); 
		}
	}
});