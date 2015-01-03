// @module shortjsdoc.node
// nodejs command line utility for generating the .json definition scanning a given source folder or file. 
// depends on src/JsDocMaker.js
// Please don't use console.log here since the output is dumped to stdout 

var fs = require('fs')
,	path = require('path')
,	esprima = require('esprima')
,	_ = require('underscore')
,	argv = require('yargs').argv;

var JsDocMaker = this.JsDocMaker;
 
//@class ShortJsDoc main class for running jsdocmaker using node through the command line.
var ShortJsDoc = function()
{
	this.maker = new JsDocMaker();
	this.sources = {};
}; 

ShortJsDoc.make = function(options)
{
	return (new ShortJsDoc()).jsdoc(options); 
}; 

_(ShortJsDoc.prototype).extend({

	//@method error dumps an error @param {String} m
	error: function (m)
	{
		console.log(m + '\nUSAGE:\n\tnode src/shortjsdoc.js home/my-js-project/ home/another-js-project/ ... > html/data.json'); 
		process.exit(1);
	}

	//@method main do the job when invoked from command line like this: node src/shortjsdoc.js test/test-project/ > html/data.json
,	main: function main()
	{
		if(!ShortJsDoc.isValidMainCall())
		{
			this.error('more parameters required'); 
		} 

		var inputDirs = argv.input.split(','); 

		var jsdoc = this.execute({
			inputDirs: inputDirs
		,	projectMetadata: argv.projectMetadata
		});

		// dump the output indented:
		// console.log(JSON.stringify(jsdoc, null, 4)); 

		// dump the output minified:
		console.log(JSON.stringify(jsdoc)); 
	}

	// @method tryToParseJsonFile @param {String} path
,	tryToParseJsonFile: function(path)
	{
		try
		{
			var s = fs.readFileSync(path); 
			return JSON.parse(s); 
		}
		catch(ex)
		{
			return null;
		}
	}

	//@method execute MAIN method to parse the parsed folder's javascript files recursively and return the AST of the jsdoc. 
	//@param {JsDocOptions}options meta information about the project like title, url, license, etc. Hsa the same format as package.json file
	//@return {Object} the jsdoc AST object of all the parsed files. 
,	execute: function(options)
	{
		var self=this; 

		this.computeVendorDirs(options);

		_(options.inputDirs).each(function(inputDir)
		{
			_(self.sources).extend(self.buildSources(inputDir)); 
		}); 

		this.parsedSources = null;
		
		try
		{
			parsedSources = this.parseSources();
		}
		catch (ex)
		{
			// will print the javascript syntax error detected in the sources. we parse only valid js!
			console.error(ex); 
			throw ex;
		}

		var jsdoc = this.maker.data;
		if(options.projectMetadata)
		{
			var parsed = this.tryToParseJsonFile(options.projectMetadata);

			if (parsed)
			{
				jsdoc.projectMetadata = parsed;
			}
		}

		this.maker.postProccess();
		
		return jsdoc;
	}

	//@method computeVendorDirs @param {JsDocOptions} options
,	computeVendorDirs: function(options)	
	{
		_(options.vendor).each(function(vendorName)
		{
			var f = path.join(ShortJsDoc.getThisFolder(), 'vendor-jsdoc', vendorName); 
			var stats = null;
			try
			{
				stats = fs.statSync(f);
			}
			catch(ex)
			{
				// console.log(ex)
				//TODO: log vendor name nor found?
			}
			if(stats && (stats.isDirectory() || stats.isFile()))
			{			
				options.inputDirs.push(f);
			}
		});
	}

	//@method jsdoc public method meant to be called from user projects build-time code. It will perform all the job of soing the parse and generating a full html output project ready to be used. 
	//@param {JsDocOptions}options meta information about the project like title, url, license, etc. Hsa the same format as package.json file
,	jsdoc: function(options)
	{
		//copy html folder
		try
		{
			var del = require('del').sync; 
			del(options.output); 
		}
		catch(ex)
		{
			
		}
		var htmlFolder = ShortJsDoc.getHtmlFolder();
		ShortJsDoc.copyRecursiveSync(htmlFolder, options.output); 

		//generate the data.json file
		var jsdoc = this.execute(options); 
		var f = path.join(options.output, 'data.json'); 
		fs.writeFileSync(f, JSON.stringify(jsdoc)); 
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

	//@method buildSources parse all files in passed folders and returns the parsed results in t
	//@param Array<String> inputDir @returns {Object} the parsed jsdoc AST object of all passed folders
,	buildSources: function buildSources(inputDir)
	{	
		var map = {}
		,	self = this;
		if(!fs.statSync(inputDir).isDirectory())
		{
			self.readSource(inputDir, map);
		}
		else
		{			
			ShortJsDoc.folderWalk(inputDir, function(error, file)
			{
				if(!error && file && JsDocMaker.stringEndsWith(file, '.js'))
				{			
					self.readSource(file, map);
				}
			}); 
		}
		return map;
	}

	//@method readSource @param file @param map
,	readSource: function(file, map)
	{
		var src = fs.readFileSync(file, 'utf8'); 
		map[file] = src; 
	}

});

//@method isValidMainCall @static
ShortJsDoc.isValidMainCall = function()
{
	// var argNumber = process.argv[0].indexOf('node')===-1 ? 1 : 2; 
	// return process.argv.length >= argNumber + 1; 
	return argv.input && argv.input.split(',').length;
}; 

//@method getHtmlFolder @return {String} this module's html folder path @static
ShortJsDoc.getHtmlFolder = function()
{
	var f = ShortJsDoc.getThisFolder();
	return path.join(f, 'html');
}; 
//@method getThisFolder @return {String} this module's folder path @static
ShortJsDoc.getThisFolder = function()
{
	var f = module.filename; 
	f = f.substring(0, f.length - path.join('src','shortjsdoc.js').length);
	return f;
}; 



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

// @method copyRecursiveSync copy directories recursively just like cp -r @static
// @param {String} src The path to the thing to copy.
// @param {String} dest The path to the new copy. 
ShortJsDoc.copyRecursiveSync = function(src, dest) 
{
	var exists = fs.existsSync(src);
	var stats = exists && fs.statSync(src);
	var isDirectory = exists && stats.isDirectory();
	if (exists && isDirectory) 
	{
		fs.mkdirSync(dest);
		fs.readdirSync(src).forEach(function(childItemName) 
		{
			ShortJsDoc.copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
		});
	} 
	else 
	{
		fs.linkSync(src, dest);
	}
};



if(ShortJsDoc.isValidMainCall())
{	
	var tool = new ShortJsDoc();
	tool.main();	
} 

ShortJsDoc.JsDocMaker = JsDocMaker;

module.exports = ShortJsDoc;



// @class JsDocOptions
// @property {String} output output folder
// @property {Array<String>} inputDirs the source code folders that will be parsed recursively.
// @property {Array<String>} vendor include the jsdoc of libraries supported by short-jsdoc (see vendor-jsdoc folder). Example: vendor: ['javascript', 'html']