
/* @module shortjsdoc.node
nodejs command line utility for generating the .json definition scanning a given source folder or file. 

Depends on src/JsDocMaker.js

*IMPORTANT* don't use console.log here since the output is dumped to stdout 
*/
var fs = require('fs')
,	path = require('path')
,	esprima = require('esprima')
,	_ = require('underscore')
,	JsDocMaker = require('./jsdocmaker/main.js')
,	shell = require('shelljs'); 

 
//@class ShortJsDoc main class for running jsdocmaker using node through the command line.
var ShortJsDoc = function()
{
	this.maker = new JsDocMaker();
	this.projectMetadata = {jsdoc: {}};
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

		_(options.input).each(function(inputDir)
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
			console.error('There is JavaScript syntax error in your source. It cannot be parsed'); 
			//TODO: file and line number and string

			console.error('Failing code fragment: \n', this.maker.data.source.substring(ex.index - 50, ex.index + 50)); 

			fs.writeFileSync('jsdoc_failed_source.js', this.maker.data.source);
			console.log('\n * Dumped file that fails at jsdoc_failed_source.js * \n');
			
			console.error(ex); 
			throw ex;
		}

		var jsdoc = this.maker.data;

		this.projectMetadata = jsdoc.projectMetadata = options.projectMetadata || {name: 'Untitled Project'};

		this.maker.postProccess();
		
		return jsdoc;
	}

	//@method computeVendorDirs @param {JsDocOptions} options
,	computeVendorDirs: function(options)	
	{
		_(options.vendor).each(function(vendorName)
		{
			if(!vendorName)
			{
				return
			}
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
				options.input.push(f);
			}
		});
		// console.log('options.vendor', options.vendor)
	}

	//@method jsdoc public method meant to be called from user projects build-time code. It will perform all the job of soing the parse and generating a full html output project ready to be used. 
	//@param {JsDocOptions}options meta information about the project like title, url, license, etc. Hsa the same format as package.json file
,	jsdoc: function(options)
	{
		//generate the data.json file

		var jsdoc = this.execute(options); 
		var output = this.dumpJSON(jsdoc, options);

		if(!options.jsonOuput && options.output)
		{			
			shell.rm('-rf', options.output)
			var htmlFolder = ShortJsDoc.getHtmlFolder();
			shell.cp('-rf', htmlFolder, options.output);
			// ShortJsDoc.copyRecursiveSync(htmlFolder, options.output); 
			var f = path.join(options.output, 'data.json'); 
			output = 'window.__shortjsdoc_data = ' + output;
			fs.writeFileSync(f, output); 
		}
		else
		{
			console.log(output); // prints on stdout
		}

	} 

	// @method dumpJSON dump to json string the full ast. configurable through this.projectMetadata.jsdoc.dontMinifyOutput
,	dumpJSON: function(jsdoc, options) 
	{
		if(options && options.dontMinifyOutput)
		{		
			return JSON.stringify(jsdoc, null, 4); // dump the output indented:
		}
		else
		{
			return JSON.stringify(jsdoc); // dump the output minified:
		}
	}

	//@method parseSources
,	parseSources: function()
	{
		var buffer = [], self = this; 

		_(this.sources).each(function(val, file)
		{
			self.maker.addFile(val, file); 
		}); 
		this.maker.jsdoc();
	}

	//@method __parseSourcesFastVersion this was the previous implementation without file separation support. Nevertheless we 
	// let this uncommented and unused because parsing separate files introduced a significant parsing duration (parformance). 
	// TODO. let the user performa a --fast-parsing not supporting files but much faster just for fast jsdoc writting..
,	__parseSourcesFastVersion: function()
	{
		var buffer = [], self = this; 

		_(this.sources).each(function(val, file)
		{
			maker.addFile(value, name);
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
		if(!inputDir)
		{
			console.log('ERROR invalid null input directory'); 
			return;
		}
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
ShortJsDoc.folderWalk = function (dir, action) 
{
	if (typeof action !== "function")
	{
		action = function (error, file) { };
	}	

	var list = fs.readdirSync(dir);

	list.forEach(function (file) 
	{
		var sep = JsDocMaker.stringEndsWith(dir, '/') ? '' : '/'; 
		var path =  dir + sep + file;
		var stat = fs.statSync(path); 
		if (stat && stat.isDirectory())
		{
			ShortJsDoc.folderWalk(path, action);
		}			
		else
		{
			action(null, path);
		}
	});
};

// // @method copyRecursiveSync copy directories recursively just like cp -r @static
// // @param {String} src The path to the thing to copy.
// // @param {String} dest The path to the new copy. 
// ShortJsDoc.copyRecursiveSync = function(src, dest) 
// {
// 	var exists = fs.existsSync(src);
// 	var stats = exists && fs.statSync(src);
// 	var isDirectory = exists && stats.isDirectory();
// 	if (exists && isDirectory) 
// 	{
// 		fs.mkdirSync(dest);
// 		fs.readdirSync(src).forEach(function(childItemName) 
// 		{
// 			ShortJsDoc.copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
// 		});
// 	} 
// 	else 
// 	{
// 		fs.linkSync(src, dest);
// 	}
// };

ShortJsDoc.JsDocMaker = JsDocMaker;

module.exports = ShortJsDoc;



// @class JsDocOptions
// @property {String} output output folder
// @property {Array<String>} input the source code folders that will be parsed recursively.
// @property {Array<String>} vendor include the jsdoc of libraries supported by short-jsdoc (see vendor-jsdoc folder). Example: vendor: ['javascript', 'html']

