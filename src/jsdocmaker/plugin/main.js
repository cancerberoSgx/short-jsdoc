'strict mode'; 

var JsDocMaker = require('../core/main.js'); 

require('./native-types.js'); 
require('./modifiers.js'); 
require('./inherited.js');
require('./util.js');
require('./literal-object.js');
require('./module-exports.js');
require('./alias.js');
require('./comment-indentation.js');

require('./text-marks.js');

module.exports = JsDocMaker; 