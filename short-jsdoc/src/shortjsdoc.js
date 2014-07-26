// nodejs command line utility for generating the .json definition scanning a given source folder or file. 


var fs = require('fs'); 
var path = require('path');

//@function loadJavaScript @param {String} file @param {String} globalName the returned name @return the value of the globalName reference after the js code is executed. 
var loadJavaScript = function(file, globalName)
{

	var src = fs.readFileSync(path.join(__dirname, file),'utf8'); 
	eval(src); 
	console.log(path.join(__dirname, file)); 
	// return globalName; 

	// var s = '(function(){' + src + '; return ' + globalName + ';})'; 	
	// var fn = eval(s); 
	
	// var val = fn();
	// return val;
};


loadJavaScript('../lib/underscore.js', '_'); 

console.log('__dirname', __dirname, typeof _ ); 