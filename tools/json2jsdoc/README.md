#Introduction

The idea is to generate jsdoc annotations automatically from json input so we can auto document data objects automatically. It is supported a certain degree of configuration about how a json is described with jsdoc. 

#Usage Examples

	node json2jsdoc --file customer1.json --config config1.json

	curl http://localhost/myapp/service | node json2jsdoc --config config1.json

--config is optional. If --file is not passed then we consume json from stdin


#Code Example

For the json

	{
		"name": "Alberta Gomez"
	,	"tools": [{"name":"hammer","weight":2.32},{"name":"pencil","weight":0.2}]
	,	"female": true
	,	"car": {"color": {"red":1,"green":44,"blue":222},"branch":"fiat"}
	}

will generate

	/*

	@class Person
	@property {String} name
	@property {Array<PersonTools>} tools
	@property Boolean female
	@property PersonCar car

	@class PersonTools
	@property {String} name
	@property {Number} weight

	@class PersonCar
	@property {PersonCarColor} color
	@property {String}branch

	@class PersonCarColor
	@property {String} red
	@property {String} green
	@property {String} blue

	*/



#ISSUES: 
 * not adding the original class annotation to 'come back to talk about the parent'
 * array of object not printing children objects. 