var ShortJsDoc = require('./src/shortjsdoc.js'); //can't install short-jsdoc with npm on itself so we require like this

ShortJsDoc.make({
	inputDirs: ['./src/', './html']
,	output: 'jsdoc'
,	projectMetadata: './package.json'
,	vendor: ['javascript', 'html', 'backbonejs', 'xml-dom']
}); 