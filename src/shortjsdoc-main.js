// nodejs command line utility for generating the .json definition scanning a given source folder or file. 
//depends on src/JsDocMaker.js

var fs = require('fs')
,	path = require('path')
,	esprima = require('esprima')
,	_ = require('underscore'); 

var JsDocMaker = this.JsDocMaker;
var ShortJsDocTypeParser = this.ShortJsDocTypeParser; 
 
//@class ShortJsDoc main class for running jsdocmaker using node through the command line.
var ShortJsDoc = function()
{
	this.maker = new JsDocMaker();
}; 

_(ShortJsDoc.prototype).extend({

	//@method error
	error: function (m)
	{
		console.log(m + '\nUSAGE:\n\tnode src/shortjsdoc.js home/my-js-project/ home/another-js-project/ ... > html/data.json'); 
		process.exit(1);
	}

	//@method main
,	main: function main()
	{
		var argNUmber = process.argv[0].indexOf('node')===-1 ? 1 : 2; 

		if(process.argv.length < argNUmber+1)
		{
			error('more parameters required'); 
		}

		this.sources = {}; 
		var self=this
		,	inputDirs = _(process.argv).toArray().slice(argNUmber, process.argv.length);
		_(inputDirs).each(function(inputDir)
		{
			_(self.sources).extend(self.buildSources(inputDir)); 
		}); 

		this.parsedSources = this.parseSources();

		var jsdoc = this.maker.data;

		this.maker.postProccess();
		// this.maker.postProccessBinding();
		
		console.log(JSON.stringify(jsdoc, null, 4)); 
	}

	//@method parseSources
,	parseSources: function()
	{
		var buffer = [];
		_(this.sources).each(function(val, file)
		{
			buffer.push(val);
		}); 
		this.maker.parseFile(buffer.join('\n\n'), 'ALL.js');
	}

	//@method buildSources
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
	{
		action = function (error, file) { };
	}
		

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
		{
			// Dive into the directory
			ShortJsDoc.folderWalk(path, action);
		}			
		else
		{
			// Call the action
			action(null, path);
		}			
		// });
	});
	// });
};





var tool = new ShortJsDoc();
tool.main();
