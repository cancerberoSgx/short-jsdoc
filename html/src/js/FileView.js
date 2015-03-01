//@module shortjsdoc.html
//@class ClassView @extends AbstractView

var FileView = AbstractView.extend({

	className: 'file-view'

,	template: 'file'

,	events: {
		'click [data-action="donwload"]': 'download'
	}

,	initialize: function(application, fileName, options) 
	{

		this.fileName = decodeURIComponent(fileName); 
		
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

,	afterRender: function()
	{
		if(typeof prettyPrint !== 'undefined') 
		{
			prettyPrint();
		}
	}

,	download: function()
	{
		var fileName = this.fileName.split('/');
		fileName = fileName[fileName.length-1]; 
		var a = document.createElement('a');
		var blob = new Blob([this.fileContent], {'type': 'text/javascript'});
		a.href = window.URL.createObjectURL(blob);
		a.download = fileName;
		a.click();
	}
});
