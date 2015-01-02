var ShortJsDoc = require('short-jsdoc');

var tool = new ShortJsDoc()
,	output_folder = 'jsdoc'
,	config = {};

tool.jsdoc(['./src'], output_folder, config); 