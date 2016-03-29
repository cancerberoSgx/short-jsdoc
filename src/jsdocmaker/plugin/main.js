'strict mode'; 

var JsDocMaker = require('../core/main.js'); 

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

//tools
require('./dependencies.js');

module.exports = JsDocMaker; 