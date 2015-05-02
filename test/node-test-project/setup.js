var ShortJsDoc = require('short-jsdoc');

ShortJsDoc.make({
	inputDirs: ['./src']
,	output: 'jsdoc'
,	vendor: ['javascript', 'html', 'backbonejs', 'xml-dom']
}); 