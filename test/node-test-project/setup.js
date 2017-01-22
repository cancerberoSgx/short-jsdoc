var ShortJsDoc = require('short-jsdoc');

ShortJsDoc.make({
	input: ['./src']
,	output: 'jsdoc'
,	vendor: ['javascript', 'html', 'backbonejs', 'xml-dom']
}); 