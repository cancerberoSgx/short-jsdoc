// nodejs command line utility for generating the .json definition scanning a given source folder or file. 
//depends on src/JsDocMaker.js

var fs = require('fs')
,	path = require('path')
// ,	process = require('process')
,	esprima = require('esprima')
,	_ = require('underscore'); 


var JsDocMaker = this.JsDocMaker;
var ShortJsDocTypeParser = this.ShortJsDocTypeParser; 

var ShortJsDoc = function()
{
	this.maker = new JsDocMaker();
}; 

ShortJsDoc.prototype.error = function (m)
{
	console.log(m + '\nUSAGE:\n\tnode short'); 
	process.exit(1);
}; 


ShortJsDoc.prototype.main = function main()
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
}; 

ShortJsDoc.prototype.parseSources = function()
{
	for (file in this.sources) 
	{
		this.maker.parseFile(this.sources[file], file);
		// console.log('MAKER', this.maker.data)
	}
};

ShortJsDoc.prototype.buildSources = function buildSources(inputDir)
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
}; 

// test
/*
var code = 
	'//@class Machine @module office' + '\n' +
	'//@method calculate @param {Object<String,Array<Number>>} environment @final @static' + '\n' + 
	'//@property {Array<Eye>} eye' + '\n' +
	'//@class Eye a reutilizable eye @module office' + '\n' +
	''; 
var maker = new JsDocMaker();
maker.parseFile(code, 'genericstest1'); 
// maker.postProccess();
// maker.postProccessBinding();
// jsdoc = maker.data;

console.log(JSON.stringify(maker.data)); 
*/



//UTILITIES
// General function for walking a folder recusively and sync
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


/*
var loadJavaScript = function(file)
{
  var src = fs.readFileSync(path.join(__dirname, file),'utf8'); 
  eval(src); 
  console.log(path.join(__dirname, file)); 
};
loadJavaScript('../src/typeParser.js');
loadJavaScript('../src/JsDocMaker.js'); 
*/
