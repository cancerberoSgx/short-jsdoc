//@module ideal
//@class BaseObject 
//@property {Date} creationDate
//@property {String} name
//@property {String} description
//@property {Object<String,User>} owners the owners, a map by owner id
function BaseObject(){};

//@class ObjectPool
function ObjectPool(){};
//@method loadObjects @param {Array<String>} objects_ids @return {Object<String,BaseObject>}
ObjectPool.prototype.getOwners = function(objects_ids){return null;}
//@method getOwners this method is useful for *blabla* blabla _blabla_ bab
/*@param {Array<String>} objects_ids @return {Object<String,Object<String,User>>}*/

//@event objectCreated event fired when an object is created in this pool.

//@class Thing @extends BaseObject
//@property {Number} importance

/** @class Action @extends BaseObject */