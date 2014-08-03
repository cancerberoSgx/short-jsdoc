// nodejs command line utility for generating the .json definition scanning a given source folder or file. 
//depends on src/JsDocMaker.js

var fs = require('fs')
,	path = require('path')
,	esprima = require('esprima')
,	_ = require('underscore'); 

var JsDocMaker = this.JsDocMaker;
var ShortJsDocTypeParser = this.ShortJsDocTypeParser; 

var ShortJsDoc = function()
{
	this.maker = new JsDocMaker();
}; 
_(ShortJsDoc.prototype).extend({
	error: function (m)
	{
		console.log(m + '\nUSAGE:\n\tnode short'); 
		process.exit(1);
	}
,	main: function main()
	{
		if(process.argv.length < 3)
		{
			error('more parameters required'); 
		}
		var inputDir = process.argv[2]; 

		this.sources = this.buildSources(inputDir); 
		this.parsedSources = this.parseSources();

		var jsdoc = this.maker.data;

		this.maker.postProccess();
		// this.maker.postProccessBinding();
		
		console.log(JSON.stringify(jsdoc)); 
	}
,	parseSources: function()
	{
		var buffer = [];
		for (file in this.sources) 
		{
			buffer.push(this.sources[file]);
			// console.log('MAKER', this.maker.data)
		}
		this.maker.parseFile(buffer.join(''), 'ALL.js');
	}

,	buildSources: function buildSources(inputDir)
	{	
		var map = {};
		ShortJsDoc.folderWalk(inputDir, function(error, file)
		{
			if(!error && file && JsDocMaker.stringEndsWith(file, '.js'))
			{			
				var src = fs.readFileSync(file, 'utf8'); 
				map[file] = src; 
			}
		}); 
		return map;
	}
});


//UTILITIES
// @method folderWalk General function for walking a folder recusively and sync @static 
ShortJsDoc.folderWalk = function (dir, action) {
	// Assert that it's a function
	if (typeof action !== "function")
		action = function (error, file) { };

	// Read the directory

	var list = fs.readdirSync(dir);
	// fs.readdir(dir, function (err, list) {

	// Return the error if something went wrong
	// if (err)
	// return action(err);

	// For every file in the list
	list.forEach(function (file) {
		// Full path of that file
		var path = dir + "/" + file;
		// Get the file's stats
		var stat = fs.statSync(path); 
		// fs.stat(path, function (err, stat) {
		// console.log(stat);
		// If the file is a directory
		if (stat && stat.isDirectory())
			// Dive into the directory
			ShortJsDoc.folderWalk(path, action);
		else
			// Call the action
			action(null, path);
		// });
	});
	// });
};





var tool = new ShortJsDoc();
tool.main();
