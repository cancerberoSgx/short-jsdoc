var ShortJsDoc = require('short-jsdoc');

ShortJsDoc.make({
	inputDirs: ['./src/JsDocMaker.js', './html']
,	output: 'jsdoc'
,	vendor: ['javascript', 'html', 'backbonejs', 'xml-dom']
}); 