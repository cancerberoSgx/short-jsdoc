var SourcesView = AbstractView.extend({

	className: "sources"

,	template: 'sources'

,	events: {
		'click [data-type="goto-source"]': 'gotoSource'
	}

,	initialize: function(application, jsdoc)
	{
		this.application = application;
		this.jsdoc = jsdoc;
		this.allSource = this.application.maker.data.source; 

		var rangeRatio = 280;
		var rangeMin = Math.min(0, this.jsdoc.commentRange[0] - rangeRatio)
		var rangeMax = Math.min(this.allSource.length - 1, this.jsdoc.commentRange[1] + rangeRatio)
		this.sourceSubset = String.prototype.substring.apply(this.allSource, [rangeMin, rangeMax]);

		var jsdocSource = this.sourceSubset.substring.apply(this.sourceSubset, this.jsdoc.commentRange); 
		var previusSource = this.sourceSubset.substring(0, this.sourceSubset.indexOf(jsdocSource));
		var previusSourceLineCount = previusSource.split('\n').length; 

		this.jsdocLineNumber = previusSourceLineCount;
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
		,	$target = jQuery(jQuery(selector).get(this.jsdocLineNumber-1));
		if($target.size())
		{
			jQuery(window).scrollTop($target.position().top);
			$target.addClass('selectedJsDocLine'); 
		}
		else
		{
			console.log('empty: ', selector)
		}
	}
});