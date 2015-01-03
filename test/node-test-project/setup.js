var ShortJsDoc = require('short-jsdoc');

var tool = new ShortJsDoc()

tool.jsdoc({
	inputDirs: ['./src']
,	output: 'jsdoc'
}); 