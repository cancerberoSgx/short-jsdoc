//@class BaseObject @module ideal
//@property {Date} creationDate
//@property {String} name
//@property {String} description
//@property {Object<String,User>} owners the owners, a map by owner id

//@class ObjectPool
//@method loadObjects @param {Array<String>} objects_ids @return {Object<String,BaseObject>}
//@method getOwners @param {Array<String>} objects_ids @return {Object<String,Object<String,User>>}

//@class Thing @extends BaseObject
//@property {Number} importance

/** @class Action @extends BaseObject */