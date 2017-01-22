#!/usr/bin/env node
var _ = require('underscore')
var ShortJsDoc = require('../src/shortjsdoc.js')
var args = require('yargs').argv

_(ShortJsDoc.prototype).extend({

	//@method main do the job when invoked from command line like this: node src/shortjsdoc.js test/test-project/ > html/data.json
	main: function main()
	{
		var isValidCall = args.input && args.input.split(',').length;
		if(!isValidCall)
		{
			this.error('Invalid Call. Please use: \n\tshort-jsdoc --input some/folder --output jsdoc/output/folder'); 
		} 

		var config = {
			input: args.input.split(','),
			output: args.output,
			projectMetadata: args.projectMetadata,
			vendor: (args.vendor||'').split(','),
			dontMinifyOutput: args.dontMinifyOutput
		};

		ShortJsDoc.make(config)
	}

}); 


var tool = new ShortJsDoc();
tool.main();