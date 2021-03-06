'strict mode'; 

var JsDocMaker = require('../core/main.js'); 

// heads up ! the following require() list are our installed plugins !

require('./native-types.js'); 
require('./modifiers.js'); 
require('./inherited.js');
require('./util.js');
require('./literal-object.js');
require('./module-exports.js');
require('./alias.js');
// require('./metadata.js');
require('./comment-indentation.js');

require('./text-marks.js');
require('./text-marks-references.js');

require('./recurse-plugin-containers.js');
require('./escape-at.js');


require('./filter-by-child-annotations'); 


//tools
require('./dependencies.js'); //TODO: review, this probably makes compilation slower. 

module.exports = JsDocMaker; 