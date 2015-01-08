'strict mode'; 

var JsDocMaker = require('./class'); 

require('./util'); 

require('./parse'); 

require('./preprocess'); 

require('./postprocess'); 

require('./binding'); 
require('./type-parsing'); 

module.exports = JsDocMaker;