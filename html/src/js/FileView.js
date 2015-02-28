//@module shortjsdoc.html
//@class ClassView @extends AbstractView

var FileView = AbstractView.extend({

	className: 'file-view'

,	template: 'file'

,	initialize: function(application, fileName, options) 
	{

		fileName = decodeURIComponent(fileName); 
		
		this.application = application;
		this.jsdoc = this.application.data.files[fileName]; 
		if(!this.jsdoc)
		{
			this.resourceNotFound = true;
			return;
		}
		var end = this.application.data.source.indexOf('@filename', this.jsdoc.commentRange[1]); 
		end = end === -1 ? this.application.data.source.length : end; 
		this.fileContent = this.application.data.source.substring(this.jsdoc.commentRange[1], end);
	}

});