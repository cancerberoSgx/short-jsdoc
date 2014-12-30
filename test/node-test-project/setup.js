var ShortJsDoc = require('short-jsdoc');

var tool = new ShortJsDoc();
tool.jsdoc(['./src'], 'jsdoc', {}); 

// console.log(ShortJsDoc.getHtmlFolder()); 