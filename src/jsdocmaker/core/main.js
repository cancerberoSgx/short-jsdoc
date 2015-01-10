'strict mode'; 

var JsDocMaker = require('./class'); 

require('./util'); 

require('./parse'); 

require('./preprocess'); 

require('./type-parsing'); 

require('./postprocess'); 

require('./binding'); 


module.exports = JsDocMaker;